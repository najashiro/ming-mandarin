import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import media from '@/data/vocabulary-media.json';
import prompts from '@/docs/vocabulary-image-prompts.json';
import corpus from '@/data/corpus-v21-public.json';

describe('revisión editorial de imágenes de vocabulario', () => {
  it('publica solo la selección conservadora y mantiene el resto pendiente', () => {
    expect(media.filter(entry => entry.status === 'approved')).toHaveLength(42);
    expect(media.filter(entry => entry.status === 'pending_review')).toHaveLength(263);
    const byHanzi = new Map(corpus.vocabulary.map(word => [word.hanzi, word.id]));
    for (const hanzi of ['猫', '饺子', '中国', '老师']) expect(media.find(entry => entry.wordId === byHanzi.get(hanzi))?.status).toBe('approved');
    expect(media.find(entry => entry.wordId === byHanzi.get('真'))?.status).toBe('pending_review');
  });

  it('conserva una imagen y un prompt revisables para cada entrada', () => {
    expect(media).toHaveLength(305);
    expect(prompts.entries).toHaveLength(305);
    expect(new Set(media.map(entry => entry.wordId))).toEqual(new Set(prompts.entries.map(entry => entry.wordId)));
  });

  it('mantiene la cola de Supabase privada para navegador y usuarios', () => {
    const migration = readFileSync(join(process.cwd(), 'supabase/migrations/0013_vocabulary_image_reviews.sql'), 'utf8');
    expect(migration).toContain('enable row level security');
    expect(migration).toContain('revoke all on public.vocabulary_image_reviews from public, anon, authenticated');
    expect(migration).toContain('grant all on public.vocabulary_image_reviews to service_role');
  });
});
