import { expect, test } from '@playwright/test';

async function openGame(page: import('@playwright/test').Page, id: string) {
  await page.locator(`[data-game="${id}"]`).getByRole('button',{name:/Jugar/}).click();
  await expect(page.locator('.new-game-shell')).toBeVisible();
}
for (const width of [320,375,390,430,1366]) test(`siete experiencias sin desbordes a ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({width,height:844});
  await page.goto('/study/l3/games');
  await expect(page.locator('.game-grid article')).toHaveCount(7);
  await expect(page.locator('.game-grid article').first()).toContainText('Reto Mixto');
  for (const id of ['escena-viva','conversacion','hanzi-lab','historia-detective','hora']) {
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
test('hora: práctica construye respuesta y espera tras un error',async({page})=>{
  await page.goto('/study/l1/games');
  await openGame(page,'hora');
  await expect(page.locator('.time-start')).toContainText('现在几点？');
  await page.getByRole('button',{name:/Comenzar/}).click();
  await expect(page.locator('.time-clock')).toBeVisible();
  await expect(page.locator('.time-timer')).toHaveText('∞');
  await page.getByRole('button',{name:'Añadir 差'}).click();
  await page.getByRole('button',{name:/Confirmar/}).click();
  await expect(page.locator('.time-answer.incorrect')).toBeVisible();
  await expect(page.locator('.time-correction')).toContainText('Respuestas correctas');
  const firstClock=await page.locator('.time-clock').getAttribute('aria-label');
  await page.getByRole('button',{name:/Continuar/}).click();
  await expect(page.locator('.time-correction')).toHaveCount(0);
  expect(await page.locator('.time-clock').getAttribute('aria-label')).not.toBeNull();
  expect(firstClock).not.toBeNull();
});
test('hora: el interruptor HARD conserva una sola pista y mueve únicamente la perilla',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/study/l1/games');
  await openGame(page,'hora');
  const practice=page.getByRole('button',{name:/Practicar/});
  const toggle=page.getByRole('switch',{name:'Modo HARD'});
  const track=toggle.locator(':scope > .time-switch-track');
  const knob=track.locator(':scope > .time-switch-knob');
  await expect(toggle).toHaveCount(1);await expect(track).toHaveCount(1);await expect(knob).toHaveCount(1);
  await expect(toggle).toHaveAttribute('aria-checked','false');await expect(practice).toHaveAttribute('aria-pressed','true');
  const normal=await page.evaluate(([buttonSelector,trackSelector,knobSelector])=>{
    const button=document.querySelector(buttonSelector) as HTMLElement,track=document.querySelector(trackSelector) as HTMLElement,knob=document.querySelector(knobSelector) as HTMLElement;
    return {button:getComputedStyle(button).backgroundColor,track:getComputedStyle(track).backgroundColor,trackTransform:getComputedStyle(track).transform,trackBox:track.getBoundingClientRect().toJSON(),knobBox:knob.getBoundingClientRect().toJSON()};
  },['.time-hard-switch','.time-switch-track','.time-switch-knob']);
  expect(normal.button).toBe('rgba(0, 0, 0, 0)');expect(normal.track).toBe('rgb(57, 128, 94)');expect(normal.trackTransform).toBe('none');
  expect([normal.trackBox.width,normal.trackBox.height,normal.knobBox.width,normal.knobBox.height]).toEqual([52,28,20,20]);
  for(let index=0;index<10;index++)await toggle.click();
  await toggle.focus();await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-checked','true');await expect(practice).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.time-hard-label')).toBeVisible();
  const hard=await page.evaluate(()=>{const track=document.querySelector('.time-switch-track') as HTMLElement,knob=document.querySelector('.time-switch-knob') as HTMLElement;return {color:getComputedStyle(track).backgroundColor,trackTransform:getComputedStyle(track).transform,track:track.getBoundingClientRect().toJSON(),knob:knob.getBoundingClientRect().toJSON()};});
  expect(hard.color).toBe('rgb(184, 75, 66)');expect(hard.trackTransform).toBe('none');
  expect(hard.knob.x-hard.track.x).toBeCloseTo(28,0);expect(hard.knob.x+hard.knob.width).toBeLessThanOrEqual(hard.track.x+hard.track.width-3);
});
test('hora: las formas equivalentes aparecen en dos grupos de filas sin overflow',async({page})=>{
  await page.setViewportSize({width:320,height:844});await page.goto('/study/l1/games');await openGame(page,'hora');
  await page.getByRole('button',{name:/Comenzar/}).click();await page.getByRole('button',{name:'Abrir ayuda del juego de la hora'}).click();
  const groups=page.locator('.time-equivalent-group');await expect(groups).toHaveCount(2);
  await expect(groups.nth(0)).toContainText('09:30 · Las nueve y media');await expect(groups.nth(0).locator('li')).toHaveCount(2);
  await expect(groups.nth(1)).toContainText('09:45 · Las nueve y cuarenta y cinco');await expect(groups.nth(1).locator('li')).toHaveCount(3);
  await expect(page.locator('.time-equivalents')).not.toContainText('=');
  await expect(groups.nth(0)).toContainText('九点三十分');await expect(groups.nth(0)).toContainText('九点半');
  await expect(groups.nth(1)).toContainText('九点四十五分');await expect(groups.nth(1)).toContainText('九点三刻');await expect(groups.nth(1)).toContainText('差一刻十点');
  await expect(groups.locator('.time-hanzi-link')).toHaveCount(11);
  const rows=await groups.locator('li').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().toJSON()));
  for(let index=1;index<rows.length;index++)if(rows[index].x===rows[index-1].x)expect(rows[index].y).toBeGreaterThan(rows[index-1].y);
  expect(await page.locator('.time-help').evaluate(element=>element.scrollWidth<=element.clientWidth)).toBe(true);
  for(const text of ['九点三十分','九点半','九点四十五分','九点三刻','差一刻十点'])await expect(page.locator('.time-equivalents').getByRole('button',{name:`Escuchar ${text}`,exact:true})).toHaveCount(1);
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
  await expect(page.getByRole('button', { name: /No se pudo reproducir. Reintentar/ })).toBeVisible();
  await page.getByRole('button',{name:'Cerrar',exact:true}).click();
  await page.locator('.study-tools summary').click();
  await page.getByRole('button',{name:'Voltear flashcard'}).click();
  await page.getByRole('combobox').selectOption('0.7');
  await expect(page.getByRole('combobox')).toHaveValue('0.7');
});
