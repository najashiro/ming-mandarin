'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { studyScopeOptions, getStudyScopeLabel } from '@/lib/study-options';
import type { CurriculumScope } from '@/data/types';
import { getVocabularyMixSet, vocabularyCatalog } from '@/lib/vocabulary';
import { evaluateMix, isMixComplete, mixStats, startMix, type MixResultSnapshot } from '@/lib/vocabulary-review';
import type { VocabularyMediaEntry } from '@/lib/vocabulary-media';
import { useVocabularyState } from './useVocabularyState';
import { VocabularyCard } from './VocabularyCard';
import { Hanzi } from '../Hanzi';
import { SpeakButton, stopMandarinAudio } from '../SpeakButton';

const sizes = [10, 20, 30, 50] as const;

function Scoreboard({ responded, correct, incorrect, total }: { responded: number; correct: number; incorrect: number; total: number }) {
  return <div className="vocabulary-mix-score" aria-label={`Respondidas: ${responded} de ${total}. Correctas: ${correct}. Incorrectas: ${incorrect}.`}>
    <span>Respondidas: <b>{responded}/{total}</b></span>
    <span className="is-correct">✓ Correctas: <b>{correct}</b></span>
    <span className="is-incorrect">✗ Incorrectas: <b>{incorrect}</b></span>
  </div>;
}

function snapshotOf(session: ReturnType<typeof startMix>): MixResultSnapshot {
  return { sessionId: session.id, scope: session.scope, requestedSize: session.requestedSize, actualSize: session.actualSize, deck: session.deck, answers: session.answers };
}

export function VocabularyMix({ scope, userId, route, media }: { scope: CurriculumScope; userId: string; route: string; media: readonly VocabularyMediaEntry[] }) {
  const router = useRouter();
  const { data, ready, update } = useVocabularyState(userId);
  const [sizeOverride, setSizeOverride] = useState<number | null>(null);
  const [backState, setBackState] = useState({ turn: '', value: false });
  const [autoPlayTurn, setAutoPlayTurn] = useState('');
  const [blockedTurn, setBlockedTurn] = useState('');
  const evaluating = useRef(false);
  const session = data.sessions[scope];
  const eligibleWords = useMemo(() => getVocabularyMixSet(scope), [scope]);
  const eligibleIds = useMemo(() => new Set(eligibleWords.map(word => word.id)), [eligibleWords]);
  const currentId = session?.deck[session.index];
  const turnKey = session ? `${session.id}:${session.index}` : '';
  const size = sizeOverride ?? session?.originResult?.requestedSize ?? session?.requestedSize ?? 10;
  const back = backState.turn === turnKey && backState.value;
  const autoPlayBlocked = blockedTurn === turnKey;
  const word = currentId ? vocabularyCatalog.find(entry => entry.id === currentId) : undefined;
  const complete = Boolean(session && isMixComplete(session));
  const stats = session ? mixStats(session) : { responded: 0, correct: 0, incorrect: 0, total: 0, percentage: 0, incorrectIds: [] as string[] };
  const currentRoute = `/study/${scope}/games/vocabulary-mix`;

  useEffect(() => () => stopMandarinAudio(), []);
  useEffect(() => {
    if (!ready || !session) return;
    if (session.userId === userId && session.deck.every(id => eligibleIds.has(id))) return;
    stopMandarinAudio();
    update(previous => {
      const sessions = { ...previous.sessions };
      delete sessions[scope];
      return { ...previous, sessions, legacyMixNotice: true };
    });
  }, [eligibleIds, ready, scope, session, update, userId]);

  function startNormal() {
    const id = crypto.randomUUID();
    const now = Date.now();
    update(previous => {
      const next = startMix({ words: eligibleWords, requestedSize: size, scope, userId, id, now, previousSequence: previous.lastSequences[scope] });
      return { ...previous, sessions: { ...previous.sessions, [scope]: next }, lastSequences: { ...previous.lastSequences, [scope]: next.deck } };
    });
    setBackState({ turn: '', value: false });
    setBlockedTurn('');
    setAutoPlayTurn(`${id}:0`);
  }

  function startReview() {
    if (!session || !stats.incorrectIds.length) return;
    const id = crypto.randomUUID();
    const words = stats.incorrectIds.map(id => vocabularyCatalog.find(word => word.id === id)).filter((entry): entry is (typeof vocabularyCatalog)[number] => Boolean(entry));
    const next = startMix({ words, requestedSize: words.length, scope, userId, id, now: Date.now(), kind: 'review', originSessionId: session.id, originResult: session.originResult ?? snapshotOf(session) });
    update(previous => ({ ...previous, sessions: { ...previous.sessions, [scope]: next } }));
    setBackState({ turn: '', value: false });
    setBlockedTurn('');
    setAutoPlayTurn(`${id}:0`);
  }

  function patchSession(patch: { revealed?: boolean; paused?: boolean }) {
    update(previous => {
      const current = previous.sessions[scope];
      if (!current || current.id !== session?.id) return previous;
      return { ...previous, sessions: { ...previous.sessions, [scope]: { ...current, ...patch } } };
    });
  }

  function evaluate(known: boolean) {
    if (!session || !word || evaluating.current) return;
    evaluating.current = true;
    const expected = { sessionId: session.id, index: session.index, wordId: word.id };
    update(previous => {
      const current = previous.sessions[scope];
      if (!current) return previous;
      const result = evaluateMix(current, previous.progress, known, Date.now(), expected);
      return result.session === current ? previous : { ...previous, progress: result.progress, sessions: { ...previous.sessions, [scope]: result.session } };
    });
    stopMandarinAudio();
    setBackState({ turn: '', value: false });
    setBlockedTurn('');
    if (session.index + 1 < session.actualSize) setAutoPlayTurn(`${session.id}:${session.index + 1}`);
    window.setTimeout(() => { evaluating.current = false; }, 0);
  }

  const settings = <div className="vocabulary-mix-settings">
    <label>Contenido<select aria-label="Contenido" disabled={!ready} value={scope} onChange={event => router.push(`/study/${event.target.value}/games/vocabulary-mix`)}>{!studyScopeOptions.some(option => option.value === scope) && <option value={scope} disabled hidden>{getStudyScopeLabel(scope)}</option>}{studyScopeOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label>Palabras<select aria-label="Palabras" disabled={!ready} value={size} onChange={event => setSizeOverride(Number(event.target.value))}>{sizes.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
  </div>;

  if (!session) return <section className="vocabulary-mix vocabulary-mix-setup" aria-label="Preparar Vocabulario Mix">
    <p className="vocabulary-mix-instruction">Mira, escucha y recuerda el significado.</p>
    {data.legacyMixNotice && <div className="vocabulary-mix-notice" role="status"><span>El juego se actualizó. Tu progreso anterior se conserva; empieza una nueva partida.</span><button type="button" aria-label="Cerrar aviso" onClick={() => update(previous => ({ ...previous, legacyMixNotice: false }))}>×</button></div>}
    {settings}
    <p className="vocabulary-mix-available">{eligibleWords.length} palabras disponibles</p>
    {size > eligibleWords.length && eligibleWords.length > 0 && <p role="status">Hay {eligibleWords.length} palabras disponibles; esta partida tendrá {eligibleWords.length}.</p>}
    {!eligibleWords.length && <p role="status">No hay palabras elegibles para este contenido.</p>}
    <button className="vocabulary-mix-start" type="button" disabled={!ready || !eligibleWords.length} onClick={startNormal}>Empezar</button>
  </section>;

  if (complete) return <section className="vocabulary-mix vocabulary-mix-results" aria-label="Resultados de Vocabulario Mix">
    <h2>Partida terminada</h2>
    <p>{getStudyScopeLabel(session.scope)} · {session.actualSize} {session.actualSize === 1 ? 'palabra' : 'palabras'}</p>
    <Scoreboard {...stats}/>
    <p>{stats.percentage}% de aciertos autoevaluados.</p>
    {session.originResult && <p className="vocabulary-mix-origin">La ronda original se conserva por separado.</p>}
    {stats.incorrectIds.length > 0 && <details><summary>Ver incorrectas</summary><ul>{stats.incorrectIds.map(id => { const entry = vocabularyCatalog.find(word => word.id === id); return entry ? <li key={id}><Hanzi>{entry.hanzi}</Hanzi> · {entry.spanish}</li> : null; })}</ul></details>}
    {settings}
    <div className="vocabulary-mix-result-actions"><button type="button" onClick={startNormal}>Nueva partida</button>{stats.incorrectIds.length > 0 && <button type="button" onClick={startReview}>Repasar incorrectas ({stats.incorrectIds.length})</button>}<button type="button" onClick={() => router.push(`/study/${scope}/games`)}>Volver a Juegos</button></div>
  </section>;

  if (session.paused) return <section className="vocabulary-mix vocabulary-mix-paused" aria-label="Vocabulario Mix en pausa">
    <Scoreboard {...stats}/>
    <h2>Partida en pausa</h2>
    <p>{getStudyScopeLabel(session.scope)} · {session.actualSize} palabras</p>
    <button type="button" onClick={() => patchSession({ paused: false })}>Reanudar</button>
    <button type="button" onClick={() => { stopMandarinAudio(); update(previous => { const sessions = { ...previous.sessions }; delete sessions[scope]; return { ...previous, sessions }; }); }}>Finalizar partida en curso</button>
  </section>;

  if (!word) return <p role="status">La partida guardada ya no es compatible. Preparando una nueva configuración…</p>;

  return <section className="vocabulary-mix" aria-label="Vocabulario Mix">
    <header className="vocabulary-mix-round-header"><span>{getStudyScopeLabel(session.scope)} · {session.kind === 'review' ? 'Repaso' : `${session.actualSize} palabras`}</span><button type="button" onClick={() => { stopMandarinAudio(); patchSession({ paused: true }); }}>Pausar</button></header>
    <Scoreboard {...stats}/>
    <article key={`${session.id}-${session.index}`} className="vocabulary-mix-card">
      {!session.revealed ? <div className="vocabulary-mix-question">
        <div className={`vocabulary-mix-prompt${word.hanzi.length > 2 ? ' is-long' : ''}`}><Hanzi>{word.hanzi}</Hanzi></div>
        <SpeakButton text={word.hanzi} reading={word.pinyin} compact label="Escuchar" ariaLabel={`Escuchar ${word.hanzi}`} autoPlayKey={autoPlayTurn === turnKey ? autoPlayTurn : undefined} onAutoPlayBlocked={() => setBlockedTurn(turnKey)}/>
        {autoPlayBlocked && <small role="status">Pulsa el audio para escuchar.</small>}
      </div> : <VocabularyCard word={word} scope={scope} route={currentRoute || route} back={back} hideTranslation={false} media={media} onFlip={() => setBackState({ turn: turnKey, value: !back })} showFavorite={false}/>}
      {!session.revealed ? <button type="button" className="vocabulary-reveal" onClick={event => {
        // A second click on a rating can land on this newly rendered button.
        // Keyboard activation has detail 0 and must continue to work.
        if (event.detail > 1) return;
        patchSession({ revealed: true });
      }}>Ver respuesta</button> : <div className="vocabulary-evaluation">
        <button type="button" className="is-known" aria-label="Lo sabía" onClick={() => evaluate(true)}><Hanzi>知道</Hanzi><span>Lo sabía</span></button>
        <button type="button" className="is-unknown" aria-label="No lo sabía" onClick={() => evaluate(false)}><Hanzi>不知道</Hanzi><span>No lo sabía</span></button>
      </div>}
    </article>
    <details className="vocabulary-help"><summary>Cómo autoevaluarte</summary><p>Lo sabía: recordé el significado antes de ver la respuesta.</p><p>No lo sabía: no lo recordé, me confundí o lo reconocí solo al verlo.</p><p>Resultados según tu autoevaluación. No evalúa pronunciación ni escritura.</p></details>
  </section>;
}
