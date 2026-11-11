'use client';

import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Exercise, SentenceEntry } from '@/data/types';
import { grammarAudio, grammarReading, grammarTextSegments } from '@/lib/grammar-language';
import { grammarPracticeModel } from '@/lib/grammar-practice';
import { compareExerciseAnswer } from '@/lib/pinyin';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { Hanzi } from './Hanzi';
import { LinkedChineseText } from './LinkedChineseText';
import { PinyinText } from './PinyinText';
import { SpeakButton, stopMandarinAudio } from './SpeakButton';
import './grammar-practice.css';

type Props = { exercises: Exercise[]; showPinyin: boolean; showSpanish: boolean; returnTo?: string; sentences?: SentenceEntry[] };
type SaveState = 'idle' | 'saving' | 'saved' | 'guest' | 'unavailable';

// Reading guidance for the existing sentence models; curriculum stays unchanged.
const sentenceOrderHints: Record<string, string> = {
  's-l5-1': 'Primero expresa el deseo, después nombra a la persona y termina con la felicitación de cumpleaños.',
  's-l5-2': 'La expresión que indica una acción breve se coloca después de «presentar».',
  's-l5-3': 'Después de «regalar» va la persona que recibe el regalo y, a continuación, lo que recibe.',
  's-l5-4': 'Empieza por la persona, añade «este año» y termina con la pregunta por su edad.',
  's-l5-5': 'Empieza por el día sobre el que preguntas y termina con la pregunta por la fecha.',
  's-l5-6': 'La palabra que enfatiza «precisamente» va delante del verbo «ser».',
  's-l5-7': 'Primero van quienes enseñan, después «enseñar», luego quien aprende y finalmente lo que aprende.',
  's-l5-8': 'Ordena el tiempo de mayor a menor: año, mes, día del mes, día de la semana, parte del día y hora.',
  's-l5-9': 'Sitúa «hoy» al principio y la negación de «ser» antes del día del mes.',
  's-l5-10': 'Después de «enseñar» va la persona que aprende y, a continuación, el idioma que aprende.',
  's-l5-11': 'La palabra que enfatiza «precisamente» va delante del verbo «ser».',
  's-l5-12': 'Conserva el orden persona, verbo y objeto. Aquí la entonación convierte la declaración en pregunta.',
  's-l5-13': 'Empieza por el cumpleaños de la persona, añade «ser» y pregunta primero por el mes y después por el día.',
  's-l5-14': 'Después del cumpleaños de la persona y del verbo «ser», indica primero el mes y después el día.',
  's-l5-15': '«También» se coloca antes del verbo. El animal del signo zodiacal va al final.',
  's-l5-16': '«A menudo» va antes de «enseñar». Después van las personas que aprenden y el idioma.',
  's-l5-17': 'El momento, «dentro de un rato», va al principio; después, las personas, la acción y la comida.',
  's-l5-18': 'La invitación va primero, después «nosotros» y al final «brindar». Aquí «nosotros» incluye a quien escucha.',
  's-l5-wb-19': 'Primero va «mañana», después el mes y luego el día. Para expresar esta fecha no hace falta «ser».',
  's-l5-wb-20': 'Después de «regalar» va la persona que recibe el regalo y, a continuación, lo que recibe.',
  's-l5-wb-21': 'La fecha de nacimiento va entre la persona y «nacer». El año se lee dígito a dígito.',
  's-l5-wb-22': 'Después de quien enseña y del verbo «enseñar», van las personas que aprenden y lo que aprenden.',
};

function readingDescription(id: string, showPinyin: boolean, showSpanish: boolean) {
  return [showPinyin && `${id}-pinyin`, showSpanish && `${id}-spanish`].filter(Boolean).join(' ') || undefined;
}

function PracticeWord({ id, text, showPinyin, showSpanish }: { id: string; text: string; showPinyin: boolean; showSpanish: boolean }) {
  const reading = grammarReading(text);
  return <span className="grammar-practice-word">
    <span className="grammar-practice-hanzi"><Hanzi>{text}</Hanzi></span>
    {showPinyin && reading?.pinyin && <PinyinText id={`${id}-pinyin`}>{reading.pinyin}</PinyinText>}
    {showSpanish && reading?.spanish && <span id={`${id}-spanish`} className="grammar-practice-translation">{reading.spanish}</span>}
  </span>;
}

function SupportedInstruction({ text, showPinyin, showSpanish, returnTo }: { text: string; showPinyin: boolean; showSpanish: boolean; returnTo: string }) {
  return <>{grammarTextSegments(text).map((segment, index) => segment.reading
    ? <span className="grammar-practice-inline-reading" key={index}>
      <LinkedChineseText text={segment.text} returnTo={returnTo} newTab />
      {showPinyin && <PinyinText>{segment.reading.pinyin}</PinyinText>}
      {showSpanish && <span className="grammar-practice-translation">{segment.reading.spanish}</span>}
    </span>
    : <Hanzi key={index}>{segment.text}</Hanzi>)}</>;
}

export function GrammarPractice({ exercises, showPinyin, showSpanish, returnTo, sentences }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const [firstResults, setFirstResults] = useState<boolean[]>([]);
  const [showModel, setShowModel] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [xp, setXp] = useState<number | null>(null);
  const checked = useRef(false);
  const requestVersion = useRef({ version: 0 });
  const startedAt = useRef(0);
  const usedModel = useRef(false);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const pathname = usePathname();
  const studyReturnTo = returnTo ?? pathname ?? '/course';

  useEffect(() => {
    startedAt.current = Date.now();
    const requests = requestVersion.current;
    return () => { requests.version++; };
  }, []);

  const exercise = exercises[index];
  const sentence = useMemo(() => exercise ? grammarPracticeModel(exercise, sentences) : undefined, [exercise, sentences]);
  const audio = useMemo(() => sentence ? grammarAudio(sentence.hanzi) : undefined, [sentence]);
  const segmentedAudio = Array.isArray(audio);
  const options = sentence?.options ?? [];
  const answer = selected.map(position => options[position]).join('');
  const completed = Math.min(index + (result === null ? 0 : 1), exercises.length);
  const allSelected = options.length > 0 && selected.length === options.length;
  const finished = exercises.length > 0 && index >= exercises.length;

  function addWord(position: number) {
    if (checked.current) return;
    setSelected(previous => previous.includes(position) ? previous : [...previous, position]);
  }

  function removeWord(position: number) {
    if (!checked.current) setSelected(previous => previous.filter(item => item !== position));
  }

  function startDragging(event: DragEvent<HTMLElement>, position: number) {
    if (!exercise || checked.current) { event.preventDefault(); return; }
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-ming-grammar-token', JSON.stringify([exercise.id, position]));
  }

  function acceptDrag(event: DragEvent<HTMLElement>) {
    if (!checked.current && event.dataTransfer.types.includes('application/x-ming-grammar-token')) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function dropWord(event: DragEvent<HTMLElement>, beforePosition?: number) {
    if (!exercise || checked.current) return;
    let payload: unknown;
    try { payload = JSON.parse(event.dataTransfer.getData('application/x-ming-grammar-token')); } catch { return; }
    if (!Array.isArray(payload) || payload[0] !== exercise.id || !Number.isInteger(payload[1]) || payload[1] < 0 || payload[1] >= options.length) return;
    const position = payload[1] as number;
    event.preventDefault();
    event.stopPropagation();
    if (position === beforePosition) return;
    setSelected(previous => {
      const remaining = previous.filter(item => item !== position);
      const insertion = beforePosition === undefined ? remaining.length : remaining.indexOf(beforePosition);
      const offset = insertion < 0 ? remaining.length : insertion;
      return [...remaining.slice(0, offset), position, ...remaining.slice(offset)];
    });
  }

  function revealModel() {
    if (!showModel) usedModel.current = true;
    setShowModel(previous => !previous);
  }

  async function checkAnswer() {
    if (!exercise || !allSelected || checked.current) return;
    checked.current = true;
    const correct = compareExerciseAnswer(exercise.type, answer, exercise.answer);
    const version = ++requestVersion.current.version;
    setResult(correct);
    setFirstResults(previous => previous.length > index ? previous : [...previous, correct]);
    setSaveState('saving');
    setXp(null);
    trackAnalyticsEvent('exercise_completed', { contentId: exercise.id, correct });
    try {
      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          answer,
          responseMs: Date.now() - startedAt.current,
          hintsUsed: Number(usedModel.current),
        }),
      });
      if (version !== requestVersion.current.version) return;
      if (response.status === 401) { setSaveState('guest'); return; }
      if (!response.ok) { setSaveState('unavailable'); return; }
      const body = await response.json() as { xp?: number };
      if (version !== requestVersion.current.version) return;
      setSaveState('saved');
      if (typeof body.xp === 'number') setXp(body.xp);
    } catch {
      if (version === requestVersion.current.version) setSaveState('unavailable');
    }
  }

  function resetAnswer(afterReview = false) {
    stopMandarinAudio();
    requestVersion.current.version++;
    checked.current = false;
    usedModel.current = afterReview;
    startedAt.current = Date.now();
    setSelected([]);
    setResult(null);
    setShowModel(false);
    setSaveState('idle');
    setXp(null);
  }

  function next() {
    resetAnswer();
    setIndex(previous => previous + 1);
    requestAnimationFrame(() => {
      const heading = index + 1 >= exercises.length ? summaryRef.current : questionRef.current;
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }

  function repeat() {
    resetAnswer();
    setIndex(0);
    setFirstResults([]);
    requestAnimationFrame(() => {
      questionRef.current?.focus({ preventScroll: true });
      questionRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }

  if (!exercises.length) return null;

  const model = sentence && <div className="grammar-practice-model">
    <p className="grammar-practice-model-hanzi"><LinkedChineseText text={sentence.hanzi} returnTo={studyReturnTo} newTab /></p>
    {showPinyin && sentence.pinyin && <p><PinyinText>{sentence.pinyin}</PinyinText></p>}
    {showSpanish && sentence.spanish && <p className="grammar-practice-model-translation">{sentence.spanish}</p>}
    {exercise && <p className="grammar-practice-order-hint"><strong>Fíjate en el orden:</strong> <SupportedInstruction text={sentenceOrderHints[exercise.itemId] ?? exercise.rule} showPinyin={showPinyin} showSpanish={showSpanish} returnTo={studyReturnTo} /></p>}
  </div>;

  return <section className="grammar-practice" aria-labelledby="grammar-practice-title">
    <header className="grammar-practice-header">
      <div><p className="eyebrow">AHORA TÚ</p><h2 id="grammar-practice-title">Práctica gramatical</h2></div>
      <span className="grammar-practice-count">{finished ? exercises.length : index + 1} / {exercises.length} frases</span>
    </header>
    <p className="grammar-practice-intro">Escucha, ordena las palabras y comprueba. Puedes repetir el audio y consultar el modelo siempre que lo necesites.</p>
    <progress className="grammar-practice-progress" max={exercises.length} value={completed} aria-label="Frases practicadas" />

    {finished ? <div className="grammar-practice-summary">
      <span className="grammar-practice-summary-icon" aria-hidden="true">✓</span>
      <h3 ref={summaryRef} tabIndex={-1}>Práctica completada</h3>
      <p>Has practicado {exercises.length} frases.</p>
      <p><strong>{firstResults.filter(Boolean).length} de {exercises.length}</strong> correctas en el primer intento.</p>
      <p>Puedes repetir la práctica con las ayudas o desactivarlas para recordar por tu cuenta.</p>
      <button type="button" className="button button-primary" onClick={repeat}>Repetir práctica</button>
    </div> : exercise && <>
      <div className="grammar-practice-prompt">
        <span className="grammar-practice-step">1 · {audio ? 'Escucha' : 'Lee'} y comprende</span>
        <h3 ref={questionRef} tabIndex={-1}><SupportedInstruction text={exercise.type === 'order' && sentence?.spanish ? sentence.spanish : exercise.prompt} showPinyin={showPinyin} showSpanish={showSpanish} returnTo={studyReturnTo} /></h3>
        {sentence && audio && <div className="grammar-practice-audio">
          <SpeakButton key={`${exercise.id}-normal`} text={sentence.hanzi} audioSrc={audio} reading={sentence.pinyin} rate={1} label={segmentedAudio ? 'Escuchar por partes' : 'Escuchar frase'} ariaLabel={segmentedAudio ? 'Escuchar por partes' : 'Escuchar frase'} />
          <SpeakButton key={`${exercise.id}-slow`} text={sentence.hanzi} audioSrc={audio} reading={sentence.pinyin} rate={0.7} label="Escuchar despacio" ariaLabel="Escuchar despacio" />
        </div>}
        {segmentedAudio && <p className="grammar-practice-audio-note">Escucha las palabras por separado y luego une la frase al repetir.</p>}
        {!audio && <p className="grammar-practice-audio-note">Esta frase aún no tiene audio. Puedes construirla y consultar el modelo.</p>}
        {result === null && <button className="grammar-practice-model-toggle" type="button" aria-expanded={showModel} onClick={revealModel}>{showModel ? 'Ocultar modelo' : 'Ver modelo de apoyo'}</button>}
        {showModel && result === null && model}
      </div>

      <div className="grammar-practice-build">
        <div className="grammar-practice-build-heading"><span className="grammar-practice-step">2 · Construye la frase</span><small>{selected.length} / {options.length} palabras</small></div>
        <p className="grammar-practice-help">Toca las palabras en orden. Para retirar una, tócala en tu respuesta.</p>
        <div className="grammar-practice-bank" role="group" aria-label="Palabras disponibles">
          {options.map((token, position) => <button type="button" className={selected.includes(position) ? 'is-used' : ''} key={`${exercise.id}-${position}`} aria-label={`Añadir: ${token}`} aria-describedby={readingDescription(`${exercise.id}-bank-${position}`, showPinyin, showSpanish)} disabled={selected.includes(position) || result !== null} draggable={!selected.includes(position) && result === null} onDragStart={event => startDragging(event, position)} onClick={() => addWord(position)}>
            <PracticeWord id={`${exercise.id}-bank-${position}`} text={token} showPinyin={showPinyin} showSpanish={showSpanish} />
          </button>)}
        </div>
        <div className="grammar-practice-answer-heading"><span>Tu respuesta</span><div>
          <button type="button" onClick={() => { if (!checked.current) setSelected(previous => previous.slice(0, -1)); }} disabled={!selected.length || result !== null}>Deshacer</button>
          <button type="button" onClick={() => { if (!checked.current) setSelected([]); }} disabled={!selected.length || result !== null}>Borrar todo</button>
        </div></div>
        <div className="grammar-practice-answer" role="group" aria-label="Tu frase ordenada" onDragOver={acceptDrag} onDrop={event => dropWord(event)}>
          {selected.length ? selected.map((position, order) => <button type="button" key={`${exercise.id}-${position}`} aria-label={`Quitar: ${options[position]}`} aria-describedby={readingDescription(`${exercise.id}-answer-${position}`, showPinyin, showSpanish)} disabled={result !== null} draggable={result === null} onDragStart={event => startDragging(event, position)} onDragOver={acceptDrag} onDrop={event => dropWord(event, position)} onClick={() => removeWord(position)}>
            <small className="grammar-practice-position" aria-hidden="true">{order + 1}</small>
            <PracticeWord id={`${exercise.id}-answer-${position}`} text={options[position]} showPinyin={showPinyin} showSpanish={showSpanish} />
          </button>) : <p>Tu frase aparecerá aquí, palabra por palabra.</p>}
        </div>
      </div>

      {result === null ? <div className="grammar-practice-check">
        <button type="button" className="button button-primary" disabled={!allSelected} onClick={() => void checkAnswer()}>Comprobar</button>
        {!allSelected && <small>Coloca todas las palabras para comprobar la frase.</small>}
      </div> : <div className={`grammar-practice-feedback ${result ? 'is-correct' : 'is-review'}`} role="status">
        <span className="grammar-practice-step">3 · Comprueba y repite</span>
        <h3>{result ? '¡Bien hecho!' : 'Vamos a repasarla'}</h3>
        <p>{result ? `Has colocado todas las palabras en el orden de la frase. ${audio ? 'Escúchala' : 'Léela'} otra vez y repítela en voz alta.` : `Compara tu orden con el modelo. ${audio ? 'Escucha' : 'Lee'} la frase, fíjate en qué palabra va primero y vuelve a construirla.`}</p>
        {exercise.type !== 'order' && <p className="grammar-practice-explanation"><SupportedInstruction text={exercise.explanation} showPinyin={showPinyin} showSpanish={showSpanish} returnTo={studyReturnTo} /></p>}
        {model}
        {sentence && audio && <div className="grammar-practice-feedback-audio"><SpeakButton text={sentence.hanzi} audioSrc={audio} reading={sentence.pinyin} rate={1} label={segmentedAudio ? 'Escuchar respuesta por partes' : 'Escuchar respuesta'} ariaLabel={segmentedAudio ? 'Escuchar respuesta por partes' : 'Escuchar respuesta'} /></div>}
        <div className="grammar-practice-save">
          {saveState === 'saving' && <small>Guardando tu progreso…</small>}
          {saveState === 'saved' && <small>Progreso guardado{xp !== null ? ` · +${xp} XP` : ''}.</small>}
          {saveState === 'guest' && <small>Puedes seguir practicando. <Link href={`/login?returnTo=${encodeURIComponent(studyReturnTo)}`}>Elige un nombre</Link> para guardar tu progreso.</small>}
          {saveState === 'unavailable' && <small>La respuesta se ha comprobado, pero no se pudo guardar tu progreso. Puedes continuar practicando.</small>}
        </div>
        <div className="grammar-practice-next">
          {!result && <button type="button" className="button" onClick={() => resetAnswer(true)}>Intentar de nuevo</button>}
          <button type="button" className="button button-primary" onClick={next}>{index + 1 === exercises.length ? 'Ver resultado' : 'Siguiente frase'} <span aria-hidden="true">→</span></button>
        </div>
      </div>}
    </>}
  </section>;
}
