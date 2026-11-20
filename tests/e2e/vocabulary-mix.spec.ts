import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import lesson6 from '../../data/lesson6-public.json' with { type: 'json' };
import directionsAudio from '../../data/directions-audio.json' with { type: 'json' };
import type { ActiveWord } from '../../lib/vocabulary';
import type { VocabularyMediaEntry } from '../../lib/vocabulary-media';
import { startMix } from '../../lib/vocabulary-review';
import type { MixSession } from '../../lib/vocabulary-review';
import { emptyVocabularyState, parseVocabularyState, vocabularyStorageKey } from '../../lib/vocabulary-storage';

// Check the actual HTTP request against recordings of the displayed sentence,
// without importing application JSON modules into Playwright's native ESM loader.
function recordingsForSentence(hanzi: string, pinyin: string) {
  const definitions = [
    ['pronunciation', 'pinyin'], ['mandarin-audio', 'mandarin'], ['lesson4-audio', 'mandarin'],
    ['lesson5-audio', 'mandarin'], ['game-audio', 'mandarin'], ['directions-audio', 'directions'],
    ['hide-and-seek-audio', 'hide-and-seek'], ['vocabulary-example-audio', 'mandarin'],
  ];
  const textKey = (text: string) => text.normalize('NFC').replace(/[\s。！？，,.!?；;：:]/g, '');
  const readingKey = (reading: string) => reading.normalize('NFC').toLowerCase().replace(/[\s'’.,!?]/g, '');
  return definitions.flatMap(([name, directory]) => {
    const manifest = JSON.parse(readFileSync(new URL(`../../data/${name}.json`, import.meta.url), 'utf8')) as {
      clips: { input: string; expectedPinyin: string; file: string }[];
    };
    return manifest.clips.filter(clip => textKey(clip.input) === textKey(hanzi) && readingKey(clip.expectedPinyin) === readingKey(pinyin))
      .map(clip => `/audio/${directory}/${clip.file}`);
  });
}

async function installAudioMock(page: import('@playwright/test').Page, blocked = false) {
  await page.addInitScript((deny) => {
    (window as typeof window & { mixAudioPlays?: number }).mixAudioPlays = 0;
    Math.random = () => 0;
    window.Audio = function () {
      const audio = document.createElement('audio');
      audio.play = () => {
        (window as typeof window & { mixAudioPlays?: number }).mixAudioPlays = ((window as typeof window & { mixAudioPlays?: number }).mixAudioPlays ?? 0) + 1;
        if (deny) return Promise.reject(new DOMException('blocked', 'NotAllowedError'));
        queueMicrotask(() => audio.dispatchEvent(new Event('playing')));
        return Promise.resolve();
      };
      audio.pause = () => audio.dispatchEvent(new Event('pause'));
      return audio;
    } as unknown as typeof Audio;
  }, blocked);
}

async function ready(page: import('@playwright/test').Page, path = '/study/l3/games/vocabulary-mix') {
  await page.goto(path);
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
}

async function saveLesson6AudioRound(page: import('@playwright/test').Page) {
  const session: MixSession = {
    formatVersion: 2, id: 'mix-lesson6-audio', userId: 'guest', scope: 'l6',
    requestedSize: 10, actualSize: 2, deck: ['v-教学楼', 'v-体育馆'], index: 0,
    revealed: false, paused: false, kind: 'normal', startedAt: Date.now(), answers: [],
  };
  const raw = JSON.stringify({ ...emptyVocabularyState(), sessions: { l6: session } });
  expect(parseVocabularyState(raw).sessions.l6).toEqual(session);
  await page.addInitScript(({ key, value }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, value);
  }, { key: vocabularyStorageKey('guest'), value: raw });
}

test('the reported teaching-building card loads its real MP3 before and after revealing', async ({ page }, info) => {
  // Continue to the real server while disabling the browser's media HTTP cache,
  // so both controls must issue an observable request for the same recording.
  await page.route('**/audio/directions/**', route => route.continue());
  await saveLesson6AudioRound(page);
  await ready(page, '/study/l6/games/vocabulary-mix');
  await expect(page.locator('.vocabulary-mix-prompt')).toHaveText('教学楼');
  const clip = directionsAudio.clips.find(clip => clip.input === '教学楼' && clip.expectedPinyin === 'jiàoxuélóu')!;
  const path = `/audio/directions/${clip.file}`;

  for (const revealed of [false, true]) {
    if (revealed) await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
    const surface = revealed
      ? page.getByRole('article', { name: 'Ficha de 教学楼', exact: true })
      : page.locator('.vocabulary-mix-question');
    const button = surface.locator('.audio-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveAccessibleName(/^Escuchar[: ]+教学楼$/);
    const [response] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === path && response.status() < 400),
      button.click(),
    ]);
    await expect(button).toHaveClass(/playing/);
    const recording = await page.request.get(response.url());
    expect(recording.ok()).toBe(true);
    expect(recording.headers()['content-type']).toContain('audio/');
    expect((await recording.body()).length).toBeGreaterThan(1024);
    await expect(button).toHaveClass(/idle/);
    await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 0/2');
    await surface.screenshot({ path: info.outputPath(`mix-teaching-building-audio-${revealed ? 'answer' : 'question'}.png`), animations: 'disabled' });
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('lesson-six audio survives reveal, the next turn, blocked autoplay and pause', async ({ page }) => {
  await saveLesson6AudioRound(page);
  // Real MP3 responses are checked above. This probe isolates browser playback
  // permissions and stop behavior from the host's codec and audio device support.
  await page.addInitScript(() => {
    const probe = { plays: [] as string[], active: [] as string[], denyNext: false };
    (window as typeof window & { mixAudioProbe?: typeof probe }).mixAudioProbe = probe;
    window.Audio = function (source?: string | URL) {
      const src = String(source);
      const audio = document.createElement('audio');
      audio.play = () => {
        probe.plays.push(src);
        if (probe.denyNext) {
          probe.denyNext = false;
          return Promise.reject(new DOMException('blocked', 'NotAllowedError'));
        }
        probe.active.push(src);
        queueMicrotask(() => audio.dispatchEvent(new Event('playing')));
        return Promise.resolve();
      };
      audio.pause = () => {
        probe.active = probe.active.filter(active => active !== src);
        audio.dispatchEvent(new Event('pause'));
      };
      return audio;
    } as unknown as typeof Audio;
  });
  type AudioProbe = { plays: string[]; active: string[]; denyNext: boolean };
  const probe = () => page.evaluate(() => (window as typeof window & { mixAudioProbe: AudioProbe }).mixAudioProbe);
  const teaching = `/audio/directions/${directionsAudio.clips.find(clip => clip.input === '教学楼')!.file}`;
  const gym = `/audio/directions/${directionsAudio.clips.find(clip => clip.input === '体育馆')!.file}`;
  await ready(page, '/study/l6/games/vocabulary-mix');
  await page.getByRole('button', { name: 'Escuchar 教学楼', exact: true }).click();
  await expect.poll(async () => (await probe()).active).toEqual([teaching]);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect.poll(async () => (await probe()).active).toEqual([]);
  await page.getByRole('button', { name: 'Escuchar: 教学楼', exact: true }).click();
  await expect.poll(async () => (await probe()).active).toEqual([teaching]);

  await page.evaluate(() => { (window as typeof window & { mixAudioProbe: AudioProbe }).mixAudioProbe.denyNext = true; });
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-prompt')).toHaveText('体育馆');
  await expect(page.getByText('Pulsa el audio para escuchar.')).toBeVisible();
  await expect.poll(async () => (await probe()).plays).toEqual([teaching, teaching, gym]);
  await expect.poll(async () => (await probe()).active).toEqual([]);
  await page.getByRole('button', { name: 'Escuchar 体育馆', exact: true }).click();
  await expect.poll(async () => (await probe()).active).toEqual([gym]);
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/2');

  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await expect.poll(async () => (await probe()).active).toEqual([]);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Partida en pausa' })).toBeVisible();
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-prompt')).toHaveText('体育馆');
  await page.getByRole('button', { name: 'Escuchar 体育馆', exact: true }).click();
  await expect.poll(async () => (await probe()).active).toEqual([gym]);
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/2');
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect.poll(async () => (await probe()).active).toEqual([]);
});

test('the reported bedroom reverse plays its full sentence and preserves the saved round', async ({ page }, info) => {
  await page.route('**/audio/**', route => route.continue());
  const session: MixSession = {
    formatVersion: 2, id: 'mix-bedroom-sentence-audio', userId: 'guest', scope: 'l6',
    requestedSize: 10, actualSize: 2, deck: ['v-教学楼', 'v-卧室'], index: 1,
    revealed: false, paused: false, kind: 'normal', startedAt: 1795170000000,
    answers: [{ id: 'mix-bedroom-sentence-audio:0:v-教学楼', wordId: 'v-教学楼', known: false, answeredAt: 1795170001000 }],
  };
  const raw = JSON.stringify({ ...emptyVocabularyState(), sessions: { l6: session } });
  expect(parseVocabularyState(raw).sessions.l6).toEqual(session);
  await page.addInitScript(({ key, value }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, value);
  }, { key: vocabularyStorageKey('guest'), value: raw });
  await ready(page, '/study/l6/games/vocabulary-mix');
  await expect(page.locator('.vocabulary-mix-prompt')).toHaveText('卧室');
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  const card = page.getByRole('article', { name: 'Ficha de 卧室', exact: true });
  await card.getByRole('button', { name: 'Ver ejemplo: 卧室', exact: true }).click();
  await expect(card).toHaveClass(/is-reversed/);
  await expect(card.locator('.vocabulary-example-text')).toHaveText('我家有两个卧室。');
  await expect(card.locator('.word-pinyin')).toHaveText('Wǒ jiā yǒu liǎng ge wòshì.');
  const button = card.locator('.audio-button');
  await expect(button).toBeVisible();
  await expect(button).toHaveAccessibleName('Escuchar: 我家有两个卧室。');
  const sources = recordingsForSentence('我家有两个卧室。', 'Wǒ jiā yǒu liǎng ge wòshì.');
  expect(sources.length, 'The complete sentence needs a recording').toBeGreaterThan(0);
  const [response] = await Promise.all([
    page.waitForResponse(response => sources.includes(new URL(response.url()).pathname) && response.status() < 400),
    button.click(),
  ]);
  await expect(button).toHaveClass(/playing/);
  const recording = await page.request.get(response.url());
  expect(recording.ok()).toBe(true);
  expect(recording.headers()['content-type']).toContain('audio/');
  expect((await recording.body()).length).toBeGreaterThan(1024);
  await expect(button).toHaveClass(/idle/, { timeout: 20_000 });
  await expect(card.locator('.audio-button')).toHaveCount(1);
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/2');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Incorrectas: 1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await card.screenshot({ path: info.outputPath('mix-bedroom-sentence-audio.png'), animations: 'disabled' });

  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  await expect(card).not.toHaveClass(/is-reversed/);
  await card.getByRole('button', { name: 'Ver ejemplo: 卧室', exact: true }).click();
  await expect(button).toBeVisible();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/2');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l6);
  expect(saved.deck).toEqual(session.deck);
  expect(saved.answers).toEqual(session.answers);
  expect(saved.index).toBe(1);
});

test('Otro ejemplo stops the previous sentence and plays the newly displayed sentence', async ({ page }) => {
  await page.route('**/audio/**', route => route.continue());
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    const recordings: HTMLAudioElement[] = [];
    (window as typeof window & { sentenceRecordings?: HTMLAudioElement[] }).sentenceRecordings = recordings;
    window.Audio = function (source?: string | URL) {
      const audio = new NativeAudio(source === undefined ? undefined : String(source));
      recordings.push(audio);
      return audio;
    } as unknown as typeof Audio;
  });
  const scope = 'l1-l2-l3-l4-l5-l6';
  const session: MixSession = {
    formatVersion: 2, id: 'mix-cycle-sentence-audio', userId: 'guest', scope,
    requestedSize: 10, actualSize: 1, deck: ['v-睡觉'], index: 0,
    revealed: false, paused: false, kind: 'normal', startedAt: Date.now(), answers: [],
  };
  await page.addInitScript(({ key, value }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, value);
  }, { key: vocabularyStorageKey('guest'), value: JSON.stringify({ ...emptyVocabularyState(), sessions: { [scope]: session } }) });
  await ready(page, `/study/${scope}/games/vocabulary-mix`);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  const card = page.getByRole('article', { name: 'Ficha de 睡觉', exact: true });
  await card.getByRole('button', { name: 'Ver ejemplo: 睡觉', exact: true }).click();
  const played: string[] = [];
  const sentences: string[] = [];
  for (const index of [0, 1]) {
    if (index) {
      await card.getByRole('button', { name: /Otro ejemplo/ }).click();
      await expect.poll(() => page.evaluate(() =>
        (window as typeof window & { sentenceRecordings: HTMLAudioElement[] }).sentenceRecordings[0]?.paused)).toBe(true);
    }
    const hanzi = (await card.locator('.vocabulary-example-text').innerText()).trim();
    const pinyin = (await card.locator('.word-pinyin').innerText()).trim();
    expect(hanzi).toContain('睡觉');
    expect(sentences).not.toContain(hanzi);
    sentences.push(hanzi);
    const sources = recordingsForSentence(hanzi, pinyin);
    expect(sources.length, `${hanzi} (${pinyin})`).toBeGreaterThan(0);
    const button = card.locator('.audio-button');
    await expect(button).toHaveAccessibleName(`Escuchar: ${hanzi}`);
    const [response] = await Promise.all([
      page.waitForResponse(response => sources.includes(new URL(response.url()).pathname) && response.status() < 400),
      button.click(),
    ]);
    expect(response.ok()).toBe(true);
    expect(played).not.toContain(response.url());
    played.push(response.url());
    await expect(button).toHaveClass(/playing/);
  }
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { sentenceRecordings: HTMLAudioElement[] }).sentenceRecordings.every(audio => audio.paused))).toBe(true);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions['l1-l2-l3-l4-l5-l6']);
  expect(saved.answers).toHaveLength(0);
  expect(saved.index).toBe(0);
});

async function verifySingleSentenceSleepExamples(page: import('@playwright/test').Page, screenshotPath: string) {
  const card = page.getByRole('article', { name: 'Ficha de 睡觉', exact: true });
  const fields = [card.locator('.vocabulary-example-text'), card.locator('.word-pinyin'), card.locator('.vocabulary-example-translation')];
  const readExample = async () => Promise.all(fields.map(async field => (await field.innerText()).trim()));
  const expected = [
    '明天晚上我和朋友一起看电影，十二点睡觉。',
    "Míngtiān wǎnshang wǒ hé péngyou yìqǐ kàn diànyǐng, shí'èr diǎn shuìjiào.",
    'Mañana por la noche veo una película con amigos y me acuesto a las doce.',
  ];
  const seen = new Set<string>();
  let foundReportedExample = false;
  let completedCycle = false;
  for (let index = 0; index < 20; index += 1) {
    const text = await readExample();
    const key = JSON.stringify(text);
    if (seen.has(key)) { completedCycle = true; break; }
    seen.add(key);
    expect(text[0]).toContain('睡觉');
    for (const field of text) {
      expect(field).not.toMatch(/[\r\n]/u);
      expect(field).not.toMatch(/[。！？.!?][”’」』"'）)»]*\s*[\p{L}\p{N}¿¡（(“«]/u);
    }
    if (text[0] === expected[0]) {
      expect(text).toEqual(expected);
      foundReportedExample = true;
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }
    await card.getByRole('button', { name: /Otro ejemplo/ }).click();
    await expect.poll(async () => JSON.stringify(await readExample())).not.toBe(key);
  }
  expect(completedCycle).toBe(true);
  expect(seen.size).toBeGreaterThan(1);
  expect(foundReportedExample).toBe(true);
}

test('vocabulary catalog keeps every sleep example to one aligned sentence', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await installAudioMock(page);
  await ready(page, '/study/l4/vocabulary?q=睡觉');
  const card = page.getByRole('article', { name: 'Ficha de 睡觉', exact: true });
  await card.getByRole('button', { name: 'Ver ejemplo: 睡觉', exact: true }).click();
  await expect(card).toHaveClass(/is-reversed/);
  await verifySingleSentenceSleepExamples(page, info.outputPath('vocabulary-sleep-single-sentence-mobile.png'));
});

test('Mix reveals and cycles only the relevant sentence for the saved sleep card', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await installAudioMock(page);
  const scope = 'l1-l2-l3-l4-l5-l6';
  const session: MixSession = {
    formatVersion: 2, id: 'mix-sleep-sentence', userId: 'guest', scope,
    requestedSize: 10, actualSize: 1, deck: ['v-睡觉'], index: 0,
    revealed: false, paused: false, kind: 'normal', startedAt: Date.now(), answers: [],
  };
  const raw = JSON.stringify({ ...emptyVocabularyState(), sessions: { [scope]: session } });
  expect(parseVocabularyState(raw).sessions[scope]).toEqual(session);
  await ready(page, `/study/${scope}/games/vocabulary-mix`);
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: vocabularyStorageKey('guest'), value: raw });
  await page.reload();
  await expect(page.locator('.vocabulary-mix-prompt')).toHaveText('睡觉');
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  const card = page.getByRole('article', { name: 'Ficha de 睡觉', exact: true });
  await card.getByRole('button', { name: 'Ver ejemplo: 睡觉', exact: true }).click();
  await expect(card).toHaveClass(/is-reversed/);
  await verifySingleSentenceSleepExamples(page, info.outputPath('mix-sleep-single-sentence-mobile.png'));
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 0/1');
});

test('fixed deck survives reload, completes, reviews misses and starts a new sequence', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await installAudioMock(page);
  await ready(page, '/study/l3/games/vocabulary-mix?q=mascota&favorites=1&page=4&level=basic&mode=image');
  await expect(page).toHaveURL('/study/l3/games/vocabulary-mix');
  await expect(page.getByRole('heading', { level: 1, name: 'Vocabulario Mix' })).toHaveCount(1);
  await expect(page.getByRole('combobox', { name: 'Buscar' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Solo favoritos' })).toHaveCount(0);
  await expect(page.getByText(/palabras disponibles/)).toHaveCount(1);
  await page.screenshot({ path: info.outputPath('mix-setup.png'), fullPage: true });
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 0/10');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Correctas: 0');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Incorrectas: 0');
  await expect(page.locator('.vocabulary-mix-prompt')).toBeVisible();
  const lesson = page.locator('.vocabulary-mix-lesson');
  await expect(lesson).toHaveText('Lección 3');
  await expect(lesson).toBeVisible();
  await expect(page.locator('.word-pinyin')).toHaveCount(0);
  await expect(page.locator('.vocabulary-translation')).toHaveCount(0);
  const original = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(original.deck).toHaveLength(10);
  expect(new Set(original.deck).size).toBe(10);
  await page.screenshot({ path: info.outputPath('mix-question.png'), fullPage: true });
  await expect.poll(() => page.evaluate(() => (window as typeof window & { mixAudioPlays?: number }).mixAudioPlays ?? 0)).toBe(1);

  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  const card = page.getByRole('article', { name: /Ficha de/ });
  await expect(card).toBeVisible();
  await expect(lesson).toHaveText('Lección 3');
  await page.screenshot({ path: info.outputPath('mix-answer.png'), fullPage: true });
  await expect(card.getByRole('button', { name: /Favorito:/ })).toHaveCount(0);
  const flip = card.getByRole('button', { name: /Ver ejemplo:/ });
  if (await flip.count()) {
    await flip.click();
    await expect(card).toHaveClass(/is-reversed/);
    await expect(lesson).toHaveText('Lección 3');
    await page.screenshot({ path: info.outputPath('mix-reverse.png'), fullPage: true });
  }
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/10');
  await expect(page.locator('.word-pinyin')).toHaveCount(0);

  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Partida en pausa' })).toBeVisible();
  await expect(lesson).toHaveText('Lección 3');
  await page.reload();
  await expect(lesson).toHaveText('Lección 3');
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  await expect(lesson).toHaveText('Lección 3');
  const resumed = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(resumed.deck).toEqual(original.deck);
  expect(resumed.index).toBe(1);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await page.getByRole('button', { name: 'No lo sabía', exact: true }).dblclick();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 2/10');
  const afterDouble = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(afterDouble.answers).toHaveLength(2);
  expect(afterDouble.index).toBe(2);
  expect(afterDouble.revealed).toBe(false);
  expect(afterDouble.deck).toEqual(original.deck);

  for (let index = 2; index < 10; index += 1) {
    const reveal = page.getByRole('button', { name: 'Ver respuesta', exact: true });
    if (index === 2) await reveal.press('Enter');
    else await reveal.click();
    await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Partida terminada' })).toBeVisible();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 10/10');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Correctas: 9');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Incorrectas: 1');
  await page.screenshot({ path: info.outputPath('mix-results.png'), fullPage: true });

  await page.getByRole('button', { name: 'Repasar incorrectas (1)' }).click();
  await expect(lesson).toHaveText('Lección 3');
  const review = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(review.kind).toBe('review');
  expect(review.deck).toHaveLength(1);
  expect(review.originResult.sessionId).toBe(original.id);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Partida terminada' })).toBeVisible();
  await page.getByRole('button', { name: 'Nueva partida' }).click();
  const next = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(next.id).not.toBe(original.id);
  expect(next.deck).toHaveLength(10);
  expect(next.deck).not.toEqual(original.deck);
  expect(next.kind).toBe('normal');
  expect(errors).toEqual([]);
});

test('general review shows the current word lesson across answers and a saved pause', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await installAudioMock(page);
  const scope = 'l1-l2-l3-l4-l5-l6';
  const session: MixSession = {
    formatVersion: 2, id: 'mix-lesson-context', userId: 'guest', scope,
    requestedSize: 10, actualSize: 2, deck: ['v-你', 'v-厨房'], index: 0,
    revealed: false, paused: false, kind: 'normal', startedAt: Date.now(), answers: [],
  };
  const state = { ...emptyVocabularyState(), sessions: { [scope]: session } };
  const raw = JSON.stringify(state);
  expect(parseVocabularyState(raw).sessions[scope]).toEqual(session);
  await ready(page, `/study/${scope}/games/vocabulary-mix`);
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: vocabularyStorageKey('guest'), value: raw });
  await page.reload();

  const lesson = page.locator('.vocabulary-mix-lesson');
  await expect(page.locator('.vocabulary-mix-round-header')).toContainText('Repaso general');
  await expect(page.locator('.vocabulary-mix-prompt')).toHaveText('你');
  await expect(lesson).toHaveText('Lección 1');
  await expect(lesson).toBeVisible();
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect(lesson).toHaveText('Lección 1');
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();

  await expect(page.locator('.vocabulary-mix-prompt')).toHaveText('厨房');
  await expect(lesson).toHaveText('Lección 6');
  await expect(lesson).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('mix-general-current-lesson-mobile.png'), fullPage: true });
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await expect(lesson).toHaveText('Lección 6');
  await page.reload();
  await expect(lesson).toHaveText('Lección 6');
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-prompt')).toHaveText('厨房');
  await expect(lesson).toHaveText('Lección 6');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/2');
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect(lesson).toHaveText('Lección 6');
});

test('blocked autoplay keeps manual audio and score untouched', async ({ page }) => {
  await installAudioMock(page, true);
  await ready(page);
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await expect(page.getByText('Pulsa el audio para escuchar.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Escuchar/ })).toBeVisible();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 0/10');
  await page.getByRole('button', { name: /Escuchar/ }).click();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 0/10');
});

test('mobile Mix keeps controls reachable without horizontal overflow', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await installAudioMock(page);
  await ready(page, '/study/l1-l2/games/vocabulary-mix');
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  const actions = page.locator('.vocabulary-evaluation button');
  await expect(actions).toHaveCount(2);
  await expect(actions.nth(0)).toContainText('知道');
  await expect(actions.nth(0)).toContainText('Lo sabía');
  await expect(actions.nth(1)).toContainText('不知道');
  await expect(actions.nth(1)).toContainText('No lo sabía');
  for (const button of await actions.all()) {
    const box = await button.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('mix-mobile-revealed.png'), fullPage: true });
});

test('a saved Mix round shows the kitchen image, preserves progress and respects withdrawal', async ({ page }, info) => {
  const vocabularyMedia = JSON.parse(readFileSync(new URL('../../data/corpus-completion-media.json', import.meta.url), 'utf8')) as VocabularyMediaEntry[];
  const image = vocabularyMedia.find(entry => entry.wordId === 'v-厨房' && entry.status === 'approved');
  expect(image, 'The kitchen must have a reviewed production image').toBeDefined();
  const words = lesson6.vocabulary as ActiveWord[];
  const kitchen = words.find(word => word.id === 'v-厨房')!;
  const otherWords = words.filter(word => word.id !== kitchen.id).slice(0, 29);
  const deck = [...otherWords.slice(0, 15), kitchen, ...otherWords.slice(15)].map(word => word.id);
  const session = startMix({ words, scope: 'l6', requestedSize: 30, userId: 'guest', id: 'saved-kitchen-round', now: 1795123200000 });
  session.deck = deck;
  session.index = 15;
  session.revealed = true;
  session.answers = deck.slice(0, 15).map((wordId, index) => ({
    id: `${session.id}:${index}:${wordId}`, wordId, known: index < 6, answeredAt: session.startedAt + index,
  }));
  const state = { ...emptyVocabularyState(), favorites: [kitchen.id], sessions: { l6: session } };
  await page.addInitScript(saved => {
    if (!localStorage.getItem('ming-vocabulary-v1:guest')) localStorage.setItem('ming-vocabulary-v1:guest', JSON.stringify(saved));
  }, state);
  await installAudioMock(page);
  let published = true;
  await page.route('**/api/vocabulary/images', route => route.fulfill({
    json: vocabularyMedia.filter(entry => entry.status === 'approved' && (published || entry.wordId !== kitchen.id)),
  }));
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, '/study/l6/games/vocabulary-mix');
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  const card = page.getByRole('article', { name: 'Ficha de 厨房', exact: true });
  const photo = card.locator('img');
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute('loading', 'eager');
  await expect.poll(() => photo.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 15/30');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Correctas: 6');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Incorrectas: 9');
  await expect(card.locator('.word-pinyin')).toContainText('chúfáng');
  await expect(card.locator('.vocabulary-translation')).toContainText('cocina');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('mix-kitchen-image-mobile.png'), fullPage: true });

  await page.reload();
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  const resumed = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  expect(resumed.sessions.l6).toEqual(session);
  expect(resumed.favorites).toEqual([kitchen.id]);
  await card.getByRole('button', { name: 'Ver ejemplo: 厨房', exact: true }).click();
  await expect(card.locator('.vocabulary-example-text')).not.toBeEmpty();
  await card.getByRole('button', { name: 'Ver palabra: 厨房', exact: true }).click();
  await expect(photo).toBeVisible();

  published = false;
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(photo).toHaveCount(0);
  await expect(card.locator('.vocabulary-translation')).toContainText('cocina');
  published = true;
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(photo).toBeVisible();
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 16/30');
  const advanced = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l6);
  expect(advanced.deck).toEqual(deck);
  expect(advanced.answers).toHaveLength(16);
  expect(advanced.answers[15]).toMatchObject({ wordId: kitchen.id, known: true });
});
