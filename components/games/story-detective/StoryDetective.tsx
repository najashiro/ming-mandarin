'use client';
import { useState } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { storiesForScope, cleanChinese, sentenceBlocks } from '@/data/games-curriculum';
import type { CurriculumScope, CharacterEntry } from '@/data/types';
import { Person } from '../live-scene/SceneCard';
import { AnswerBlocks } from '../shared/AnswerBlocks';
import { GameFeedback } from '../shared/GameFeedback';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';

export function StoryDetective({ scope, characters }: { scope: CurriculumScope; characters: CharacterEntry[] }) {
  const stories = storiesForScope(scope);
  const [storyIndex, setStoryIndex] = useState(0);
  return <div><nav className="game-modes" aria-label="Historias">{stories.map((story,index) => <button key={story.id} aria-pressed={storyIndex === index} onClick={() => setStoryIndex(index)}>{story.title}</button>)}</nav><StoryCase key={storyIndex} story={stories[storyIndex]} scope={scope} characters={characters}/></div>;
}
function StoryCase({ story, scope, characters }: { story: ReturnType<typeof storiesForScope>[number]; scope: CurriculumScope; characters: CharacterEntry[] }) {
  const session = useGameSession('historia-detective', scope, story.evidence.length);
  const [answer, setAnswer] = useState('');
  const [evidence, setEvidence] = useState('');
  const item = story.scenes.find(scene => scene.id === story.evidence[session.index])!;
  if (session.finished) return <GameResult score={session.score} total={session.total}/>;
  return <div className="new-game story-game"><GameProgress level={session.level} onLevel={level => { session.setLevel(level); setAnswer(''); setEvidence(''); }} round={session.round} total={session.total}/><h3>{story.title}</h3><p>Lee las cuatro escenas. Toca la frase que demuestra tu respuesta.</p><div className="story-panels">{story.scenes.map((scene,index) => <article key={scene.id}><small>Escena {index + 1}</small><Person index={story.lesson - 1}/><button disabled={session.result !== null} aria-pressed={evidence === scene.id} onClick={() => { setEvidence(scene.id); if (session.level === 1) session.check(scene.id === item.id, item.id, 'evidence'); }}><Hanzi>{scene.hanzi}</Hanzi></button></article>)}</div><h3>{story.questions[session.index]}</h3>{session.level === 1 && <p>Tu respuesta es la evidencia: selecciónala en la historia.</p>}
    {session.result === null && session.level > 1 && <><AnswerBlocks key={`${session.round}-${session.level}`} blocks={sentenceBlocks(item)} onChange={setAnswer}/><button disabled={!answer.trim() || !evidence} onClick={() => session.check(evidence === item.id && cleanChinese(answer) === cleanChinese(item.hanzi), item.id, 'evidence-production')}>Presentar evidencia y respuesta</button></>}
    {session.result !== null && <><GameFeedback correct={session.result} hanzi={item.hanzi} pinyin={item.pinyin} meaning={item.translation} characters={characters} hint="La respuesta debe estar respaldada por una frase del texto."/><button onClick={() => { session.next(); setAnswer(''); setEvidence(''); }}>Siguiente pista</button></>}
  </div>;
}
