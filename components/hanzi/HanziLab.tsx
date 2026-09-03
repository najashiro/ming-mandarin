'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterEntry, HanziStageId } from '@/data/types';
import { strokeDirection } from '@/lib/hanzi/geometry';
import { loadHanziData } from '@/lib/hanzi/loader';
import { updateLocalHanziProgress } from '@/lib/hanzi/mastery';
import { classifyHanziLearningState, summarizeHanziStages, type LocalHanziProgressMap } from '@/lib/hanzi/progress';
import type { HanziAttemptPayload, HanziCharacterData, HanziLearningState, HanziManifestEntry, HanziPracticeMode, HanziProgressMap, HanziSkillDimension } from '@/lib/hanzi/types';
import { strokeNamesForCharacter } from '@/lib/hanzi/stroke-names';
import { HanziStrokeSvg } from './HanziStrokeSvg';
import { HanziWriterStage, type HanziWriterStageHandle, type QuizSummary } from './HanziWriterStage';
import { CommunityButton } from '@/components/community/CommunityProvider';
import { SpeakButton } from '@/components/SpeakButton';
import { audioForMandarinText } from '@/lib/mandarin-audio';

const tabs = ['Aprender', 'Componentes', 'Trazos', 'Practicar'] as const;
type Tab = typeof tabs[number];
type StateFilter = 'all' | HanziLearningState;
type StageFilter = 'all' | HanziStageId;
type Stage = { id: HanziStageId; title: string; shortTitle: string; chinese: string; description: string; characters: string[] };

const stateOptions: Array<[StateFilter, string]> = [
  ['all', 'Todos'], ['new', 'Nuevos'], ['learning', 'Aprendiendo'], ['review', 'Repasar'], ['mastered', 'Dominados'],
];

const stateLabels: Record<HanziLearningState, string> = {
  new: 'Nuevo', learning: 'Aprendiendo', review: 'Repasar', mastered: 'Dominado',
};

type Props = {
  characters: CharacterEntry[];
  stages: Stage[];
  manifest: Record<string, HanziManifestEntry>;
  initialProgress?: HanziProgressMap;
  initialCharacter?: string;
  initialTab?: Tab;
};

export function HanziLab({ characters, stages, manifest, initialProgress = {}, initialCharacter = '好', initialTab = 'Aprender' }: Props) {
  const firstCharacter = characters.find((item) => item.hanzi === initialCharacter) ?? characters[0];
  const [selectedId, setSelectedId] = useState(firstCharacter.id);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [loaded, setLoaded] = useState<{ character: string; data?: HanziCharacterData; error?: string } | null>(null);
  const [progress, setProgress] = useState<HanziProgressMap>(initialProgress);
  const [localProgress, setLocalProgress] = useState<LocalHanziProgressMap>({});
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setLocalProgress(JSON.parse(localStorage.getItem('ming-hanzi-progress-v1') || '{}') as LocalHanziProgressMap); }
      catch { setLocalProgress({}); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const displayedCharacters = useMemo(() => characters.filter((item) => {
    const stageMatches = stageFilter === 'all' || item.primaryStage === stageFilter;
    const state = classifyHanziLearningState(item.id, progress[item.id], localProgress);
    return stageMatches && (stateFilter === 'all' || state === stateFilter);
  }), [characters, localProgress, progress, stageFilter, stateFilter]);
  const selectedVisible = displayedCharacters.find((item) => item.id === selectedId);
  const character = selectedVisible ?? displayedCharacters[0] ?? characters.find((item) => item.id === selectedId) ?? characters[0];
  const technical = manifest[character.hanzi];
  const data = loaded?.character === character.hanzi ? loaded.data ?? null : null;
  const loadError = loaded?.character === character.hanzi ? loaded.error ?? '' : '';
  const stageSummary = useMemo(() => summarizeHanziStages(characters, progress, localProgress), [characters, localProgress, progress]);
  const studied = stageSummary.reduce((sum, item) => sum + item.studied, 0);

  useEffect(() => {
    let active = true;
    void loadHanziData(character.hanzi).then((result) => {
      if (active) setLoaded({ character: character.hanzi, data: result });
    }).catch(() => {
      if (active) setLoaded({ character: character.hanzi, error: `No hay datos de trazos disponibles para ${character.hanzi}.` });
    });
    return () => { active = false; };
  }, [character.hanzi]);

  function selectCharacter(id: string) {
    setSelectedId(id);
    setSaveMessage('');
  }

  function continueLearning() {
    const priority: HanziLearningState[] = ['review', 'learning', 'new', 'mastered'];
    const next = priority.flatMap((state) => characters.filter((item) => classifyHanziLearningState(item.id, progress[item.id], localProgress) === state))[0];
    if (next) {
      setStageFilter(next.primaryStage ?? 'all');
      setStateFilter('all');
      selectCharacter(next.id);
      setTab(classifyHanziLearningState(next.id, progress[next.id], localProgress) === 'new' ? 'Aprender' : 'Practicar');
    }
  }

  async function persistAttempt(payload: HanziAttemptPayload) {
    setSaveMessage('Guardando…');
    try {
      const response = await fetch('/api/hanzi/practice', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        saveLocal(payload);
        setSaveMessage('Progreso guardado en este dispositivo. Elige un nombre para sincronizarlo.');
        return;
      }
      const result = await response.json() as { mastery?: number; stability?: number; exposures?: number; nextReviewAt?: string; error?: string };
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el intento.');
      if (typeof result.mastery === 'number') {
        setProgress((current) => {
          const entry = current[payload.characterId] ?? { dimensions: {}, openErrors: 0 };
          return { ...current, [payload.characterId]: { ...entry, dimensions: { ...entry.dimensions, [payload.skillDimension]: {
            mastery: result.mastery!, stability: result.stability ?? 0, exposures: result.exposures ?? 1,
            nextReviewAt: result.nextReviewAt ?? null, lastSeenAt: new Date().toISOString(),
          } } } };
        });
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
      setLocalProgress((current) => {
        const next = { ...current, [`${payload.characterId}:${payload.skillDimension}`]: updateLocalHanziProgress(current[`${payload.characterId}:${payload.skillDimension}`], payload) };
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    } catch {
      // A blocked localStorage must never prevent practice.
    }
  }

  function markDimension(skillDimension: 'recognition' | 'stroke_order') {
    void persistAttempt({
      characterId: character.id, mode: 'guided', skillDimension, completed: true,
      correctStrokes: skillDimension === 'stroke_order' ? technical?.strokeCount ?? character.strokeCount : 0,
      mistakes: 0, hintsUsed: 0, durationMs: 1, usedAnswer: false,
    });
  }

  return <div className="hanzi-workspace">
    <section className="panel hanzi-route" aria-label="Ruta pedagógica Hanzi">
      <div className="hanzi-route-heading"><div><p className="eyebrow">RUTA HANZI · LECCIÓN 1</p><h2>{studied} / {characters.length} estudiados</h2></div><button className="button button-primary" type="button" onClick={continueLearning}>Continuar aprendiendo</button></div>
      <div className="hanzi-stage-progress">{stages.map((stage, index) => {
        const summary = stageSummary.find((item) => item.stage === stage.id)!;
        return <button type="button" className={stageFilter === stage.id ? 'selected' : ''} onClick={() => setStageFilter(stage.id)} key={stage.id}>
          <span>{stage.id}</span><div><b>{stage.shortTitle}</b><small>{summary.studied}/{summary.total} con práctica</small><i><em style={{ width: `${summary.total ? summary.studied / summary.total * 100 : 0}%` }} /></i></div>{index < stages.length - 1 && <strong aria-hidden="true">→</strong>}
        </button>;
      })}</div>
    </section>

    <section className="panel hanzi-character-picker" aria-label="Selector de caracteres">
      <div className="hanzi-picker-heading"><div><p className="eyebrow">¿QUÉ DEBERÍAS APRENDER AHORA?</p><h2>Elige etapa y estado</h2></div><span>{displayedCharacters.length} de {characters.length}</span></div>
      <div className="hanzi-filter-row">
        <div className="stage-filter-desktop" role="group" aria-label="Etapa pedagógica"><button type="button" className={stageFilter === 'all' ? 'selected' : ''} onClick={() => setStageFilter('all')}>Todos</button>{stages.map((stage) => <button type="button" className={stageFilter === stage.id ? 'selected' : ''} onClick={() => setStageFilter(stage.id)} key={stage.id}>{stage.id} {stage.shortTitle}</button>)}</div>
        <label className="stage-filter-mobile">Etapa<select value={stageFilter} onChange={(event) => setStageFilter(event.target.value === 'all' ? 'all' : Number(event.target.value) as HanziStageId)}><option value="all">Todas</option>{stages.map((stage) => <option value={stage.id} key={stage.id}>{stage.id} · {stage.title}</option>)}</select></label>
        <div className="state-filter" role="group" aria-label="Estado de aprendizaje">{stateOptions.map(([value, label]) => <button type="button" className={stateFilter === value ? 'selected' : ''} onClick={() => setStateFilter(value)} key={value}>{label}</button>)}</div>
      </div>
      {displayedCharacters.length ? <div className="hanzi-picker-grid">{displayedCharacters.map((item) => {
        const state = classifyHanziLearningState(item.id, progress[item.id], localProgress);
        return <button type="button" className={item.id === character.id ? 'selected' : ''} aria-pressed={item.id === character.id} onClick={() => selectCharacter(item.id)} key={item.id}>{item.hanzi}<small>{item.pinyin}</small><em>{stateLabels[state]}</em></button>;
      })}</div> : <div className="hanzi-filter-empty"><p>No hay caracteres que coincidan con ambos filtros.</p><button type="button" onClick={() => { setStageFilter('all'); setStateFilter('all'); }}>Mostrar todos</button></div>}
    </section>

    <section className="hanzi-character-hero panel">
      <div className="hanzi-glyph">{character.hanzi}</div>
      <div className="hanzi-character-copy"><p className="eyebrow">ETAPA {character.primaryStage} · {stages.find((stage) => stage.id === character.primaryStage)?.title}</p><div className="hanzi-pronunciation-row"><h2>{character.pinyin} <small>{character.meaning}</small></h2><SpeakButton key={character.id} text={character.hanzi} speechText={character.hanzi} audioSrc={audioForMandarinText(character.hanzi)} compact ariaLabel={`Escuchar pronunciación de ${character.hanzi}`} title={`Escuchar ${character.hanzi}`} /></div>
        <div className="hanzi-badges"><span>{technical?.strokeCount ?? character.strokeCount} trazos verificados</span>{character.radicalAudited && <span>Radical {character.radical}</span>}<span>Escritura requerida</span><span className={technical?.available ? 'available' : 'unavailable'}>{technical?.available ? 'Datos locales listos' : 'Datos no disponibles'}</span></div>
        <p className="source-note">Fuentes: {character.sourceGroups?.map((group) => group.replace('hanzi-', '')).join(' · ')}{character.sourceGroups?.includes('hanzi-1.5') ? ' · 1.5 es evidencia de repaso' : ''}.</p>
        <CommunityButton label={`Preguntar sobre ${character.hanzi}`} context={{ concept: character.hanzi, skill: tab === 'Trazos' ? 'stroke-order' : tab === 'Practicar' ? 'hanzi-writing' : 'hanzi-recognition', route: `/lesson/1/hanzi?character=${encodeURIComponent(character.hanzi)}&tab=${encodeURIComponent(tab)}` }} />
      </div>
      <MasterySummary values={progress[character.id]?.dimensions} />
    </section>

    <nav className="hanzi-tabs" aria-label="Secciones del laboratorio">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</nav>

    {loadError ? <section className="panel hanzi-fallback" role="status"><h2>{loadError}</h2><p>Puedes continuar con reconocimiento y contexto. La práctica geométrica queda desactivada para no simular información.</p><button type="button" onClick={() => setTab('Componentes')}>Ver contexto</button></section> : !data ? <section className="panel hanzi-loading" aria-live="polite">Preparando los trazos de {character.hanzi}…</section> : <>
      {tab === 'Aprender' && <LearnPanel key={character.id} character={character} onMastered={() => markDimension('recognition')} />}
      {tab === 'Componentes' && <ComponentsPanel key={character.id} character={character} />}
      {tab === 'Trazos' && <StrokesPanel key={character.id} character={character} data={data} onMastered={() => markDimension('stroke_order')} />}
      {tab === 'Practicar' && <PracticePanel key={character.id} character={character} data={data} onAttempt={persistAttempt} />}
    </>}
    {saveMessage && <p className="hanzi-save-message" role="status">{saveMessage} {saveMessage.includes('nombre') && <Link href={`/login?returnTo=${encodeURIComponent('/lesson/1/hanzi')}`}>Elegir nombre →</Link>}</p>}
  </div>;
}

function MasterySummary({ values }: { values?: HanziProgressMap[string]['dimensions'] }) {
  const rows: Array<[HanziSkillDimension, string]> = [['recognition', 'Reconocimiento'], ['stroke_order', 'Orden'], ['writing', 'Escritura']];
  return <div className="hanzi-mastery" aria-label="Dominio del carácter">{rows.map(([key, label]) => <div key={key}><span>{label}</span><b>{typeof values?.[key]?.mastery === 'number' ? `${Math.round(values[key]!.mastery)}%` : '—'}</b></div>)}</div>;
}

function ContextList({ character }: { character: CharacterEntry }) {
  if (!character.words?.length) return <p className="context-empty">Esta ficha se practica como forma básica antes de combinarla.</p>;
  return <div className="hanzi-context"><h3>Aparece en</h3><div>{character.words.map((word) => {
    const content = <><strong>{word.hanzi}</strong><span>{word.pinyin}</span><small>{word.translation}</small>{word.stage > (character.primaryStage ?? word.stage) && <em>Este carácter ya lo conoces</em>}</>;
    return word.href ? <Link href={word.href} key={`${word.hanzi}-${word.pinyin}`}>{content}</Link> : <article key={`${word.hanzi}-${word.pinyin}`}>{content}</article>;
  })}</div></div>;
}

function LearnPanel({ character, onMastered }: { character: CharacterEntry; onMastered: () => void }) {
  const stage = useRef<HanziWriterStageHandle>(null);
  const [finished, setFinished] = useState(false);
  function animateOnce() { setFinished(false); stage.current?.animate(() => setFinished(true)); }
  return <section className="panel hanzi-tab-panel hanzi-learn-panel"><div className="hanzi-panel-copy"><p className="eyebrow">01 · APRENDER</p><h2>Observa el carácter completo</h2><p>Usa la cuadrícula 米字格 para comparar proporción y centro. La animación respeta el orden y la dirección de los datos técnicos.</p>{finished && <div className="hanzi-controls"><button type="button" onClick={animateOnce}>↻ Ver de nuevo</button></div>}<button className="button button-primary" type="button" onClick={onMastered}>Lo reconozco</button><ContextList character={character} /></div><HanziWriterStage ref={stage} character={character.hanzi} onReady={animateOnce} /></section>;
}

function ComponentsPanel({ character }: { character: CharacterEntry }) {
  return <section className="panel hanzi-tab-panel components-panel"><div><p className="eyebrow">02 · COMPONENTES Y CONTEXTO</p><h2>Composición respaldada</h2><p>La geometría de Hanzi Writer guía los trazos. Radicales y componentes solo aparecen cuando ya fueron auditados en las fuentes complementarias.</p></div>
    {character.componentsAudited ? <><div className="component-map" aria-label={`Componentes de ${character.hanzi}`}><div className="component-whole"><strong>{character.hanzi}</strong><span>carácter</span></div><b aria-hidden="true">→</b><div className="component-pieces">{character.components.map((component, index) => <article key={`${component}-${index}`}><strong>{component}</strong><span>{component === character.radical ? 'radical registrado' : 'componente registrado'}</span></article>)}</div></div><aside className="component-source"><b>Análisis pedagógico auditado</b><p>Radical: {character.radical}. Componentes: {character.components.join(' + ')}.</p></aside></> : <aside className="component-source"><b>Sin descomposición pedagógica publicada</b><p>No se muestran radicales ni componentes automáticos para evitar presentar una interpretación no auditada. Esto no afecta los trazos técnicos.</p></aside>}
    <ContextList character={character} />
  </section>;
}

function StrokesPanel({ character, data, onMastered }: { character: CharacterEntry; data: HanziCharacterData; onMastered: () => void }) {
  const directions = useMemo(() => data.medians.map(strokeDirection), [data]);
  const strokeNames = useMemo(() => strokeNamesForCharacter(character.hanzi, data.strokes.length), [character.hanzi, data.strokes.length]);
  return <section className="panel hanzi-tab-panel strokes-panel"><div className="hanzi-panel-heading"><div><p className="eyebrow">03 · TRAZOS</p><h2>Orden, inicio y dirección</h2></div></div>
    <div className="stroke-answer-layout"><HanziStrokeSvg character={character.hanzi} data={data} /><div><h3>Cómo leer los trazos</h3><p><i className="legend-dot" /> El punto marca dónde inicia cada trazo.</p><p><i className="legend-arrow">→</i> La línea roja indica el recorrido y su flecha, la dirección.</p><ol className="stroke-name-list">{directions.map((direction, index) => { const name = strokeNames[index]; return <li key={index}><b>{name ? `${index + 1} · ${name.hanzi} · ${name.pinyin}` : `Trazo ${index + 1}`}</b><span>Dirección: hacia {direction.label}.</span></li>; })}</ol></div></div>
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
  function chooseMode(value: HanziPracticeMode) { stage.current?.cancelQuiz(); setMode(value); setReady(false); setStarted(false); setMistakes(0); setCorrect(0); setHints(0); setUsedAnswer(false); setAnswerVisible(false); setFeedback('Elige un modo y comienza cuando estés listo.'); }
  function start() { setStarted(true); setMistakes(0); setCorrect(0); setHints(0); setUsedAnswer(false); setFeedback('Empieza en el punto correcto y sigue la dirección del trazo.'); stage.current?.startQuiz(mode); }
  function reveal(show: boolean) { if (!started) return; setAnswerVisible(show); if (show) { setHints((value) => value + 1); setUsedAnswer(true); stage.current?.show(); } else stage.current?.hide(); }
  function complete(summary: QuizSummary) { setStarted(false); setFeedback(summary.mistakes === 0 ? '完成 · Orden y dirección correctos.' : `Completado con ${summary.mistakes} ${summary.mistakes === 1 ? 'ajuste' : 'ajustes'}. Volverá en el repaso.`); void onAttempt({ characterId: character.id, mode, skillDimension: 'writing', completed: true, correctStrokes: summary.correctStrokes, mistakes: summary.mistakes, hintsUsed: hints, durationMs: summary.durationMs, usedAnswer }); }
  return <section className="panel hanzi-tab-panel practice-panel"><div className="hanzi-panel-heading"><div><p className="eyebrow">04 · PRACTICAR</p><h2>Escribe {character.hanzi}</h2></div><div className="practice-modes" role="group" aria-label="Nivel de ayuda">{([['guided', 'Con guía'], ['independent', 'Sin guía']] as const).map(([value, label]) => <button type="button" className={mode === value ? 'selected' : ''} onClick={() => chooseMode(value)} key={value}>{label}</button>)}</div></div><div className="practice-stage-layout"><div><HanziWriterStage ref={stage} character={character.hanzi} showCharacter={false} showOutline={mode === 'guided'} interactive onReady={() => setReady(true)} onMistake={(total, mistakesOnStroke) => { setMistakes(total); if ((mode === 'guided' && mistakesOnStroke === 2) || (mode === 'independent' && mistakesOnStroke === 4)) setHints((value) => value + 1); setFeedback('Todavía no. Revisa el punto de inicio y la dirección.'); }} onCorrectStroke={(count) => { setCorrect(count); setFeedback(`Trazo ${count} de ${data.strokes.length} correcto.`); }} onQuizComplete={complete} /><p className="privacy-note">Se guarda solo el resumen del intento; nunca tus coordenadas de escritura.</p></div><aside><h3>{mode === 'guided' ? 'Guía visible y pistas progresivas' : 'Cuadrícula sin contorno'}</h3><div className="practice-counters"><span><b>{correct}</b>/{data.strokes.length} trazos</span><span><b>{mistakes}</b> errores</span><span><b>{hints}</b> consultas</span></div><p className="practice-feedback" aria-live="polite">{feedback}</p><div className="hanzi-controls"><button className="button button-primary" type="button" disabled={!ready || started} onClick={start}>{started ? 'Práctica activa' : 'Comenzar'}</button><button type="button" disabled={!started} aria-pressed={answerVisible} onPointerDown={(event) => { event.preventDefault(); reveal(true); }} onPointerUp={() => reveal(false)} onPointerCancel={() => reveal(false)} onPointerLeave={() => answerVisible && reveal(false)} onKeyDown={(event) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); reveal(!answerVisible); } }}>Mantén para ver respuesta</button><button type="button" disabled={!started} onClick={() => { stage.current?.cancelQuiz(); setStarted(false); setFeedback('Intento cancelado; no se guardó.'); }}>Cancelar</button></div></aside></div></section>;
}
