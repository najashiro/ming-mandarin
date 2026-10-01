import Image from 'next/image';
import type { RetoMixtoEntry, RetoMixtoFamilyTarget } from '@/data/reto-mixto';
import framing from '@/data/vocabulary-game-framing.json';

const familyPortraits: Record<RetoMixtoFamilyTarget, { x: number; y: number; radius: number }> = {
  yeye: { x: 166, y: 224, radius: 146 },
  nainai: { x: 471, y: 224, radius: 146 },
  waigong: { x: 783, y: 224, radius: 146 },
  waipo: { x: 1086, y: 224, radius: 146 },
  baba: { x: 430, y: 624, radius: 163 },
  mama: { x: 821, y: 624, radius: 163 },
  gege: { x: 136, y: 997, radius: 120 },
  jiejie: { x: 380, y: 997, radius: 120 },
  nver: { x: 627, y: 997, radius: 120 },
  didi: { x: 869, y: 997, radius: 120 },
  meimei: { x: 1117, y: 997, radius: 120 },
};

export function RetoMixtoVisual({ entry, alt, priority = false }: { entry: RetoMixtoEntry; alt: string; priority?: boolean }) {
  if (!entry.imageSrc) return null;
  const portrait = entry.familyTarget ? familyPortraits[entry.familyTarget] : undefined;
  const [path, query] = entry.imageSrc.split('?');
  const bounds = framing[path as keyof typeof framing];
  const version = new URLSearchParams(query).get('v');
  if (!portrait && bounds && (!version || version === bounds.sha256)) {
    const edge = Math.max(bounds.width, bounds.height) * 1.1;
    return <div className="mixed-vocabulary-image"><Image src={entry.imageSrc} alt={alt} width={bounds.canvasWidth} height={bounds.canvasHeight} priority={priority}
      style={{ position: 'absolute', maxWidth: 'none', width: `${bounds.canvasWidth / edge * 100}%`, height: `${bounds.canvasHeight / edge * 100}%`,
        left: `${((edge - bounds.width) / 2 - bounds.x) / edge * 100}%`, top: `${((edge - bounds.height) / 2 - bounds.y) / edge * 100}%` }} /></div>;
  }
  if (!portrait) return <Image src={entry.imageSrc} alt={alt} width={640} height={640} priority={priority} />;

  return <div className="mixed-family-image" data-family-target={entry.familyTarget}>
    <Image src={entry.imageSrc} alt={alt} width={640} height={640} priority={priority} />
    <svg aria-hidden="true" focusable="false" viewBox="0 0 1254 1254" preserveAspectRatio="none">
      <circle className="mixed-family-halo" cx={portrait.x} cy={portrait.y} r={portrait.radius} />
      <circle className="mixed-family-ring" cx={portrait.x} cy={portrait.y} r={portrait.radius} />
    </svg>
  </div>;
}
