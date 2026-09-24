import { Hanzi } from '@/components/Hanzi';
import Link from 'next/link';
import { getCurrentUser, isAuthorizedAdmin, signInPath } from '@/app/auth';
import { PinyinText } from './PinyinText';
import { RecoveryRedirector } from './RecoveryRedirector';

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const isAdmin = await isAuthorizedAdmin(user);
  return (
    <>
      <RecoveryRedirector/>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Míng, inicio"><span className="brand-mark" aria-hidden="true"><Hanzi>明</Hanzi></span><span><strong>Míng</strong><small>Mandarín activo</small></span></Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <Link href="/study/l1-l2-l3">Curso</Link><Link href="/study/l1-l2-l3/radicals">Radicales</Link><Link href="/study/l1-l2-l3/daily">Práctica</Link><Link href="/study/l1-l2-l3/games">Juegos</Link><Link href="/progress">Progreso</Link>
        </nav>
        <Link className="profile-chip" href={user ? '/profile' : signInPath('/profile')}><span aria-hidden="true"><Hanzi>学</Hanzi></span><b>{user ? user.displayName : 'Guardar progreso'}</b></Link>
      </header>
      {children}
      <footer className="site-footer shell"><div><b><Hanzi>明 Míng</Hanzi></b><p>Lecciones 1–3 · aprendizaje persistente y verificable.</p></div><nav><Link href="/leaderboard">Ranking</Link><Link href="/errors">Errores</Link>{isAdmin && <><Link href="/admin/content">Fuentes</Link><Link href="/admin/community">Comunidad</Link><Link href="/admin/analytics">Analítica</Link></>}</nav></footer>
      <nav className="mobile-nav" aria-label="Navegación móvil"><Link href="/"><span>⌂</span>Inicio</Link><Link href="/study/l1-l2-l3"><span><Hanzi>路</Hanzi></span>Curso</Link><Link href="/study/l1-l2-l3/daily"><span><Hanzi>练</Hanzi></span>Práctica</Link><Link href="/study/l1-l2-l3/games"><span><Hanzi>游</Hanzi></span>Juegos</Link><Link href="/progress"><span><Hanzi>升</Hanzi></span>Progreso</Link></nav>
    </>
  );
}

export function LessonHeader({ eyebrow = '第一课 · LECCIÓN 1', title, pinyin, description }: { eyebrow?: string; title: string; pinyin?: string; description?: string }) {
  return <section className="page-hero shell"><p className="eyebrow"><Hanzi>{eyebrow}</Hanzi></p><h1><Hanzi>{title}</Hanzi></h1>{pinyin && <p className="pinyin"><PinyinText>{pinyin}</PinyinText></p>}{description && <p><Hanzi>{description}</Hanzi></p>}</section>;
}
