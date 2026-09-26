import { describe, it, expect } from 'vitest';
import { selectVocabulary, searchVocabulary, searchKey, vocabularyCatalog, examplesForScope, examplesForWord, getVocabularySet, getVocabularyLesson, accumulatedVocabulary, searchGlobalVocabulary } from '@/lib/vocabulary';
import { evaluateMix, startMix, mixStats, reconcileMixSession } from '@/lib/vocabulary-review';
import { parseVocabularyState, vocabularyStorageKey } from '@/lib/vocabulary-storage';
import { imageForWord, vocabularyMedia } from '@/lib/vocabulary-media';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import corpus from '@/data/corpus-v21-public.json';
import { canonicalCharacters } from '@/seed/characters';
import { curriculumScopes } from '@/seed/curriculum';
import { existsSync } from 'node:fs';
const pet = vocabularyCatalog.find(w => w.hanzi === '宠物')!;
describe('vocabulario activo: evidencia, búsqueda y recursos', () => {
  it('preserva el testigo exacto de 宠物 sin declararlo nuevo', () => {
    expect(pet.curriculumLinks).toContainEqual(expect.objectContaining({ lesson: 3, role: 'workbook_context', list_type: null }));
    expect(selectVocabulary('l3', 'supplementary')).not.toContain(pet);
    expect(selectVocabulary('l3', 'new')).not.toContain(pet);
    expect(selectVocabulary('l3', 'context', 'basic')).toContain(pet);
    expect(selectVocabulary('l1')).not.toContain(pet);
    // The only linked pet sentence is an open interview prompt, not an eligible example.
    expect(examplesForWord(pet)).toEqual([]);
  });
  for (const scope of curriculumScopes) it(`${scope}: Hard contiene Básico y no duplica IDs`, () => {
    const basic = selectVocabulary(scope, 'review', 'basic');
    const hard = selectVocabulary(scope, 'review', 'hard');
    expect(basic.every(w => hard.includes(w))).toBe(true);
    expect(new Set(hard.map(w => w.id)).size).toBe(hard.length);
    for (const word of hard) expect(word.curriculumLinks.some(link => scope.includes(`l${link.lesson}`))).toBe(true);
  });
  it('mantiene consultable todo el catálogo, incluidas clasificaciones pendientes', () => {
    expect(new Set([...selectVocabulary('l1-l2-l3'), ...selectVocabulary('l1-l2-l3', 'pending')].map(w => w.id)).size).toBe(vocabularyCatalog.length);
  });
  it('distingue palabras nuevas, apariciones y repaso', () => {
    expect(selectVocabulary('l3', 'new').map(w => w.id)).not.toEqual(selectVocabulary('l3', 'context').map(w => w.id));
    expect(selectVocabulary('l1-l2-l3').length).toBeGreaterThan(selectVocabulary('l1').length);
    expect(selectVocabulary('l3', 'context')).toContain(pet);
    expect(selectVocabulary('l3', 'supplementary')).not.toContain(pet);
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

describe('sincronización del corpus auditado', () => {
  it('respeta las listas por lección, incluidos nombres propios', () => {
    const regular = vocabularyCatalog.find(w => w.hanzi === '马马虎虎')!;
    const china = vocabularyCatalog.find(w => w.hanzi === '中国')!;
    const name = vocabularyCatalog.find(w => w.hanzi === '马大为')!;
    expect(regular.pinyin).toBe('mǎmǎhūhū');
    expect(selectVocabulary('l1', 'supplementary')).toContain(regular);
    expect(selectVocabulary('l1', 'new')).not.toContain(regular);
    expect(selectVocabulary('l1', 'review', 'basic')).not.toContain(regular);
    expect(selectVocabulary('l2', 'supplementary')).toContain(china);
    expect(selectVocabulary('l2', 'new')).not.toContain(china);
    expect(selectVocabulary('l2', 'review', 'basic')).not.toContain(china);
    expect(selectVocabulary('l3', 'new', 'basic')).toContain(china);
    expect(selectVocabulary('l1', 'new', 'basic')).toContain(name);
    const sets = ['new', 'supplementary', 'context', 'review'].map(selection => selectVocabulary('l1-l2-l3', selection as 'new').map(w => w.id).sort().join(','));
    expect(new Set(sets).size).toBe(4);
  });
  it('preserva evidencia Hanzi sin cambiar la unidad de 太 ni prometer recursos', () => {
    expect(corpus.hanzi.find(row => row.hanzi === '太')).toMatchObject({ worksheetEvidence: true, readings: ['tài'] });
    expect(canonicalCharacters.find(row => row.hanzi === '太')?.introducedIn).toBe('1.2');
    for (const word of vocabularyCatalog) for (const glyph of word.hanzi) {
      const resolved = resolveHanziGlyph(glyph);
      if (resolved.kind !== 'unavailable') expect(existsSync(`public/hanzi-data/${glyph}.json`)).toBe(true);
    }
  });
  it('usa pinyin recuperado y enlaces léxicos sin enviar trazabilidad documental', () => {
    const texts = ['我家有五口人。', '你有弟弟吗？', '我没有弟弟，我有一个哥哥。', '大家好！我姓马，叫马大为，是美国人。', '我们家一共有五口人，爸爸、妈妈、哥哥和我，还有约翰（John）。', '约翰是我的狗，今年两岁。', '我爸爸是律师，我妈妈是工程师，我哥哥是经理。', '我的老师是陈老师，我们都很喜欢她。', '我有三个中国朋友，王小云、宋华和陆雨平。'];
    const examples = vocabularyCatalog.flatMap(word => examplesForScope(word, 'l3'));
    for (const text of texts) {
      const phrase = corpus.phrases.find(row => row.hanzi === text)!;
      expect(phrase.pinyin).toBeTruthy();
      expect(examples.some(example => example.id === phrase.id && example.pinyin === phrase.pinyin)).toBe(true);
    }
    expect(JSON.stringify({ words: vocabularyCatalog, examples })).not.toMatch(/SRC-|\.pdf|"page"|"source"|"printedPage"|evidence_ids/);
    for (const word of vocabularyCatalog) {
      const examples = examplesForScope(word, 'l3');
      expect(new Set(examples.map(example => example.id)).size).toBe(examples.length);
    }
    const john = vocabularyCatalog.find(word => word.hanzi === '约翰')!;
    expect(john.pinyin).toBe('Yuēhàn');
    expect(examplesForScope(john, 'l3').some(example => example.hanzi.startsWith('约翰是我的狗') && example.pinyin)).toBe(true);
  });
  it('mantiene sesiones, caras, favoritos y progreso anteriores al cambio de corpus', () => {
    const session = { ...startMix([pet], 5, 'l3', 'basic', {}, 'before-sync', 100), revealed: true };
    const progress = { 'v-宠物:hanzi': { due: 500, streak: 2, attempts: 3, lastEvent: 'old:0' } };
    const state = parseVocabularyState(JSON.stringify({ version: 1, favorites: [pet.id], faces: { [pet.id]: true }, sessions: { l3: session }, progress }));
    expect(state.sessions.l3).toEqual(session);
    expect(state.progress).toEqual(progress);
    expect(state.favorites).toEqual([pet.id]);
    expect(state.faces[pet.id]).toBe(true);
    expect(vocabularyCatalog.find(word => word.id === state.sessions.l3.queue[0].wordId)).toBe(pet);
  });
});

describe('partición exclusiva y ejemplos globales', () => {
  it('construye conjuntos disjuntos cuya unión es el acumulado', () => {
    const sets = ['l1', 'l2', 'l3'].map(scope => getVocabularySet(scope as 'l1'));
    const union = sets.flat();
    expect(new Set(union.map(word => word.id)).size).toBe(union.length);
    expect(union).toEqual(accumulatedVocabulary);
    expect(getVocabularySet('l1-l2-l3')).toEqual(union);
    expect(new Set(union.map(word => word.id))).toEqual(new Set(selectVocabulary('l1-l2-l3').map(word => word.id)));
    for (const [index, words] of sets.entries()) for (const word of words) expect(getVocabularyLesson(word)).toBe(index + 1);
    for (const scope of curriculumScopes) {
      const hard = getVocabularySet(scope);
      expect(getVocabularySet(scope, 'basic').every(word => hard.includes(word))).toBe(true);
    }
  });
  for (const [hanzi, lesson] of [['你', 1], ['马马虎虎', 1], ['中国', 2], ['宠物', 3], ['真', 2]] as const) it(`${hanzi} tiene una sola asignación L${lesson}`, () => {
    const word = vocabularyCatalog.find(word => word.hanzi === hanzi)!;
    expect(getVocabularyLesson(word)).toBe(lesson);
    expect(searchGlobalVocabulary(hanzi)[0]).toBe(word);
    for (const scope of ['l1', 'l2', 'l3'] as const) expect(getVocabularySet(scope).includes(word)).toBe(scope === `l${lesson}`);
  });
  it('busca globalmente con todas las variantes de mascota', () => {
    for (const query of ['宠物', 'chǒngwù', 'chongwu', 'chong wu', 'chong3wu4', 'mascota']) expect(searchGlobalVocabulary(query)[0]).toBe(pet);
  });
  it('真 incluye frases L2 y L3, prioriza pinyin y no duplica evidencias', () => {
    const word = vocabularyCatalog.find(word => word.hanzi === '真')!;
    const examples = examplesForWord(word);
    expect(examples[0]).toMatchObject({ hanzi: '真厉害！', lessons: [2] });
    expect(examples.some(example => example.hanzi === '这张照片真漂亮！' && example.lessons.includes(3))).toBe(true);
    expect(examples[0].pinyin).toBeTruthy();
    expect(new Set(examples.map(example => example.id)).size).toBe(examples.length);
  });
  it('solo ofrece relaciones léxicas positivas sin huecos ni ejercicios abiertos', () => {
    for (const word of accumulatedVocabulary) for (const example of examplesForWord(word)) {
      const phrase = corpus.phrases.find(phrase => phrase.id === example.id)!;
      expect(phrase.vocabIds).toContain(word.id);
      expect(phrase.kinds.some(kind => ['counterexample', 'distractor', 'exercise_premise', 'true_false_premise', 'grammar_transformation', 'dialogue_exercise', 'writing_prompt', 'interview_prompt'].includes(kind))).toBe(false);
      expect(example.hanzi).not.toMatch(/[_＿□…]|\.{3}|[（(]\s*[)）]/u);
    }
    for (const hanzi of ['你', '我', '好']) {
      const examples = examplesForWord(vocabularyCatalog.find(word => word.hanzi === hanzi)!);
      expect(new Set(examples.flatMap(example => example.lessons)).size).toBeGreaterThan(1);
    }
  });
  it('retira tarjetas futuras fuera de la partición sin borrar historial ni progreso', () => {
    const ni = vocabularyCatalog.find(word => word.hanzi === '你')!;
    const china = vocabularyCatalog.find(word => word.hanzi === '中国')!;
    const old = { ...startMix([ni, china], 5, 'l2', 'hard', {}, 'old', 0, () => 0), revealed: true };
    const migrated = reconcileMixSession(old, new Set(getVocabularySet('l2').map(word => word.id)));
    expect(migrated.queue.map(card => card.wordId)).toEqual([china.id]);
    expect(migrated.revealed).toBe(false);
    expect(migrated.events).toBe(old.events);
    expect(reconcileMixSession(migrated, new Set(getVocabularySet('l2').map(word => word.id)))).toBe(migrated);
  });
});
