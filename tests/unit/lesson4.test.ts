import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import lesson4 from '@/data/lesson4-public.json';
import baseline from '@/data/corpus-v21-public.json';
import audio from '@/data/lesson4-audio.json';
import available from '@/data/lesson4-audio-available.json';
import media from '@/data/lesson4-media.json';
import { allCurriculumCharacters, getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { getVocabularySet, examplesForWord } from '@/lib/vocabulary';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { examQuestionsForScope } from '@/seed/exam';
import { retoMixtoForScope } from '@/data/reto-mixto-lesson4';
import { buildRetoMixtoDeck } from '@/lib/reto-mixto';

describe('integración L4 desde corpus 2.2.0', () => {
  it('recupera glosas documentadas de caracteres sin heredar compuestos ni otras lecturas', () => {
    expect(lesson4.characters.find(character => character.hanzi === '分')?.meaning).toBe('minuto');
    expect(lesson4.characters.find(character => character.hanzi === '半')?.meaning).toBe('mitad');
    expect(lesson4.vocabulary.find(word => word.hanzi === '现在')?.spanish).toBeTruthy();
    expect(lesson4.characters.find(character => character.hanzi === '现')?.meaning).toBe('');
    expect(lesson4.vocabulary.find(word => word.hanzi === '差')?.pinyin).toBe('chà');
    expect(lesson4.characters.find(character => character.hanzi === '差')?.pinyin).toBe('chā');
    expect(lesson4.characters.find(character => character.hanzi === '差')?.meaning).toBe('');
    const visible = allCurriculumCharacters.filter(character => character.appearsIn.some(unit => unit.startsWith('4.')));
    expect(visible.every(character => character.pinyin)).toBe(true);
    expect(visible.filter(character => character.meaning)).toHaveLength(33);
  });
  it('expone ambos textos, todos los módulos y el acumulado', () => {
    expect(lesson4.version).toBe('2.2.0');
    expect(isCurriculumScope('l4')).toBe(true);
    expect(getCurriculum('l1-l2-l3-l4').definition.lessonIds).toEqual([1,2,3,4]);
    expect(lesson4.units.map(unit => unit.chinese)).toEqual(['你几点有课？','你们班有多少人？']);
    const data = getCurriculum('l4');
    expect(data.vocabulary).toHaveLength(73);
    expect(data.grammar).toHaveLength(19);
    expect(data.characters).toHaveLength(54);
    expect(lesson4.readings).toHaveLength(6);
    expect(lesson4.documentaryExercises).toHaveLength(62);
    expect(data.exercises.length).toBeGreaterThan(140);
  });
  it('mantiene íntegros los 27 turnos del libro y excluye variantes docentes', () => {
    const dialogues = publicCorpusForScope('l4').dialogues;
    expect(dialogues.map(d => d.id)).toEqual(['DLG-L4-BOOK-T1','DLG-L4-BOOK-T2']);
    expect(dialogues.flatMap(d => d.turns)).toHaveLength(27);
    for (const d of dialogues) expect(d.turns.map(t => t.turn)).toEqual(Array.from({ length: d.turns.length }, (_, i) => i + 1));
    expect(dialogues.flatMap(d => d.turns).some(t => t.hanzi.includes('七点半我回学校'))).toBe(true);
    expect(dialogues.flatMap(d => d.turns).some(t => t.hanzi.includes('我学英语'))).toBe(true);
    for (const scope of ['l1','l2','l3'] as const) expect(publicCorpusForScope(scope).dialogues).toEqual(baseline.dialogues.filter(d => d.lesson === Number(scope[1])));
  });
  it('publica español para los 27 turnos canónicos sin exponer metadatos editoriales', () => {
    const turns = publicCorpusForScope('l4').dialogues.flatMap(dialogue => dialogue.turns);
    expect(turns).toHaveLength(27);
    for (const turn of turns) {
      expect(turn.spanish.trim().length).toBeGreaterThan(0);
      expect(turn).not.toHaveProperty('traduccion_ming');
      expect(turn).not.toHaveProperty('method');
    }
    expect(turns.find(turn => turn.hanzi === '差五分七点。')?.spanish).toBe('Son las siete menos cinco.');
  });
  it('separa 只 contextual de la lectura aislada y conserva L3', () => {
    expect(getVocabularySet('l4').find(w => w.hanzi === '只')?.pinyin).toBe('zhǐ');
    expect(getCurriculum('l4').characters.find(c => c.hanzi === '只')?.pinyin).toBe('zhī');
    expect(getCurriculum('l3').characters.find(c => c.hanzi === '只')?.pinyin).toBe('zhī');
    expect(getVocabularySet('l4').find(w => w.hanzi === '差')?.pinyin).toBe('chà');
    expect(getCurriculum('l4').characters.find(c => c.hanzi === '差')?.pinyin).toBe('chā');
    expect(audioForMandarinText('只','zhǐ')).not.toBe(audioForMandarinText('只','zhī'));
    expect(audioForMandarinText('差','chà')).not.toBe(audioForMandarinText('差','chā'));
  });
  it('publica solo archivos de audio verificados y cubre los elementos de estudio', () => {
    expect(audio.clips).toHaveLength(156);
    expect(available.files).toHaveLength(audio.clips.length);
    for (const clip of audio.clips) {
      expect(available.files).toContain(clip.file);
      expect(existsSync(`public/audio/mandarin/${clip.file}`)).toBe(true);
    }
    for (const row of [...lesson4.vocabulary, ...lesson4.dialogues.flatMap(d => d.turns), ...lesson4.readings, ...lesson4.characters]) {
      expect(audioForMandarinText(row.hanzi, row.pinyin || undefined), row.hanzi).toMatch(/\.mp3$/);
    }
  });
  it('no promueve grabaciones sintéticas a claves del cuaderno ni exporta auditoría', () => {
    expect(lesson4.documentaryExercises.filter(e => e.requiresOriginalAudio)).toHaveLength(6);
    for (const exercise of lesson4.documentaryExercises) {
      expect(exercise).not.toHaveProperty('answer');
      expect(Object.keys(exercise).sort()).toEqual(['id','requiresOriginalAudio','texts','title']);
    }
    for (const word of lesson4.vocabulary) expect(Object.keys(word.visual_ming).sort()).toEqual(['ambiguity_risk','image_quiz_eligible','image_support','visual_mode']);
    for (const word of getVocabularySet('l4')) for (const example of examplesForWord(word)) {
      expect(word.examplePhraseIds).toContain(example.id);
      expect(example.hanzi).toBeTruthy();
      expect(example.hanzi).not.toMatch(/…|_|□/);
    }
  });
  it('tiene imágenes registradas con alfa y evita quizzes ambiguos', () => {
    expect(media.map(row => row.wordId)).toEqual(expect.arrayContaining(['v-电视','v-睡觉','v-跑步','v-打球','v-午饭','v-晚饭','v-刻','v-半']));
    for (const row of media) {
      expect(existsSync(`public${row.src}`)).toBe(true);
      expect(row.presentation).toBe('transparent-cutout');
      if (row.imageQuizEligible) expect(['v-电视','v-睡觉','v-跑步','v-打球']).toContain(row.wordId);
      expect(lesson4.vocabulary.find(w => w.id === row.wordId)?.visual_ming.image_support).toBe(true);
      expect(readFileSync(`public${row.src}`).length).toBeGreaterThan(1000);
    }
  });
  it('genera práctica y exámenes calificables sin respuestas vacías', () => {
    for (const scope of ['l4','l1-l2-l3-l4','4.1','4.2'] as const) {
      const questions = examQuestionsForScope('l4-regression', scope);
      expect(questions).toHaveLength(20);
      expect(questions.reduce((total, q) => total + q.points, 0)).toBe(100);
      expect(questions.every(q => q.answer.trim())).toBe(true);
    }
    const entries = retoMixtoForScope('l4');
    const deck = buildRetoMixtoDeck(entries, [], [4], 20, () => .42);
    expect(deck).toHaveLength(20);
    for (const q of deck) expect(entries.some(e => e.id === q.entryId && (e.audioSrc || (q.mode === 'construct-response' && e.tokens?.length)))).toBe(true);
  });
});
