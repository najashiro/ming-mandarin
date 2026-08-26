'use client';

import { useState } from 'react';

export function ProfileForm({ initialName, initialOptIn, initialTimezone }: { initialName:string; initialOptIn:boolean; initialTimezone:string }) {
  const [displayName,setDisplayName]=useState(initialName);const [leaderboardOptIn,setOptIn]=useState(initialOptIn);const [timezone,setTimezone]=useState(initialTimezone);const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  async function save(event:React.FormEvent){event.preventDefault();setBusy(true);const response=await fetch('/api/profile',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({displayName,leaderboardOptIn,timezone})});const body=await response.json() as {error?:string};setMessage(response.ok?'Perfil guardado.':body.error??'No se pudo guardar.');setBusy(false);}
  return <form className="profile-form panel" onSubmit={save}><label>Nickname público<input value={displayName} minLength={2} maxLength={40} onChange={(e)=>setDisplayName(e.target.value)}/></label><label>Zona horaria<input value={timezone} onChange={(e)=>setTimezone(e.target.value)}/></label><label className="check-row"><input type="checkbox" checked={leaderboardOptIn} onChange={(e)=>setOptIn(e.target.checked)}/><span><b>Participar en el ranking público</b><small>Solo se muestra el nickname, nunca el correo. Puedes retirarte cuando quieras.</small></span></label><button className="button button-primary" disabled={busy}>{busy?'Guardando…':'Guardar cambios'}</button>{message&&<p className="rule-note">{message}</p>}</form>;
}
