'use client';
import { Fragment, useState } from 'react';
import { imageForWord } from '@/lib/vocabulary-media';
import type { CurriculumScope } from '@/data/types';
import { examplesForWord, type ActiveWord } from '@/lib/vocabulary';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton } from '@/components/SpeakButton';
import { VocabularyPhoto } from './VocabularyPhoto';

export function VocabularyExample({ word, route }: { word: ActiveWord; scope: CurriculumScope; route: string }) {
  const [index, setIndex] = useState(0);
  const examples = examplesForWord(word);
  const example = examples[index % examples.length];
  if (!example) return null;
  return <div className="vocabulary-example">
    <div aria-live="polite" aria-atomic="true">
      <p className="vocabulary-example-text">{example.hanzi.split(word.hanzi).map((part, position) => <Fragment key={position}>
        {position > 0 && <mark className="vocabulary-example-target"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></mark>}
        <LinkedChineseText text={part} returnTo={route} newTab/>
      </Fragment>)} <SpeakButton key={example.id} text={example.hanzi} reading={example.pinyin} compact/></p>
      <p className="word-pinyin"><PinyinText>{example.pinyin}</PinyinText></p>
      <p className="vocabulary-example-translation">{example.spanish}</p>
    </div>
    {examples.length > 1 && <button className="vocabulary-next-example" type="button" onClick={() => setIndex(i => i + 1)}>Otro ejemplo <span aria-hidden="true">↗</span></button>}
  </div>;
}

export function VocabularyCard({ word, scope, route, back, favorite, hideTranslation, onFlip, onFavorite }: {
  word: ActiveWord; scope: CurriculumScope; route: string; back: boolean;
  favorite: boolean; hideTranslation: boolean; onFlip: () => void; onFavorite: () => void;
}) {
  const hasExamples = examplesForWord(word).length > 0;
  const showBack = back && hasExamples;
  const image = imageForWord(word.id);
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = !showBack && image?.src && !imageFailed;
  const photo = showPhoto && <VocabularyPhoto src={image.src!} alt={image.alt} onError={() => setImageFailed(true)}/>;
  return <article className={`vocabulary-card${showBack ? ' is-reversed' : showPhoto ? ' has-image' : ''}`}
    id={`word-${word.id}`} tabIndex={-1} aria-label={`Ficha de ${word.hanzi}`}>
    {photo && (hasExamples
      ? <button className="vocabulary-image-flip" type="button" aria-label={`Consultar ejemplo: ${word.hanzi}`} onClick={onFlip}>{photo}</button>
      : photo)}
    <div className="vocabulary-card-tools">
      <button type="button" className="vocabulary-favorite" aria-label={`Favorito: ${word.hanzi}`} aria-pressed={favorite} onClick={onFavorite}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2L12 17.3l-5.7 2.9 1.1-6.2L2.9 9.6l6.3-.9Z"/></svg>
      </button>
      {showBack && <div className="vocabulary-word-row vocabulary-reverse-label"><h2 className="vocabulary-word"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></h2></div>}
      {hasExamples && <button type="button" className="vocabulary-flip" aria-label={`${showBack ? 'Ver palabra' : 'Ver ejemplo'}: ${word.hanzi}`} aria-pressed={showBack} onClick={onFlip}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7v5h-5M4 17v-5h5M5.2 7.2A8 8 0 0 1 19.5 9M4.5 15a8 8 0 0 0 14.3 1.8"/></svg>
      </button>}
    </div>
    {showBack ? <div className="vocabulary-card-content vocabulary-card-back">
      <VocabularyExample key={word.id} word={word} scope={scope} route={route}/>
    </div> : <div className="vocabulary-card-content">
      <div className="vocabulary-word-row"><h2 className="vocabulary-word"><LinkedChineseText text={word.hanzi} returnTo={route} newTab/></h2><SpeakButton key={`${word.id}-front`} text={word.hanzi} reading={word.pinyin} compact/></div>
      <p className="word-pinyin"><PinyinText>{word.pinyin}</PinyinText></p>
      <p className="vocabulary-translation">{hideTranslation ? 'Traducción oculta' : word.spanish}</p>
    </div>}
  </article>;
}
