import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/app/dialogue-speakers.css';
import './oral-rehearsal.css';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { OralRehearsal } from '@/components/rehearsals/OralRehearsal';
import dialogue from '@/data/rehearsals/oral-final.json';
import audioManifest from '@/data/rehearsals/oral-final-audio.json';

// Unlisted, not authenticated. Never add this dataset to curriculum/search/sitemap exports.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Ensayo oral · Míng',
  description: 'Espacio de práctica oral por enlace.',
  robots: { index: false, follow: false, nocache: true, noarchive: true, nosnippet: true, googleBot: { index: false, follow: false, noimageindex: true } },
  referrer: 'no-referrer',
};

type AudioEntry = { src: string; hanzi: string; pinyin: string };

export default async function OralRehearsalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== dialogue.slug) notFound();
  const audioByTurn = audioManifest.clips as Record<string, AudioEntry>;
  const turns = dialogue.turns.map(turn => {
    const clip = audioByTurn[turn.id];
    const audioSrc = clip?.hanzi === turn.hanzi && clip.pinyin === turn.pinyin && /^\/audio\/oral-final\/[a-f0-9]{64}\.mp3$/.test(clip.src) ? clip.src : undefined;
    return { ...turn, audioSrc };
  });
  return <SiteShell><main>
    <LessonHeader eyebrow="ENSAYO · ENLACE NO LISTADO" title={dialogue.title} description="You Shiluo y Shen Bowen · 29 intervenciones para practicar antes del examen." />
    <OralRehearsal speakers={dialogue.speakers} turns={turns} returnPath={`/ensayo/${slug}`} />
  </main></SiteShell>;
}
