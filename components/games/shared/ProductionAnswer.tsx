import { useId } from 'react';

export function ProductionAnswer({ value, onChange, label = 'Tu respuesta' }: { value: string; onChange: (value: string) => void; label?: string }) {
  const hintId = useId();
  return <div className="production-answer">
    <label>{label}<input className="font-hanzi" lang="zh-CN" value={value} onChange={event => onChange(event.target.value)} aria-describedby={hintId} autoComplete="off" autoCorrect="off" spellCheck={false}/></label>
    <p id={hintId}>Escribe en chino con el teclado de tu dispositivo, sin bloques de ayuda.</p>
  </div>;
}
