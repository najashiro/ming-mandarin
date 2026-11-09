import { test, expect, type Page } from '@playwright/test';
import { cardinalWords, directionMissions, findTile, moveJourney, relativeWords, safeRoute, startJourney, type Journey, type MapMission } from '../../data/directions-game';
import { readFileSync } from 'node:fs';
const language = JSON.parse(readFileSync('data/directions-language.json','utf8')) as { entries: Record<string,{hanzi:string;pinyin:string;spanish:string;audioSrc:string}> };

const path = '/study/l6/games/directions';
async function walk(page: Page, mission: MapMission, state: Journey, target = findTile(mission,'G')) {
  for (const heading of safeRoute(mission,state.position,target)) {
    const word = mission.relative ? relativeWords[(heading-state.heading+4)%4] : cardinalWords[heading];
    await page.getByRole('button',{name:word,exact:true}).click();
    state=moveJourney(mission,state,word);
  }
  return state;
}

test('catálogo, controles hanzi, ayuda y móvil', async ({page},info) => {
  await page.goto('/study/l6/games');
  await page.locator('[data-game="direcciones"]').getByRole('link',{name:/Jugar/}).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.getByRole('heading',{name:/Tú tienes el mapa/})).toBeVisible();
  await expect(page.getByRole('button',{name:/2\. La hora del almuerzo/})).toBeDisabled();
  await page.screenshot({path:info.outputPath('directions-welcome.png'),fullPage:true});
  await page.getByRole('button',{name:/Contestar la llamada/}).click();
  await expect(page.locator('.directions-choices button')).toHaveText(['东边','西边','北边','南边']);
  await expect(page.locator('.directions-glossary')).toHaveCount(0);
  await expect(page.getByRole('img',{name:/Mapa de 图书馆/})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.screenshot({path:info.outputPath('directions-playing.png'),fullPage:true});
  await page.getByRole('button',{name:'Consultar vocabulario'}).click();
  await expect(page.locator('.directions-glossary')).toContainText('běibian');
  await page.getByRole('button',{name:'Pedir una pista'}).click();
  await expect(page.locator('.directions-choices button.hinted')).toHaveCount(1);
  await page.getByRole('button',{name:'Ver mapas'}).click();
  await page.getByRole('link',{name:/Juegos Míng/}).click();
  await expect(page).toHaveURL(/\/study\/l6\/games$/);
  await page.goto('/study/l5/games');
  await expect(page.locator('[data-game="direcciones"]')).toHaveCount(0);
  await page.goto('/study/l1-l2-l3-l4-l5-l6/games');
  await expect(page.locator('[data-game="direcciones"]')).toBeVisible();
});

test('las seis llamadas se completan y las estrellas persisten', async ({page},info) => {
  test.setTimeout(120_000);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(path);
  await page.getByRole('button',{name:/Contestar la llamada/}).click();
  for (let i=0;i<directionMissions.length;i++) {
    const mission=directionMissions[i];
    await expect(page.locator('.directions-game')).toHaveAttribute('data-level',String(i));
    if(mission.relative) expect((await page.locator('.directions-choices button').allTextContents()).sort()).toEqual([...relativeWords].sort());
    await walk(page,mission,startJourney(mission));
    await expect(page.getByRole('heading',{name:'¡Llegó gracias a ti!'})).toBeVisible();
    if(i===4) await page.screenshot({path:info.outputPath('directions-night.png'),fullPage:true});
    await page.getByRole('button',{name:i===5?'Terminar la aventura':/Siguiente llamada/}).click();
  }
  await expect(page.getByRole('heading',{name:'¡Qué bueno tenerte al otro lado!'})).toBeVisible();
  await page.screenshot({path:info.outputPath('directions-finished.png'),fullPage:true});
  await page.reload();
  const buttons=page.locator('.directions-mission-start');
  for(let i=0;i<6;i++) await expect(buttons.nth(i)).toBeEnabled();
  expect(errors).toEqual([]);
});

test('audio real al tocar, lectura global, tipografía y persistencia', async ({page},info) => {
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      document.documentElement.dataset.lastMandarinAudio = this.src;
      this.addEventListener('playing',()=>{document.documentElement.dataset.playingMandarinAudio=this.src;},{once:true});
      return original.call(this);
    };
  });
  await page.goto(path);
  const toggle=page.getByRole('button',{name:'Pinyin + español',exact:true});
  await expect(toggle).toHaveAttribute('aria-pressed','false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.directions-preview-question .direction-text-pinyin')).toContainText('Túshūguǎn');
  await expect(page.locator('.directions-mission-card').first()).toContainText('biblioteca');
  await page.getByRole('button',{name:/Contestar la llamada/}).click();
  const question=language.entries['你好，请问图书馆在哪儿？'];
  await expect(page.locator('html')).toHaveAttribute('data-playing-mandarin-audio',new RegExp(question.audioSrc+'$'));
  await expect(page.locator('.directions-bubble .direction-text-pinyin')).toContainText('Nǐ hǎo');
  await expect(page.locator('.directions-bubble .direction-text-spanish')).toContainText('¿dónde está la biblioteca?');
  await expect(page.locator('.directions-map-label.target')).toContainText('túshūguǎn');
  await expect(page.locator('.directions-map-label.target')).toContainText('biblioteca');
  await expect(page.locator('.directions-choices button').first()).toContainText('dōngbian');
  const hierarchy=await page.locator('.directions-bubble').evaluate(el=>{
    const hanzi=el.querySelector('.font-hanzi')!, pinyin=el.querySelector('.direction-text-pinyin')!,spanish=el.querySelector('.direction-text-spanish')!;
    return { hanzi:parseFloat(getComputedStyle(hanzi).fontSize),pinyin:parseFloat(getComputedStyle(pinyin).fontSize),spanish:parseFloat(getComputedStyle(spanish).fontSize),font:getComputedStyle(hanzi).fontFamily,spanishColor:getComputedStyle(spanish).color };
  });
  expect(hierarchy.hanzi).toBeGreaterThan(hierarchy.pinyin);expect(hierarchy.pinyin).toBeGreaterThan(hierarchy.spanish);
  expect(hierarchy.font).toMatch(/Noto|noto|Songti/);expect(hierarchy.spanishColor).toBe('rgb(119, 122, 117)');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const commandLayout=await page.locator('.directions-choices button').first().evaluate(el=>{
    const text=el.querySelector('.font-hanzi')!,box=text.getBoundingClientRect(),button=el.getBoundingClientRect();
    return {height:box.height,fontSize:parseFloat(getComputedStyle(text).fontSize),bottom:button.bottom,viewport:innerHeight};
  });
  expect(commandLayout.height).toBeLessThan(commandLayout.fontSize*2);
  if(info.project.name!=='chromium') expect(commandLayout.bottom).toBeLessThanOrEqual(commandLayout.viewport);
  await page.screenshot({path:info.outputPath('directions-learning.png'),fullPage:info.project.name==='chromium'});
  for(const word of ['东边','西边','北边','南边'] as const) {
    await page.getByRole('button',{name:word,exact:true}).click();
    await expect(page.locator('html')).toHaveAttribute('data-playing-mandarin-audio',new RegExp(language.entries[word].audioSrc+'$'));
  }
  await page.locator('.directions-destination-name').click();
  await expect(page.locator('html')).toHaveAttribute('data-playing-mandarin-audio',new RegExp(language.entries['图书馆'].audioSrc+'$'));
  await page.locator('.directions-bubble').click();
  await expect(page.locator('html')).toHaveAttribute('data-playing-mandarin-audio',new RegExp(language.entries['好。'].audioSrc+'$'));
  await page.locator('.directions-map-label.target .direction-readout').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-playing-mandarin-audio',new RegExp(language.entries['图书馆'].audioSrc+'$'));
  await page.reload();await expect(toggle).toHaveAttribute('aria-pressed','true');
  await toggle.click();await expect(page.locator('.direction-text-pinyin')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('todos los MP3 del juego se decodifican y contienen señal audible', async ({page},info) => {
  test.skip(info.project.name!=='chromium','La decodificación de los mismos archivos se verifica una vez.');
  await page.goto(path);
  for(const entry of Object.values(language.entries)) {
    const signal=await page.evaluate(async src=>{
      const response=await fetch(src);if(!response.ok) throw new Error(`Audio HTTP ${response.status}`);
      const context=new AudioContext();
      try {
        const buffer=await context.decodeAudioData(await response.arrayBuffer());
        const samples=buffer.getChannelData(0);let energy=0,peak=0;
        for(const value of samples){energy+=value*value;peak=Math.max(peak,Math.abs(value));}
        return {duration:buffer.duration,rms:Math.sqrt(energy/samples.length),peak};
      } finally {await context.close();}
    },entry.audioSrc);
    expect(signal.duration,entry.hanzi).toBeGreaterThan(.25);expect(signal.rms,entry.hanzi).toBeGreaterThan(.002);expect(signal.peak,entry.hanzi).toBeGreaterThan(.005);
  }
});

test('error de audio recuperable: reintentar conserva la partida', async ({page}) => {
  const src=language.entries['东边'].audioSrc;
  await page.route(`**${src}`,route=>route.abort());
  await page.goto(path);await page.getByRole('button',{name:/Contestar la llamada/}).click();
  await page.getByRole('button',{name:'东边',exact:true}).click();
  await expect(page.locator('.directions-audio-error')).toContainText('No se pudo reproducir');
  await expect(page.getByRole('img',{name:/Personaje en fila 8, columna 3/})).toBeVisible();
  await page.unroute(`**${src}`);
  await page.getByRole('button',{name:'Reintentar 东边'}).click();
  await expect(page.locator('.directions-audio-error')).toHaveCount(0);
  await expect(page.getByRole('img',{name:/Personaje en fila 8, columna 3/})).toBeVisible();
});

test('caídas, rescate, derrota y reinicio no bloquean el juego', async ({page}) => {
  test.setTimeout(60_000);
  await page.goto(path);await page.getByRole('button',{name:/Contestar la llamada/}).click();
  await page.getByRole('button',{name:'南边',exact:true}).click();
  await expect(page.locator('.directions-feedback')).toContainText('Hay un seto');
  const mission=directionMissions[0];
  await walk(page,mission,startJourney(mission),findTile(mission,'C'));
  for(let attempt=0;attempt<3;attempt++) {
    for(const word of ['东边','北边','北边']) await page.getByRole('button',{name:word,exact:true}).click();
    if(attempt<2) {
      await expect(page.getByRole('heading',{name:'¡Te sacamos de ahí!'})).toBeVisible();
      await page.getByRole('button',{name:'Lanzar la cuerda'}).click();
      await expect(page.getByRole('img',{name:/Personaje en fila 6, columna 5/})).toBeVisible();
    }
  }
  await expect(page.getByRole('heading',{name:'La llamada necesita otro intento'})).toBeVisible();
  await page.getByRole('button',{name:'Volver a llamar',exact:true}).click();
  await expect(page.locator('.directions-hearts')).toHaveAttribute('aria-label','3 vidas restantes');
  await expect(page.getByRole('img',{name:/Personaje en fila 8, columna 2/})).toBeVisible();
});

test('progreso corrupto o almacenamiento bloqueado no impide jugar', async ({page}) => {
  await page.addInitScript(()=>{
    const get=Storage.prototype.getItem;
    Storage.prototype.getItem=function(key){if(key==='ming-directions-v1') return '{bad';return get.call(this,key);};
    const set=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,value){if(key==='ming-directions-v1') throw new DOMException('Blocked','SecurityError');return set.call(this,key,value);};
  });
  await page.goto(path);await page.getByRole('button',{name:/Contestar la llamada/}).click();
  await walk(page,directionMissions[0],startJourney(directionMissions[0]));
  await expect(page.getByRole('heading',{name:'¡Llegó gracias a ti!'})).toBeVisible();
  await expect(page.locator('.directions-footer')).toContainText('Almacenamiento no disponible');
  await page.getByRole('button',{name:/Siguiente llamada/}).click();
  await expect(page.locator('.directions-game')).toHaveAttribute('data-level','1');
});
