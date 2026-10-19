'use client';

import { useState } from 'react';
import { getListeningEntriesForScope } from '@/lib/lesson-content';
import { Hanzi } from '@/components/Hanzi';
import type { CharacterEntry, CurriculumScope, ListeningEntry } from '@/data/types';
import { cleanChinese } from '@/data/games-curriculum';
import { comparePinyin } from '@/lib/pinyin';
import { hanziRecognitionChoices, meaningWithoutHanzi } from '@/lib/games-hanzi-practice';
import { GameFeedback } from '../shared/GameFeedback';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';
import { AnswerBlocks } from '../shared/AnswerBlocks';
import { ProductionAnswer } from '../shared/ProductionAnswer';
import { HiddenAudioButton } from './HiddenAudioButton';

export function WordListening({ scope, characters }: { scope: CurriculumScope; characters: CharacterEntry[] }) {
  const allowed = new Set(characters.map(item => item.hanzi));
  const pool = getListeningEntriesForScope(scope).filter(item => item.pinyin.trim() && [...cleanChinese(item.hanzi)].every(character => allowed.has(character)));
  const session = useGameSession('hanzi-lab', scope, pool.length);
  const [pinyin, setPinyin] = useState(false);
  const item = pool[session.index];
  if (!item) return <p>No hay audios para este alcance.</p>;
  if (session.finished) return <GameResult score={session.score} total={session.total} unresolved={session.unresolved} assisted={session.assisted} firstPassScore={session.firstPassScore} initialTotal={session.initialTotal} onRestart={session.restart}/>;
  return <div className="new-game">
    <GameProgress disabled={session.result !== null} level={session.level} onLevel={session.setLevel} round={session.round} total={session.total} modes={pinyin ? [{ level: 3, label: 'Dictado de pinyin' }] : undefined}/>
    <label className="inverse-toggle"><input type="checkbox" checked={pinyin} disabled={session.result !== null} onChange={event => setPinyin(event.target.checked)}/> Dictar pinyin con tonos</label>
    <WordRound key={`${session.round}-${session.level}-${pinyin}`} item={item} pool={pool} characters={characters} level={session.level} pinyin={pinyin} result={session.result} check={answer => session.check(pinyin ? comparePinyin(answer, item.pinyin) : cleanChinese(answer) === cleanChinese(item.hanzi), item.id, pinyin ? 'pinyin' : 'word-audio', !pinyin && session.level === 2)} next={session.next}/>
  </div>;
}

function WordRound({ item, pool, characters, level, pinyin, result, check, next }: { item: ListeningEntry; pool: ListeningEntry[]; characters: CharacterEntry[]; level: number; pinyin: boolean; result: boolean | null; check: (answer: string) => void; next: () => void }) {
  const [answer, setAnswer] = useState('');
  const [choices] = useState(() => hanziRecognitionChoices({ ...item, meaning: item.translation }, pool.map(entry => ({ ...entry, meaning: entry.translation })), 'Audio'));
  const hasHomophones = pool.some(other => other.hanzi !== item.hanzi && comparePinyin(other.pinyin, item.pinyin));
  return <>
    <div className="hanzi-focal">
      <div className="lab-glyph" aria-hidden="true">♫</div>
      <HiddenAudioButton src={item.audioSrc} label="Escuchar palabra oculta" disabled={result !== null}/>
      {hasHomophones && <p>Contexto: {meaningWithoutHanzi(item.translation)}</p>}
    </div>
    {result === null && <>
      {pinyin ? <div className="production-answer"><label>Dictado de pinyin<input value={answer} autoComplete="off" autoCorrect="off" spellCheck={false} aria-describedby="pinyin-dictation-help" onChange={event => setAnswer(event.target.value)}/></label><p id="pinyin-dictation-help">Puedes usar marcas o números de tono: nǐ hǎo o ni3 hao3.</p></div>
        : level === 1 ? <div className="scene-options">{choices.map(choice => <button type="button" key={choice} aria-pressed={answer === choice} onClick={() => setAnswer(choice)}><Hanzi>{choice}</Hanzi></button>)}</div>
        : level === 2 ? <><p>Construye con ayuda de los caracteres. Este intento contará como práctica con apoyo.</p><AnswerBlocks blocks={[...cleanChinese(item.hanzi)]} onChange={setAnswer}/></>
        : <ProductionAnswer value={answer} onChange={setAnswer} label="Dictado en Hanzi"/>}
      <button type="button" disabled={!answer.trim()} onClick={() => check(answer)}>Comprobar dictado</button>
    </>}
    {result !== null && <><GameFeedback correct={result} hanzi={item.hanzi} pinyin={item.pinyin} meaning={item.translation} characters={characters}/><button type="button" onClick={next}>Siguiente palabra</button></>}
  </>;
}
