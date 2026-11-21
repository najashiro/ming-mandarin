import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import source from '@/MING_KNOWLEDGE/v2/lesson7/content.json';
import coverage from '@/MING_KNOWLEDGE/v2/lesson7/page-coverage.json';
import lesson7 from '@/data/lesson7-public.json';
import { canonicalCharacters } from '@/seed/characters';
import { getCurriculum } from '@/seed/curriculum';
import { getVocabularySet, getVocabularyMixSet, examplesForVocabularyCard, searchGlobalVocabulary } from '@/lib/vocabulary';
import { imageForVocabularyWord, imageForWord, vocabularyMedia } from '@/lib/vocabulary-media';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';
import { strokeNamesForCharacter } from '@/lib/hanzi/stroke-names';
import { grammarReading } from '@/lib/grammar-language';
import { conversationMissionsForScope } from '@/data/conversation-missions';
import { retoMixtoForScope } from '@/data/reto-mixto-lesson4';
import { examQuestionsForScope } from '@/seed/exam';
import { getWorkbookQuestions, workbookQuestionEvidence } from '@/lib/workbook-games';
import { audioForMandarinText } from '@/lib/mandarin-audio';

describe('L7: del libro al corpus y a todas las secciones', () => {
  it('registra 35 páginas, distingue el duplicado y conserva los dos diálogos completos', () => {
    expect(coverage).toHaveLength(35);
    expect(coverage.filter(page => page.status === 'duplicate_witness')).toEqual([
      expect.objectContaining({ source: 'workbook', pdfPage: 3, printedPage: 62, duplicateOf: 2 }),
    ]);
    expect(lesson7.dialogues.map(dialogue => dialogue.turns.length)).toEqual([17,18]);
    expect(lesson7.dialogues[0].turns.at(-1)?.hanzi).toContain('我找您八块。好吃您再来。');
    expect(lesson7.dialogues[1].turns[13].hanzi).toContain('一共两千一百九十一块');
    expect(source.corrections.find(row => row.id === 'L7-02')?.decision).toContain('955,70');
    expect(source.documentaryExercises.every(row => row.officialAnswerKey === null && !row.automaticGrading)).toBe(true);
    expect(source.documentaryExercises.filter(row => row.requiresOriginalAudio)).toHaveLength(5);
  });

  it('integra todos los módulos y preserva los alcances históricos', () => {
    expect(getVocabularySet('l7')).toHaveLength(70);
    expect(getVocabularyMixSet('l7')).toHaveLength(70);
    expect(getCurriculum('l7').stages.map(stage => stage.id)).toEqual(['7.1','7.2']);
    expect(getCurriculum('l7').characters).toHaveLength(23);
    expect(getCurriculum('l7').grammar).toHaveLength(9);
    expect(lesson7.readings).toHaveLength(5);
    expect(lesson7.documentaryExercises).toHaveLength(44);
    expect(getCurriculum('l1-l2-l3-l4-l5-l6').definition.lessonIds).toEqual([1,2,3,4,5,6]);
    expect(getCurriculum('l1-l2-l3-l4-l5-l6-l7').definition.lessonIds).toEqual([1,2,3,4,5,6,7]);
    expect(getVocabularySet('l6')).toHaveLength(74);
    expect(getVocabularySet('l5')).toHaveLength(87);
    expect(searchGlobalVocabulary('羽绒服').some(word => word.id === 'v-羽绒服')).toBe(true);
    expect(new Set(canonicalCharacters.map(character => character.id)).size).toBe(canonicalCharacters.length);
  });

  it('conserva los sentidos locales sin presentar imágenes de otro significado', () => {
    for (const [hanzi,spanish] of [['哪里','modestia'],['找','cambio'],['分','centavo']]) {
      const word=getVocabularySet('l7').find(word=>word.hanzi===hanzi)!;
      expect(word.spanish).toContain(spanish);
      expect(word.imageReuseBlocked).toBe(true);
      expect(imageForVocabularyWord(word)?.sense).toBe(word.spanish);
      expect(imageForVocabularyWord(word, vocabularyMedia.filter(entry=>!entry.src.includes('/lesson7/')))).toBeUndefined();
    }
    expect(imageForWord('v-分')).toBeDefined();
    expect(imageForWord('v-分')?.sense).not.toBe(imageForWord('v-分@l7')?.sense);
    expect(imageForWord('v-找')?.sense).not.toBe(imageForWord('v-找@l7')?.sense);
    expect(getVocabularySet('l7').find(word=>word.hanzi==='哪里')?.pinyin).toBe('nǎli');
    for (const word of getVocabularySet('l7')) {
      expect(word.pinyin && word.spanish,word.id).toBeTruthy();
      expect(examplesForVocabularyCard(word).length,word.id).toBeGreaterThan(0);
    }
  });

  it('hace consultable cada glifo sin convertir referencias en escritura obligatoria', () => {
    for (const row of [...lesson7.vocabulary,...lesson7.phrases,...lesson7.readings]) {
      for (const glyph of row.hanzi.match(/[\u3400-\u9fff]/g)??[]) {
        expect(resolveHanziGlyph(glyph).kind,glyph).not.toBe('unavailable');
        expect(existsSync(`public/hanzi-data/${glyph}.json`),glyph).toBe(true);
      }
    }
    for (const character of lesson7.characters) {
      const names=strokeNamesForCharacter(character.hanzi,character.strokeCount);
      expect(names.every(name=>name?.hanzi && name.pinyin),character.hanzi).toBe(true);
    }
    expect(lesson7.characters.some(character=>character.hanzi==='莓')).toBe(false);
    for (const point of lesson7.grammar) for (const block of point.studyBlocks) for (const example of block.examples) {
      expect(grammarReading(example.hanzi)?.pinyin,example.hanzi).toBeTruthy();
    }
  });

  it('ofrece cuaderno, conversación, construcción y exámenes con audio de práctica', () => {
    expect(conversationMissionsForScope('l7')[0].turns).toHaveLength(4);
    expect(retoMixtoForScope('l7').filter(row=>row.playableModes.includes('construct-response'))).toHaveLength(16);
    expect(getWorkbookQuestions('l7')).toHaveLength(18);
    const modesty=getWorkbookQuestions('l7').find(row=>row.id==='wb-l7-order-5')!;
    expect(modesty.audioReadings?.['哪里']).toBe('nǎli');
    expect(audioForMandarinText('哪里',modesty.audioReadings?.['哪里'])).toBeDefined();
    for (const question of getWorkbookQuestions('l7')) {
      const evidence=workbookQuestionEvidence[question.id];
      expect(evidence.answerOrigin).toBe('ming_adaptation');
      expect(source.documentaryExercises.find(row=>row.id===evidence.sourceExerciseId)?.requiresOriginalAudio).toBe(false);
    }
    for (const scope of ['l7','7.1','7.2'] as const) {
      const questions=examQuestionsForScope('l7-regression',scope);
      expect(questions).toHaveLength(20);
      expect(questions.reduce((sum,row)=>sum+row.points,0)).toBe(100);
      expect(questions.every(row=>row.answer)).toBe(true);
      expect(questions.filter(row=>row.section==='listening')).toHaveLength(5);
      for (const question of questions.filter(row=>row.audioText)) expect(audioForMandarinText(question.audioText!,question.audioReading)).toBeDefined();
    }
  });
  it('completa las cinco actividades de escucha con pistas, transcripciones y soluciones propias', () => {
    const listening=lesson7.documentaryExercises.filter(activity=>activity.requiresOriginalAudio);
    expect(listening).toHaveLength(5);
    expect(listening.flatMap(activity=>activity.listeningPractice!.tracks)).toHaveLength(28);
    expect(lesson7.pending).toEqual([]);
    for (const activity of listening) {
      expect(activity.listeningPractice?.origin).toBe('ming_generated_practice');
      expect(activity.listeningPractice?.answerOrigin).toBe('ming_practice_only');
      for (const track of activity.listeningPractice!.tracks) {
        expect(audioForMandarinText(track.hanzi,track.pinyin),track.id).toBeDefined();
        expect(track.hanzi && track.pinyin && track.spanish,track.id).toBeTruthy();
        if(track.task) expect(track.answer,track.id).toBeTruthy();
      }
    }
  });

});
