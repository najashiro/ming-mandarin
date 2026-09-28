import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { vocabularyMedia, imageForWord } from '@/lib/vocabulary-media';
import { effectiveImageStatus, type ImageReviewRow } from '@/lib/vocabulary-image-review';
vi.mock('server-only', () => ({}));
vi.mock('@/lib/server/api', () => ({ ApiError: class extends Error { constructor(public status: number, message: string) { super(message); } } }));
const rest = vi.hoisted(() => vi.fn());
vi.mock('@/lib/supabase/rest', () => ({ supabaseRest: rest }));
import { listVocabularyImageReviews, publishedVocabularyMedia, updateVocabularyImageReview, regenerationQueue } from '@/lib/server/vocabulary-images';

const image = vocabularyMedia.find(item => item.wordId === 'v-进')!;
let rows: ImageReviewRow[];
let offline: boolean;
beforeEach(() => {
  rows = []; offline = false; rest.mockReset();
  rest.mockImplementation(async (path: string, options?: { body: Record<string, unknown> }) => {
    if (offline) throw new Error('offline');
    if (path.startsWith('vocabulary_image_reviews?')) return structuredClone(rows);
    const b = options!.body;
    const previous = rows.find(row => row.word_id === b.p_word_id);
    if ((previous?.revision ?? 0) !== b.p_expected_revision) return { conflict: true };
    const row = {word_id: b.p_word_id, status: b.p_status, prompt: b.p_prompt,
      asset_sha256:b.p_asset_sha256,prompt_sha256:b.p_prompt_sha256,
      revision:Number(b.p_expected_revision)+1, reviewed_at:new Date().toISOString()} as ImageReviewRow;
    rows = [...rows.filter(item => item.word_id !== row.word_id), row];
    return { row };
  });
});
const input = (action: string, revision=0) => ({wordId:image.wordId,action,assetSha256:image.sha256,revision});

describe('image decisions persist and reach the public cards', () => {
  it('approves a pending static entry and remains visible after reload', async () => {
    expect(imageForWord(image.wordId,await publishedVocabularyMedia())).toBeUndefined();
    await updateVocabularyImageReview('reviewer',input('approve'));
    expect(imageForWord(image.wordId,await publishedVocabularyMedia())?.status).toBe('approved');
    expect((await listVocabularyImageReviews()).entries.find(e=>e.wordId===image.wordId)?.reviewStatus).toBe('approved');
    await updateVocabularyImageReview('reviewer',input('no_image',1));
    expect(imageForWord(image.wordId,await publishedVocabularyMedia())).toBeUndefined();
  });
  it('stores a corrected prompt, exports it and forbids approval of the old photo', async () => {
    const prompt='A complete new transparent subject, unmistakably entering through a doorway.';
    const result=await updateVocabularyImageReview('reviewer',{...input('save_prompt'),prompt});
    expect(result.reviewStatus).toBe('needs_regeneration');
    expect((await regenerationQueue()).entries[0].prompt).toBe(prompt);
    await expect(updateVocabularyImageReview('reviewer',input('approve',1))).rejects.toMatchObject({status:409});
    expect(imageForWord(image.wordId,await publishedVocabularyMedia())).toBeUndefined();
    const next={...image,sha256:'a'.repeat(64),promptSha256:createHash('sha256').update(prompt).digest('hex')};
    expect(effectiveImageStatus(next,rows[0])).toBe('pending_review');
  });
  it('a new asset or legacy unversioned approval must be reviewed again', async () => {
    await updateVocabularyImageReview('reviewer',input('approve'));
    expect(effectiveImageStatus({...image,sha256:'b'.repeat(64)},rows[0])).toBe('pending_review');
    expect(effectiveImageStatus(image,{...rows[0],asset_sha256:null,prompt_sha256:null})).toBe('pending_review');
  });
  it('rejects stale browser revisions and stale image versions', async () => {
    await updateVocabularyImageReview('reviewer',input('approve'));
    await expect(updateVocabularyImageReview('reviewer',input('no_image'))).rejects.toMatchObject({status:409});
    await expect(updateVocabularyImageReview('reviewer',{...input('approve',1),assetSha256:'old'})).rejects.toMatchObject({status:409});
  });
  it('hiding never saves an unsaved prompt from the browser', async () => {
    await updateVocabularyImageReview('reviewer',{...input('no_image'),prompt:'Unsaved draft'});
    expect(rows[0].prompt).not.toBe('Unsaved draft');
    expect(effectiveImageStatus({...image,sha256:'c'.repeat(64)},rows[0])).toBe('no_image');
  });
  it('storage errors cannot resurrect hidden static-approved pictures', async () => {
    offline=true;
    expect(await publishedVocabularyMedia()).toEqual([]);
    expect((await listVocabularyImageReviews()).storageReady).toBe(false);
    await expect(updateVocabularyImageReview('reviewer',input('approve'))).rejects.toMatchObject({status:503});
  });
});
