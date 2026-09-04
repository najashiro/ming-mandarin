import Link from 'next/link';
import { getCurrentUser, isAuthorizedAdmin, signInPath } from '@/app/auth';
import { PinyinText } from './PinyinText';

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const isAdmin = await isAuthorizedAdmin(user);
  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Míng, inicio"><span className="brand-mark" aria-hidden="true">明</span><span><strong>Míng</strong><small>Mandarín activo</small></span></Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <Link href="/study/l1-l2-l3">Curso</Link><Link href="/study/l1-l2-l3/daily">Práctica</Link><Link href="/study/l1-l2-l3/games">Juegos</Link><Link href="/progress">Progreso</Link>
        </nav>
        <Link className="profile-chip" href={user ? '/profile' : signInPath('/profile')}><span aria-hidden="true">学</span><b>{user ? user.displayName : 'Guardar progreso'}</b></Link>
      </header>
      {children}
      <footer className="site-footer shell"><div><b>明 Míng</b><p>Lecciones 1–3 · aprendizaje persistente y verificable.</p></div><nav><Link href="/leaderboard">Ranking</Link><Link href="/errors">Errores</Link>{isAdmin && <><Link href="/admin/content">Fuentes</Link><Link href="/admin/community">Comunidad</Link></>}</nav></footer>
      <nav className="mobile-nav" aria-label="Navegación móvil"><Link href="/"><span>⌂</span>Inicio</Link><Link href="/study/l1-l2-l3"><span>路</span>Curso</Link><Link href="/study/l1-l2-l3/daily"><span>练</span>Práctica</Link><Link href="/study/l1-l2-l3/games"><span>游</span>Juegos</Link><Link href="/progress"><span>升</span>Progreso</Link></nav>
    </>
  );
}

export function LessonHeader({ eyebrow = '第一课 · LECCIÓN 1', title, pinyin, description }: { eyebrow?: string; title: string; pinyin?: string; description?: string }) {
  return <section className="page-hero shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{pinyin && <p className="pinyin"><PinyinText>{pinyin}</PinyinText></p>}{description && <p>{description}</p>}</section>;
}
