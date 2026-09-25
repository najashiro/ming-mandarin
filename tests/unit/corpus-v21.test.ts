import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import audioRequest from '../../.github/audio-requests/pr8-book-dialogues.json';
import audioManifest from '@/data/mandarin-audio.json';
import { createHash } from 'node:crypto';

describe('corpus v2.1 public projection', () => {
  it('contains stable IDs and allow-listed provenance without private documents', () => {
    expect(corpus.version).toBe('2.1.0');
    expect(corpus.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(corpus.vocabulary.every((row) => row.id === `v-${row.hanzi}`)).toBe(true);
    const serialized = JSON.stringify(corpus);
    expect(serialized).not.toMatch(/source_refs|source_id|evidence_ids|pdfPage|\.pdf|filename|sha256/i);
  });

  it('publishes exactly the two textbook dialogues per lesson', () => {
    expect(corpus.dialogues).toHaveLength(6);
    expect(corpus.dialogues.every((dialogue) => dialogue.id.includes('-BOOK-'))).toBe(true);
    for (const lesson of [1, 2, 3]) {
      expect(corpus.dialogues.filter((dialogue) => dialogue.lesson === lesson).map((dialogue) => dialogue.text).sort()).toEqual(['Texto 1', 'Texto 2']);
    }
    expect(JSON.stringify(corpus.dialogues)).not.toMatch(/Principal|Variante|versions/);
  });

  it('maps repeated greetings by exact turn witness without shifting pinyin', () => {
    const dialogue = corpus.dialogues.find((row) => row.id === 'DLG-L1-BOOK-T1')!;
    expect(dialogue.turns.slice(0, 3).map((turn) => [turn.turn, turn.speaker, turn.speakerPinyin, turn.hanzi, turn.pinyin])).toEqual([
      [1, '马大为', 'Mǎ Dàwéi', '你好！', 'Nǐ hǎo!'],
      [2, '宋华', 'Sòng Huá', '你好！', 'Nǐ hǎo!'],
      [3, '马大为', 'Mǎ Dàwéi', '我叫马大为。请问，你叫什么名字？', 'Wǒ jiào Mǎ Dàwéi. Qǐngwèn, nǐ jiào shénme míngzi?'],
    ]);
  });

  it('publishes only independently documented radicals and lesson-tagged examples', () => {
    expect(corpus.radicals).toHaveLength(8);
    expect(JSON.stringify(corpus.radicals)).not.toMatch(/assessment|exam_|candidate|answer/i);
    expect(corpus.radicals.flatMap((radical) => radical.examples).every((example) => example.pinyin && example.lessons.length)).toBe(true);
  });

  it('filters real banks through curricular scope', () => {
    const l1 = publicCorpusForScope('l1');
    expect(l1.dialogues.every((row) => row.lesson === 1)).toBe(true);
    expect(l1.vocabulary.every((row) => row.lessons.includes(1))).toBe(true);
    expect(l1.radicals.flatMap((row) => row.examples).every((example) => example.lessons.includes(1))).toBe(true);
  });

  it('does not expose a playback URL until the MP3 is present', () => {
    expect(audioForMandarinText('我叫马大为。请问，你叫什么名字？')).toMatch(/^\/audio\/mandarin\/.+\.mp3$/);
    expect(audioForMandarinText('宠物')).toBeUndefined();
    expect(audioForMandarinText('你好！')).toMatch(/^\/audio\/mandarin\/.+\.mp3$/);
  });

  it('pins the paid audio request to the exact reviewed manifest entries', () => {
    const byId = new Map(audioManifest.clips.map((clip) => [clip.id, clip]));
    const canonical = audioRequest.clipIds.map((id) => {
      const { file, input, expectedPinyin } = byId.get(id)!;
      return { id, file, input, expectedPinyin };
    });
    expect(audioRequest.status).toBe('completed');
    expect(audioRequest.clipIds).toHaveLength(43);
    expect(createHash('sha256').update(JSON.stringify(canonical)).digest('hex')).toBe(audioRequest.manifestFingerprint);
  });
});
