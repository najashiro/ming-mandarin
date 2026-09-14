import { describe, expect, it } from 'vitest';
import { compareHanziStrokes, type WritingStroke } from '@/lib/hanzi/recognition';

const template = { strokes: ['horizontal', 'vertical'], medians: [
  [[100, 700], [500, 700], [900, 700]],
  [[500, 900], [500, 500], [500, 100]],
] as Array<Array<[number, number]>> };

const stroke = (points: Array<[number, number]>): WritingStroke => ({ points: points.map(([x, y], index) => ({ x, y, t: index })) });
const correct = [stroke([[0.1, 0.3], [0.5, 0.3], [0.9, 0.3]]), stroke([[0.5, 0.1], [0.5, 0.5], [0.5, 0.9]])];

describe('verificación local de escritura Hanzi', () => {
  it('acepta trayectorias reconocibles y rechaza orden, dirección o cantidad incorrectos', () => {
    expect(compareHanziStrokes(correct, template, 'EXAM_MODE').accepted).toBe(true);
    expect(compareHanziStrokes([correct[1], correct[0]], template, 'STROKE_MODE').accepted).toBe(false);
    expect(compareHanziStrokes([stroke([...correct[0].points].reverse().map(({ x, y }) => [x, y])) , correct[1]], template, 'EXAM_MODE').accepted).toBe(false);
    expect(compareHanziStrokes([correct[0]], template).strokeCountMatches).toBe(false);
  });
});
