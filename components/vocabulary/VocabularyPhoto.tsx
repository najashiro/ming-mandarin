import Image from 'next/image';

// Existing square studio assets stay intact until new photographs are authorized.
// Their whole square is fitted by height, with a CSS fade at the left edge only.
export function VocabularyPhoto({ src, alt, onError }: { src: string; alt: string; onError: () => void }) {
  return <span className="vocabulary-photo vocabulary-photo--studio">
    <Image unoptimized className="vocabulary-thumbnail" src={src} alt={alt}
      width={640} height={640} loading="lazy" onError={onError}/>
  </span>;
}
