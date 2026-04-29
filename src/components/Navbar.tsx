'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import toast from 'react-hot-toast';
import { Menu, X, HomeIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/map', label: 'Map' },
    ...(user
      ? [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/post-property', label: 'Post Property' },
        ]
      : []),
  ];

  const firstName = user?.name?.split(' ')[0];
  const initials = firstName?.[0]?.toUpperCase() ?? '?';

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3 group">
          <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-500 to-red-500 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="absolute -top-1 -right-1 text-[8px] sm:text-[10px]">🦜</span>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight text-white">
              Rent<span className="text-orange-500">Parrot</span>
            </span>
            <span className="text-[9px] sm:text-[10px] lg:text-xs text-gray-400 font-medium">Hear before you rent</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-2 rounded-full bg-white/5 p-1 backdrop-blur-md">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-xs lg:text-sm font-medium transition-all ${
                  active ? 'bg-white text-black shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-full bg-white/5 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {initials}
                </div>
                <span className="text-xs lg:text-sm font-medium text-white">{firstName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full border border-white/10 px-5 py-2 text-xs lg:text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-5 py-2 text-xs lg:text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-orange-500 px-5 py-2 text-xs lg:text-sm font-medium text-white shadow-md hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden rounded-lg p-2 text-white hover:bg-white/10 transition"
        >
          {open ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden space-y-2 border-t border-white/10 bg-black/95 px-4 py-4 backdrop-blur-xl animate-in slide-in-from-top-3 fade-in">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          <div className="space-y-2 border-t border-white/10 pt-3">
            {user ? (
              <>
                <div className="px-2 text-xs text-gray-400">
                  Signed in as <span className="font-semibold text-white">{firstName}</span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-left text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-orange-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
