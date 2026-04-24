import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Know Before You Rent – Nigerian Tenant Insight Platform',
  description:
    'Make informed rental decisions in Nigeria with real tenant reviews.',

  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },

  openGraph: {
    title: 'Know Before You Rent – Nigerian Tenant Insight Platform',
    description:
      'Make informed rental decisions in Nigeria with real tenant reviews.',
    url: 'https://yourdomain.com',
    siteName: 'Know Before You Rent',
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
        alt: 'Know Before You Rent',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Know Before You Rent – Nigerian Tenant Insight Platform',
    description:
      'Make informed rental decisions in Nigeria with real tenant reviews.',
    images: ['/icon.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ overflowX: 'hidden', maxWidth: '100%' }}>
      <body
        style={{ overflowX: 'hidden', maxWidth: '100%', position: 'relative' }}
      >
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontFamily: 'var(--font-body)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}