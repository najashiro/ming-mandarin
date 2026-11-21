// Offline audit of the application's exact-reading and same-sense media resolvers.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadApplicationModule } from './lib/load-application-module.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const vocabulary = loadApplicationModule(resolve(root, 'lib/vocabulary.ts'));
const { audioForMandarinText } = loadApplicationModule(resolve(root, 'lib/mandarin-audio.ts'));
const { imageForVocabularyWord, imageForWord } = loadApplicationModule(resolve(root, 'lib/vocabulary-media.ts'));
const { hanziCatalog } = loadApplicationModule(resolve(root, 'lib/hanzi/catalog.ts'));
const { retoMixtoForScope } = loadApplicationModule(resolve(root, 'data/reto-mixto-lesson4.ts'));
const { retoMixtoTokenAudio } = loadApplicationModule(resolve(root, 'lib/reto-mixto-token-audio.ts'));
const { curriculumScopes } = loadApplicationModule(resolve(root, 'seed/curriculum.ts'));
const lesson = JSON.parse(readFileSync(resolve(root, 'data/lesson7-public.json'), 'utf8'));
const audioRows = new Map();
const key = row => `${row.hanzi}|${row.pinyin}`;
function add(row, usage) {
  if (!row.hanzi || !row.pinyin || audioForMandarinText(row.hanzi, row.pinyin)) return;
  const previous = audioRows.get(key(row));
  if (previous) { if (!previous.usage.includes(usage)) previous.usage.push(usage); }
  else audioRows.set(key(row), { hanzi: row.hanzi, pinyin: row.pinyin, usage: [usage] });
}
for (const scope of curriculumScopes) for (const word of vocabulary.getVocabularySet(scope)) {
  add(word, 'vocabulary');
  for (const example of vocabulary.examplesForVocabularyCard(word)) add(example, 'vocabulary_example');
}
for (const word of vocabulary.vocabularyCatalog) {
  add(word, 'vocabulary');
  for (const example of vocabulary.examplesForVocabularyCard(word)) add(example, 'vocabulary_example');
}
for (const character of hanziCatalog) add(character, 'hanzi');
for (const dialogue of lesson.dialogues) for (const turn of dialogue.turns) add(turn, 'dialogue');
for (const phrase of lesson.phrases) add(phrase, 'phrase');
for (const reading of lesson.readings) add(reading, 'reading');
for (const activity of lesson.documentaryExercises) for (const track of activity.listeningPractice?.tracks ?? []) add(track, 'listening_practice');
for (const question of lesson.workbookGames) {
  add({ hanzi: question.modelHanzi ?? question.answer, pinyin: question.pinyin }, 'workbook_model');
  for (const [hanzi, pinyin] of Object.entries(question.audioReadings ?? {})) add({ hanzi, pinyin }, 'workbook_fragment');
}
for (const point of lesson.grammar) for (const block of point.studyBlocks ?? []) for (const example of block.examples ?? []) add(example, 'grammar');
const missingTokens = retoMixtoForScope('l7').filter(entry => entry.tokens).flatMap(entry => entry.tokens.flatMap((token, index) =>
  retoMixtoTokenAudio(entry, index).length ? [] : [{ entryId: entry.id, index, token }]));
const missingWorkbookFragments = lesson.workbookGames.flatMap(question => {
  const texts = [...new Set([...(question.tokens ?? []), ...(question.options ?? []), ...(question.mode === 'dialogue' ? [question.context] : [])])];
  return texts.flatMap(text => {
    const pinyin = question.audioReadings?.[text] ?? (text === (question.modelHanzi ?? question.answer) ? question.pinyin : undefined);
    return audioForMandarinText(text, pinyin) ? [] : [{ questionId: question.id, hanzi: text, pinyin: pinyin ?? null }];
  });
});
const images = vocabulary.getVocabularySet('l7').filter(word => !imageForVocabularyWord(word)).map(word => ({
  id: word.id, hanzi: word.hanzi, spanish: word.spanish,
  reason: word.imageReuseBlocked && imageForWord(word.id) ? 'existing_image_has_another_sense' : 'no_approved_image',
  visualMode: word.visual_ming.visual_mode,
}));
const report = {
  lesson: 7,
  policy: 'L7 generation authorized by the user on 2026-11-20. Reuse only exact recorded readings and images approved for the same sense. Original textbook recordings remain unavailable.',
  originalAudioSupplied: false,
  missingAudio: [...audioRows.values()].sort((a,b) => key(a).localeCompare(key(b), 'en')),
  missingImages: images,
  missingConstructionTokens: missingTokens,
  missingWorkbookFragments,
};
const destination = resolve(root, 'MING_KNOWLEDGE/v2/lesson7/media-status.json');
const encoded = JSON.stringify(report, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(destination, 'utf8') !== encoded) throw new Error('L7 media inventory is stale; regenerate and review the differences.');
} else writeFileSync(destination, encoded);
console.log(JSON.stringify({missingAudio: report.missingAudio.length, missingImages: images.length, missingConstructionTokens: missingTokens.length, missingWorkbookFragments: missingWorkbookFragments.length}));
