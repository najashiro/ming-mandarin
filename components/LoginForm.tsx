'use client';

import { useState } from 'react';

export function LoginForm({ returnTo }: { returnTo: string }) {
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ displayName }),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? 'No se pudo completar el acceso.');
      window.location.assign(returnTo);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo completar el acceso.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="login-card panel">
    <form onSubmit={submit}>
      <label>Tu nombre<input type="text" minLength={2} maxLength={40} autoComplete="nickname" required value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Ejemplo: Naja" /></label>
      <button className="button button-primary" disabled={busy}>{busy ? 'Preparando tu perfil…' : 'Continuar'}</button>
    </form>
    {message && <p className="rule-note">{message}</p>}
    <small>Solo se guarda el nombre que elijas y tu progreso. Esta sesión permanece en este navegador; no necesitas correo ni contraseña.</small>
  </section>;
}
