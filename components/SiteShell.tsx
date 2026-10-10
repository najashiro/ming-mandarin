import { Hanzi } from '@/components/Hanzi';
import Link from 'next/link';
import { getCurrentUser, isAuthorizedAdmin, signInPath } from '@/app/auth';
import { PinyinText } from './PinyinText';
import { RecoveryRedirector } from './RecoveryRedirector';
import { SiteNav } from './SiteNav';

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const isAdmin = await isAuthorizedAdmin(user);
  return (
    <>
      <RecoveryRedirector/>
      <a className="skip-link" href="#learning-content">Saltar al contenido</a>
      <header className="topbar">
        <Link prefetch={false} className="brand" href="/" aria-label="Míng, inicio"><span className="brand-mark" aria-hidden="true"><Hanzi>明</Hanzi></span><span><strong>Míng</strong><small>Mandarín activo</small></span></Link>
        <SiteNav/>
        <Link prefetch={false} className="profile-chip" href={user ? '/profile' : signInPath('/profile')} aria-label={user ? `Perfil de ${user.displayName}` : 'Guardar mi progreso'}><span aria-hidden="true"><Hanzi>学</Hanzi></span><b>{user ? user.displayName : 'Mi espacio'}</b></Link>
      </header>
      <div id="learning-content" tabIndex={-1}>{children}</div>
      <footer className="site-footer shell"><div><b><Hanzi>明</Hanzi> Míng<span className="footer-dot">·</span>Mandarín activo</b><p>Aprende con calma. Avanza con intención.</p></div><nav aria-label="Enlaces del pie de página"><Link prefetch={false} href="/course">Lecciones</Link><Link prefetch={false} href="/lesson/1/pinyin">Pronunciación</Link><Link prefetch={false} href="/errors">Mis repasos</Link><Link prefetch={false} href="/leaderboard">Ranking</Link>{isAdmin && <><Link prefetch={false} href="/admin/content">Fuentes</Link><Link prefetch={false} href="/admin/images">Imágenes</Link><Link prefetch={false} href="/admin/community">Comunidad</Link><Link prefetch={false} href="/admin/analytics">Analítica</Link></>}</nav></footer>
      <SiteNav mobile/>
    </>
  );
}

export function LessonHeader({ eyebrow = '第一课 · LECCIÓN 1', title, pinyin, description }: { eyebrow?: string; title: string; pinyin?: string; description?: string }) {
  return <section className="page-hero shell"><p className="eyebrow"><Hanzi>{eyebrow}</Hanzi></p><h1><Hanzi>{title}</Hanzi></h1>{pinyin && <p className="pinyin"><PinyinText>{pinyin}</PinyinText></p>}{description && <p><Hanzi>{description}</Hanzi></p>}</section>;
}
