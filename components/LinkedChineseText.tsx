import Link from 'next/link';
import { Hanzi } from '@/components/Hanzi';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';

const chineseCharacter = /^\p{Script=Han}$/u;

export function LinkedChineseText({ text, returnTo, disabled = false }: { text: string; returnTo?: string; disabled?: boolean }) {
  return <span className="linked-chinese-text">{Array.from(text).map((character, index) => {
    if (disabled || !chineseCharacter.test(character)) return <Hanzi key={`${index}-${character}`}>{character}</Hanzi>;
    const resolved = resolveHanziGlyph(character);
    if (resolved.kind === 'unavailable') return <Hanzi key={`${index}-${character}`}>{character}</Hanzi>;
    const join = resolved.href.includes('?') ? '&' : '?';
    const href = returnTo ? `${resolved.href}${join}returnTo=${encodeURIComponent(returnTo)}` : resolved.href;
    return <Link className="linked-hanzi" href={href} key={`${index}-${character}`} aria-label={`Abrir ficha de ${character}`}><Hanzi>{character}</Hanzi></Link>;
  })}</span>;
}
