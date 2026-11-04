import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { vocabularyMedia, imageForWord } from '@/lib/vocabulary-media';
import { effectiveImageStatus, type ImageReviewRow } from '@/lib/vocabulary-image-review';
import { splitImageCorrection } from '@/lib/image-prompt-correction';
import { getVocabularyLesson } from '@/lib/vocabulary';
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
afterEach(() => vi.unstubAllEnvs());

describe('image decisions persist and reach the public cards', () => {
  it('loads only publication decisions, without downloading administrative prompts', async () => {
    const hidden = vocabularyMedia.find(entry => entry.status === 'approved')!;
    rest.mockResolvedValueOnce([{ word_id: hidden.wordId, status: 'no_image', asset_sha256: hidden.sha256, prompt_sha256: hidden.promptSha256 }]);
    const published = await publishedVocabularyMedia();
    expect(published.some(entry => entry.wordId === hidden.wordId)).toBe(false);
    expect(rest).toHaveBeenCalledWith('vocabulary_image_reviews?select=word_id,status,asset_sha256,prompt_sha256&limit=1000', { signal: expect.any(AbortSignal) });
  });
  it('bounds an unavailable review request without publishing unverified images', async () => {
    const controller = new AbortController();
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(controller.signal);
    rest.mockImplementationOnce((_path: string, { signal }: { signal: AbortSignal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    }));
    try {
      const pending = publishedVocabularyMedia();
      expect(timeout).toHaveBeenCalledWith(3000);
      controller.abort();
      expect(await pending).toEqual([]);
    } finally { timeout.mockRestore(); }
  });
  it('stores short corrections without replacing the base or accumulating old corrections', async () => {
    const original = (await listVocabularyImageReviews()).entries.find(e=>e.wordId===image.wordId)!;
    const first = await updateVocabularyImageReview('reviewer',{...input('save_correction'),correction:'Que entre.'});
    expect(first.reviewStatus).toBe('needs_regeneration');
    expect(splitImageCorrection(first.prompt)).toEqual({base:original.prompt,correction:'Que entre.'});
    const next = await updateVocabularyImageReview('reviewer',{...input('save_correction',1),correction:'Un pie dentro.'});
    expect(splitImageCorrection(next.prompt)).toEqual({base:original.prompt,correction:'Un pie dentro.'});
    expect(next.prompt).not.toContain('Que entre.');
    expect((await regenerationQueue()).entries[0].prompt).toBe(next.prompt);
    expect((await listVocabularyImageReviews()).entries.find(e=>e.wordId===image.wordId)?.correction).toBe('Un pie dentro.');
    await expect(updateVocabularyImageReview('reviewer',{...input('save_correction',2),correction:'  '})).rejects.toMatchObject({status:400});
    await expect(updateVocabularyImageReview('reviewer',{...input('save_correction',2),correction:'a'.repeat(2001)})).rejects.toMatchObject({status:400});
  });
  it('uses the existing vocabulary lesson assignment', async () => {
    for (const entry of (await listVocabularyImageReviews()).entries) {
      expect(entry.lesson).toBe(getVocabularyLesson({id:entry.wordId}) ?? null);
    }
  });
  it('approves a pending static entry and remains visible after reload', async () => {
    rows.push({ word_id: image.wordId, status: 'pending_review', prompt: '', asset_sha256: image.sha256, prompt_sha256: image.promptSha256, revision: 0, reviewed_at: null });
    rows[0].prompt = (await listVocabularyImageReviews()).entries.find(entry => entry.wordId === image.wordId)!.defaultPrompt;
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
  it('an isolated preview displays committed approved media without database access', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    for (const name of ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) vi.stubEnv(name, '');
    offline = true;
    const published = await publishedVocabularyMedia();
    expect(published.some(entry => entry.wordId === 'v-蛋糕')).toBe(true);
    expect(published.every(entry => entry.status === 'approved')).toBe(true);
    expect(rest).not.toHaveBeenCalled();
  });
  it('a configured preview fails closed when its review database is unavailable', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    offline = true;
    expect(await publishedVocabularyMedia()).toEqual([]);
  });
  it('production without credentials still fails closed', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    for (const name of ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) vi.stubEnv(name, '');
    offline = true;
    expect(await publishedVocabularyMedia()).toEqual([]);
  });
});
