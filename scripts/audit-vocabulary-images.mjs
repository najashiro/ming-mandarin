// Audit the application's real corpus, media precedence and Mix selection offline.
// No API calls or review-storage changes are performed by this script.
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Transpile and execute local TypeScript modules so this audit cannot silently
// fall behind changes to getVocabularyMixSet or media catalog ordering.
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
      fileName: filename,
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

export function auditVocabularyImages() {
  const vocabulary = loadApplicationModule('lib/vocabulary.ts');
  const { vocabularyMedia, imageForWord } = loadApplicationModule('lib/vocabulary-media.ts');
  const sizes = JSON.parse(readFileSync(resolve(root, 'data/vocabulary-image-sizes.json'), 'utf8')).entries;
  const scopes = vocabulary.vocabularyMixScopes;
  const allMix = new Map(scopes.flatMap(scope => vocabulary.getVocabularyMixSet(scope)).map(word => [word.id, word]));
  const shortWord = word => ({ id: word.id, hanzi: word.hanzi, pinyin: word.pinyin, spanish: word.spanish, lessons: word.lessons, visual_ming: word.visual_ming });
  const missing = vocabulary.vocabularyCatalog.filter(word => !imageForWord(word.id)).map(word => ({
    ...shortWord(word), mixEligible: allMix.has(word.id), media: vocabularyMedia.find(entry => entry.wordId === word.id) ?? null,
  }));
  const brokenLocalPaths = [];
  const hashMismatches = [];
  const brokenResponsivePaths = [];
  const checked = new Set();
  for (const media of vocabularyMedia.filter(entry => entry.status === 'approved' && entry.src)) {
    const pathname = media.src.split('?')[0];
    if (!pathname.startsWith('/') || checked.has(pathname)) continue;
    checked.add(pathname);
    const file = resolve(root, 'public', pathname.slice(1));
    if (!existsSync(file)) brokenLocalPaths.push({ id: media.wordId, src: media.src });
    else if (media.sha256 && createHash('sha256').update(readFileSync(file)).digest('hex') !== media.sha256) hashMismatches.push({ id: media.wordId, src: media.src });
    for (const variant of sizes[pathname]?.variants ?? []) {
      if (!existsSync(resolve(root, 'public', variant.src.slice(1)))) brokenResponsivePaths.push({ id: media.wordId, src: variant.src });
    }
  }
  const byScope = scopes.map(scope => {
    const words = vocabulary.getVocabularyMixSet(scope);
    return { scope, total: words.length, withImages: words.filter(word => imageForWord(word.id)).length,
      missing: words.filter(word => !imageForWord(word.id)).map(shortWord) };
  });
  return {
    schema_version: 1,
    source: 'active corpus, imageForWord and getVocabularyMixSet from application modules; local files only',
    totalWords: vocabulary.vocabularyCatalog.length,
    mediaEntries: vocabularyMedia.length,
    withImages: vocabulary.vocabularyCatalog.length - missing.length,
    withoutImages: missing.length,
    mixWords: allMix.size,
    mixWithoutImages: [...allMix.values()].filter(word => !imageForWord(word.id)).length,
    brokenLocalPaths, hashMismatches, brokenResponsivePaths, byScope, missing,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = auditVocabularyImages();
  const outputIndex = process.argv.indexOf('--output');
  if (outputIndex !== -1) {
    if (!process.argv[outputIndex + 1]) throw new Error('--output requires a path');
    const output = resolve(process.argv[outputIndex + 1]);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(JSON.stringify({
    totalWords: report.totalWords, withImages: report.withImages, withoutImages: report.withoutImages,
    mixWords: report.mixWords, mixWithoutImages: report.mixWithoutImages,
    brokenLocalPaths: report.brokenLocalPaths, hashMismatches: report.hashMismatches,
    brokenResponsivePaths: report.brokenResponsivePaths,
    byScope: report.byScope.map(({ scope, total, withImages, missing }) => ({ scope, total, withImages, missing: missing.length })),
  }, null, 2));
  if (process.argv.includes('--check') && (report.withoutImages || report.mixWithoutImages || report.brokenLocalPaths.length || report.hashMismatches.length || report.brokenResponsivePaths.length)) process.exitCode = 1;
}
