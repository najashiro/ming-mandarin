import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DocumentaryActivities, type DocumentaryActivity } from '@/components/DocumentaryActivities';

const reference = JSON.parse(readFileSync(new URL('../../data/lesson4-study-reference.json', import.meta.url), 'utf8')) as { activities: DocumentaryActivity[] };
const legacy = JSON.parse(readFileSync(new URL('../../data/lesson4-public.json', import.meta.url), 'utf8')) as { documentaryExercises: { id: string }[] };
const activities = reference.activities;
const find = (id: string) => {
  const activity = activities.find(item => item.id === id);
  if (!activity?.structured) throw new Error(`Missing structured activity ${id}`);
  return activity;
};
const content = (id: string) => find(id).structured!;

describe('L4 activities retain the premises required to solve the books', () => {
  it('keeps the 62 activity IDs and presents both books before the slides', () => {
    expect(activities).toHaveLength(62);
    expect(activities.map(activity => activity.id).sort()).toEqual(legacy.documentaryExercises.map(activity => activity.id).sort());
    expect(activities.slice(0, 27).every(activity => activity.sourceTitle === 'Libro de texto')).toBe(true);
    expect(activities.slice(27, 51).every(activity => activity.sourceTitle === 'Libro de ejercicios')).toBe(true);
    expect(activities.slice(51).every(activity => activity.sourceTitle === 'Presentación de clase')).toBe(true);
    expect(activities.flatMap(activity => activity.structured?.items ?? [])).toHaveLength(251);
  });

  it('attaches the complete schedules and preserves blank responses', () => {
    const interview = content('L4-WB-04-02-03').tables;
    expect(interview[0].id).toBe('L4-WB-04-02-04');
    expect(interview[0].rows).toHaveLength(10);
    expect(interview[0].rows[0]).toEqual(['', '起床']);
    expect(interview[0].fillable).toBe(true);
    expect(content('L4-WB-04-10-02').tables[0].fillable).toBe(false);
    const linna = content('L4-BOOK-04-17-03').tables[0];
    expect(linna.rows).toHaveLength(11);
    expect(linna.rows.at(-1)).toEqual(['晚上', '22:30', '睡觉']);
    const personal = content('L4-BOOK-04-20-04').tables;
    expect(personal.map(table => table.id)).toEqual(['L4-BOOK-04-20-05', 'L4-BOOK-04-21-01']);
    expect(personal.flatMap(table => table.rows)).toHaveLength(9);
  });

  it('makes the word-search grid and the reading premises available with their questions', () => {
    const grid = content('L4-WB-04-06-03').tables[0];
    expect(grid.kind).toBe('character-grid');
    expect(grid.rows).toEqual([['明', '她', '差', '有', '你'], ['多', '天', '没', '累', '意'], ['特', '学', '不', '时', '人'], ['别', '累', '主', '忙', '间']]);
    expect(content('L4-WB-04-09-02').passages[0].id).toBe('L4-WB-04-09-01');
    expect(content('L4-WB-04-10-01').passages[0].id).toBe('L4-WB-04-09-03');
    expect(content('L4-WB-04-10-01').passages[0].text).toContain('她们学校');
    expect(content('L4-WB-04-10-01').passages[0].text).toContain('她教英语。她们班');
    expect(content('L4-WB-04-10-01').items[1].text).toBe('她们班一共有多少个女生？');
    expect(content('L4-WB-04-06-02').items[3].pinyin).toContain('xuésheng');
    expect(content('L4-WB-04-07-03').items[0].pinyin).toContain('xuésheng');
    for (const id of ['L4-BOOK-04-19-03', 'L4-BOOK-04-20-02', 'L4-WB-04-09-02', 'L4-WB-04-10-01']) {
      const passage = content(id).passages[0];
      expect(passage.text).not.toBe('');
      expect(passage.pinyin).not.toBe('');
      expect(passage.spanish).not.toBe('');
    }
  });

  it('preserves labelled options, numbering and printed models without generating keys', () => {
    const listening = find('L4-WB-04-02-02');
    expect(listening.requiresOriginalAudio).toBe(true);
    expect(listening.structured!.items).toHaveLength(6);
    expect(listening.structured!.items[0].choices).toEqual([
      { label: 'A', text: '八点半' }, { label: 'B', text: '六点半' }, { label: 'C', text: '七点半' },
    ]);
    expect(content('L4-WB-04-05-01').items.map(item => item.label)).toEqual(['4', '5', '6']);
    expect(content('L4-WB-04-05-01').choices.map(choice => choice.label)).toEqual(['D', 'E', 'F']);
    const questions = content('L4-WB-04-05-02').items;
    expect(questions.map(item => item.label)).toEqual(['Ejemplo', '1', '2', '3', '4', '5']);
    expect(questions[1].underlined).toBe('很忙');
    expect(JSON.stringify(activities)).not.toMatch(/"(?:answerKey|correctAnswer|automaticGrading)"/);
  });

  it('provides accessible illustrated premises and the exact four clock figures', () => {
    const panels = content('L4-WB-04-10-02').visuals[0].panels;
    expect(panels[0].rows.join('').split('').filter(symbol => symbol === 'M')).toHaveLength(19);
    expect(panels[1].rows.join('').split('').filter(symbol => symbol === 'F')).toHaveLength(19);
    expect(content('L4-WB-04-11-01').visuals[0].texts).toContain('2020年3月');
    expect(content('L4-WB-04-11-03').models[0].id).toBe('L4-WB-04-11-04');
    expect(content('L4-BOOK-04-01-03').clocks).toEqual([
      { label: 'a', hour: 2, minute: 0 }, { label: 'b', hour: 8, minute: 0 },
      { label: 'c', hour: 3, minute: 30 }, { label: 'd', hour: 10, minute: 10 },
    ]);
    const scenes = content('L4-BOOK-04-18-01').items.map(item => item.scene);
    expect(scenes[0]).toContain('invitación al cine');
    expect(scenes[1]).toContain('un bocadillo');
    expect(scenes.join(' ')).not.toMatch(/Una estudiante|un compañero|al fondo/);
  });

  it('renders semantic tables, separate options, underlines and the missing-audio notice on the server', () => {
    const html = renderToStaticMarkup(createElement(DocumentaryActivities, { activities: [
      find('L4-WB-04-02-03'), find('L4-WB-04-02-02'), find('L4-WB-04-05-02'), find('L4-WB-04-10-02'),
    ] }));
    expect(html).toContain('<table>');
    expect(html).toContain('<caption>Horario / Actividad</caption>');
    expect(html).toContain('scope="col"');
    expect(html).toContain('aria-label="Por completar"');
    expect(html).toContain('documentary-choice-label">A.');
    expect(html).toMatch(/<u><span[^>]+>很忙<\/span><\/u>/);
    expect(html).toContain('grabación original del libro, aún no disponible');
    expect(html).toContain('19 símbolos masculinos y 1 símbolos femeninos');
    expect(html).not.toMatch(/<img|\.pdf|\/tmp\//);
  });
});
