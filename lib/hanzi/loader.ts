import type { HanziCharacterData } from './types';

const cache = new Map<string, Promise<HanziCharacterData>>();

export function hanziDataUrl(character: string) {
  return `/hanzi-data/${encodeURIComponent(character)}.json`;
}

export function isHanziCharacterData(value: unknown): value is HanziCharacterData {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<HanziCharacterData>;
  return Array.isArray(data.strokes)
    && data.strokes.every((stroke) => typeof stroke === 'string')
    && Array.isArray(data.medians)
    && data.medians.length === data.strokes.length
    && data.medians.every((median) => Array.isArray(median)
      && median.length >= 2
      && median.every((point) => Array.isArray(point)
        && point.length === 2
        && point.every((coordinate) => Number.isFinite(coordinate))));
}

export function loadHanziData(character: string): Promise<HanziCharacterData> {
  const existing = cache.get(character);
  if (existing) return existing;
  const request = fetch(hanziDataUrl(character), { cache: 'force-cache' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`No hay datos técnicos para ${character}.`);
      const data: unknown = await response.json();
      if (!isHanziCharacterData(data)) throw new Error(`Los datos técnicos de ${character} no son válidos.`);
      return data;
    })
    .catch((error) => {
      cache.delete(character);
      throw error;
    });
  cache.set(character, request);
  return request;
}

export function hanziWriterDataLoader(character: string, onLoad: (data: HanziCharacterData) => void, onError: (error?: unknown) => void) {
  loadHanziData(character).then(onLoad).catch(onError);
}

export function clearHanziDataCache() {
  cache.clear();
}
