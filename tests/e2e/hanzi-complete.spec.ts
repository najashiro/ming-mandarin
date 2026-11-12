import { expect, test, type Page } from '@playwright/test';
import audit from '../../docs/hanzi-engine-audit.json' with { type: 'json' };

async function observeAudio(page: Page) {
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.Audio = function(src?: string) {
      const audio = new NativeAudio(src);
      (window as typeof window & { hanziAudio?: HTMLAudioElement }).hanziAudio = audio;
      return audio;
    } as unknown as typeof Audio;
  });
}

async function playCharacter(page: Page, hanzi: string, source: string) {
  await page.getByRole('button', { name: `Escuchar pronunciación de ${hanzi}`, exact: true }).click();
  await expect.poll(() => page.evaluate(() => {
    const audio = (window as typeof window & { hanziAudio?: HTMLAudioElement }).hanziAudio;
    return audio && audio.currentTime > 0 && !audio.error ? new URL(audio.src).pathname : null;
  })).toBe(source);
  await page.evaluate(() => (window as typeof window & { hanziAudio?: HTMLAudioElement }).hanziAudio?.pause());
}

test('边 aparece por pinyin, por carácter, por enlace directo y dentro de las palabras', async ({ page }) => {
  await page.goto('/study/l6/hanzi');
  const search = page.getByRole('combobox', { name: 'Busca por pinyin', exact: true });
  await search.fill('bian');
  await page.getByRole('option').filter({ hasText: '边' }).click();
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '边');
  await expect(page.locator('.hanzi-pronunciation-row h2')).toHaveText('biān');
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue('l6');
  await expect(page.locator('.hanzi-reference-card.selected')).toContainText('边');
  await page.getByRole('tab', { name: 'Palabras y frases', exact: true }).click();
  await expect(page.locator('.hanzi-context')).toContainText('北边');
  await page.getByRole('link', { name: 'Abrir ficha Hanzi de 边', exact: true }).first().click();
  await expect(page.getByRole('tab', { name: 'Aprender', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.reload();
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '边');
  await page.goto('/study/l6/hanzi?character=边');
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '边');
  await search.fill('左');
  await page.getByRole('option').filter({ hasText: '左' }).click();
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '左');
});

for (const route of ['/study/l6/hanzi', '/lesson/1/hanzi']) {
  test(`旁 muestra palabras y una sola frase por tarjeta en ${route}`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(route);
    await page.getByRole('combobox', { name: 'Busca por pinyin', exact: true }).fill('pang');
    await page.getByRole('option').filter({ hasText: '旁' }).click();
    await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '旁');
    await expect(page.locator('.hanzi-pronunciation-row h2')).toHaveText('páng');
    await page.getByRole('tab', { name: 'Palabras y frases', exact: true }).click();

    const cards = page.locator('.hanzi-context article');
    await expect(cards.filter({ has: page.locator('.context-hanzi-text', { hasText: /^旁边$/ }) })).toHaveCount(1);
    const sentence = cards.filter({ has: page.locator('.context-hanzi-text', { hasText: /^食堂旁边是办公楼。$/ }) });
    await expect(sentence).toHaveCount(1);
    await expect(sentence.locator('.context-pinyin')).toHaveText('Shítáng pángbiān shì bàngōnglóu.');
    await expect(sentence.locator('small')).toHaveText('Al lado del comedor está el edificio de oficinas.');
    await expect(page.locator('.hanzi-context')).not.toContainText('我们学校的食堂在校门右边');

    for (const card of await cards.all()) {
      const hanzi = (await card.locator('.context-hanzi-text').textContent())!;
      expect(hanzi).toContain('旁');
      expect(hanzi.match(/\p{Script=Han}/gu)!.length).toBeLessThanOrEqual(30);
      expect(hanzi.split(/[。！？!?]+/u).filter(text => text.trim())).toHaveLength(1);
      for (const selector of ['.context-pinyin', 'small']) {
        const text = (await card.locator(selector).textContent())!;
        expect(text.split(/[.!?]+/u).filter(part => part.trim())).toHaveLength(1);
      }
      expect(await card.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.locator('.components-panel').screenshot({ path: info.outputPath(`pang-${route.includes('/study/') ? 'study' : 'legacy'}-phrases.png`) });

    await page.getByRole('link', { name: 'Abrir ficha Hanzi de 边', exact: true }).first().click();
    await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '边');
    await expect(page.getByRole('tab', { name: 'Aprender', exact: true })).toHaveAttribute('aria-selected', 'true');
    expect(errors).toEqual([]);
  });
}

test('左 y 边 tienen reproducción real con su lectura, nombres de trazos y práctica', async ({ page }, info) => {
  await observeAudio(page);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const hanzi of ['左', '边']) {
    const record = audit.inventory.find(row => row.hanzi === hanzi)!;
    await page.goto(`/study/l6/hanzi?character=${encodeURIComponent(hanzi)}`);
    await playCharacter(page, hanzi, record.audio);
    await page.getByRole('tab', { name: 'Trazos', exact: true }).click();
    await expect(page.locator('.stroke-name-list li')).toHaveCount(record.strokeCount);
    for (const stroke of await page.locator('.stroke-name-list li b').all()) expect(await stroke.textContent()).toMatch(/\p{Script=Han}/u);
    await page.getByRole('tab', { name: 'Practicar', exact: true }).click();
    await page.getByRole('button', { name: 'Comenzar', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Mantén para ver respuesta' })).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.locator('.practice-panel').screenshot({ path: info.outputPath(`${hanzi}-practice.png`) });
  }
  expect(errors).toEqual([]);
});

test('consultar 边 no escribe progreso curricular y cambiar a 左 conserva su ID', async ({ page }) => {
  const attempts: Array<{ characterId: string }> = [];
  await page.route('**/api/hanzi/practice', route => {
    attempts.push(route.request().postDataJSON());
    return route.fulfill({ status: 401, json: {} });
  });
  await page.goto('/study/l6/hanzi?character=边&tab=Trazos');
  await page.getByRole('button', { name: 'Ya entiendo el orden' }).click();
  await expect(page.locator('.hanzi-save-message')).toContainText('no se guarda como progreso del curso');
  expect(attempts).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('ming-hanzi-progress-v1'))).toBeNull();
  await page.getByRole('combobox', { name: 'Busca por pinyin' }).fill('zuo3');
  await page.getByRole('option').filter({ hasText: '左' }).click();
  await page.getByRole('tab', { name: 'Trazos', exact: true }).click();
  await page.getByRole('button', { name: 'Ya entiendo el orden' }).click();
  await expect.poll(() => attempts.map(row => row.characterId)).toEqual(['c-左']);
  await expect(page.locator('.hanzi-save-message')).toContainText('Progreso guardado en este dispositivo');
});

test('las palabras documentadas siguen visibles si falla la descarga de trazos', async ({ page }) => {
  await page.route('**/hanzi-data/**', route => route.fulfill({ status: 503, body: '' }));
  await page.goto('/study/l6/hanzi?character=边&tab=Palabras%20y%20frases');
  await expect(page.locator('.hanzi-context')).toContainText('北边');
});

test('auditoría real: las 378 fichas abren sus trazos y reproducen el audio correcto', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'Full inventory on desktop; regression cases also run on mobile and iPhone.');
  test.setTimeout(360_000);
  await observeAudio(page);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/study/l6/hanzi');
  const search = page.getByRole('combobox', { name: 'Busca por pinyin' });
  let checked = 0;
  for (const record of audit.inventory) {
    await search.fill(record.hanzi);
    await page.locator('#hanzi-pinyin-options').getByRole('option').click();
    await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', record.hanzi);
    await expect(page.locator('.hanzi-pronunciation-row h2')).toHaveText(record.pinyin);
    await expect(page.locator('.hanzi-character-meaning')).toHaveText(record.meaning);
    await expect(page.locator(`.hanzi-writer-target[aria-label="Área de escritura para ${record.hanzi}"] svg`)).toHaveCount(1);
    await playCharacter(page, record.hanzi, record.audio);
    checked++;
    if (checked % 50 === 0) console.log(`Hanzi inventory: ${checked}/${audit.inventory.length}`);
  }
  expect(checked).toBe(378);
  expect(errors).toEqual([]);
});
