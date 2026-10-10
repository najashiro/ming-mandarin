import { SiteShell } from '@/components/SiteShell';
import { PracticeHub } from '@/components/PracticeHub';
export default function PracticePage() {
  return <SiteShell><main id="main-content" className="practice-page shell"><header className="editorial-heading"><p className="eyebrow">TU MOMENTO DE PRÁCTICA</p><h1>Un poco de práctica.<br/><em>Un gran paso.</em></h1><p>Escuchar, recordar, escribir o jugar. Elige una lección y la habilidad que quieras trabajar hoy.</p></header><PracticeHub/></main></SiteShell>;
}
