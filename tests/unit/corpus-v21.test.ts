import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import { publicCorpusForScope } from '@/lib/corpus-v21';

describe('corpus v2.1 public projection', () => {
  it('contains stable IDs and no documentary provenance', () => {
    expect(corpus.version).toBe('2.1.0');
    expect(corpus.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(corpus.vocabulary.every((row) => row.id === `v-${row.hanzi}`)).toBe(true);
    const serialized = JSON.stringify(corpus);
    expect(serialized).not.toMatch(/source_refs|source_id|evidence_ids|pdfPage|SRC-|\.pdf/i);
  });

  it('publishes coherent dialogues and only independently documented radicals', () => {
    expect(corpus.dialogues).toHaveLength(6);
    expect(corpus.dialogues.every((dialogue) => dialogue.versions[0]?.label === 'Principal')).toBe(true);
    expect(corpus.radicals).toHaveLength(8);
    expect(JSON.stringify(corpus.radicals)).not.toMatch(/assessment|exam|candidate|answer/i);
  });

  it('filters real banks through curricular scope', () => {
    const l1 = publicCorpusForScope('l1');
    expect(l1.dialogues.every((row) => row.lesson === 1)).toBe(true);
    expect(l1.vocabulary.every((row) => row.lessons.includes(1))).toBe(true);
  });
});
