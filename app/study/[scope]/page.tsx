import { Hanzi } from '@/components/Hanzi';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { ARCADE_GAME_COUNT } from '@/data/arcade-games';

export default async function ScopePage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope: rawScope } = await params;
  if (!isCurriculumScope(rawScope)) notFound();
  const scope = rawScope;
  const data = getCurriculum(scope);
  const modules = [
    ...(data.definition.lessonIds.includes(4) ? [['readings','阅读','Lecturas','6 textos'], ['exercises','练习','Ejercicios','Vocabulario y actividades']] : []),
    ['vocabulary','词汇','Vocabulario',`${data.vocabulary.length} entradas`], ['dialogues','课文','Diálogos',data.definition.lessonIds.includes(4) ? 'Conversaciones del libro' : `${data.sentences.length} frases`],
    ['grammar','语法','Gramática',`${data.grammar.length} reglas`], ['hanzi','汉字','Hanzi',`${data.characters.length} caracteres`], ['radicals','部首','Radicales','Explorar y practicar'],
    ['games','游戏','Juegos',`${scope === 'l4' ? 4 : ARCADE_GAME_COUNT} actividades`], ['daily','复习','Sesión adaptativa','SRS y errores'], ['exam','测验','Examen','20 preguntas · 100 puntos'],
  ];
  return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · RUTA DE ESTUDIO`} title={data.definition.title} description={data.definition.description}/><CurriculumNav scope={scope}/><section className="module-grid shell">{modules.map(([href,hanzi,title,detail])=><Link className="module-card is-open" href={`/study/${scope}/${href}`} key={href}><span className="module-number"><Hanzi>{hanzi}</Hanzi></span><div><h3><Hanzi>{title}</Hanzi></h3><p><Hanzi>{detail}</Hanzi></p></div><span className="module-state">Abrir</span></Link>)}</section></main></SiteShell>;
}
