'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MingIcon, type MingIconName } from './MingIcon';

const scopes = [['l1', 'Lección 1'], ['l2', 'Lección 2'], ['l3', 'Lección 3'], ['l4', 'Lección 4'], ['l1-l2', 'Repaso 1 + 2'], ['l1-l2-l3', 'Repaso 1 + 2 + 3'], ['l1-l2-l3-l4', 'Todo el curso']] as const;
const activities: { section: string; title: string; description: string; icon: MingIconName; tag: string; tone: string }[] = [
  { section: 'vocabulary', title: 'Palabras que se quedan', description: 'Explora el significado, escucha la pronunciación y descubre ejemplos.', icon: 'book', tag: 'VOCABULARIO', tone: 'sage' },
  { section: 'dialogues', title: 'Escucha una conversación', description: 'Lee y escucha. Oculta el pinyin y la traducción cuando quieras un reto.', icon: 'chat', tag: 'COMPRENSIÓN', tone: 'peach' },
  { section: 'hanzi', title: 'Dale forma al idioma', description: 'Mira el orden de los trazos y escribe con guía o por tu cuenta.', icon: 'write', tag: 'ESCRITURA', tone: 'sand' },
  { section: 'grammar', title: 'Construye tus ideas', description: 'Entiende los patrones y descubre cómo se forman las frases.', icon: 'practice', tag: 'GRAMÁTICA', tone: 'sand' },
  { section: 'radicals', title: 'Descubre las piezas', description: 'Explora los radicales y relaciónalos con los caracteres del curso.', icon: 'sun', tag: 'RADICALES', tone: 'mist' },
  { section: 'games', title: 'Aprende jugando', description: 'Relaciona sonidos, imágenes y palabras. Aprende de cada intento.', icon: 'games', tag: 'JUEGOS', tone: 'sage' },
  { section: 'daily', title: 'Tu sesión de repaso', description: 'Vuelve a lo que más necesitas practicar. Elige un nombre para guardar tu avance.', icon: 'progress', tag: 'REPASO PERSONAL', tone: 'peach' },
];

export function PracticeHub() {
  const [scope, setScope] = useState<string>('l1');
  const available = scope === 'l4' || scope === 'l1-l2-l3-l4' ? [...activities, { section: 'readings', title: 'Lee un poco más', description: 'Explora las seis lecturas de la lección 4.', icon: 'book' as const, tag: 'LECTURAS · LECCIÓN 4', tone: 'mist' }] : activities;
  return <>
    <fieldset className="practice-scope"><legend>¿Qué quieres repasar?</legend><div>{scopes.map(([value, label]) => <label className={scope === value ? 'selected' : ''} key={value}><input type="radio" name="practice-scope" value={value} checked={scope === value} onChange={() => setScope(value)}/>{label}</label>)}</div></fieldset>
    <div className="practice-activities">{available.map((activity) => <Link prefetch={false} className="practice-activity" href={'/study/' + scope + '/' + activity.section} key={activity.section}><div className="practice-activity-top"><span className={'skill-icon ' + activity.tone}><MingIcon name={activity.icon}/></span><span className="mini-label">{activity.tag}</span></div><h2>{activity.title}</h2><p>{activity.description}</p><span className="text-link">Practicar <MingIcon name="arrow" width="18" height="18"/></span></Link>)}</div>
  </>;
}
