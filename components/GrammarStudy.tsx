'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { Exercise, GrammarPoint, SentenceEntry } from '@/data/types';
import { grammarGuides } from '@/data/grammar-guides';
import { grammarAudio, grammarReading, grammarTextSegments } from '@/lib/grammar-language';
import { LinkedChineseText } from './LinkedChineseText';
import { BookReference, type BookReferenceData } from './BookReference';
import { PinyinText } from './PinyinText';
import { SpeakButton, stopMandarinAudio } from './SpeakButton';
import { GrammarPractice } from './GrammarPractice';
import './grammar-cards.css';
import './grammar-study.css';

type ReadingAids = { pinyin: boolean; spanish: boolean };
const preferenceKey = 'ming-grammar-reading-aids';
const topicLabels: Record<string, string> = {
  'g-l5-dates': 'Fechas y días',
  'g-l5-nominal': 'Decir la fecha y la edad',
  'g-l5-two-objects': 'Regalar y enseñar',
  'g-l5-jiu': 'Dar énfasis',
  'g-l5-rising': 'Preguntar con la voz',
  'g-l5-sentence-parts': 'Las partes de una frase',
  'g-l5-modifiers': 'Cuándo y dónde',
  'g-l5-age': 'Preguntar la edad',
  'g-l5-yixia': 'Pedir algo brevemente',
  'g-l5-zanmen': 'Decir «nosotros»',
  'g-l5-wishes': 'Felicitar y agradecer',
};
// Plain-language introductions explain the existing rules before showing Hanzi.
const topicSummaries: Record<string, string> = {
  'g-l5-dates': 'Ordena la fecha de lo más grande a lo más pequeño: año, mes y día. Lee el año dígito a dígito. El día del mes tiene una forma habitual al hablar y otra al escribir.',
  'g-l5-nominal': 'Para decir la fecha, la hora o la edad, puedes poner el dato directamente después de la persona o del día. Al negar esta información, usa la expresión «no ser».',
  'g-l5-two-objects': 'Piensa en dos preguntas: ¿a quién? y ¿qué? Después de «regalar» o «enseñar», coloca primero a la persona y luego lo que recibe o aprende.',
  'g-l5-jiu': 'Para destacar que se trata precisamente de esa persona o cosa, añade la palabra de énfasis delante del verbo.',
  'g-l5-rising': 'Puedes convertir una afirmación en pregunta solo con la entonación. El orden de las palabras se conserva; la voz expresa la duda o la sorpresa.',
  'g-l5-sentence-parts': 'Empieza por quién realiza la acción, sigue con lo que hace y termina con aquello sobre lo que actúa. En una conversación puedes omitir lo que ya se entiende.',
  'g-l5-modifiers': 'Las palabras que describen un nombre van antes de él. Para indicar cuándo o dónde ocurre una acción, coloca esa información antes del verbo.',
  'g-l5-age': 'Nombra a la persona y pregunta por su edad. La expresión habitual para adultos es diferente de la que suele usarse para niños.',
  'g-l5-yixia': 'Añade esta expresión después del verbo para presentar la acción como breve o para suavizar una petición.',
  'g-l5-zanmen': 'Hay dos formas de decir «nosotros». Una incluye siempre a la persona que te escucha; la otra puede incluirla o no, según la conversación.',
  'g-l5-wishes': 'Para felicitar, expresa el deseo, nombra a la persona y añade la felicitación. También puedes aprender frases breves para agradecer, disculparte o lamentar algo.',
};

/** Chinese runs keep their reading directly beneath them, even within a rule. */
function SupportedText({ text, aids, returnTo }: { text: string; aids: ReadingAids; returnTo: string }) {
  return <>{grammarTextSegments(text).map((segment, index) => segment.reading
    ? <span className="grammar-inline-reading" key={index}>
      <span><LinkedChineseText text={segment.text} returnTo={returnTo} newTab/></span>
      {aids.pinyin && <span className="grammar-reading-pinyin"><PinyinText>{segment.reading.pinyin}</PinyinText></span>}
      {aids.spanish && <span className="grammar-reading-spanish">{segment.reading.spanish}</span>}
    </span>
    : <LinkedChineseText key={index} text={segment.text} returnTo={returnTo} newTab/>)}</>;
}

function GrammarExample({ text, index, aids, returnTo, readingAid }: { text: string; index: number; aids: ReadingAids; returnTo: string; readingAid?: { pinyin: string; spanish: string } }) {
  const reading = readingAid ?? grammarReading(text);
  const audio = grammarAudio(text);
  const segmentedAudio = Array.isArray(audio);
  return <div className={`grammar-study-example${readingAid ? ' grammar-worked-example' : ''}`} data-testid="grammar-example">
    <span className="grammar-example-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <div className="grammar-example-content">
      <p className="grammar-example-hanzi" lang="zh-CN"><LinkedChineseText text={text} returnTo={returnTo} newTab/></p>
      {aids.pinyin && reading && <p className="grammar-reading-pinyin"><PinyinText>{reading.pinyin}</PinyinText></p>}
      {aids.spanish && reading && <p className="grammar-reading-spanish">{reading.spanish}</p>}
      {audio && <div className="grammar-example-audio">
        <SpeakButton text={text} audioSrc={audio} reading={reading?.pinyin} rate={1} label={segmentedAudio ? 'Escuchar por partes' : 'Escuchar ejemplo'}/>
        <SpeakButton text={text} audioSrc={audio} reading={reading?.pinyin} rate={0.7} label="Más despacio"/>
      </div>}
      {segmentedAudio && <small className="grammar-audio-note">Escucha las palabras por separado y luego une la frase al repetir.</small>}
      {!audio && <small className="grammar-audio-note">Este ejemplo todavía no tiene grabación. Puedes estudiarlo con su pinyin y significado.</small>}
    </div>
  </div>;
}

function GrammarStudyBlocks({ blocks, aids, returnTo }: { blocks: NonNullable<GrammarPoint['studyBlocks']>; aids: ReadingAids; returnTo: string }) {
  return blocks.map(block => block.kind === 'table'
    ? <div className="grammar-table-scroll" key={block.id} tabIndex={0} role="region" aria-label={block.title}>
      <table className="grammar-source-table">
        <caption><SupportedText text={block.title} aids={aids} returnTo={returnTo}/></caption>
        <thead><tr>{block.columns?.map((column, index) => <th scope="col" key={index}><SupportedText text={column} aids={aids} returnTo={returnTo}/></th>)}</tr></thead>
        <tbody>{block.rows?.map((row, index) => {
          const aid = block.rowAids?.[index] ?? grammarReading(row.join(''));
          return <Fragment key={index}>
            <tr>{row.map((cell, column) => <td key={column}>{aid?.pinyin
              ? <LinkedChineseText text={cell} returnTo={returnTo} newTab/>
              : <SupportedText text={cell} aids={aids} returnTo={returnTo}/>}</td>)}</tr>
            {((aids.pinyin && aid?.pinyin) || (aids.spanish && aid?.spanish)) && <tr className="grammar-row-aid"><td colSpan={block.columns?.length ?? row.length}>
              {aids.pinyin && aid?.pinyin && <p className="grammar-reading-pinyin"><PinyinText>{aid.pinyin}</PinyinText></p>}
              {aids.spanish && aid?.spanish && <p className="grammar-reading-spanish">{aid.spanish}</p>}
            </td></tr>}
          </Fragment>;
        })}</tbody>
      </table>
    </div>
    : <section className="grammar-worked-examples" key={block.id} aria-label={block.title}>
      <h3><SupportedText text={block.title} aids={aids} returnTo={returnTo}/></h3>
      {block.examples?.map((example, index) => <GrammarExample key={example.id} text={example.hanzi} index={index} aids={aids} returnTo={returnTo} readingAid={example}/>)}
    </section>);
}

export function GrammarStudy({ points, exercises, sentences, returnTo = '/study/l5/grammar', bookReference }: { points: GrammarPoint[]; exercises: Exercise[]; sentences?: SentenceEntry[]; returnTo?: string; bookReference?: BookReferenceData }) {
  const [aids, setAids] = useState<ReadingAids>({ pinyin: true, spanish: true });
  const [topicIndex, setTopicIndex] = useState(0);
  const topicHeading = useRef<HTMLHeadingElement>(null);
  const topics = useMemo(() => points.filter(point => !point.continuationOf), [points]);
  const point = topics[topicIndex];

  useEffect(() => {
    // Storage may be blocked in private browsing; studying must still work.
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey) ?? 'null');
      if (typeof saved?.pinyin === 'boolean' && typeof saved?.spanish === 'boolean') {
        const timer = window.setTimeout(() => setAids({ pinyin: saved.pinyin, spanish: saved.spanish }), 0);
        return () => window.clearTimeout(timer);
      }
    } catch { /* Keep readable defaults. */ }
  }, []);

  useEffect(() => {
    function restoreTopic() {
      const index = topics.findIndex(topic => `#${topic.id}` === window.location.hash);
      if (index >= 0) setTopicIndex(index);
    }
    const timer = window.setTimeout(restoreTopic, 0);
    window.addEventListener('hashchange', restoreTopic);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', restoreTopic);
    };
  }, [topics]);

  function updateAids(next: ReadingAids) {
    setAids(next);
    try { localStorage.setItem(preferenceKey, JSON.stringify({ version: 1, ...next })); } catch { /* Optional preference storage. */ }
  }

  function selectTopic(index: number, focus = false) {
    stopMandarinAudio();
    setTopicIndex(index);
    if (topics[index]) window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${topics[index].id}`);
    if (focus) requestAnimationFrame(() => {
      topicHeading.current?.focus({ preventScroll: true });
      topicHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }

  if (!point) return null;
  const allAids = aids.pinyin && aids.spanish;
  const guide = grammarGuides[point.id];
  const examples = point.examples.length ? point.examples : guide?.example ? [guide.example] : [];
  const topicReturnTo = `${returnTo}#${point.id}`;
  return <div className="grammar-study shell">
    <div className="grammar-study-controls" role="region" aria-label="Ayudas para toda la gramática">
      <div className="grammar-controls-copy"><strong>Estudia a tu ritmo</strong><span>Las ayudas se aplican a los temas y a la práctica.</span></div>
      <div className="grammar-controls-buttons">
        <button type="button" className="grammar-aids-all" aria-pressed={allAids} onClick={() => updateAids({ pinyin: !allAids, spanish: !allAids })}>
          {allAids ? 'Ocultar pinyin y español' : 'Mostrar pinyin y español'}
        </button>
        <div className="grammar-aids-individual" role="group" aria-label="Ayudas de lectura">
          <button type="button" aria-pressed={aids.pinyin} onClick={() => updateAids({ ...aids, pinyin: !aids.pinyin })}>Pinyin <span aria-hidden="true">{aids.pinyin ? '✓' : '＋'}</span></button>
          <button type="button" aria-pressed={aids.spanish} onClick={() => updateAids({ ...aids, spanish: !aids.spanish })}>Español <span aria-hidden="true">{aids.spanish ? '✓' : '＋'}</span></button>
        </div>
      </div>
    </div>

    <div className="grammar-study-layout">
      <aside className="grammar-topic-menu">
        <p className="eyebrow">TU GUÍA · {topics.length} TEMAS</p>
        <h2>Una idea a la vez</h2>
        <p>Elige un tema. Lee, escucha y repite antes de practicar.</p>
        <nav aria-label="Temas de gramática" data-testid="grammar-topics">
          {topics.map((topic, index) => <button key={topic.id} type="button" data-topic-id={topic.id} aria-current={index === topicIndex ? 'step' : undefined} onClick={() => selectTopic(index)}>
            <span className="grammar-topic-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{topicLabels[topic.id] ?? grammarGuides[topic.id]?.title ?? topic.title}</span>
          </button>)}
        </nav>
        <a className="grammar-practice-link" href="#grammar-practice" onClick={stopMandarinAudio}>Ir a la práctica <span aria-hidden="true">↗</span></a>
      </aside>

      <article className="grammar-study-topic" id={point.id} data-testid="grammar-topic">
        <header className="grammar-topic-header">
          <p className="eyebrow">COMPRENDE · TEMA {topicIndex + 1} DE {topics.length}</p>
          <h2 ref={topicHeading} tabIndex={-1}>{topicLabels[point.id] ?? guide?.title ?? point.title}</h2>
          <p className="grammar-topic-explanation">{topicSummaries[point.id] ?? guide?.summary ?? <SupportedText text={point.explanation} aids={aids} returnTo={topicReturnTo}/>}</p>
          <p className="grammar-hanzi-hint">Toca un carácter subrayado para abrir su ficha Hanzi en otra pestaña.</p>
          <details className="grammar-rule-detail" key={point.id}>
            <summary>Ver la regla con sus palabras en chino</summary>
            <p><SupportedText text={point.explanation} aids={aids} returnTo={topicReturnTo}/></p>
          </details>
          {point.clarification && <p className="grammar-clarification"><SupportedText text={point.clarification} aids={aids} returnTo={topicReturnTo}/></p>}
        </header>
        {(guide?.patterns?.length || point.pattern) && <section className="grammar-pattern-guide" aria-label="Orden de la frase">
          <h3><span aria-hidden="true">01</span> Observa el orden</h3>
          {guide?.patterns?.length ? <div className="grammar-pattern-variants">{guide.patterns.map((variant, index) =>
            <section key={variant.title} className="grammar-pattern-variant" data-testid="grammar-pattern-variant" aria-label={variant.title}>
              <h4><span aria-hidden="true">{String.fromCharCode(65 + index)}</span>{variant.title}</h4>
              <div className="grammar-pattern-parts">{variant.parts.map((part, partIndex) => <Fragment key={partIndex}>
                {partIndex > 0 && <span className="grammar-pattern-connector" aria-hidden="true">+</span>}
                <span className="grammar-pattern-part"><SupportedText text={part} aids={aids} returnTo={topicReturnTo}/></span>
              </Fragment>)}</div>
              <GrammarExample text={variant.example} index={index} aids={aids} returnTo={topicReturnTo}/>
              <p className="grammar-pattern-note"><SupportedText text={variant.note} aids={aids} returnTo={topicReturnTo}/></p>
            </section>)}</div>
          : <div className="grammar-pattern-parts">{point.pattern.split(/\s*(→|\+|·)\s*/).map((part, index) =>
            /^[→+·]$/.test(part) ? <span className="grammar-pattern-connector" key={index} aria-hidden="true">{part}</span>
              : <span className="grammar-pattern-part" key={index}><SupportedText text={part} aids={aids} returnTo={topicReturnTo}/></span>)}</div>}
        </section>}
        {examples.length > 0 && <section className="grammar-examples-guide" aria-label="Ejemplos de la regla">
          <h3><span aria-hidden="true">02</span> Escucha y repite</h3>
          <p className="grammar-section-hint">Lee la frase y su significado. Escúchala y repítela en voz alta.</p>
          {examples.map((example, index) => <GrammarExample key={example} text={example} index={index} aids={aids} returnTo={topicReturnTo}/>)}
        </section>}
        {point.studyBlocks && <GrammarStudyBlocks blocks={point.studyBlocks} aids={aids} returnTo={topicReturnTo}/>}
        <div className="grammar-recall-tip"><span aria-hidden="true">↻</span><p><strong>Ahora, prueba sin ayuda.</strong> Oculta el pinyin y el español e intenta recordar lo que significa cada frase. Puedes volver a mostrarlos cuando lo necesites.</p></div>
        <footer className="grammar-topic-navigation">
          <button type="button" disabled={topicIndex === 0} onClick={() => selectTopic(topicIndex - 1, true)}>← Tema anterior</button>
          {topicIndex < topics.length - 1
            ? <button className="grammar-next-topic" type="button" onClick={() => selectTopic(topicIndex + 1, true)}>Tema siguiente →</button>
            : <a className="grammar-next-topic" href="#grammar-practice" onClick={stopMandarinAudio}>Practicar las frases →</a>}
        </footer>
      </article>
    </div>

    <div id="grammar-practice" className="grammar-study-practice">
      <GrammarPractice exercises={exercises} sentences={sentences} returnTo={returnTo} showPinyin={aids.pinyin} showSpanish={aids.spanish}/>
    </div>
    {bookReference && <BookReference reference={bookReference} showPinyin={aids.pinyin} showSpanish={aids.spanish} returnTo={returnTo}
      renderChinese={(text, alreadyTranslated) => <SupportedText text={text} aids={alreadyTranslated ? { ...aids, spanish: false } : aids} returnTo={returnTo}/>}/>}
  </div>;
}
