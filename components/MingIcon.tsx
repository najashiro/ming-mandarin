import type { SVGProps, ReactNode } from 'react';

export type MingIconName = 'home' | 'book' | 'practice' | 'games' | 'progress' | 'arrow' | 'sound' | 'write' | 'chat' | 'clock' | 'check' | 'sun';
const paths: Record<MingIconName, ReactNode> = {
  home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>,
  book: <path d="M12 5v16M3 3h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>,
  practice: <path d="m13 2-9 12h7l-1 8 10-13h-7Z"/>,
  games: <><path d="M8 7h8c3 0 4 2 5 8s-2 7-5 2H8c-3 5-6 4-5-2S5 7 8 7Z"/><path d="M7 11v4m-2-2h4m7-1h.01M18 14h.01"/></>,
  progress: <path d="M4 20h17M7 16v-5m5 5V7m5 9V3"/>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  sound: <path d="m11 4-6 5H2v6h3l6 5Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>,
  write: <path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14Zm0 0h17"/>,
  chat: <><path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z"/><path d="M8 10h8m-8 4h5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></>,
};
export function MingIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: MingIconName }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
