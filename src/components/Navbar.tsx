'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import toast from 'react-hot-toast';

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
    <nav
      className="sticky top-0 z-[100] border-b border-bg-border"
      style={{ background: 'rgba(26,26,26,0.9)', backdropFilter: 'blur(24px)' }}
    >
      <div className="max-w-[1280px] mx-auto px-5 h-[62px] flex items-center justify-between gap-6">
        {/* ── Brand ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline flex-shrink-0"
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px]"
            style={{ background: 'var(--color-accent)' }}
          >
            🏠
          </span>
          <span
            className="text-[19px] tracking-[0.12em] text-ink-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            KNOW
            <span style={{ color: 'var(--color-accent)' }}>BEFORE</span>
            YOURENT
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${active ? 'active' : ''}`}
                style={{
                  background: active
                    ? 'var(--color-bg-elevated)'
                    : 'transparent',
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* ── Auth ── */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {/* Avatar + name */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background: 'var(--color-accent-glow)',
                    border: '1px solid rgba(232,93,4,0.3)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {initials}
                </div>
                <span
                  className="text-[13px]"
                  style={{ color: 'var(--color-ink-secondary)' }}
                >
                  Hi, {firstName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="btn-outline px-3.5 py-1.5 rounded-xl text-[13px] font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-outline px-4 py-1.5 rounded-xl text-[13px] font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary px-4 py-1.5 rounded-xl text-[13px]"
              >
                Register Free
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-0 cursor-pointer p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-ink-secondary)' }}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-[2px] rounded-full transition-all duration-200"
            style={{
              background: 'var(--color-ink-secondary)',
              transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none',
            }}
          />
          <span
            className="block w-5 h-[2px] rounded-full transition-all duration-200"
            style={{
              background: 'var(--color-ink-secondary)',
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-[2px] rounded-full transition-all duration-200"
            style={{
              background: 'var(--color-ink-secondary)',
              transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div
          className="md:hidden border-t border-bg-border px-5 py-4 flex flex-col gap-1"
          style={{ background: 'var(--color-bg-card)' }}
        >
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`nav-link px-4 py-2.5 rounded-xl text-[14px] font-medium text-center ${active ? 'active' : ''}`}
                style={{
                  background: active
                    ? 'var(--color-bg-elevated)'
                    : 'transparent',
                }}
              >
                {l.label}
              </Link>
            );
          })}

          <div className="border-t border-bg-border mt-2 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <div
                  className="text-center text-[13px] py-1"
                  style={{ color: 'var(--color-ink-secondary)' }}
                >
                  Signed in as{' '}
                  <strong style={{ color: 'var(--color-ink-primary)' }}>
                    {firstName}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="btn-outline px-4 py-2.5 rounded-xl text-[14px] font-medium justify-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-outline px-4 py-2.5 rounded-xl text-[14px] font-medium justify-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="btn-primary px-4 py-2.5 rounded-xl text-[14px] justify-center"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
