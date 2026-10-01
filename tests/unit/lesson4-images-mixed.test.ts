import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import media from '@/data/lesson4-media.json';
import prompts from '@/docs/lesson4-image-prompts.json';
import { vocabularyMedia } from '@/lib/vocabulary-media';
import { resolvePublishedImages } from '@/lib/vocabulary-image-review';
import { retoMixtoForScope } from '@/data/reto-mixto-lesson4';
import { buildRetoMixtoDeck, retryQuestion } from '@/lib/reto-mixto';
const approved = resolvePublishedImages(vocabularyMedia, []);
const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');

describe('L4 reviewed images and mixed practice', () => {
  it('keeps one current asset per ID with reproducible prompts and real alpha', async () => {
    expect(new Set(vocabularyMedia.map(row => row.wordId)).size).toBe(vocabularyMedia.length);
    for (const entry of media) {
      const buffer = readFileSync(`public${entry.src}`);
      expect(hash(buffer)).toBe(entry.sha256);
      expect(hash(prompts.entries.find(prompt => prompt.wordId === entry.wordId)!.prompt!)).toBe(entry.promptSha256);
      const metadata = await sharp(buffer).metadata();
      expect(metadata).toMatchObject({ width: 1618, height: 1000, hasAlpha: true });
      const {data,info} = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      for (const [x,y] of [[0,0],[info.width-1,0],[0,info.height-1],[info.width-1,info.height-1]]) expect(data[(y*info.width+x)*4+3]).toBe(0);
    }
  });
  it('mixes pictures, audio and source-token construction within lesson 4', () => {
    const entries= retoMixtoForScope('l4', approved);
    const deck=buildRetoMixtoDeck(entries, [], [4], 30, () => .42);
    expect(deck).toHaveLength(30);
    expect(new Set(deck.map(question=>question.mode))).toEqual(new Set(['image-hanzi','hanzi-image','audio-hanzi','audio-image','construct-response']));
    for(const question of deck) {
      const retry=retryQuestion(question,entries,[],()=>.42);
      if(retry.mode!=='construct-response') expect(retry.optionIds).toHaveLength(4);
      const entry=entries.find(entry=>entry.id===question.entryId)!;
      expect(entry.lessons).toContain(4);
      if(question.mode==='construct-response') expect(entry.tokens!.join('').replace(/[\s。？！]/g,'')).toBe(entry.hanzi.replace(/[\s。？！]/g,''));
      else {
        expect(question.optionIds).toContain(entry.id);
        expect(question.optionIds).toHaveLength(4);
        const options=question.optionIds.map(id=>entries.find(entry=>entry.id===id)!);
        expect(new Set(options.map(option=>option.hanzi)).size).toBe(4);
        if(question.mode==='hanzi-image'||question.mode==='audio-image') expect(options.every(option=>option.imageable&&option.imageSrc)).toBe(true);
      }
    }
  });
  it('uses every approved vocabulary picture in its scope as quiz or feedback support', () => {
    const entries=retoMixtoForScope('l1-l2-l3-l4', approved);
    for(const picture of approved) {
      const entry=entries.find(entry=>entry.vocabularyId===picture.wordId);
      expect(entry, picture.wordId).toBeDefined();
      expect(entry!.supportImageSrc).toBe(picture.src);
    }
  });
  it('does not revive pending, hidden, stale or unavailable approvals as legacy game art', () => {
    const hidden=media.find(entry=>entry.wordId==='v-电视')!;
    const published=resolvePublishedImages(vocabularyMedia,[{word_id:hidden.wordId,status:'no_image',prompt:'',asset_sha256:hidden.sha256,prompt_sha256:hidden.promptSha256,revision:1,reviewed_at:null}]);
    const entry=retoMixtoForScope('l4',published).find(entry=>entry.hanzi==='电视')!;
    expect(entry.imageable).toBe(false);
    expect(entry.supportImageSrc).toBeUndefined();
    expect(retoMixtoForScope('l1-l2-l3-l4',[]).some(entry=>entry.imageable||entry.imageSrc||entry.supportImageSrc)).toBe(false);
  });
  it('keeps contextual food and temporal diagrams out of isolated-image quizzes', () => {
    const entries=retoMixtoForScope('l4',approved);
    for(const id of ['v-午饭','v-晚饭','v-今天','v-明天','v-刻','v-分']) {
      const entry=entries.find(entry=>entry.vocabularyId===id)!;
      expect(entry.supportImageSrc).toBeTruthy(); expect(entry.imageable).toBe(false);
    }
    expect(buildRetoMixtoDeck([],[],[4],20)).toEqual([]);
  });
});
