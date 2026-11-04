import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import manifest from '@/data/vocabulary-image-sizes.json';
import { vocabularyImageSources } from '@/lib/vocabulary-image-sizes';
import { vocabularyMedia } from '@/lib/vocabulary-media';

const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('static responsive vocabulary images', () => {
  it('binds derivatives to the reviewed master and refuses stale versions', () => {
    const [src, entry] = Object.entries(manifest.entries)[0];
    expect(vocabularyImageSources(`${src}?v=${entry.sha256}`)?.srcSet).toContain('400w');
    expect(vocabularyImageSources(src)?.srcSet).toContain(`${src} ${entry.width}w`);
    expect(vocabularyImageSources(`${src}?v=${'0'.repeat(64)}`)).toBeUndefined();
    expect(vocabularyImageSources('/missing.webp')).toBeUndefined();
  });

  it('serves smaller, content-addressed files preserving proportions and transparency', async () => {
    let originalBytes = 0;
    let cardBytes = 0;
    for (const [src, entry] of Object.entries(manifest.entries)) {
      const master = readFileSync(`public${src}`);
      expect(hash(master)).toBe(entry.sha256);
      expect(vocabularyMedia.some(image => image.src === src && image.sha256 === entry.sha256 && image.status === 'approved')).toBe(true);
      const original = await sharp(master).metadata();
      for (const variant of entry.variants) {
        const bytes = readFileSync(`public${variant.src}`);
        expect(variant.src).toBe(`/images/vocabulary/responsive/${hash(bytes)}.webp`);
        expect(bytes.length).toBe(variant.bytes);
        expect(bytes.length).toBeLessThan(master.length);
        const metadata = await sharp(bytes).metadata();
        expect(metadata.width).toBe(variant.width);
        expect(metadata.height).toBe(Math.round(entry.height * variant.width / entry.width));
        expect(metadata.hasAlpha).toBe(original.hasAlpha);
      }
      originalBytes += master.length;
      cardBytes += (entry.variants.find(variant => variant.width >= 800) ?? entry.variants.at(-1))!.bytes;
    }
    expect(cardBytes).toBeLessThan(originalBytes * 0.4);
  });
});
