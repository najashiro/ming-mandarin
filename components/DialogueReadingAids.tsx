'use client';

import { useLayoutEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import '@/app/dialogue-reading-aids.css';

type DialoguePosition = {
  rowId: string;
  top: number;
  pinyin: boolean;
  spanish: boolean;
};

export function DialogueReadingAids({ children }: { children: ReactNode }) {
  const pinyin = useRef<HTMLInputElement>(null);
  const spanish = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const saved: DialoguePosition | undefined = window.history.state?.dialoguePosition;
    if (!saved || !pinyin.current || !spanish.current) return;
    const row = document.getElementById(saved.rowId);
    if (!row) return;

    // The reading aids change the height of every preceding turn.
    pinyin.current.checked = saved.pinyin;
    spanish.current.checked = saved.spanish;
    const listeners = new AbortController();
    const forgetPosition = () => {
      // Keep the entry for Forward → Back until the reader moves on.
      if (Math.abs(row.getBoundingClientRect().top - saved.top) <= 1 &&
          pinyin.current?.checked === saved.pinyin && spanish.current?.checked === saved.spanish) return;
      listeners.abort();
      const state = { ...window.history.state };
      delete state.dialoguePosition;
      window.history.replaceState(state, '');
    };
    const frame = requestAnimationFrame(() => {
      window.scrollBy({ top: row.getBoundingClientRect().top - saved.top, behavior: 'instant' });
      window.addEventListener('scroll', forgetPosition, { passive: true, signal: listeners.signal });
      pinyin.current?.addEventListener('change', forgetPosition, { signal: listeners.signal });
      spanish.current?.addEventListener('change', forgetPosition, { signal: listeners.signal });
    });
    return () => {
      cancelAnimationFrame(frame);
      listeners.abort();
    };
  }, []);

  function rememberPosition(event: MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>('a.linked-hanzi');
    if (!link || (link.target && link.target !== '_self')) return;
    const row = link.closest<HTMLElement>('li[id], article[id]');
    if (!row || !pinyin.current || !spanish.current) return;
    const dialoguePosition: DialoguePosition = {
      rowId: row.id,
      top: row.getBoundingClientRect().top,
      pinyin: pinyin.current.checked,
      spanish: spanish.current.checked,
    };
    window.history.replaceState({ ...window.history.state, dialoguePosition }, '');
  }

  return <div className="dialogue-reading-aids" onClickCapture={rememberPosition}>
    <div className="dialogue-reading-controls shell" role="group" aria-label="Ayudas de lectura">
      <label><input ref={pinyin} name="pinyin" type="checkbox" defaultChecked /> Mostrar pinyin</label>
      <label><input ref={spanish} name="spanish" type="checkbox" /> Mostrar traducción al español</label>
    </div>
    {children}
  </div>;
}
