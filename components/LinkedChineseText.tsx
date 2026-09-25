import Link from 'next/link';
import { Hanzi } from '@/components/Hanzi';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';

const chineseCharacter = /^\p{Script=Han}$/u;

export function LinkedChineseText({ text, returnTo, disabled = false, newTab = false }: { text: string; returnTo?: string; disabled?: boolean; newTab?: boolean }) {
  return <span className="linked-chinese-text">{Array.from(text).map((character, index) => {
    if (disabled || !chineseCharacter.test(character)) return <Hanzi key={`${index}-${character}`}>{character}</Hanzi>;
    const resolved = resolveHanziGlyph(character);
    if (resolved.kind === 'unavailable') return <Hanzi key={`${index}-${character}`}>{character}</Hanzi>;
    const join = resolved.href.includes('?') ? '&' : '?';
    let safeReturn: string | undefined;
    try { const url = new URL(returnTo ?? '', 'https://ming.local'); if (returnTo?.startsWith('/') && !returnTo.startsWith('//') && url.origin === 'https://ming.local' && !url.pathname.startsWith('/api/')) safeReturn = `${url.pathname}${url.search}${url.hash}`; } catch { /* Ignore unsafe return destinations. */ }
    const href = safeReturn ? `${resolved.href}${join}returnTo=${encodeURIComponent(safeReturn)}` : resolved.href;
    return <Link className="linked-hanzi" href={href} scroll={false} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} key={`${index}-${character}`} aria-label={`Abrir ficha de ${character}${newTab ? ' (pestaña nueva)' : ''}`}><Hanzi>{character}</Hanzi></Link>;
  })}</span>;
}
