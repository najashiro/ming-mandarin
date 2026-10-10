import Link from 'next/link';
import { getVocabularySet } from '@/lib/vocabulary';
import { Hanzi } from './Hanzi';
import { MingIcon } from './MingIcon';

const lessons = [
  { scope: 'l1', number: '01', glyph: '你', title: 'Hola, ¿cómo estás?', description: 'Saluda, preséntate y cuenta cómo te sientes.', tone: 'sage' },
  { scope: 'l2', number: '02', glyph: '人', title: 'Un mundo por conocer', description: 'Habla de tu país, los idiomas y lo que te gusta.', tone: 'peach' },
  { scope: 'l3', number: '03', glyph: '家', title: 'Tu familia, tu mundo', description: 'Presenta a tu familia y habla de edades y profesiones.', tone: 'sand' },
  { scope: 'l4', number: '04', glyph: '时', title: 'El ritmo de tu día', description: 'Habla de horarios, clases y actividades cotidianas.', tone: 'mist' },
] as const;

export function LessonCards() {
  return <div className="lesson-cards">{lessons.map((lesson) => <Link prefetch={false} className={`lesson-tile ${lesson.tone}`} href={`/study/${lesson.scope}`} key={lesson.scope}>
    <div className="lesson-tile-top"><span>LECCIÓN {lesson.number}</span><span className="lesson-glyph"><Hanzi>{lesson.glyph}</Hanzi></span></div>
    <h3>{lesson.title}</h3><p>{lesson.description}</p>
    <div className="lesson-tile-bottom"><span>{getVocabularySet(lesson.scope).length} palabras · 2 textos</span><MingIcon name="arrow"/></div>
  </Link>)}</div>;
}
