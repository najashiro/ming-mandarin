import { Fragment } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { PinyinText } from '@/components/PinyinText';
import './documentary-activities.css';

type Choice = { label: string; text: string; pinyin?: string };
type Passage = { id: string; title: string; text: string; pinyin: string; spanish: string; kind: string };
type ActivityTable = { id: string; title: string; columns: string[]; rows: string[][]; dateFields: string[]; kind: string; fillable?: boolean };
type ActivityItem = {
  label: string; text: string; pinyin: string; underlined: string;
  choices: Choice[]; substitutions: string[][]; offered: string[];
  role: string; part: string; dialogue: string; scene: string; gloss: string; modelResponse: string; language: string;
};
type ActivityVisual = { id: string; title: string; description: string; texts: string[]; panels: { label: string; rows: string[] }[]; descriptions: { label: string; text: string }[] };
export type DocumentaryActivity = {
  id: string; title: string; texts: string[]; requiresOriginalAudio: boolean; context?: string; sourceTitle?: string;
  structured?: {
    instruction: string; items: ActivityItem[]; choices: Choice[]; wordBank: string[];
    tables: ActivityTable[]; passages: Passage[]; visuals: ActivityVisual[]; models: Passage[];
    clocks: { label: string; hour: number; minute: number }[]; relatedActivityIds: string[]; providedInsertions: string[][];
  };
};

function MarkedText({ text, underlined = '' }: { text: string; underlined?: string }) {
  const targets = underlined.split(/[／/]/).filter(Boolean).sort((a, b) => b.length-a.length);
  const pattern = targets.map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  if (!pattern) return <Hanzi>{text}</Hanzi>;
  return <Hanzi>{text.split(new RegExp(`(${pattern})`, 'g')).map((part, index) => targets.includes(part)
    ? <u key={index}><Hanzi>{part}</Hanzi></u> : <Fragment key={index}>{part}</Fragment>)}</Hanzi>;
}

function Choices({ choices }: { choices: Choice[] }) {
  return <ul className="documentary-choices">{choices.map((choice, index) => <li key={`${choice.label}-${index}`}>
    <span className="documentary-choice-label">{choice.label}.</span>
    <div><Hanzi>{choice.text}</Hanzi>{choice.pinyin ? <p className="documentary-pinyin"><PinyinText>{choice.pinyin}</PinyinText></p> : null}</div>
  </li>)}</ul>;
}

function PassageBlock({ passage }: { passage: Passage }) {
  return <section className="documentary-passage" aria-labelledby={`${passage.id}-title`}>
    <h4 id={`${passage.id}-title`}>{passage.title}</h4>
    <p className="documentary-chinese"><Hanzi>{passage.text}</Hanzi></p>
    {passage.pinyin ? <p className="documentary-pinyin"><PinyinText>{passage.pinyin}</PinyinText></p> : null}
    {passage.spanish ? <details className="documentary-translation"><summary>Traducción</summary><p>{passage.spanish}</p></details> : null}
  </section>;
}

function SourceTable({ table }: { table: ActivityTable }) {
  return <section className={`documentary-table-block ${table.kind === 'character-grid' ? 'documentary-character-grid' : ''}`}>
    {table.dateFields.length ? <p>{table.dateFields.map((field, index) => <span key={index}><Hanzi>{field}</Hanzi> ____ </span>)}</p> : null}
    {table.columns.length > 3 && <p className="documentary-table-hint">Desliza la tabla para ver todas las columnas.</p>}
    <div className="documentary-table-scroll" role="region" aria-label={table.title} tabIndex={0}>
      <table><caption>{table.title}</caption>
        {table.kind !== 'character-grid' ? <thead><tr>{table.columns.map((column, index) => <th scope="col" key={index}><Hanzi>{column}</Hanzi></th>)}</tr></thead> : null}
        <tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>
          {cell ? <Hanzi>{cell}</Hanzi> : table.fillable ? <span aria-label="Por completar">____</span> : <span aria-label="Sin actividad indicada">&nbsp;</span>}
        </td>)}</tr>)}</tbody>
      </table>
    </div>
  </section>;
}

function ClockFigure({ label, hour, minute }: { label: string; hour: number; minute: number }) {
  const minuteAngle = minute * 6 * Math.PI / 180;
  const hourAngle = (hour * 30 + minute / 2) * Math.PI / 180;
  return <figure className="documentary-clock"><svg viewBox="0 0 100 100" role="img" aria-label={`Reloj ${label}: ${hour}:${String(minute).padStart(2, '0')}`}>
    <circle cx="50" cy="50" r="46" fill="white" stroke="currentColor" strokeWidth="2"/>
    {Array.from({ length: 12 }, (_, index) => { const angle=(index+1)*Math.PI/6; return <text key={index} x={50+36*Math.sin(angle)} y={53-36*Math.cos(angle)} fontSize="9" textAnchor="middle" fill="currentColor">{index+1}</text>; })}
    <line x1="50" y1="50" x2={50+24*Math.sin(hourAngle)} y2={50-24*Math.cos(hourAngle)} stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <line x1="50" y1="50" x2={50+32*Math.sin(minuteAngle)} y2={50-32*Math.cos(minuteAngle)} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="3" fill="currentColor"/>
  </svg><figcaption>{label}</figcaption></figure>;
}

function VisualBlock({ visual }: { visual: ActivityVisual }) {
  return <section className="documentary-visual" aria-label={visual.title}>
    <h4><Hanzi>{visual.title}</Hanzi></h4>
    {visual.panels.length ? <><p className="documentary-symbol-legend">♂ <Hanzi>男</Hanzi> · ♀ <Hanzi>女</Hanzi></p><div className="documentary-symbol-panels">{visual.panels.map(panel => <figure key={panel.label}>
      <div className="documentary-symbol-grid" role="img" aria-label={`${panel.label}: ${panel.rows.join('').split('').filter(symbol => symbol === 'M').length} símbolos masculinos y ${panel.rows.join('').split('').filter(symbol => symbol === 'F').length} símbolos femeninos`}>
        {panel.rows.join('').split('').map((symbol, index) => <span aria-hidden="true" key={index}>{symbol === 'M' ? '♂' : '♀'}</span>)}
      </div><figcaption><Hanzi>{panel.label}</Hanzi></figcaption>
    </figure>)}</div></> : null}
    {visual.texts.length ? <div className="documentary-clipping">{visual.texts.map((text, index) => <p key={index}><Hanzi>{text}</Hanzi></p>)}</div> : null}
    {visual.descriptions.length ? <dl className="documentary-visual-descriptions">{visual.descriptions.map((description, index) => <div key={index}><dt>{description.label}</dt><dd><Hanzi>{description.text}</Hanzi></dd></div>)}</dl> : null}
    {!visual.panels.length && !visual.texts.length && !visual.descriptions.length ? <p>{visual.description}</p> : null}
  </section>;
}

function StructuredActivity({ activity }: { activity: DocumentaryActivity }) {
  const content = activity.structured!;
  return <div className="documentary-body">
    {content.instruction ? <p className="documentary-instruction"><Hanzi>{content.instruction}</Hanzi></p> : null}
    {content.passages.map(passage => <PassageBlock key={passage.id} passage={passage}/>)}
    {content.tables.map(table => <SourceTable key={table.id} table={table}/>)}
    {content.visuals.map(visual => <VisualBlock key={visual.id} visual={visual}/>)}
    {content.clocks.length ? <div className="documentary-clocks">{content.clocks.map(clock => <ClockFigure key={clock.label} {...clock}/>)}</div> : null}
    {content.models.map(model => <PassageBlock key={model.id} passage={model}/>)}
    {content.wordBank.length ? <div className="documentary-word-bank"><h4>Palabras para usar</h4><p>{content.wordBank.map((word, index) => <span key={index}><Hanzi>{word}</Hanzi></span>)}</p></div> : null}
    {content.items.length ? <ol className="documentary-items">{content.items.map((item, index) => <li key={index} className={item.role === 'printed_model' ? 'documentary-model-item' : ''}>
      <div className="documentary-item-label">{item.role === 'printed_model' ? 'Ejemplo' : `${item.label}.`}{item.dialogue ? ` · Diálogo ${item.dialogue}` : item.part ? ` · Parte ${item.part}` : ''}</div>
      {item.scene ? <p className="documentary-scene"><b>Escena: </b>{item.scene}</p> : null}
      <p className={item.language === 'pinyin' ? 'documentary-pinyin' : 'documentary-chinese'}>{item.language === 'pinyin' ? <PinyinText>{item.text}</PinyinText> : <MarkedText text={item.text} underlined={item.underlined}/>}</p>
      {item.pinyin ? <p className="documentary-pinyin"><PinyinText>{item.pinyin}</PinyinText></p> : null}
      {item.gloss ? <p>{item.gloss}</p> : null}
      {item.choices.length ? <Choices choices={item.choices}/> : null}
      {item.offered.length ? <p className="documentary-offered"><b>Palabras: </b><Hanzi>{item.offered.join(' · ')}</Hanzi></p> : null}
      {item.substitutions.length ? <div className="documentary-substitutions"><b>Sustituye por:</b><ul>{item.substitutions.map((row, number) => <li key={number}><Hanzi>{row.join(' · ')}</Hanzi></li>)}</ul></div> : null}
      {item.modelResponse ? <p><b>Ejemplo: </b><Hanzi>{item.modelResponse}</Hanzi></p> : null}
    </li>)}</ol> : null}
    {content.choices.length ? <section className="documentary-matching"><h4>Opciones</h4><Choices choices={content.choices}/></section> : null}
    {content.providedInsertions.length ? <details className="documentary-translation"><summary>Soluciones impresas en la presentación</summary><ol>{content.providedInsertions.map((words, index) => <li key={index}><Hanzi>{words.join(' · ')}</Hanzi></li>)}</ol></details> : null}
    {content.relatedActivityIds.map(id => <p key={id}><a href={`#${id}`}>Volver a la entrevista y su horario</a></p>)}
  </div>;
}

export function DocumentaryActivities({ activities }: { activities: readonly DocumentaryActivity[] }) {
  return <div className="documentary-activities">{activities.map((activity, index) => <Fragment key={activity.id}>
    {activity.sourceTitle && activity.sourceTitle !== activities[index - 1]?.sourceTitle ? <h3>{activity.sourceTitle}</h3> : null}
    <details className="panel documentary-activity" id={activity.id}>
    <summary>{activity.context ? <span className="documentary-context"><Hanzi>{activity.context}</Hanzi></span> : null}<Hanzi>{activity.title}</Hanzi></summary>
    {activity.requiresOriginalAudio ? <p className="documentary-audio-status" role="status">Esta actividad necesita la grabación original del libro, aún no disponible.</p> : null}
    {activity.structured ? <StructuredActivity activity={activity}/> : activity.texts.map((text, index) => <p className="documentary-chinese" key={index}><Hanzi>{text}</Hanzi></p>)}
  </details></Fragment>)}</div>;
}
