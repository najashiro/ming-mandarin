'use client';

import { useState } from 'react';

export function AdminLoginForm({ returnTo }: { returnTo: string }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  return <form className="login-card panel admin-login" onSubmit={async (event) => { event.preventDefault(); setBusy(true); setMessage(''); try { const response = await fetch('/api/auth/admin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) }); const body = await response.json() as { error?: string }; if (!response.ok) throw new Error(body.error ?? 'No se pudo iniciar sesión.'); window.location.assign(returnTo); } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión.'); } finally { setBusy(false); } }}>
    <label>Correo administrativo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label>
    <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="current-password" /></label>
    <button className="button button-primary" disabled={busy}>{busy ? 'Verificando…' : 'Entrar a administración'}</button>
    {message && <p className="rule-note" role="alert">{message}</p>}
    <small>Las credenciales se validan directamente con Supabase Auth y nunca se almacenan en el código ni en el navegador.</small>
  </form>;
}
