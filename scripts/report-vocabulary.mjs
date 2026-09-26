import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { loadVocabulary } from './load-vocabulary.mjs';
const json = async path => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
const corpus = await json('data/corpus-v21-public.json');
const knowledge = await json('MING_KNOWLEDGE/index.json');
const { selectVocabulary, examplesForScope, getVocabularySet, getVocabularyLesson, scopeDefinitions } = await loadVocabulary();
const resources = await json('docs/vocabulary-resources.json');
const media = await json('data/vocabulary-media.json');
const hanzi = await json('data/lesson1-hanzi.json');
const extra = await json('data/vocabulary-hanzi.json');
const candidates = new Set([...hanzi.units.flatMap(u => [...u.core, ...u.teacherExtension, ...u.support]), ...extra.map(e => e.hanzi), ...['分', '零', '半', '刻', '差']]);
const manifest = await json('public/hanzi-data/manifest.json');
const glyphs = new Set([...candidates].filter(glyph => manifest[glyph]?.available && existsSync(`public/hanzi-data/${glyph}.json`)));
const counts = {};
for (const scope of Object.keys(scopeDefinitions)) {
  const words = selectVocabulary(scope);
  counts[scope] = { new: selectVocabulary(scope, 'new').length, supplementary: selectVocabulary(scope, 'supplementary').length, context: selectVocabulary(scope, 'context').length, reviewBasic: selectVocabulary(scope, 'review', 'basic').length, reviewHard: words.length, pendingClassification: selectVocabulary(scope, 'pending').length,
    withDocumentedExample: words.filter(w => examplesForScope(w, scope).length).length,
    withCompleteExample: words.filter(w => examplesForScope(w, scope).some(e => e.pinyin && e.spanish)).length,
    withImage: words.filter(w => media.some(m => m.wordId === w.id && m.status === 'approved')).length,
    withAudio: words.filter(w => resources.resources.some(r => r.entryIds.includes(w.id) && r.status.startsWith('available'))).length,
    withAllHanziLinks: words.filter(w => [...w.hanzi].every(c => !/^\p{Script=Han}$/u.test(c) || glyphs.has(c))).length };
}
const exclusiveCatalog = Object.fromEntries(['l1', 'l2', 'l3', 'l1-l2-l3'].map(scope => [scope, { total: getVocabularySet(scope).length, basic: getVocabularySet(scope, 'basic').length, ids: getVocabularySet(scope).map(word => word.id) }]));
const canonicalLessons = Object.fromEntries(getVocabularySet('l1-l2-l3').map(word => [word.id, getVocabularyLesson(word)]));
const pendingClassification = selectVocabulary('l1-l2-l3', 'pending').map(w => ({ id: w.id, hanzi: w.hanzi, roles: w.roles }));
const missingHanzi = [...new Set(corpus.vocabulary.flatMap(w => [...w.hanzi]))].filter(c => /^\p{Script=Han}$/u.test(c) && !glyphs.has(c));
const report = { corpusFingerprint: corpus.fingerprint, publishedVocabulary: corpus.vocabulary.length, sourceVocabulary: knowledge.stats.vocabulary_entries, note: `${knowledge.stats.vocabulary_entries - corpus.vocabulary.length} registros fuente carecen de pinyin o español documentado; no se publican como tarjetas completas. Las clasificaciones pendientes se conservan en este informe, fuera de las tarjetas.`, counts, exclusiveCatalog, canonicalLessons, pendingClassification, missingHanzi, audio: resources.counters, images: { pilot: media.length, approved: media.filter(m => m.status === 'approved' && m.src && existsSync(`public${m.src}`)).length, pending: media.filter(m => m.status !== 'approved').length } };
const publishedIds = new Set(corpus.vocabulary.map(word => word.id));
report.images.orphanedIds = media.filter(row => !publishedIds.has(row.wordId)).map(row => row.wordId);
report.images.missingFiles = media.filter(row => row.src && !existsSync(`public${row.src}`)).map(row => row.wordId);
report.images.withoutImage = corpus.vocabulary.filter(word => !media.some(row => row.wordId === word.id && row.status === 'approved' && row.src && existsSync(`public${row.src}`))).map(word => word.id);
report.audioMissing = resources.resources.filter(row => !row.status.startsWith('available')).map(({ input, entryIds, kind, status }) => ({ input, entryIds, kind, status }));
report.hanziDocumentedWithoutRuntime = corpus.hanzi.filter(row => (row.writingSourceEvidence || row.worksheetEvidence) && !glyphs.has(row.hanzi)).map(row => row.hanzi);
report.hanziMissingByWord = corpus.vocabulary.map(word => ({ id: word.id, glyphs: [...new Set([...word.hanzi])].filter(glyph => /^\p{Script=Han}$/u.test(glyph) && !glyphs.has(glyph)) })).filter(row => row.glyphs.length);
await writeFile('docs/vocabulary-coverage.json' , JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
