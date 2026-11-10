import manifest from '@/public/hanzi-data/manifest.json';
import { supplementalHanziByGlyph } from '@/data/supplemental-hanzi';
import { canonicalCharacters } from '@/seed/characters';

const singleHanzi=/^\p{Script=Han}$/u;
const curricularScopes=new Map(canonicalCharacters.map(entry=>[entry.hanzi,`l${entry.introducedIn.split('.')[0]}`]));
export type HanziGlyphResolution={kind:'curricular'|'supplementary';character:string;href:string}|{kind:'unavailable';character:string;href:string};

export function resolveHanziGlyph(character:string):HanziGlyphResolution {
  const valid=singleHanzi.test(character);
  const asset = (manifest as Record<string, { available: boolean }>)[character];
  if(!valid || !asset?.available)return {kind:'unavailable',character,href:`/study/l1-l2-l3/hanzi?character=${encodeURIComponent(character)}&focus=glyph`};
  const scope=curricularScopes.get(character);
  if(scope)return {kind:'curricular',character,href:`/study/${scope}/hanzi?character=${encodeURIComponent(character)}&focus=glyph`};
  const reference = supplementalHanziByGlyph.get(character);
  if(reference){
    const referenceScope = reference.referenceLessons?.[0] ? `l${reference.referenceLessons[0]}` : 'l1-l2-l3';
    return {kind:'supplementary',character,href:`/study/${referenceScope}/hanzi?character=${encodeURIComponent(character)}&focus=glyph&content=supplementary`};
  }
  return {kind:'unavailable',character,href:`/study/l1-l2-l3/hanzi?character=${encodeURIComponent(character)}&focus=glyph`};
}
export function hanziGlyphHref(character:string){return resolveHanziGlyph(character).href;}
