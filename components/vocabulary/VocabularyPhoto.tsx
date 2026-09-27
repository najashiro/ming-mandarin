import Image from 'next/image';

export function VocabularyPhoto({ src, alt, onError, transparent = false }: { src: string; alt: string; onError: () => void; transparent?: boolean }) {
  return <span className={`vocabulary-photo vocabulary-photo--${transparent ? 'transparent' : 'studio'}`}>
    <Image unoptimized className="vocabulary-thumbnail" src={src} alt={alt}
      width={transparent ? 1618 : 640} height={transparent ? 1000 : 640} loading="lazy" onError={onError}/>
  </span>;
}
