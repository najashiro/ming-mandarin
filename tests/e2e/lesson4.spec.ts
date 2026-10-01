import { test, expect } from '@playwright/test';
import media from '../../data/lesson4-media.json' with { type: 'json' };

test('L4: nuevas fotografías y diagramas se muestran en tarjetas móviles', async ({ page }, info) => {
  test.setTimeout(60_000);
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: media }));
  for (const [width, word] of [[320,'v-跑步'],[390,'v-午饭'],[390,'v-明天'],[390,'v-刻'],[430,'v-起床']] as const) {
    await page.setViewportSize({width,height:844});
    await page.goto(`/study/l4/vocabulary?card=${encodeURIComponent(word)}`);
    await page.waitForLoadState('networkidle');
    const card=page.locator('.vocabulary-card');
    await expect(card).toHaveCount(1);
    await expect(card.locator('img')).toBeVisible();
    await expect.poll(()=>card.locator('img').evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth>0)).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    await card.screenshot({path:info.outputPath(`${width}-${word}.png`)});
  }
});

test('L4: reto mixto incluye imágenes y construcción, y retira aprobaciones ocultas', async ({ page }, info) => {
  test.setTimeout(60_000);
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: media }));
  await page.addInitScript(() => { Math.random = () => .42; });
  await page.goto('/study/l4/games');
  await page.waitForLoadState('networkidle');
  await page.locator('[data-game="reto-mixto"]').getByRole('button', { name: /Jugar/ }).click();
  await page.getByRole('button', { name: 'Comenzar reto', exact: true }).click();
  const seen=new Set<string>();
  for(let i=0;i<5;i++) {
    seen.add((await page.locator('.mixed-progress-head .eyebrow').textContent())!);
    const images=page.locator('.mixed-prompt-image img, .mixed-image-options img');
    if(await images.count()) {
      await expect.poll(()=>images.first().evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth>0)).toBe(true);
      await page.screenshot({path:info.outputPath(`l4-mixed-${i}.png`),fullPage:true});
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    if(await page.locator('.mixed-token-bank').count()) {
      while(await page.locator('.mixed-token-bank button').count()) await page.locator('.mixed-token-bank button').first().click();
      await page.getByRole('button',{name:'Comprobar',exact:true}).click();
    } else await page.locator('.mixed-text-options button, .mixed-image-options button').first().click();
    await page.getByRole('button',{name:'Continuar →',exact:true}).click();
  }
  expect(seen.size).toBeGreaterThanOrEqual(4);
  expect([...seen].some(mode=>mode.includes('imagen')||mode.includes('Imagen'))).toBe(true);
  expect(seen.has('Construir respuesta')).toBe(true);
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: [] }));
  await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await expect(page.locator('.mixed-prompt-image img, .mixed-image-options img')).toHaveCount(0);
});

test('L4: navegación, módulos, diálogos canónicos y regresión L1–L3', async ({ page }) => {
  test.setTimeout(60_000);
  async function visit(path: string) {
    await page.goto(path);
    // Let prefetches settle before deliberately replacing the whole document.
    await page.waitForLoadState('networkidle');
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await visit('/');
  await expect(page.getByRole('heading', { name: 'Lección 4', exact: true })).toBeVisible();
  await page.locator('a[href="/study/l4"]').click();
  await page.waitForURL('**/study/l4');
  await page.waitForLoadState('networkidle');
  for (const section of ['vocabulary','dialogues','grammar','hanzi','readings','exercises','radicals','games','exam']) {
    await visit(`/study/l4/${section}`);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('main')).not.toContainText('Application error');
    await expect(page.locator('body')).not.toContainText(/source_refs|lesson4_selection|grammar_id|phrase_evidence_id/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }
  await visit('/study/l4/dialogues');
  await expect(page.locator('.dialogue-turn')).toHaveCount(27);
  await expect(page.getByRole('heading', { name: '4.1 你几点有课？' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '4.2 你们班有多少人？' })).toBeVisible();
  await visit('/study/l4/readings');
  await expect(page.locator('.corpus-dialogue')).toHaveCount(6);
  await visit('/study/l4/exercises');
  await expect(page.locator('details')).toHaveCount(62);
  for (const lesson of [1,2,3]) {
    await visit(`/study/l${lesson}/vocabulary`);
    await expect(page.locator('.vocabulary-card').first()).toBeVisible();
    await visit(`/study/l${lesson}/dialogues`);
    expect(await page.locator('.dialogue-turn').count()).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test('L4: audio real, imagen transparente, fallback y cambio de lección', async ({ page }, info) => {
  // Model the existing approved-media endpoint; no production DB writes.
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: media }));
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.Audio = function(src?: string) {
      const audio = new NativeAudio(src);
      (window as typeof window & { lastStudyAudio?: HTMLAudioElement }).lastStudyAudio = audio;
      return audio;
    } as unknown as typeof Audio;
  });
  await page.goto('/study/l4/vocabulary?card=v-%E7%94%B5%E8%A7%86');
  await page.waitForLoadState('networkidle');
  const card = page.locator('.vocabulary-card');
  await expect(card).toHaveCount(1);
  await expect(card.locator('img')).toBeVisible();
  await expect.poll(() => card.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await card.getByRole('button', { name: 'Escuchar: 电视', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { lastStudyAudio?: HTMLAudioElement }).lastStudyAudio?.currentTime ?? 0)).toBeGreaterThan(0);
  await page.screenshot({ path: `test-results/lesson4-${info.project.name}.png`, fullPage: true });
  const imageSrc = await card.locator('img').getAttribute('src');
  expect(imageSrc).toContain('television');
  await page.route('**/images/vocabulary/lesson4/television.webp*', route => route.abort());
  await page.reload();
  await expect(card).toBeVisible();
  await expect(card.locator('img')).toHaveCount(0);
  await expect(card).toContainText('televisión; TV');
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l3');
  await expect(page).toHaveURL(/\/study\/l3\/vocabulary/);
  await expect(page.locator('.vocabulary-card').first()).toBeVisible();
  await page.goto(`/study/l4/vocabulary?card=${encodeURIComponent('v-睡觉')}`);
  await expect(card.locator('img')).toBeVisible();
  await expect.poll(() => card.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: `test-results/lesson4-sleep-${info.project.name}.png`, fullPage: true });
});
