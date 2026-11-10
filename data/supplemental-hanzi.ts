/**
 * Searchable reference Hanzi for the lessons and time game. They are excluded from
 * curriculum writing targets and progress calculation. A future audited lesson
 * associates the same glyph/id with a unit; it must not create another asset.
 */
import vocabularyHanzi from './vocabulary-hanzi.json';
import lesson5References from './lesson5-reference-hanzi.json';
import lesson6References from './lesson6-reference-hanzi.json';
import manifest from '@/public/hanzi-data/manifest.json';
export type SupplementalHanziEntry = {
  id: `supplemental-${string}`;
  hanzi: string;
  pinyin: string;
  meaning: string;
  strokeCount: number;
  curricularAssociation: null;
  tracking: 'supplementary';
  access: 'search-and-direct-link';
  linguisticSource: string;
  technicalSource: 'hanzi-writer-data@2.0.1';
  referenceLessons?: number[];
};

export const supplementalHanzi = [
  ['分','fēn','minuto',4],
  ['零','líng','cero',13],
  ['半','bàn','mitad · media',5],
  ['刻','kè','cuarto de hora',8],
  ['差','chà','faltar · quedar',9],
].map(([hanzi,pinyin,meaning,strokeCount])=>({
  id:`supplemental-${hanzi}`,hanzi,pinyin,meaning,strokeCount,
  curricularAssociation:null,tracking:'supplementary',access:'search-and-direct-link',
  linguisticSource:'time-game-approved-content-2026-09-23',technicalSource:'hanzi-writer-data@2.0.1',
})) as SupplementalHanziEntry[];

const vocabularyReferences: SupplementalHanziEntry[] = [
  ...lesson6References.map(entry => ({ ...entry, referenceLessons: [6] })),
  ...vocabularyHanzi.map(entry => ({ ...entry, referenceLessons: [3] })),
  ...lesson5References.map(entry => ({ ...entry, referenceLessons: [5] })),
].map(entry => ({
  id: `supplemental-${entry.hanzi}`, hanzi: entry.hanzi, pinyin: entry.pinyin, meaning: entry.meaning,
  strokeCount: (manifest as Record<string, {strokeCount:number}>)[entry.hanzi].strokeCount,
  curricularAssociation: null, tracking: 'supplementary', access: 'search-and-direct-link',
  linguisticSource: entry.source, technicalSource: 'hanzi-writer-data@2.0.1',
  referenceLessons: entry.referenceLessons,
}));
export const supplementalHanziByGlyph = new Map([...supplementalHanzi, ...vocabularyReferences].map(entry=>[entry.hanzi,entry]));
