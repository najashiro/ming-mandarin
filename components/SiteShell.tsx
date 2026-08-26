import Link from 'next/link';
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from '@/app/chatgpt-auth';

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const user = await getChatGPTUser();
  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Míng, inicio"><span className="brand-mark" aria-hidden="true">明</span><span><strong>Míng</strong><small>Mandarín activo</small></span></Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <Link href="/lesson/1">Ruta</Link><Link href="/lesson/1/daily">Práctica</Link><Link href="/lesson/1/games">Juegos</Link><Link href="/progress">Progreso</Link>
        </nav>
        <Link className="profile-chip" href={user ? '/profile' : chatGPTSignInPath('/')}><span aria-hidden="true">学</span><b>{user ? user.displayName : 'Entrar'}</b></Link>
      </header>
      {children}
      <footer className="site-footer shell"><div><b>明 Míng</b><p>Lección 1 · aprendizaje persistente y verificable.</p></div><nav><Link href="/leaderboard">Ranking</Link><Link href="/errors">Errores</Link><Link href="/admin/content">Fuentes</Link>{user && <Link href={chatGPTSignOutPath('/')}>Salir</Link>}</nav></footer>
      <nav className="mobile-nav" aria-label="Navegación móvil"><Link href="/"><span>⌂</span>Inicio</Link><Link href="/lesson/1"><span>路</span>Ruta</Link><Link href="/lesson/1/daily"><span>练</span>Práctica</Link><Link href="/progress"><span>升</span>Progreso</Link></nav>
    </>
  );
}

export function LessonHeader({ eyebrow = '第一课 · LECCIÓN 1', title, pinyin, description }: { eyebrow?: string; title: string; pinyin?: string; description?: string }) {
  return <section className="page-hero shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{pinyin && <p className="pinyin">{pinyin}</p>}{description && <p>{description}</p>}</section>;
}

export function SourceBadge({ page, source = 'Libro básico' }: { page: number; source?: string }) {
  return <span className="source-badge">{source} · PDF p. {page}</span>;
}
