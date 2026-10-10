import { describe, expect, it } from 'vitest';
import { shuffledBlockOrder } from '@/lib/games-session';

describe('construcción de frases', () => {
  it('conserva cada bloque repetido como pieza independiente', () => {
    const blocks = ['我', '是', '学生', '，', '他', '也', '是', '学生'];
    const order = shuffledBlockOrder(blocks, () => 0.36);
    expect([...order].sort((a, b) => a - b)).toEqual(blocks.map((_, index) => index));
    expect(order.map(index => blocks[index]).filter(block => block === '学生')).toHaveLength(2);
  });

  it('varía la bandeja y evita entregar la respuesta ya ordenada', () => {
    const blocks = ['我', '家', '有', '四', '口', '人'];
    const trays = [0, 0.13, 0.3, 0.5, 0.7, 0.99].map(value => shuffledBlockOrder(blocks, () => value));
    expect(new Set(trays.map(tray => tray.join(','))).size).toBeGreaterThan(3);
    for (const tray of trays) expect(tray.map(index => blocks[index])).not.toEqual(blocks);
    expect(trays.some(tray => tray.join(',') !== '5,4,3,2,1,0')).toBe(true);
  });

  it('evita también la respuesta visible con palabras duplicadas', () => {
    const blocks = ['我', '也', '我', '也'];
    const tray = shuffledBlockOrder(blocks, () => 0.999);
    expect(tray.map(index => blocks[index])).not.toEqual(blocks);
    expect(shuffledBlockOrder(['好', '好'], () => 0)).toHaveLength(2);
    expect(shuffledBlockOrder([], () => 0)).toEqual([]);
    expect(shuffledBlockOrder(['你好'], () => 0)).toEqual([0]);
  });
});
