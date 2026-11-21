// Offline audit of the same vocabulary selections and exact-reading resolver
// used by the application. This script never generates or publishes audio.
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export function loadApplicationModule(entry) {
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
