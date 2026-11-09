import { PhraseReinforcement } from './PhraseReinforcement';
import Link from 'next/link';
import { Hanzi } from '@/components/Hanzi';
import { SpeakButton } from '@/components/SpeakButton';
import { PinyinText } from '@/components/PinyinText';
import { hanziGlyphHref } from '@/lib/hanzi/navigation';
import type { CharacterEntry } from '@/data/types';

export function GameFeedback({ correct, hanzi, pinyin, meaning, characters, hint, optionalSupport = false }: { correct: boolean; hanzi: string; pinyin: string; meaning: string; characters: CharacterEntry[]; hint?: string; optionalSupport?: boolean }) {
  return <div className={`game-feedback ${correct ? 'correct' : 'incorrect'}`} role="status"><strong>{correct ? '✓ ¡Correcto!' : 'Aún no. Esta es la respuesta esperada:'}</strong>{optionalSupport ? <PhraseReinforcement hanzi={hanzi} pinyin={pinyin} translation={meaning}/> : <><p className="feedback-hanzi"><Hanzi>{hanzi}</Hanzi></p><p><PinyinText>{pinyin}</PinyinText></p><p>{meaning}</p><SpeakButton text={hanzi}/></>}{!correct && hint && <p>{hint}</p>}<div className="blocks-tray">{characters.filter(item => hanzi.includes(item.hanzi)).map(item => <Link key={item.id} href={hanziGlyphHref(item.hanzi)}><Hanzi>{item.hanzi}</Hanzi> · Hanzi</Link>)}</div></div>;
}
