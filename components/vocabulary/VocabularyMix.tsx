'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { CurriculumScope } from '@/data/types';
import type { ActiveWord, ContentLevel } from '@/lib/vocabulary';
import { vocabularyCatalog } from '@/lib/vocabulary';
import { contextForWord, imageForWord, availablePracticeTypes } from '@/lib/vocabulary-media';
import { evaluateMix, mixStats, startMix, type PracticeType } from '@/lib/vocabulary-review';
import { useVocabularyState } from './useVocabularyState';
import { VocabularyExample } from './VocabularyCard';
import { LinkedChineseText } from '../LinkedChineseText';
import { Hanzi } from '../Hanzi';
import { PinyinText } from '../PinyinText';
import { SpeakButton } from '../SpeakButton';

export function VocabularyMix({ words, scope, level, userId, route }: { words: ActiveWord[]; scope: CurriculumScope; level: ContentLevel; userId: string; route: string }) {
  const { data, ready, update } = useVocabularyState(userId);
  const [size, setSize] = useState(10);
  const [mode, setMode] = useState<PracticeType | 'mixed'>('mixed');
  const [failedImage, setFailedImage] = useState('');
  const session = data.sessions[scope];
  const card = session?.queue[session.index];
  const word = card && vocabularyCatalog.find(w => w.id === card.wordId);
  const image = word && imageForWord(word.id);
  const context = word && contextForWord(word.id);
  const unavailable = card && (!word || (card.type === 'image' && (!image || failedImage === word?.id)) || (card.type === 'context' && !context));
  const completed = session && !card;
  function start() {
    update(previous => {
      const next = startMix(words, size, scope, level, previous.progress, crypto.randomUUID(), Date.now(), Math.random, entry => {
        const types = availablePracticeTypes(entry);
        return mode === 'mixed' ? types[Math.floor(Math.random() * types.length)] : types.includes(mode) ? mode : 'hanzi';
      });
      return { ...previous, sessions: { ...previous.sessions, [scope]: next } };
    });
  }
  function changeSession(patch: { revealed?: boolean; paused?: boolean }) { update(previous => ({ ...previous, sessions: { ...previous.sessions, [scope]: { ...previous.sessions[scope], ...patch } } })); }
  function evaluate(known: boolean) {
    const position = session?.index;
    update(previous => {
      const current = previous.sessions[scope];
      if (!current || current.index !== position || unavailable) return previous;
      const result = evaluateMix(current, previous.progress, known, Date.now());
      return { ...previous, progress: result.progress, sessions: { ...previous.sessions, [scope]: result.session } };
    });
  }
  const settings = <div className="vocabulary-mix-settings"><label>Palabras<select value={size} onChange={e => setSize(Number(e.target.value))}>{[5, 10, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}</select></label><label>Tipo de pista<select value={mode} onChange={e => setMode(e.target.value as typeof mode)}><option value="mixed">Mixto</option><option value="hanzi">Hanzi → lectura y significado</option><option value="image">Imagen → chino</option><option value="context">Contexto → palabra</option></select></label><p>Sin imagen o contexto revisado se usa Hanzi. La pista se indica en cada tarjeta.</p></div>;
  if (!session || completed) {
    const stats = session && mixStats(session);
    return <section className="vocabulary-mix"><h2>Vocabulario Mix</h2>{stats && <div role="status"><h3>Sesión terminada · recuerdo autoevaluado</h3><p>{stats.unique} palabras únicas · {stats.attempts} respuestas autoevaluadas · {stats.attempts - stats.unique} intentos de repaso.</p><p>{stats.remembered} respuestas «Lo sé» · {stats.pending} palabras pendientes de repaso.</p></div>}{settings}<p>{words.length} palabras disponibles · {level === 'basic' ? 'Básico · Esencial' : 'Hard · Ampliado'}</p><button type="button" disabled={!ready || !words.length} onClick={start}>{completed ? 'Nueva sesión' : 'Empezar'}</button></section>;
  }
  if (session.paused) return <section className="vocabulary-mix"><h2>Sesión en pausa</h2><p>Tu tarjeta y respuesta revelada se conservan en este dispositivo.</p><button type="button" onClick={() => changeSession({ paused: false })}>Reanudar</button><button type="button" onClick={() => update(previous => { const sessions = { ...previous.sessions }; delete sessions[scope]; return { ...previous, sessions }; })}>Finalizar sesión en curso</button></section>;
  return <section className="vocabulary-mix" aria-label="Vocabulario Mix"><header><span>Tarjeta {session.index + 1} de {session.queue.length} · {session.level === 'basic' ? 'Básico' : 'Hard'}</span><button type="button" onClick={() => changeSession({ paused: true })}>Pausar</button></header>
    <article key={`${session.id}-${session.index}`} className="vocabulary-mix-card">
      <p className="eyebrow">{card.type === 'image' ? 'Imagen → chino' : card.type === 'context' ? 'Contexto → palabra' : 'Hanzi → lectura y significado'}</p>
      {unavailable ? <><p role="status">Esta pista no está disponible. No cuenta como fallo.</p><button type="button" onClick={() => update(previous => { const current = previous.sessions[scope]; return { ...previous, sessions: { ...previous.sessions, [scope]: { ...current, queue: current.queue.filter((_, i) => i !== current.index), revealed: false } } }; })}>Saltar sin evaluar</button></> : word && <>
        {!session.revealed ? <>
          <p>{card.type === 'hanzi' ? 'Recuerda cómo se lee y qué significa.' : 'Recuerda la palabra china y su pronunciación.'}</p>
          {card.type === 'hanzi' ? <div className="vocabulary-mix-hanzi"><Hanzi>{word.hanzi}</Hanzi></div> : card.type === 'image' && image?.src ? <Image unoptimized src={image.src} alt={image.alt} width={384} height={384} onError={() => setFailedImage(word.id)}/> : context && <><p className="vocabulary-context"><Hanzi>{context.clue}</Hanzi></p><p>{context.hint}</p><small>Consigna de práctica Míng sobre una oración documentada.</small></>}
          <button type="button" className="vocabulary-reveal" onClick={() => changeSession({ revealed: true })}>Ver respuesta</button>
        </> : <>
          <div className="vocabulary-word-row"><h2 className="vocabulary-mix-hanzi"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></h2><SpeakButton text={word.hanzi} reading={word.pinyin} compact/></div><p><PinyinText>{word.pinyin}</PinyinText></p><p>{word.spanish}</p>
          <p>Compara también tu pronunciación con el audio disponible.</p>
          <div className="vocabulary-evaluation"><button type="button" onClick={() => evaluate(false)}>No lo sé</button><button type="button" onClick={() => evaluate(true)}>Lo sé</button></div>
          <details><summary>Consultar ejemplo</summary><VocabularyExample word={word} scope={scope} route={route}/></details>
        </>}
      </>}
    </article>
    <details className="vocabulary-help"><summary>Cómo autoevaluarte</summary><p>Lo sé: recordé la respuesta antes de revelarla.</p><p>No lo sé: no la recordé, me confundí o la reconocí solo después de verla.</p><p>Este recuerdo es autoevaluado; no evalúa pronunciación ni escritura.</p></details>
  </section>;
}
