'use client';
import { useEffect, useRef, useState } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { SpeakButton } from '@/components/SpeakButton';
import { HanziWriterStage, type HanziWriterStageHandle } from '@/components/hanzi/HanziWriterStage';
import { HanziStrokeSvg } from '@/components/hanzi/HanziStrokeSvg';
import { loadHanziData } from '@/lib/hanzi/loader';
import type { HanziCharacterData } from '@/lib/hanzi/types';
import type { CharacterEntry, CurriculumScope } from '@/data/types';
import { GameFeedback } from '../shared/GameFeedback';
import { AnswerBlocks } from '../shared/AnswerBlocks';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';
import { cleanChinese } from '@/data/games-curriculum';
import { saveGameHanziAttempt } from '@/lib/games-hanzi-progress';
import { WordListening } from './WordListening';
const modes = ['Palabras', 'Audio', 'Significado', 'Radical', 'Componentes', 'Revelado', 'Escritura'] as const;
type Mode = typeof modes[number];
export function HanziLabGame({ characters, scope }: { characters: CharacterEntry[]; scope: CurriculumScope }) {
  const [mode, setMode] = useState<Mode>('Audio');
  const pool = characters.filter(item => mode === 'Componentes' ? item.componentsAudited && item.components.length > 1 : mode === 'Radical' ? item.radicalAudited && item.radical : true);
  return <div><nav className="game-modes" aria-label="Modos Hanzi">{modes.map(value => <button aria-pressed={mode === value} key={value} onClick={() => setMode(value)}>{value}</button>)}</nav>{mode === 'Palabras' ? <WordListening scope={scope} characters={characters}/> : pool.length ? <HanziSession key={mode} characters={pool} scope={scope} mode={mode}/> : <p>No hay datos auditados para este modo en la unidad seleccionada.</p>}</div>;
}
function HanziSession({ characters, scope, mode }: { characters: CharacterEntry[]; scope: CurriculumScope; mode: Mode }) {
  const session = useGameSession('hanzi-lab', scope, characters.length);
  const item = characters[session.index];
  if (session.finished) return <GameResult score={session.score} total={session.total}/>;
  return <div className="new-game hanzi-game"><GameProgress level={session.level} onLevel={session.setLevel} round={session.round} total={session.total}/><HanziRound key={`${session.round}-${session.level}`} item={item} characters={characters} mode={mode} level={session.level} result={session.result} check={(ok) => { const recorded = session.check(ok,item.id,mode); if (recorded && mode !== 'Escritura' && !(['Audio','Significado'].includes(mode) && session.level === 3)) void saveGameHanziAttempt({ characterId:item.id, mode:'independent', skillDimension:'recognition', completed:ok, correctStrokes:0, mistakes:ok ? 0 : 1, hintsUsed:0, durationMs:1, usedAnswer:false }); }} next={session.next}/></div>;
}
function HanziRound({ item, characters, mode, level, result, check, next }: { item: CharacterEntry; characters: CharacterEntry[]; mode: Mode; level: number; result: boolean | null; check: (ok: boolean) => void; next: () => void }) {
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<HanziCharacterData | null>(null);
  const [error, setError] = useState(false);
  const [revealed, setRevealed] = useState(1);
  const [ready, setReady] = useState(false);
  const [writing, setWriting] = useState(false);
  const [recognizedStrokes, setRecognizedStrokes] = useState(0);
  const stage = useRef<HanziWriterStageHandle>(null);
  useEffect(() => { let active = true; if (mode === 'Revelado') void loadHanziData(item.hanzi).then(value => { if (active) { setData(value); setError(!value); } }).catch(() => { if (active) setError(true); }); return () => { active = false; }; }, [item.hanzi, mode]);
  const target = mode === 'Radical' ? item.radical : mode === 'Componentes' ? item.components.join('') : item.hanzi;
  const rawOptions = [...new Set([target, ...characters.filter(other => other.id !== item.id).map(other => mode === 'Radical' ? other.radical : other.hanzi).filter(Boolean)])].slice(0,4);
  const offset = [...item.id].reduce((sum, character) => sum + character.codePointAt(0)!, 0) % rawOptions.length;
  const options = [...rawOptions.slice(offset), ...rawOptions.slice(0, offset)];
  const handwriting = mode === 'Escritura' || ((mode === 'Audio' || mode === 'Significado') && level === 3);
  return <div className="hanzi-challenge"><div className="hanzi-focal">
    {handwriting ? <><HanziWriterStage ref={stage} character={item.hanzi} showCharacter={false} showOutline={level === 1} interactive onReady={() => setReady(true)} onCorrectStroke={setRecognizedStrokes} onQuizComplete={summary => { setWriting(false); check(summary.mistakes === 0); void saveGameHanziAttempt({characterId:item.id,mode:level === 1 ? 'guided' : 'independent',skillDimension:'writing',completed:true,correctStrokes:summary.correctStrokes,mistakes:summary.mistakes,hintsUsed:0,durationMs:summary.durationMs,usedAnswer:false}); }}/><p className="stroke-progress" role="status">Trazos reconocidos: {recognizedStrokes} / {item.strokeCount}</p>{result === null && <button disabled={!ready || writing} onClick={() => { setRecognizedStrokes(0); setWriting(true); stage.current?.startQuiz(level === 1 ? 'guided' : 'independent'); }}>Escribir con dedo o ratón</button>}</> : mode === 'Revelado' ? <>{data ? <HanziStrokeSvg character={item.hanzi} data={data} visibleStrokes={revealed} showDirections={false} showNumbers={false}/> : <p>{error ? 'No se pudieron cargar los trazos.' : 'Cargando trazos…'}</p>}{data && result === null && <button disabled={revealed >= data.strokes.length} onClick={() => setRevealed(value => value + 1)}>Revelar otro trazo ({revealed}/{data.strokes.length})</button>}</> : <div className="lab-glyph"><Hanzi>{mode === 'Radical' || mode === 'Componentes' ? item.hanzi : '？'}</Hanzi></div>}
    {mode === 'Audio' ? <SpeakButton text={item.hanzi} ariaLabel="Escuchar carácter oculto"/> : <p>{item.meaning}</p>}
  </div><div className="hanzi-response"><h3>{mode === 'Radical' ? '¿Cuál es su radical?' : mode === 'Componentes' ? 'Une sus componentes auditados' : mode === 'Revelado' ? 'Identifica el carácter' : handwriting ? 'Escribe el carácter' : 'Recupera el Hanzi'}</h3>
    {result === null && !handwriting && <>{mode === 'Componentes' ? <AnswerBlocks blocks={item.components} onChange={setAnswer}/> : <div className="scene-options">{options.map(option => <button key={option} aria-pressed={answer === option} onClick={() => setAnswer(option)}><Hanzi>{option}</Hanzi></button>)}</div>}<button disabled={!answer.trim()} onClick={() => check(cleanChinese(answer) === cleanChinese(target))}>Comprobar</button></>}
    {result !== null && <><GameFeedback correct={result} hanzi={item.hanzi} pinyin={item.pinyin} meaning={item.meaning} characters={characters} hint={mode === 'Radical' ? `Radical: ${item.radical}` : mode === 'Componentes' ? item.components.join(' + ') : item.pedagogicalNote}/>{mode === 'Radical' && <p><Hanzi>{item.radical}</Hanzi>{characters.find(value => value.hanzi === item.radical)?.meaning && ` · ${characters.find(value => value.hanzi === item.radical)?.meaning}`}</p>}{mode === 'Componentes' && <p><Hanzi>{`${item.components.join(' + ')} → ${item.hanzi}`}</Hanzi></p>}<button onClick={next}>Siguiente carácter</button></>}
  </div></div>;
}
