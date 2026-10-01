import { describe, it, expect } from 'vitest';
import { selectVocabulary, searchVocabulary, searchKey, vocabularyCatalog, examplesForScope, examplesForWord, getVocabularySet, getVocabularyLesson, accumulatedVocabulary, searchGlobalVocabulary, getVocabularyMixSet, vocabularyMixExcludedIds, vocabularyMixScopes } from '@/lib/vocabulary';
import { evaluateMix, startMix, mixStats } from '@/lib/vocabulary-review';
import { parseVocabularyState, vocabularyStorageKey } from '@/lib/vocabulary-storage';
import { availablePracticeTypes, imageForWord, vocabularyMedia } from '@/lib/vocabulary-media';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import corpus from '@/data/corpus-v21-public.json';
import { publicExamplesForVocabulary } from '@/lib/vocabulary-examples';
import { canonicalCharacters } from '@/seed/characters';
import { curriculumScopes } from '@/seed/curriculum';
import { existsSync } from 'node:fs';
const pet = vocabularyCatalog.find(w => w.hanzi === '宠物')!;
const makeSession = (words = [pet], requestedSize = 10, id = 'test', random = () => 0.5) => startMix({ words, requestedSize, scope: 'l3', userId: 'guest', id, now: 100, random });
describe('vocabulario activo: evidencia, búsqueda y recursos', () => {
  it('preserva el testigo exacto de 宠物 sin declararlo nuevo', () => {
    expect(pet.curriculumLinks).toContainEqual(expect.objectContaining({ lesson: 3, role: 'workbook_context', list_type: null }));
    expect(selectVocabulary('l3', 'supplementary')).not.toContain(pet);
    expect(selectVocabulary('l3', 'new')).not.toContain(pet);
    expect(selectVocabulary('l3', 'context', 'basic')).toContain(pet);
    expect(selectVocabulary('l1')).not.toContain(pet);
    // The new projection explicitly publishes this complete question as an example.
    expect(examplesForWord(pet).map(example => example.hanzi)).toEqual(['你们家有宠物吗？']);
  });
  for (const scope of curriculumScopes) it(`${scope}: Hard contiene Básico y no duplica IDs`, () => {
    const basic = selectVocabulary(scope, 'review', 'basic');
    const hard = selectVocabulary(scope, 'review', 'hard');
    expect(basic.every(w => hard.includes(w))).toBe(true);
    expect(new Set(hard.map(w => w.id)).size).toBe(hard.length);
    for (const word of hard) expect(word.curriculumLinks.some(link => scope.includes(`l${link.lesson}`))).toBe(true);
  });
  it('mantiene consultable todo el catálogo, incluidas clasificaciones pendientes', () => {
    expect(new Set([...selectVocabulary('l1-l2-l3'), ...selectVocabulary('l1-l2-l3', 'pending')].map(w => w.id)).size).toBe(vocabularyCatalog.filter(word => word.lessons.some(lesson => lesson < 4)).length);
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
  it('publica imágenes permitidas y nunca habilita quiz para apoyo contextual', () => {
    for (const media of vocabularyMedia.filter(m => m.status === 'approved')) {
      expect(vocabularyCatalog.some(w => w.id === media.wordId)).toBe(true);
      expect(existsSync(`public${media.src}`)).toBe(true);
    }
    for (const word of vocabularyCatalog.filter(word => word.visual_ming.visual_mode === 'none')) expect(imageForWord(word.id)).toBeUndefined();
    expect(vocabularyMedia.filter(media => media.status === 'approved')).toHaveLength(62);
    expect(imageForWord(vocabularyCatalog.find(word => word.hanzi === '真')!.id)).toBeUndefined();
    for (const hanzi of ['猫', '饺子', '中国', '老师']) expect(imageForWord(vocabularyCatalog.find(word => word.hanzi === hanzi)!.id)).toBeDefined();
    for (const word of vocabularyCatalog.filter(word => !word.visual_ming.image_quiz_eligible)) expect(availablePracticeTypes(word)).not.toContain('image');
  });
  it('abre 宠 y 物 como consultas sin inventar destinos para otros glifos', () => {
    for (const character of pet.hanzi) expect(resolveHanziGlyph(character)).toMatchObject({ kind: 'supplementary', character });
    expect(resolveHanziGlyph('宠物').kind).toBe('unavailable');
  });
  it('no mezcla lecturas distintas en audio', () => {
    expect(audioForMandarinText('好', 'hǎo')).toBeTruthy();
    expect(audioForMandarinText('好', 'hào')).toBeUndefined();
    expect(audioForMandarinText('宠物', pet.pinyin)).toBeTruthy();
    expect(audioForMandarinText('宠物', 'chóngwù')).toBeUndefined();
  });
});
describe('autoevaluación finita y persistencia', () => {
  it('impide evaluar antes de revelar y no duplica eventos', () => {
    const session = makeSession();
    const turn = { sessionId: session.id, index: 0, wordId: pet.id };
    expect(evaluateMix(session, {}, true, 100, turn).session.answers).toHaveLength(0);
    const result = evaluateMix({ ...session, revealed: true }, {}, true, 100, turn);
    expect(result.progress['v-宠物:hanzi'].due).toBe(100 + 86400000);
    expect(evaluateMix({ ...session, revealed: true }, result.progress, true, 100, turn).progress).toBe(result.progress);
    expect(evaluateMix({ ...session, revealed: true }, {}, true, 100, { ...turn, sessionId: 'old' }).session).toEqual({ ...session, revealed: true });
    expect(mixStats(result.session)).toEqual({ responded: 1, correct: 1, incorrect: 0, total: 1, percentage: 100, incorrectIds: [] });
  });
  it('una ronda fija registra una sola respuesta por palabra sin reinsertar fallos', () => {
    let state = { session: makeSession(vocabularyCatalog.slice(0, 5), 5), progress: {} };
    const originalDeck = [...state.session.deck];
    while (state.session.index < state.session.deck.length) {
      const index = state.session.index;
      const wordId = state.session.deck[index];
      state = evaluateMix({ ...state.session, revealed: true }, state.progress, false, index, { sessionId: state.session.id, index, wordId });
    }
    expect(state.session.deck).toEqual(originalDeck);
    expect(state.session.answers).toHaveLength(5);
    expect(mixStats(state.session)).toMatchObject({ responded: 5, incorrect: 5, total: 5 });
  });
  it('no crea bucles con una sola palabra ni falla con almacenamiento corrupto', () => {
    const s = makeSession([pet], 10, 'single', () => 0);
    expect(s.deck).toEqual([pet.id]);
    for (const raw of ['null', '{}', '{broken', '{"version":1,"sessions":{"l3":{"queue":false}}}']) expect(parseVocabularyState(raw).sessions).toEqual({});
    expect(vocabularyStorageKey('a')).not.toBe(vocabularyStorageKey('b'));
  });
  it('baraja Fisher–Yates sin mutar, usa todo el conjunto y evita la secuencia anterior', () => {
    const words = vocabularyCatalog.slice(0, 6);
    const before = words.map(word => word.id);
    const first = makeSession(words, 3, 'first', () => 0);
    expect(words.map(word => word.id)).toEqual(before);
    expect(new Set(first.deck).size).toBe(3);
    expect(first.deck.some(id => !before.slice(0, 3).includes(id))).toBe(true);
    const collision = startMix({ words, requestedSize: 3, scope: 'l3', userId: 'guest', id: 'second', now: 101, random: () => 0, previousSequence: first.deck });
    expect(collision.deck).not.toEqual(first.deck);
    expect(collision.id).not.toBe(first.id);
  });
  it('limita el total real, resuelve el caso de una posición y no consulta progreso due', () => {
    const words = vocabularyCatalog.slice(0, 3);
    const capped = makeSession(words, 50, 'capped', () => 0.9);
    expect(capped.actualSize).toBe(3);
    expect(capped.deck).toHaveLength(3);
    const first = startMix({ words, requestedSize: 1, scope: 'l1', userId: 'guest', id: 'one-a', now: 1, random: () => 0 });
    const second = startMix({ words, requestedSize: 1, scope: 'l1', userId: 'guest', id: 'one-b', now: 2, random: () => 0, previousSequence: first.deck });
    expect(second.deck).not.toEqual(first.deck);
    expect(startMix.toString()).not.toContain('.due');
  });
  it('serializa el mazo, marcador, revelado y pausa sin persistir el giro', () => {
    const session = { ...makeSession(vocabularyCatalog.slice(0, 3), 3, 'persisted'), revealed: true, paused: true };
    const state = parseVocabularyState(JSON.stringify({ version: 2, favorites: [pet.id], hideTranslation: false, faces: {}, progress: {}, sessions: { l3: session }, lastSequences: { l3: session.deck }, legacyMixNotice: false }));
    expect(state.sessions.l3).toEqual(session);
    expect(state.sessions.l3.deck).toEqual(session.deck);
    expect(state.sessions.l3.revealed).toBe(true);
    expect(state.sessions.l3.paused).toBe(true);
    expect(state.sessions.l3).not.toHaveProperty('back');
    expect(state.lastSequences.l3).toEqual(session.deck);
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
  it('migra el formato anterior conservando caras, favoritos y progreso, sin reinterpretar su sesión', () => {
    const legacySession = { id: 'before-sync', scope: 'l3', level: 'basic', queue: [{ wordId: pet.id, type: 'hanzi' }], index: 0, revealed: true, paused: false, events: [] };
    const progress = { 'v-宠物:hanzi': { due: 500, streak: 2, attempts: 3, lastEvent: 'old:0' } };
    const state = parseVocabularyState(JSON.stringify({ version: 1, favorites: [pet.id], faces: { [pet.id]: true }, sessions: { l3: legacySession }, progress }));
    expect(state.sessions).toEqual({});
    expect(state.legacyMixNotice).toBe(true);
    expect(state.progress).toEqual(progress);
    expect(state.favorites).toEqual([pet.id]);
    expect(state.faces[pet.id]).toBe(true);
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
  it('真 conserva el orden público, incluye L2 y L3 y no duplica evidencias', () => {
    const word = vocabularyCatalog.find(word => word.hanzi === '真')!;
    const examples = examplesForWord(word);
    expect(examples).toContainEqual(expect.objectContaining({ hanzi: '真厉害！', lessons: [2] }));
    expect(examples.map(example => example.id)).toEqual(word.examplePhraseIds);
    expect(examples.some(example => example.hanzi === '这张照片真漂亮！' && example.lessons.includes(3))).toBe(true);
    expect(examples[0].pinyin).toBeTruthy();
    expect(new Set(examples.map(example => example.id)).size).toBe(examples.length);
  });
  it('usa relaciones pedagógicas publicadas sin contraejemplos, huecos o duplicados', () => {
    for (const word of accumulatedVocabulary) for (const example of examplesForWord(word)) {
      const phrase = corpus.phrases.find(phrase => phrase.id === example.id)!;
      expect(phrase.exampleVocabIds).toContain(word.id);
      expect(word.examplePhraseIds).toContain(phrase.id);
      expect(phrase.kinds).not.toContain('counterexample');
      expect(example.hanzi).not.toMatch(/[_＿□…]|\.{3}|[（(]\s*[)）]/u);
    }
    for (const hanzi of ['你', '我', '好']) {
      const examples = examplesForWord(vocabularyCatalog.find(word => word.hanzi === hanzi)!);
      expect(new Set(examples.flatMap(example => example.lessons)).size).toBeGreaterThan(1);
    }
  });
  it('猫 recorre sus tres ejemplos completos sin modificar vínculos léxicos', () => {
    const cat = vocabularyCatalog.find(word => word.hanzi === '猫')!;
    const before = JSON.stringify(corpus.phrases.map(phrase => phrase.vocabIds));
    const examples = examplesForWord(cat);
    expect(examples.map(example => example.hanzi)).toEqual(['一只猫', '你有小猫吗？', '我有两只小猫，他们很可爱。']);
    expect(examples.every(example => example.pinyin && example.spanish)).toBe(true);
    expect(examples.map(example => example.id)).toEqual(publicExamplesForVocabulary(cat.id).map(example => example.id));
    expect(corpus.phrases.find(phrase => phrase.id === examples[1].id)!.vocabIds).not.toContain(cat.id);
    expect(JSON.stringify(corpus.phrases.map(phrase => phrase.vocabIds))).toBe(before);
    expect(getVocabularyLesson(cat)).toBe(3);
  });
  it('todas las fichas consumen apoyo público completo y ejemplos únicos', () => {
    expect(vocabularyCatalog).toHaveLength(391);
    expect(vocabularyCatalog.filter(word => word.lessons.some(lesson => lesson < 4))).toHaveLength(337);
    expect(corpus.phrases).toHaveLength(635);
    for (const word of vocabularyCatalog) {
      expect(word.pinyin && word.spanish).toBeTruthy();
      const examples = examplesForWord(word);
      expect(new Set(examples.map(example => example.id)).size).toBe(examples.length);
      expect(examples.every(example => example.pinyin && example.spanish)).toBe(true);
    }
    expect(['l1', 'l2', 'l3', 'l1-l2-l3'].map(scope => getVocabularySet(scope as 'l1').length)).toEqual([85, 126, 116, 327]);
  });
  it('define cinco alcances elegibles sin nombres personales y conserva lugares, palabras completas y monosílabos', () => {
    expect(vocabularyMixScopes).toEqual(['l1', 'l2', 'l3', 'l4', 'l1-l2', 'l1-l2-l3', 'l1-l2-l3-l4']);
    const sets = Object.fromEntries(vocabularyMixScopes.map(scope => [scope, getVocabularyMixSet(scope)]));
    expect((['l1','l2','l3','l1-l2','l1-l2-l3'] as const).map(scope => sets[scope].length)).toEqual([68, 122, 110, 190, 300]);
    for (const words of Object.values(sets)) expect(new Set(words.map(word => word.id)).size).toBe(words.length);
    expect(sets.l2.map(word => word.id)).not.toEqual(sets['l1-l2'].map(word => word.id));
    for (const hanzi of ['马大为', '张华', '约翰', '陈']) expect(sets['l1-l2-l3'].some(word => word.hanzi === hanzi)).toBe(false);
    for (const hanzi of ['中国', '美国', '北京', '上海', '你', '我', '米饭']) expect(sets['l1-l2-l3'].some(word => word.hanzi === hanzi)).toBe(true);
    expect(sets['l1-l2-l3'].some(word => word.hanzi === '米')).toBe(Boolean(getVocabularySet('l1-l2-l3').find(word => word.hanzi === '米') && !vocabularyMixExcludedIds.has(vocabularyCatalog.find(word => word.hanzi === '米')!.id)));
    expect(sets['l1-l2-l3'].some(word => word.hanzi === '饭')).toBe(Boolean(getVocabularySet('l1-l2-l3').find(word => word.hanzi === '饭') && !vocabularyMixExcludedIds.has(vocabularyCatalog.find(word => word.hanzi === '饭')!.id)));
    expect(sets['l1-l2-l3'].find(word => word.hanzi === '米饭')?.hanzi).toBe('米饭');
    expect(sets['l1-l2-l3'].some(word => !imageForWord(word.id))).toBe(true);
  });
});
