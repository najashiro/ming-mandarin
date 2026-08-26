import { examBank, type ExamSection } from '@/seed/exam';
import { comparePinyin, normalizeAnswer } from '@/lib/pinyin';

export type AnswerMap=Record<string,string>;
export function checkExamAnswer(section:ExamSection,expected:string,given:string){return section==='pinyin'?comparePinyin(given,expected,true):normalizeAnswer(given)===normalizeAnswer(expected);}
export function scoreExamAnswers(answers:AnswerMap){
  const sectionScores:Record<ExamSection,number>={listening:0,pinyin:0,vocabulary:0,grammar:0,dialogue:0,reading:0,hanzi:0,communication:0};
  const review=examBank.map(question=>{const correct=checkExamAnswer(question.section,question.answer,answers[question.id]??'');if(correct)sectionScores[question.section]+=question.points;return{id:question.id,section:question.section,correct};});
  return {score:Object.values(sectionScores).reduce((sum,value)=>sum+value,0),sectionScores,review};
}
export function perfectAnswerFixture():AnswerMap{return Object.fromEntries(examBank.map(question=>[question.id,question.answer]));}
