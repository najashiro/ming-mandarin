export type MasteryInput={previousMastery:number;previousStability:number;difficulty:number;correct:boolean;selfRating?:'know'|'doubt'|'unknown';now?:number};
export function computeMasteryUpdate(input:MasteryInput){
  const ratingFactor=input.selfRating==='know'?1:input.selfRating==='doubt'?.82:.65;
  const mastery=input.correct?Math.min(100,input.previousMastery+Math.max(4,12-input.difficulty)*ratingFactor):Math.max(0,input.previousMastery-9);
  const stability=input.correct?Math.min(365,input.previousStability*1.7+.5):Math.max(.2,(input.previousStability||1)*.55);
  const now=input.now??Date.now();
  const nextReviewAt=now+(input.correct?Math.max(1,Math.round(stability))*86_400_000:10*60_000);
  return {mastery,stability,nextReviewAt};
}
