'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { CATEGORY_LABELS, Category } from '@/types';
import { Property } from '@/types';
import toast from 'react-hot-toast';

const inputCls =
  'w-full rounded-lg bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/80 placeholder-white/20 ring-1 ring-white/[0.08] outline-none transition focus:bg-white/[0.06] focus:ring-amber-500/40';

export default function PostReviewContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPropertyId = searchParams.get('propertyId');

  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({
    propertyId: preselectedPropertyId || '',
    categories: [] as Category[],
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.json())
      .then((data) => setProperties(data.properties || []));
  }, []);

  const toggleCategory = (key: Category) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(key)
        ? prev.categories.filter((c) => c !== key)
        : [...prev.categories, key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.propertyId || form.categories.length === 0 || !form.comment) {
      setError('All fields are required. Select at least one category.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: form.propertyId,
          categories: form.categories,
          comment: form.comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post review');
      toast.success('Review posted!');
      router.push(`/properties/${form.propertyId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0c0f14]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-amber-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0c0f14] text-center px-4">
        <span className="text-5xl opacity-20">🔒</span>
        <p className="text-base font-semibold text-white/50">
          Sign in required
        </p>
        <p className="text-sm text-white/25">
          You need to be signed in to leave a review.
        </p>
        <Link
          href="/login"
          className="mt-2 rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-amber-400 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const allCategories = Object.entries(CATEGORY_LABELS) as [Category, string][];
  const positiveCategories = allCategories.filter(([k]) =>
    k.startsWith('GOOD_'),
  );
  const negativeCategories = allCategories.filter(
    ([k]) => !k.startsWith('GOOD_'),
  );

  return (
    <div className="min-h-screen bg-[#0c0f14] font-['Geist_Mono','IBM_Plex_Mono',monospace] text-white">
      <div className="border-b border-white/6 bg-[#0e1117]">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-white/30">
            New Review
          </p>
          <h1 className="text-2xl font-bold text-white/90">Leave a Review</h1>
          <p className="mt-1 text-sm text-white/30">
            Share your real experience to help other renters
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-4">
        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <span className="mt-0.5 text-red-400">⚠</span>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white/3 ring-1 ring-white/[0.07] divide-y divide-white/5"
        >
          <div className="px-6 py-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">
              Property
            </p>
            <select
              value={form.propertyId}
              onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              required
              className={inputCls}
            >
              <option value="" className="bg-[#0e1117]">
                Select a property…
              </option>
              {properties.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0e1117]">
                  {p.name} – {p.address}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-white/25">
              Don&apos;t see it?{' '}
              <Link
                href="/post-property"
                className="text-amber-400/70 hover:text-amber-400 transition-colors underline underline-offset-2"
              >
                Add the property first
              </Link>
            </p>
          </div>

          {/* Categories */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">
                Categories
              </p>
              <span className="text-[10px] text-white/20">
                select all that apply
              </span>
            </div>

            {/* Selected pills */}
            {form.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.categories.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300 ring-1 ring-amber-500/25"
                  >
                    {CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS]}
                    <button
                      type="button"
                      onClick={() => toggleCategory(c)}
                      className="ml-0.5 text-amber-400/60 hover:text-amber-300 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Category grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Positive */}
              <div className="space-y-1.5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400/60">
                  ✅ Positive
                </p>
                {positiveCategories.map(([key, label]) => {
                  const selected = form.categories.includes(key);
                  return (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-all ring-1 ${
                        selected
                          ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/25'
                          : 'bg-white/[0.02] text-white/40 ring-white/[0.06] hover:bg-white/[0.05] hover:text-white/60'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                          selected
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-white/20 bg-transparent'
                        }`}
                      >
                        {selected && (
                          <svg
                            className="h-2.5 w-2.5 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {label}
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={() => toggleCategory(key)}
                      />
                    </label>
                  );
                })}
              </div>

              {/* Negative */}
              <div className="space-y-1.5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-red-400/60">
                  ⚠️ Issues
                </p>
                {negativeCategories.map(([key, label]) => {
                  const selected = form.categories.includes(key);
                  return (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-all ring-1 ${
                        selected
                          ? 'bg-red-500/10 text-red-300 ring-red-500/25'
                          : 'bg-white/[0.02] text-white/40 ring-white/[0.06] hover:bg-white/[0.05] hover:text-white/60'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                          selected
                            ? 'border-red-500 bg-red-500'
                            : 'border-white/20 bg-transparent'
                        }`}
                      >
                        {selected && (
                          <svg
                            className="h-2.5 w-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {label}
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={() => toggleCategory(key)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="px-6 py-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">
              Your Review
            </p>
            <textarea
              placeholder="Describe your experience honestly. The more specific, the more helpful…"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
              rows={5}
              className={`${inputCls} resize-none`}
            />
            <p className="text-[10px] text-white/20">
              {form.comment.length > 0
                ? `${form.comment.length} characters`
                : 'Be specific — it helps other renters'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/30 transition-all hover:text-white/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border border-black/20 border-t-black/70" />
                  Posting…
                </>
              ) : (
                <>
                  Post Review
                  {form.categories.length > 1 && (
                    <span className="rounded-full bg-black/20 px-1.5 py-px text-[10px]">
                      {form.categories.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
