'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { MingIcon, type MingIconName } from './MingIcon';
import { rememberStudy } from '@/lib/study-resume';

const items: { href: string; label: string; icon: MingIconName; key: string }[] = [
  { href: '/', label: 'Inicio', icon: 'home', key: 'home' },
  { href: '/course', label: 'Lecciones', icon: 'book', key: 'course' },
  { href: '/practice', label: 'Práctica', icon: 'practice', key: 'practice' },
  { href: '/study/l1-l2-l3-l4/games', label: 'Juegos', icon: 'games', key: 'games' },
  { href: '/progress', label: 'Progreso', icon: 'progress', key: 'progress' },
];
export function SiteNav({ mobile = false }: { mobile?: boolean }) {
  const path = usePathname();
  useEffect(() => { if (!mobile) rememberStudy(path); }, [path, mobile]);
  const active = path === '/' ? 'home' : path.includes('/games') ? 'games'
    : path === '/practice' || path.endsWith('/daily') ? 'practice'
    : ['/progress', '/errors', '/leaderboard'].includes(path) ? 'progress'
    : path === '/course' || path.startsWith('/study/') || path.startsWith('/lesson/') ? 'course' : '';
  return <nav className={mobile ? 'mobile-nav' : 'desktop-nav'} aria-label={mobile ? 'Navegación móvil' : 'Navegación principal'}>
    {items.map((item) => <Link prefetch={false} key={item.key} href={item.href} className={active === item.key ? 'is-active' : undefined} aria-current={active === item.key ? 'page' : undefined}>
      {mobile && <MingIcon name={item.icon}/>}<span>{item.label}</span>
    </Link>)}
  </nav>;
}
