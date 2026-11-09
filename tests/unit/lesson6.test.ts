import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import source from '@/MING_KNOWLEDGE/v2/lesson6/content.json';
import lesson6 from '@/data/lesson6-public.json';
import { getCurriculum } from '@/seed/curriculum';
import { canonicalCharacters } from '@/seed/characters';
import { getVocabularySet, examplesForWord, searchGlobalVocabulary } from '@/lib/vocabulary';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';
import { conversationMissionsForScope } from '@/data/conversation-missions';
import { retoMixtoForScope } from '@/data/reto-mixto-lesson4';
import { examQuestionsForScope } from '@/seed/exam';
import { getWorkbookQuestions, workbookQuestionEvidence } from '@/lib/workbook-games';

describe('L6: fuentes, integración y preservación', () => {
  it('conserva los dos diálogos completos del libro y separa el mapa alternativo', () => {
    const dialogues=publicCorpusForScope('l6').dialogues;
    expect(dialogues.map(d=>d.turns.length)).toEqual([17,14]);
    expect(dialogues[0].turns[7].hanzi).toBe('图书馆很大，在食堂北边。图书馆西边是体育馆。');
    expect(dialogues[1].turns[11].hanzi).toContain('35号');
    expect(lesson6.vocabulary.find(w=>w.hanzi==='体育馆')?.pinyin).toBe('tǐyùguǎn');
    expect(lesson6.vocabulary.find(w=>w.hanzi==='前边')?.pinyin).toBe('qiánbian');
    expect(source.corrections.every(c=>c.witnesses.every(w=>w.source.pdfPage>0))).toBe(true);
  });
  it('integra vocabulario, ejemplos, unidades y búsqueda global', () => {
    expect(getVocabularySet('l6')).toHaveLength(74);
    expect(getCurriculum('l6').stages.map(s=>s.id)).toEqual(['6.1','6.2']);
    expect(getCurriculum('l6').characters).toHaveLength(29);
    expect(getCurriculum('l6').grammar).toHaveLength(8);
    expect(lesson6.readings).toHaveLength(4);
    expect(lesson6.documentaryExercises).toHaveLength(38);
    expect(searchGlobalVocabulary('图书馆').some(w=>w.id==='v-图书馆')).toBe(true);
    for (const word of getVocabularySet('l6')) {
      expect(word.pinyin && word.spanish,word.hanzi).toBeTruthy();
      expect(examplesForWord(word).length,word.hanzi).toBeGreaterThan(0);
    }
  });
  it('conserva IDs, alcances y lecturas previas', () => {
    expect(getCurriculum('l1-l2-l3-l4-l5').definition.lessonIds).toEqual([1,2,3,4,5]);
    expect(getCurriculum('l1-l2-l3-l4-l5-l6').definition.lessonIds).toEqual([1,2,3,4,5,6]);
    expect(getVocabularySet('l5')).toHaveLength(87);
    expect(getVocabularySet('l1')).toHaveLength(85);
    expect(canonicalCharacters.find(c=>c.hanzi==='西')?.introducedIn).toBe('2.1');
    expect(new Set(canonicalCharacters.map(c=>c.id)).size).toBe(canonicalCharacters.length);
    for (const lesson of [4,5]) {
      const historical=JSON.parse(readFileSync(`data/lesson${lesson}-public.json`,'utf8'));
      for (const row of historical.characters) {
        const canonical=canonicalCharacters.find(c=>c.id===row.id)!;
        if (canonical.introducedIn.startsWith(`${lesson}.`)) expect(canonical.pinyin).toBe(row.pinyin);
      }
    }
  });
  it('resuelve caracteres con trazos reales sin convertir las lecturas en objetivos', () => {
    for (const row of [...lesson6.vocabulary,...lesson6.phrases,...lesson6.readings]) for (const glyph of row.hanzi.match(/[\u3400-\u9fff]/g)??[]) {
      expect(resolveHanziGlyph(glyph).kind,glyph).not.toBe('unavailable');
      expect(existsSync(`public/hanzi-data/${glyph}.json`),glyph).toBe(true);
    }
    expect(lesson6.characters.some(c=>c.hanzi==='龟')).toBe(false);
  });
  it('no inventa audio ni claves oficiales, y permite practicar sin ellos', () => {
    expect(source.policy.originalAudioSupplied).toBe(false);
    expect(source.documentaryExercises.every(e=>e.officialAnswerKey===null && !e.automaticGrading)).toBe(true);
    expect(lesson6.documentaryExercises.filter(e=>e.requiresOriginalAudio)).toHaveLength(5);
    expect(conversationMissionsForScope('l6')[0].turns).toHaveLength(4);
    expect(retoMixtoForScope('l6').some(e=>e.playableModes.includes('construct-response'))).toBe(true);
    for (const scope of ['l6','6.1','6.2'] as const) {
      const questions=examQuestionsForScope('l6-test',scope);
      expect(questions).toHaveLength(20);
      expect(questions.reduce((s,q)=>s+q.points,0)).toBe(100);
      expect(questions.every(q=>q.answer && q.section!=='listening')).toBe(true);
    }
    expect(getWorkbookQuestions('l6')).toHaveLength(16);
    for (const q of getWorkbookQuestions('l6')) expect(workbookQuestionEvidence[q.id].answerOrigin).toBe('ming_adaptation');
  });
});
