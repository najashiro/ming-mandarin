'use client';
import { Hanzi } from '@/components/Hanzi';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterEntry, CurriculumScope, HanziStageId, HanziUnitDefinition } from '@/data/types';
import { strokeDirection } from '@/lib/hanzi/geometry';
import { loadHanziData } from '@/lib/hanzi/loader';
import { updateLocalHanziProgress } from '@/lib/hanzi/mastery';
import type { LocalHanziProgressMap } from '@/lib/hanzi/progress';
import type { HanziAttemptPayload, HanziCharacterData, HanziManifestEntry, HanziPracticeMode, HanziProgressMap } from '@/lib/hanzi/types';
import { hanziGlyphHref } from '@/lib/hanzi/navigation';
import { hanziTabs, resolveHanziTab, type HanziTab } from '@/lib/hanzi/tabs';
import { strokeNamesForCharacter } from '@/lib/hanzi/stroke-names';
import { HanziStrokeSvg } from './HanziStrokeSvg';
import { HanziWriterStage, type HanziWriterStageHandle, type QuizSummary } from './HanziWriterStage';
import { HanziFocusScroller } from './HanziFocusScroller';
import { CommunityButton } from '@/components/community/CommunityProvider';
import { SpeakButton } from '@/components/SpeakButton';
import { PinyinText } from '@/components/PinyinText';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { trackAnalyticsEvent } from '@/lib/analytics/client';

export type HanziLabCharacter = Pick<CharacterEntry,'id'|'hanzi'|'pinyin'|'meaning'|'strokeCount'|'radical'|'components'|'writingRequired'|'componentsAudited'> & {
  introducedIn:HanziStageId|null; appearsIn:HanziStageId[]; referenceLessons?:number[];
  words?:Array<{hanzi:string;pinyin:string;translation:string}>;
};

function searchPinyin(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/u:|v/g, 'ü').replace(/[1-5]/g, '').replace(/[^a-zü]/g, '');
}

function lessonForCharacter(character: HanziLabCharacter, lesson: string) {
  const lessons = character.referenceLessons;
  if (!character.writingRequired && lessons?.length && !lessons.includes(Number(lesson.slice(1)))) {
    return `l${lessons[0]}`;
  }
  return lesson;
}

type Props = {
  characters: HanziLabCharacter[];
  availableHanzi?: string[];
  stages: HanziUnitDefinition[];
  manifest: Record<string, HanziManifestEntry>;
  initialProgress?: HanziProgressMap;
  defaultCharacter?: string;
  focusGlyph?: boolean;
  route?: string;
  scope?: CurriculumScope;
};

export function HanziLab({ characters, availableHanzi = characters.map((item) => item.hanzi), stages, manifest, initialProgress = {}, defaultCharacter = '好', focusGlyph = false, route = '/lesson/1/hanzi', scope='l1' }: Props) {
  const lessonScopes = useMemo(() => [...new Set(stages.map((stage) => stage.lesson))]
    .sort((a, b) => a - b)
    .map((lesson) => ({ value: `l${lesson}`, label: `Lección ${lesson}` })), [stages]);
  const params = useSearchParams();
  const glyph = params.get('character');
  const character = characters.find(item => item.hanzi === (glyph ?? defaultCharacter))
    ?? characters.find(item => item.hanzi === defaultCharacter) ?? characters[0];
  const tab = resolveHanziTab(params.get('tab'), params.get('mode'));
  const routeLesson = scope.split('-').at(-1)!;
  const characterScope = lessonScopes.find(lesson => lesson.value === params.get('lesson'))?.value
    ?? lessonForCharacter(character, routeLesson);
  const [query, setQuery] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);
  const [focusRequest, setFocusRequest] = useState({ glyph: focusGlyph ? character.hanzi : null, key: 0 });
  const [loaded, setLoaded] = useState<{ character: string; data?: HanziCharacterData; error?: string } | null>(null);
  const [, setProgress] = useState<HanziProgressMap>(initialProgress);
  const [, setLocalProgress] = useState<LocalHanziProgressMap>({});
  const [saveMessage, setSaveMessage] = useState('');
  const characterIdsByHanzi = useMemo(() => new Map(characters.map((item) => [item.hanzi,item.id])),[characters]);
  const availableHanziSet = useMemo(() => new Set(availableHanzi),[availableHanzi]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHydrated(true);
      try { setLocalProgress(JSON.parse(localStorage.getItem('ming-hanzi-progress-v1') || '{}') as LocalHanziProgressMap); }
      catch { setLocalProgress({}); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const displayedCharacters = useMemo(() => {
    const lessons = new Set(characterScope.split('-').map((lesson) => lesson.slice(1)));
    return characters.filter((item) => item.appearsIn.some((unit) => lessons.has(unit.split('.')[0])));
  }, [characters, characterScope]);
  const referenceCharacters = useMemo(() => {
    const lessons = new Set(characterScope.split('-').map(lesson => Number(lesson.slice(1))));
    const writingIds = new Set(displayedCharacters.map(item => item.id));
    return characters.filter(item => !writingIds.has(item.id) && item.referenceLessons?.some(lesson => lessons.has(lesson)));
  }, [characters, characterScope, displayedCharacters]);
  const suggestions = useMemo(() => {
    const needle = searchPinyin(query);
    if (!query.trim()) return [];
    return characters.filter((item) => item.hanzi === query.trim() || (needle && searchPinyin(item.pinyin).startsWith(needle))).sort((a,b) => {
      const exactA = searchPinyin(a.pinyin) === needle ? 0 : 1; const exactB = searchPinyin(b.pinyin) === needle ? 0 : 1;
      return exactA - exactB || characters.indexOf(a) - characters.indexOf(b);
    }).slice(0,10);
  }, [characters,query]);
  const tracking = character.writingRequired ? 'course' : 'supplementary';
  const technical = manifest[character.hanzi];
  const activeUnit = character.introducedIn;
  const selectedStage = stages.find((stage) => stage.id === activeUnit);
  const selectedStageName = selectedStage?.shortTitle.trim();
  const stageLabel = tracking==='supplementary'?'Carácter de consulta':`${activeUnit}${selectedStageName && selectedStageName !== activeUnit ? ` · ${selectedStageName}` : ''}`;
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

  useEffect(() => {
    function clearTransientControls() {
      setSearchOpen(false);
      setActiveOption(-1);
      setQuery('');
      setSaveMessage('');
      setFocusRequest(current => ({ ...current, glyph: null }));
    }
    window.addEventListener('popstate', clearTransientControls);
    return () => window.removeEventListener('popstate', clearTransientControls);
  }, []);

  // Each character is one history entry; its tab and lesson update that same entry.
  function selectTab(nextTab: HanziTab) {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', nextTab);
    url.searchParams.delete('mode');
    url.searchParams.delete('focus');
    window.history.replaceState(null, '', url);
  }

  function selectLesson(lesson: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('lesson', lesson);
    window.history.replaceState(null, '', url);
  }

  function selectCharacter(id: string) {
    const selected = characters.find(item => item.id === id);
    if (!selected) return;
    const url = new URL(window.location.href);
    const currentGlyph = url.searchParams.get('character') ?? character.hanzi;
    url.searchParams.set('character', selected.hanzi);
    url.searchParams.set('focus', 'glyph');
    url.searchParams.set('lesson', lessonForCharacter(selected, characterScope));
    url.searchParams.delete('tab');
    url.searchParams.delete('mode');
    url.searchParams.delete('content');
    if (selected.hanzi === currentGlyph) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }

    setSaveMessage('');
    setSearchOpen(false);
    (document.activeElement as HTMLElement | null)?.blur();
    setFocusRequest(current => ({ glyph: selected.hanzi, key: current.key + 1 }));
  }

  async function persistAttempt(payload: HanziAttemptPayload) {
    if(tracking==='supplementary'){setSaveMessage('Práctica local de esta visita; no se guarda como progreso del curso.');return;}
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

  function markStrokeOrderUnderstood() {
    void persistAttempt({
      characterId: character.id, mode: 'guided', skillDimension: 'stroke_order', completed: true,
      correctStrokes: technical?.strokeCount ?? character.strokeCount,
      mistakes: 0, hintsUsed: 0, durationMs: 1, usedAnswer: false,
    });
  }

  return <div className="hanzi-workspace">
    <HanziFocusScroller active={focusRequest.glyph === character.hanzi && tab === 'Aprender'} requestKey={focusRequest.key} expectedCharacter={character.hanzi} />
    {tracking==='supplementary'&&<section className="panel hanzi-supplemental-note"><p className="eyebrow">CARÁCTER DE CONSULTA</p><p>Puedes estudiar y practicar este carácter. No se añade a los objetivos de escritura ni al progreso del curso.</p></section>}



    <section className="panel hanzi-search-panel" aria-label="Búsqueda por pinyin">
      <div className="hanzi-combobox"><label htmlFor="hanzi-pinyin-search">Busca por pinyin</label><div><input id="hanzi-pinyin-search" disabled={!hydrated} role="combobox" aria-autocomplete="list" aria-expanded={searchOpen} aria-controls="hanzi-pinyin-options" aria-activedescendant={activeOption >= 0 ? `hanzi-option-${activeOption}` : undefined} value={query} autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="Ej.: bian, biān, bian1 o 边" onFocus={() => query && setSearchOpen(true)} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); setActiveOption(-1); }} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); setActiveOption((value) => Math.min(value + 1, suggestions.length - 1)); } else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveOption((value) => Math.max(value - 1, 0)); } else if (event.key === 'Escape') setSearchOpen(false); else if (event.key === 'Enter' && activeOption >= 0) { event.preventDefault(); const option=suggestions[activeOption]; if(option){selectCharacter(option.id);setQuery(option.pinyin);} } }}/>{query&&<button type="button" aria-label="Limpiar consulta" onClick={() => {setQuery('');setSearchOpen(false);}}>×</button>}</div>{searchOpen&&query&&<div id="hanzi-pinyin-options" role="listbox">{suggestions.length?suggestions.map((item,index)=><button id={`hanzi-option-${index}`} role="option" aria-selected={activeOption===index} type="button" key={item.id} onPointerDown={(event)=>event.preventDefault()} onClick={()=>{selectCharacter(item.id);setQuery(item.pinyin);}}><PinyinText>{item.pinyin}</PinyinText><Hanzi>{item.hanzi}</Hanzi><span>{item.meaning}</span></button>):<p role="status">Sin resultados por pinyin.</p>}</div>}</div>
    </section>

    <section className="hanzi-character-hero panel" id="hanzi-detail-start" data-character={character.hanzi}>
      <div className="hanzi-glyph"><Hanzi>{character.hanzi}</Hanzi></div>
      <div className="hanzi-character-copy"><p className="eyebrow">{stageLabel}</p><div className="hanzi-pronunciation-row"><h2><PinyinText>{character.pinyin}</PinyinText></h2><div className="hanzi-character-actions"><SpeakButton key={character.id} text={character.hanzi} reading={character.pinyin} audioSrc={audioForMandarinText(character.hanzi, character.pinyin)} compact ariaLabel={`Escuchar pronunciación de ${character.hanzi}`} title={`Escuchar ${character.hanzi}`} /><CommunityButton compact label={`Preguntar sobre ${character.hanzi}`} context={{ concept: character.hanzi, skill: tab === 'Trazos' ? 'stroke-order' : tab === 'Practicar' ? 'hanzi-writing' : 'hanzi-recognition', route: `${route}?character=${encodeURIComponent(character.hanzi)}&tab=${encodeURIComponent(tab)}` }} /></div></div>
        <p className="hanzi-character-meaning"><Hanzi>{character.meaning}</Hanzi></p>
        <p className="hanzi-character-meta"><span>{technical?.strokeCount ?? character.strokeCount} trazos</span>{character.writingRequired && <> · <span>Escritura</span></>}</p>
      </div>
    </section>

    <nav className="hanzi-tabs" aria-label="Secciones del laboratorio">{hanziTabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'selected' : ''} onClick={() => selectTab(item)} key={item}>{item}</button>)}</nav>

    {tab === 'Palabras y frases' ? <WordsPanel key={character.id} character={character} characterIdsByHanzi={characterIdsByHanzi} availableHanzi={availableHanziSet} route={route} onSelectCharacter={selectCharacter} /> : loadError ? <section className="panel hanzi-fallback" role="status"><h2><Hanzi>{loadError}</Hanzi></h2><p>Puedes continuar con reconocimiento, palabras y frases. Solo la animación y la práctica de trazos quedan desactivadas.</p><button type="button" onClick={() => selectTab('Palabras y frases')}>Ver palabras y frases</button>{tab === 'Aprender'&&<LearnPanel key={character.id} character={character}/>}</section> : !data ? <section className="panel hanzi-loading" aria-live="polite">Preparando los trazos de <Hanzi>{character.hanzi}</Hanzi>…</section> : <>
      {tab === 'Aprender' && <LearnPanel key={character.id} character={character}/>}
      {tab === 'Trazos' && <StrokesPanel key={character.id} character={character} data={data} onMastered={markStrokeOrderUnderstood} />}
      {tab === 'Practicar' && <PracticePanel key={character.id} character={character} data={data} onAttempt={persistAttempt} tracking={tracking} />}
    </>}
    {saveMessage && <p className="hanzi-save-message" role="status"><Hanzi>{saveMessage}</Hanzi> {saveMessage.includes('nombre') && <Link href={`/login?returnTo=${encodeURIComponent(route)}`}>Elegir nombre →</Link>}</p>}
    <section className="panel hanzi-character-picker" aria-label="Selector de caracteres">
      <div className="hanzi-picker-heading"><h2>Caracteres</h2><span>{displayedCharacters.length}</span></div>
    <div className="hanzi-lesson-toolbar">
      <select id="hanzi-lesson-scope" aria-label="Lección" value={characterScope} onChange={(event) => selectLesson(event.target.value)}>{lessonScopes.map(({value,label})=><option value={value} key={value}>{label}</option>)}</select>
    </div>
      <h3>Objetivos de escritura</h3>
      {displayedCharacters.length ? <div className="hanzi-picker-grid hanzi-writing-grid">{displayedCharacters.map((item) => {
        const selected = item.id === character.id;
        return <button type="button" className={`hanzi-picker-card${selected ? ' selected' : ''}`} aria-label={`${item.hanzi}, ${item.pinyin}, ${item.meaning}`} aria-pressed={selected} onClick={() => selectCharacter(item.id)} key={item.id}><Hanzi>{item.hanzi}</Hanzi><small><PinyinText>{item.pinyin}</PinyinText></small><em><Hanzi>{item.meaning}</Hanzi></em></button>;
      })}</div> : <div className="hanzi-filter-empty"><p>No hay caracteres en esta lección.</p></div>}
      {referenceCharacters.length > 0 && <details className="hanzi-reference-picker" open={!character.writingRequired || undefined}>
        <summary>Otros caracteres de la lección · {referenceCharacters.length}</summary>
        <p>Caracteres presentes en el vocabulario y los textos, además de los objetivos de escritura de esta lección.</p>
        <div className="hanzi-picker-grid">{referenceCharacters.map(item => <button type="button" className={`hanzi-reference-card${item.id === character.id ? ' selected' : ''}`} aria-label={`${item.hanzi}, ${item.pinyin}, ${item.meaning}`} aria-pressed={item.id === character.id} onClick={() => selectCharacter(item.id)} key={item.id}><Hanzi>{item.hanzi}</Hanzi><small><PinyinText>{item.pinyin}</PinyinText></small><em><Hanzi>{item.meaning}</Hanzi></em></button>)}</div>
      </details>}
    </section>
  </div>;
}

type ContextListProps = {
  character: HanziLabCharacter;
  characterIdsByHanzi: Map<string,string>;
  availableHanzi: Set<string>;
  route: string;
  onSelectCharacter: (id: string) => void;
};

function ContextList({ character, characterIdsByHanzi, availableHanzi, route, onSelectCharacter }: ContextListProps) {
  if (!character.words?.length) return <p className="context-empty">Aún no hay palabras o frases breves disponibles para este carácter.</p>;
  return <div className="hanzi-context"><div>{character.words.map((word) => <article key={`${word.hanzi}-${word.pinyin}`}>
    <strong className="context-hanzi-text">{[...word.hanzi].map((hanzi,index) => {
      if (!availableHanzi.has(hanzi)) return <span className="context-hanzi-plain" key={`${hanzi}-${index}`}><Hanzi>{hanzi}</Hanzi></span>;
      const localId = characterIdsByHanzi.get(hanzi);
      const href = localId ? `${route}?character=${encodeURIComponent(hanzi)}&focus=glyph` : hanziGlyphHref(hanzi);
      return <Link href={href} scroll={false} aria-label={`Abrir ficha Hanzi de ${hanzi}`} onNavigate={localId ? (event) => { event.preventDefault(); onSelectCharacter(localId); } : undefined} key={`${hanzi}-${index}`}><Hanzi>{hanzi}</Hanzi></Link>;
    })}</strong>
    <PinyinText className="context-pinyin">{word.pinyin}</PinyinText>
    <small><Hanzi>{word.translation}</Hanzi></small>
  </article>)}</div></div>;
}

function LearnPanel({ character }: { character: HanziLabCharacter }) {
  const stage = useRef<HanziWriterStageHandle>(null);
  function animateOnce() { stage.current?.animate(); }
  return <section className="panel hanzi-tab-panel hanzi-learn-panel"><div id="hanzi-glyph-focus" className="hanzi-learn-visual"><HanziWriterStage ref={stage} character={character.hanzi} showOutline={false} onReady={animateOnce} /><button className="hanzi-replay-control" type="button" onClick={animateOnce} aria-label="Ver animación de nuevo" title="Ver de nuevo"><span aria-hidden="true">↻</span></button></div></section>;
}

function WordsPanel({ character, ...contextProps }: ContextListProps) {
  return <section className="panel hanzi-tab-panel components-panel"><div><p className="eyebrow">02 · PALABRAS Y FRASES</p><h2>Usos documentados</h2><p>Una palabra compuesta conserva su significado completo; no se atribuye su traducción al carácter aislado.</p></div>
    <ContextList character={character} {...contextProps} />
  </section>;
}

function StrokesPanel({ character, data, onMastered }: { character: HanziLabCharacter; data: HanziCharacterData; onMastered: () => void }) {
  const directions = useMemo(() => data.medians.map(strokeDirection), [data]);
  const strokeNames = useMemo(() => strokeNamesForCharacter(character.hanzi, data.strokes.length), [character.hanzi, data.strokes.length]);
  return <section className="panel hanzi-tab-panel strokes-panel"><div className="hanzi-panel-heading"><div><p className="eyebrow">03 · TRAZOS</p><h2>Orden, inicio y dirección</h2></div></div>
    <div className="stroke-answer-layout"><HanziStrokeSvg character={character.hanzi} data={data} /><div><h3>Cómo leer los trazos</h3><p><i className="legend-dot" /> El punto marca dónde inicia cada trazo.</p><p><i className="legend-arrow">→</i> La línea roja indica el recorrido y su flecha, la dirección.</p><ol className="stroke-name-list">{directions.map((direction, index) => { const name = strokeNames[index]; return <li key={index}><b><Hanzi>{name ? <>{index + 1} · {name.hanzi} · <PinyinText>{name.pinyin}</PinyinText></> : `Trazo ${index + 1}`}</Hanzi></b><span>Dirección: <Hanzi>{direction.chinese}</Hanzi> · hacia {direction.label}.</span></li>; })}</ol></div></div>
    <div className="hanzi-confirm-row"><button className="button button-primary" type="button" onClick={onMastered}>Ya entiendo el orden</button></div>
  </section>;
}

function PracticePanel({ character, data, onAttempt, tracking }: { character: HanziLabCharacter; data: HanziCharacterData; onAttempt: (payload: HanziAttemptPayload) => Promise<void>;tracking:'course'|'supplementary' }) {
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
  function chooseMode(value: HanziPracticeMode) { if (value === mode) return; stage.current?.cancelQuiz(); setMode(value); setReady(false); setStarted(false); setMistakes(0); setCorrect(0); setHints(0); setUsedAnswer(false); setAnswerVisible(false); setFeedback('Elige un modo y comienza cuando estés listo.'); }
  function start() { setStarted(true); setMistakes(0); setCorrect(0); setHints(0); setUsedAnswer(false); setFeedback('Empieza en el punto correcto y sigue la dirección del trazo.'); stage.current?.startQuiz(mode); }
  function reveal(show: boolean) { if (!started) return; setAnswerVisible(show); if (show) { setHints((value) => value + 1); setUsedAnswer(true); stage.current?.show(); } else stage.current?.hide(); }
  function complete(summary: QuizSummary) { setStarted(false); setFeedback(summary.mistakes === 0 ? '完成 · Orden y dirección correctos.' : `Completado con ${summary.mistakes} ${summary.mistakes === 1 ? 'ajuste' : 'ajustes'}.${tracking==='course'?' Volverá en el repaso.':''}`); if(tracking==='course')trackAnalyticsEvent('hanzi_practiced', { contentId: character.hanzi, correct: summary.mistakes === 0 }); void onAttempt({ characterId: character.id, mode, skillDimension: 'writing', completed: true, correctStrokes: summary.correctStrokes, mistakes: summary.mistakes, hintsUsed: hints, durationMs: summary.durationMs, usedAnswer }); }
  return <section className="panel hanzi-tab-panel practice-panel">
    <div className="hanzi-panel-heading"><div><p className="eyebrow">04 · PRACTICAR</p><h2>Escribe <Hanzi>{character.hanzi}</Hanzi></h2></div></div>
    <div className="practice-stage-layout"><div>
      <div className="practice-start-row" role="group" aria-label="Modo e inicio de práctica">
        {([['guided', 'Con guía'], ['independent', 'Sin guía']] as const).map(([value, label]) => <button type="button" className={`practice-mode-button${mode === value ? ' selected' : ''}`} aria-pressed={mode === value} onClick={() => chooseMode(value)} key={value}>{label}</button>)}
        <button className="button button-primary practice-start-button" type="button" disabled={!ready || started} onClick={start}>{started ? 'Práctica activa' : 'Comenzar'}</button>
      </div>
      <HanziWriterStage ref={stage} character={character.hanzi} showCharacter={false} showOutline={mode === 'guided'} interactive onReady={() => setReady(true)} onMistake={(total, mistakesOnStroke) => { setMistakes(total); if ((mode === 'guided' && mistakesOnStroke === 2) || (mode === 'independent' && mistakesOnStroke === 4)) setHints((value) => value + 1); setFeedback('Todavía no. Revisa el punto de inicio y la dirección.'); }} onCorrectStroke={(count) => { setCorrect(count); setFeedback(`Trazo ${count} de ${data.strokes.length} correcto.`); }} onQuizComplete={complete} />
      <div className="hanzi-controls"><button type="button" disabled={!started} aria-pressed={answerVisible} onPointerDown={(event) => { event.preventDefault(); reveal(true); }} onPointerUp={() => reveal(false)} onPointerCancel={() => reveal(false)} onPointerLeave={() => answerVisible && reveal(false)} onKeyDown={(event) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); reveal(!answerVisible); } }}>Mantén para ver respuesta</button><button type="button" disabled={!started} onClick={() => { stage.current?.cancelQuiz(); setStarted(false); setFeedback('Intento cancelado; no se guardó.'); }}>Cancelar</button></div>
      <p className="privacy-note">{tracking === 'course' ? 'Se guarda solo el resumen del intento; nunca tus coordenadas de escritura.' : 'Esta práctica es de consulta y no se guarda en el progreso del curso.'}</p>
    </div><aside><div className="practice-counters"><span><b>{correct}</b>/{data.strokes.length} trazos</span><span><b>{mistakes}</b> errores</span><span><b>{hints}</b> consultas</span></div><p className="practice-feedback" aria-live="polite"><Hanzi>{feedback}</Hanzi></p></aside></div>
  </section>;
}
