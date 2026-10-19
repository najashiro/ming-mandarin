'use client';
import { useId, useState } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { SpeakButton } from '@/components/SpeakButton';
import { sentenceBlocks } from '@/data/games-curriculum';
import { conversationMissionsForScope, isConversationResponseAccepted, type ConversationMission } from '@/data/conversation-missions';
import type { CurriculumScope, CharacterEntry } from '@/data/types';
import { shuffledBlockOrder } from '@/lib/games-session';
import { AnswerBlocks } from '../shared/AnswerBlocks';
import { ProductionAnswer } from '../shared/ProductionAnswer';
import { GameFeedback } from '../shared/GameFeedback';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';
import './conversation.css';

export function ConversationGame({ scope, characters }: { scope: CurriculumScope; characters: CharacterEntry[] }) {
  const missions = conversationMissionsForScope(scope);
  const [selectedMission, setSelectedMission] = useState('');
  const mission = missions.find(item => item.id === selectedMission) ?? missions[0];
  if (!mission) return <p>No hay misiones de conversación en este alcance.</p>;
  return <div className="conversation-missions">
    <label className="conversation-selector">Misión de conversación
      <select value={mission.id} onChange={event => setSelectedMission(event.target.value)}>
        {missions.map(item => <option key={item.id} value={item.id}>L{item.lesson} · {item.title}</option>)}
      </select>
    </label>
    <MissionSession key={`${scope}-${mission.id}`} mission={mission} scope={scope} characters={characters}/>
  </div>;
}

function MissionSession({ mission, scope, characters }: { mission: ConversationMission; scope: CurriculumScope; characters: CharacterEntry[] }) {
  const session = useGameSession('conversacion', scope, mission.turns.length, { order: 'sequential' });
  const [helpedAttempts, setHelpedAttempts] = useState<number[]>([]);
  const turn = mission.turns[session.index];
  return <div className="new-game conversation-game">
    <section className="conversation-brief" aria-label="Tu misión">
      <div><small>CONVERSACIÓN GUIADA · LECCIÓN {mission.lesson}</small><h3>{mission.title}</h3><p>{mission.objective}</p></div>
      <dl><div><dt>Tu papel</dt><dd>{mission.role}</dd></div><div><dt>Hablas con</dt><dd>{mission.partner}</dd></div></dl>
      <div className="conversation-facts"><strong>Datos de tu papel</strong><ul>{mission.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></div>
      <p className="conversation-model-note">Practica las respuestas modelo del diálogo con estos datos.</p>
    </section>
    {session.finished ? <GameResult score={session.score} total={session.total} unresolved={session.unresolved} assisted={session.assisted} firstPassScore={session.firstPassScore} initialTotal={session.initialTotal} onRestart={() => { session.restart(); setHelpedAttempts([]); }}/> : <>
      <GameProgress disabled={session.result !== null} level={session.level} onLevel={session.setLevel} round={session.round} total={session.total} retry={session.round >= mission.turns.length}/>
      <ConversationRound key={`${session.round}-${session.level}`} turn={turn} partner={mission.partner} level={session.level} result={session.result} characters={characters} help={helpedAttempts.includes(session.round)} onHelp={() => setHelpedAttempts(previous => [...new Set([...previous, session.round])])}
        onCheck={(answer, assisted) => { session.check(isConversationResponseAccepted(turn.challenge, answer), turn.challenge.id, `mission-${mission.id}`, assisted); }} onNext={session.next}/>
    </>}
  </div>;
}

function ConversationRound({ turn, partner, level, result, characters, help, onHelp, onCheck, onNext }: {
  turn: ConversationMission['turns'][number]; partner: string; level: number; result: boolean | null; characters: CharacterEntry[];
  help: boolean; onHelp: () => void;
  onCheck: (answer: string, assisted: boolean) => void; onNext: () => void;
}) {
  const [answer, setAnswer] = useState('');
  const [choices] = useState(() => shuffledBlockOrder(turn.choices).map(index => turn.choices[index]));
  const helpId = useId();
  const { prompt, answer: target } = turn.challenge;
  return <>
    <div className="conversation-turn-heading"><span>Tu turno</span><h4>{turn.task}</h4></div>
    <div className="dialogue-stage">
      <div className="dialogue-speaker"><div className="dialogue-bubble"><small>{partner}</small><p><Hanzi>{prompt.hanzi}</Hanzi></p><SpeakButton text={prompt.hanzi} audioSrc={prompt.audioSrc}/></div></div>
      <div className="dialogue-speaker learner"><div className="dialogue-bubble"><small>Tu respuesta</small><p><Hanzi>{answer || '…'}</Hanzi></p></div></div>
    </div>
    {result === null && <>
      <div className="conversation-help">
        <button type="button" aria-expanded={help} aria-controls={helpId} onClick={onHelp} disabled={help}>Ver ayuda en español</button>
        {help && <div id={helpId}><p><strong>Te dicen:</strong> {prompt.meaningEs}</p><p><strong>Respuesta modelo:</strong> {target.meaningEs}</p><small>Este intento se registra con ayuda.</small></div>}
      </div>
      {level === 1 ? <div className="dialogue-replies">{choices.map(choice => <button key={choice} aria-pressed={answer === choice} onClick={() => setAnswer(choice)}><Hanzi>{choice}</Hanzi></button>)}</div>
        : level === 2 ? <AnswerBlocks blocks={sentenceBlocks({ hanzi: target.hanzi, tokens: target.tokens ?? [] })} onChange={setAnswer}/>
          : <ProductionAnswer value={answer} onChange={setAnswer}/>}
      <button type="button" className="button button-primary" disabled={!answer.trim()} onClick={() => onCheck(answer, help)}>Responder</button>
    </>}
    {result !== null && <>
      <GameFeedback correct={result} hanzi={target.hanzi} pinyin={target.pinyin} meaning={target.meaningEs} characters={characters}/>
      <p className="conversation-coaching">{turn.feedback}</p>
      {help && <p className="conversation-help-used">Intento con ayuda en español.</p>}
      <button type="button" className="button button-primary" onClick={onNext}>Continuar conversación</button>
    </>}
  </>;
}
