import { Fragment } from 'react';
import type { GrammarPoint } from '@/data/types';
import { Hanzi } from './Hanzi';
import { PinyinText } from './PinyinText';
import './grammar-cards.css';

export function GrammarCards({ points }: { points: GrammarPoint[] }) {
  return <section className="grammar-grid shell">{points.filter(point => !point.continuationOf).map(point =>
    <article className="panel grammar-reference-card" id={point.id} key={point.id}>
      <h2><Hanzi>{point.title}</Hanzi></h2>
      {point.pattern && <div className="pattern"><Hanzi>{point.pattern}</Hanzi></div>}
      <p className="grammar-explanation"><Hanzi>{point.explanation}</Hanzi></p>
      {point.clarification && <p className="grammar-clarification"><Hanzi>{point.clarification}</Hanzi></p>}
      {point.examples.length > 0 && <ul>{point.examples.map(example => <li key={example}><Hanzi>{example}</Hanzi></li>)}</ul>}
      {point.studyBlocks?.map(block => block.kind === 'table'
        ? <div className="grammar-table-scroll" key={block.id} tabIndex={0} role="region" aria-label={block.title}>
          <table className="grammar-source-table">
            <caption><Hanzi>{block.title}</Hanzi></caption>
            <thead><tr>{block.columns?.map((column, index) => <th scope="col" key={index}>{column}</th>)}</tr></thead>
            <tbody>{block.rows?.map((row, index) => {
              const aid = block.rowAids?.[index];
              return <Fragment key={index}><tr>{row.map((cell, column) => <td key={column}><Hanzi>{cell}</Hanzi></td>)}</tr>
                {aid?.pinyin && <tr className="grammar-row-aid"><td colSpan={block.columns?.length}>
                  <PinyinText>{aid.pinyin}</PinyinText>{aid.spanish && <p>{aid.spanish}</p>}
                </td></tr>}
              </Fragment>;
            })}</tbody>
          </table>
        </div>
        : <section className="grammar-worked-examples" key={block.id} aria-label={block.title}>
          <h3><Hanzi>{block.title}</Hanzi></h3>
          {block.examples?.map(example => <div className="grammar-worked-example" key={example.id}>
            <p><Hanzi>{example.hanzi}</Hanzi></p>
            {example.pinyin && <p><PinyinText>{example.pinyin}</PinyinText></p>}
            {example.spanish && <p>{example.spanish}</p>}
          </div>)}
        </section>)}
    </article>)}</section>;
}
