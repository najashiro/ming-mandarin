import { SpeakButton } from '@/components/SpeakButton';
import { PinyinText } from '@/components/PinyinText';
import { hideTextAudio } from '@/lib/hide-and-seek-audio';

export function HideChinese({ text, pinyin, spanish, aids, audioSrc, autoPlayKey, rate = 1, onBlocked, className = '' }: {
  text: string; pinyin: string; spanish: string; aids: boolean; audioSrc?: string | string[];
  autoPlayKey?: string; rate?: number; onBlocked?: () => void; className?: string;
}) {
  return <div className={`hide-chinese ${className}`}>
    <SpeakButton text={text} audioSrc={audioSrc ?? hideTextAudio(text)} inlineText rate={rate} autoPlayKey={autoPlayKey} onAutoPlayBlocked={onBlocked}/>
    {aids && <><p className="hide-chinese-pinyin" lang="zh-Latn"><PinyinText>{pinyin}</PinyinText></p><p className="hide-chinese-spanish">{spanish}</p></>}
  </div>;
}
