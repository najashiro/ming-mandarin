'use client';

import { useState } from 'react';
import { SpeakButton } from './SpeakButton';

const script = [
  { system: '你好！', accepted: ['你好','你好！'], hint: 'Responde al saludo.' },
  { system: '请问，你叫什么名字？', accepted: ['我叫','我姓'], hint: 'Usa 我叫 + tu nombre.' },
  { system: '认识你很高兴。', accepted: ['认识你很高兴','我也很高兴'], hint: 'Devuelve el gusto de conocerle.' },
  { system: '你最近怎么样？', accepted: ['我很好','我很忙','我不太忙','还行','马马虎虎'], hint: 'Varias respuestas de la lección son válidas.' },
  { system: '我很好。你呢？', accepted: ['我很好','我也很好','我很忙','我不太忙','还行','马马虎虎'], hint: 'Responde sobre tu estado.' },
];

export function DialogueRoleplay() {
  const [step,setStep]=useState(0); const [answer,setAnswer]=useState(''); const [turns,setTurns]=useState<{speaker:string;text:string}[]>([]); const [message,setMessage]=useState('');
  const current=script[step%script.length];
  function send(){const normalized=answer.replace(/[。！？?\s]/g,''); const ok=current.accepted.some((item)=>normalized.includes(item.replace(/[。！？?\s]/g,''))); if(!ok){setMessage(current.hint);return;} setTurns(v=>[...v,{speaker:'Míng',text:current.system},{speaker:'Tú',text:answer}]);setAnswer('');setMessage('很好！ Respuesta válida.');setStep(v=>v+1);}
  return <div className="dialogue-grid"><section className="panel scene"><p className="eyebrow">PRIMER ENCUENTRO · NIVEL LIBRE</p><div className="chat-log">{turns.map((turn,i)=><div className={turn.speaker==='Tú'?'chat mine':'chat'} key={i}><small>{turn.speaker}</small><p>{turn.text}</p></div>)}<div className="chat"><small>Míng</small><p>{current.system}</p><SpeakButton text={current.system}/></div></div><label className="answer-input"><span>Tu respuesta</span><input value={answer} onChange={(e)=>setAnswer(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&send()} placeholder="Escribe una respuesta válida" /></label>{message&&<p className="rule-note">{message}</p>}<button className="button button-primary" type="button" onClick={send}>Responder →</button></section><aside className="panel"><p className="eyebrow">APOYOS</p><h2>Respuestas estudiadas</h2>{['我叫…','我姓…','认识你很高兴。','我很好。','我很忙。','我不太忙。','还行。','马马虎虎。'].map(item=><button className="phrase-chip" type="button" onClick={()=>setAnswer(item.replace('…',''))} key={item}>{item}</button>)}<p className="source-note">Se aceptan múltiples respuestas cuando las fuentes ofrecen alternativas.</p></aside></div>;
}
