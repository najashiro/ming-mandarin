import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Read JSON explicitly: Playwright's Node ESM loader does not add JSON import attributes.
const dialogue = JSON.parse(readFileSync(new URL('../../data/rehearsals/oral-final.json', import.meta.url), 'utf8')) as { slug: string };
const manifest = JSON.parse(readFileSync(new URL('../../data/rehearsals/oral-final-audio.json', import.meta.url), 'utf8')) as { clips: Record<string, { src: string }> };
const route = `/ensayo/${dialogue.slug}`;

test('enlace directo, noindex, controles independientes y Hanzi', async ({ page }) => {
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  expect(response?.headers()['x-robots-tag']).toContain('noindex');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('.oral-rehearsal .dialogue-turn')).toHaveCount(29);
  await expect(page.locator('.oral-pinyin')).toHaveCount(29);
  await expect(page.locator('.oral-translation')).toHaveCount(29);
  await page.getByRole('checkbox', { name: 'Mostrar pinyin' }).uncheck();
  await expect(page.locator('.oral-pinyin')).toHaveCount(0);
  await expect(page.locator('.oral-translation')).toHaveCount(29);
  await page.getByRole('checkbox', { name: 'Mostrar traducción' }).uncheck();
  await expect(page.locator('.oral-translation')).toHaveCount(0);
  await expect(page.locator('.oral-hanzi')).toHaveCount(29);
  await page.getByRole('checkbox', { name: 'Mostrar pinyin' }).check();
  await expect(page.locator('.oral-pinyin')).toHaveCount(29);
  await expect(page.locator('.oral-translation')).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Mostrar traducción' }).check();
  const hanzi = page.locator('#oral-01 .oral-hanzi a').first();
  const href = await hanzi.getAttribute('href');
  expect(href).toContain('character=');
  expect(href).toContain(encodeURIComponent(`${route}#oral-01`));
  await expect(hanzi).toHaveAttribute('target', '_blank');
  expect(await page.locator('.oral-rehearsal').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await page.screenshot({ path: `test-results/oral-final-${test.info().project.name}.png`, fullPage: true });
});

test('todos los audios son MP3 estáticos, no se invoca la API al escuchar', async ({ page, request }) => {
  const entries = Object.values(manifest.clips);
  expect(entries).toHaveLength(29);
  for (const src of new Set(entries.map(clip => clip.src))) {
    const response = await request.get(src);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toMatch(/audio\//);
    expect((await response.body()).byteLength).toBeGreaterThan(512);
  }
  let paidCalls = 0;
  page.on('request', request => { if (request.url().includes('api.openai.com')) paidCalls++; });
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () { this.dispatchEvent(new Event('playing')); return Promise.resolve(); };
    HTMLMediaElement.prototype.pause = function () { this.dispatchEvent(new Event('pause')); };
  });
  await page.goto(route);
  const first = page.locator('#oral-01 .audio-button');
  const second = page.locator('#oral-02 .audio-button');
  await first.click();
  await expect(first).toHaveClass(/playing/);
  await second.click();
  await expect(first).not.toHaveClass(/playing/);
  await expect(second).toHaveClass(/playing/);
  await second.click();
  await expect(second).not.toHaveClass(/playing/);
  expect(paidCalls).toBe(0);
});

test('el navegador reproduce un MP3 real sin voz del dispositivo', async ({ page }) => {
  await page.addInitScript(() => {
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      (window as typeof window & { oralTestAudio?: HTMLMediaElement }).oralTestAudio = this;
      return originalPlay.call(this);
    };
  });
  await page.goto(route);
  await page.locator('#oral-17 .audio-button').click();
  await expect.poll(() => page.evaluate(() => {
    const audio = (window as typeof window & { oralTestAudio?: HTMLMediaElement }).oralTestAudio;
    return Boolean(audio && !audio.error && audio.currentTime > 0);
  })).toBe(true);
  expect(await page.evaluate(() => (window as typeof window & { oralTestAudio?: HTMLMediaElement }).oralTestAudio?.src)).toContain('/audio/oral-final/');
});

test('otras rutas no abren el guion y el inicio no enlaza al ensayo', async ({ page, request }) => {
  expect((await request.get('/ensayo/no-existe')).status()).toBe(404);
  await page.goto('/');
  await expect(page.locator(`a[href*="${dialogue.slug}"]`)).toHaveCount(0);
});
