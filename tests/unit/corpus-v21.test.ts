import { describe, expect, it, vi } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import audioRequest from '../../.github/audio-requests/pr8-book-dialogues.json';
import audioManifest from '@/data/mandarin-audio.json';
import availableAudio from '@/data/mandarin-audio-available.json';
import { createHash } from 'node:crypto';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

describe('corpus v2.1 public projection', () => {
  it('contains stable IDs and no documentary provenance', () => {
    expect(corpus.version).toBe('2.1.0');
    expect(corpus.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(corpus.vocabulary.every((row) => row.id === `v-${row.hanzi}`)).toBe(true);
    const serialized = JSON.stringify(corpus);
    expect(serialized).not.toMatch(/source_refs|source_id|evidence_ids|pdfPage|SRC-|\.pdf/i);
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

  it('does not expose a manifest clip when it is excluded from availability', async () => {
    vi.resetModules();
    vi.doMock('@/data/mandarin-audio-available.json', () => ({ default: { files: [] } }));
    try {
      const unavailable = await import('@/lib/mandarin-audio');
      expect(unavailable.audioForMandarinText('我叫马大为。请问，你叫什么名字？')).toBeUndefined();
    } finally {
      vi.doUnmock('@/data/mandarin-audio-available.json');
      vi.resetModules();
    }
    expect(audioForMandarinText('你好！')).toMatch(/^\/audio\/mandarin\/.+\.mp3$/);
  });

  it('pins the completed audio request to reviewed entries and actual files', () => {
    const byId = new Map(audioManifest.clips.map((clip) => [clip.id, clip]));
    const canonical = audioRequest.clipIds.map((id) => {
      const { file, input, expectedPinyin } = byId.get(id)!;
      return { id, file, input, expectedPinyin };
    });
    expect(audioRequest.status).toBe('completed');
    expect(audioRequest.clipIds).toHaveLength(43);
    expect(new Set(audioRequest.clipIds).size).toBe(43);
    expect(createHash('sha256').update(JSON.stringify(canonical)).digest('hex')).toBe(audioRequest.manifestFingerprint);
    for (const clip of canonical) {
      expect(clip.file).toMatch(/^[\w-]+\.mp3$/);
      expect(availableAudio.files).toContain(clip.file);
      const path = resolve('public/audio/mandarin', clip.file);
      expect(existsSync(path)).toBe(true);
      expect(statSync(path).size).toBeGreaterThan(0);
      const url = audioForMandarinText(clip.input);
      expect(url).toMatch(/^\/audio\/mandarin\/.+\.mp3$/);
      expect(existsSync(resolve('public', url!.replace(/^\/+/, '')))).toBe(true);
    }
  });

  it('preserves textbook list membership with the corresponding lesson', () => {
    const mamahuhu = corpus.vocabulary.find((word) => word.hanzi === '马马虎虎')!;
    expect(mamahuhu.curriculumLinks.some((link) => link.lesson === 1 && link.list_type === 'supplementary_vocabulary')).toBe(true);
    const china = corpus.vocabulary.find((word) => word.hanzi === '中国')!;
    expect(china.curriculumLinks.some((link) => link.lesson === 2 && link.list_type === 'supplementary_vocabulary')).toBe(true);
    expect(china.curriculumLinks.some((link) => link.lesson === 3 && link.list_type === 'new_vocabulary')).toBe(true);
    const name = corpus.vocabulary.find((word) => word.hanzi === '马大为')!;
    expect(name.curriculumLinks.some((link) => link.role === 'proper_name' && link.list_type === 'new_vocabulary')).toBe(true);
  });

  it('exports documentary Hanzi evidence without claiming runtime availability', () => {
    const tai = corpus.hanzi.find((character) => character.id === 'c-太')!;
    expect(tai.worksheetEvidence).toBe(true);
    expect(tai.readings).toContain('tài');
    expect(tai).not.toHaveProperty('writingAvailable');
    expect(tai).not.toHaveProperty('worksheet_occurrences');
  });

  it('keeps recovered source pinyin and adds resolved Spanish under the stable phrase ID', () => {
    const phrase = corpus.phrases.find((row) => row.id === 'PH-38f6ca8078116ec2')!;
    expect(phrase.hanzi).toBe('我家有五口人。');
    expect(phrase.pinyin).toBe('Wǒ jiā yǒu wǔ kǒu rén.');
    expect(phrase.spanish).toBe('En mi familia somos cinco.');
  });

  it('provides both global zhen examples with Spanish and no provenance label', () => {
    const praise = corpus.phrases.find((row) => row.id === 'PH-bc51241bebeba332')!;
    const photo = corpus.phrases.find((row) => row.id === 'PH-1d7312c0a6661d54')!;
    expect(praise.spanish).toBe('¡Qué impresionante!');
    expect(photo.spanish).toBe('¡Esta foto es realmente bonita!');
    expect(praise.vocabIds).toContain('v-真');
    expect(photo.vocabIds).toContain('v-真');
    expect(praise.lessons).toContain(2);
    expect(photo.lessons).toContain(3);
    expect(JSON.stringify(corpus)).not.toMatch(/traduccion_ming|spanish_display|spanish_origin|model_checked_not_independently_human_reviewed/);
  });

  it('uses translations without manufacturing pinyin or valid vocabulary fragments', () => {
    expect(corpus.vocabulary.find((row) => row.id === 'v-厉害')?.spanish).toBe('impresionante; muy hábil');
    expect(corpus.vocabulary.some((row) => row.id === 'v-可以')).toBe(false);
    expect(corpus.vocabulary.some((row) => row.id === 'v-哥哥，还')).toBe(false);
    expect(corpus.phrases.some((row) => row.kinds.includes('counterexample'))).toBe(false);
    expect(corpus.phrases.find((row) => row.id === 'PH-1d7312c0a6661d54')?.pinyin).toBeNull();
  });

  it('resolves Spanish for each published word, phrase and exact dialogue turn', () => {
    expect(corpus.vocabulary.every((row) => typeof row.spanish === 'string' && row.spanish.trim().length > 0)).toBe(true);
    expect(corpus.phrases.every((row) => typeof row.spanish === 'string' && row.spanish.trim().length > 0)).toBe(true);
    expect(corpus.dialogues.flatMap((row) => row.turns).every((turn) => typeof turn.spanish === 'string' && turn.spanish.trim().length > 0)).toBe(true);
    const dialogue = corpus.dialogues.find((row) => row.id === 'DLG-L1-BOOK-T1')!;
    expect(dialogue.turns[0].spanish).toBe('¡Hola!');
    expect(dialogue.turns[1].spanish).toBe('¡Hola!');
    expect(dialogue.turns[2].spanish).toBe('Me llamo Ma Dawei. Disculpa, ¿cómo te llamas?');
  });
});
