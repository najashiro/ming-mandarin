import manifest from '@/data/hide-and-seek-audio.json';
import language from '@/data/hide-and-seek-language.json';
import { hideLevels, locations, type HidePosition, type HideRound } from './hide-and-seek';

const clips = new Map(manifest.clips.map(clip => [clip.input, `/audio/hide-and-seek/${clip.file}`]));
export function hideTextAudio(text: string): string {
  const src = clips.get(text);
  if (!src) throw new Error(`Falta el audio de Escondites: ${text}`);
  return src;
}
export function hideLocationAudio(spot: HidePosition) { return hideTextAudio(locations[spot].hanzi); }
export function hideQuestion(round: Pick<HideRound, 'level'>) { return language.questions[hideLevels[round.level].animal]; }
export function hideQuestionAudio(round: Pick<HideRound, 'level'>) { return hideTextAudio(hideQuestion(round).hanzi); }
export function hideFeedback(correct: boolean, retry = false) { return language.feedback[correct ? 'correct' : retry ? 'retry' : 'missed']; }
export function hideFeedbackAudio(correct: boolean, retry = false) { return hideTextAudio(hideFeedback(correct, retry).hanzi); }
export function hideRoundAudio(round: HideRound): string[] {
  const positive = hideTextAudio(`它在桌子${locations[round.target].hanzi}。`);
  return round.excluded ? [hideTextAudio(`它不在桌子${locations[round.excluded].hanzi}。`), positive] : [positive];
}
