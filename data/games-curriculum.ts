import type { CurriculumScope, SentenceEntry } from './types';
import { getCurriculum } from '@/seed/curriculum';
import { retoMixtoConversations, retoMixtoCorpus } from './reto-mixto';

export type SceneKind = 'meeting' | 'busy' | 'food' | 'family' | 'doctor' | 'photo' | 'country';
export const sceneDefinitions: { sentenceId: string; kind: SceneKind; count?: number; instruction: string }[] = [
  { sentenceId: 's-wojiao', kind: 'meeting', instruction: 'Preséntate como Ma Dawei.' },
  { sentenceId: 's-busy', kind: 'busy', instruction: 'Describe cómo estás con todo este trabajo.' },
  { sentenceId: 's-not-too-busy', kind: 'meeting', instruction: 'Di que no estás muy ocupado.' },
  { sentenceId: 's-l2-american', kind: 'country', instruction: 'Indica tu nacionalidad.' },
  { sentenceId: 's-l2-likes', kind: 'food', instruction: 'Di que te gustan los dos platos.' },
  { sentenceId: 's-l2-baozi', kind: 'food', instruction: 'Identifica el plato cercano y el lejano.' },
  { sentenceId: 's-l3-four', kind: 'family', count: 4, instruction: 'Cuenta a tu familia y responde.' },
  { sentenceId: 's-l3-six', kind: 'family', count: 6, instruction: 'Indica cuántas personas hay en total.' },
  { sentenceId: 's-l3-photo', kind: 'photo', instruction: 'Presenta la foto de tu familia.' },
  { sentenceId: 's-l3-doctor', kind: 'doctor', instruction: 'Explica en qué trabaja tu padre.' },
];
export function gamesContent(scope: CurriculumScope) {
  const curriculum = getCurriculum(scope);
  const scenes = sceneDefinitions.flatMap(definition => {
    const sentence = curriculum.sentences.find(item => item.id === definition.sentenceId);
    return sentence ? [{ ...definition, ...sentence }] : [];
  });
  const conversations = retoMixtoConversations.filter(item => curriculum.definition.lessonIds.includes(item.lesson)).flatMap(item => {
    const answer = retoMixtoCorpus.find(entry => entry.hanzi === item.answerHanzi);
    const prompt = retoMixtoCorpus.find(entry => entry.hanzi === item.promptHanzi);
    return answer && prompt ? [{ ...item, answer, prompt }] : [];
  });
  return { ...curriculum, scenes, conversations };
}
export type SceneChallenge = ReturnType<typeof gamesContent>['scenes'][number];
export type ConversationChallenge = ReturnType<typeof gamesContent>['conversations'][number];
export const storyDefinitions = [
  { id: 'meeting', lesson: 1, title: 'Una visita a clase', scenes: ['s-nihao', 's-wojiao', 's-meet', 's-busy'], questions: ['Localiza cómo se presenta el visitante.', 'Localiza cómo se siente al conocer a alguien.', 'Localiza por qué tiene poco tiempo.'], evidence: ['s-wojiao', 's-meet', 's-busy'] },
  { id: 'visitor', lesson: 2, title: 'Un estudiante en Pekín', scenes: ['s-l2-american', 's-l2-study', 's-l2-languages', 's-l2-likes'], questions: ['Encuentra su nacionalidad.', 'Encuentra qué lenguas habla.', 'Encuentra qué le gusta comer.'], evidence: ['s-l2-american', 's-l2-languages', 's-l2-likes'] },
  { id: 'album', lesson: 3, title: 'El álbum familiar', scenes: ['s-l3-photo', 's-l3-four', 's-l3-doctor', 's-l3-no-sister'], questions: ['Encuentra el tamaño de la familia.', 'Encuentra la profesión del padre.', 'Encuentra qué familiar no tiene.'], evidence: ['s-l3-four', 's-l3-doctor', 's-l3-no-sister'] },
];
export function storiesForScope(scope: CurriculumScope) {
  const curriculum = getCurriculum(scope);
  return storyDefinitions.filter(story => curriculum.definition.lessonIds.some(id => id === story.lesson)).map(story => ({ ...story, scenes: story.scenes.map(id => curriculum.sentences.find(sentence => sentence.id === id)!).filter(Boolean) }));
}
export function cleanChinese(value: string) { return value.replace(/[\s\p{P}]/gu, ''); }
export function sentenceBlocks(sentence: Pick<SentenceEntry, 'tokens' | 'hanzi'>) {
  return cleanChinese(sentence.tokens.join('')) === cleanChinese(sentence.hanzi) ? sentence.tokens.map(cleanChinese).filter(Boolean) : [...cleanChinese(sentence.hanzi)];
}
