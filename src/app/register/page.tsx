'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

function getStrength(pw: string): {
  score: number;
  label: string;
  color: string;
  bars: string[];
} {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { label: 'Too short', color: 'bg-red-500', text: 'text-red-400' },
    { label: 'Weak', color: 'bg-red-500', text: 'text-red-400' },
    { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Good', color: 'bg-amber-400', text: 'text-amber-300' },
    { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: 'Very strong', color: 'bg-emerald-400', text: 'text-emerald-300' },
  ];

  const lvl = levels[Math.min(score, 5)];
  const bars = Array.from({ length: 5 }, (_, i) =>
    i < score ? lvl.color : 'bg-white/[0.08]',
  );

  return { score, label: lvl.label, color: lvl.text, bars };
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const strength = useMemo(() => getStrength(form.password), [form.password]);
  const passwordWeak =
    touched.password && form.password.length > 0 && strength.score < 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (strength.score < 2) return;
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full rounded-xl bg-white/[0.05] py-3 text-[13px] text-white placeholder-white/20 ring-1 outline-none transition-all focus:bg-white/[0.07] focus:ring-2';
  const inputNormal = 'ring-white/[0.08] focus:ring-amber-500/40';
  const inputError = 'ring-red-500/50 focus:ring-red-500/60 bg-red-500/[0.04]';

  return (
    <div className="relative min-h-screen bg-[#0c0f14] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-125 w-125 rounded-full bg-amber-500/6 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-100 w-100 rounded-full bg-amber-500/4 blur-[100px]" />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-black font-black text-sm">
              K
            </span>
            <span className="font-['Cabinet_Grotesk','Syne',sans-serif] text-sm font-bold uppercase tracking-widest text-white/60">
              KnowBeforeYouRent
            </span>
          </Link>
          <h1 className="font-['Cabinet_Grotesk','Syne',sans-serif] text-[32px] font-black uppercase leading-none tracking-tight text-white">
            Join the
            <br />
            <span className="text-amber-400">Community.</span>
          </h1>
          <p className="mt-2 text-[12px] text-white/30">
            Help Lagos renters make smarter decisions
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/3 p-6 ring-1 ring-white/8 backdrop-blur-sm">
          {/* Error banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
              <svg
                className="mt-0.5 shrink-0 text-red-400"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-[12px] text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Full Name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Chidi Okeke"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  required
                  className={`${inputBase} pl-10 pr-4 ${touched.name && !form.name ? inputError : inputNormal}`}
                />
              </div>
              {touched.name && !form.name && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                  </svg>
                  Name is required
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  required
                  className={`${inputBase} pl-10 pr-4 ${touched.email && !form.email ? inputError : inputNormal}`}
                />
              </div>
              {touched.email && !form.email && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                  </svg>
                  Email is required
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  required
                  minLength={6}
                  className={`${inputBase} pl-10 pr-11 ${passwordWeak ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 transition-colors hover:text-white/50"
                >
                  {showPassword ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {form.password.length > 0 && (
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex gap-1">
                    {strength.bars.map((bar, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${bar}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[11px] font-semibold ${strength.color}`}
                    >
                      {strength.label}
                    </p>
                    <p className="text-[10px] text-white/20">
                      {strength.score < 3
                        ? 'Add numbers & symbols'
                        : strength.score < 5
                          ? 'Add special characters'
                          : 'Great password!'}
                    </p>
                  </div>
                </div>
              )}

              {passwordWeak && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                  </svg>
                  Password is too weak
                </p>
              )}
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-amber-500 py-3 text-[13px] font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-white/25">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-amber-400/70 transition-colors hover:text-amber-400"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          {['🔒 Secure', '🇳🇬 Lagos-focused', '✓ Free Forever'].map((badge) => (
            <span key={badge} className="text-[10px] font-medium text-white/15">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
