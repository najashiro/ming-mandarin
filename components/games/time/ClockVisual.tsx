import { clockAngles, isAnalog, type ClockVariant } from '@/lib/time-game';
export function AnalogClock({hour,minute,variant}:{hour:number;minute:number;variant:ClockVariant}) {
  const {hourAngle,minuteAngle}=clockAngles(hour,minute);
  return <svg className={`time-clock analog ${variant}`} viewBox="0 0 240 240" role="img" aria-label={`Reloj ${hour}:${String(minute).padStart(2,'0')}`}>
    <circle cx="120" cy="120" r="113" className="face"/>
    {Array.from({length:60},(_,index)=>{const angle=index*6*Math.PI/180;const major=index%5===0;return <line key={index} x1={120+Math.sin(angle)*(major?96:103)} y1={120-Math.cos(angle)*(major?96:103)} x2={120+Math.sin(angle)*108} y2={120-Math.cos(angle)*108} className="tick" strokeWidth={major?2:1}/>;})}
    {Array.from({length:12},(_,i)=>{const n=i+1,a=n*30*Math.PI/180;return <text key={n} x={120+Math.sin(a)*78} y={120-Math.cos(a)*78} textAnchor="middle" dominantBaseline="central">{n}</text>;})}
    <line x1="120" y1="120" x2="120" y2="67" className="hour-hand" transform={`rotate(${hourAngle} 120 120)`}/>
    <line x1="120" y1="120" x2="120" y2="40" className="minute-hand" transform={`rotate(${minuteAngle} 120 120)`}/><circle cx="120" cy="120" r="5" className="pin"/>
  </svg>;
}
export function DigitalClock({hour,minute,variant}:{hour:number;minute:number;variant:ClockVariant}) {return <div className={`time-clock digital ${variant}`} role="img" aria-label={`Hora ${hour}:${String(minute).padStart(2,'0')}`}><span>{String(hour).padStart(2,'0')}:{String(minute).padStart(2,'0')}</span></div>;}
export function ClockVisual({hour,minute,variant}:{hour:number;minute:number;variant:ClockVariant}) {return <div className="time-clock-frame" key={variant}>{isAnalog(variant)?<AnalogClock hour={hour} minute={minute} variant={variant}/>:<DigitalClock hour={hour} minute={minute} variant={variant}/>}</div>;}
