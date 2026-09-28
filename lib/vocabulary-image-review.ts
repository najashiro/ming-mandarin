import type { VocabularyMediaEntry } from './vocabulary-media';
export type ImageReviewStatus = 'pending_review' | 'approved' | 'no_image' | 'needs_regeneration';
export type ImageReviewRow = {
  word_id: string; status: ImageReviewStatus; prompt: string;
  asset_sha256: string | null; prompt_sha256: string | null;
  revision: number; reviewed_at: string | null;
};
// Approval belongs to the exact generated file and prompt, never just a word.
export function effectiveImageStatus(entry: VocabularyMediaEntry, row?: ImageReviewRow): ImageReviewStatus {
  if (!row) return entry.status === 'approved' ? 'approved' : 'pending_review';
  if (row.status === 'no_image') return 'no_image';
  if (row.prompt_sha256 && row.prompt_sha256 !== entry.promptSha256) return 'needs_regeneration';
  if (row.asset_sha256 !== entry.sha256 || row.prompt_sha256 !== entry.promptSha256) return 'pending_review';
  return row.status;
}
export function resolvePublishedImages(entries: readonly VocabularyMediaEntry[], rows: ImageReviewRow[]) {
  const byId = new Map(rows.map(row => [row.word_id, row]));
  return entries.filter(entry => effectiveImageStatus(entry, byId.get(entry.wordId)) === 'approved')
    .map(entry => ({ ...entry, status: 'approved', src: `${entry.src}?v=${entry.sha256}` }));
}
