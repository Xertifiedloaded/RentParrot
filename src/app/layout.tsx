import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();

  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';

  const currentUrl = `${protocol}://${host}`;

  return {
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
      url: currentUrl,
      siteName: 'Know Before You Rent',
      images: [
        {
          url: `${currentUrl}/icon.png`,
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
      images: [`${currentUrl}/icon.png`],
    },
  };
}

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
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}