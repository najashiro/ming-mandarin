// Offline audit of every sentence actually shown on vocabulary card reverses.
// This script never generates or publishes audio.
import { existsSync, readFileSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Execute the real adapters, including their aliases and lesson precedence,
// instead of maintaining a second copy of vocabulary/audio selection rules.
function loadApplicationModule(entry) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    if (extname(filename) === '.json') {
      const exports = JSON.parse(readFileSync(filename, 'utf8'));
      cache.set(filename, { exports });
      return exports;
    }
    const record = { exports: {} };
    cache.set(filename, record);
    const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
      fileName: filename.replace(/\.mjs$/, '.ts'),
    }).outputText;
    const nativeRequire = createRequire(filename);
    const localRequire = specifier => {
      if (!specifier.startsWith('@/') && !specifier.startsWith('.')) return nativeRequire(specifier);
      const base = specifier.startsWith('@/') ? resolve(root, specifier.slice(2)) : resolve(dirname(filename), specifier);
      const target = [base, `${base}.ts`, `${base}.tsx`, `${base}.json`, resolve(base, 'index.ts')].find(existsSync);
      if (!target) throw new Error(`Cannot resolve ${specifier} from ${filename}`);
      return load(target);
    };
    vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename })(localRequire, record, record.exports);
    return record.exports;
  }
  return load(resolve(root, entry));
}

// Match the resolver's strict spelling repairs, retaining tones and syllables.
const readingKey = (text, pinyin) => JSON.stringify([
  text.normalize('NFC').replace(/[^\u3400-\u9fff]/g, ''),
  pinyin.normalize('NFC').toLowerCase().replace(/ɡ/g, 'g').replace(/ὺ/g, 'ù')
    .normalize('NFD').replace(/([aeiou])\u0306/g, '$1\u030c').normalize('NFC')
    .replace(/[\s'’ʼ.,!?]/g, ''),
]);

export async function auditVocabularyExampleAudio({ signal = false } = {}) {
  const vocabulary = loadApplicationModule('lib/vocabulary.ts');
  const { audioForMandarinText } = loadApplicationModule('lib/mandarin-audio.ts');
  const examples = new Map();
  const wordsWithExamples = new Set();
  function add(words, selection, isMix = false) {
    const selectedKeys = new Set();
    for (const word of words) {
      for (const example of vocabulary.examplesForVocabularyCard(word)) {
        wordsWithExamples.add(word.id);
        const key = readingKey(example.hanzi, example.pinyin);
        selectedKeys.add(key);
        if (!examples.has(key)) examples.set(key, {
          hanzi: example.hanzi, pinyin: example.pinyin,
          ids: new Set(), phraseIds: new Set(), wordIds: new Set(), lessonIds: new Set(), selections: new Set(), mixEligible: false,
        });
        const row = examples.get(key);
        row.ids.add(example.id);
        row.phraseIds.add(example.phraseId);
        row.wordIds.add(word.id);
        for (const lesson of example.lessons) row.lessonIds.add(lesson);
        row.selections.add(selection);
        row.mixEligible ||= isMix;
      }
    }
    return [...selectedKeys].map(key => examples.get(key));
  }
  add(vocabulary.vocabularyCatalog, 'catalog');
  const byScope = vocabulary.vocabularyMixScopes.map(scope => {
    const selected = add(vocabulary.getVocabularySet(scope), `${scope}:vocabulary`);
    add(vocabulary.getVocabularySet(scope, 'basic'), `${scope}:basic`);
    const selectedMix = add(vocabulary.getVocabularyMixSet(scope), `${scope}:mix`, true);
    // Saved Mix sessions render the active-catalog word by ID.
    const mixIds = new Set(vocabulary.getVocabularyMixSet(scope).map(word => word.id));
    const renderedMix = add(vocabulary.vocabularyCatalog.filter(word => mixIds.has(word.id)), `${scope}:mix-rendered`, true);
    const mix = [...new Map([...selectedMix, ...renderedMix].map(row => [readingKey(row.hanzi, row.pinyin), row])).values()];
    return {
      scope, examples: selected.length, mixExamples: mix.length,
      missing: selected.filter(example => !audioForMandarinText(example.hanzi, example.pinyin)).map(({ hanzi, pinyin }) => ({ hanzi, pinyin })),
      mixMissing: mix.filter(example => !audioForMandarinText(example.hanzi, example.pinyin)).map(({ hanzi, pinyin }) => ({ hanzi, pinyin })),
    };
  });
  const rows = [...examples.values()].map(row => ({
    ...row, ids: [...row.ids].sort(), phraseIds: [...row.phraseIds].sort(), wordIds: [...row.wordIds].sort(),
    lessonIds: [...row.lessonIds].sort(), selections: [...row.selections].sort(),
  }));
  const missing = [];
  const files = new Map();
  for (const example of rows) {
    const src = example.pinyin ? audioForMandarinText(example.hanzi, example.pinyin) : undefined;
    if (!src) { missing.push(example); continue; }
    if (!files.has(src)) files.set(src, { src, examples: [] });
    files.get(src).examples.push({ hanzi: example.hanzi, pinyin: example.pinyin, ids: example.ids, wordIds: example.wordIds });
  }
  const brokenFiles = [];
  for (const clip of files.values()) {
    if (!/^\/audio\/[a-z0-9/-]+\.mp3$/.test(clip.src)) {
      brokenFiles.push({ src: clip.src, reason: 'Unexpected static audio path' });
      continue;
    }
    const file = resolve(root, 'public', clip.src.slice(1));
    if (!existsSync(file) || !statSync(file).isFile()) {
      brokenFiles.push({ src: clip.src, reason: 'Missing MP3 file' });
      continue;
    }
    const bytes = readFileSync(file);
    clip.bytes = bytes.length;
    clip.sha256 = createHash('sha256').update(bytes).digest('hex');
    if (bytes.length < 1024) brokenFiles.push({ src: clip.src, reason: 'Empty or truncated MP3 file', bytes: bytes.length });
  }

  const signalResults = [];
  if (signal) {
    const { chromium } = await import('@playwright/test');
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.evaluate(() => { window.audioAuditContext = new AudioContext(); });
      const broken = new Set(brokenFiles.map(clip => clip.src));
      for (const clip of files.values()) {
        if (broken.has(clip.src)) continue;
        const encoded = readFileSync(resolve(root, 'public', clip.src.slice(1))).toString('base64');
        const result = await page.evaluate(async bytes => {
          try {
            const buffer = await window.audioAuditContext.decodeAudioData(Uint8Array.from(atob(bytes), c => c.charCodeAt(0)).buffer);
            let power = 0;
            let peak = 0;
            let active = 0;
            const count = buffer.length * buffer.numberOfChannels;
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
              for (const sample of buffer.getChannelData(channel)) {
                power += sample * sample;
                peak = Math.max(peak, Math.abs(sample));
                if (Math.abs(sample) > 0.01) active++;
              }
            }
            const rms = Math.sqrt(power / count);
            const activeRatio = active / count;
            return {
              decoded: true, duration: buffer.duration, rms, peak, activeRatio,
              audible: buffer.duration >= 0.2 && rms >= 0.002 && peak >= 0.005 && activeRatio >= 0.01,
            };
          } catch {
            return { decoded: false, audible: false };
          }
        }, encoded);
        signalResults.push({ src: clip.src, ...result });
      }
      await page.evaluate(() => window.audioAuditContext.close());
    } finally {
      await browser.close();
    }
  }
  return {
    schema_version: 1,
    source: 'examplesForVocabularyCard for the active catalog, every lesson/accumulated vocabulary set and actual Mix cards; exact-reading resolver',
    totalWords: vocabulary.vocabularyCatalog.length,
    wordsWithExamples: wordsWithExamples.size,
    uniqueExamples: rows.length,
    mixUniqueExamples: rows.filter(row => row.mixEligible).length,
    uniqueAudioFiles: files.size,
    missing, brokenFiles, byScope,
    examples: rows,
    files: [...files.values()],
    signal: { checked: signal, total: signalResults.length, failures: signalResults.filter(result => !result.audible), results: signalResults },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = await auditVocabularyExampleAudio({ signal: process.argv.includes('--signal') });
  for (const [flag, data] of [['--output', report], ['--missing-output', report.missing]]) {
    const index = process.argv.indexOf(flag);
    if (index === -1) continue;
    if (!process.argv[index + 1] || process.argv[index + 1].startsWith('--')) throw new Error(`${flag} requires a path`);
    const output = resolve(process.argv[index + 1]);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, `${JSON.stringify(data, null, 2)}\n`);
  }
  console.log(JSON.stringify({
    totalWords: report.totalWords, wordsWithExamples: report.wordsWithExamples,
    uniqueExamples: report.uniqueExamples, mixUniqueExamples: report.mixUniqueExamples,
    uniqueAudioFiles: report.uniqueAudioFiles, missing: report.missing.length,
    mixMissing: report.missing.filter(example => example.mixEligible).length,
    brokenFiles: report.brokenFiles,
    byScope: report.byScope.map(({ scope, examples, mixExamples, missing, mixMissing }) => ({ scope, examples, mixExamples, missing: missing.length, mixMissing: mixMissing.length })),
    signalChecked: report.signal.checked, signalTotal: report.signal.total, signalFailures: report.signal.failures,
  }, null, 2));
  if (process.argv.includes('--check') && (report.missing.length || report.brokenFiles.length || report.signal.failures.length)) process.exitCode = 1;
}
