import { describe,expect,it } from 'vitest';
import { computeMasteryUpdate } from '@/lib/mastery';
import { perfectAnswerFixture,scoreExamAnswers } from '@/lib/exam-score';
import { denseRankScores } from '@/lib/ranking';
import { examTotal } from '@/seed/exam';
import { vocabulary } from '@/seed/vocabulary';
import { exercises } from '@/seed/exercises';
describe('dominio de aprendizaje',()=>{
  it('programa aciertos en el futuro y fallos en diez minutos',()=>{const now=1_000_000;const right=computeMasteryUpdate({previousMastery:20,previousStability:1,difficulty:2,correct:true,selfRating:'know',now});const wrong=computeMasteryUpdate({previousMastery:20,previousStability:1,difficulty:2,correct:false,now});expect(right.mastery).toBeGreaterThan(20);expect(right.nextReviewAt).toBeGreaterThanOrEqual(now+86_400_000);expect(wrong.mastery).toBe(11);expect(wrong.nextReviewAt).toBe(now+600_000);});
  it('califica en servidor desde respuestas, no desde un score del cliente',()=>{expect(examTotal).toBe(100);expect(scoreExamAnswers(perfectAnswerFixture()).score).toBe(100);expect(scoreExamAnswers({}).score).toBe(0);});
  it('calcula un resultado real de 87 desde las respuestas',()=>{const answers=perfectAnswerFixture();delete answers['e-l1'];delete answers['e-p1'];delete answers['e-p2'];expect(scoreExamAnswers(answers).score).toBe(87);});
  it('comparte rango en empates',()=>{const rows=denseRankScores([{id:'a',score:100},{id:'b',score:100},{id:'c',score:95}]);expect(rows.map(row=>row.rank)).toEqual([1,1,2]);});
  it('mantiene corpus y ejercicios trazables',()=>{expect(vocabulary.length).toBeGreaterThanOrEqual(45);expect(exercises.length).toBeGreaterThan(70);expect(vocabulary.every(item=>item.source.pdfPage>0)).toBe(true);expect(vocabulary.some(item=>item.source.note?.includes('Lección 2'))).toBe(false);});
});
