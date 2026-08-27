'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterEntry } from '@/data/types';
import { cumulativeStrokeSets, strokeDirection } from '@/lib/hanzi/geometry';
import { loadHanziData } from '@/lib/hanzi/loader';
import { updateLocalHanziProgress } from '@/lib/hanzi/mastery';
import type { HanziAttemptPayload, HanziCharacterData, HanziManifestEntry, HanziPracticeMode, HanziSkillDimension } from '@/lib/hanzi/types';
import { HanziStrokeSvg } from './HanziStrokeSvg';
import { HanziWriterStage, type HanziWriterStageHandle, type QuizSummary } from './HanziWriterStage';

const tabs = ['Aprender', 'Componentes', 'Trazos', 'Practicar'] as const;
type Tab = typeof tabs[number];
type MasteryMap = Record<string, Partial<Record<HanziSkillDimension, number>>>;

type Props = {
  characters: CharacterEntry[];
  manifest: Record<string, HanziManifestEntry>;
  initialMastery?: MasteryMap;
  initialCharacter?: string;
  initialTab?: Tab;
};

export function HanziLab({ characters, manifest, initialMastery = {}, initialCharacter = '好', initialTab = 'Aprender' }: Props) {
  const firstIndex = Math.max(0, characters.findIndex((item) => item.hanzi === initialCharacter));
  const [index, setIndex] = useState(firstIndex);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [loaded, setLoaded] = useState<{ character: string; data?: HanziCharacterData; error?: string } | null>(null);
  const [mastery, setMastery] = useState<MasteryMap>(initialMastery);
  const [saveMessage, setSaveMessage] = useState('');
  const character = characters[index];
  const technical = manifest[character.hanzi];
  const data = loaded?.character === character.hanzi ? loaded.data ?? null : null;
  const loadError = loaded?.character === character.hanzi ? loaded.error ?? '' : '';

  useEffect(() => {
    let active = true;
    void loadHanziData(character.hanzi).then((result) => {
      if (active) setLoaded({ character: character.hanzi, data: result });
    }).catch(() => {
      if (active) setLoaded({ character: character.hanzi, error: `No hay datos de trazos disponibles para ${character.hanzi}.` });
    });
    return () => { active = false; };
  }, [character.hanzi]);

  async function persistAttempt(payload: HanziAttemptPayload) {
    setSaveMessage('Guardando…');
    try {
      const response = await fetch('/api/hanzi/practice', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        saveLocal(payload);
        setSaveMessage('Progreso guardado en este dispositivo. Elige un nombre para sincronizarlo.');
        return;
      }
      const result = await response.json() as { mastery?: number; error?: string };
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el intento.');
      if (typeof result.mastery === 'number') {
        setMastery((current) => ({
          ...current,
          [character.id]: { ...current[character.id], [payload.skillDimension]: result.mastery },
        }));
      }
      setSaveMessage('Progreso sincronizado.');
    } catch {
      saveLocal(payload);
      setSaveMessage('Sin conexión: el resumen quedó guardado en este dispositivo.');
    }
  }

  function saveLocal(payload: HanziAttemptPayload) {
    const key = 'ming-hanzi-progress-v1';
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, ReturnType<typeof updateLocalHanziProgress>>;
      stored[`${payload.characterId}:${payload.skillDimension}`] = updateLocalHanziProgress(stored[`${payload.characterId}:${payload.skillDimension}`], payload);
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // A blocked localStorage must never prevent practice.
    }
  }

  function markDimension(skillDimension: 'recognition' | 'stroke_order') {
    void persistAttempt({
      characterId: character.id,
      mode: 'guided',
      skillDimension,
      completed: true,
      correctStrokes: skillDimension === 'stroke_order' ? technical?.strokeCount ?? character.strokeCount : 0,
      mistakes: 0,
      hintsUsed: 0,
      durationMs: 1,
      usedAnswer: false,
    });
  }

  return <div className="hanzi-workspace">
    <section className="panel hanzi-character-picker" aria-label="Selector de caracteres">
      <div className="hanzi-picker-heading">
        <div><p className="eyebrow">INVENTARIO · LECCIÓN 1</p><h2>Elige un carácter</h2></div>
        <span>{characters.length} disponibles</span>
      </div>
      <div>{characters.map((item, itemIndex) => <button
        type="button"
        className={itemIndex === index ? 'selected' : ''}
        aria-pressed={itemIndex === index}
        onClick={() => { setIndex(itemIndex); setSaveMessage(''); }}
        key={item.id}
      >{item.hanzi}<small>{item.pinyin}</small></button>)}</div>
    </section>

    <section className="hanzi-character-hero panel">
      <div className="hanzi-glyph">{character.hanzi}</div>
      <div className="hanzi-character-copy">
        <p className="eyebrow">CARÁCTER ACTIVO</p>
        <h2>{character.pinyin} <small>{character.meaning}</small></h2>
        <div className="hanzi-badges">
          <span>{technical?.strokeCount ?? character.strokeCount} trazos verificados</span>
          <span>Radical {character.radical}</span>
          <span>{character.writingRequired ? 'Escritura requerida' : 'Reconocimiento / repaso'}</span>
          <span className={technical?.available ? 'available' : 'unavailable'}>{technical?.available ? 'Datos locales listos' : 'Datos no disponibles'}</span>
        </div>
        <p className="source-note">Fuente curricular: {character.source.file}, PDF {character.source.pdfPage}{character.source.printedPage ? ` / impresa ${character.source.printedPage}` : ''}.</p>
      </div>
      <MasterySummary values={mastery[character.id]} />
    </section>

    <nav className="hanzi-tabs" aria-label="Secciones del laboratorio">
      {tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}
    </nav>

    {loadError ? <section className="panel hanzi-fallback" role="status">
      <h2>{loadError}</h2>
      <p>Puedes continuar con reconocimiento, significado y componentes. La práctica geométrica queda desactivada para no simular información.</p>
      <button type="button" onClick={() => setTab('Componentes')}>Ver componentes</button>
    </section> : !data ? <section className="panel hanzi-loading" aria-live="polite">Preparando los trazos de {character.hanzi}…</section> : <>
      {tab === 'Aprender' && <LearnPanel key={character.id} character={character} onMastered={() => markDimension('recognition')} />}
      {tab === 'Componentes' && <ComponentsPanel key={character.id} character={character} />}
      {tab === 'Trazos' && <StrokesPanel key={character.id} character={character} data={data} onMastered={() => markDimension('stroke_order')} />}
      {tab === 'Practicar' && <PracticePanel key={character.id} character={character} data={data} onAttempt={persistAttempt} />}
    </>}

    {saveMessage && <p className="hanzi-save-message" role="status">{saveMessage} {saveMessage.includes('nombre') && <Link href={`/login?returnTo=${encodeURIComponent('/lesson/1/hanzi')}`}>Elegir nombre →</Link>}</p>}
  </div>;
}

function MasterySummary({ values }: { values?: Partial<Record<HanziSkillDimension, number>> }) {
  const rows: Array<[HanziSkillDimension, string]> = [['recognition', 'Reconocimiento'], ['stroke_order', 'Orden'], ['writing', 'Escritura']];
  return <div className="hanzi-mastery" aria-label="Dominio del carácter">
    {rows.map(([key, label]) => <div key={key}><span>{label}</span><b>{typeof values?.[key] === 'number' ? `${Math.round(values[key]!)}%` : '—'}</b></div>)}
  </div>;
}

function LearnPanel({ character, onMastered }: { character: CharacterEntry; onMastered: () => void }) {
  const stage = useRef<HanziWriterStageHandle>(null);
  const [visible, setVisible] = useState(true);
  return <section className="panel hanzi-tab-panel hanzi-learn-panel">
    <div className="hanzi-panel-copy">
      <p className="eyebrow">01 · APRENDER</p>
      <h2>Observa el carácter completo</h2>
      <p>Usa la cuadrícula 米字格 para comparar proporción y centro. La animación respeta el orden y la dirección de los datos técnicos.</p>
      <div className="hanzi-controls">
        <button type="button" onClick={() => stage.current?.animate()}>▶ Animar</button>
        <button type="button" onClick={() => { setVisible((current) => { const next = !current; if (next) stage.current?.show(); else stage.current?.hide(); return next; }); }}>{visible ? 'Ocultar carácter' : 'Mostrar carácter'}</button>
        <button type="button" onClick={() => stage.current?.animate()}>↻ Repetir</button>
      </div>
      <button className="button button-primary" type="button" onClick={onMastered}>Lo reconozco</button>
    </div>
    <HanziWriterStage ref={stage} character={character.hanzi} />
  </section>;
}

function ComponentsPanel({ character }: { character: CharacterEntry }) {
  return <section className="panel hanzi-tab-panel components-panel">
    <div>
      <p className="eyebrow">02 · COMPONENTES</p>
      <h2>Composición respaldada</h2>
      <p>Esta vista separa las piezas registradas por el inventario curricular. No propone etimologías ni historias mnemotécnicas no documentadas.</p>
    </div>
    <div className="component-map" aria-label={`Componentes de ${character.hanzi}`}>
      <div className="component-whole"><strong>{character.hanzi}</strong><span>carácter</span></div>
      <b aria-hidden="true">→</b>
      <div className="component-pieces">{character.components.map((component, index) => <article key={`${component}-${index}`}><strong>{component}</strong><span>{component === character.radical ? 'radical registrado' : 'componente registrado'}</span></article>)}</div>
    </div>
    <aside className="component-source"><b>Alcance pedagógico</b><p>Radical: {character.radical}. Componentes: {character.components.join(' + ')}. Fuente: página PDF {character.source.pdfPage}.</p></aside>
  </section>;
}

function StrokesPanel({ character, data, onMastered }: { character: CharacterEntry; data: HanziCharacterData; onMastered: () => void }) {
  const animationStage = useRef<HanziWriterStageHandle>(null);
  const stepStage = useRef<HanziWriterStageHandle>(null);
  const [mode, setMode] = useState<'answer' | 'animation' | 'step' | 'fan'>('answer');
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const sets = useMemo(() => cumulativeStrokeSets(data), [data]);
  const directions = useMemo(() => data.medians.map(strokeDirection), [data]);

  function nextStep() {
    const next = step >= data.strokes.length ? 0 : step;
    stepStage.current?.animateStroke(next);
    setStep(next + 1);
  }

  return <section className="panel hanzi-tab-panel strokes-panel">
    <div className="hanzi-panel-heading">
      <div><p className="eyebrow">03 · TRAZOS</p><h2>Orden, inicio y dirección</h2></div>
      <div className="hanzi-subtabs">
        <button className={mode === 'answer' ? 'selected' : ''} type="button" onClick={() => setMode('answer')}>Respuesta</button>
        <button className={mode === 'animation' ? 'selected' : ''} type="button" onClick={() => setMode('animation')}>Animación</button>
        <button className={mode === 'step' ? 'selected' : ''} type="button" onClick={() => setMode('step')}>Paso a paso</button>
        <button className={mode === 'fan' ? 'selected' : ''} type="button" onClick={() => setMode('fan')}>Despiece</button>
      </div>
    </div>

    {mode === 'answer' && <div className="stroke-answer-layout">
      <HanziStrokeSvg character={character.hanzi} data={data} />
      <div><h3>Cómo leer la respuesta</h3><p><i className="legend-dot" /> El punto marca dónde inicia cada trazo.</p><p><i className="legend-arrow">→</i> La línea roja indica el recorrido y su flecha, la dirección.</p><ol>{directions.map((direction, index) => <li key={index}>Trazo {index + 1}: hacia {direction.label}.</li>)}</ol></div>
    </div>}

    {mode === 'animation' && <div className="stroke-stage-layout">
      <HanziWriterStage ref={animationStage} character={character.hanzi} speed={speed} />
      <div><h3>Animación controlada</h3><div className="hanzi-controls"><button type="button" onClick={() => { setPaused(false); animationStage.current?.animate(); }}>▶ Reproducir</button><button type="button" onClick={() => { if (paused) animationStage.current?.resume(); else animationStage.current?.pause(); setPaused(!paused); }}>{paused ? 'Continuar' : 'Pausa'}</button><button type="button" onClick={() => { setPaused(false); animationStage.current?.animate(); }}>↻ Repetir</button></div><div className="speed-picker" aria-label="Velocidad">{[0.5, 0.75, 1].map((value) => <button type="button" className={speed === value ? 'selected' : ''} onClick={() => setSpeed(value)} key={value}>{value}×</button>)}</div></div>
    </div>}

    {mode === 'step' && <div className="stroke-stage-layout">
      <HanziWriterStage ref={stepStage} character={character.hanzi} showCharacter={false} />
      <div><h3>Un trazo por vez</h3><p>Avance actual: <b>{step}</b> / {data.strokes.length}</p><div className="hanzi-controls"><button type="button" onClick={nextStep}>Mostrar siguiente</button><button type="button" onClick={() => { setStep(0); stepStage.current?.hide(); }}>Reiniciar</button></div></div>
    </div>}

    {mode === 'fan' && <div className="stroke-fan" aria-label={`Despiece acumulativo de ${character.hanzi}`}>{sets.map((set, itemIndex) => <article key={itemIndex}><span>{itemIndex + 1} / {data.strokes.length}</span><HanziStrokeSvg character={character.hanzi} data={{ ...data, strokes: set }} visibleStrokes={set.length} showDirections={false} showNumbers={false} compact /></article>)}</div>}
    <div className="hanzi-confirm-row"><button className="button button-primary" type="button" onClick={onMastered}>Ya entiendo el orden</button></div>
  </section>;
}

function PracticePanel({ character, data, onAttempt }: { character: CharacterEntry; data: HanziCharacterData; onAttempt: (payload: HanziAttemptPayload) => Promise<void> }) {
  const stage = useRef<HanziWriterStageHandle>(null);
  const [mode, setMode] = useState<HanziPracticeMode>('guided');
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [hints, setHints] = useState(0);
  const [usedAnswer, setUsedAnswer] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [feedback, setFeedback] = useState('Elige un modo y comienza cuando estés listo.');

  function chooseMode(value: HanziPracticeMode) {
    stage.current?.cancelQuiz();
    setMode(value);
    setReady(false);
    setStarted(false);
    setMistakes(0);
    setCorrect(0);
    setHints(0);
    setUsedAnswer(false);
    setAnswerVisible(false);
    setFeedback('Elige un modo y comienza cuando estés listo.');
  }

  function start() {
    setStarted(true);
    setMistakes(0);
    setCorrect(0);
    setHints(0);
    setUsedAnswer(false);
    setFeedback('Empieza en el punto correcto y sigue la dirección del trazo.');
    stage.current?.startQuiz(mode);
  }

  function reveal(show: boolean) {
    if (!started) return;
    setAnswerVisible(show);
    if (show) {
      setHints((value) => value + 1);
      setUsedAnswer(true);
      stage.current?.show();
    } else stage.current?.hide();
  }

  function complete(summary: QuizSummary) {
    setStarted(false);
    setFeedback(summary.mistakes === 0 ? '完成 · Orden y dirección correctos.' : `Completado con ${summary.mistakes} ${summary.mistakes === 1 ? 'ajuste' : 'ajustes'}. Volverá en el repaso.`);
    void onAttempt({
      characterId: character.id,
      mode,
      skillDimension: 'writing',
      completed: true,
      correctStrokes: summary.correctStrokes,
      mistakes: summary.mistakes,
      hintsUsed: hints,
      durationMs: summary.durationMs,
      usedAnswer,
    });
  }

  return <section className="panel hanzi-tab-panel practice-panel">
    <div className="hanzi-panel-heading">
      <div><p className="eyebrow">04 · PRACTICAR</p><h2>Escribe {character.hanzi}</h2></div>
      <div className="practice-modes" role="group" aria-label="Nivel de ayuda">
        {([['guided', 'Con guía'], ['independent', 'Sin guía'], ['exam', 'Examen']] as const).map(([value, label]) => <button type="button" className={mode === value ? 'selected' : ''} onClick={() => chooseMode(value)} key={value}>{label}</button>)}
      </div>
    </div>
    <div className="practice-stage-layout">
      <div>
        <HanziWriterStage
          ref={stage}
          character={character.hanzi}
          showCharacter={false}
          showOutline={mode === 'guided'}
          interactive
          onReady={() => setReady(true)}
          onMistake={(total, mistakesOnStroke) => {
            setMistakes(total);
            if ((mode === 'guided' && mistakesOnStroke === 2) || (mode === 'independent' && mistakesOnStroke === 4)) setHints((value) => value + 1);
            setFeedback('Todavía no. Revisa el punto de inicio y la dirección.');
          }}
          onCorrectStroke={(count) => { setCorrect(count); setFeedback(`Trazo ${count} de ${data.strokes.length} correcto.`); }}
          onQuizComplete={complete}
        />
        <p className="privacy-note">Se guarda solo el resumen del intento; nunca tus coordenadas de escritura.</p>
      </div>
      <aside>
        <h3>{mode === 'guided' ? 'Guía visible y pistas progresivas' : mode === 'independent' ? 'Cuadrícula sin contorno' : 'Sin contorno ni pistas automáticas'}</h3>
        <div className="practice-counters"><span><b>{correct}</b>/{data.strokes.length} trazos</span><span><b>{mistakes}</b> errores</span><span><b>{hints}</b> consultas</span></div>
        <p className="practice-feedback" aria-live="polite">{feedback}</p>
        <div className="hanzi-controls">
          <button className="button button-primary" type="button" disabled={!ready || started} onClick={start}>{started ? 'Práctica activa' : 'Comenzar'}</button>
          <button
            type="button"
            disabled={!started}
            aria-pressed={answerVisible}
            onPointerDown={(event) => { event.preventDefault(); reveal(true); }}
            onPointerUp={() => reveal(false)}
            onPointerCancel={() => reveal(false)}
            onPointerLeave={() => answerVisible && reveal(false)}
            onKeyDown={(event) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); reveal(!answerVisible); } }}
          >Mantén para ver respuesta</button>
          <button type="button" disabled={!started} onClick={() => { stage.current?.cancelQuiz(); setStarted(false); setFeedback('Intento cancelado; no se guardó.'); }}>Cancelar</button>
        </div>
      </aside>
    </div>
  </section>;
}
