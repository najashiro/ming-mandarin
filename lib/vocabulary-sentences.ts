import type { VocabularyExample } from '@/lib/vocabulary';

const segmenters = {
  hanzi: new Intl.Segmenter('zh', { granularity: 'sentence' }),
  pinyin: new Intl.Segmenter('en', { granularity: 'sentence' }),
  spanish: new Intl.Segmenter('es', { granularity: 'sentence' }),
};

function sentences(text: string, field: keyof typeof segmenters) {
  return text.split(/[\r\n]+/u).flatMap(line =>
    [...segmenters[field].segment(line)].map(part => part.segment.trim()).filter(Boolean));
}

// Printed variants used within examples already linked to these vocabulary entries.
const targetForms: Record<string, readonly string[]> = {
  '点（钟）': ['点', '点钟'],
  '语言': ['语言', '语（言）'],
};

/** Presentation only: select a sentence within an approved word–example link. */
export function vocabularyExampleSentences(word: string, examples: readonly VocabularyExample[]): VocabularyExample[] {
  const seen = new Set<string>();
  return examples.flatMap(example => {
    const hanzi = sentences(example.hanzi, 'hanzi');
    // One Chinese sentence may legitimately use multiple Spanish sentences.
    // Keep its complete support and audited nonliteral links (e.g. 老虎 → 属虎).
    if (hanzi.length === 1) return [example];
    const pinyin = sentences(example.pinyin, 'pinyin');
    const spanish = sentences(example.spanish, 'spanish');
    // Never guess which translation or reading belongs to a sentence.
    if (hanzi.length !== pinyin.length || hanzi.length !== spanish.length) return [];
    const forms = targetForms[word] ?? [word];
    return hanzi.flatMap((text, index) => forms.some(form => text.includes(form)) ? [{
      ...example,
      id: `${example.id}:sentence-${index + 1}`,
      hanzi: text,
      pinyin: pinyin[index],
      spanish: spanish[index],
    }] : []);
  }).filter(example => {
    const key = `${example.hanzi}\u0000${example.pinyin.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
