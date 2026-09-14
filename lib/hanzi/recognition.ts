import { loadHanziData } from './loader';
import type { HanziCharacterData } from './types';

export type WritingPoint = { x: number; y: number; t: number };
export type WritingStroke = { points: WritingPoint[] };
export type RecognitionMode = 'EXAM_MODE' | 'STROKE_MODE';
export type RecognitionResult = {
  accepted: boolean;
  recognizedCharacter: string | null;
  confidence: number;
  strokeCountMatches: boolean;
  message: string;
  unavailable?: boolean;
};

type Point = { x: number; y: number };

function resample(points: Point[], count = 12): Point[] {
  if (!points.length) return [];
  if (points.length === 1) return Array.from({ length: count }, () => points[0]);
  const lengths = [0];
  for (let index = 1; index < points.length; index += 1) {
    lengths.push(lengths[index - 1] + Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y));
  }
  const total = lengths.at(-1)!;
  if (total === 0) return Array.from({ length: count }, () => points[0]);
  return Array.from({ length: count }, (_, index) => {
    const distance = total * index / (count - 1);
    let segment = 1;
    while (segment < lengths.length - 1 && lengths[segment] < distance) segment += 1;
    const part = (distance - lengths[segment - 1]) / Math.max(1e-6, lengths[segment] - lengths[segment - 1]);
    return { x: points[segment - 1].x + (points[segment].x - points[segment - 1].x) * part, y: points[segment - 1].y + (points[segment].y - points[segment - 1].y) * part };
  });
}

function normalize(strokes: Point[][]): Point[][] {
  const all = strokes.flat();
  const minX = Math.min(...all.map((point) => point.x));
  const maxX = Math.max(...all.map((point) => point.x));
  const minY = Math.min(...all.map((point) => point.y));
  const maxY = Math.max(...all.map((point) => point.y));
  const extent = Math.max(maxX - minX, maxY - minY, 0.001);
  return strokes.map((stroke) => stroke.map((point) => ({ x: (point.x - minX) / extent, y: (point.y - minY) / extent })));
}

export function compareHanziStrokes(strokes: WritingStroke[], data: HanziCharacterData, mode: RecognitionMode = 'EXAM_MODE'): RecognitionResult {
  const expected = data.medians;
  if (!strokes.length || strokes.some((stroke) => stroke.points.length === 0)) {
    return { accepted: false, recognizedCharacter: null, confidence: 0, strokeCountMatches: false, message: 'Dibuja el carácter antes de comprobar.' };
  }
  const countMatches = strokes.length === expected.length;
  if (!countMatches) {
    return { accepted: false, recognizedCharacter: null, confidence: 0, strokeCountMatches: false, message: 'No se reconoce claramente el carácter. Revisa la cantidad de trazos.' };
  }
  const actual = normalize(strokes.map((stroke) => stroke.points.map(({ x, y }) => ({ x, y }))));
  const reference = normalize(expected.map((stroke) => stroke.map(([x, y]) => ({ x, y: 1024 - y }))));
  const strokeErrors = actual.map((stroke, index) => {
    const a = resample(stroke);
    const b = resample(reference[index]);
    return a.reduce((sum, point, sample) => sum + Math.hypot(point.x - b[sample].x, point.y - b[sample].y), 0) / a.length;
  });
  const reversedStroke = actual.some((stroke, index) => {
    const first = stroke[0];
    const last = stroke.at(-1)!;
    const referenceFirst = reference[index][0];
    const referenceLast = reference[index].at(-1)!;
    const ax = last.x - first.x;
    const ay = last.y - first.y;
    const bx = referenceLast.x - referenceFirst.x;
    const by = referenceLast.y - referenceFirst.y;
    const magnitude = Math.hypot(ax, ay) * Math.hypot(bx, by);
    return magnitude > 0.02 && (ax * bx + ay * by) / magnitude < -0.35;
  });
  const error = strokeErrors.reduce((sum, value) => sum + value, 0) / strokeErrors.length;
  const threshold = mode === 'EXAM_MODE' ? 0.29 : 0.19;
  const accepted = error <= threshold && !reversedStroke && (mode === 'EXAM_MODE' || Math.max(...strokeErrors) <= 0.34);
  return {
    accepted,
    recognizedCharacter: null,
    confidence: Math.max(0, Math.min(1, 1 - error / (threshold * 1.5))),
    strokeCountMatches: true,
    message: accepted ? 'OK' : 'No se reconoce claramente el carácter.',
  };
}

export async function recognizeHanzi(strokes: WritingStroke[], expectedCharacter: string, mode: RecognitionMode = 'EXAM_MODE'): Promise<RecognitionResult> {
  try {
    const data = await loadHanziData(expectedCharacter);
    const result = compareHanziStrokes(strokes, data, mode);
    return result.accepted ? { ...result, recognizedCharacter: expectedCharacter } : result;
  } catch {
    return { accepted: false, recognizedCharacter: null, confidence: 0, strokeCountMatches: false, message: 'No se pudieron cargar los datos de trazos. Inténtalo de nuevo.', unavailable: true };
  }
}
