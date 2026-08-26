'use client';

export function speakChinese(text: string, rate = 0.85) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = rate;
  const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith('zh'));
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}

export function SpeakButton({ text, rate = 0.85, label = 'Escuchar' }: { text: string; rate?: number; label?: string }) {
  return <button className="audio-button" type="button" onClick={() => speakChinese(text, rate)} title="Voz sintética zh-CN" aria-label={`${label}: ${text}`}><span aria-hidden="true">▶</span> {label}<small>voz sintética</small></button>;
}
