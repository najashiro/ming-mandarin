'use client';

import { useState, type ReactNode } from 'react';
import '@/app/dialogue-reading-aids.css';

export function DialogueReadingAids({ children }: { children: ReactNode }) {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showSpanish, setShowSpanish] = useState(false);

  return <div className="dialogue-reading-aids" data-pinyin={showPinyin} data-spanish={showSpanish}>
    <div className="dialogue-reading-controls shell" role="group" aria-label="Ayudas de lectura">
      <label><input type="checkbox" checked={showPinyin} onChange={(event) => setShowPinyin(event.target.checked)} /> Mostrar pinyin</label>
      <label><input type="checkbox" checked={showSpanish} onChange={(event) => setShowSpanish(event.target.checked)} /> Mostrar traducción al español</label>
    </div>
    {children}
  </div>;
}
