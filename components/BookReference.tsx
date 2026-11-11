import Link from 'next/link';
import type { ReactNode } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { PinyinText } from '@/components/PinyinText';
import './book-reference.css';

type Reading = { pinyin: string; meaning: string; authority: string; context?: string };
export type BookCharacterDetail = {
  id: string;
  hanzi: string;
  primaryReadings: Reading[];
  secondaryReadings: Reading[];
  components: { parts: string[]; authority: string }[];
  strokeCount: number | null;
  contextWords: { hanzi: string; pinyin: string; spanish?: string; authority: string }[];
};
export type BookReferenceData = {
  topics: {
    id: string;
    title: string;
    introduction?: string;
    titlePinyin?: string;
    paragraphs: string[];
    situations?: { id: string; title: string; context: string; functions: string[]; href: string }[];
    examples?: { id: string; hanzi: string; pinyin: string; spanish: string }[];
    tables: { title: string; columns: string[]; rows: string[][] }[];
    diagrams: { hanzi: string; pinyin: string; spanish: string; label: string; top: number; bottom: number }[];
  }[];
  radicals: {
    id: string;
    radical: string;
    name: string;
    nameHanzi: string;
    meaning: string;
    explanation: string;
    strokeCount: number;
    examples: { hanzi: string; pinyin: string; spanish: string }[];
  }[];
  characterDetails: BookCharacterDetail[];
};

const authorityLabel = (authority: string) => authority === 'textbook' ? 'Libro' : authority === 'workbook' ? 'Cuaderno' : 'Hoja de escritura';

export function BookReference({ reference, showPinyin = true, showSpanish = true, returnTo, renderChinese }: { reference: BookReferenceData; showPinyin?: boolean; showSpanish?: boolean; returnTo?: string; renderChinese?: (text: string, alreadyTranslated?: boolean) => ReactNode }) {
  const chinese = (text: string, alreadyTranslated = false) => renderChinese ? renderChinese(text, alreadyTranslated) : <Hanzi>{text}</Hanzi>;
  return <section className="book-reference" aria-labelledby="book-reference-heading">
    <header><p className="eyebrow">Lección 4</p><h2 id="book-reference-heading">Referencias del libro</h2></header>
    {reference.topics.map(topic => <article className="book-reference-topic" key={topic.id}>
      <h3>{chinese(topic.title, topic.title.includes(' / '))}</h3>
      {showPinyin && topic.titlePinyin && !renderChinese && <p className="book-topic-pinyin"><PinyinText>{topic.titlePinyin}</PinyinText></p>}
      {topic.introduction && <p className="book-reference-note">{chinese(topic.introduction)}</p>}
      {topic.paragraphs.map((paragraph, index) => <p key={index}>{chinese(paragraph)}</p>)}
      {topic.situations && <div className="book-situations">{topic.situations.map(situation => <section key={situation.id}>
        <h4>{chinese(situation.title)}</h4><p>{chinese(situation.context)}</p>
        <ul>{situation.functions.map(label => <li key={label}>{chinese(label, true)}</li>)}</ul>
        <Link href={situation.href} prefetch={false}>Leer {situation.title.toLowerCase()} →</Link>
      </section>)}</div>}
      {topic.examples && <ol className="book-key-phrases">{topic.examples.map(example => <li key={example.id}>
        <p className="book-key-phrase-hanzi"><LinkedChineseText text={example.hanzi} returnTo={returnTo} newTab={Boolean(returnTo)}/></p>
        {showPinyin && example.pinyin && <p><PinyinText>{example.pinyin}</PinyinText></p>}
        {showSpanish && example.spanish && <p>{example.spanish}</p>}
      </li>)}</ol>}
      {topic.diagrams.length > 0 && <div className="book-structure-grid">{topic.diagrams.map(diagram => <figure key={diagram.hanzi}>
        <div className="book-structure-example"><span className="book-reference-glyph"><LinkedChineseText text={diagram.hanzi} returnTo={returnTo} newTab={Boolean(returnTo)}/></span>
          <div className="book-structure-box" aria-hidden="true" style={{ gridTemplateRows: `${diagram.top}fr ${diagram.bottom}fr` }}><span>1</span><span>2</span></div>
        </div>
        <figcaption><strong>{diagram.label}</strong>{showPinyin && <PinyinText>{diagram.pinyin}</PinyinText>}{showSpanish && <span>{diagram.spanish}</span>}</figcaption>
      </figure>)}</div>}
      {topic.tables.map((table, index) => <div className="book-reference-table" key={index}><table><caption>{chinese(table.title)}</caption>
        <thead><tr>{table.columns.map((column, cell) => <th scope="col" key={cell}>{chinese(column)}</th>)}</tr></thead>
        <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{chinese(cell)}</td>)}</tr>)}</tbody>
      </table></div>)}
    </article>)}
    <article className="book-reference-topic"><h3>Radicales chinos</h3><div className="book-radical-grid">
      {reference.radicals.map(radical => <section className="book-radical-card" key={radical.id} aria-label={`Radical ${radical.radical}`}>
        <div className="book-radical-heading"><span className="book-reference-glyph"><LinkedChineseText text={radical.radical} returnTo={returnTo} newTab={Boolean(returnTo)}/></span><div>
          <h4>{chinese(radical.nameHanzi)}</h4>{showPinyin && radical.name && !renderChinese && <PinyinText>{radical.name}</PinyinText>}<p>{radical.strokeCount} trazos</p></div></div>
        <p>{chinese(radical.explanation)}</p><div className="book-radical-examples">{radical.examples.map(example => <div key={example.hanzi}>
          <LinkedChineseText text={example.hanzi} returnTo={returnTo} newTab={Boolean(returnTo)}/>{showPinyin && <PinyinText>{example.pinyin}</PinyinText>}{showSpanish && <span>{example.spanish}</span>}
        </div>)}</div>
      </section>)}
    </div></article>
  </section>;
}

function CharacterReadings({ readings }: { readings: Reading[] }) {
  return readings.map((reading, index) => <div className="book-character-reading" key={`${reading.authority}-${reading.pinyin}-${index}`}>
    <span className="book-source-label">{authorityLabel(reading.authority)}</span>
    {reading.context && <span className="book-reading-context">{reading.context}</span>}
    <PinyinText>{reading.pinyin}</PinyinText>{reading.meaning && <span>{reading.meaning}</span>}
  </div>);
}

export function BookCharacterDetails({ characters }: { characters: BookCharacterDetail[] }) {
  if (!characters.length) return null;
  return <section className="book-reference" aria-labelledby="book-characters-heading">
    <header><p className="eyebrow">Lección 4</p><h2 id="book-characters-heading">Escritura del libro y del cuaderno</h2>
      <p>Repasa los caracteres básicos y observa cómo se combinan sus componentes.</p></header>
    <div className="book-character-grid">{characters.map(character => <article className="book-character-card" key={character.id}>
      <header><h3><LinkedChineseText text={character.hanzi} /></h3>{character.strokeCount !== null && <span>{character.strokeCount} trazos</span>}</header>
      <CharacterReadings readings={character.primaryReadings} />
      {character.secondaryReadings.length > 0 && <div className="book-character-alternative">
        {character.primaryReadings.length > 0 && <p>Otra lectura de la hoja:</p>}
        <CharacterReadings readings={character.secondaryReadings} />
      </div>}
      {character.components.length > 0 && <div className="book-character-components"><h4>Componentes</h4>
        {character.components.map((entry, index) => <p key={index}><span className="book-source-label">{authorityLabel(entry.authority)}</span><span><Hanzi>{entry.parts.join(' + ')}</Hanzi></span></p>)}
      </div>}
      {character.contextWords.length > 0 && <div className="book-character-words"><h4>En palabras</h4>{character.contextWords.map((word, index) => <p key={index}>
        <LinkedChineseText text={word.hanzi} /><PinyinText>{word.pinyin}</PinyinText>
        {word.spanish && <span className="book-context-meaning">{word.spanish}</span>}
      </p>)}</div>}
    </article>)}</div>
  </section>;
}
