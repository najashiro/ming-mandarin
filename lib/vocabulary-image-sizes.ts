import manifest from '@/data/vocabulary-image-sizes.json';

type ImageSizes = { sha256: string; width: number; height: number; variants: { width: number; src: string; bytes: number }[] };
const entries: Record<string, ImageSizes> = manifest.entries;

export function vocabularyImageSources(src: string) {
  const [pathname, query] = src.split('?');
  const entry = entries[pathname];
  const version = new URLSearchParams(query).get('v');
  // An old derivative must never replace a newly reviewed version of the master.
  if (!entry || (version && version !== entry.sha256)) return undefined;
  return {
    srcSet: [...entry.variants.map(variant => `${variant.src} ${variant.width}w`), `${src} ${entry.width}w`].join(', '),
    width: entry.width,
    height: entry.height,
  };
}
