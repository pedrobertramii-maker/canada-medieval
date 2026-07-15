import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Particles from '@/components/Particles';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Canadá | Loja Medieval',
    template: '%s | Canadá Medieval',
  },
  description: 'Loja medieval oficial do reino do Canadá no servidor de Minecraft. Blocos, ferramentas, armaduras, encantamentos e itens lendários.',
  keywords: ['minecraft', 'loja', 'medieval', 'canada', 'canadá', 'servidor', 'blocos', 'ferramentas', 'armaduras'],
  authors: [{ name: 'Reino do Canadá' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'Canadá | Loja Medieval',
    description: 'Loja medieval oficial do reino do Canadá no Minecraft.',
    siteName: 'Canadá Medieval',
  },
  twitter: { card: 'summary_large_image', title: 'Canadá | Loja Medieval' },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#1B1108',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Particles />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
