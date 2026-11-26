import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { loadApplicationModule } from '../../scripts/lib/load-application-module.mjs';

const lesson6: typeof import('../../data/lesson6-public.json') = JSON.parse(readFileSync(new URL('../../data/lesson6-public.json', import.meta.url), 'utf8'));
const { audioForMandarinText } = loadApplicationModule('lib/mandarin-audio.ts') as { audioForMandarinText: (text: string, pinyin: string) => string | undefined };

test('L6: cada turno de diálogo reproduce su MP3 sin audios pendientes', async ({ page }, info) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const loadedSources = new Set<string>();
  page.on('response', response => {
    const pathname = new URL(response.url()).pathname;
    if (pathname.startsWith('/audio/') && response.ok()) loadedSources.add(pathname);
  });
  await page.goto('/study/l6/dialogues');
  const turns = lesson6.dialogues.flatMap(dialogue => dialogue.turns);
  await expect(page.locator('.dialogue-turn')).toHaveCount(turns.length);
  await expect(page.locator('.dialogue-turn .audio-button')).toHaveCount(turns.length);
  await expect(page.locator('.dialogue-audio-pending')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('Audio pendiente');

  const expectedSources = new Set<string>();
  for (const dialogue of lesson6.dialogues) {
    for (const turn of dialogue.turns) {
      const row = page.locator(`[id="turn-${dialogue.id}-${turn.turn}"]`);
      const source = audioForMandarinText(turn.hanzi, turn.pinyin)!;
      expect(source, `${dialogue.id}:${turn.turn}`).toBeTruthy();
      expectedSources.add(source);
      await expect(row.locator('.dialogue-turn-text')).toHaveText(turn.hanzi);
      const button = row.getByRole('button', { name: `Audio: ${turn.hanzi}`, exact: true });
      await button.click();
      // This class is set by the native audio element's playing event. Playback
      // is real: no replacement of Audio, play(), or the response body.
      await expect(row.locator('.audio-button')).toHaveClass(/\bplaying\b/);
      await row.getByRole('button', { name: `Detener: ${turn.hanzi}`, exact: true }).click();
      await expect(button).toBeVisible();
      await expect(row.locator('.audio-button.error')).toHaveCount(0);
    }
  }
  for (const source of expectedSources) {
    expect(loadedSources.has(source), `El navegador cargó ${source}`).toBe(true);
    const response = await page.request.get(source);
    expect(response.ok(), source).toBe(true);
    expect(response.headers()['content-type'], source).toContain('audio/');
    expect((await response.body()).length, source).toBeGreaterThan(1024);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: info.outputPath('lesson6-dialogue-audio.png'), fullPage: true });
  expect(errors).toEqual([]);
});
