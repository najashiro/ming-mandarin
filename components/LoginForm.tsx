'use client';

import { useState } from 'react';

export function LoginForm({ returnTo }: { returnTo: string }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/auth/${mode === 'signin' ? 'sign-in' : 'sign-up'}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json() as { error?: string; confirmationRequired?: boolean };
      if (!response.ok) throw new Error(body.error ?? 'No se pudo completar el acceso.');
      if (body.confirmationRequired) {
        setMessage('Revisa tu correo para confirmar la cuenta. Después vuelve e inicia sesión.');
      } else {
        window.location.assign(returnTo);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo completar el acceso.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="login-card panel">
    <div className="login-tabs" role="tablist" aria-label="Acceso">
      <button className={mode === 'signin' ? 'selected' : ''} type="button" onClick={() => setMode('signin')}>Entrar</button>
      <button className={mode === 'signup' ? 'selected' : ''} type="button" onClick={() => setMode('signup')}>Crear cuenta</button>
    </div>
    <form onSubmit={submit}>
      <label>Correo<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label>Contraseña<input type="password" minLength={8} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <button className="button button-primary" disabled={busy}>{busy ? 'Procesando…' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}</button>
    </form>
    {message && <p className="rule-note">{message}</p>}
    <small>Las lecciones son públicas. Tu cuenta solo se usa para guardar progreso, examen y participación voluntaria en el ranking.</small>
  </section>;
}
