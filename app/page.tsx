import Image from 'next/image';
import Link from 'next/link';
import { Hanzi } from '@/components/Hanzi';
import { SiteShell } from '@/components/SiteShell';
import { SpeakButton } from '@/components/SpeakButton';
import { PinyinText } from '@/components/PinyinText';
import { ContinueLearning } from '@/components/ContinueLearning';
import { LessonCards } from '@/components/LessonCards';
import { MingIcon, type MingIconName } from '@/components/MingIcon';

const skills: { icon: MingIconName; title: string; text: string; href: string; tone: string }[] = [
  { icon: 'sound', title: 'Afina el oído', text: 'Escucha, repite y reconoce los tonos.', href: '/lesson/1/pinyin', tone: 'sage' },
  { icon: 'write', title: 'Trazo a trazo', text: 'Descubre y escribe tus primeros hanzi.', href: '/study/l1/hanzi', tone: 'peach' },
  { icon: 'chat', title: 'Dilo en chino', text: 'Dale voz a cada nueva conversación.', href: '/study/l1/dialogues', tone: 'sand' },
];

export default function Home() {
  return <SiteShell><main id="main-content" className="learning-home">
    <section className="welcome-hero shell" aria-labelledby="welcome-title">
      <div className="welcome-copy">
        <p className="eyebrow"><span className="eyebrow-dot"/> UN POCO CADA DÍA. UN MUNDO POR DESCUBRIR.</p>
        <h1 id="welcome-title">Tu próximo paso<br/>habla <em>chino.</em></h1>
        <p className="welcome-description">De tu primer <Hanzi>你好</Hanzi> a una conversación.<br className="desktop-break"/> Aprende, escucha y practica mandarín a tu ritmo.</p>
        <div className="welcome-actions"><ContinueLearning/><Link prefetch={false} href="/course" className="text-link">Explorar lecciones <span aria-hidden="true">↗</span></Link></div>
        <p className="welcome-note"><MingIcon name="clock" width="16" height="16"/> Haz espacio para 10 minutos de aprendizaje.</p>
      </div>
      <div className="welcome-art">
        <Image src="/images/ming-study.webp" alt="Un cuaderno abierto y una taza de té frente a un paisaje de montañas" width={1536} height={1024} priority sizes="(max-width: 700px) 100vw, 48vw"/>
        <div className="hello-note"><span className="hello-hanzi"><Hanzi>你好</Hanzi></span><div><strong><PinyinText>Nǐ hǎo</PinyinText></strong><span>Todo empieza con un hola.</span></div><SpeakButton text="你好" compact ariaLabel="Escuchar 你好, hola"/></div>
      </div>
    </section>
    <section className="learning-path shell" aria-labelledby="path-title">
      <div className="home-section-heading"><div><p className="eyebrow">TU RUTA DE APRENDIZAJE · LECCIONES 1–4</p><h2 id="path-title">Paso a paso, más lejos.</h2></div><Link prefetch={false} href="/course" className="text-link">Ver todas las lecciones <MingIcon name="arrow" width="18" height="18"/></Link></div>
      <LessonCards/>
    </section>
    <section className="practice-strip shell" aria-labelledby="practice-title">
      <div className="home-section-heading"><div><p className="eyebrow">APRENDER ES HACER</p><h2 id="practice-title">Encuentra tu forma de practicar.</h2></div><Link prefetch={false} href="/practice" className="text-link">Toda la práctica <MingIcon name="arrow" width="18" height="18"/></Link></div>
      <div className="skill-cards">{skills.map((skill) => <Link prefetch={false} href={skill.href} className="skill-card" key={skill.title}><span className={'skill-icon ' + skill.tone}><MingIcon name={skill.icon}/></span><div><h3>{skill.title}</h3><p>{skill.text}</p></div><MingIcon name="arrow" width="18" height="18"/></Link>)}</div>
    </section>
    <section className="daily-moment shell" aria-labelledby="moment-title">
      <div className="daily-phrase"><p className="eyebrow">UNA FRASE, UNA CONVERSACIÓN · LECCIÓN 3</p><h2 id="moment-title"><Hanzi>你家有几口人？</Hanzi></h2><p className="phrase-pinyin"><PinyinText>Nǐ jiā yǒu jǐ kǒu rén?</PinyinText></p><p>¿Cuántas personas hay en tu familia?</p><SpeakButton text="你家有几口人？" label="Escuchar la frase"/></div>
      <div className="daily-invitation"><span className="mini-label"><MingIcon name="games"/> PONLO EN PRÁCTICA</span><h3>Lo que juegas,<br/>lo recuerdas.</h3><p>Une imágenes, sonidos y palabras. Prueba los juegos y aprende de cada respuesta.</p><Link prefetch={false} href="/study/l1-l2-l3-l4/games" className="button button-dark">Elegir un juego <MingIcon name="arrow"/></Link></div>
    </section>
    <div className="home-footnote shell"><MingIcon name="book" width="18" height="18"/><p>Pequeños pasos. Práctica constante. Mandarín para tu día a día.</p></div>
  </main></SiteShell>;
}
