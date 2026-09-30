import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
const manifest = JSON.parse(await readFile('data/lesson4-audio.json', 'utf8'));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];
try {
  for (const clip of manifest.clips) {
    const bytes = (await readFile(`public/audio/mandarin/${clip.file}`)).toString('base64');
    const result = await page.evaluate(async encoded => {
      const context = new AudioContext();
      try {
        const buffer = await context.decodeAudioData(Uint8Array.from(atob(encoded), c => c.charCodeAt(0)).buffer);
        const samples = buffer.getChannelData(0);
        const rms = Math.sqrt(samples.reduce((sum, v) => sum + v * v, 0) / samples.length);
        return { duration: buffer.duration, rms };
      } finally { await context.close(); }
    }, bytes);
    // Collect all failures before publishing, so regeneration can target exactly those clips.
    results.push({ id: clip.id, ...result });
  }
} finally { await browser.close(); }
await writeFile('docs/lesson4-audio-signal.json', JSON.stringify({ results }, null, 2) + '\n');
const failed = results.filter(row => row.duration < 0.2 || row.rms < 0.002);
await writeFile('docs/lesson4-audio-retry.json', JSON.stringify(failed.map(row => row.id)) + '\n');
if (failed.length) throw new Error(`Audio sin señal: ${failed.map(row => row.id).join(', ')}`);
if (process.argv.includes('--publish')) await writeFile('data/lesson4-audio-available.json', JSON.stringify({ files: manifest.clips.map(clip => clip.file) }, null, 2) + '\n');
console.log(`Decodificados y verificados: ${results.length}`);
