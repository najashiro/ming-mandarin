import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import sharp from 'sharp';

// Import an explicitly generated batch; this script makes no paid API calls.
const args = process.argv.slice(2);
const option = name => args[args.indexOf(name) + 1];
if (!args.includes('--queue') || !args.includes('--images')) {
  throw new Error('Usage: node scripts/import-vocabulary-image-revisions.mjs --queue <export.json> --images <PNG directory> [--write]');
}
const sha = value => createHash('sha256').update(value).digest('hex');
const queue = JSON.parse(readFileSync(resolve(option('--queue')), 'utf8'));
if (queue.schema_version !== 1 || !Array.isArray(queue.entries)) throw new Error('Unsupported queue');
const mediaPath = 'data/vocabulary-media.json';
const promptsPath = 'docs/vocabulary-image-prompts.json';
const manifestPath = 'docs/vocabulary-image-manifest.json';
const media = JSON.parse(readFileSync(mediaPath, 'utf8'));
const prompts = JSON.parse(readFileSync(promptsPath, 'utf8'));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const staged = [];
const seen = new Set();
for (const request of queue.entries) {
  if (seen.has(request.wordId)) throw new Error('Duplicate word in batch');
  seen.add(request.wordId);
  const entry = media.find(item => item.wordId === request.wordId);
  const prompt = prompts.entries.find(item => item.wordId === request.wordId);
  if (!entry || !prompt || prompt.visual_ming.visual_mode === 'none') throw new Error(`Unknown/ineligible word: ${request.wordId}`);
  if (entry.sha256 !== request.previous_asset_sha256) throw new Error(`Stale image batch: ${request.wordId}`);
  if (typeof request.prompt !== 'string' || request.prompt.length < 40 || request.prompt.length > 12000
    || sha(request.prompt) !== request.prompt_sha256) throw new Error(`Invalid prompt: ${request.wordId}`);
  if (typeof request.output !== 'string' || basename(request.output) !== request.output
    || !/^[a-f0-9-]+\.png$/.test(request.output)) throw new Error('Invalid output filename');
  const inputPath = join(resolve(option('--images')), request.output);
  const metadata = await sharp(inputPath).metadata();
  if (!metadata.hasAlpha) throw new Error(`Missing alpha: ${request.wordId}`);
  const raw = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const corners = [0,width-1,(height-1)*width,width*height-1];
  if (corners.some(pixel => raw.data[pixel*channels+channels-1] !== 0)) throw new Error(`Opaque background: ${request.wordId}`);
  let visible = 0;
  for (let i=channels-1; i<raw.data.length; i+=channels) if (raw.data[i]>128) visible++;
  if (visible < width*height*0.01) throw new Error(`Empty subject: ${request.wordId}`);
  const webp = await sharp(inputPath).resize(1618,1000,{fit:'contain',position:'east',background:{r:0,g:0,b:0,alpha:0}})
    .webp({quality:86,alphaQuality:100}).toBuffer();
  const hash = sha(webp);
  if (hash === entry.sha256) throw new Error(`Image has not changed: ${request.wordId}`);
  const filename = `vocab-${sha(request.wordId).slice(0,20)}-${hash.slice(0,16)}.webp`;
  const target = join('public/images/vocabulary', filename);
  if (existsSync(target) && sha(readFileSync(target)) !== hash) throw new Error('Asset collision');
  staged.push({ target, webp });
  Object.assign(entry,{ src:`/images/vocabulary/${filename}`,sha256:hash,promptSha256:request.prompt_sha256,
    width:1618,height:1000,status:'pending_review',review:'Nueva versión: requiere aprobación independiente en Administración.' });
  Object.assign(prompt,{prompt:request.prompt,prompt_sha256:request.prompt_sha256,public_output:filename,output:request.output});
}
if (args.includes('--write')) {
  // All inputs are validated before any file is written. Existing assets are retained.
  for (const item of staged) writeFileSync(item.target,item.webp);
  writeFileSync(mediaPath,`${JSON.stringify(media,null,2)}\n`);
  writeFileSync(promptsPath,`${JSON.stringify(prompts,null,2)}\n`);
  manifest.entries=media;
  writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);
}
console.log(JSON.stringify({validated:staged.length,written:args.includes('--write'),approval:'pending_review'}));
