import type { CSSProperties } from 'react';
import standard from '@/MING_KNOWLEDGE/design/vocabulary-style.json';

// PR #12 is the single source of design values for catalog and Mix.
const { card, palette, typography, controls } = standard;
export const vocabularyStyleId = standard.id;
export const vocabularyStyle = {
  '--vocab-ratio': card.aspect_ratio_width_over_height,
  '--vocab-max-width': `${card.max_width_rem}rem`,
  '--vocab-grid-min': `${card.preferred_min_grid_width_px}px`,
  '--vocab-radius': `${card.radius_px}px`,
  '--vocab-padding': `${card.padding_px}px`,
  '--vocab-mobile-padding': `${card.padding_mobile_px}px`,
  '--vocab-gap': `${card.gap_px}px`,
  '--vocab-mobile-gap': `${card.gap_mobile_px}px`,
  '--vocab-shadow': card.shadow,
  '--vocab-surface': palette.surface,
  '--vocab-ink': palette.hanzi,
  '--vocab-pinyin': palette.pinyin,
  '--vocab-translation': palette.translation,
  '--vocab-audio-surface': palette.audio_surface,
  '--vocab-audio-ink': palette.audio_icon,
  '--vocab-reverse': palette.reverse_surface,
  '--vocab-reverse-word': palette.reverse_word,
  '--vocab-target': palette.example_target,
  '--vocab-focus': palette.focus,
  '--vocab-word-size': `${typography.front_hanzi.size_rem}rem`,
  '--vocab-word-mobile-size': `${typography.front_hanzi.mobile_size_rem}rem`,
  '--vocab-word-weight': typography.front_hanzi.weight,
  '--vocab-pinyin-size': `${typography.pinyin.size_rem}rem`,
  '--vocab-translation-size': `${typography.translation.size_rem}rem`,
  '--vocab-reverse-word-size': `${typography.reverse_word.size_rem}rem`,
  '--vocab-sentence-size': `${typography.reverse_sentence.size_rem}rem`,
  '--vocab-sentence-mobile-size': `${typography.reverse_sentence.mobile_size_rem}rem`,
  '--vocab-target-weight': typography.example_target_weight,
  '--vocab-touch': `${controls.touch_target_min_px}px`,
  '--vocab-audio-size': `${controls.audio_diameter_px}px`,
  '--vocab-audio-icon': `${controls.audio_icon_px}px`,
} as CSSProperties;
