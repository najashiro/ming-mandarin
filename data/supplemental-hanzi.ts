/**
 * Direct-reference Hanzi for the time game. They are deliberately excluded from
 * every curriculum collection and progress calculation. A future audited lesson
 * associates the same glyph/id with a unit; it must not create another asset.
 */
import vocabularyHanzi from './vocabulary-hanzi.json';
import manifest from '@/public/hanzi-data/manifest.json';
export type SupplementalHanziEntry = {
  id: `supplemental-${string}`;
  hanzi: string;
  pinyin: string;
  meaning: string;
  strokeCount: number;
  curricularAssociation: null;
  tracking: 'supplementary';
  access: 'direct-link-only';
  linguisticSource: string;
  technicalSource: 'hanzi-writer-data@2.0.1';
};

export const supplementalHanzi = [
  ['分','fēn','minuto',4],
  ['零','líng','cero',13],
  ['半','bàn','mitad · media',5],
  ['刻','kè','cuarto de hora',8],
  ['差','chà','faltar · quedar',9],
].map(([hanzi,pinyin,meaning,strokeCount])=>({
  id:`supplemental-${hanzi}`,hanzi,pinyin,meaning,strokeCount,
  curricularAssociation:null,tracking:'supplementary',access:'direct-link-only',
  linguisticSource:'time-game-approved-content-2026-09-23',technicalSource:'hanzi-writer-data@2.0.1',
})) as SupplementalHanziEntry[];

const vocabularyReferences: SupplementalHanziEntry[] = vocabularyHanzi.map(entry => ({
  id: `supplemental-${entry.hanzi}`, hanzi: entry.hanzi, pinyin: entry.pinyin, meaning: entry.meaning,
  strokeCount: (manifest as Record<string, {strokeCount:number}>)[entry.hanzi].strokeCount,
  curricularAssociation: null, tracking: 'supplementary', access: 'direct-link-only',
  linguisticSource: entry.source, technicalSource: 'hanzi-writer-data@2.0.1',
}));
export const supplementalHanziByGlyph = new Map([...supplementalHanzi, ...vocabularyReferences].map(entry=>[entry.hanzi,entry]));
