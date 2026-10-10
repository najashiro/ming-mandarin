import { expect, test, type Page } from '@playwright/test';
import { PANDA_CHALLENGES } from '../../data/panda-quest';
import {
  PANDA_WORLDS, QUEST_STORAGE_KEY, getQuestTile, getQuestWorld,
  type Direction, type Position, type WorldId,
} from '../../lib/panda-quest';

const movement: { direction: Direction; dx: number; dy: number; key: string; label: string }[] = [
  { direction: 'up', dx: 0, dy: -1, key: 'ArrowUp', label: 'Mover arriba' },
  { direction: 'down', dx: 0, dy: 1, key: 'ArrowDown', label: 'Mover abajo' },
  { direction: 'left', dx: -1, dy: 0, key: 'ArrowLeft', label: 'Mover izquierda' },
  { direction: 'right', dx: 1, dy: 0, key: 'ArrowRight', label: 'Mover derecha' },
];
type Step = { direction: Direction; position: Position; tile: string };
const screenshotStyle = '.topbar,.mobile-nav{visibility:hidden!important}';

function positionKey(position: Position) { return `${position.x},${position.y}`; }

function locate(worldId: WorldId, tile: string): Position {
  const map = getQuestWorld(worldId).map;
  const y = map.findIndex(row => row.includes(tile));
  return { x: map[y].indexOf(tile), y };
}

// Find a route from the public map, then exercise each move through the UI.
function routeTo(worldId: WorldId, target: string): Step[] {
  const start = locate(worldId, 'S');
  const end = locate(worldId, target);
  const queue = [{ position: start, steps: [] as Step[] }];
  const visited = new Set([positionKey(start)]);
  while (queue.length) {
    const { position, steps } = queue.shift()!;
    if (positionKey(position) === positionKey(end)) return steps;
    for (const { direction, dx, dy } of movement) {
      const next = { x: position.x + dx, y: position.y + dy };
      const tile = getQuestTile(worldId, next);
      const key = positionKey(next);
      if (tile === '#' || visited.has(key)) continue;
      visited.add(key);
      queue.push({ position: next, steps: [...steps, { direction, position: next, tile }] });
    }
  }
  throw new Error(`No hay camino al destino ${target} del mundo ${worldId}`);
}

async function activeChallenge(page: Page) {
  const encounter = page.locator('.pq-encounter');
  await expect(encounter).toHaveAttribute('data-challenge', /.+/);
  const id = await encounter.getAttribute('data-challenge');
  const challenge = PANDA_CHALLENGES.find(item => item.id === id);
  expect(challenge, `El reto ${id} debe existir en el corpus del juego`).toBeDefined();
  return challenge!;
}

async function assertNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
}

test('Panda Quest aparece después de Qué hora es y abre sus cuatro mundos', async ({ page, isMobile }, info) => {
  if (!isMobile) await page.setViewportSize({ width: 1366, height: 1000 });
  await page.goto('/study/l1/games');
  const ids = await page.locator('[data-game]').evaluateAll(items => items.map(item => item.getAttribute('data-game')));
  expect(ids).toContain('hora');
  expect(ids.indexOf('panda-quest')).toBe(ids.indexOf('hora') + 1);
  await page.locator('[data-game="panda-quest"]').getByRole('button', { name: /Jugar/ }).click();
  await expect(page.locator('.pq-menu')).toBeVisible();
  await expect(page.locator('.pq-world')).toHaveCount(4);
  await expect(page.getByRole('button', { name: /^Explorar mundo 1:/ })).toBeEnabled();
  for (const id of [2, 3, 4]) {
    await expect(page.getByRole('button', { name: new RegExp(`^Explorar mundo ${id}:`) })).toBeDisabled();
  }
  await page.locator('.pq-menu').screenshot({ style: screenshotStyle, path: info.outputPath(`panda-menu-${isMobile ? 'mobile' : '1366'}.png`) });
  await page.getByRole('button', { name: /^Explorar mundo 1:/ }).click();
  await expect(page.locator('.pq-board')).toBeVisible();
  await page.locator('.pq-playing').screenshot({ style: screenshotStyle, path: info.outputPath(`panda-maze-${isMobile ? 'mobile' : '1366'}.png`) });
});

test('el panda supera cuatro mundos acumulativos, aprende de un error y conserva su avance', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/study/l1/games?game=panda-quest');
  await page.getByRole('button', { name: /^Explorar mundo 1:/ }).click();
  const board = page.locator('.pq-board');

  for (const world of PANDA_WORLDS) {
    await expect(board).toHaveAttribute('data-world', String(world.id));
    await expect(board).toHaveAttribute('data-position', positionKey(locate(world.id, 'S')));
    const encounteredLessons: number[] = [];
    let previousPosition = positionKey(locate(world.id, 'S'));

    for (const step of routeTo(world.id, 'E')) {
      const control = movement.find(item => item.direction === step.direction)!;
      await board.press(control.key);
      if (world.gateIds.some(gate => gate === step.tile)) {
        const challenge = await activeChallenge(page);
        encounteredLessons.push(challenge.lesson);
        await expect(board).toHaveAttribute('data-position', previousPosition);
        await expect(page.locator('.pq-encounter h4')).toBeFocused();
        for (const item of movement) {
          await expect(page.getByRole('button', { name: item.label, exact: true })).toBeDisabled();
        }

        if (world.id === 1 && step.tile === 'A') {
          const wrong = challenge.options.find(option => option.id !== challenge.answerId)!;
          await page.locator(`.pq-options button[data-option="${wrong.id}"]`).click();
          await expect(page.locator('.pq-feedback')).toContainText('Todavía no');
          await expect(board).toHaveAttribute('data-position', previousPosition);
          await expect(page.locator('.pq-hud')).toContainText('0/3');
          expect(await page.locator('.pq-options button').evaluateAll(options =>
            options.every(option => (option as HTMLButtonElement).disabled))).toBe(true);
          await board.press(control.key);
          await expect(board).toHaveAttribute('data-position', previousPosition);
          await page.getByRole('button', { name: 'Volver a intentarlo', exact: true }).click();
          await expect(page.locator('.pq-feedback')).toHaveCount(0);
          await expect(page.locator(`.pq-options button[data-option="${challenge.answerId}"]`)).toBeEnabled();
        }

        await page.locator(`.pq-options button[data-option="${challenge.answerId}"]`).click();
        await expect(page.locator('.pq-feedback')).toContainText('¡Muy bien!');
        await expect(board).toHaveAttribute('data-position', previousPosition);
        await page.getByRole('button', { name: 'Abrir paso →', exact: true }).click();
        await expect(board).toBeFocused();
      }
      previousPosition = positionKey(step.position);
      if (step.tile !== 'E') await expect(board).toHaveAttribute('data-position', previousPosition);
    }

    expect([...new Set(encounteredLessons)].sort()).toEqual(world.lessons);
    await expect(page.locator('.pq-finish')).toBeVisible();
    await expect(page.locator('.pq-finish')).toContainText(`MUNDO ${world.id} COMPLETADO`);
    await expect(page.locator('.pq-stars')).toHaveAttribute('aria-label', `${world.id === 1 ? 2 : 3} de 3 estrellas`);
    await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').completedWorlds, QUEST_STORAGE_KEY))
      .toEqual(PANDA_WORLDS.slice(0, world.id).map(item => item.id));
    if (world.id < 4) await page.getByRole('button', { name: `Explorar mundo ${world.id + 1} →`, exact: true }).click();
  }

  await expect(page.locator('.pq-finish')).toContainText('¡El panda ha vuelto a casa!');
  await page.reload();
  await expect(page.locator('.pq-menu')).toBeVisible();
  await expect(page.locator('.pq-route-heading')).toContainText('4 / 4 mundos');
  for (const world of PANDA_WORLDS) {
    await expect(page.getByRole('button', { name: new RegExp(`^Repetir mundo ${world.id}:`) })).toBeEnabled();
  }
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').bestStars, QUEST_STORAGE_KEY))
    .toEqual({ 1: 2, 2: 3, 3: 3, 4: 3 });
});

test('a 320px se puede jugar por toque y teclado sin desbordes', async ({ page, isMobile }, info) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/study/l1/games?game=panda-quest');
  await expect(page.locator('.pq-menu')).toBeVisible();
  await assertNoOverflow(page);
  await page.locator('.pq-menu').screenshot({ style: screenshotStyle, path: info.outputPath('panda-menu-320.png') });
  await page.getByRole('button', { name: /^Explorar mundo 1:/ }).click();
  const board = page.locator('.pq-board');
  await expect(board).toBeFocused();
  await board.press('ArrowUp');
  await expect(board).toHaveAttribute('data-position', '1,1');
  await board.press('d');
  await expect(board).toHaveAttribute('data-position', '2,1');
  const left = page.getByRole('button', { name: 'Mover izquierda', exact: true });
  if (isMobile) await left.tap(); else await left.click();
  await expect(board).toHaveAttribute('data-position', '1,1');
  await assertNoOverflow(page);
  for (const box of await page.locator('.pq-dpad button').evaluateAll(buttons => buttons.map(button => {
    const rect = button.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }))) {
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await page.locator('.pq-playing').screenshot({ style: screenshotStyle, path: info.outputPath('panda-maze-320.png') });

  for (const step of routeTo(1, 'A')) {
    const control = page.getByRole('button', { name: movement.find(item => item.direction === step.direction)!.label, exact: true });
    if (isMobile) await control.tap(); else await control.click();
  }
  const challenge = await activeChallenge(page);
  await expect(page.locator('.pq-reading')).toHaveText(challenge.pinyin);
  await page.getByRole('checkbox', { name: 'Mostrar pinyin' }).uncheck();
  await expect(page.locator('.pq-reading')).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Mostrar pinyin' }).check();
  for (const height of await page.locator('.pq-options button').evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().height))) {
    expect(height).toBeGreaterThanOrEqual(44);
  }
  await assertNoOverflow(page);
  await page.locator('.pq-playing').screenshot({ style: screenshotStyle, path: info.outputPath('panda-encounter-320.png') });
});
