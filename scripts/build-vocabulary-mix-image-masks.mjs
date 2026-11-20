// Build render-only masks for Latin labels in approved Mix support images.
// No SVG, raster image, catalog entry or source corpus is changed.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = async relative => JSON.parse(await readFile(path.join(root, relative), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const check = process.argv.includes('--check');
const destination = path.join(root, 'data/vocabulary-mix-image-masks.json');
const width = 1618;
const height = 1000;
const padding = 10;

// This is the same last-entry-wins merge order as lib/vocabulary-media.ts.
const catalogs = [
  'vocabulary-media', 'lesson4-media', 'lesson5-media', 'lessons123-media',
  'lessons123-context-media', 'lessons123-generated-media', 'lessons123-pedagogy-media',
  'lessons123-geography-media', 'corpus-completion-media', 'corpus-completion-diagrams-media',
];
const catalog = [...new Map((await Promise.all(catalogs.map(name => readJson(`data/${name}.json`))))
  .flat().map(entry => [entry.wordId, entry])).values()]
  .filter(entry => entry.status === 'approved' && entry.src && entry.sha256);
const reviews = (await readJson('docs/corpus-completion-diagrams-review.json')).entries;
const diagramSources = new Map(reviews.map(entry => [entry.src, entry]));
const lesson4Recipes = await readJson('scripts/lesson4-image-recipes.json');
const lesson4Entries = new Map((await readJson('data/lesson4-media.json')).map(entry => [entry.src, entry]));

// Reviewed scalar bounds for the only annotated photographic asset, at its
// original canvas size. These rectangles remove jìn and entrar, preserving the
// Hanzi and the directional arrow. Bound to the exact immutable image bytes.
const manual = {
  '/images/vocabulary/lessons123/enter-annotated-fdac871d6446.webp': {
    sha256: 'fdac871d6446ea57ed1e862b75be4870cfe67de2f8d913e3c459ba19598e1d93',
    rects: [
      { x: 1009, y: 185, width: 171, height: 139 },
      { x: 1102, y: 476, width: 155, height: 49 },
    ],
  },
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.route('**/*', route => route.abort()); // Source SVG inspection stays offline.
const masks = {};
const counts = { svgSources: 0, reconstructedLabels: 0, manualImages: 0, countDiagrams: 0, maskedImages: 0, rectangles: 0 };

try {
  for (const entry of catalog.sort((left, right) => left.src < right.src ? -1 : left.src > right.src ? 1 : 0)) {
    if (masks[entry.src]) continue;
    let rects = null;
    let svgPath = null;
    let svgText = null;
    const reviewed = diagramSources.get(entry.src);
    if (reviewed) {
      svgPath = reviewed.source;
    } else if (entry.src.endsWith('.svg')) {
      svgPath = `public${entry.src}`;
    } else if (/\/lessons123-(pedagogy|context)\//.test(entry.src)) {
      svgPath = `public${entry.src.replace(/\.webp$/, '.svg')}`;
    } else if (/\/lessons123\/count-(8|100|1000|20|25)-[a-f0-9]+\.webp$/.test(entry.src)) {
      // prepare-lessons123-diagrams.mjs retains no SVG source. Its pinyin is
      // centered at x1120, baseline270, font50. This band leaves the numeral
      // (baseline210) and all count marks intact, including the 1000-dot grid.
      rects = [{ x: 700, y: 215, width: 840, height: 65 }];
      counts.countDiagrams += 1;
    } else if (manual[entry.src]) {
      if (entry.sha256 !== manual[entry.src].sha256) throw new Error(`Manual mask hash changed: ${entry.src}`);
      rects = manual[entry.src].rects;
      counts.manualImages += 1;
    } else if (lesson4Entries.has(entry.src) && entry.model === 'deterministic-svg') {
      // These sources are described in complete-lesson4-images.mjs but their
      // SVG files were not retained. Reconstruct only the text node for bounds;
      // no image is generated or changed, and numeric-only labels stay visible.
      const recipe = lesson4Recipes[entry.wordId];
      const label = recipe?.kind === 'timeline' ? { x: 1150, y: 495, size: 46, text: 'HOY' }
        : recipe?.kind === 'day-period' ? { x: 1155, y: 360, size: 48, text: '24 h' }
          : recipe?.kind === 'clock' && recipe.minutes ? { x: 1160, y: 880, size: 65, text: `${recipe.minutes} min` } : null;
      if (label) {
        svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="1618" height="1000" viewBox="0 0 1618 1000"><text x="${label.x}" y="${label.y}" font-family="Arial,sans-serif" font-size="${label.size}" text-anchor="middle">${label.text}</text></svg>`;
        counts.reconstructedLabels += 1;
      }
    }

    if (svgPath) {
      const sourcePath = path.resolve(root, svgPath);
      if (!sourcePath.startsWith(`${path.join(root, 'public')}${path.sep}`)) throw new Error(`SVG source escapes public: ${svgPath}`);
      const svgBytes = await readFile(sourcePath);
      if (reviewed?.sourceSha256 && hash(svgBytes) !== reviewed.sourceSha256) throw new Error(`SVG source hash mismatch: ${svgPath}`);
      svgText = svgBytes.toString('utf8');
      counts.svgSources += 1;
    }
    if (svgText) {
      await page.setContent(`<style>html,body{margin:0;padding:0}body>svg{display:block}</style>${svgText}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      rects = await page.evaluate(({ padding, width, height }) => {
        const rootSvg = document.querySelector('body > svg');
        if (!rootSvg) throw new Error('Missing source SVG');
        const box = rootSvg.hasAttribute('viewBox') ? rootSvg.viewBox.baseVal
          : { x: 0, y: 0, width: rootSvg.width.baseVal.value, height: rootSvg.height.baseVal.value };
        if (box.x !== 0 || box.y !== 0 || box.width !== width || box.height !== height) {
          throw new Error(`Unexpected SVG canvas: ${box.x} ${box.y} ${box.width} ${box.height}`);
        }
        const rootTransform = rootSvg.getScreenCTM();
        if (!rootTransform) throw new Error('Missing SVG root transform');
        return [...rootSvg.querySelectorAll('text')]
          .filter(element => /\p{Script=Latin}/u.test(element.textContent ?? ''))
          .map(element => {
            const bounds = element.getBBox();
            const textTransform = element.getScreenCTM();
            if (!textTransform) throw new Error('Missing SVG text transform');
            // getScreenCTM includes nested <svg> viewports as well as group
            // transforms; root inverse maps that result into original pixels.
            const matrix = rootTransform.inverse().multiply(textTransform);
            const corners = [
              [bounds.x, bounds.y], [bounds.x + bounds.width, bounds.y],
              [bounds.x, bounds.y + bounds.height], [bounds.x + bounds.width, bounds.y + bounds.height],
            ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
            const x = Math.max(0, Math.floor(Math.min(...corners.map(point => point.x)) - padding));
            const y = Math.max(0, Math.floor(Math.min(...corners.map(point => point.y)) - padding));
            const right = Math.min(width, Math.ceil(Math.max(...corners.map(point => point.x)) + padding));
            const bottom = Math.min(height, Math.ceil(Math.max(...corners.map(point => point.y)) + padding));
            return { x, y, width: right - x, height: bottom - y };
          }).filter(rect => rect.width > 0 && rect.height > 0);
      }, { padding, width, height });
    }
    if (!rects?.length) continue;
    const bytes = await readFile(path.join(root, 'public', entry.src));
    if (hash(bytes) !== entry.sha256) throw new Error(`Image hash mismatch: ${entry.src}`);
    rects.sort((left, right) => left.y - right.y || left.x - right.x || left.width - right.width || left.height - right.height);
    masks[entry.src] = { sha256: entry.sha256, width, height, rects };
    counts.maskedImages += 1;
    counts.rectangles += rects.length;
  }
} finally {
  await browser.close();
}

const encoded = `${JSON.stringify(masks, null, 2)}\n`;
if (check) {
  if (await readFile(destination, 'utf8') !== encoded) throw new Error('Mix image masks are stale. Run node scripts/build-vocabulary-mix-image-masks.mjs');
} else {
  await writeFile(destination, encoded);
}
console.log(JSON.stringify({ checked: check, ...counts }));
