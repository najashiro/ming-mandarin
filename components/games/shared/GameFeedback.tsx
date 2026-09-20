import Link from 'next/link';
import { Hanzi } from '@/components/Hanzi';
import { SpeakButton } from '@/components/SpeakButton';
import { PinyinText } from '@/components/PinyinText';
import { hanziGlyphHref } from '@/lib/hanzi/navigation';
import type { CharacterEntry } from '@/data/types';

export function GameFeedback({ correct, hanzi, pinyin, meaning, characters, hint }: { correct: boolean; hanzi: string; pinyin: string; meaning: string; characters: CharacterEntry[]; hint?: string }) {
  return <div className={`game-feedback ${correct ? 'correct' : 'incorrect'}`} role="status"><strong>{correct ? '✓ ¡Correcto!' : 'Revisa y vuelve a intentarlo en el repaso.'}</strong><p className="feedback-hanzi"><Hanzi>{hanzi}</Hanzi></p><p><PinyinText>{pinyin}</PinyinText></p><p>{meaning}</p>{!correct && hint && <p>{hint}</p>}<SpeakButton text={hanzi}/><div className="blocks-tray">{characters.filter(item => hanzi.includes(item.hanzi)).map(item => <Link key={item.id} href={hanziGlyphHref(item.hanzi)}><Hanzi>{item.hanzi}</Hanzi> · Hanzi</Link>)}</div></div>;
}
