'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Hanzi } from '@/components/Hanzi';
import { HanziWriterStage, type HanziWriterStageHandle } from '@/components/hanzi/HanziWriterStage';
import type { HanziAttemptPayload } from '@/lib/hanzi/types';
import type { CharacterEntry, CurriculumScope } from '@/data/types';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { isSuccessfulHanziAttempt } from '@/lib/hanzi/mastery';
import { gameWritingAttempt, hanziRecognitionChoices, meaningWithoutHanzi, writingHintShown } from '@/lib/games-hanzi-practice';
import { saveGameHanziAttempt } from '@/lib/games-hanzi-progress';
import { GameFeedback } from '../shared/GameFeedback';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';
import { WordListening } from './WordListening';
import { HiddenAudioButton } from './HiddenAudioButton';

const modes = ['Palabras', 'Audio', 'Significado', 'Radical', 'Escritura'] as const;
type Mode = typeof modes[number];
type CharacterMode = Exclude<Mode, 'Palabras'>;

function poolForMode(characters: CharacterEntry[], mode: Mode) {
  return characters.filter(item => mode === 'Audio' ? Boolean(audioForMandarinText(item.hanzi, item.pinyin))
    : mode === 'Radical' ? item.radicalAudited && Boolean(item.radical)
    : mode === 'Significado' || mode === 'Escritura' ? Boolean(meaningWithoutHanzi(item.meaning)) : true);
}

export function HanziLabGame({ characters, scope }: { characters: CharacterEntry[]; scope: CurriculumScope }) {
  const [mode, setMode] = useState<Mode>('Audio');
  const availableModes = modes.filter(value => value === 'Palabras' || (value === 'Radical'
    ? new Set(poolForMode(characters, value).map(item => item.radical)).size > 1
    : poolForMode(characters, value).length > 0));
  const activeMode = availableModes.includes(mode) ? mode : availableModes[0];
  const pool = poolForMode(characters, activeMode);
  return <div>
    <nav className="game-modes" aria-label="Modos Hanzi">{availableModes.map(value => <button type="button" aria-pressed={activeMode === value} key={value} onClick={() => setMode(value)}>{value}</button>)}</nav>
    {activeMode === 'Palabras' ? <WordListening key={scope} scope={scope} characters={characters}/> : <HanziSession key={`${scope}-${activeMode}`} characters={pool} scope={scope} mode={activeMode}/>}
    <p>Para explorar componentes o ver la formación del carácter, visita el <Link href={`/study/${scope}/hanzi`}>laboratorio Hanzi</Link>.</p>
  </div>;
}

function HanziSession({ characters, scope, mode }: { characters: CharacterEntry[]; scope: CurriculumScope; mode: CharacterMode }) {
  const session = useGameSession('hanzi-lab', scope, characters.length);
  const item = characters[session.index];
  const practiceModes = mode === 'Audio' || mode === 'Significado' ? [{ level: 1, label: 'Reconocer' }, { level: 3, label: 'Escribir de memoria' }] : [];
  if (session.finished) return <GameResult score={session.score} total={session.total} unresolved={session.unresolved} assisted={session.assisted} firstPassScore={session.firstPassScore} initialTotal={session.initialTotal} onRestart={session.restart}/>;
  return <div className="new-game hanzi-game">
    <GameProgress disabled={session.result !== null} level={session.level} onLevel={session.setLevel} round={session.round} total={session.total} modes={practiceModes}/>
    <HanziRound key={`${session.round}-${session.level}`} item={item} characters={characters} mode={mode} level={session.level} result={session.result} check={(correct, attempt, assisted = false) => {
      const recorded = session.check(correct, item.id, mode, assisted);
      if (recorded && attempt) void saveGameHanziAttempt(attempt);
    }} next={session.next}/>
  </div>;
}

function HanziRound({ item, characters, mode, level, result, check, next }: { item: CharacterEntry; characters: CharacterEntry[]; mode: CharacterMode; level: number; result: boolean | null; check: (correct: boolean, attempt?: HanziAttemptPayload, assisted?: boolean) => void; next: () => void }) {
  const [answer, setAnswer] = useState('');
  const [ready, setReady] = useState(false);
  const [writing, setWriting] = useState(false);
  const [recognizedStrokes, setRecognizedStrokes] = useState(0);
  const [error, setError] = useState(false);
  const [stageVersion, setStageVersion] = useState(0);
  const [options] = useState(() => mode === 'Escritura' ? [] : hanziRecognitionChoices(item, characters, mode));
  const stage = useRef<HanziWriterStageHandle>(null);
  const startedAt = useRef(0);
  const hintsUsed = useRef(0);
  const [hadHints, setHadHints] = useState(false);
  useEffect(() => { startedAt.current = performance.now(); }, []);
  const handwriting = mode === 'Escritura' || ((mode === 'Audio' || mode === 'Significado') && level === 3);
  const writingMode = mode === 'Escritura' ? 'guided' : 'independent';
  const target = mode === 'Radical' ? item.radical : item.hanzi;
  const audioSrc = mode === 'Audio' ? audioForMandarinText(item.hanzi, item.pinyin) : undefined;

  function recognize() {
    const correct = answer === target;
    // A radical task measures structure, so it does not update whole-character recognition mastery.
    const attempt: HanziAttemptPayload | undefined = mode === 'Radical' ? undefined : {
      characterId: item.id, mode: 'independent', skillDimension: 'recognition', completed: correct,
      correctStrokes: 0, mistakes: correct ? 0 : 1, hintsUsed: 0,
      durationMs: Math.max(1, Math.round(performance.now() - startedAt.current)), usedAnswer: false,
    };
    check(correct, attempt);
  }

  return <div className="hanzi-challenge">
    <div className="hanzi-focal">
      {handwriting ? <>
        <HanziWriterStage key={stageVersion} ref={stage} character={item.hanzi} ariaLabel={writingMode === 'independent' ? 'Área para escribir el carácter' : undefined} showCharacter={false} showOutline={writingMode === 'guided'} interactive
          onReady={() => setReady(true)} onError={() => { setError(true); setReady(false); setWriting(false); }} onCorrectStroke={setRecognizedStrokes}
          onMistake={(_, mistakesOnStroke) => { if (writingHintShown(writingMode, mistakesOnStroke)) hintsUsed.current += 1; }}
          onQuizComplete={summary => {
            setWriting(false);
            setHadHints(hintsUsed.current > 0);
            const attempt = gameWritingAttempt(item.id, writingMode, summary, hintsUsed.current);
            check(isSuccessfulHanziAttempt(attempt), attempt, writingMode === 'guided' || hintsUsed.current > 0);
          }}/>
        <p className="stroke-progress" role="status">Trazos reconocidos: {recognizedStrokes} / {item.strokeCount}</p>
        {result === null && <button type="button" disabled={!ready || writing} onClick={() => { setRecognizedStrokes(0); hintsUsed.current = 0; setWriting(true); stage.current?.startQuiz(writingMode); }}>Escribir con dedo o ratón</button>}
        {error && <><p role="status">No se pudieron cargar los trazos.</p><button type="button" onClick={() => { setError(false); setReady(false); setStageVersion(value => value + 1); }}>Reintentar carga</button></>}
      </> : <div className="lab-glyph"><Hanzi>{mode === 'Radical' ? item.hanzi : '？'}</Hanzi></div>}
      {audioSrc && <HiddenAudioButton src={audioSrc} label="Escuchar carácter oculto" disabled={result !== null}/>}
      <p>{mode === 'Audio' ? 'Contexto: ' : ''}{meaningWithoutHanzi(item.meaning)}</p>
    </div>
    <div className="hanzi-response">
      <h3>{mode === 'Radical' ? '¿Cuál es su radical?' : handwriting ? writingMode === 'guided' ? 'Practica con guía de trazos' : 'Escribe el carácter de memoria' : 'Reconoce el Hanzi'}</h3>
      {mode === 'Audio' && <p>Escucha y usa el significado para distinguir caracteres que suenan igual.</p>}
      {handwriting && writingMode === 'guided' && <p>La silueta te ayuda a practicar. Esta ronda se registra como escritura guiada.</p>}
      {result === null && !handwriting && <>
        <div className="scene-options">{options.map(option => <button type="button" key={option} aria-pressed={answer === option} onClick={() => setAnswer(option)}><Hanzi>{option}</Hanzi></button>)}</div>
        <button type="button" disabled={!answer} onClick={recognize}>Comprobar</button>
      </>}
      {result !== null && <>
        <GameFeedback correct={result} hanzi={item.hanzi} pinyin={item.pinyin} meaning={item.meaning} characters={characters} hint={mode === 'Radical' ? `Radical: ${item.radical}` : item.pedagogicalNote}/>
        {handwriting && <p>{writingMode === 'guided' ? 'Práctica con guía' : 'Práctica de memoria'}{hadHints ? ' · El motor mostró ayuda durante el intento.' : '.'}</p>}
        {mode === 'Radical' && <p>Radical: <Hanzi>{item.radical}</Hanzi></p>}
        <button type="button" onClick={next}>Siguiente carácter</button>
      </>}
    </div>
  </div>;
}
