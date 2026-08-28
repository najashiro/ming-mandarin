'use client';

import dynamic from 'next/dynamic';
import { createContext, useContext, useRef, useState } from 'react';
import type { CommunityContext } from '@/lib/community/types';

const CommunityPanel = dynamic(() => import('./CommunityPanel').then((module) => module.CommunityPanel), { ssr: false });
type Controller = { openCommunity: (context?: Partial<CommunityContext>, opener?: HTMLElement) => void };
const Context = createContext<Controller | null>(null);

export function CommunityContextProvider({ context, children }: { context: CommunityContext; children: React.ReactNode }) {
  const [activeContext, setActiveContext] = useState<CommunityContext | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  function close() { setActiveContext(null); window.setTimeout(() => opener.current?.focus(), 0); }
  return <Context.Provider value={{ openCommunity: (override, element) => { opener.current = element ?? null; setActiveContext({ ...context, ...override }); } }}>
    {children}
    {activeContext && <CommunityPanel context={activeContext} onClose={close} />}
  </Context.Provider>;
}

export function CommunityButton({ context, label = 'Comunidad', compact = false }: { context?: Partial<CommunityContext>; label?: string; compact?: boolean }) {
  const controller = useContext(Context);
  if (!controller) return null;
  return <button type="button" className={`community-launcher${compact ? ' compact' : ''}`} onClick={(event) => controller.openCommunity(context, event.currentTarget)} aria-haspopup="dialog" aria-label={compact ? label : undefined}><span aria-hidden="true">💬</span>{!compact && <span>{label}</span>}</button>;
}
