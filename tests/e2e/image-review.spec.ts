import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => { await request.post('http://127.0.0.1:4401/reset'); });
test('lesson filter combines with search and review status', async ({ page, context }) => {
  await context.addCookies([{name:'ming_access_token',value:'image-review-test-admin',url:'http://localhost:3103'}]);
  const {entries} = await (await context.request.get('/api/admin/vocabulary-images')).json();
  await page.goto('/admin/images');
  for (const lesson of [1,2,3,4]) {
    await page.getByLabel('Filtrar por lección').selectOption(String(lesson));
    const expected=entries.filter((entry: {lessons:number[]})=>entry.lessons.includes(lesson));
    await expect(page.getByRole('article')).toHaveCount(expected.length);
    const word=expected[0];
    await page.getByLabel('Buscar palabra').fill(word.wordId);
    await expect(page.getByRole('article',{name:`Revisión de ${word.hanzi}`,exact:true})).toBeVisible();
    await page.getByLabel('Buscar palabra').fill('');
  }
  await page.getByLabel('Filtrar por lección').selectOption('all');
  await expect(page.getByRole('article')).toHaveCount(entries.length);
});
test('review, reload, public visibility, prompt queue and hide', async ({ page, context, browser }, info) => {
  await page.setViewportSize({width:390,height:844});
  await context.addCookies([{name:'ming_access_token',value:'image-review-test-admin',url:'http://localhost:3103'}]);
  await page.goto('/admin/images');
  await page.getByLabel('Buscar palabra').fill('进');
  const card=page.getByRole('article',{name:'Revisión de 进',exact:true});
  await expect(card.locator('header > span')).toHaveText('Pendiente');
  await card.getByRole('button',{name:'✓ Okay',exact:true}).click();
  await expect(card.locator('header > span')).toHaveText('Okay');
  await page.reload();
  await page.getByLabel('Buscar palabra').fill('进');
  await expect(card.locator('header > span')).toHaveText('Okay');
  await page.screenshot({path:info.outputPath('approved-mobile.png'),fullPage:true});
  const guest=await browser.newContext();
  const learner=await guest.newPage();
  await learner.goto('http://localhost:3103/study/l1-l2-l3/vocabulary?q=%E8%BF%9B');
  const publicCard=learner.getByRole('article',{name:'Ficha de 进',exact:true});
  await expect(publicCard.locator('img')).toBeVisible();
  await card.getByLabel('Modificar prompt').check();
  await card.getByRole('textbox',{name:'¿Qué quieres cambiar en la imagen?'}).fill('Mostrar a la persona entrando por la puerta.');
  await expect(card.getByRole('button',{name:'Actualizar prompt'})).toBeVisible();
  await card.getByRole('button',{name:'Actualizar prompt'}).click();
  await expect(card.locator('header > span')).toHaveText('Por regenerar');
  await expect(card).toContainText('Mostrar a la persona entrando por la puerta.');
  await expect(card.getByRole('button',{name:'✓ Okay'})).toBeDisabled();
  const exported=await context.request.get('/api/admin/vocabulary-images?export=regeneration');
  expect((await exported.json()).entries[0].wordId).toBe('v-进');
  await learner.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await expect(publicCard.locator('img')).toHaveCount(0);
  await page.reload();await page.getByLabel('Buscar palabra').fill('进');
  await expect(card.locator('header > span')).toHaveText('Por regenerar');
  await card.getByRole('button',{name:'No mostrar imagen'}).click();
  await expect(card.locator('header > span')).toHaveText('No mostrar');
  await page.reload();await page.getByLabel('Buscar palabra').fill('进');
  await expect(card.getByRole('button',{name:'No mostrar',exact:true})).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await guest.close();
});

test('anonymous access is denied; outage disables editing and hides images', async ({ page, request, context }) => {
  expect((await request.get('/api/admin/vocabulary-images')).status()).toBe(401);
  expect((await request.post('/api/admin/vocabulary-images',{data:{action:'approve'}})).status()).toBe(401);
  await page.goto('/admin/images');await expect(page).toHaveURL(/admin\/login/);
  await context.addCookies([{name:'ming_access_token',value:'image-review-test-admin',url:'http://localhost:3103'}]);
  await request.post('http://127.0.0.1:4401/offline',{data:{offline:true}});
  await page.goto('/admin/images');
  await expect(page.getByRole('alert')).toContainText('No hay conexión');
  await expect(page.getByRole('button',{name:'✓ Okay'}).first()).toBeDisabled();
  expect(await (await request.get('/api/vocabulary/images')).json()).toEqual([]);
});
