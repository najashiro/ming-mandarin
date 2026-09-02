import { CommunityButton, CommunityContextProvider } from '@/components/community/CommunityProvider';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { SpeakButton } from '@/components/SpeakButton';
import { getGreetingSentences } from '@/lib/lesson-content';
import { audioForMandarinText } from '@/lib/mandarin-audio';

export default function GreetingsPage() {
  const greetings = getGreetingSentences();
  return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'dialogues',concept:'greetings',skill:'communication',route:'/lesson/1/greetings'}}><main>
    <LessonHeader eyebrow="01 · 问候" title="Saludos" description="Escucha y practica las formas de saludar incluidas en la lección." />
    <div className="community-page-action shell"><CommunityButton label="Preguntar sobre los saludos" /></div>
    <section className="dialogue-text greeting-list shell">{greetings.map((greeting) => <article key={greeting.id}><div><h2>{greeting.hanzi}</h2><p>{greeting.pinyin}</p><span>{greeting.translation}</span></div><SpeakButton text={greeting.hanzi} audioSrc={audioForMandarinText(greeting.hanzi)} /></article>)}</section>
  </main></CommunityContextProvider></SiteShell>;
}
