import Link from 'next/link';
import { Hanzi } from '@/components/Hanzi';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';

const chineseCharacter = /^\p{Script=Han}$/u;

type LinkedChineseTextProps = {
  text: string;
  returnTo?: string;
  disabled?: boolean;
  newTab?: boolean;
  dialogueReadings?: readonly (string | undefined)[];
};

export function LinkedChineseText({ text, returnTo, disabled = false, newTab = false, dialogueReadings }: LinkedChineseTextProps) {
  return <span className="linked-chinese-text">{Array.from(text).map((character, index) => {
    const key = `${index}-${character}`;
    if (!chineseCharacter.test(character)) return <Hanzi key={key}>{character}</Hanzi>;
    const reading = dialogueReadings?.[index];
    const resolved = disabled ? undefined : resolveHanziGlyph(character);
    if (!resolved || resolved.kind === 'unavailable') {
      return reading
        ? <span data-dialogue-pinyin={reading} tabIndex={0} key={key}><Hanzi>{character}</Hanzi></span>
        : <Hanzi key={key}>{character}</Hanzi>;
    }
    const join = resolved.href.includes('?') ? '&' : '?';
    let safeReturn: string | undefined;
    try { const url = new URL(returnTo ?? '', 'https://ming.local'); if (returnTo?.startsWith('/') && !returnTo.startsWith('//') && url.origin === 'https://ming.local' && !url.pathname.startsWith('/api/')) safeReturn = `${url.pathname}${url.search}${url.hash}`; } catch { /* Ignore unsafe return destinations. */ }
    const href = safeReturn ? `${resolved.href}${join}returnTo=${encodeURIComponent(safeReturn)}` : resolved.href;
    return <Link prefetch={false} className="linked-hanzi" href={href} scroll={false} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} key={key} data-dialogue-pinyin={reading} aria-label={`Abrir ficha de ${character}${newTab ? ' (pestaña nueva)' : ''}`}><Hanzi>{character}</Hanzi></Link>;
  })}</span>;
}
