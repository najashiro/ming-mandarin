import { expect, test } from '@playwright/test';

async function openGame(page: import('@playwright/test').Page, id: string) {
  await page.locator(`[data-game="${id}"]`).getByRole('button',{name:/Jugar/}).click();
  await expect(page.locator('.new-game-shell')).toBeVisible();
}
for (const width of [320,375,390,430,1366]) test(`cinco experiencias sin desbordes a ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({width,height:844});
  await page.goto('/study/l3/games');
  await expect(page.locator('.game-grid article')).toHaveCount(5);
  await expect(page.locator('.game-grid article').first()).toContainText('Reto Mixto');
  for (const id of ['escena-viva','conversacion','hanzi-lab','historia-detective']) {
    await openGame(page,id);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const buttons = await page.locator('.new-game-shell button:visible').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
    expect(buttons.every(height => height >= 43)).toBe(true);
    if (id === 'conversacion') {
      await expect(page.locator('.dialogue-bubble').first()).toHaveCSS('color','rgb(35, 72, 63)');
      await expect(page.locator('.dialogue-bubble .font-hanzi').first()).toHaveCSS('font-family',/Noto|Songti|SimSun/);
    }
    await page.locator('.new-game-shell').screenshot({style:'.topbar,.mobile-nav{visibility:hidden!important}',path:info.outputPath(`${id}-${width}.png`)});
    await page.locator('.new-game-shell').getByRole('button',{name:'Cerrar',exact:true}).click();
  }
  await page.locator('.ming-games-grid').screenshot({style:'.topbar,.mobile-nav{visibility:hidden!important}',path:info.outputPath(`hub-${width}.png`)});
});
test('Hanzi Lab valida trazos reales y conserva progreso local anterior', async ({ page }) => {
  await page.route('**/api/hanzi/practice', route => route.fulfill({status:401,contentType:'application/json',body:'{}'}));
  await page.goto('/study/l1/games?unit=1.1');
  await page.evaluate(() => localStorage.setItem('ming-hanzi-progress-v1',JSON.stringify({'c-保:writing':{attempts:7,completed:6,mistakes:1}})));
  await openGame(page,'hanzi-lab');
  await page.getByRole('button',{name:'Escritura',exact:true}).click();
  const start = page.getByRole('button',{name:'Escribir con dedo o ratón'});
  await expect(start).toBeEnabled();
  await start.click();
  const target = page.locator('.hanzi-writer-target');
  const character = (await target.getAttribute('aria-label'))!.replace('Área de escritura para ','');
  const response = await page.request.get(`/hanzi-data/${encodeURIComponent(character)}.json`);
  const data = await response.json() as {medians: Array<Array<[number,number]>>};
  const group = target.locator('svg g[transform]').first();
  await group.scrollIntoViewIfNeeded();
  await target.evaluate(element => element.scrollIntoView({block:'center',behavior:'instant'}));
  for (const [strokeIndex,median] of data.medians.entries()) {
    const points = await group.evaluate((element,stroke) => {
      const transform = (element as SVGGraphicsElement).getScreenCTM()!;
      return stroke.map(([x,y]) => { const point = new DOMPoint(x,y).matrixTransform(transform); return {x:point.x,y:point.y}; });
    },median);
    for (let index=0;index<points.length;index++) {
      await page.mouse.move(points[index].x,points[index].y);
      if (index === 0) await page.mouse.down();
    }
    await page.mouse.up();
    await expect(page.locator('.stroke-progress')).toContainText(`Trazos reconocidos: ${strokeIndex + 1} /`);
  }
  await expect(page.locator('.game-feedback')).toBeVisible();
  await expect.poll(() => page.evaluate((hanzi) => JSON.parse(localStorage.getItem('ming-hanzi-progress-v1') || '{}')[`c-${hanzi}:writing`]?.completed,character)).toBe(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ming-hanzi-progress-v1') || '{}')['c-保:writing'].attempts)).toBe(7);
});
test('bloques por toque, producción, evidencia y modos Hanzi son interactivos', async ({ page, isMobile }) => {
  await page.goto('/study/l3/games');
  await openGame(page,'escena-viva');
  await page.getByRole('button',{name:/Construir/}).click();
  const token = page.locator('.blocks-tray button').first();
  if (isMobile) await token.tap(); else await token.click();
  await expect(page.locator('.blocks-target button')).toHaveCount(1);
  await page.locator('.blocks-target button').click();
  await expect(page.locator('.blocks-target button')).toHaveCount(0);
  await page.getByRole('button',{name:/Producir/}).click();
  await page.getByRole('textbox',{name:'Tu respuesta'}).fill('我家有四口人');
  await page.getByRole('button',{name:'Comprobar',exact:true}).click();
  await expect(page.locator('.game-feedback.correct')).toBeVisible();
  await expect(page.locator('.game-feedback a').first()).toHaveAttribute('href',/character=.+&focus=glyph/);
  await page.getByRole('button',{name:'Cerrar',exact:true}).click();
  await openGame(page,'conversacion');
  await page.getByRole('checkbox').check();
  await expect(page.locator('.dialogue-stage')).toContainText('我家有四口人');
  await page.getByRole('button',{name:'Cerrar',exact:true}).click();
  await openGame(page,'historia-detective');
  await page.locator('.story-panels button').filter({hasText:'我家有四口人'}).click();
  await expect(page.locator('.game-feedback.correct')).toBeVisible();
  await page.getByRole('button',{name:'Cerrar',exact:true}).click();
  await openGame(page,'hanzi-lab');
  await page.getByRole('button',{name:'Revelado',exact:true}).click();
  await expect(page.getByRole('button',{name:/Revelar otro trazo/})).toBeVisible();
  await page.getByRole('button',{name:'Escritura',exact:true}).click();
  await expect(page.getByRole('button',{name:'Escribir con dedo o ratón'})).toBeEnabled();
  await page.getByRole('button',{name:'Escribir con dedo o ratón'}).click();
  await expect(page.locator('.hanzi-focal svg').first()).toBeVisible();
});
test('audio por gesto y fallos Safari no bloquean; repaso conserva fichas y velocidades', async ({ page }) => {
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked','NotAllowedError')); });
  await page.goto('/study/l1/games');
  await openGame(page,'hanzi-lab');
  await page.getByRole('button',{name:'Escuchar carácter oculto'}).click();
  await expect(page.locator('.audio-button.unavailable')).toBeVisible();
  await page.getByRole('button',{name:'Cerrar',exact:true}).click();
  await page.locator('.study-tools summary').click();
  await page.getByRole('button',{name:'Voltear flashcard'}).click();
  await page.getByRole('combobox').selectOption('0.7');
  await expect(page.getByRole('combobox')).toHaveValue('0.7');
});
