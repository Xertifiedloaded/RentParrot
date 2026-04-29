'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';
import { HomeIcon } from 'lucide-react';

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

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/25 outline-none transition-all focus:border-amber-400 focus:bg-white/8';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(resetEmail);
      setView('forgot-sent');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090b10] px-4 py-12 flex items-center justify-center">
      {/* Background */}
      <div className="absolute -top-32 left-0 h-72 w-72 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-500/10 blur-[120px]" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          {view === 'login' && (
            <>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">
                Welcome <span></span>
                <span className="text-amber-400">Back</span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-white/35">Sign in to access your tenant insights.</p>
            </>
          )}

          {view === 'forgot' && (
            <>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">
                Reset <span></span>
                <span className="text-amber-400">Password</span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-white/35">We’ll send a reset link to your email.</p>
            </>
          )}

          {view === 'forgot-sent' && (
            <>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">
                Check your <br />
                <span className="text-amber-400">Inbox</span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-white/35">Reset link sent if that email exists.</p>
            </>
          )}
        </div>

        {/* LOGIN */}
        {view === 'login' && (
          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
          >
            {error && (
              <div className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <div className="space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setResetEmail(form.email);
                      setError('');
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className={`${inputClass} pr-16`}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white/70"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-amber-400 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </div>
          </form>
        )}

        {/* FORGOT */}
        {view === 'forgot' && (
          <form onSubmit={handleReset} className="rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl">
            {error && (
              <div className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className={inputClass}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading || !resetEmail}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-amber-400 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setError('');
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/50 hover:text-white/80"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT SENT */}
        {view === 'forgot-sent' && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
              ✉️
            </div>

            <p className="mb-2 text-sm font-semibold text-white">Reset link sent!</p>

            <p className="mb-5 text-xs text-white/35 leading-relaxed">
              If <span className="text-white/60">{resetEmail}</span> exists, you’ll receive a reset link shortly.
            </p>

            <button
              type="button"
              onClick={() => handleReset()}
              disabled={loading}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/50 hover:text-white/80 disabled:opacity-50"
            >
              {loading ? 'Resending...' : 'Resend Email'}
            </button>

            <button
              type="button"
              onClick={() => {
                setView('login');
                setError('');
              }}
              className="w-full rounded-2xl bg-amber-500 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-amber-400"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/30">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-amber-400">
            Create one free
          </Link>
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-white/20">
          <span>🔒 Secure</span>
          <span>🇳🇬 Nigeria-focused</span>
          <span>✓ Verified Reviews</span>
        </div>
      </div>
    </div>
  );
}
