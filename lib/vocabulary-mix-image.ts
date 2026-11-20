import masks from '@/data/vocabulary-mix-image-masks.json';
import type { VocabularyMediaEntry } from './vocabulary-media';

// These covers affect only the prompt. The original published image remains
// intact on reveal, and publication/withdrawal still comes from the live catalog.
export function mixImageLabelMask(image: VocabularyMediaEntry) {
  const [path, query] = image.src.split('?');
  const mask = masks[path as keyof typeof masks];
  const version = new URLSearchParams(query).get('v');
  return mask && image.sha256 === mask.sha256 && (!version || version === mask.sha256) ? mask : undefined;
}
