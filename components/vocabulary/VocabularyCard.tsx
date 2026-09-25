'use client';
import { useState } from 'react';
import Image from 'next/image';
import { imageForWord } from '@/lib/vocabulary-media';
import type { CurriculumScope } from '@/data/types';
import { examplesForScope, type ActiveWord } from '@/lib/vocabulary';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton } from '@/components/SpeakButton';

export function VocabularyExample({ word, scope, route }: { word: ActiveWord; scope: CurriculumScope; route: string }) {
  const [index, setIndex] = useState(0);
  const examples = examplesForScope(word, scope);
  const example = examples[index % examples.length];
  if (!example) return <p>Ejemplo documentado pendiente para este alcance.</p>;
  return <div className="vocabulary-example">
    <p className="vocabulary-example-text"><LinkedChineseText text={example.hanzi} returnTo={route} newTab/> <SpeakButton key={example.id} text={example.hanzi} compact/></p>
    <p>{example.pinyin ? <PinyinText>{example.pinyin}</PinyinText> : <small>Pinyin de la oración pendiente de revisión.</small>}</p>
    <p>{example.spanish ?? <small>Traducción de la oración pendiente de revisión.</small>}</p>
    {examples.length > 1 && <button type="button" onClick={() => setIndex(i => i + 1)}>Otro ejemplo</button>}

  </div>;
}
export function VocabularyCard({ word, scope, route, back, favorite, hideTranslation, onFlip, onFavorite }: { word: ActiveWord; scope: CurriculumScope; route: string; back: boolean; favorite: boolean; hideTranslation: boolean; onFlip: () => void; onFavorite: () => void }) {
  const image = imageForWord(word.id);
  const [imageFailed, setImageFailed] = useState(false);
  return <article className={`vocabulary-card${back ? ' is-reversed' : ''}`} id={`word-${word.id}`} tabIndex={-1} aria-label={`Ficha de ${word.hanzi}`}>
    <div className="vocabulary-card-tools"><button type="button" aria-label={`Favorito: ${word.hanzi}`} aria-pressed={favorite} onClick={onFavorite}>{favorite ? '★' : '☆'}</button><button type="button" aria-label={`${back ? 'Ver palabra' : 'Ver ejemplo'}: ${word.hanzi}`} aria-pressed={back} onClick={onFlip}>↻</button></div>
    {back ? <><div className="vocabulary-word-row"><h2 className="vocabulary-word"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></h2><SpeakButton key={`${word.id}-back`} text={word.hanzi} reading={word.pinyin} compact/></div><VocabularyExample word={word} scope={scope} route={route}/></> : <>{image?.src && !imageFailed && <button className="vocabulary-image-flip" type="button" aria-label={`Ver ejemplo: ${word.hanzi}`} onClick={onFlip}><Image unoptimized className="vocabulary-thumbnail" src={image.src} alt={image.alt} width={192} height={192} loading="lazy" onError={() => setImageFailed(true)}/></button>}<div className="vocabulary-word-row"><h2 className="vocabulary-word"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></h2><SpeakButton key={`${word.id}-front`} text={word.hanzi} reading={word.pinyin} compact/></div><p className="word-pinyin"><PinyinText>{word.pinyin}</PinyinText></p><p>{hideTranslation ? 'Traducción oculta' : word.spanish}</p></>}

  </article>;
}
