'use client';

import { useState } from 'react';
import './game-share.css';

export function GameShareButton({ name, href }: { name: string; href: string }) {
  const [message, setMessage] = useState('');

  async function share() {
    const url = new URL(href, window.location.origin).toString();
    setMessage('');
    if (navigator.share) {
      try {
        await navigator.share({ title: `${name} · Míng`, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Enlace copiado');
    } catch {
      window.prompt('Copia el enlace del juego:', url);
    }
  }

  return <>
    <button className="game-share-button" type="button" onClick={() => void share()} aria-label={`Compartir ${name}`} title={`Compartir ${name}`} data-share-path={href}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.3 10.8 7.4-4.6m-7.4 7 7.4 4.6"/></svg>
    </button>
    <span className="game-share-status" role="status" aria-live="polite">{message}</span>
  </>;
}
