import Image from 'next/image';
import { useState } from 'react';
import { vocabularyImageSources } from '@/lib/vocabulary-image-sizes';

export function VocabularyPhoto({ src, alt, onError, transparent = false, priority = false }: { src: string; alt: string; onError: () => void; transparent?: boolean; priority?: boolean }) {
  const responsive = vocabularyImageSources(src);
  const [failedResponsiveSrc, setFailedResponsiveSrc] = useState<string | null>(null);
  const useResponsive = Boolean(responsive && failedResponsiveSrc !== src);
  const sizes = transparent ? '(max-width: 428px) calc(100vw - 28px), 400px' : '(max-width: 428px) calc((100vw - 28px) / 1.618), 248px';
  return <span className={`vocabulary-photo vocabulary-photo--${transparent ? 'transparent' : 'studio'}`}>
    <picture>
      {useResponsive && <source type="image/webp" srcSet={responsive!.srcSet} sizes={sizes}/>}
      <Image key={`${src}:${useResponsive}`} unoptimized className="vocabulary-thumbnail" src={src} alt={alt}
        width={responsive?.width ?? (transparent ? 1618 : 640)} height={responsive?.height ?? (transparent ? 1000 : 640)}
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} onError={() => {
          // A missing derivative must not hide an approved, working original.
          // Remount without <source> once; only a failed original hides the photo.
          if (useResponsive) setFailedResponsiveSrc(src);
          else onError();
        }}/>
    </picture>
  </span>;
}
