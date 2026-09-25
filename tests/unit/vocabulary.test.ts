import { describe, it, expect } from 'vitest';
import { selectVocabulary, searchVocabulary, searchKey, vocabularyCatalog, examplesForScope } from '@/lib/vocabulary';
import { evaluateMix, startMix, mixStats } from '@/lib/vocabulary-review';
import { parseVocabularyState, vocabularyStorageKey } from '@/lib/vocabulary-storage';
import { imageForWord, vocabularyMedia } from '@/lib/vocabulary-media';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { curriculumScopes } from '@/seed/curriculum';
import { existsSync } from 'node:fs';
const pet = vocabularyCatalog.find(w => w.hanzi === '宠物')!;
describe('vocabulario activo: evidencia, búsqueda y recursos', () => {
  it('preserva el testigo exacto de 宠物 sin declararlo nuevo', () => {
    expect(pet.occurrences).toContainEqual(expect.objectContaining({ source: 'SRC-WB-03', page: 9, printedPage: 27, lesson: 3, role: 'workbook_context', section: 'write-14', item: 4 }));
    expect(selectVocabulary('l3', 'new')).not.toContain(pet);
    expect(selectVocabulary('l3', 'context', 'basic')).toContain(pet);
    expect(selectVocabulary('l1')).not.toContain(pet);
    expect(examplesForScope(pet, 'l3')[0]).toMatchObject({ hanzi: '你们家有宠物吗？', pinyin: null, spanish: null, status: 'documented' });
  });
  for (const scope of curriculumScopes) it(`${scope}: Hard contiene Básico y no duplica IDs`, () => {
    const basic = selectVocabulary(scope, 'review', 'basic');
    const hard = selectVocabulary(scope, 'review', 'hard');
    expect(basic.every(w => hard.includes(w))).toBe(true);
    expect(new Set(hard.map(w => w.id)).size).toBe(hard.length);
    for (const word of hard) expect(word.occurrences.some(o => scope.includes(`l${o.lesson}`))).toBe(true);
  });
  it('mantiene consultable todo el catálogo, incluidas clasificaciones pendientes', () => {
    expect(new Set([...selectVocabulary('l1-l2-l3'), ...selectVocabulary('l1-l2-l3', 'pending')].map(w => w.id)).size).toBe(vocabularyCatalog.length);
  });
  it('distingue palabras nuevas, apariciones y repaso', () => {
    expect(selectVocabulary('l3', 'new').map(w => w.id)).not.toEqual(selectVocabulary('l3', 'context').map(w => w.id));
    expect(selectVocabulary('l1-l2-l3').length).toBeGreaterThan(selectVocabulary('l1').length);
    expect(selectVocabulary('l3', 'review', 'hard', 'workbook')).toContain(pet);
    expect(selectVocabulary('l3', 'review', 'hard', 'textbook')).not.toContain(pet);
  });
  for (const query of ['宠物', 'chǒngwù', 'chongwu', 'chong wu', 'chong3wu4', 'MÁSCOTA']) it(`encuentra ${query} dentro del alcance`, () => {
    expect(searchVocabulary(selectVocabulary('l3'), query)[0]).toBe(pet);
    expect(searchVocabulary(selectVocabulary('l1'), query)).toHaveLength(0);
  });
  it('mantiene ü distinta de u y admite sus alias y apóstrofos', () => {
    for (const q of ['nü er', 'nv3er2', "nu:3'er2", 'nǚʼér']) expect(searchKey(q)).toBe('nver');
    expect(searchKey('nü')).not.toBe(searchKey('nu'));
    expect(searchVocabulary(vocabularyCatalog, 'nv3er2')[0].hanzi).toBe('女儿');
  });
  it('solo reutiliza imágenes revisadas y archivos existentes', () => {
    for (const media of vocabularyMedia.filter(m => m.status === 'approved')) {
      expect(vocabularyCatalog.some(w => w.id === media.wordId)).toBe(true);
      expect(existsSync(`public${media.src}`)).toBe(true);
    }
    expect(imageForWord(pet.id)).toBeUndefined();
  });
  it('abre 宠 y 物 como consultas sin inventar destinos para otros glifos', () => {
    for (const character of pet.hanzi) expect(resolveHanziGlyph(character)).toMatchObject({ kind: 'supplementary', character });
    expect(resolveHanziGlyph('宠物').kind).toBe('unavailable');
  });
  it('no mezcla lecturas distintas en audio', () => {
    expect(audioForMandarinText('好', 'hǎo')).toBeTruthy();
    expect(audioForMandarinText('好', 'hào')).toBeUndefined();
    expect(audioForMandarinText('宠物', pet.pinyin)).toBeUndefined();
  });
});
describe('autoevaluación finita y persistencia', () => {
  it('impide evaluar antes de revelar y no duplica eventos', () => {
    const session = startMix([pet], 10, 'l3', 'basic', {}, 'test', 100);
    expect(evaluateMix(session, {}, true, 100).session.events).toHaveLength(0);
    const result = evaluateMix({ ...session, revealed: true }, {}, true, 100);
    expect(result.progress['v-宠物:hanzi'].due).toBe(100 + 86400000);
    expect(evaluateMix({ ...session, revealed: true }, result.progress, true, 100).progress).toBe(result.progress);
    expect(mixStats(result.session)).toEqual({ unique: 1, attempts: 1, remembered: 1, pending: 0 });
  });
  it('reinserta fallos con separación y limita intentos', () => {
    let state = { session: startMix(vocabularyCatalog.slice(0, 5), 5, 'l1', 'basic', {}, 'test', 0, () => 0), progress: {} };
    let last = '';
    for (let i = 0; i < 20 && state.session.index < state.session.queue.length; i++) {
      const word = state.session.queue[state.session.index].wordId;
      expect(word).not.toBe(last); last = word;
      state = evaluateMix({ ...state.session, revealed: true }, state.progress, false, 0);
    }
    expect(state.session.index).toBe(state.session.queue.length);
    expect(state.session.events.length).toBeLessThanOrEqual(10);
    expect(mixStats(state.session).unique).toBe(5);
  });
  it('no crea bucles con una sola palabra ni falla con almacenamiento corrupto', () => {
    const s = startMix([pet], 10, 'l3', 'basic', {}, 'single', 0);
    expect(evaluateMix({ ...s, revealed: true }, {}, false, 0).session.queue).toHaveLength(1);
    for (const raw of ['null', '{}', '{broken', '{"version":1,"sessions":{"l3":{"queue":false}}}']) expect(parseVocabularyState(raw).sessions).toEqual({});
    expect(vocabularyStorageKey('a')).not.toBe(vocabularyStorageKey('b'));
  });
});
