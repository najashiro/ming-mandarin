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

test('L5: el reto mixto centra la frase y recoge el banco de fichas vacío', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: [] }));
  await page.goto('/study/l5/games?game=reto-mixto');
  await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
  await page.evaluate(() => { Math.random = () => 0.295; });
  await page.getByRole('button', { name: 'Comenzar reto' }).click();

  const cue = page.getByText('Xiaoyun y Song Hua me enseñan a hablar chino y escribir caracteres.', { exact: true });
  await expect(cue).toBeVisible();
  await expect(cue).toHaveCSS('text-align', 'center');
  const lines = await cue.evaluate(paragraph => {
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    return range.getClientRects().length;
  });
  expect(lines).toBeLessThanOrEqual(4);

  const bank = page.locator('.mixed-token-bank');
  const tokens = ['小云和宋华', '教', '我', '说汉语', '写汉字'];
  for (const token of tokens) {
    const clip = page.waitForResponse(response => response.url().includes('/audio/') && response.ok());
    await bank.getByRole('button', { name: token, exact: true }).click();
    await clip;
  }
  await expect(bank).toBeHidden();
  await page.locator('.mixed-built').getByRole('button', { name: '写汉字', exact: true }).click();
  await expect(bank.getByRole('button', { name: '写汉字', exact: true })).toBeVisible();
});

test('L5: las fichas compuestas se oyen completas, se interrumpen al tocar otra y admiten reintentar', async ({ page }) => {
  const two = '/audio/mandarin/l1-h-u4e8c.mp3';
  const zero = '/audio/mandarin/l4-d863483f50746749.mp3';
  const year = [two, zero, two, zero, '/audio/mandarin/l3-v-6f14c2641c.mp3'];
  const december = '/audio/mandarin/l5-33aa2f306987f87c.mp3';
  const day = ['/audio/mandarin/vocab-d66359aac7aca249c1a5.mp3', '/audio/mandarin/l5-e59c83c8a7737216.mp3'];
  type AudioLog = { starts: string[]; ends: string[] };
  type AudioWindow = typeof window & { gameAudioLog: AudioLog };
  await page.addInitScript(() => {
    const log = { starts: [] as string[], ends: [] as string[] };
    (window as AudioWindow).gameAudioLog = log;
    const observed = new WeakSet<HTMLMediaElement>();
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!observed.has(this)) {
        this.addEventListener('ended', () => log.ends.push(new URL(this.currentSrc).pathname), true);
        observed.add(this);
      }
      log.starts.push(new URL(this.src).pathname);
      return original.call(this);
    };
  });
  const log = () => page.evaluate(() => (window as AudioWindow).gameAudioLog);
  const resetLog = () => page.evaluate(() => {
    const audio = (window as AudioWindow).gameAudioLog;
    audio.starts.length = audio.ends.length = 0;
  });
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: [] }));
  await page.goto('/study/l5/games?game=reto-mixto');
  await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
  await page.evaluate(() => { Math.random = () => .319; });
  await page.getByRole('button', { name: 'Comenzar reto' }).click();
  const bank = page.locator('.mixed-token-bank');
  const built = page.locator('.mixed-built');

  await bank.getByRole('button', { name: '二〇二〇年', exact: true }).click();
  await expect.poll(async () => (await log()).ends, { timeout: 12_000 }).toEqual(year);
  await resetLog();
  await built.getByRole('button', { name: '二〇二〇年', exact: true }).click();
  await bank.getByRole('button', { name: '十二月', exact: true }).click();
  await expect.poll(async () => (await log()).ends).toEqual([december]);
  expect((await log()).starts).toEqual([two, december]);
  await expect(built.getByRole('button')).toHaveText(['十二月']);

  // A failed request followed by a retry exercises browser decoding and the real player.
  const failingClip = '**' + day[0];
  await page.route(failingClip, route => route.abort());
  await bank.getByRole('button', { name: '二十五日', exact: true }).click();
  const retry = page.getByRole('button', { name: 'Reintentar audio' });
  await expect(retry).toBeVisible();
  await expect(built.getByRole('button')).toHaveText(['十二月', '二十五日']);
  await page.unroute(failingClip);
  await resetLog();
  await retry.click();
  await expect.poll(async () => (await log()).ends, { timeout: 12_000 }).toEqual(day);
  await expect(retry).toBeHidden();
  await expect(built.getByRole('button')).toHaveText(['十二月', '二十五日']);
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
