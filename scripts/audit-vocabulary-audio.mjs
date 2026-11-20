// Offline audit of the same vocabulary selections and exact-reading resolver
// used by the application. This script never generates or publishes audio.
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

const variantKey = word => JSON.stringify([word.id, word.hanzi, word.pinyin]);
const describeWord = word => ({ id: word.id, hanzi: word.hanzi, pinyin: word.pinyin, lessons: word.lessons });

export async function auditVocabularyAudio({ signal = false } = {}) {
  const vocabulary = loadApplicationModule('lib/vocabulary.ts');
  const { audioForMandarinText } = loadApplicationModule('lib/mandarin-audio.ts');
  const variants = new Map();
  const mixVariants = new Set();
  function add(words, selection, isMix = false) {
    for (const word of words) {
      const key = variantKey(word);
      if (!variants.has(key)) variants.set(key, { ...describeWord(word), selections: [] });
      variants.get(key).selections.push(selection);
      if (isMix) mixVariants.add(key);
    }
  }
  add(vocabulary.vocabularyCatalog, 'catalog');
  const byScope = vocabulary.vocabularyMixScopes.map(scope => {
    const words = vocabulary.getVocabularySet(scope);
    const basic = vocabulary.getVocabularySet(scope, 'basic');
    const mix = vocabulary.getVocabularyMixSet(scope);
    add(words, `${scope}:vocabulary`);
    add(basic, `${scope}:basic`);
    add(mix, `${scope}:mix`, true);
    return {
      scope, total: words.length, mixTotal: mix.length,
      missing: words.filter(word => !audioForMandarinText(word.hanzi, word.pinyin)).map(describeWord),
      mixMissing: mix.filter(word => !audioForMandarinText(word.hanzi, word.pinyin)).map(describeWord),
    };
  });
  const missing = [];
  const files = new Map();
  for (const [key, word] of variants) {
    const src = word.pinyin ? audioForMandarinText(word.hanzi, word.pinyin) : undefined;
    if (!src) {
      missing.push({ ...word, mixEligible: mixVariants.has(key) });
      continue;
    }
    if (!files.has(src)) files.set(src, { src, words: [] });
    files.get(src).words.push(describeWord(word));
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
    source: 'Active vocabulary catalog and all vocabulary/Mix scopes, resolved by audioForMandarinText with exact pinyin',
    totalWords: vocabulary.vocabularyCatalog.length,
    wordVariants: variants.size,
    mixWordVariants: mixVariants.size,
    uniqueAudioFiles: files.size,
    missing, brokenFiles, byScope,
    files: [...files.values()],
    signal: {
      checked: signal, total: signalResults.length,
      failures: signalResults.filter(result => !result.audible), results: signalResults,
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = await auditVocabularyAudio({ signal: process.argv.includes('--signal') });
  const outputIndex = process.argv.indexOf('--output');
  if (outputIndex !== -1) {
    if (!process.argv[outputIndex + 1] || process.argv[outputIndex + 1].startsWith('--')) throw new Error('--output requires a path');
    const output = resolve(process.argv[outputIndex + 1]);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(JSON.stringify({
    totalWords: report.totalWords, wordVariants: report.wordVariants, mixWordVariants: report.mixWordVariants,
    uniqueAudioFiles: report.uniqueAudioFiles, missing: report.missing.length,
    mixMissing: report.missing.filter(word => word.mixEligible).length,
    brokenFiles: report.brokenFiles,
    byScope: report.byScope.map(({ scope, total, mixTotal, missing, mixMissing }) => ({ scope, total, mixTotal, missing: missing.length, mixMissing: mixMissing.length })),
    signalChecked: report.signal.checked, signalTotal: report.signal.total, signalFailures: report.signal.failures,
  }, null, 2));
  if (process.argv.includes('--check') && (report.missing.length || report.brokenFiles.length || report.signal.failures.length)) process.exitCode = 1;
}
