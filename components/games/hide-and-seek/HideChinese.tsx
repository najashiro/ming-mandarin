import { SpeakButton } from '@/components/SpeakButton';
import { PinyinText } from '@/components/PinyinText';
import { hideTextAudio } from '@/lib/hide-and-seek-audio';

export function HideChinese({ text, pinyin, spanish, aids, audioSrc, speaking = false, className = '' }: {
  text: string; pinyin: string; spanish: string; aids: boolean; audioSrc?: string | string[];
  speaking?: boolean; className?: string;
}) {
  return <div className={`hide-chinese${speaking ? ' is-speaking' : ''} ${className}`}>
    <SpeakButton text={text} audioSrc={audioSrc ?? hideTextAudio(text)} inlineText rate={1}/>
    {aids && <><p className="hide-chinese-pinyin" lang="zh-Latn"><PinyinText>{pinyin}</PinyinText></p><p className="hide-chinese-spanish">{spanish}</p></>}
  </div>;
}
