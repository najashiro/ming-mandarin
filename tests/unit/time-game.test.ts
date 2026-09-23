import { describe,expect,it } from 'vitest';
import { buildAcceptedTimeAnswers, clockAngles, clockVariants, generateHardTimeChallenge, generateTimeChallenge, initialTimeStats, isAnalog, nextClockVariant, scoreTimeAnswer, validateHardTimeAnswers, validateTimeAnswer } from '@/lib/time-game';
import { normalizeTimeSpeech } from '@/lib/time-speech';
const forms=(h:number,m:number)=>buildAcceptedTimeAnswers(h,m).map(a=>a.hanzi);
describe('hours answers',()=>{
  it('accepts configured forms and wraps the next hour',()=>{
    expect(forms(3,0)).toEqual(['三点']);
    expect(forms(3,15)).toContain('三点一刻');expect(forms(3,15)).toContain('三点十五分');
    expect(forms(3,30)).toContain('三点半');expect(forms(3,30)).toContain('三点三十分');
    expect(forms(3,45)).toEqual(expect.arrayContaining(['三点四十五分','三点三刻','差十五分四点','差一刻四点']));
    expect(forms(7,55)).toContain('差五分八点');
    expect(forms(3,5)).toEqual(expect.arrayContaining(['三点五分','三点零五分']));
    expect(forms(12,45)).toContain('差一刻一点');
    expect(forms(2,15)).toContain('两点一刻');expect(forms(2,15)).not.toContain('二点一刻');
  });
  it('keeps canonical, pinyin, bonus and rejected forms consistent',()=>{
    const answers=buildAcceptedTimeAnswers(3,15);
    expect(answers[0]).toMatchObject({hanzi:'三点十五分',canonical:true,masteryBonus:0,pinyin:'sān diǎn shí wǔ fēn'});
    expect(answers.find(a=>a.hanzi==='三点一刻')).toMatchObject({masteryBonus:2,pinyin:'sān diǎn yí kè'});
    expect(buildAcceptedTimeAnswers(1,0)[0].pinyin).toBe('yì diǎn');
    expect(buildAcceptedTimeAnswers(11,0)[0].pinyin).toBe('shí yī diǎn');
    expect(new Set(answers.map(a=>a.hanzi)).size).toBe(answers.length);
    expect(validateTimeAnswer({hour:3,minute:15,acceptedAnswers:answers},['三','点','十','六','分'])).toBeUndefined();
  });
  it('accepts optional 分 only after ten minutes',()=>{
    for(const minute of [11,12,20,25,55,59]) {
      const answers=forms(2,minute);
      const full=answers.find(form=>form.startsWith('两点')&&form.endsWith('分'))!;
      expect(answers).toContain(full.slice(0,-1));
      expect(answers).toContain(full);
    }
    expect(forms(7,20)).toContain('七点二十');
    expect(forms(2,10)).toContain('两点十分');
    expect(forms(2,10)).not.toContain('两点十');
    expect(forms(2,5)).not.toContain('两点零五');
    expect(forms(2,5)).not.toContain('两点五');
    expect(forms(2,5)[0]).toBe('两点零五分');
    expect(forms(2,12)[0]).toBe('两点十二分');
  });
  it('generates minute ranges by difficulty',()=>{
    expect(generateTimeChallenge(0,()=>.5).minute).toBe(0);
    expect([0,5,10,20,30]).toContain(generateTimeChallenge(20,()=>.5).minute);
    expect(generateTimeChallenge(90,()=>.8).minute).toBe(48);
  });
});
describe('hard rules',()=>{
  it('requires two valid, genuinely different constructions in either order',()=>{
    const challenge={hour:9,minute:45,acceptedAnswers:buildAcceptedTimeAnswers(9,45)};
    for(const pair of [['九点三刻','差一刻十点'],['差一刻十点','九点三刻'],['差十五分十点','差一刻十点']]) expect(validateHardTimeAnswers(challenge,pair.map(v=>[...v])).success).toBe(true);
    expect(validateHardTimeAnswers(challenge,[[...'九点四十五分'],[...'九点四十五']])).toMatchObject({valid:true,distinct:false,success:false});
    expect(validateHardTimeAnswers(challenge,[[...'九点三刻'],[...'九点刻']]).success).toBe(false);
  });
  it('always generates bounded eligible rounds across the adaptive range',()=>{
    for(const difficulty of [0,20,50,80,100])for(let i=0;i<100;i++){const challenge=generateHardTimeChallenge(difficulty,()=>i/100);expect(new Set(challenge.acceptedAnswers.map(a=>a.structure)).size).toBeGreaterThanOrEqual(2);}
  });
});
describe('difficulty and score',()=>{
  it('separates difficulty, score, streak and mastery',()=>{
    const answer=buildAcceptedTimeAnswers(3,15).find(a=>a.hanzi==='三点一刻')!;
    let state=initialTimeStats;
    const bonuses:number[]=[];
    for(let i=0;i<8;i++){const result=scoreTimeAnswer(state,answer);state=result.stats;bonuses.push(result.streakBonus);}
    expect(bonuses).toEqual([0,0,1,1,2,2,2,3]);expect(state.difficulty).toBe(45);
    expect(state.score).toBeGreaterThan(state.difficulty);expect(state.masteryBonusTotal).toBe(16);
    expect(scoreTimeAnswer({...state,difficulty:100},answer).stats.difficulty).toBe(100);
    expect(scoreTimeAnswer({...state,difficulty:0,score:0},undefined).stats).toMatchObject({difficulty:0,score:0,streak:0});
    expect(scoreTimeAnswer({...state,difficulty:35},answer).stats.score-state.score).toBe(13);
    expect(scoreTimeAnswer({...state,difficulty:70},answer).stats.score-state.score).toBe(17);
  });
});
describe('clocks and speech',()=>{
  it('computes hands and prevents visual repeats',()=>{
    expect(clockAngles(3,30)).toEqual({hourAngle:105,minuteAngle:180});
    expect(clockAngles(11,48)).toEqual({hourAngle:354,minuteAngle:288});
    expect(clockVariants).toHaveLength(6);
    const history:typeof clockVariants[number][]=['classic','cream'];
    expect(isAnalog(nextClockVariant(history,()=>0))).toBe(false);
    expect(nextClockVariant(['modern'],()=>0)).not.toBe('modern');
  });
  it('parses Hanzi and pinyin without unrelated words',()=>{
    expect(normalizeTimeSpeech('现在三点一刻')).toEqual(['三','点','一','刻']);
    expect(normalizeTimeSpeech('san dian shi wu fen')).toEqual(['三','点','十','五','分']);
    expect(normalizeTimeSpeech('sāndiǎn')).toEqual(['三','点']);
    expect(normalizeTimeSpeech('banana')).toEqual([]);
    expect(normalizeTimeSpeech('你三点')).toEqual([]);
  });
});
