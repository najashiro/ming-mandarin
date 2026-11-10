import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const lesson = JSON.parse(await readFile(new URL('../data/lesson6-public.json', import.meta.url), 'utf8'));
const language = JSON.parse(await readFile(new URL('../data/hide-and-seek-language.json', import.meta.url), 'utf8'));
const words = ['上边', '下边', '左边', '右边', '后边', '前边'];
const recordings = words.flatMap(hanzi => {
  const word = lesson.vocabulary.find(item => item.hanzi === hanzi);
  if (!word) throw new Error(`Locativo no encontrado: ${hanzi}`);
  return [
    { input: hanzi, expectedPinyin: word.pinyin, kind: 'word' },
    { input: `它在桌子${hanzi}。`, expectedPinyin: `Tā zài zhuōzi ${word.pinyin}.`, kind: 'positive' },
    { input: `它不在桌子${hanzi}。`, expectedPinyin: `Tā bú zài zhuōzi ${word.pinyin}.`, kind: 'negative' },
  ].map(clip => ({ ...clip, vocabularyId: word.id }));
}).concat([
  { input: '它在哪儿？', expectedPinyin: 'Tā zài nǎr?', kind: 'question', vocabularyId: 'v-哪儿' },
  { input: '桌子', expectedPinyin: 'zhuōzi', kind: 'object', vocabularyId: 'l6-example-table' },
  { input: '在', expectedPinyin: 'zài', kind: 'grammar', vocabularyId: 'g-l6-zai' },
  { input: '不在', expectedPinyin: 'bú zài', kind: 'grammar', vocabularyId: 'g-l6-zai' },
], Object.entries(language.questions).map(([animal, phrase]) => ({ input: phrase.hanzi, expectedPinyin: phrase.pinyin, kind: 'animal-question', animal, origin: language.origin })),
Object.entries(language.feedback).filter(([, phrase]) => !phrase.audioSrc).map(([feedback, phrase]) => ({ input: phrase.hanzi, expectedPinyin: phrase.pinyin, kind: 'feedback', feedback, origin: 'printed_corpus_response', sourceExercise: phrase.sourceExercise })));
const clips = recordings.map(clip => {
    const id = `hide-${createHash('sha256').update(`${clip.input}:${clip.expectedPinyin}`).digest('hex').slice(0, 16)}`;
    return { id, file: `${id}.mp3`, ...clip, lessonId: 6,
      instructions: `Pronuncia una vez. Lectura de referencia, no leerla en voz alta: ${clip.expectedPinyin} La sílaba 边 (bian) es neutra. En 不在 pronuncia bú zài. Conserva las pausas naturales de una frase breve.${clip.kind === 'animal-question' && clip.animal === 'rabbit' ? ' 在读 zài，第四声；哪儿读 nǎr。兔读 tù，仅一个音节，不加“子”。把动物名称和“在哪儿”自然连起来，完整读出问题。' : ''}${clip.kind === 'animal-question' && clip.animal === 'mouse' ? ' 老鼠读 lǎoshǔ。两个第三声连续时第一个读变调。在哪儿读 zài nǎr。完整读出问题，不加其他字词。' : ''}${clip.kind === 'feedback' ? ' 不对读 bú duì。第一个字变调读第二声 bú，第二个字第四声 duì。只读这两个字，平和友善，不加其他字词。' : ''}` };
});
await writeFile(new URL('../data/hide-and-seek-audio.json', import.meta.url), JSON.stringify({ version: 3, origin: 'ming_game_adaptation', voiceDisclosure: 'Voz generada por IA', clips }, null, 2) + '\n');
console.log(`Escondites: ${clips.length} clips preparados, sin llamadas TTS.`);
