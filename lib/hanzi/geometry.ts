import type { HanziCharacterData } from './types';

export type ScreenPoint = { x: number; y: number };

export function getHanziTransform(width: number, height: number, padding = 24) {
  const effectiveWidth = Math.max(1, width - 2 * padding);
  const effectiveHeight = Math.max(1, height - 2 * padding);
  const scale = Math.min(effectiveWidth / 1024, effectiveHeight / 1024);
  const xOffset = padding + (effectiveWidth - scale * 1024) / 2;
  const yOffset = padding + (effectiveHeight - scale * 1024) / 2 + 124 * scale;
  return {
    x: xOffset,
    y: yOffset,
    scale,
    transform: `translate(${xOffset}, ${height - yOffset}) scale(${scale}, ${-scale})`,
  };
}

export function toScreenPoint(point: [number, number], width: number, height: number, padding = 24): ScreenPoint {
  const transform = getHanziTransform(width, height, padding);
  return {
    x: transform.x + point[0] * transform.scale,
    y: height - transform.y - point[1] * transform.scale,
  };
}

export function medianPolyline(median: Array<[number, number]>, width: number, height: number, padding = 24) {
  return median.map((point) => {
    const screen = toScreenPoint(point, width, height, padding);
    return `${round(screen.x)},${round(screen.y)}`;
  }).join(' ');
}

export function strokeDirection(median: Array<[number, number]>) {
  if (median.length < 2) return { x: 0, y: 0, angle: 0, label: 'sin dirección' };
  const start = median[0];
  const end = median[median.length - 1];
  const x = end[0] - start[0];
  const y = end[1] - start[1];
  const angle = Math.atan2(-y, x) * 180 / Math.PI;
  const absX = Math.abs(x);
  const absY = Math.abs(y);
  const label = absX > absY * 1.7 ? (x >= 0 ? 'derecha' : 'izquierda')
    : absY > absX * 1.7 ? (y >= 0 ? 'arriba' : 'abajo')
      : `${x >= 0 ? 'derecha' : 'izquierda'} y ${y >= 0 ? 'arriba' : 'abajo'}`;
  return { x, y, angle, label };
}

export function cumulativeStrokeSets(data: HanziCharacterData) {
  return data.strokes.map((_, index) => data.strokes.slice(0, index + 1));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
