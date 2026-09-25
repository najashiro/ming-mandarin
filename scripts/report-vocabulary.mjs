import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';
const json = async path => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
const corpus = await json('data/corpus-v21-public.json');
const knowledge = await json('MING_KNOWLEDGE/index.json');
const curriculum = await readFile('seed/curriculum.ts', 'utf8');
const from = curriculum.indexOf('export const scopeDefinitions:');
const to = curriculum.indexOf('\n};', from) + 3;
let source = await readFile('lib/vocabulary.ts', 'utf8');
source = source.replace("import corpus from '@/data/corpus-v21-public.json';", `const corpus = ${JSON.stringify(corpus)};`).replace("import { scopeDefinitions } from '@/seed/curriculum';", curriculum.slice(from, to));
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { selectVocabulary, examplesForScope, scopeDefinitions } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const resources = await json('docs/vocabulary-resources.json');
const media = await json('data/vocabulary-media.json');
const hanzi = await json('data/lesson1-hanzi.json');
const extra = await json('data/vocabulary-hanzi.json');
const glyphs = new Set([...hanzi.units.flatMap(u => [...u.core, ...u.teacherExtension, ...u.support]), ...extra.map(e => e.hanzi), ...['分', '零', '半', '刻', '差']]);
const counts = {};
for (const scope of Object.keys(scopeDefinitions)) {
  const words = selectVocabulary(scope);
  counts[scope] = { new: selectVocabulary(scope, 'new').length, context: selectVocabulary(scope, 'context').length, reviewBasic: selectVocabulary(scope, 'review', 'basic').length, reviewHard: words.length, pendingClassification: selectVocabulary(scope, 'pending').length,
    withDocumentedExample: words.filter(w => examplesForScope(w, scope).length).length,
    withCompleteExample: words.filter(w => examplesForScope(w, scope).some(e => e.pinyin && e.spanish)).length,
    withImage: words.filter(w => media.some(m => m.wordId === w.id && m.status === 'approved')).length,
    withAudio: words.filter(w => resources.resources.some(r => r.entryIds.includes(w.id) && r.status.startsWith('available'))).length,
    withAllHanziLinks: words.filter(w => [...w.hanzi].every(c => !/^\p{Script=Han}$/u.test(c) || glyphs.has(c))).length };
}
const pendingClassification = selectVocabulary('l1-l2-l3', 'pending').map(w => ({ id: w.id, hanzi: w.hanzi, roles: w.roles }));
const missingHanzi = [...new Set(corpus.vocabulary.flatMap(w => [...w.hanzi]))].filter(c => /^\p{Script=Han}$/u.test(c) && !glyphs.has(c));
const report = { corpusFingerprint: corpus.fingerprint, publishedVocabulary: corpus.vocabulary.length, sourceVocabulary: knowledge.stats.vocabulary_entries, note: `${knowledge.stats.vocabulary_entries - corpus.vocabulary.length} registros fuente carecen de pinyin o español documentado; no se publican como tarjetas completas. Las clasificaciones pendientes siguen consultables por su filtro.`, counts, pendingClassification, missingHanzi, audio: resources.counters, images: { pilot: media.length, approved: media.filter(m => m.status === 'approved').length, pending: media.filter(m => m.status !== 'approved').length } };
await writeFile('docs/vocabulary-coverage.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
