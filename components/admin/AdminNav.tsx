import Link from 'next/link';

export function AdminNav({ active }: { active: 'content' | 'community' | 'analytics' }) {
  return <nav className="admin-nav shell" aria-label="Administración">
    <Link className={active === 'content' ? 'selected' : ''} href="/admin/content">Fuentes</Link>
    <Link className={active === 'community' ? 'selected' : ''} href="/admin/community">Comunidad</Link>
    <Link className={active === 'analytics' ? 'selected' : ''} href="/admin/analytics">Analítica</Link>
  </nav>;
}
