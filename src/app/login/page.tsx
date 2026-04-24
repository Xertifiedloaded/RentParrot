'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

type View = 'login' | 'forgot' | 'forgot-sent';

export default function LoginPage() {
  const { login, resetPassword } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<View>('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(resetEmail);
      setView('forgot-sent');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0c0f14] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-500/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-amber-500/[0.04] blur-[100px]" />

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
            <span className="font-['Cabinet_Grotesk',_'Syne',_sans-serif] text-sm font-bold uppercase tracking-widest text-white/60">
              KnowBeforeYouRent
            </span>
          </Link>

          {/* Dynamic heading per view */}
          {view === 'login' && (
            <>
              <h1 className="font-['Cabinet_Grotesk',_'Syne',_sans-serif] text-[32px] font-black uppercase leading-none tracking-tight text-white">
                Welcome
                <br />
                <span className="text-amber-400">Back.</span>
              </h1>
              <p className="mt-2 text-[12px] text-white/30">
                Sign in to access your tenant insights
              </p>
            </>
          )}
          {view === 'forgot' && (
            <>
              <h1 className="font-['Cabinet_Grotesk',_'Syne',_sans-serif] text-[32px] font-black uppercase leading-none tracking-tight text-white">
                Reset
                <br />
                <span className="text-amber-400">Password.</span>
              </h1>
              <p className="mt-2 text-[12px] text-white/30">
                We'll send a reset link to your email
              </p>
            </>
          )}
          {view === 'forgot-sent' && (
            <>
              <h1 className="font-['Cabinet_Grotesk',_'Syne',_sans-serif] text-[32px] font-black uppercase leading-none tracking-tight text-white">
                Check your
                <br />
                <span className="text-amber-400">Inbox.</span>
              </h1>
              <p className="mt-2 text-[12px] text-white/30">
                Reset link sent if that email exists
              </p>
            </>
          )}
        </div>

        {/* ══ LOGIN VIEW ══ */}
        {view === 'login' && (
          <div className="rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/[0.08] backdrop-blur-sm">
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
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    className="w-full rounded-xl bg-white/[0.05] pl-10 pr-4 py-3 text-[13px] text-white placeholder-white/20 ring-1 ring-white/[0.08] outline-none transition-all focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setResetEmail(form.email);
                      setError('');
                    }}
                    className="text-[11px] font-medium text-amber-400/60 transition-colors hover:text-amber-400"
                  >
                    Forgot password?
                  </button>
                </div>
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
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    className="w-full rounded-xl bg-white/[0.05] pl-10 pr-11 py-3 text-[13px] text-white placeholder-white/20 ring-1 ring-white/[0.08] outline-none transition-all focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-500/40"
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
              </div>

              {/* Submit */}
              <button
                type="submit"
                onClick={handleLogin}
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
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
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
        )}

        {/* ══ FORGOT PASSWORD VIEW ══ */}
        {view === 'forgot' && (
          <div className="rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/[0.08] backdrop-blur-sm">
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
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                  Email Address
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
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full rounded-xl bg-white/[0.05] pl-10 pr-4 py-3 text-[13px] text-white placeholder-white/20 ring-1 ring-white/[0.08] outline-none transition-all focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={handleReset}
                disabled={loading || !resetEmail}
                className="w-full rounded-xl bg-amber-500 py-3 text-[13px] font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    Sending…
                  </>
                ) : (
                  <>
                    Send Reset Link
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

              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setError('');
                }}
                className="w-full rounded-xl bg-white/[0.03] py-3 text-[13px] font-bold uppercase tracking-widest text-white/40 ring-1 ring-white/[0.07] transition-all hover:bg-white/[0.06] hover:text-white/60 flex items-center justify-center gap-2"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* ══ FORGOT SENT VIEW ══ */}
        {view === 'forgot-sent' && (
          <div className="rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/[0.08] backdrop-blur-sm text-center">
            {/* Success icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-emerald-400"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>

            <p className="mb-1 text-[13px] font-semibold text-white/80">
              Reset link sent!
            </p>
            <p className="mb-5 text-[12px] leading-relaxed text-white/30">
              If <span className="text-white/50">{resetEmail}</span> is
              registered, you'll get an email with a reset link shortly. Check
              your spam folder too.
            </p>

            {/* Resend */}
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="mb-3 w-full rounded-xl bg-white/[0.05] py-3 text-[13px] font-bold uppercase tracking-widest text-white/40 ring-1 ring-white/[0.07] transition-all hover:bg-white/[0.08] hover:text-white/60 flex items-center justify-center gap-2 disabled:opacity-40"
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
                  Resending…
                </>
              ) : (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M21 2 11 13" />
                    <path d="M21 2 15 22 11 13 2 9l19-7z" />
                  </svg>
                  Resend Email
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setView('login');
                setError('');
              }}
              className="w-full rounded-xl bg-amber-500 py-3 text-[13px] font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Sign In
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-[12px] text-white/25">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-amber-400/70 transition-colors hover:text-amber-400"
          >
            Create one free
          </Link>
        </p>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {['🔒 Secure', '🇳🇬 Lagos-focused', '✓ Verified Reviews'].map(
            (badge) => (
              <span
                key={badge}
                className="text-[10px] font-medium text-white/15"
              >
                {badge}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
