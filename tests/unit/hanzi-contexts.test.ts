import { describe, expect, it } from 'vitest';
import { compactHanziContexts, hanziContextKey, MAX_CONTEXT_HANZI } from '@/lib/hanzi/contexts';
import { hanziCatalog, hanziCatalogByGlyph } from '@/lib/hanzi/catalog';
import { allCurriculumCharacters, curriculumScopes, getCurriculum } from '@/seed/curriculum';
import { lesson6 } from '@/lib/active-corpus';

describe('Palabras y frases: una oración breve por ejemplo Hanzi', () => {
  it('conserva cada oración completa con su pinyin y traducción correspondientes', () => {
    expect(compactHanziContexts({
      hanzi: '不客气。你看，食堂旁边是办公楼。',
      pinyin: 'Bú kèqi. Nǐ kàn, shítáng pángbiān shì bàngōnglóu.',
      translation: 'De nada. Mira, al lado del comedor está el edificio de oficinas.',
    })).toEqual([
      { hanzi: '不客气。', pinyin: 'Bú kèqi.', translation: 'De nada.' },
      { hanzi: '你看，食堂旁边是办公楼。', pinyin: 'Nǐ kàn, shítáng pángbiān shì bàngōnglóu.', translation: 'Mira, al lado del comedor está el edificio de oficinas.' },
    ]);
  });

  it('extrae la frase pertinente de campus, incluso si el carácter no está al principio', () => {
    const campus = lesson6.readings.find(row => row.id === 'r-l6-campus')!;
    const examples = compactHanziContexts({ ...campus, translation: campus.spanish });
    expect(examples.find(row => row.hanzi === '学校食堂旁边是办公楼。')).toMatchObject({
      pinyin: 'Xuéxiào shítáng pángbiān shì bàngōnglóu.',
      translation: 'Junto al comedor está el edificio de oficinas.',
    });
    const pang = hanziCatalogByGlyph.get('旁')!;
    expect(pang.words?.map(row => row.hanzi)).toEqual(expect.arrayContaining(['旁边', '食堂旁边是办公楼。', '学校食堂旁边是办公楼。']));
    expect(pang.words?.every(row => row.hanzi.includes('旁'))).toBe(true);
    expect(pang.words?.some(row => row.hanzi === campus.hanzi)).toBe(false);
  });

  it('descarta fuentes sin alineación y no corta una oración larga ni un ejercicio incompleto', () => {
    const turtles = lesson6.readings.find(row => row.id === 'r-l6-turtles')!;
    expect(compactHanziContexts({ ...turtles, translation: turtles.spanish })).toEqual([]);
    expect(compactHanziContexts({ hanzi: '你'.repeat(31), pinyin: 'nǐ', translation: 'tú' })).toEqual([]);
    expect(compactHanziContexts({ hanzi: '这是……', pinyin: 'Zhè shì…', translation: 'Esto es…' })).toEqual([]);
    expect(compactHanziContexts({ hanzi: '你好。', pinyin: '', translation: 'Hola.' })).toEqual([]);
    // A short Chinese field must not disguise a paragraph in another field.
    expect(compactHanziContexts({ hanzi: '你好。', pinyin: 'Nǐ hǎo.', translation: 'Hola. Buenos días.' })).toEqual([]);
  });

  it('respeta saltos de línea, interrogaciones y cierres de comillas', () => {
    expect(compactHanziContexts({ hanzi: '你好\n再见', pinyin: 'Nǐ hǎo\nZàijiàn', translation: 'Hola\nAdiós' }))
      .toEqual([{ hanzi: '你好', pinyin: 'Nǐ hǎo', translation: 'Hola' }, { hanzi: '再见', pinyin: 'Zàijiàn', translation: 'Adiós' }]);
    expect(compactHanziContexts({ hanzi: '“你好！”', pinyin: '“Nǐ hǎo!”', translation: '«¡Hola!»' }))
      .toEqual([{ hanzi: '“你好！”', pinyin: '“Nǐ hǎo!”', translation: '«¡Hola!»' }]);
  });

  it('comprueba las 378 fichas y los contextos de todas las lecciones antes de perder puntuación', () => {
    const characters = [...hanziCatalog, ...allCurriculumCharacters,
      ...curriculumScopes.flatMap(scope => getCurriculum(scope).characters)];
    expect(hanziCatalog).toHaveLength(378);
    for (const character of characters) {
      const words = character.words ?? [];
      expect(new Set(words.map(hanziContextKey)).size, character.hanzi).toBe(words.length);
      for (const word of words) {
        const label = `${character.hanzi}: ${word.hanzi}`;
        expect(word.hanzi, label).toContain(character.hanzi);
        expect((word.hanzi.match(/\p{Script=Han}/gu) ?? []).length, label).toBeLessThanOrEqual(MAX_CONTEXT_HANZI);
        for (const text of [word.hanzi, word.pinyin, word.translation]) {
          expect(text, label).not.toMatch(/[\r\n]/u);
          // No subsequent text after a sentence ending, except closing punctuation.
          expect(text, label).not.toMatch(/[。！？.!?][”’」』"'）)»]*\s*[\p{L}\p{N}¿¡（(“«]/u);
        }
      }
    }
    // Removing an unsafe example never removes the character's lesson association.
    expect(hanziCatalogByGlyph.get('龟')?.referenceLessons).toContain(6);
  });
});
