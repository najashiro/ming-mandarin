'use client';

import { getHanziTransform, medianPolyline, toScreenPoint } from '@/lib/hanzi/geometry';
import type { HanziCharacterData } from '@/lib/hanzi/types';

type Props = {
  character: string;
  data: HanziCharacterData;
  visibleStrokes?: number;
  showDirections?: boolean;
  showNumbers?: boolean;
  compact?: boolean;
};

export function HanziStrokeSvg({ character, data, visibleStrokes = data.strokes.length, showDirections = true, showNumbers = true, compact = false }: Props) {
  const size = 420;
  const transform = getHanziTransform(size, size, 28);
  const id = `arrow-${character.codePointAt(0)?.toString(16)}-${visibleStrokes}-${compact ? 'c' : 'f'}`;
  return <svg className={`hanzi-answer-svg ${compact ? 'compact' : ''}`} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Orden de trazos de ${character}: ${visibleStrokes} de ${data.strokes.length}`}>
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#a23a2c" />
      </marker>
    </defs>
    <rect x="1" y="1" width="418" height="418" rx="5" className="mizi-paper" />
    <g className="mizi-lines">
      <path d="M210 1V419M1 210H419M1 1L419 419M419 1L1 419" />
    </g>
    <g transform={transform.transform} className="hanzi-answer-strokes">
      {data.strokes.slice(0, visibleStrokes).map((stroke, index) => <path d={stroke} key={`${index}-${stroke.slice(0, 12)}`} data-stroke={index + 1} />)}
    </g>
    {showDirections && data.medians.slice(0, visibleStrokes).map((median, index) => <polyline
      key={`direction-${index}`}
      points={medianPolyline(median, size, size, 28)}
      className="stroke-direction"
      markerEnd={`url(#${id})`}
      data-testid="stroke-direction"
    />)}
    {data.medians.slice(0, visibleStrokes).map((median, index) => {
      const start = toScreenPoint(median[0], size, size, 28);
      return <g key={`start-${index}`}>
        <circle className="stroke-start" cx={start.x} cy={start.y} r={compact ? 5 : 7} />
        {showNumbers && <text className="stroke-number" x={start.x + 10} y={start.y - 9}>{index + 1}</text>}
      </g>;
    })}
  </svg>;
}
