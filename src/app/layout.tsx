import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import './globals.css';
import { LocationPermission } from '@/components/location-permission';

export const metadata: Metadata = {
  title: 'Know Before You Rent – Nigerian Tenant Insight Platform',
  description:
    'Make informed rental decisions in Nigeria with real tenant reviews.',
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
          <main className="main-content">{children}</main>
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
                {/* <LocationPermission /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
