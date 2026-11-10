import manifest from '@/data/hide-and-seek-audio.json';
import language from '@/data/hide-and-seek-language.json';
import { hideLevels, locations, type Animal, type HidePosition, type HideRound } from './hide-and-seek';

const clips = new Map([
  ...manifest.clips.map(clip => [clip.input, `/audio/hide-and-seek/${clip.file}`] as const),
  ...Object.values(language.animals).map(animal => [animal.hanzi, animal.audioSrc] as const),
  [language.feedback.correct.hanzi, language.feedback.correct.audioSrc] as const,
]);
export function hideTextAudio(text: string): string {
  const src = clips.get(text);
  if (!src) throw new Error(`Falta el audio de Escondites: ${text}`);
  return src;
}
export function hideAnimal(animal: Animal) { return language.animals[animal]; }
export function hideAnimalAudio(animal: Animal) { return hideAnimal(animal).audioSrc; }
export function hideLocationAudio(spot: HidePosition) { return hideTextAudio(locations[spot].hanzi); }
export function hideQuestion(round: Pick<HideRound, 'level'>) { return language.questions[hideLevels[round.level].animal]; }
export function hideQuestionAudio(round: Pick<HideRound, 'level'>) { return hideTextAudio(hideQuestion(round).hanzi); }
export function hideFeedback(correct: boolean) { return language.feedback[correct ? 'correct' : 'incorrect']; }
export function hideFeedbackAudio(correct: boolean) { return hideTextAudio(hideFeedback(correct).hanzi); }
export function hideRoundAudio(round: HideRound): string[] {
  const positive = hideTextAudio(`它在桌子${locations[round.target].hanzi}。`);
  return round.excluded ? [hideTextAudio(`它不在桌子${locations[round.excluded].hanzi}。`), positive] : [positive];
}
