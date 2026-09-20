'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { timeHelp, timeTokens } from '@/data/time-game';
import { Hanzi } from '@/components/Hanzi';
import { ClockVisual } from './ClockVisual';
import { playTimeAudio, stopTimeAudio } from '@/lib/time-audio';
import { normalizeTimeSpeech } from '@/lib/time-speech';
import { generateTimeChallenge, initialTimeStats, nextClockVariant, scoreTimeAnswer, validateTimeAnswer, type ClockVariant, type TimeChallenge, type TimeStats } from '@/lib/time-game';

type Phase='idle'|'playing'|'pausedForHelp'|'practiceCorrection'|'finished';
type Mode='practice'|'challenge';
type RankRow={rank:number;player_name:string;score:number};
type RecognitionResult={results:ArrayLike<ArrayLike<{transcript:string}>>};
type Recognition={lang:string;continuous:boolean;interimResults:boolean;onresult:((event:RecognitionResult)=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void};
function useChineseSpeechRecognition(onTokens:(tokens:string[])=>void) {
  const [available,setAvailable]=useState(false),[listening,setListening]=useState(false),[error,setError]=useState('');
  const recognizer=useRef<Recognition|null>(null);
  useEffect(()=>{
    const host=window as Window & {SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};
    const Constructor=host.SpeechRecognition??host.webkitSpeechRecognition;
    if(!Constructor) return;
    const instance=new Constructor(); instance.lang='zh-CN';instance.continuous=false;instance.interimResults=false;
    instance.onresult=event=>{const tokens=normalizeTimeSpeech(event.results[0]?.[0]?.transcript??'');if(tokens.length) onTokens(tokens);else setError('No se reconoció la hora. Puedes tocar los caracteres.');};
    instance.onerror=()=>{setListening(false);setError('Micrófono no disponible. Puedes responder tocando los caracteres.');};
    instance.onend=()=>setListening(false);
    recognizer.current=instance;queueMicrotask(()=>setAvailable(true));
    return ()=>{instance.stop();recognizer.current=null;};
  },[onTokens]);
  const toggle=()=>{if(!recognizer.current)return; if(listening){recognizer.current.stop();setListening(false);return;}try{setError('');recognizer.current.start();setListening(true);}catch{setError('Micrófono no disponible. Puedes responder tocando los caracteres.');}};
  return {available,listening,error,toggle,stop:()=>recognizer.current?.stop()};
}
function format(seconds:number){return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}
export function TimeGame({playerName,canCompete}:{playerName:string;canCompete:boolean}) {
  const [phase,setPhase]=useState<Phase>('idle'),[mode,setMode]=useState<Mode>('practice');
  const [challenge,setChallenge]=useState<TimeChallenge>(()=>generateTimeChallenge(0));
  const [history,setHistory]=useState<ClockVariant[]>([]),[answer,setAnswer]=useState<string[]>([]);
  const [transitioning,setTransitioning]=useState(false);
  const [stats,setStats]=useState<TimeStats>(initialTimeStats),[feedback,setFeedback]=useState<'correct'|'incorrect'|null>(null);
  const [seconds,setSeconds]=useState(420),[bonus,setBonus]=useState(''),[ranking,setRanking]=useState<RankRow[]>([]),[position,setPosition]=useState<number|null>(null),[saveError,setSaveError]=useState('');
  const [sessionId,setSessionId]=useState<string|null>(null),[optedIn,setOptedIn]=useState(true);
  const phaseRef=useRef<Phase>('idle'),statsRef=useRef(stats),modeRef=useRef(mode),deadline=useRef(0),pauseAt=useRef(0),submitted=useRef(false),transition=useRef(false),roundTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const setGamePhase=(next:Phase)=>{phaseRef.current=next;setPhase(next);};
  useEffect(()=>{statsRef.current=stats;},[stats]);
  const speechTokens=useCallback((tokens:string[])=>{setAnswer(current=>[...current,...tokens]);},[]);
  const speech=useChineseSpeechRecognition(speechTokens);
  const nextRound=useCallback((difficulty:number)=>{setChallenge(generateTimeChallenge(difficulty));setHistory(previous=>[...previous.slice(-2),nextClockVariant(previous)]);setAnswer([]);setFeedback(null);transition.current=false;setTransitioning(false);setGamePhase('playing');},[]);
  const finish=useCallback(async(retry=false)=>{
    if(phaseRef.current==='finished'&&!retry)return;
    setGamePhase('finished');if(roundTimer.current)clearTimeout(roundTimer.current);speech.stop();stopTimeAudio();setSeconds(0);
    if(submitted.current||modeRef.current!=='challenge')return;
    submitted.current=true;
    try {
      const response=await fetch('/api/games/time',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sessionId,score:statsRef.current.score,maxDifficulty:statsRef.current.maxDifficulty,correctAnswers:statsRef.current.correct,maxStreak:statsRef.current.maxStreak,masteryBonusTotal:statsRef.current.masteryBonusTotal})});
      if(!response.ok)throw new Error('No se pudo guardar el resultado.');
      const data=await response.json() as {rank:number|null;ranking:RankRow[];optedIn:boolean};setPosition(data.rank);setRanking(data.ranking);setOptedIn(data.optedIn);setSaveError('');
    }catch{setSaveError('No se pudo guardar el resultado. Inténtalo de nuevo.');submitted.current=false;}
  },[sessionId,speech]);
  useEffect(()=>{if(phase!=='playing'||mode!=='challenge')return;const timer=window.setInterval(()=>{const left=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setSeconds(left);if(left===0)void finish();},200);return()=>window.clearInterval(timer);},[phase,mode,finish]);
  useEffect(()=>()=>{if(roundTimer.current)clearTimeout(roundTimer.current);stopTimeAudio();},[]);
  async function start(){
    modeRef.current=mode;submitted.current=false;transition.current=false;setTransitioning(false);setStats(initialTimeStats);statsRef.current=initialTimeStats;setAnswer([]);setBonus('');setSaveError('');setPosition(null);setRanking([]);setOptedIn(true);
    setChallenge(generateTimeChallenge(0));setHistory([nextClockVariant([])]);setSeconds(420);deadline.current=Date.now()+420000;setGamePhase('playing');
    void playTimeAudio('现在几点？');
    if(mode==='challenge'){
      try{const response=await fetch('/api/games/time',{method:'PUT'});if(!response.ok)throw new Error();const data=await response.json() as {sessionId:string};setSessionId(data.sessionId);}
      catch{stopTimeAudio();setGamePhase('idle');setSaveError('No se pudo iniciar el reto. Inténtalo de nuevo.');}
    }else setSessionId(null);
  }
  function openHelp(){if(phase==='playing'&&mode==='challenge')pauseAt.current=Date.now();setGamePhase('pausedForHelp');}
  function closeHelp(){if(mode==='challenge')deadline.current+=Date.now()-pauseAt.current;setGamePhase('playing');}
  async function confirm(){
    if(phaseRef.current!=='playing'||transition.current||!answer.length)return;
    const matched=validateTimeAnswer(challenge,answer);transition.current=true;setTransitioning(true);speech.stop();
    const result=scoreTimeAnswer(statsRef.current,matched);statsRef.current=result.stats;setStats(result.stats);setFeedback(matched?'correct':'incorrect');
    if(matched){
      const parts=[result.streakBonus?`${result.stats.streak} aciertos seguidos +${result.streakBonus}`:'',result.bonus?`${matched.structure==='cha'?'差':matched.structure==='half'?'半':'一刻'} +${result.bonus}`:''].filter(Boolean);
      if(parts.length){setBonus(`BONUS! ${parts.join(' · ')}`);window.setTimeout(()=>setBonus(''),1500);}
      await playTimeAudio(`现在${matched.hanzi}`);
      if(phaseRef.current==='playing')nextRound(result.stats.difficulty);
    }else if(mode==='practice'){setGamePhase('practiceCorrection');}
    else roundTimer.current=setTimeout(()=>{if(phaseRef.current==='playing')nextRound(result.stats.difficulty);},600);
  }
  const correction=challenge.acceptedAnswers[0];
  return <section className="time-game">
    {phase==='idle'?<div className="time-start"><h3 className="font-hanzi" lang="zh-CN">现在几点？</h3><p>Xiànzài jǐ diǎn?</p><small>¿Qué hora es?</small><p>Mira el reloj y responde en chino.</p><div className="time-modes"><button type="button" aria-pressed={mode==='practice'} onClick={()=>setMode('practice')}><Hanzi>练习</Hanzi><small>Practicar</small></button><button type="button" aria-pressed={mode==='challenge'} onClick={()=>setMode('challenge')}><Hanzi>挑战 · 7分钟</Hanzi><small>Reto · 7 min</small></button></div>{mode==='challenge'&&!canCompete&&<p><a href="/login">Inicia sesión para competir.</a></p>}{saveError&&<p role="alert">{saveError}</p>}<button className="button-primary" type="button" disabled={mode==='challenge'&&!canCompete} onClick={()=>void start()}><Hanzi>开始</Hanzi><small>Comenzar</small></button></div>
    :phase==='finished'?<div className="time-result"><h3>{playerName}</h3><strong>{stats.score} puntos</strong><p>{position?`Puesto #${position}`:'Ranking'}</p>{saveError&&<p role="alert">{saveError}<button onClick={()=>void finish(true)}>Reintentar</button></p>}{!optedIn&&!saveError&&<p>Resultado guardado. <a href="/profile">Activa tu participación en el perfil</a> para aparecer en el ranking.</p>}<button className="button-primary" onClick={()=>{setGamePhase('idle');setSessionId(null);}}>Jugar otra vez</button><div className="time-ranking">{ranking.map(row=><div key={`${row.rank}-${row.player_name}`}><b>#{row.rank}</b><span>{row.player_name}</span><strong>{row.score}</strong></div>)}</div></div>
    :<>
      <div className="time-hud"><div><small>Dificultad {stats.difficulty}</small><progress max="100" value={stats.difficulty} style={{accentColor:stats.difficulty<35?'#4b9a69':stats.difficulty<70?'#e6a441':'#c85142'}}/></div><div className="time-score">{bonus&&<span role="status" className="time-bonus">{bonus}</span>}<b>{stats.score}</b><small>puntos</small></div><div className="time-timer" aria-live="off">{mode==='practice'?'∞':format(seconds)}</div></div>
      <div className="time-question"><span className="font-hanzi">现在几点？</span><button aria-label="Escuchar 现在几点？" disabled={transitioning} onClick={()=>void playTimeAudio('现在几点？')}>🔊</button></div>
      <ClockVisual hour={challenge.hour} minute={challenge.minute} variant={history.at(-1)??'classic'}/>
      <div className="time-starter"><span className="font-hanzi">现在</span><button aria-label="Escuchar 现在" disabled={transitioning} onClick={()=>void playTimeAudio('现在')}>🔊</button><span>……</span></div>
      <div className={`time-answer ${feedback??''}`} aria-label="Respuesta construida">{answer.length?answer.map((char,index)=><span className="font-hanzi" key={index}>{char}</span>):<span className="placeholder">Toca los caracteres o habla</span>}</div>
      {phase==='practiceCorrection'?<div className="time-correction"><small>Respuesta correcta</small><div><strong className="font-hanzi">{correction.hanzi}</strong><button aria-label="Escuchar respuesta correcta" onClick={()=>void playTimeAudio(`现在${correction.hanzi}`)}>🔊</button></div><span>{correction.pinyin}</span><button className="button-primary" onClick={()=>nextRound(stats.difficulty)}><Hanzi>继续</Hanzi> · Continuar</button></div>
      :<><div className="time-controls"><button aria-label="Hablar" aria-pressed={speech.listening} disabled={!speech.available||transitioning} onClick={speech.toggle}>🎤 <span>Hablar</span></button><button onClick={()=>setAnswer(current=>current.slice(0,-1))} disabled={!answer.length||transitioning}>← Borrar</button><button className="button-primary" onClick={()=>void confirm()} disabled={!answer.length||transitioning}>✓ Confirmar</button></div>{(!speech.available||speech.error)&&<small className="time-speech-note">{speech.error||'Micrófono no disponible. Puedes responder tocando los caracteres.'}</small>}
      <div className="time-palette">{timeTokens.map(token=><button type="button" className="font-hanzi" key={token.hanzi} aria-label={`Añadir ${token.hanzi}`} disabled={transitioning} onClick={()=>{setAnswer(current=>[...current,token.hanzi]);void playTimeAudio(token.hanzi);}}>{token.hanzi}</button>)}</div></>}
      {phase==='playing'&&!transitioning&&<button className="time-help-trigger" onClick={openHelp}>? Help</button>}
      {phase === 'pausedForHelp' && <div className="time-help-backdrop"><div className="time-help" role="dialog" aria-modal="true" aria-label="Ayuda">
        <button className="time-help-close" onClick={closeHelp}>Cerrar</button>
        <h3 className="font-hanzi">帮助</h3>
        <p>Bāngzhù · Ayuda</p>
        <section className="time-help-example time-help-question">
          <small>Pregunta</small>
          <strong className="font-hanzi" lang="zh-CN">现在几点？</strong>
          <span>Xiànzài jǐ diǎn?</span>
          <p>¿Qué hora es?</p>
        </section>
        <section className="time-help-example time-help-answer">
          <small>Respuesta para este reloj</small>
          <strong className="font-hanzi" lang="zh-CN">现在{correction.hanzi}</strong>
          <span>Xiànzài {correction.pinyin}</span>
          <p>Ahora {challenge.hour === 1 ? 'es la' : 'son las'} {challenge.hour}:{String(challenge.minute).padStart(2, '0')}.</p>
        </section>
        {timeHelp.map(([hanzi, pinyin, meaning]) => <div key={hanzi}><strong className="font-hanzi">{hanzi}</strong><span>{pinyin}</span><small>{meaning}</small></div>)}
        <p>三点 = 3:00 · 三点十五分 = 3:15 · 三点一刻 = 3:15<br/>三点三十分 = 3:30 · 三点半 = 3:30<br/>三点四十五分 = 3:45 · 差一刻四点 = 3:45<br/>差五分八点 = 7:55</p>
        <small>Voz generada por IA.</small>
      </div></div>}
    </>}
  </section>;
}
