import { existsSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getWorkbookQuestions } from '@/lib/workbook-games';
import { audioForMandarinText, normalizeMandarin } from '@/lib/mandarin-audio';
import { birthdayRounds } from '@/data/lesson5-games';
import { conversationMissionsForScope } from '@/data/conversation-missions';
import { sentenceBlocks } from '@/data/games-curriculum';

const questions = getWorkbookQuestions('l1-l2-l3-l4-l5-l6');
function expectAudio(text: string, pinyin?: string) {
  const src = audioForMandarinText(text, pinyin) ?? audioForMandarinText(text);
  expect(src, `Audio for ${text}`).toBeTruthy();
  expect(existsSync(`public${src}`), `Published file for ${text}: ${src}`).toBe(true);
  expect(statSync(`public${src}`).size, text).toBeGreaterThan(1000);
}

describe('immersive game coverage', () => {
  it('reinforces the whole completed sentence in all 96 workbook challenges', () => {
    for (const q of questions) {
      const full = q.mode === 'complete' ? q.context!.replace('___', q.answer) : q.answer;
      expect(normalizeMandarin(q.modelHanzi ?? q.answer), q.id).toBe(normalizeMandarin(full));
      expect(q.pinyin, q.id).toBeTruthy();
      expect(q.translation, q.id).toBeTruthy();
      expect(q.pinyin, q.id).not.toContain('___');
      expectAudio(full, q.pinyin);
    }
  });
  it('has physical audio for every tile, choice, and initial workbook utterance', () => {
    for (const q of questions) {
      for (const text of [...q.tokens ?? [], ...q.options ?? []]) expectAudio(text);
      if (q.mode === 'dialogue') expectAudio(q.context!);
    }
  });
  it('covers all birthday levels and every conversation mission including L6', () => {
    for (const row of birthdayRounds) {
      for (const text of [...row.tokens, ...row.choices]) expectAudio(text);
      expectAudio(row.hanzi, row.pinyin);
    }
    for (const mission of conversationMissionsForScope('l1-l2-l3-l4-l5-l6')) {
      for (const turn of mission.turns) {
        const { prompt, answer } = turn.challenge;
        expectAudio(prompt.hanzi, prompt.pinyin);
        expectAudio(answer.hanzi, answer.pinyin);
        for (const text of [...turn.choices, ...sentenceBlocks({ hanzi: answer.hanzi, tokens: answer.tokens ?? [] })]) expectAudio(text);
      }
    }
  });
});
