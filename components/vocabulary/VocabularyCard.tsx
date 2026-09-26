'use client';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import { imageForWord } from '@/lib/vocabulary-media';
import type { CurriculumScope } from '@/data/types';
import { examplesForWord, type ActiveWord } from '@/lib/vocabulary';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton } from '@/components/SpeakButton';

export function VocabularyExample({ word, route }: { word: ActiveWord; scope: CurriculumScope; route: string }) {
  const [index, setIndex] = useState(0);
  const examples = examplesForWord(word);
  const example = examples[index % examples.length];
  if (!example) return null;
  return <div className="vocabulary-example">
    <p className="vocabulary-example-text">{example.hanzi.split(word.hanzi).map((part, index) => <Fragment key={index}>{index > 0 && <mark className="vocabulary-example-target"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></mark>}<LinkedChineseText text={part} returnTo={route} newTab/></Fragment>)} <SpeakButton key={example.id} text={example.hanzi} reading={example.pinyin ?? undefined} compact/></p>
    {example.pinyin && <p><PinyinText>{example.pinyin}</PinyinText></p>}
    {example.spanish && <p className="vocabulary-example-translation">{example.spanish}</p>}
    {examples.length > 1 && <button className="vocabulary-next-example" type="button" onClick={() => setIndex(i => i + 1)}>Otro ejemplo</button>}

  </div>;
}
export function VocabularyCard({ word, scope, route, back, favorite, hideTranslation, onFlip, onFavorite }: { word: ActiveWord; scope: CurriculumScope; route: string; back: boolean; favorite: boolean; hideTranslation: boolean; onFlip: () => void; onFavorite: () => void }) {
  const hasExamples = examplesForWord(word).length > 0;
  const showBack = back && hasExamples;
  const image = imageForWord(word.id);
  const [imageFailed, setImageFailed] = useState(false);
  return <article className={`vocabulary-card${showBack ? ' is-reversed' : image?.src && !imageFailed ? ' has-image' : ''}`} id={`word-${word.id}`} tabIndex={-1} aria-label={`Ficha de ${word.hanzi}`}>
    <div className="vocabulary-card-tools"><button type="button" aria-label={`Favorito: ${word.hanzi}`} aria-pressed={favorite} onClick={onFavorite}>{favorite ? '★' : '☆'}</button>{hasExamples && <button type="button" aria-label={`${showBack ? 'Ver palabra' : 'Ver ejemplo'}: ${word.hanzi}`} aria-pressed={showBack} onClick={onFlip}>↻</button>}</div>
    {showBack ? <><div className="vocabulary-word-row"><h2 className="vocabulary-word"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></h2></div><VocabularyExample word={word} scope={scope} route={route}/></> : <>{image?.src && !imageFailed && <button className="vocabulary-image-flip" type="button" aria-label={`Ver ejemplo: ${word.hanzi}`} onClick={onFlip}><Image unoptimized className="vocabulary-thumbnail" src={image.src} alt={image.alt} width={192} height={192} loading="lazy" onError={() => setImageFailed(true)}/></button>}<div className="vocabulary-card-content"><div className="vocabulary-word-row"><h2 className="vocabulary-word"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></h2><SpeakButton key={`${word.id}-front`} text={word.hanzi} reading={word.pinyin} compact/></div><p className="word-pinyin"><PinyinText>{word.pinyin}</PinyinText></p><p>{hideTranslation ? 'Traducción oculta' : word.spanish}</p></div></>}

  </article>;
}
