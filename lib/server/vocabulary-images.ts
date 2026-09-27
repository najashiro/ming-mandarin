import 'server-only';

import promptCatalog from '@/docs/vocabulary-image-prompts.json';
import { vocabularyCatalog } from '@/lib/vocabulary';
import { vocabularyMedia, type VocabularyMediaEntry } from '@/lib/vocabulary-media';
import { supabaseRest } from '@/lib/supabase/rest';
import { ApiError } from './api';

export type VocabularyImageReviewStatus = 'pending_review' | 'approved' | 'no_image';
type ReviewRow = {
  word_id: string;
  status: VocabularyImageReviewStatus;
  prompt: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  updated_at: string;
};

export type AdminVocabularyImageEntry = VocabularyMediaEntry & {
  hanzi: string;
  pinyin: string;
  spanish: string;
  prompt: string;
  defaultPrompt: string;
  reviewStatus: VocabularyImageReviewStatus;
  reviewedAt: string | null;
};

const prompts = new Map(promptCatalog.entries.map(entry => [entry.wordId, entry]));
const words = new Map(vocabularyCatalog.map(word => [word.id, word]));

function staticStatus(entry: VocabularyMediaEntry): VocabularyImageReviewStatus {
  return entry.status === 'approved' ? 'approved' : 'pending_review';
}

async function reviewRows() {
  try {
    const rows = await supabaseRest<ReviewRow[]>('vocabulary_image_reviews?select=word_id,status,prompt,reviewed_by,reviewed_at,updated_at');
    return { rows, storageReady: true };
  } catch {
    return { rows: [] as ReviewRow[], storageReady: false };
  }
}

export async function publishedVocabularyMedia(): Promise<VocabularyMediaEntry[]> {
  const { rows } = await reviewRows();
  const reviews = new Map(rows.map(row => [row.word_id, row]));
  return vocabularyMedia.filter(entry => (reviews.get(entry.wordId)?.status ?? staticStatus(entry)) === 'approved');
}

export async function listVocabularyImageReviews(): Promise<{ entries: AdminVocabularyImageEntry[]; storageReady: boolean }> {
  const { rows, storageReady } = await reviewRows();
  const reviews = new Map(rows.map(row => [row.word_id, row]));
  const entries = vocabularyMedia.map((entry): AdminVocabularyImageEntry => {
    const word = words.get(entry.wordId);
    const prompt = prompts.get(entry.wordId);
    const review = reviews.get(entry.wordId);
    return {
      ...entry,
      hanzi: word?.hanzi ?? prompt?.hanzi ?? entry.wordId,
      pinyin: word?.pinyin ?? prompt?.pinyin ?? '',
      spanish: word?.spanish ?? prompt?.spanish ?? entry.sense,
      prompt: review?.prompt ?? prompt?.prompt ?? '',
      defaultPrompt: prompt?.prompt ?? '',
      reviewStatus: review?.status ?? staticStatus(entry),
      reviewedAt: review?.reviewed_at ?? null,
    };
  });
  return { entries, storageReady };
}

function validatedWordId(value: unknown) {
  const wordId = String(value ?? '');
  if (!vocabularyMedia.some(entry => entry.wordId === wordId)) throw new ApiError(404, 'La imagen no pertenece al vocabulario publicado.');
  return wordId;
}

function validatedPrompt(value: unknown) {
  const prompt = String(value ?? '').trim();
  if (prompt.length < 40 || prompt.length > 12_000) throw new ApiError(400, 'El prompt debe tener entre 40 y 12 000 caracteres.');
  return prompt;
}

export async function updateVocabularyImageReview(reviewerId: string, input: { wordId?: unknown; action?: unknown; prompt?: unknown }) {
  const wordId = validatedWordId(input.wordId);
  const action = String(input.action ?? '');
  if (!['approve', 'save_prompt', 'no_image'].includes(action)) throw new ApiError(400, 'Acción de revisión no válida.');
  const prompt = validatedPrompt(input.prompt ?? prompts.get(wordId)?.prompt);
  const now = new Date().toISOString();
  const status: VocabularyImageReviewStatus = action === 'approve' ? 'approved' : action === 'no_image' ? 'no_image' : 'pending_review';
  try {
    const rows = await supabaseRest<ReviewRow[]>('vocabulary_image_reviews?on_conflict=word_id', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: {
        word_id: wordId,
        status,
        prompt,
        reviewed_by: reviewerId,
        reviewed_at: action === 'save_prompt' ? null : now,
        updated_at: now,
      },
    });
    return { wordId, reviewStatus: rows[0]?.status ?? status, prompt, reviewedAt: rows[0]?.reviewed_at ?? (action === 'save_prompt' ? null : now) };
  } catch {
    throw new ApiError(503, 'La tabla privada de revisión aún no está disponible. Aplica la migración 0013 en Supabase.');
  }
}
