'use client';
import { audioForMandarinText } from '@/lib/mandarin-audio';
let current: HTMLAudioElement | null = null;
let settleCurrent: (()=>void)|null = null;
let audioRun=0;
export function stopTimeAudio() {
  audioRun++;settleCurrent?.();settleCurrent=null;
  current?.pause();current=null;
  if(typeof window!=='undefined')window.speechSynthesis?.cancel();
}
async function fallbackSpeech(hanzi:string,run:number) {
  if(typeof window==='undefined'||!window.speechSynthesis)return;
  const synth=window.speechSynthesis;
  let voice=synth.getVoices().find(item=>item.lang.toLowerCase().startsWith('zh-cn'));
  if(!voice) voice=await new Promise<SpeechSynthesisVoice|undefined>(resolve=>{
    const finish=()=>{synth.removeEventListener('voiceschanged',finish);clearTimeout(timer);resolve(synth.getVoices().find(item=>item.lang.toLowerCase().startsWith('zh-cn')));};
    const timer=window.setTimeout(finish,1200);synth.addEventListener('voiceschanged',finish,{once:true});
  });
  if(!voice||run!==audioRun)return;
  await new Promise<void>(resolve=>{
    const utterance=new SpeechSynthesisUtterance(hanzi);utterance.lang='zh-CN';utterance.voice=voice;utterance.rate=.9;
    let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(safety);settleCurrent=null;resolve();};
    const safety=window.setTimeout(finish,Math.max(4000,hanzi.length*900));
    settleCurrent=finish;utterance.onend=finish;utterance.onerror=finish;
    try{synth.speak(utterance);}catch{finish();}
  });
}
export async function playTimeAudio(hanzi:string):Promise<void> {
  stopTimeAudio();const run=audioRun;
  const clip=audioForMandarinText(hanzi);
  if(clip){
    const outcome=await new Promise<'ended'|'error'|'stopped'>(resolve=>{
      const audio=new Audio(clip);current=audio;let done=false;
      const finish=(result:'ended'|'error'|'stopped')=>{if(done)return;done=true;clearTimeout(safety);audio.onended=null;audio.onerror=null;settleCurrent=null;if(current===audio)current=null;resolve(result);};
      const safety=window.setTimeout(()=>finish('error'),Math.max(8000,hanzi.length*1200));
      settleCurrent=()=>finish('stopped');audio.onended=()=>finish('ended');audio.onerror=()=>finish('error');
      audio.play().catch(()=>finish('error'));
    });
    if(outcome==='ended'||outcome==='stopped'||run!==audioRun)return;
  }
  await fallbackSpeech(hanzi,run);
}
