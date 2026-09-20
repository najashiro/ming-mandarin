'use client';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { minuteHelpCards, timeTokens } from '@/data/time-game';
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
  const [challengeToken,setChallengeToken]=useState<string|null>(null),[rankingName,setRankingName]=useState(canCompete?playerName:''),[saving,setSaving]=useState(false),[saved,setSaved]=useState(false),[guestReady,setGuestReady]=useState(canCompete),[skipRanking,setSkipRanking]=useState(false);
  const phaseRef=useRef<Phase>('idle'),statsRef=useRef(stats),deadline=useRef(0),pauseAt=useRef(0),transition=useRef(false),roundTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const setGamePhase=(next:Phase)=>{phaseRef.current=next;setPhase(next);};
  useEffect(()=>{statsRef.current=stats;},[stats]);
  const speechTokens=useCallback((tokens:string[])=>{setAnswer(current=>[...current,...tokens]);},[]);
  const speech=useChineseSpeechRecognition(speechTokens);
  const nextRound=useCallback((difficulty:number)=>{setChallenge(generateTimeChallenge(difficulty));setHistory(previous=>[...previous.slice(-2),nextClockVariant(previous)]);setAnswer([]);setFeedback(null);transition.current=false;setTransitioning(false);setGamePhase('playing');},[]);
  const finish=useCallback(()=>{
    if(phaseRef.current==='finished')return;
    setGamePhase('finished');if(roundTimer.current)clearTimeout(roundTimer.current);speech.stop();stopTimeAudio();setSeconds(0);
  },[speech]);
  useEffect(()=>{if(phase!=='playing'||mode!=='challenge')return;const timer=window.setInterval(()=>{const left=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setSeconds(left);if(left===0)void finish();},200);return()=>window.clearInterval(timer);},[phase,mode,finish]);
  useEffect(()=>()=>{if(roundTimer.current)clearTimeout(roundTimer.current);stopTimeAudio();},[]);
  function start(){
    transition.current=false;setTransitioning(false);setStats(initialTimeStats);statsRef.current=initialTimeStats;setAnswer([]);setBonus('');setSaveError('');setPosition(null);setRanking([]);setSaved(false);setSaving(false);setSkipRanking(false);setRankingName(guestReady?rankingName:'');setChallengeToken(null);
    setChallenge(generateTimeChallenge(0));setHistory([nextClockVariant([])]);setSeconds(420);deadline.current=Date.now()+420000;setGamePhase('playing');
    void playTimeAudio('现在几点？');
    if(mode==='challenge')void fetch('/api/games/time',{method:'PUT'})
      .then(async response=>{if(!response.ok)throw new Error();return response.json() as Promise<{token:string}>;})
      .then(data=>setChallengeToken(data.token))
      .catch(()=>setChallengeToken(null));
  }
  async function saveRanking(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(saving||saved||!challengeToken)return;
    const name=rankingName.trim().replace(/\s+/g,' ').slice(0,40);
    if(name.length<2){setSaveError('Escribe un nombre de al menos 2 caracteres.');return;}
    setSaving(true);setSaveError('');
    try{
      if(!guestReady){
        const guest=await fetch('/api/auth/guest',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({displayName:name})});
        if(!guest.ok)throw new Error('No se pudo crear el perfil para guardar tu ranking.');
        setGuestReady(true);
      }
      const response=await fetch('/api/games/time',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token:challengeToken,name,score:stats.score,maxDifficulty:stats.maxDifficulty,correctAnswers:stats.correct,maxStreak:stats.maxStreak,masteryBonusTotal:stats.masteryBonusTotal})});
      if(!response.ok){const data=await response.json().catch(()=>({})) as {error?:string};throw new Error(data.error||'No se pudo guardar el ranking.');}
      const data=await response.json() as {rank:number|null;ranking:RankRow[]};setPosition(data.rank);setRanking(data.ranking);setSaved(true);
    }catch(error){setSaveError(error instanceof Error?error.message:'No se pudo guardar el ranking. Inténtalo de nuevo.');}
    finally{setSaving(false);}
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
    {phase==='idle'?<div className="time-start"><h3 className="font-hanzi" lang="zh-CN">现在几点？</h3><p>Xiànzài jǐ diǎn?</p><small>¿Qué hora es?</small><p>Mira el reloj y responde en chino.</p><div className="time-modes"><button type="button" aria-pressed={mode==='practice'} onClick={()=>setMode('practice')}><Hanzi>练习</Hanzi><small>Practicar</small></button><button type="button" aria-pressed={mode==='challenge'} onClick={()=>setMode('challenge')}><Hanzi>挑战 · 7分钟</Hanzi><small>Reto · 7 min</small></button></div><button className="button-primary" type="button" onClick={()=>void start()}><Hanzi>开始</Hanzi><small>Comenzar</small></button></div>
    :phase==='finished'?<div className="time-result"><h3>Tu resultado</h3><strong>{stats.score} puntos</strong>{saved?<p>Ranking guardado{position?` · Puesto #${position}`:''}</p>:skipRanking?<p>Resultado no guardado.</p>:challengeToken?<form className="time-ranking-form" onSubmit={event=>void saveRanking(event)}><p>¿Quieres guardar tu resultado en el ranking? Completa tu nombre.</p><label htmlFor="time-ranking-name">Nombre</label><input id="time-ranking-name" value={rankingName} onChange={event=>setRankingName(event.target.value)} minLength={2} maxLength={40} required autoComplete="nickname"/><button className="button-primary" type="submit" disabled={saving}>{saving?'Guardando…':'Guardar en el ranking'}</button><button type="button" onClick={()=>setSkipRanking(true)} disabled={saving}>Ahora no</button></form>:<p>Has terminado el reto. El ranking no está disponible en este momento.</p>}{saveError&&<p role="alert">{saveError}</p>}<button type="button" onClick={()=>{setGamePhase('idle');setChallengeToken(null);}}>Jugar otra vez</button><div className="time-ranking">{ranking.map(row=><div key={`${row.rank}-${row.player_name}`}><b>#{row.rank}</b><span>{row.player_name}</span><strong>{row.score}</strong></div>)}</div></div>
    :<>
      <div className="time-hud"><div><small>Dificultad {stats.difficulty}</small><progress max="100" value={stats.difficulty} style={{accentColor:stats.difficulty<35?'#4b9a69':stats.difficulty<70?'#e6a441':'#c85142'}}/></div><div className="time-score">{bonus&&<span role="status" className="time-bonus">{bonus}</span>}<b>{stats.score}</b><small>puntos</small></div><div className="time-timer" aria-live="off">{mode==='practice'?'∞':format(seconds)}</div></div>
      <div className="time-question"><span className="font-hanzi">现在几点？</span><button aria-label="Escuchar 现在几点？" disabled={transitioning} onClick={()=>void playTimeAudio('现在几点？')}>🔊</button></div>
      <ClockVisual hour={challenge.hour} minute={challenge.minute} variant={history.at(-1)??'classic'}/>
      <div className="time-starter"><span className="font-hanzi">现在</span><button aria-label="Escuchar 现在" disabled={transitioning} onClick={()=>void playTimeAudio('现在')}>🔊</button><span>……</span></div>
      <div className={`time-answer ${feedback??''}`} aria-label="Respuesta construida">{answer.length?answer.map((char,index)=><span className="font-hanzi" key={index}>{char}</span>):<span className="placeholder">Toca los caracteres</span>}</div>
      {phase==='practiceCorrection'?<div className="time-correction"><small>Respuesta correcta</small><div><strong className="font-hanzi">{correction.hanzi}</strong><button aria-label="Escuchar respuesta correcta" onClick={()=>void playTimeAudio(`现在${correction.hanzi}`)}>🔊</button></div><span>{correction.pinyin}</span><button className="button-primary" onClick={()=>nextRound(stats.difficulty)}><Hanzi>继续</Hanzi> · Continuar</button></div>
      :<><div className="time-controls"><button onClick={()=>setAnswer(current=>current.slice(0,-1))} disabled={!answer.length||transitioning}>← Borrar</button><button className="button-primary" onClick={()=>void confirm()} disabled={!answer.length||transitioning}>✓ Confirmar</button></div>
      <div className="time-palette">{timeTokens.map(token=><button type="button" className="font-hanzi" key={token.hanzi} aria-label={`Añadir ${token.hanzi}`} disabled={transitioning} onClick={()=>{setAnswer(current=>[...current,token.hanzi]);void playTimeAudio(token.hanzi);}}>{token.hanzi}</button>)}</div></>}
      {phase==='playing'&&!transitioning&&<button className="time-help-trigger" onClick={openHelp}>? Ayuda</button>}
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
          <small>Respuesta</small>
          <strong className="font-hanzi" lang="zh-CN">现在{correction.hanzi}</strong>
          <span>Xiànzài {correction.pinyin}</span>
          <p>Ahora {challenge.hour === 1 ? 'es la' : 'son las'} {challenge.hour}:{String(challenge.minute).padStart(2, '0')}.</p>
        </section>
        <section className="time-minute-guide" aria-labelledby="time-minute-title">
          <h4 id="time-minute-title">Cómo decir los minutos · <span className="font-hanzi" lang="zh-CN">分</span> fēn</h4>
          <p>¿Cuándo se puede omitir <span className="font-hanzi" lang="zh-CN">分</span>?</p>
          <div className="time-minute-cards">
            {minuteHelpCards.map(card => <article className="time-minute-card" key={card.range}>
              <b>{card.range}</b>
              {card.forms.map(form => <div className="time-minute-card-form" key={form.example}>
                <span>{form.label && `${form.label} min · `}{form.pattern}</span>
                <strong className="font-hanzi" lang="zh-CN">{form.example}</strong>
                <small>{form.pinyin}</small>
                {form.label && <button type="button" className="time-help-audio" aria-label={`Escuchar ${form.example}`} onClick={() => void playTimeAudio(`现在${form.example}`)}>🔊 <span>Escuchar</span></button>}
              </div>)}
              <em>{card.note}</em>
            </article>)}
          </div>
        </section>
        <small>Voz generada por IA.</small>
      </div></div>}
    </>}
  </section>;
}
