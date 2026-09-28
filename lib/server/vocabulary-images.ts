import 'server-only';
import { createHash } from 'node:crypto';
import promptCatalog from '@/docs/vocabulary-image-prompts.json';
import { vocabularyCatalog } from '@/lib/vocabulary';
import { vocabularyMedia, type VocabularyMediaEntry } from '@/lib/vocabulary-media';
import { effectiveImageStatus, resolvePublishedImages, type ImageReviewRow, type ImageReviewStatus } from '@/lib/vocabulary-image-review';
import { supabaseRest } from '@/lib/supabase/rest';
import { ApiError } from './api';

export type VocabularyImageReviewStatus = ImageReviewStatus;
export type AdminVocabularyImageEntry = VocabularyMediaEntry & {
  hanzi: string; pinyin: string; spanish: string; prompt: string; defaultPrompt: string;
  reviewStatus: ImageReviewStatus; reviewedAt: string | null; revision: number;
};
const prompts = new Map(promptCatalog.entries.map(entry => [entry.wordId, entry]));
const words = new Map(vocabularyCatalog.map(word => [word.id, word]));
const digest = (prompt: string) => createHash('sha256').update(prompt).digest('hex');
const columns = 'word_id,status,prompt,asset_sha256,prompt_sha256,revision,reviewed_at';

async function reviewRows() {
  try {
    const rows = await supabaseRest<ImageReviewRow[]>(`vocabulary_image_reviews?select=${columns}&limit=1000`);
    return { rows, storageReady: true };
  } catch {
    return { rows: [] as ImageReviewRow[], storageReady: false };
  }
}

export async function publishedVocabularyMedia(): Promise<VocabularyMediaEntry[]> {
  const { rows, storageReady } = await reviewRows();
  // A storage outage must not republish a photo an administrator hid.
  return storageReady ? resolvePublishedImages(vocabularyMedia, rows) : [];
}

export async function listVocabularyImageReviews() {
  const { rows, storageReady } = await reviewRows();
  const reviews = new Map(rows.map(row => [row.word_id, row]));
  const entries = vocabularyMedia.map((entry): AdminVocabularyImageEntry => {
    const word = words.get(entry.wordId);
    const prompt = prompts.get(entry.wordId);
    const review = reviews.get(entry.wordId);
    return {
      ...entry, src: `${entry.src}?v=${entry.sha256}`,
      hanzi: word?.hanzi ?? prompt?.hanzi ?? entry.wordId,
      pinyin: word?.pinyin ?? prompt?.pinyin ?? '',
      spanish: word?.spanish ?? prompt?.spanish ?? entry.sense,
      prompt: review?.prompt ?? prompt?.prompt ?? '', defaultPrompt: prompt?.prompt ?? '',
      reviewStatus: effectiveImageStatus(entry, review),
      reviewedAt: review?.reviewed_at ?? null, revision: review?.revision ?? 0,
    };
  });
  return { entries, storageReady };
}

export async function regenerationQueue() {
  const { entries, storageReady } = await listVocabularyImageReviews();
  if (!storageReady) throw new ApiError(503, 'No se puede consultar la cola de imágenes ahora.');
  return { schema_version: 1, exported_at: new Date().toISOString(), entries: entries
    .filter(entry => entry.reviewStatus === 'needs_regeneration')
    .map(entry => ({ wordId: entry.wordId, hanzi: entry.hanzi, pinyin: entry.pinyin, spanish: entry.spanish,
      prompt: entry.prompt, prompt_sha256: digest(entry.prompt), previous_asset_sha256: entry.sha256,
      revision: entry.revision, output: `${digest(entry.wordId).slice(0,20)}-${digest(entry.prompt).slice(0,16)}.png` })) };
}

export async function updateVocabularyImageReview(reviewerId: string, input: {
  wordId?: unknown; action?: unknown; prompt?: unknown; assetSha256?: unknown; revision?: unknown;
}) {
  const entry = vocabularyMedia.find(entry => entry.wordId === input.wordId);
  if (!entry) throw new ApiError(404, 'La imagen no pertenece al vocabulario publicado.');
  if (input.assetSha256 !== entry.sha256) throw new ApiError(409, 'La foto ha cambiado. Recarga y revisa la nueva versión.');
  if (!Number.isSafeInteger(input.revision) || Number(input.revision) < 0) throw new ApiError(400, 'Recarga la revisión antes de guardar.');
  const action = String(input.action ?? '');
  if (!['approve', 'save_prompt', 'no_image'].includes(action)) throw new ApiError(400, 'Acción de revisión no válida.');
  const { entries, storageReady } = await listVocabularyImageReviews();
  if (!storageReady) throw new ApiError(503, 'El guardado de revisiones no está disponible. Tus cambios no se han guardado.');
  const current = entries.find(item => item.wordId === entry.wordId)!;
  if (current.revision !== input.revision) throw new ApiError(409, 'Otra revisión cambió esta palabra. Recarga antes de guardar.');
  const prompt = action === 'save_prompt' ? (typeof input.prompt === 'string' ? input.prompt.trim() : '') : current.prompt;
  if (prompt.length < 40 || prompt.length > 12000) throw new ApiError(400, 'El prompt debe tener entre 40 y 12 000 caracteres.');
  if (action === 'approve' && (current.reviewStatus === 'needs_regeneration' || digest(prompt) !== entry.promptSha256)) {
    throw new ApiError(409, 'Primero genera la foto con el prompt actualizado y después revísala.');
  }
  const status: ImageReviewStatus = action === 'approve' ? 'approved' : action === 'no_image' ? 'no_image'
    : digest(prompt) === entry.promptSha256 ? 'pending_review' : 'needs_regeneration';
  let result: { conflict?: boolean; row?: ImageReviewRow };
  try {
    result = await supabaseRest('rpc/save_vocabulary_image_review', { method: 'POST', body: {
      p_word_id: entry.wordId, p_status: status, p_prompt: prompt, p_asset_sha256: entry.sha256,
      p_prompt_sha256: digest(prompt), p_reviewer: reviewerId, p_expected_revision: input.revision,
    } });
  } catch {
    throw new ApiError(503, 'No se pudo guardar la revisión. Vuelve a intentarlo.');
  }
  if (result.conflict) throw new ApiError(409, 'Otra revisión cambió esta palabra. Recarga antes de guardar.');
  if (!result.row) throw new ApiError(503, 'No se confirmó el guardado. Recarga para comprobar el estado.');
  return { wordId: entry.wordId, reviewStatus: result.row.status, prompt: result.row.prompt,
    reviewedAt: result.row.reviewed_at, revision: result.row.revision };
}
