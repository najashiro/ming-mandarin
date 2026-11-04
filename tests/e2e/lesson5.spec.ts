import { test, expect } from '@playwright/test';
import media from '../../data/lesson5-media.json' with {type:'json'};

test('L5: portada, módulos, fuentes prioritarias y móvil sin desbordamiento', async ({page}) => {
  test.setTimeout(90_000);
  const errors:string[]=[];page.on('pageerror', e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('link',{name:/LECCIÓN 05/})).toBeVisible();
  for (const section of ['vocabulary','dialogues','grammar','hanzi','readings','exercises','radicals','games','exam','daily']) {
    await page.goto(`/study/l5/${section}`);await page.waitForLoadState('networkidle');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/Application error|source_refs|pinyin_ming/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),section).toBe(true);
  }
  await page.goto('/study/l5/dialogues');await page.waitForLoadState('networkidle');
  await expect(page.locator('.dialogue-turn')).toHaveCount(27);
  await expect(page.locator('main')).toContainText('十月二十五号。');
  await expect(page.locator('main')).toContainText('今年三十二岁');
  await page.goto('/study/l5/readings');await page.waitForLoadState('networkidle');await expect(page.locator('.corpus-dialogue')).toHaveCount(4);
  await page.goto('/study/l5/exercises');await page.waitForLoadState('networkidle');await expect(page.locator('details')).toHaveCount(29);
  expect(errors).toEqual([]);
});

test('L5: tarjeta, imagen, audio, ejemplo enlazado y motor Hanzi', async ({page},info) => {
  await page.route('**/api/vocabulary/images',r=>r.fulfill({json:media}));
  await page.addInitScript(()=>{const NativeAudio=window.Audio;window.Audio=function(src?:string){const a=new NativeAudio(src);(window as typeof window & {studyAudio?:HTMLAudioElement}).studyAudio=a;return a;} as unknown as typeof Audio;});
  await page.goto(`/study/l5/vocabulary?card=${encodeURIComponent('v-蛋糕')}`);
  const card=page.getByRole('article',{name:'Ficha de 蛋糕',exact:true});
  await expect(card.locator('img')).toBeVisible();
  await expect.poll(()=>card.locator('img').evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
  await expect(card).toContainText('dàngāo');await expect(card).toContainText('pastel');
  await card.getByRole('button',{name:'Escuchar: 蛋糕',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>(window as typeof window & {studyAudio?:HTMLAudioElement}).studyAudio?.currentTime??0)).toBeGreaterThan(0);
  await card.screenshot({path:info.outputPath('lesson5-cake.png')});
  await card.getByRole('button',{name:'Ver ejemplo: 蛋糕',exact:true}).click();
  await expect(card.locator('.vocabulary-example-text')).toBeVisible();
  await expect(card.locator('.vocabulary-example-translation')).toBeVisible();
  const link=card.locator('a[href*="focus=glyph"]').first();await expect(link).toBeVisible();
  const popupPromise=page.waitForEvent('popup');await link.click();const popup=await popupPromise;
  await expect(popup).toHaveURL(/\/hanzi\?.*focus=glyph/);
  await expect(popup.locator('main')).toBeVisible();
  await expect(popup.locator('main')).not.toContainText('Application error');
  await popup.close();
});

test('L5: cumpleaños con reintentos, construcción y conversación', async ({page},info) => {
  await page.addInitScript(()=>{Math.random=()=>.42;});
  await page.goto('/study/l5/games');await page.waitForLoadState('networkidle');
  await page.locator('[data-game="cumpleanos"]').getByRole('button',{name:/Jugar/}).click();
  const game=page.locator('.birthday-game');
  await expect(game.getByRole('button',{name:'Comprobar',exact:true})).toBeDisabled();
  await game.locator('.dialogue-replies button').first().click();
  await game.getByRole('button',{name:'Comprobar',exact:true}).click();
  await expect(game.getByRole('status')).toBeVisible();
  await expect(game.locator('.pinyin-text')).toBeVisible();
  await game.getByRole('button',{name:'Continuar',exact:true}).click();
  await game.getByRole('button',{name:'Construir',exact:true}).click();
  await expect(game.getByRole('button',{name:'Comprobar',exact:true})).toBeDisabled();
  await page.screenshot({path:info.outputPath('lesson5-birthday.png'),fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.getByRole('button',{name:'Cerrar',exact:true}).click();
  await page.locator('[data-game="conversacion"]').getByRole('button',{name:/Jugar/}).click();
  await expect(page.getByRole('heading',{name:'Una fiesta y una sorpresa'})).toBeVisible();
  await expect(page.locator('.dialogue-bubble').first()).toContainText('这个星期日几号？');
  await page.locator('.dialogue-replies').getByRole('button',{name:'十月二十五号。',exact:true}).click();
  await page.getByRole('button',{name:'Responder',exact:true}).click();
  await expect(page.getByRole('button',{name:'Continuar conversación'})).toBeVisible();
});
