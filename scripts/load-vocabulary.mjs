import { readFile } from 'node:fs/promises';
import ts from 'typescript';
// Execute the application's actual selection adapter in offline resource reports.
export async function loadVocabulary() {
  const corpus = await readFile('data/corpus-v21-public.json', 'utf8');
  const curriculum = await readFile('seed/curriculum.ts', 'utf8');
  const from = curriculum.indexOf('export const scopeDefinitions:');
  const to = curriculum.indexOf('\n};', from) + 3;
  const source = (await readFile('lib/vocabulary.ts', 'utf8'))
    .replace("import corpus from '@/data/corpus-v21-public.json';", `const corpus = ${corpus};`)
    .replace("import { scopeDefinitions } from '@/seed/curriculum';", curriculum.slice(from, to));
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
