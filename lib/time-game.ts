import { canOmitMinuteFen, timeCurriculum, timeTokens } from '@/data/time-game';

export type TimeConstruction = 'numeric'|'half'|'quarter'|'three-quarter'|'cha-minutes'|'cha-quarter';
export type TimeAnswerVariant = { tokens: string[]; hanzi: string; pinyin: string; structure: TimeConstruction; masteryBonus: number; canonical?: boolean; sourceTag: string };
export type TimeChallenge = { hour: number; minute: number; acceptedAnswers: TimeAnswerVariant[] };
type Rules = typeof timeCurriculum | { sourceTag:string; allowErDian:boolean; allowOmittedZero:boolean; allowLeadingZero:boolean; allowThreeQuarter:boolean; allowCha:boolean; mastery:{half:number;quarter:number;threeQuarter:number;cha:number} };
const digits = ['零','一','二','三','四','五','六','七','八','九'];
const pinyin = new Map(timeTokens.map(token => [token.hanzi,token.pinyin]));
function hourForms(hour: number, rules: Rules) { return hour === 2 ? (rules.allowErDian ? ['两','二'] : ['两']) : [hour === 10 ? '十' : hour < 10 ? digits[hour] : `十${hour === 11 ? '一' : '二'}`]; }
function number(value: number): string { return value < 10 ? digits[value] : value < 20 ? `十${value === 10 ? '' : digits[value-10]}` : `${digits[Math.floor(value/10)]}十${value%10 ? digits[value%10] : ''}`; }
function reading(hanzi: string) { return [...hanzi].map((char,index) => {
  if(char==='一'&&hanzi[index-1]!=='十'){
    if(hanzi[index+1]==='刻')return 'yí';
    if(hanzi[index+1]==='点'||hanzi[index+1]==='分')return 'yì';
  }
  return pinyin.get(char)??'';
}).join(' ').trim(); }
export function buildAcceptedTimeAnswers(hour: number, minute: number, rules: Rules = timeCurriculum): TimeAnswerVariant[] {
  if (!Number.isInteger(hour) || hour < 1 || hour > 12 || !Number.isInteger(minute) || minute < 0 || minute > 59) throw new RangeError('Invalid time');
  const answers: TimeAnswerVariant[] = [];
  const add = (hanzi:string, structure:TimeAnswerVariant['structure'], masteryBonus=0) => {
    if (answers.some(answer => answer.hanzi === hanzi)) return;
    answers.push({tokens:[...hanzi],hanzi,pinyin:reading(hanzi),structure,masteryBonus,canonical:answers.length===0,sourceTag:rules.sourceTag});
  };
  for (const h of hourForms(hour,rules)) {
    const prefix = `${h}点`;
    if (minute === 0) add(prefix,'numeric');
    else {
      const minuteForms = minute < 10 ? [...(rules.allowLeadingZero ? [`零${number(minute)}`] : []),...(rules.allowOmittedZero ? [number(minute)] : [])] : [number(minute)];
      minuteForms.forEach(m => {
        add(`${prefix}${m}分`,'numeric');
        if (canOmitMinuteFen(minute)) add(`${prefix}${m}`,'numeric');
      });
      if (minute === 15) add(`${prefix}一刻`,'quarter',rules.mastery.quarter);
      if (minute === 30) add(`${prefix}半`,'half',rules.mastery.half);
      if (minute === 45 && rules.allowThreeQuarter) add(`${prefix}三刻`,'three-quarter',rules.mastery.threeQuarter);
    }
  }
  if (rules.allowCha && minute >= 30 && minute !== 30) {
    const remaining = 60-minute;
    const nextHour = hour === 12 ? 1 : hour+1;
    for (const h of hourForms(nextHour,rules)) {
      add(`差${number(remaining)}分${h}点`,'cha-minutes',rules.mastery.cha);
      if (remaining === 15) add(`差一刻${h}点`,'cha-quarter',rules.mastery.cha);
    }
  }
  return answers;
}
export function distinctTimeConstructions(challenge:TimeChallenge) { return new Set(challenge.acceptedAnswers.map(answer=>answer.structure)); }
export function validateHardTimeAnswers(challenge:TimeChallenge, answers:string[][]) {
  const matches=answers.map(tokens=>validateTimeAnswer(challenge,tokens));
  const valid=matches.every(Boolean);
  return {matches,valid,distinct:valid && matches[0]!.structure!==matches[1]!.structure,success:valid && matches[0]!.structure!==matches[1]!.structure};
}
export function generateHardTimeChallenge(difficulty:number, random:()=>number=Math.random):TimeChallenge {
  const minutePool=difficulty<35?[15,30,35,40,45,50,55]:difficulty<70?[15,30,35,37,40,43,45,47,50,52,55,58]:Array.from({length:30},(_,i)=>i+30).filter(m=>m!==30).concat([15,30]);
  const eligible=minutePool.filter(minute=>distinctTimeConstructions({hour:1,minute,acceptedAnswers:buildAcceptedTimeAnswers(1,minute)}).size>=2);
  const hour=Math.floor(random()*12)+1,minute=eligible[Math.floor(random()*eligible.length)];
  return {hour,minute,acceptedAnswers:buildAcceptedTimeAnswers(hour,minute)};
}
export function generateTimeChallenge(difficulty:number, random:()=>number=Math.random):TimeChallenge {
  const hour = Math.floor(random()*12)+1;
  const minutes = difficulty < 18 ? [0] : difficulty < 35 ? [0,5,10,20,30] : difficulty < 70 ? [5,10,15,20,25,30,35,40,45,50,55] : Array.from({length:60},(_,i)=>i);
  const minute = minutes[Math.floor(random()*minutes.length)];
  return {hour,minute,acceptedAnswers:buildAcceptedTimeAnswers(hour,minute)};
}
export function validateTimeAnswer(challenge:TimeChallenge, tokens:string[]) { return challenge.acceptedAnswers.find(answer => answer.hanzi === tokens.join('')); }
export type TimeStats = { difficulty:number; score:number; streak:number; correct:number; maxDifficulty:number; maxStreak:number; masteryBonusTotal:number };
export const initialTimeStats:TimeStats = {difficulty:0,score:0,streak:0,correct:0,maxDifficulty:0,maxStreak:0,masteryBonusTotal:0};
export function scoreTimeAnswer(stats:TimeStats, answer?:TimeAnswerVariant) {
  if (!answer) return {stats:{...stats,difficulty:Math.max(0,stats.difficulty-5),streak:0},bonus:0,streakBonus:0};
  const streak=stats.streak+1;
  const streakBonus=streak>=8?3:streak>=5?2:streak>=3?1:0;
  const base=stats.difficulty<35?5:stats.difficulty<70?8:12;
  const difficulty=Math.min(100,stats.difficulty+(streak===1?4:streak===2?5:6));
  return {stats:{difficulty,score:stats.score+base+streakBonus+answer.masteryBonus,streak,correct:stats.correct+1,maxDifficulty:Math.max(stats.maxDifficulty,difficulty),maxStreak:Math.max(stats.maxStreak,streak),masteryBonusTotal:stats.masteryBonusTotal+answer.masteryBonus},bonus:answer.masteryBonus,streakBonus};
}
export const clockVariants = ['classic','cream','dark','modern','desk','panel'] as const;
export type ClockVariant = typeof clockVariants[number];
export function nextClockVariant(history:ClockVariant[],random:()=>number=Math.random):ClockVariant {
  const last=history.at(-1), sameTypeTwice=history.length>1 && isAnalog(history.at(-2)!)===isAnalog(last!);
  const choices=clockVariants.filter(variant => variant!==last && (!sameTypeTwice || isAnalog(variant)!==isAnalog(last!)));
  return choices[Math.floor(random()*choices.length)];
}
export function isAnalog(variant:ClockVariant) { return ['classic','cream','dark'].includes(variant); }
export function clockAngles(hour:number,minute:number) {return {hourAngle:(hour%12)*30+minute*.5,minuteAngle:minute*6};}
