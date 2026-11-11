'use client';

import { useEffect, useRef, useState } from 'react';
import type { Exercise, GrammarPoint } from '@/data/types';
import { grammarAudio, grammarReading, grammarTextSegments } from '@/lib/grammar-language';
import { Hanzi } from './Hanzi';
import { PinyinText } from './PinyinText';
import { SpeakButton, stopMandarinAudio } from './SpeakButton';
import { GrammarPractice } from './GrammarPractice';
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
function SupportedText({ text, aids }: { text: string; aids: ReadingAids }) {
  return <>{grammarTextSegments(text).map((segment, index) => segment.reading
    ? <span className="grammar-inline-reading" key={index}>
      <span><Hanzi>{segment.text}</Hanzi></span>
      {aids.pinyin && <span className="grammar-reading-pinyin"><PinyinText>{segment.reading.pinyin}</PinyinText></span>}
      {aids.spanish && <span className="grammar-reading-spanish">{segment.reading.spanish}</span>}
    </span>
    : <Hanzi key={index}>{segment.text}</Hanzi>)}</>;
}

function GrammarExample({ text, index, aids }: { text: string; index: number; aids: ReadingAids }) {
  const reading = grammarReading(text);
  const audio = grammarAudio(text);
  const segmentedAudio = Array.isArray(audio);
  return <div className="grammar-study-example" data-testid="grammar-example">
    <span className="grammar-example-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <div className="grammar-example-content">
      <p className="grammar-example-hanzi" lang="zh-CN"><Hanzi>{text}</Hanzi></p>
      {aids.pinyin && reading && <p className="grammar-reading-pinyin"><PinyinText>{reading.pinyin}</PinyinText></p>}
      {aids.spanish && reading && <p className="grammar-reading-spanish">{reading.spanish}</p>}
      <div className="grammar-example-audio">
        <SpeakButton text={text} audioSrc={audio} reading={reading?.pinyin} rate={1} label={segmentedAudio ? 'Escuchar por partes' : 'Escuchar ejemplo'}/>
        <SpeakButton text={text} audioSrc={audio} reading={reading?.pinyin} rate={0.7} label="Más despacio"/>
      </div>
      {segmentedAudio && <small className="grammar-audio-note">Escucha las palabras por separado y luego une la frase al repetir.</small>}
    </div>
  </div>;
}

export function GrammarStudy({ points, exercises }: { points: GrammarPoint[]; exercises: Exercise[] }) {
  const [aids, setAids] = useState<ReadingAids>({ pinyin: true, spanish: true });
  const [topicIndex, setTopicIndex] = useState(0);
  const topicHeading = useRef<HTMLHeadingElement>(null);
  const topics = points.filter(point => !point.continuationOf);
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

  function updateAids(next: ReadingAids) {
    setAids(next);
    try { localStorage.setItem(preferenceKey, JSON.stringify({ version: 1, ...next })); } catch { /* Optional preference storage. */ }
  }

  function selectTopic(index: number, focus = false) {
    stopMandarinAudio();
    setTopicIndex(index);
    if (focus) requestAnimationFrame(() => {
      topicHeading.current?.focus({ preventScroll: true });
      topicHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }

  if (!point) return null;
  const allAids = aids.pinyin && aids.spanish;
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
          {topics.map((topic, index) => <button key={topic.id} type="button" aria-current={index === topicIndex ? 'step' : undefined} onClick={() => selectTopic(index)}>
            <span className="grammar-topic-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{topicLabels[topic.id] ?? topic.title}</span>
          </button>)}
        </nav>
        <a className="grammar-practice-link" href="#grammar-practice" onClick={stopMandarinAudio}>Ir a la práctica <span aria-hidden="true">↗</span></a>
      </aside>

      <article className="grammar-study-topic" id={point.id} data-testid="grammar-topic">
        <header className="grammar-topic-header">
          <p className="eyebrow">COMPRENDE · TEMA {topicIndex + 1} DE {topics.length}</p>
          <h2 ref={topicHeading} tabIndex={-1}>{topicLabels[point.id] ?? point.title}</h2>
          <p className="grammar-topic-explanation">{topicSummaries[point.id] ?? point.explanation}</p>
          <details className="grammar-rule-detail" key={point.id}>
            <summary>Ver la regla con sus palabras en chino</summary>
            <p><SupportedText text={point.explanation} aids={aids}/></p>
          </details>
        </header>
        {point.pattern && <section className="grammar-pattern-guide" aria-label="Orden de la frase">
          <h3><span aria-hidden="true">01</span> Observa el orden</h3>
          <div className="grammar-pattern-parts">{point.pattern.split(/\s*(→|\+|·)\s*/).map((part, index) =>
            /^[→+·]$/.test(part) ? <span className="grammar-pattern-connector" key={index} aria-hidden="true">{part}</span>
              : <span className="grammar-pattern-part" key={index}><SupportedText text={part} aids={aids}/></span>)}</div>
        </section>}
        <section className="grammar-examples-guide" aria-label="Ejemplos con audio">
          <h3><span aria-hidden="true">02</span> Escucha y repite</h3>
          <p className="grammar-section-hint">Lee la frase y su significado. Escúchala y repítela en voz alta.</p>
          {point.examples.map((example, index) => <GrammarExample key={example} text={example} index={index} aids={aids}/>)}
        </section>
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
      <GrammarPractice exercises={exercises} showPinyin={aids.pinyin} showSpanish={aids.spanish}/>
    </div>
  </div>;
}
