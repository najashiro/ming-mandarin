// Apply the per-asset review performed on 2026-11-04. Existing DB withdrawals
// always override this local selection through resolvePublishedImages.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const hash = value => createHash('sha256').update(value).digest('hex');
const review = JSON.parse(await fs.readFile('docs/lessons123-image-review.json', 'utf8'));
const media = JSON.parse(await fs.readFile('data/vocabulary-media.json', 'utf8'));
for (const decision of review.entries) {
  const entry = media.find(row => row.wordId === decision.wordId);
  if (!entry || entry.sha256 !== decision.sha256 || entry.promptSha256 !== decision.promptSha256) throw new Error(`Stale review: ${decision.wordId}`);
  const bytes = await fs.readFile(`public${entry.src}`);
  if (hash(bytes) !== entry.sha256) throw new Error(`Changed asset: ${entry.wordId}`);
  if (decision.status === 'approved') {
    const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
    if (info.channels !== 4) throw new Error(`Missing alpha: ${entry.wordId}`);
    const corners = [3, (info.width - 1) * 4 + 3, ((info.height - 1) * info.width) * 4 + 3, data.length - 1];
    if (corners.some(i => data[i] !== 0)) throw new Error(`Opaque corners: ${entry.wordId}`);
  }
  entry.status = decision.status;
  entry.review = `2026-11-04 · Revisión visual por Codex, sin validación humana independiente. ${decision.reason}`;
}
await fs.writeFile('data/vocabulary-media.json', JSON.stringify(media, null, 2) + '\n');
console.log({ reviewed: review.entries.length, approved: review.entries.filter(x => x.status === 'approved').length });
