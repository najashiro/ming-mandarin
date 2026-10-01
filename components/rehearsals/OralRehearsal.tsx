'use client';

import { useEffect, useMemo, useState } from 'react';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton, stopMandarinAudio } from '@/components/SpeakButton';

export type OralSpeaker = { id: string; label: string; hanzi: string | null; pinyin: string };
export type OralTurn = { id: string; speaker: string; hanzi: string; pinyin: string; spanish: string; audioSrc?: string };

export function OralRehearsal({ speakers, turns, returnPath }: {
  speakers: OralSpeaker[];
  turns: OralTurn[];
  returnPath: string;
}) {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [rate, setRate] = useState(1);
  const speakerById = useMemo(() => new Map(speakers.map(speaker => [speaker.id, speaker])), [speakers]);
  const fullAudio = useMemo(() => turns.flatMap(turn => turn.audioSrc ? [turn.audioSrc] : []), [turns]);
  const allAudioReady = turns.length > 0 && fullAudio.length === turns.length;

  useEffect(() => () => stopMandarinAudio(), []);

  return <section className="corpus-dialogues shell oral-rehearsal" aria-label="Conversación de práctica oral">
    <div className="oral-controls" role="group" aria-label="Apoyos para practicar">
      <label className="oral-toggle">
        <input type="checkbox" checked={showPinyin} onChange={event => setShowPinyin(event.target.checked)} aria-controls="oral-dialogue" />
        <span>Mostrar pinyin</span>
      </label>
      <label className="oral-toggle">
        <input type="checkbox" checked={showTranslation} onChange={event => setShowTranslation(event.target.checked)} aria-controls="oral-dialogue" />
        <span>Mostrar traducción</span>
      </label>
      <label className="oral-speed">Velocidad
        <select value={rate} onChange={event => { stopMandarinAudio(); setRate(Number(event.target.value)); }}>
          <option value={0.8}>Lenta · 0.8×</option>
          <option value={1}>Normal · 1×</option>
        </select>
      </label>
      {allAudioReady && <SpeakButton text="Conversación completa" audioSrc={fullAudio} rate={rate} label="Escuchar todo" ariaLabel="Escuchar toda la conversación" />}
    </div>
    <p className="oral-instructions">Desactiva los apoyos para ensayar. Los caracteres con ficha disponible abren Hanzi en otra pestaña sin perder esta conversación.</p>
    <article className="corpus-dialogue" aria-label="You Shiluo y Shen Bowen">
      <ol id="oral-dialogue">
        {turns.map((turn, index) => {
          const speaker = speakerById.get(turn.speaker);
          if (!speaker) return null;
          return <li className="dialogue-turn" data-speaker={speaker.id} data-speaker-token={speaker.id} id={turn.id} key={turn.id}>
            <div className="dialogue-turn-heading">
              <b className="oral-speaker">
                <span className="oral-turn-number" aria-label={`Turno ${index + 1}`}>{String(index + 1).padStart(2, '0')}</span>
                {speaker.hanzi ? <LinkedChineseText text={speaker.hanzi} /> : <span>{speaker.label}</span>}
                {showPinyin && <span className="oral-speaker-pinyin"> · <PinyinText>{speaker.pinyin}</PinyinText></span>}
              </b>
              {turn.audioSrc ? <SpeakButton text={turn.hanzi} audioSrc={turn.audioSrc} rate={rate} compact ariaLabel={`Escuchar turno ${index + 1}: ${speaker.label}`} /> :
                <button className="audio-button compact" type="button" disabled aria-label={`Audio del turno ${index + 1} en preparación`} title="Audio en preparación">
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4 6 8H3v8h3l5 4V4Z M15 8a6 6 0 0 1 0 8" /></svg>
                </button>}
            </div>
            <div className="dialogue-turn-text oral-hanzi" lang="zh-CN"><LinkedChineseText text={turn.hanzi} returnTo={`${returnPath}#${turn.id}`} newTab /></div>
            {showPinyin && <p className="oral-pinyin" lang="zh-Latn"><PinyinText>{turn.pinyin}</PinyinText></p>}
            {showTranslation && <p className="oral-translation" lang="es">{turn.spanish}</p>}
          </li>;
        })}
      </ol>
    </article>
    <p className="ai-audio-note">Audio generado con IA. Las reproducciones utilizan MP3 guardados; no generan audio nuevo.</p>
    {!allAudioReady && <p className="oral-audio-status" role="status">Los audios se están preparando. Los iconos se activan al publicarse los archivos verificados.</p>}
  </section>;
}
