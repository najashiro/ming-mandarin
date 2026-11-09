import { test, expect } from '@playwright/test';
import { getWorkbookQuestions } from '../../lib/workbook-games';

test('L6: módulos integrados, fuentes y recursos pendientes', async ({page},info) => {
  test.setTimeout(120_000);
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/course');
  await expect(page.getByRole('link',{name:/LECCIÓN 06/})).toBeVisible();
  await page.getByRole('link',{name:/LECCIÓN 06/}).click();
  await expect(page).toHaveURL(/\/study\/l6$/);
  await expect(page.getByRole('heading',{name:'Al terminar podrás…'})).toBeVisible();
  await page.getByText('Recursos de la lección',{exact:true}).click();
  await expect(page.locator('main')).toContainText('No se suministró una clave oficial');
  await page.screenshot({path:info.outputPath('lesson6-overview.png'),fullPage:true});
  for (const section of ['vocabulary','dialogues','grammar','hanzi','readings','exercises','radicals','games','games/workbook','exam','daily']) {
    await page.goto(`/study/l6/${section}`); await page.waitForLoadState('networkidle');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/Application error|source_refs|pinyin_ming/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),section).toBe(true);
  }
  await page.goto('/study/l6/dialogues');
  await expect(page.locator('.dialogue-turn')).toHaveCount(31);
  await expect(page.locator('main')).toContainText('图书馆很大，在食堂北边。');
  await expect(page.locator('main')).toContainText('35号');
  await page.screenshot({path:info.outputPath('lesson6-dialogues.png'),fullPage:true});
  await page.goto('/study/l6/readings');
  await expect(page.locator('.corpus-dialogue')).toHaveCount(4);
  await page.goto('/study/l6/exercises');
  await expect(page.locator('.documentary-activity')).toHaveCount(38);
  await page.locator('#l6-wb-listen-tf summary').click();
  await expect(page.locator('#l6-wb-listen-tf')).toContainText('grabación original del libro, aún no disponible');
  await page.screenshot({path:info.outputPath('lesson6-exercises.png'),fullPage:true});
  expect(errors).toEqual([]);
});

test('L6: vocabulario, trazos y conversación funcionan sin inventar audio', async ({page},info) => {
  test.setTimeout(90_000);
  await page.goto(`/study/l6/vocabulary?card=${encodeURIComponent('v-图书馆')}`);
  const card=page.getByRole('article',{name:'Ficha de 图书馆',exact:true});
  await expect(card).toContainText('túshūguǎn');
  await expect(card).toContainText('biblioteca');
  await card.getByRole('button',{name:'Ver ejemplo: 图书馆',exact:true}).click();
  await expect(card.locator('.vocabulary-example-text')).toContainText('我去图书馆看书。');
  const link=card.locator('a[href*="focus=glyph"]').first();
  const popupPromise=page.waitForEvent('popup'); await link.click(); const popup=await popupPromise;
  await expect(popup.locator('main')).not.toContainText('Application error');
  await expect(popup.locator('svg')).not.toHaveCount(0);
  await popup.close();
  await page.goto('/study/l6/games');
  await page.locator('[data-game="conversacion"]').getByRole('button',{name:/Jugar/}).click();
  await expect(page.getByRole('heading',{name:'Ayuda a un estudiante nuevo'})).toBeVisible();
  await page.locator('.dialogue-replies').getByRole('button',{name:'食堂在校门右边。你是新同学吗？',exact:true}).click();
  await page.getByRole('button',{name:'Responder',exact:true}).click();
  await expect(page.getByRole('button',{name:'Continuar conversación'})).toBeVisible();
  await page.screenshot({path:info.outputPath('lesson6-conversation.png'),fullPage:true});
});

test('L1–L5: las rutas históricas conservan sus módulos', async ({page}) => {
  test.setTimeout(90_000);
  for (const scope of ['l1','l2','l3','l4','l5','l1-l2-l3-l4-l5']) {
    await page.goto(`/study/${scope}`);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('link',{name:/Empezar con el vocabulario/})).toHaveAttribute('href',`/study/${scope}/vocabulary`);
  }
  await page.goto('/study/l5/dialogues');
  await expect(page.locator('.dialogue-turn')).toHaveCount(27);
  await expect(page.locator('main')).toContainText('十月二十五号。');
});

test('L6: las tres prácticas del cuaderno son jugables', async ({page}) => {
  const bank=getWorkbookQuestions('l6');
  for (const mode of ['order','complete','dialogue'] as const) {
    await page.goto(`/study/l6/games/workbook?mode=${mode}`);
    await expect(page.locator('main')).toContainText('no son una clave oficial');
    await page.getByRole('button',{name:'Empezar a jugar'}).click();
    const id=await page.locator('.workbook-round').getAttribute('data-question-id');
    const row=bank.find(q=>q.id===id)!; expect(row).toBeTruthy();
    if (mode==='order') for (const token of row.tokens!) await page.locator('.workbook-token-tray').getByRole('button',{name:`Añadir ${token}`,exact:true}).and(page.locator('button:not(:disabled)')).first().click();
    else await page.locator('.workbook-options button').filter({has:page.getByText(row.answer,{exact:true})}).click();
    await page.getByRole('button',{name:'Comprobar',exact:true}).click();
    await expect(page.locator('.workbook-feedback.correct')).toBeVisible();
  }
});
