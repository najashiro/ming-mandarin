'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { getLastStudy, subscribeToStudy } from '@/lib/study-resume';
import { MingIcon } from './MingIcon';

export function ContinueLearning() {
  const last = useSyncExternalStore(subscribeToStudy, getLastStudy, () => '');
  return <Link prefetch={false} className="button button-primary" href={last || '/study/l1'}>
    {last ? 'Retomar mi estudio' : 'Empezar a aprender'}<MingIcon name="arrow"/>
  </Link>;
}
