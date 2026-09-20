'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [requestBusy, setRequestBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [linkProblem, setLinkProblem] = useState('');

  useEffect(() => {
    function readLink() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const token = hash.get('access_token') ?? '';
      setAccessToken(token);
      if (token) { setLinkProblem(''); return; }
      const errorCode = hash.get('error_code');
      if (errorCode === 'otp_expired' || errorCode === 'access_denied') {
        setLinkProblem('Este enlace venció o ya se utilizó. Solicita uno nuevo.');
      } else if (hash.has('error')) {
        setLinkProblem('Supabase rechazó este enlace. Solicita uno nuevo.');
      } else if (new URLSearchParams(window.location.search).has('code')) {
        setLinkProblem('Este enlace llegó en un formato incompatible. Solicita uno nuevo desde esta página.');
      } else {
        setLinkProblem('Falta la autorización del enlace. Abre el correo más reciente desde el mismo navegador o solicita uno nuevo.');
      }
    }
    readLink();
    window.addEventListener('hashchange', readLink);
    return () => window.removeEventListener('hashchange', readLink);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!accessToken) { setMessage('Necesitas abrir un enlace de recuperación válido.'); return; }
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

  async function requestLink(event: React.FormEvent) {
    event.preventDefault();
    setRequestBusy(true); setRequestMessage('');
    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? 'No se pudo solicitar el enlace.');
      setRequestMessage('Si el correo tiene una cuenta, recibirás un enlace nuevo. Usa únicamente el mensaje más reciente.');
    } catch (error) {
      setRequestMessage(error instanceof Error ? error.message : 'No se pudo solicitar el enlace.');
    } finally { setRequestBusy(false); }
  }

  return <section className="login-card panel">
    {accessToken ? <form onSubmit={submit}>
      <label>Nueva contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={12} required autoComplete="new-password" /></label>
      <label>Confirmar contraseña<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={12} required autoComplete="new-password" /></label>
      <button className="button button-primary" disabled={busy}>{busy ? 'Actualizando…' : 'Guardar nueva contraseña'}</button>
      {message && <p className="rule-note" role="alert">{message}</p>}
      <small>Después podrás entrar a la administración con tu correo y esta contraseña.</small>
    </form> : <>
      <p className="rule-note" role="alert">{linkProblem || 'Comprobando el enlace…'}</p>
      <form onSubmit={requestLink}>
        <label>Correo administrativo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
        <button className="button button-primary" disabled={requestBusy}>{requestBusy ? 'Enviando…' : 'Solicitar enlace nuevo'}</button>
      </form>
      {requestMessage && <p className="rule-note" role="status">{requestMessage}</p>}
      <Link href="/admin/login?returnTo=/admin/analytics">Volver al acceso administrativo</Link>
    </>}
  </section>;
}
