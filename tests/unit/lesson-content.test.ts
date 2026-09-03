import { describe, expect, it } from 'vitest';
import { getGreetingSentences, getListeningEntriesForLessons, getVocabularyForModule } from '@/lib/lesson-content';
import { hanziOptions, shuffleWithoutImmediateRepeat } from '@/lib/listen-recognize';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { lesson1Characters } from '@/seed/characters';
import mandarinAudio from '@/data/mandarin-audio.json';
import pronunciation from '@/data/pronunciation.json';

describe('módulos pedagógicos de la Lección 1', () => {
  it('limita Nombre y apellido al subconjunto pertinente', () => {
    expect(getVocabularyForModule('name').map((entry) => entry.hanzi)).toEqual([
      '你', '我', '叫', '请问', '什么', '名字', '姓', '认识', '高兴',
    ]);
  });

  it('limita Estados a estados ya presentes en el corpus', () => {
    expect(getVocabularyForModule('states').map((entry) => entry.hanzi)).toEqual([
      '好', '忙', '困', '渴', '饿', '累', '还行', '马马虎虎',
    ]);
  });

  it('asigna audio estático a todos los saludos y módulos solicitados', () => {
    const texts = [
      ...getGreetingSentences().map((entry) => entry.hanzi),
      ...getVocabularyForModule('name').map((entry) => entry.hanzi),
      ...getVocabularyForModule('states').map((entry) => entry.hanzi),
    ];
    for (const text of texts) expect(audioForMandarinText(text)).toMatch(/^\/audio\/mandarin\/.+\.mp3$/);
  });

  it('asigna a cada Hanzi curricular un audio estático y reutiliza los clips existentes', () => {
    const pinyinByHanzi = new Map(
      [...pronunciation.clips, ...mandarinAudio.clips].map((clip) => [clip.input, clip.expectedPinyin.normalize('NFC')]),
    );
    for (const character of lesson1Characters) {
      expect(audioForMandarinText(character.hanzi), `${character.hanzi} · ${character.pinyin}`).toMatch(/^\/audio\/(mandarin|pinyin)\/.+\.mp3$/);
      expect(pinyinByHanzi.get(character.hanzi), character.hanzi).toBe(character.pinyin);
    }
    expect(audioForMandarinText('你')).toBe('/audio/mandarin/l1-v-ni.mp3');
    expect(audioForMandarinText('早')).toBe('/audio/pinyin/zao.mp3');
    expect(audioForMandarinText('吗')).toBe('/audio/pinyin/tone-neutral-ma.mp3');
  });
});

describe('Escucha y reconoce', () => {
  const entries = getListeningEntriesForLessons([1]);

  it('solo devuelve entradas completas con audio de la lección seleccionada', () => {
    expect(entries.length).toBeGreaterThan(10);
    expect(entries.every((entry) => entry.lessonId === 1 && entry.hanzi && entry.pinyin && entry.translation && entry.audioSrc.endsWith('.mp3'))).toBe(true);
    expect(getListeningEntriesForLessons([2])).toEqual([]);
  });

  it('baraja sin repetir inmediatamente la entrada anterior', () => {
    const shuffled = shuffleWithoutImmediateRepeat(entries, entries[0].id, () => 0);
    expect(shuffled).toHaveLength(entries.length);
    expect(shuffled[0].id).not.toBe(entries[0].id);
    expect(new Set(shuffled.map((entry) => entry.id)).size).toBe(entries.length);
  });

  it('crea opciones compuestas únicamente por hanzi del corpus', () => {
    const options = hanziOptions(entries[0], entries, () => 0.25);
    expect(options).toHaveLength(4);
    expect(options).toContain(entries[0].hanzi);
    expect(options.every((hanzi) => entries.some((entry) => entry.hanzi === hanzi))).toBe(true);
  });
});
