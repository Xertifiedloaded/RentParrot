import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();

  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';

  const currentUrl = `${protocol}://${host}`;

  return {
    title: 'RentParrot🦜 – Nigerian Tenant Insight Platform',
    description:
      'Make informed rental decisions in Nigeria with real tenant reviews.',
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
    openGraph: {
      title: 'RentParrot🦜 – Nigerian Tenant Insight Platform',
      description:
        'Make informed rental decisions in Nigeria with real tenant reviews.',
      url: currentUrl,
      siteName: 'RentParrot🦜',
      images: [
        {
          url: `${currentUrl}/icon.png`,
          width: 1200,
          height: 630,
          alt: 'RentParrot',
        },
      ],
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'RentParrot🦜 – Nigerian Tenant Insight Platform',
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
    userScalable: false,
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
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}