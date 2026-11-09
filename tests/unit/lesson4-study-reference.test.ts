import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import reference from '@/data/lesson4-study-reference.json';
import lesson4 from '@/data/lesson4-public.json';
import corpus from '@/lib/active-corpus';
import { getCurriculum } from '@/seed/curriculum';
import { GrammarCards } from '@/components/GrammarCards';
import { BookReference, BookCharacterDetails, type BookReferenceData } from '@/components/BookReference';
import type { GrammarPoint } from '@/data/types';

const grammar = reference.grammar as GrammarPoint[];
const point = (id: string) => {
  const found = grammar.find(row => row.id === `GR-L4-BOOK-04-${id}`);
  if (!found) throw new Error(`Missing book grammar ${id}`);
  return found;
};
const tables = grammar.flatMap(row => row.studyBlocks ?? []).filter(block => block.kind === 'table');
const characters = reference.bookReference.characterDetails;
const bookReference = reference.bookReference as BookReferenceData;

describe('L4 study reference preserves teaching omitted from the original web projection', () => {
  it('keeps all seven textbook tables with 57 complete reading aids and six printed ellipses', () => {
    expect(tables.map(table => table.id)).toEqual([
      'L4-BOOK-04-08-03', 'L4-BOOK-04-09-06', 'L4-BOOK-04-10-04', 'L4-BOOK-04-10-05',
      'L4-BOOK-04-11-05', 'L4-BOOK-04-12-01', 'L4-BOOK-04-13-03',
    ]);
    expect(tables.flatMap(table => table.rows ?? [])).toHaveLength(63);
    let complete = 0;
    let ellipses = 0;
    for (const table of tables) {
      expect(table.rowAids).toHaveLength(table.rows!.length);
      table.rows!.forEach((row, index) => {
        const aid = table.rowAids![index];
        if (row.every(cell => cell === '…')) {
          ellipses++;
          expect(aid).toEqual({ pinyin: '', spanish: '' });
        } else {
          complete++;
          expect(aid.pinyin.trim(), `${table.id}:${index}`).not.toBe('');
          expect(aid.spanish.trim(), `${table.id}:${index}`).not.toBe('');
        }
      });
    }
    expect([complete, ellipses]).toEqual([57, 6]);
  });

  it('retains the hour alternatives and both positions of time before the predicate', () => {
    const time = point('09-05').studyBlocks![0];
    expect(time.rows!.map(row => row[0])).toEqual(['2:00', '2:05', '2:10', '2:12', '2:15', '2:30', '2:45', '2:55']);
    expect(time.rows![1][1]).toBe('两点零（líng, cero）五分');
    expect(time.rows![6][1]).toContain('差一刻三点');
    expect(time.rows![7][1]).toContain('差五分三点');
    const orders = point('10-03').studyBlocks!;
    expect(orders.map(table => table.columns!.slice(0, 2))).toEqual([
      ['Sujeto', 'Complemento circunstancial de tiempo'], ['Complemento circunstancial de tiempo', 'Sujeto'],
    ]);
    expect(orders[0].rows![0]).toEqual(['我', '明天', '有很多课。']);
    expect(orders[1].rows![0]).toEqual(['七点半', '我们班', '有活动。']);
  });

  it('joins the page-break note and explains 没有 without changing the printed table', () => {
    expect(point('10-06').explanation).not.toMatch(/Por\s*$/);
    expect(point('10-06').explanation).toContain('Por ejemplo');
    expect(point('10-06').explanation).toContain('我有课今天');
    expect(point('11-01').continuationOf).toBe(point('10-06').id);
    const html = renderToStaticMarkup(createElement(GrammarCards, { points: grammar }));
    expect(html).not.toContain('id="GR-L4-BOOK-04-11-01"');
    expect((html.match(/panel grammar-reference-card/g) ?? []).length).toBe(18);
    expect(point('13-02').clarification).toContain('No se añade otro 有 después de 没有');
    expect(point('13-02').studyBlocks![0].rows![5]).toEqual(['她', '今天', '没有', '时间。', '']);
  });

  it('keeps A-not-A predicates, printed responses and the three 呢 examples together', () => {
    const questions = point('11-04').studyBlocks!;
    expect(questions.flatMap(table => table.rows ?? [])).toHaveLength(5);
    expect(questions[1].rows![0]).toEqual(['宋华', '有', '没有', '时间？']);
    expect(point('12-02').studyBlocks!.flatMap(block => block.examples ?? [])).toHaveLength(4);
    expect(point('12-04').studyBlocks!.flatMap(block => block.examples ?? [])).toHaveLength(2);
    const ellipsis = point('14-03');
    expect(ellipsis.pattern).toBe('Pronombre/Sustantivo (Frase) + 呢？');
    expect(ellipsis.studyBlocks!.flatMap(block => block.examples ?? [])).toHaveLength(3);
  });

  it('promotes the two explicit book radical definitions into the active catalogue', () => {
    expect(reference.bookReference.radicals.map(row => row.id)).toEqual(['RAD-U5202', 'RAD-U65E5']);
    for (const book of reference.bookReference.radicals) {
      expect(book.name).toBe(''); // The book does not print a pinyin name.
      const active = corpus.radicals.find(row => row.radical === book.radical)!;
      expect(active.nameHanzi).toBe(book.nameHanzi);
      expect(active.strokeCount).toBe(book.strokeCount);
      expect(active.meaning).toBe(book.meaning);
      expect(active.explanation).toBe(book.explanation);
      expect(active.lessons).toContain(4);
      expect(active.examples.slice(0, book.examples.length)).toEqual(book.examples);
    }
  });

  it('adds 25 explicit writing targets without changing historical character IDs or readings', () => {
    expect(characters).toHaveLength(25);
    expect(characters.every(row => row.id === `c-${row.hanzi}`)).toBe(true);
    expect(characters.map(row => row.hanzi)).toEqual(expect.arrayContaining(['日', '月', '牛', '寸', '影', '法', '现']));
    expect(characters.some(row => row.hanzi === '晚')).toBe(false); // Radical example, not a new writing target here.
    const only = characters.find(row => row.hanzi === '只')!;
    expect(only.primaryReadings).toEqual([
      { pinyin: 'zhǐ', meaning: 'solo', authority: 'textbook' },
      { pinyin: 'zhǐ', meaning: 'solo', authority: 'workbook' },
    ]);
    expect(only.secondaryReadings[0].pinyin).toBe('zhī');
    expect(getCurriculum('l3').characters.find(row => row.hanzi === '只')!.pinyin).toBe('zhī');
    expect(lesson4.characters).toHaveLength(54);
    expect(characters.find(row => row.hanzi === '别')!.components).toEqual([
      { parts: ['口', '力', '刂'], authority: 'textbook' }, { parts: ['另', '刂'], authority: 'workbook' },
    ]);
    expect(characters.find(row => row.hanzi === '特')!.primaryReadings).toEqual([]);
    expect(characters.find(row => row.hanzi === '特')!.contextWords[0].pinyin).toBe('tèbié');
  });

  it('shows source-based diagrams and cultural reading without publishing scans or attributing editorial fields', () => {
    const structure = bookReference.topics.find(topic => topic.id === 'L4-BOOK-04-21-04')!;
    const culture = bookReference.topics.find(topic => topic.id === 'L4-BOOK-04-24-02')!;
    expect(structure.diagrams.map(row => [row.hanzi, row.top, row.bottom])).toEqual([['男', 1, 1], ['点', 2, 1], ['家', 1, 2]]);
    expect(culture.introduction).toBe('Lectura cultural del libro.');
    expect(culture.paragraphs).toHaveLength(4);
    expect(culture.paragraphs[2]).toContain('otros estudiantes ingresan en escuelas secundarias vocacionales');
    expect(culture.paragraphs[2]).toContain('continuar su estudio en un nivel educativo más alto');
    const html = renderToStaticMarkup(createElement(BookReference, { reference: reference.bookReference }))
      + renderToStaticMarkup(createElement(BookCharacterDetails, { characters }));
    expect(html).toContain('日字旁');
    expect(html).toContain('Otra lectura de la hoja');
    expect(html).not.toMatch(/<img|\.pdf|authority_tier|source_id|pinyin_ming|\/tmp\//);
    expect(lesson4).not.toHaveProperty('bookReference'); // Server-only material stays out of vocabulary's client JSON.
  });

  it('restores the introduction, both conversation settings and all ten key phrases with exact reading aids', () => {
    const introduction = bookReference.topics.find(topic => topic.id === 'L4-BOOK-04-01-01')!;
    expect(introduction.titlePinyin).toBe('Nǐ míngtiān jǐ diǎn yǒu kè');
    expect(introduction.paragraphs[0]).toContain('cómo contar del 11 al 100');
    const situations = bookReference.topics.find(topic => topic.id === 'L4-BOOK-DIALOGUE-CONTEXTS')!.situations!;
    expect(situations).toHaveLength(2);
    expect(situations.flatMap(situation => situation.functions)).toHaveLength(4);
    expect(situations[0].context).toContain('Song Hua');
    expect(situations[1].context).toContain('cafetería');
    expect(situations.map(situation => situation.href)).toEqual([
      '/study/l4/dialogues#turn-DLG-L4-BOOK-T1-1', '/study/l4/dialogues#turn-DLG-L4-BOOK-T2-1',
    ]);
    const examples = bookReference.topics.find(topic => topic.id === 'L4-BOOK-04-08-02')!.examples!;
    expect(examples).toHaveLength(10);
    expect(examples[4].hanzi).toBe('你看不看（电影）？');
    expect(examples[7]).toMatchObject({ hanzi: '差五分七点。', pinyin: 'Chà wǔ fēn qī diǎn.', spanish: 'Son las siete menos cinco.' });
    for (const example of examples) {
      expect(example.pinyin.trim()).not.toBe('');
      expect(example.spanish.trim()).not.toBe('');
      expect(lesson4.phrases.find(phrase => phrase.id === example.id)?.hanzi).toBe(example.hanzi);
    }
  });
});
