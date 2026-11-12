export type HanziContext = { hanzi: string; pinyin: string; translation: string };

// A complete short example stays readable even when each glyph is a touch target.
export const MAX_CONTEXT_HANZI = 30;

const segmenters = {
  hanzi: new Intl.Segmenter('zh', { granularity: 'sentence' }),
  pinyin: new Intl.Segmenter('en', { granularity: 'sentence' }),
  translation: new Intl.Segmenter('es', { granularity: 'sentence' }),
};

function sentences(text: string, field: keyof HanziContext): string[] {
  return text.split(/[\r\n]+/u).flatMap(line =>
    [...segmenters[field].segment(line)].map(part => part.segment.trim()).filter(Boolean));
}

/** Keep literal, aligned sentences; never truncate Chinese or invent a translation. */
export function compactHanziContexts<T extends HanziContext>(context: T): T[] {
  const hanzi = sentences(context.hanzi, 'hanzi');
  const pinyin = sentences(context.pinyin, 'pinyin');
  const translation = sentences(context.translation, 'translation');
  // Unequal counts cannot establish a reliable translation for each sentence.
  if (!hanzi.length || hanzi.length !== pinyin.length || hanzi.length !== translation.length) return [];
  return hanzi.flatMap((text, index) => {
    const glyphCount = (text.match(/\p{Script=Han}/gu) ?? []).length;
    if (!glyphCount || glyphCount > MAX_CONTEXT_HANZI) return [];
    // Exercise blanks and alternative separators are not complete usage examples.
    if (/[…_]|\.{2,}|^[\/／]/u.test(text)) return [];
    return [{ ...context, hanzi: text, pinyin: pinyin[index], translation: translation[index] }];
  });
}

export function hanziContextKey(context: HanziContext): string {
  // Seed examples historically omit final punctuation; they are the same use.
  const withoutEnding = (text: string) => text.trim().replace(/[。！？.!?]+$/u, '').trim();
  return `${withoutEnding(context.hanzi)}:${withoutEnding(context.pinyin).toLowerCase()}`;
}
