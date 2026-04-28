'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';
import { HomeIcon } from 'lucide-react';

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
    { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-400' },
    { label: 'Good', color: 'bg-amber-500', text: 'text-amber-300' },
    { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: 'Very strong', color: 'bg-green-400', text: 'text-green-300' },
  ];

  const lvl = levels[Math.min(score, 5)];
  const bars = Array.from({ length: 5 }, (_, i) =>
    i < score ? lvl.color : 'bg-white/10'
  );

  return { score, label: lvl.label, color: lvl.text, bars };
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength.score < 2) return;

    setError('');
    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/25 outline-none transition-all focus:border-amber-400 focus:bg-white/8';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090b10] px-4 py-12 flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute -top-32 left-0 h-72 w-72 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-500/10 blur-[120px]" />

      {/* Grid */}
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
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">
            Join the <br />
            <span className="text-amber-400">Community</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/35">
            Help renters make smarter decisions across Lagos.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl"
        >
          {error && (
            <div className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`${inputClass} pr-12`}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {form.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {strength.bars.map((bar, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${bar}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs">
                  <span className={strength.color}>{strength.label}</span>
                  <span className="text-white/25">
                    {strength.score < 3
                      ? 'Add numbers & symbols'
                      : strength.score < 5
                      ? 'Add special chars'
                      : 'Great password'}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/30">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-amber-400">
            Sign in
          </Link>
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-white/20">
          <span>🔒 Secure</span>
          <span>🇳🇬 Nigeria-focused</span>
          <span>✓ Free Forever</span>
        </div>
      </div>
    </div>
  );
}