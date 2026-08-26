import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { PwaRegister } from '@/components/PwaRegister';
import './globals.css';

export async function generateMetadata():Promise<Metadata>{
  const requestHeaders=await headers();
  const host=requestHeaders.get('x-forwarded-host')??requestHeaders.get('host')??'localhost:3000';
  const protocol=requestHeaders.get('x-forwarded-proto')??(host.startsWith('localhost')?'http':'https');
  return {metadataBase:new URL(`${protocol}://${host}`),
  title: { default: 'Míng · Lección 1 de mandarín', template: '%s · Míng' },
  description: 'Domina 你最近怎么样？ con práctica activa, pinyin, tonos, diálogos y hanzi.',
  applicationName: 'Míng · Mandarín activo',
  manifest: '/manifest.webmanifest',
  openGraph: { title: 'Míng · 你最近怎么样？', description: 'Lección 1 de mandarín: práctica activa, examen verificable y progreso persistente.', locale: 'es_PE', type: 'website', images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'Míng, Mandarín activo, Lección 1: 你最近怎么样？' }] },
  twitter: { card: 'summary_large_image', title: 'Míng · Mandarín activo', description: 'Domina la Lección 1: 你最近怎么样？', images: ['/og.png'] },
  icons: { icon: '/favicon.svg' },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}<PwaRegister /></body></html>;
}
