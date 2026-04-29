'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar = pathname === '/map';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main
        className={!hideNavbar ? 'min-h-[calc(100vh-64px)]' : 'min-h-screen'}
      >
        {children}
      </main>
    </>
  );
}
