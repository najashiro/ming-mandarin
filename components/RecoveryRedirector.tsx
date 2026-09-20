'use client';

import { useEffect } from 'react';

export function RecoveryRedirector() {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    if (params.get('type') === 'recovery' && params.has('access_token')) {
      window.location.replace(`/reset-password${hash}`);
    }
  }, []);

  return null;
}
