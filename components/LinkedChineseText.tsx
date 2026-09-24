import Link from 'next/link';
import { Hanzi } from '@/components/Hanzi';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';

const chineseCharacter = /^\p{Script=Han}$/u;

export function LinkedChineseText({ text, returnTo, disabled = false }: { text: string; returnTo?: string; disabled?: boolean }) {
  return <Hanzi>{Array.from(text).map((character, index) => {
    if (disabled || !chineseCharacter.test(character)) return character;
    const resolved = resolveHanziGlyph(character);
    if (resolved.kind === 'unavailable') return character;
    const join = resolved.href.includes('?') ? '&' : '?';
    const href = returnTo ? `${resolved.href}${join}returnTo=${encodeURIComponent(returnTo)}` : resolved.href;
    return <Link className="linked-hanzi" href={href} key={`${index}-${character}`} aria-label={`Abrir ficha de ${character}`}>{character}</Link>;
  })}</Hanzi>;
}

