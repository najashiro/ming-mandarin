#!/usr/bin/env node
// Build a compact grammar-only learner index from existing runtime/corpus data.
// TypeScript loading is build-time only; the browser never imports curriculum.ts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Module, { createRequire } from 'node:module';
const load = createRequire(import.meta.url);
const ts = load('typescript');
const root = fileURLToPath(new URL('..', import.meta.url));
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...args);
};
load.extensions['.ts'] = function (module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  module._compile(output.outputText, filename);
};
const { getCurriculum } = load(path.join(root, 'seed/curriculum.ts'));
const curriculum = getCurriculum('l1-l2-l3-l4-l5-l6');
const { grammarGuides } = load(path.join(root, 'data/grammar-guides.ts'));
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const reference = read('data/lesson4-study-reference.json');
const support = read('data/grammar-language-support.json');
const grammar = curriculum.grammar.map(point => reference.grammar.find(item => item.id === point.id) ?? point);
const exercises = curriculum.exercises.filter(exercise => exercise.dimension === 'grammar');
const key = text => text.normalize('NFC').replace(/[\s，。！？、,.!?：:；;（）()“”「」"'‘’…]/g, '');
const readings = new Map();
const wordKeys = new Set();
function add(entry, word = false) {
  const spanish = entry.spanish ?? entry.translation;
  if (!entry.hanzi || !entry.pinyin || !spanish) return;
  readings.set(key(entry.hanzi), { hanzi: entry.hanzi, pinyin: entry.pinyin, spanish });
  if (word) wordKeys.add(key(entry.hanzi));
}
for (const filename of ['lessons123', 'lesson4', 'lesson5', 'lesson6']) {
  const source = read(`data/${filename}-public.json`);
  for (const entry of source.vocabulary) add(entry, true);
  for (const entry of source.phrases) add(entry);
}
for (const entry of curriculum.vocabulary) add(entry, true);
for (const entry of curriculum.sentences) add(entry);
function collectAnnotated(value, preserveExisting = false) {
  if (Array.isArray(value)) { value.forEach(entry => collectAnnotated(entry, preserveExisting)); return; }
  if (!value || typeof value !== 'object') return;
  if (!preserveExisting || !value.hanzi || !readings.has(key(value.hanzi))) add(value);
  Object.values(value).forEach(entry => collectAnnotated(entry, preserveExisting));
}
collectAnnotated(reference.grammar);
collectAnnotated(reference.bookReference.topics);
collectAnnotated(reference.bookReference.radicals, true);
for (const entry of support.readings) add(entry, !/[。！？?!.→]/u.test(entry.hanzi));
// Whole row annotations remain available as written, alongside per-cell vocabulary.
for (const point of grammar) for (const block of point.studyBlocks ?? []) {
  block.rows?.forEach((row, index) => {
    const aid = block.rowAids?.[index];
    if (aid) add({ hanzi: row.join(''), ...aid });
  });
}
function* strings(value) {
  if (typeof value === 'string') yield value;
  else if (Array.isArray(value)) { for (const entry of value) yield* strings(entry); }
  else if (value && typeof value === 'object') for (const [field, entry] of Object.entries(value)) {
    if (!['source', 'id', 'slug', 'continuationOf', 'href', 'characterDetails'].includes(field)) yield* strings(entry);
  }
}
const requested = [...strings(grammar), ...strings(grammarGuides), ...strings(exercises), ...strings(curriculum.sentences), ...strings(reference.bookReference)];
// Keep lexical entries for complete audio segmentation; select only relevant phrases.
const selected = new Set(wordKeys);
const missing = new Set();
for (const text of requested) {
  if (readings.has(key(text))) selected.add(key(text));
  for (const [run] of text.matchAll(/\p{Script=Han}+/gu)) {
    let offset = 0;
    while (offset < run.length) {
      let match;
      for (let end = run.length; end > offset; end--) {
        const part = run.slice(offset, end);
        if (readings.has(part)) { match = part; break; }
      }
      if (match) { selected.add(match); offset += match.length; }
      else { missing.add(run); offset++; }
    }
    // Allow listening to recorded subphrases without deriving vocabulary relations.
    for (const candidate of readings.keys()) if (run.includes(candidate)) selected.add(candidate);
  }
}
// Reuse already-published L6 game recordings with their exact contextual readings.
const supplementalAudio = ['directions', 'hide-and-seek'].flatMap(folder =>
  read(`data/${folder}-audio.json`).clips.flatMap(clip => {
    const src = `/audio/${folder}/${clip.file}`;
    return clip.expectedPinyin && fs.existsSync(path.join(root, 'public', src))
      ? [{ hanzi: clip.input, pinyin: clip.expectedPinyin, src }] : [];
  }));
const output = {
  version: 1,
  supplementalAudio,
  readings: [...selected].sort().map(id => readings.get(id)),
  wordKeys: [...wordKeys].sort(),
  sentences: curriculum.sentences,
};
const serialized = JSON.stringify(output, null, 2) + '\n';
const target = path.join(root, 'data/grammar-study-language.json');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== serialized) {
    console.error('Grammar language index is stale. Run node scripts/prepare-grammar-language.mjs.');
    process.exitCode = 1;
  }
} else fs.writeFileSync(target, serialized);
console.log(JSON.stringify({ grammar: grammar.length, exercises: exercises.length, sentences: output.sentences.length, readings: output.readings.length, missingRuns: [...missing].sort() }));
if (missing.size) process.exitCode = 1;
