import type { Metadata, Viewport } from 'next';
import { Noto_Serif_SC } from 'next/font/google';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { PwaRegister } from '@/components/PwaRegister';
import './globals.css';
import './learning.css';

// A single variable family preserves the existing intermediate and bold weights.
// Disable the Latin preload and metric fallback: this font is only used for Hanzi.
const notoSerifSC = Noto_Serif_SC({
  weight: 'variable',
  variable: '--font-hanzi',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  fallback: ['Songti SC', 'SimSun', 'serif'],
});

function canonicalOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.startsWith('http') ? configured : `https://${configured}`;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : 'http://localhost:3000';
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1a4233' };

export const metadata: Metadata = {
  metadataBase: new URL(canonicalOrigin()),
  title: { default: 'Míng · Mandarín activo L1–L4', template: '%s · Míng' },
  description: 'Aprende mandarín a tu ritmo. Cuatro lecciones con vocabulario, audio, diálogos, escritura Hanzi y juegos para practicar cada día.',
  applicationName: 'Míng · Mandarín activo',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Míng · Tu próximo paso habla chino',
    description: 'Lecciones 1–4 de mandarín: práctica activa, exámenes por alcance y progreso persistente.',
    locale: 'es_PE', type: 'website',
    images: [{ url: '/images/ming-study.webp', width: 1536, height: 1024, alt: 'Míng: un espacio para aprender mandarín a tu ritmo' }],
  },
  twitter: { card: 'summary_large_image', title: 'Míng · Mandarín activo', description: 'Aprende mandarín con cuatro lecciones y práctica a tu ritmo.', images: ['/images/ming-study.webp'] },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={notoSerifSC.variable}><body>{children}<AnalyticsTracker/><PwaRegister/></body></html>;
}
