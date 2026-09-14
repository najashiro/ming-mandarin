export function hanziGlyphHref(character: string) {
  return `/study/l1-l2-l3/hanzi?character=${encodeURIComponent(character)}&focus=glyph`;
}
