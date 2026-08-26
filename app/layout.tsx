import type { Metadata } from 'next';
import { PwaRegister } from '@/components/PwaRegister';
import './globals.css';

function canonicalOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.startsWith('http') ? configured : `https://${configured}`;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : 'http://localhost:3000';
}

export const metadata: Metadata = {
  metadataBase: new URL(canonicalOrigin()),
  title: { default: 'Míng · Lección 1 de mandarín', template: '%s · Míng' },
  description: 'Domina 你最近怎么样？ con práctica activa, pinyin, tonos, diálogos y hanzi.',
  applicationName: 'Míng · Mandarín activo',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Míng · 你最近怎么样？',
    description: 'Lección 1 de mandarín: práctica activa, examen verificable, ranking voluntario y progreso persistente.',
    locale: 'es_PE', type: 'website',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'Míng, Mandarín activo, Lección 1: 你最近怎么样？' }],
  },
  twitter: { card: 'summary_large_image', title: 'Míng · Mandarín activo', description: 'Domina la Lección 1: 你最近怎么样？', images: ['/og.png'] },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}<PwaRegister/></body></html>;
}
