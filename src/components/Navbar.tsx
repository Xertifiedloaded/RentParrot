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
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand">
          <span className="brand-icon">🏠</span>
          <span className="brand-text">
            Know<em>Before</em>YouRent
          </span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${pathname === l.href ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="nav-user">
              <span className="nav-username">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link
                href="/login"
                className="btn btn-sm btn-outline"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-sm btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
