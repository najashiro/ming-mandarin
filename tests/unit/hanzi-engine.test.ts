import { describe, it, expect } from 'vitest';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { hanziCatalog, hanziCatalogByGlyph } from '@/lib/hanzi/catalog';
import { canonicalCharacters } from '@/seed/characters';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';
import { strokeNamesForCharacter } from '@/lib/hanzi/stroke-names';
import { isHanziCharacterData } from '@/lib/hanzi/loader';
import corpus, { lesson4, lesson5, lesson6 } from '@/lib/active-corpus';

const texts = [...corpus.vocabulary, ...corpus.phrases, ...corpus.dialogues.flatMap(d => d.turns),
  ...lesson4.readings, ...lesson5.readings, ...lesson6.readings];
const corpusGlyphs = [...new Set(texts.flatMap(row => [...row.hanzi].filter(glyph => /\p{Script=Han}/u.test(glyph))))];

describe('Hanzi: cobertura integral del catálogo', () => {
  it('conserva los objetivos y sus IDs, y hace consultables todas las referencias', () => {
    expect(hanziCatalog).toHaveLength(378);
    expect(new Set(hanziCatalog.map(c => c.id)).size).toBe(hanziCatalog.length);
    expect(new Set(hanziCatalog.map(c => c.hanzi)).size).toBe(hanziCatalog.length);
    expect(hanziCatalog.filter(c => c.writingRequired).map(c => c.id)).toEqual(canonicalCharacters.map(c => c.id));
    for (const character of hanziCatalog) {
      expect(character.pinyin && character.meaning, character.hanzi).toBeTruthy();
      expect(resolveHanziGlyph(character.hanzi).kind, character.hanzi).toBe(character.writingRequired ? 'curricular' : 'supplementary');
      if (!character.writingRequired) {
        expect(character.introducedIn, character.hanzi).toBeNull();
        expect(character.appearsIn, character.hanzi).toEqual([]);
      }
      expect(character).not.toHaveProperty('source');
      expect(character).not.toHaveProperty('linguisticSource');
    }
  });

  it('cada ficha tiene audio con su lectura exacta y trazos locales íntegros con nombres', () => {
    for (const character of hanziCatalog) {
      const audio = audioForMandarinText(character.hanzi, character.pinyin);
      expect(audio, `${character.hanzi}: ${character.pinyin}`).toMatch(/^\/audio\/(mandarin|pinyin)\/[a-z0-9-]+\.mp3$/);
      expect(statSync(`public${audio}`).size, character.hanzi).toBeGreaterThan(1024);
      const data = JSON.parse(readFileSync(`public/hanzi-data/${character.hanzi}.json`, 'utf8'));
      expect(isHanziCharacterData(data), character.hanzi).toBe(true);
      expect(data.strokes, character.hanzi).toHaveLength(character.strokeCount);
      const names = strokeNamesForCharacter(character.hanzi, character.strokeCount);
      expect(names, character.hanzi).toHaveLength(character.strokeCount);
      expect(names.every(name => name?.hanzi && name.pinyin), character.hanzi).toBe(true);
    }
  });

  it('边 es consultable en L6 con sus usos y biān aislado, sin reutilizar bian neutro', () => {
    const bian = hanziCatalogByGlyph.get('边')!;
    expect(bian).toMatchObject({ pinyin: 'biān', writingRequired: false, introducedIn: null });
    expect(bian.referenceLessons).toContain(6);
    expect(bian.words?.map(word => word.hanzi)).toContain('北边');
    expect(resolveHanziGlyph('边').href).toContain('/study/l6/hanzi?');
    expect(audioForMandarinText('边', 'biān')).toBeTruthy();
    expect(audioForMandarinText('边', 'biān')).not.toBe(audioForMandarinText('边', 'bian'));
    expect(audioForMandarinText('左', 'zuǒ')).toBeTruthy();
    expect(audioForMandarinText('左', 'zuò')).toBeUndefined();
  });

  it('los contextos añadidos proceden del corpus y se auditan separadamente los glifos sin ficha', () => {
    const references = hanziCatalog.filter(character => !character.writingRequired);
    for (const character of references) for (const word of character.words ?? []) {
      expect(texts.some(row => row.hanzi.includes(word.hanzi) && row.pinyin.includes(word.pinyin) && row.spanish.includes(word.translation)), `${character.hanzi}: ${word.hanzi}`).toBe(true);
    }
    const glyphsWithoutCharacterRecord = corpusGlyphs.filter(glyph => !hanziCatalogByGlyph.has(glyph));
    // Source text containing a glyph does not itself supply an isolated reading
    // or definition. Keep this gap visible rather than fabricating a flashcard.
    if (process.env.HANZI_AUDIT_OUTPUT) writeFileSync(process.env.HANZI_AUDIT_OUTPUT, JSON.stringify({
      scope: 'Fichas del motor: objetivos de escritura y referencias documentadas. Los glifos sin ficha se registran por separado.',
      total: hanziCatalog.length, writingTargets: canonicalCharacters.length, references: references.length,
      inventory: hanziCatalog.map(character => ({
        id: character.id, hanzi: character.hanzi, pinyin: character.pinyin, meaning: character.meaning,
        writingRequired: character.writingRequired, referenceLessons: character.referenceLessons,
        strokeCount: character.strokeCount, namedStrokes: strokeNamesForCharacter(character.hanzi, character.strokeCount).filter(Boolean).length,
        audio: audioForMandarinText(character.hanzi, character.pinyin), contexts: character.words?.length ?? 0,
      })),
      glyphsWithoutCharacterRecord: glyphsWithoutCharacterRecord.map(hanzi => ({ hanzi,
        contexts: texts.filter(row => row.hanzi.includes(hanzi)).slice(0, 3).map(row => ({ hanzi: row.hanzi, pinyin: row.pinyin, spanish: row.spanish })),
      })),
    }, null, 2) + '\n');
    expect(glyphsWithoutCharacterRecord).not.toContain('边');
  });
});
