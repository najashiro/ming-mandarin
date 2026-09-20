import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import typescript from 'typescript';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const compile=(source)=>typescript.transpileModule(source,{compilerOptions:{module:typescript.ModuleKind.ESNext,target:typescript.ScriptTarget.ES2022}}).outputText;
const asDataUrl=(source)=>`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;

/** Execute the same TypeScript answer engine used by the game, without copying its rules. */
export async function loadTimeGame() {
  const dataSource=await readFile(join(root,'data','time-game.ts'),'utf8');
  const dataUrl=asDataUrl(compile(dataSource));
  const gameSource=(await readFile(join(root,'lib','time-game.ts'),'utf8')).replace("'@/data/time-game'",`'${dataUrl}'`);
  return Promise.all([import(asDataUrl(compile(gameSource))),import(dataUrl)]);
}
