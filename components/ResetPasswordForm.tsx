'use client';

import { useEffect, useState } from 'react';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('access_token') ?? '';
    const frame = window.requestAnimationFrame(() => setAccessToken(token));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirmation) { setMessage('Las contraseñas no coinciden.'); return; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ accessToken, password }),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? 'No se pudo actualizar la contraseña.');
      window.location.assign('/admin/login?returnTo=/admin/analytics');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar la contraseña.');
    } finally { setBusy(false); }
  }

  return <section className="login-card panel"><form onSubmit={submit}>
    <label>Nueva contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={12} required disabled={!accessToken} autoComplete="new-password" /></label>
    <label>Confirmar contraseña<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={12} required disabled={!accessToken} autoComplete="new-password" /></label>
    <button className="button button-primary" disabled={busy || !accessToken}>{busy ? 'Actualizando…' : 'Guardar nueva contraseña'}</button>
  </form>{message && <p className="rule-note" role="alert">{message}</p>}{!accessToken && <p className="rule-note" role="alert">Abre el enlace completo que recibiste por correo.</p>}<small>Después podrás entrar a la administración con tu correo y esta contraseña.</small></section>;
}
