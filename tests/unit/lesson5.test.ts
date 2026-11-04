import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import lesson5 from '@/data/lesson5-public.json';
import audio from '@/data/lesson5-audio.json';
import available from '@/data/lesson5-audio-available.json';
import media from '@/data/lesson5-media.json';
import { getCurriculum } from '@/seed/curriculum';
import { canonicalCharacters } from '@/seed/characters';
import { getVocabularySet, examplesForWord } from '@/lib/vocabulary';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';
import { conversationMissionsForScope } from '@/data/conversation-missions';
import { birthdayRounds } from '@/data/lesson5-games';
import { retoMixtoForScope } from '@/data/reto-mixto-lesson4';
import { buildRetoMixtoDeck } from '@/lib/reto-mixto';
import { examQuestionsForScope } from '@/seed/exam';

describe('Lección 5 completa', () => {
  it('publica el libro por encima de las variantes de la presentación', () => {
    const turns = publicCorpusForScope('l5').dialogues.flatMap(d => d.turns);
    expect(turns).toHaveLength(27);
    expect(turns.map(t => t.hanzi)).toContain('十月二十五号。');
    expect(turns.map(t => t.hanzi)).toContain('他一九八八年出生，今年三十二岁。');
    expect(turns.some(t => t.hanzi.includes('十月二十七号'))).toBe(false);
    expect(getVocabularySet('l5').find(w => w.hanzi === '教')?.pinyin).toBe('jiāo');
    expect(getVocabularySet('l5').find(w => w.hanzi === '干杯')?.pinyin).toBe('gānbēi');
  });
  it('cubre todos los módulos sin duplicar IDs ni perder alcances anteriores', () => {
    expect(getVocabularySet('l5')).toHaveLength(87);
    const course = getCurriculum('l5');
    expect(course.characters).toHaveLength(69);
    expect(course.stages.map(unit => unit.id)).toEqual(['5.1','5.2']);
    expect(course.grammar).toHaveLength(11);
    expect(lesson5.readings).toHaveLength(4);
    expect(lesson5.documentaryExercises).toHaveLength(29);
    expect(getCurriculum('l1-l2-l3-l4-l5').definition.lessonIds).toEqual([1,2,3,4,5]);
    expect(new Set(canonicalCharacters.map(c => c.id)).size).toBe(canonicalCharacters.length);
    expect(canonicalCharacters.find(c => c.hanzi === '生')?.introducedIn).toBe('2.1');
  });
  it('cada tarjeta tiene pinyin, español, relaciones explícitas y destino Hanzi', () => {
    for (const word of getVocabularySet('l5')) {
      expect(word.hanzi && word.pinyin && word.spanish, word.id).toBeTruthy();
      const examples = examplesForWord(word);
      expect(examples.length, word.id).toBeGreaterThan(0);
      for (const phrase of examples) {
        expect(phrase.pinyin && phrase.spanish, phrase.id).toBeTruthy();
        expect(phrase.hanzi).not.toMatch(/…|_|□/);
        expect(lesson5.phrases.find(p => p.id === phrase.id)?.exampleVocabIds).toContain(word.id);
      }
    }
    for (const row of [...lesson5.vocabulary, ...lesson5.phrases, ...lesson5.readings]) {
      for (const glyph of row.hanzi.match(/[\u3400-\u9fff]/g) ?? []) expect(resolveHanziGlyph(glyph).kind, `${row.hanzi}: ${glyph}`).not.toBe('unavailable');
    }
  });
  it('solo expone audio verificado y cubre palabras, ejemplos, diálogos y lecturas', () => {
    expect(available.files).toHaveLength(audio.clips.length);
    expect(audio.corpusFingerprint).toBe(lesson5.fingerprint);
    for (const row of [...lesson5.vocabulary,...lesson5.phrases,...lesson5.readings,...lesson5.characters]) {
      const src=audioForMandarinText(row.hanzi,row.pinyin);
      if (!src) throw new Error(`Audio missing: ${row.hanzi} / ${row.pinyin}`);
      expect(existsSync(`public${src}`)).toBe(true);
    }
    for (const file of available.files) expect(existsSync(`public/audio/mandarin/${file}`)).toBe(true);
  });
  it('versiona las imágenes revisadas y limita el quiz a referentes concretos', () => {
    expect(new Set(media.map(m => m.src)).size).toBe(30);
    for (const entry of media) {
      expect(createHash('sha256').update(readFileSync(`public${entry.src}`)).digest('hex')).toBe(entry.sha256);
      expect(entry.presentation).toBe('transparent-cutout');
      if (entry.imageQuizEligible) expect(lesson5.vocabulary.find(w => w.id === entry.wordId)?.visual_ming.image_quiz_eligible).toBe(true);
    }
  });
  it('ofrece conversación completa, construcción, imágenes y un examen válido', () => {
    expect(conversationMissionsForScope('l5')[0].turns).toHaveLength(4);
    expect(birthdayRounds).toHaveLength(8);
    for (const row of birthdayRounds) {
      expect(row.choices.filter(choice => choice === row.hanzi)).toHaveLength(1);
      expect(audioForMandarinText(row.hanzi,row.pinyin)).toBeTruthy();
    }
    const entries=retoMixtoForScope('l5',media);
    expect(entries.some(e => e.playableModes.includes('image-hanzi'))).toBe(true);
    expect(entries.some(e => e.playableModes.includes('construct-response'))).toBe(true);
    expect(buildRetoMixtoDeck(entries,[],[5],10,()=>.42)).toHaveLength(10);
    for (const scope of ['l5','5.1','5.2'] as const) {
      const exam=examQuestionsForScope('lesson5-test',scope);
      expect(exam.reduce((sum,q)=>sum+q.points,0)).toBe(100);
      expect(exam.every(q=>q.answer && (!q.options || q.options.includes(q.answer)))).toBe(true);
    }
  });
});
