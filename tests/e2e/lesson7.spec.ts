import { test, expect } from '@playwright/test';
import { getWorkbookQuestions } from '../../lib/workbook-games';
import { readFileSync } from 'node:fs';
import { emptyVocabularyState, vocabularyStorageKey } from '../../lib/vocabulary-storage';
import type { MixSession } from '../../lib/vocabulary-review';

test('L7: módulos integrados y recursos completos', async ({page},info) => {
  test.setTimeout(120_000);
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/course');
  await expect(page.getByRole('link',{name:/LECCIÓN 07/})).toBeVisible();
  await page.getByRole('link',{name:/LECCIÓN 07/}).click();
  await expect(page).toHaveURL(/\/study\/l7$/);
  await expect(page.getByRole('heading',{name:'Al terminar podrás…'})).toBeVisible();
  await page.getByText('Recursos de la lección',{exact:true}).click();
  await expect(page.locator('main')).toContainText('Audio de práctica generado con IA');
  await page.screenshot({path:info.outputPath('lesson7-overview.png'),fullPage:true});
  for (const section of ['vocabulary','dialogues','grammar','hanzi','readings','exercises','radicals','games','games/workbook','exam','daily']) {
    await page.goto(`/study/l7/${section}`); await page.waitForLoadState('networkidle');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/Application error|source_refs|pinyin_ming/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),section).toBe(true);
  }
  await page.goto('/study/l7/dialogues');
  await expect(page.locator('.dialogue-turn')).toHaveCount(35);
  await expect(page.locator('main')).toContainText('苹果多少钱一斤？');
  await expect(page.locator('main')).toContainText('两千一百九十一块');
  await page.screenshot({path:info.outputPath('lesson7-dialogues.png'),fullPage:true});
  await page.goto('/study/l7/readings');
  await expect(page.locator('.corpus-dialogue')).toHaveCount(5);
  await page.goto('/study/l7/exercises');
  await expect(page.locator('.documentary-activity')).toHaveCount(44);
  await page.locator('#l7-wb-listen-tf > summary').click();
  await expect(page.locator('#l7-wb-listen-tf .documentary-listening-track')).toHaveCount(5);
  await expect(page.locator('main')).not.toContainText(/aún no disponible|no suministrad/);
  await page.screenshot({path:info.outputPath('lesson7-exercises.png'),fullPage:true});
  expect(errors).toEqual([]);
});

test('L7: vocabulario, trazos y conversación reproducen los recursos editoriales', async ({page},info) => {
  test.setTimeout(90_000);
  await page.goto(`/study/l7/vocabulary?card=${encodeURIComponent('v-苹果')}`);
  const card=page.getByRole('article',{name:'Ficha de 苹果',exact:true});
  await expect(card).toContainText('píngguǒ');
  await expect(card).toContainText('manzana');
  await card.getByRole('button',{name:'Ver ejemplo: 苹果',exact:true}).click();
  await expect(card.locator('.vocabulary-example-text')).toContainText('苹果多少钱一斤？');
  const link=card.locator('a[href*="focus=glyph"]').first();
  const popupPromise=page.waitForEvent('popup'); await link.click(); const popup=await popupPromise;
  await expect(popup.locator('main')).not.toContainText('Application error');
  await expect(popup.locator('svg')).not.toHaveCount(0);
  await popup.close();
  await page.goto('/study/l7/games');
  await page.locator('[data-game="conversacion"]').getByRole('button',{name:/Jugar/}).click();
  await expect(page.getByRole('heading',{name:'Elige y paga tu ropa'})).toBeVisible();
  await page.locator('.dialogue-replies').getByRole('button',{name:'三百九十九块。',exact:true}).click();
  await page.getByRole('button',{name:'Responder',exact:true}).click();
  await expect(page.getByRole('button',{name:'Continuar conversación'})).toBeVisible();
  await expect(page.locator('.game-audio-unavailable')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Reintentar audio',exact:true})).toHaveCount(0);
  await page.screenshot({path:info.outputPath('lesson7-conversation.png'),fullPage:true});
});

test('L7: Mix conserva los sentidos locales y permite repasar sus errores', async ({page},info) => {
  const images=JSON.parse(readFileSync(new URL('../../data/lesson7-media.json',import.meta.url),'utf8'));
  const sizes=JSON.parse(readFileSync(new URL('../../data/vocabulary-image-sizes.json',import.meta.url),'utf8')).entries;
  const session:MixSession={formatVersion:2,id:'l7-local-senses',userId:'guest',scope:'l7',difficulty:'hard',presentation:'image',requestedSize:10,actualSize:3,deck:['v-哪里','v-找','v-分'],index:0,revealed:false,paused:false,kind:'normal',startedAt:100,answers:[]};
  await page.addInitScript(({key,value})=>localStorage.setItem(key,value),{key:vocabularyStorageKey('guest'),value:JSON.stringify({...emptyVocabularyState(),sessions:{l7:session}})});
  await page.goto('/study/l7/games/vocabulary-mix');
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready','true');
  for (const [hanzi,pinyin,meaning] of [['哪里','nǎli','modestia'],['找','zhǎo','cambio'],['分','fēn','centavo']]) {
    const question=page.locator('.vocabulary-mix-question');
    await expect(question.locator('.vocabulary-mix-prompt')).toHaveText(hanzi);
    const image=images.find((row:{wordId:string})=>row.wordId===`v-${hanzi}${hanzi==='哪里'?'':'@l7'}`);
    const allowedSources=[image.src,...(sizes[image.src]?.variants.map((row:{src:string})=>row.src)??[])];
    await expect(question.locator('img')).toBeVisible();
    expect(allowedSources).toContain(new URL((await question.locator('img').getAttribute('src'))!,page.url()).pathname);
    await page.getByRole('button',{name:'Ver respuesta',exact:true}).click();
    const card=page.locator('.vocabulary-card');
    await expect(card.locator('.word-pinyin')).toHaveText(pinyin);
    await expect(card.locator('.vocabulary-translation')).toContainText(meaning);
    await expect(card.locator('img')).toBeVisible();
    expect(allowedSources).toContain(new URL((await card.locator('img').getAttribute('src'))!,page.url()).pathname);
    if (hanzi==='分') await card.screenshot({path:info.outputPath('lesson7-mix-money-sense.png')});
    await page.getByRole('button',{name:'No lo sabía',exact:true}).click();
  }
  await expect(page.getByRole('heading',{name:'Partida terminada'})).toBeVisible();
  await page.getByRole('button',{name:'Repasar incorrectas (3)',exact:true}).click();
  const meanings:Record<string,string>={'哪里':'modestia','找':'cambio','分':'centavo'};
  for (let index=0;index<3;index++) {
    const hanzi=(await page.locator('.vocabulary-mix-prompt').textContent())!;
    expect(meanings[hanzi]).toBeTruthy();
    await page.getByRole('button',{name:'Ver respuesta',exact:true}).click();
    await expect(page.locator('.vocabulary-card .vocabulary-translation')).toContainText(meanings[hanzi]);
    await page.getByRole('button',{name:'Lo sabía',exact:true}).click();
  }
});

test('L1–L6: las rutas históricas conservan sus módulos', async ({page}) => {
  test.setTimeout(90_000);
  for (const scope of ['l1','l2','l3','l4','l5','l6','l1-l2-l3-l4-l5-l6']) {
    await page.goto(`/study/${scope}`);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('link',{name:/Empezar con el vocabulario/})).toHaveAttribute('href',`/study/${scope}/vocabulary`);
  }
  await page.goto('/study/l5/dialogues');
  await expect(page.locator('.dialogue-turn')).toHaveCount(27);
  await expect(page.locator('main')).toContainText('十月二十五号。');
});

test('L7: las tres prácticas del cuaderno son jugables', async ({page}) => {
  const bank=getWorkbookQuestions('l7');
  for (const mode of ['order','complete','dialogue'] as const) {
    await page.goto(`/study/l7/games/workbook?mode=${mode}`);
    await expect(page.locator('main')).toContainText('no son una clave oficial');
    await page.getByRole('button',{name:'Empezar a jugar'}).click();
    const id=await page.locator('.workbook-round').getAttribute('data-question-id');
    const row=bank.find(q=>q.id===id)!; expect(row).toBeTruthy();
    if (mode==='order') for (const token of row.tokens!) await page.locator('.workbook-token-tray').getByRole('button',{name:`Añadir ${token}`,exact:true}).and(page.locator('button:not(:disabled)')).first().click();
    else await page.locator('.workbook-options button').filter({hasText:row.answer}).click();
    await page.getByRole('button',{name:'Comprobar',exact:true}).click();
    await expect(page.locator('.workbook-feedback.correct')).toBeVisible();
  }
});

test('L7: la API sirve imágenes del sentido correcto y el audio se reproduce', async ({page,request},info) => {
  test.setTimeout(60_000);
  const response=await request.get('/api/vocabulary/images');
  expect(response.ok()).toBe(true);
  const images=await response.json();
  for (const id of ['v-草莓','v-哪里','v-找@l7','v-分@l7']) expect(images.some((row:{wordId:string})=>row.wordId===id)).toBe(true);
  for (const hanzi of ['草莓','哪里','找','分']) {
    await page.goto(`/study/l7/vocabulary?card=${encodeURIComponent(`v-${hanzi}`)}`);
    const card=page.getByRole('article',{name:`Ficha de ${hanzi}`,exact:true});
    const picture=card.locator('img');
    await expect(picture).toBeVisible();
    await expect(picture).toHaveAttribute('src',/vocabulary\/(lesson7|responsive)\//);
    await expect.poll(()=>picture.evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth>0)).toBe(true);
    const audioResponse=page.waitForResponse(response=>response.url().includes('/audio/')&&response.status()<400);
    await card.getByRole('button',{name:`Escuchar: ${hanzi}`,exact:true}).click();
    await audioResponse;
    await expect(card.locator('.audio-button.playing')).toBeVisible();
    await card.screenshot({path:info.outputPath(`lesson7-media-${hanzi}.png`)});
  }
});


test('L7: las cinco actividades de escucha tienen audio y soluciones accesibles', async ({page},info) => {
  test.setTimeout(60_000);
  await page.goto('/study/l7/exercises');
  const groups=[['l7-phonetics',10],['l7-listen-repeat',4],['l7-wb-listen-tf',5],['l7-wb-listen-fill',2],['l7-wb-listen-choice',7]] as const;
  for(const [id,count] of groups) {
    const activity=page.locator(`#${id}`); await activity.locator(':scope > summary').click();
    const tracks=activity.locator('.documentary-listening-track'); await expect(tracks).toHaveCount(count);
    await expect(activity.locator('button:disabled')).toHaveCount(0);
    const first=tracks.first();const audio=page.waitForResponse(response=>response.url().includes('/audio/')&&response.status()<400);
    await first.getByRole('button',{name:/Escuchar/}).click(); await audio;
    await expect(first.locator('.audio-button.playing')).toBeVisible();
    await first.getByText('Ver transcripción y pronunciación',{exact:true}).click();
    await expect(first.locator('.documentary-chinese')).toBeVisible();
    if(id.startsWith('l7-wb')) {
      await first.getByText('Comprobar respuesta',{exact:true}).click();
      await expect(first.locator('details[open]')).toHaveCount(2);
    }
    await first.screenshot({path:info.outputPath(`${id}-listening.png`)});
    await activity.locator(':scope > summary').click();
  }
});
