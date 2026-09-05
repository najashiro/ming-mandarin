import Link from 'next/link';
import { formatStudyTime } from '@/lib/analytics/shared';
import type { AnalyticsDashboardData } from '@/lib/server/analytics';

const rangeLabels = { 1: 'Hoy', 7: '7 días', 30: '30 días' } as const;

function EmptyRow({ message = 'Aún no hay actividad en este periodo.' }: { message?: string }) {
  return <p className="analytics-empty">{message}</p>;
}

function Completion({ started, completed }: { started: number; completed: number }) {
  const percentage = started ? Math.round((completed / started) * 100) : 0;
  return <span>{started} iniciados · {completed} completados · {percentage}%</span>;
}

export function AnalyticsDashboard({ data, days }: { data: AnalyticsDashboardData; days: 1 | 7 | 30 }) {
  const maxTrend = Math.max(1, ...data.trend.map((item) => item.activeSeconds));
  const kpis = [
    ['Visitantes', data.kpis.visitors.toLocaleString('es-PE'), 'Identidades únicas'],
    ['Estudiantes activos', data.kpis.activeUsers.toLocaleString('es-PE'), 'Con cuenta identificada'],
    ['Sesiones', data.kpis.sessions.toLocaleString('es-PE'), 'Sin duplicar recargas'],
    ['Tiempo de estudio', formatStudyTime(data.kpis.activeSeconds), 'Solo tiempo efectivo'],
    ['Promedio por sesión', formatStudyTime(data.kpis.avgSessionSeconds), 'Tiempo efectivo medio'],
    ['Ejercicios realizados', data.kpis.exercises.toLocaleString('es-PE'), `${data.kpis.correctAnswers} correctas · ${data.kpis.incorrectAnswers} incorrectas`],
  ];

  return <div className="analytics-dashboard shell">
    <nav className="analytics-range" aria-label="Periodo de analítica">
      {([1, 7, 30] as const).map((range) => <Link className={days === range ? 'selected' : ''} aria-current={days === range ? 'page' : undefined} href={`/admin/analytics?range=${range}`} key={range}>{rangeLabels[range]}</Link>)}
    </nav>

    <section className="analytics-kpis" aria-label="Indicadores principales">
      {kpis.map(([label, value, note]) => <article className="panel" key={label}><span>{label}{days === 1 ? ' hoy' : ''}</span><strong>{value}</strong><small>{note}</small></article>)}
    </section>

    <section className="analytics-grid">
      <article className="panel analytics-wide"><header><p className="eyebrow">ACTIVIDAD</p><h2>Actividad por lección</h2></header>
        {data.lessons.length ? <div className="analytics-table"><div className="analytics-table-head"><span>Lección</span><span>Tiempo</span><span>Vistas</span><span>Ejercicios</span><span>Aciertos / errores</span><span>Hanzi</span></div>{data.lessons.map((item) => <div key={item.id}><b>{item.id.toUpperCase()}</b><span>{formatStudyTime(item.activeSeconds)}</span><span>{item.pageViews}</span><span>{item.exercises}</span><span>{item.correctAnswers} / {item.incorrectAnswers}</span><span>{item.hanzi}</span></div>)}</div> : <EmptyRow/>}
      </article>

      <article className="panel analytics-wide"><header><p className="eyebrow">USO</p><h2>Contenido más utilizado</h2></header>
        {data.modules.length ? <div className="analytics-module-summary">{data.modules.map((item) => <div key={item.id}><b>{item.id}</b><span>{formatStudyTime(item.activeSeconds)}</span><small>{item.pageViews} vistas · {item.exercises} ejercicios</small></div>)}</div> : null}
        {data.content.length ? <div className="analytics-content-list">{data.content.map((item) => <div key={`${item.module}-${item.route}`}><span className="analytics-module">{item.module}</span><b>{item.route}</b><span>{item.pageViews} vistas</span><span>{formatStudyTime(item.activeSeconds)}</span></div>)}</div> : <EmptyRow/>}
      </article>

      <article className="panel"><header><p className="eyebrow">JUEGOS</p><h2>Inicio y finalización</h2></header>
        {data.games.length ? <div className="analytics-compact-list">{data.games.map((item) => <div key={item.id}><b>{item.id}</b><Completion started={item.started} completed={item.completed}/></div>)}</div> : <EmptyRow/>}
      </article>

      <article className="panel"><header><p className="eyebrow">HANZI</p><h2>Caracteres practicados</h2></header>
        {data.hanzi.length ? <div className="analytics-hanzi-list">{data.hanzi.map((item) => <div key={item.id}><b>{item.id}</b><span>{item.practiced} prácticas</span></div>)}</div> : <EmptyRow/>}
      </article>

      <article className="panel"><header><p className="eyebrow">EXÁMENES</p><h2>Inicio y finalización</h2></header>
        {data.exams.length ? <div className="analytics-compact-list">{data.exams.map((item) => <div key={item.id}><b>{item.id.toUpperCase()}</b><Completion started={item.started} completed={item.completed}/></div>)}</div> : <EmptyRow/>}
      </article>

      <article className="panel analytics-wide"><header><p className="eyebrow">TENDENCIA</p><h2>Actividad diaria</h2></header>
        {data.trend.length ? <div className="analytics-trend" aria-label="Tiempo efectivo diario">{data.trend.map((item) => <div key={item.day}><div><i style={{ height: `${Math.max(4, (item.activeSeconds / maxTrend) * 100)}%` }}/></div><b>{new Date(`${item.day}T12:00:00`).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</b><span>{formatStudyTime(item.activeSeconds)}</span><small>{item.visitors} visitantes · {item.exercises} ejercicios</small></div>)}</div> : <EmptyRow/>}
      </article>
    </section>
  </div>;
}
