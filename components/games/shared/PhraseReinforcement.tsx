'use client';

import { useId, useState } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton } from '@/components/SpeakButton';
import './reinforcement.css';

export function PhraseReinforcement({ hanzi, pinyin, translation, linked = false }: { hanzi: string; pinyin?: string; translation?: string; linked?: boolean }) {
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const id = useId();
  return <div className="phrase-reinforcement">
    <div className="reinforcement-model"><p className="feedback-hanzi workbook-model">{linked ? <LinkedChineseText text={hanzi}/> : <Hanzi>{hanzi}</Hanzi>}</p><SpeakButton text={hanzi} compact ariaLabel={`Volver a escuchar: ${hanzi}`}/></div>
    <div className="reinforcement-controls">
      {pinyin && <button type="button" aria-expanded={showPinyin} aria-controls={`${id}-pinyin`} onClick={() => setShowPinyin(value => !value)}>{showPinyin ? 'Ocultar pinyin' : 'Mostrar pinyin'}</button>}
      {translation && <button type="button" aria-expanded={showTranslation} aria-controls={`${id}-translation`} onClick={() => setShowTranslation(value => !value)}>{showTranslation ? 'Ocultar traducción' : 'Mostrar traducción'}</button>}
    </div>
    {pinyin && <p id={`${id}-pinyin`} hidden={!showPinyin} className="reinforcement-pinyin workbook-model-pinyin"><PinyinText>{pinyin}</PinyinText></p>}
    {translation && <p id={`${id}-translation`} hidden={!showTranslation} className="reinforcement-translation workbook-model-meaning">{translation}</p>}
  </div>;
}

export function GameAudioRetry({ error, retry }: { error: boolean; retry: () => void }) {
  return error ? <div className="game-audio-retry" role="status">No se pudo escuchar. <button type="button" onClick={retry}>Reintentar audio</button></div> : null;
}
