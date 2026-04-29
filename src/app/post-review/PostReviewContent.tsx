'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { CATEGORY_LABELS, Category } from '@/types';
import { Property } from '@/types';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Building2,
  Send,
  Search,
  X,
} from 'lucide-react';

export default function PostReviewContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPropertyId = searchParams.get('propertyId');

  const [properties, setProperties] = useState<Property[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [propertyInput, setPropertyInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    propertyId: preselectedPropertyId || '',
    categories: [] as Category[],
    comment: '',
  });

  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.json())
      .then((d) => {
        const props: Property[] = d.properties || [];
        setProperties(props);
        if (preselectedPropertyId) {
          const found = props.find((p) => p.id === preselectedPropertyId);
          if (found) {
            setSelectedProperty(found);
            setPropertyInput(found.name);
          }
        }
      });
  }, [preselectedPropertyId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredProperties = properties.filter((p) => {
    const q = propertyInput.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.town?.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q)
    );
  });

  const handlePropertySelect = (p: Property) => {
    setSelectedProperty(p);
    setPropertyInput(p.name);
    setForm((prev) => ({ ...prev, propertyId: p.id }));
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearProperty = () => {
    setSelectedProperty(null);
    setPropertyInput('');
    setForm((prev) => ({ ...prev, propertyId: '' }));
    setTimeout(() => inputRef.current?.focus(), 50);
  };

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

    if (!form.propertyId || !form.comment || form.categories.length === 0) {
      setError(
        'Please select a property, at least one category, and write a comment.',
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSubmitted(true);
      toast.success('Review submitted!');
      setTimeout(() => router.push(`/properties/${form.propertyId}`), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const allCategories = Object.entries(CATEGORY_LABELS) as [Category, string][];
  const positive = allCategories.filter(([k]) => k.startsWith('GOOD_'));
  const negative = allCategories.filter(([k]) => !k.startsWith('GOOD_'));
  const charCount = form.comment.length;
  const minChars = 20;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080a0f]">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping" />
          <div className="h-12 w-12 rounded-full border-2 border-white/10 border-t-amber-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080a0f] px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 border border-amber-500/20">
            <MessageSquare
              size={32}
              className="text-amber-400"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-xl font-black text-white mb-2">
            Sign in to review
          </h2>
          <p className="text-sm text-white/50 mb-8 leading-relaxed">
            You need an account to share your experience and help other renters.
          </p>
          <Link
            href="/login"
            className="block w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-bold text-black hover:bg-amber-400 transition-all active:scale-95"
          >
            Sign In
          </Link>
          <Link
            href="/properties"
            className="mt-4 block text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Browse properties instead
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080a0f] px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2
              size={36}
              className="text-emerald-400"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            Review submitted!
          </h2>
          <p className="text-sm text-white/50">
            Redirecting to the property page…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-amber-500/6 blur-[120px]" />
      </div>

      <div className="z-20 border-b border-white/6 bg-[#080a0f]/80 backdrop-blur-xl sticky top-0">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-white/30">
            Write Review
          </span>
          <div className="w-16" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        {/* ── Page Header ── */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Tenant Review
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            Share Your <span className="text-amber-400">Experience</span>
          </h1>
          <p className="mt-2 text-sm text-white/50 max-w-md leading-relaxed">
            Your honest review helps other renters make better decisions. Be
            specific and factual.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* ── Error ── */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3.5 flex items-start gap-3">
              <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-red-400/50 flex items-center justify-center">
                <span className="text-[8px] font-black text-red-400">!</span>
              </div>
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </div>
          )}

          <div className="rounded-2xl border border-white/8 bg-white/2 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/20">
                <Building2 size={14} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Select Property</p>
                <p className="text-xs text-white/40">
                  Search by name, address or area
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 sm:px-4 transition-all ${
                  showSuggestions
                    ? 'border-amber-500/40 ring-2 ring-amber-500/10'
                    : 'border-white/10'
                } bg-white/5`}
              >
                <Search
                  size={14}
                  className={`shrink-0 transition-colors ${showSuggestions ? 'text-amber-400' : 'text-white/30'}`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type property name, address or town…"
                  value={propertyInput}
                  onChange={(e) => {
                    setPropertyInput(e.target.value);
                    setSelectedProperty(null);
                    setForm((prev) => ({ ...prev, propertyId: '' }));
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="flex-1 bg-transparent py-3 sm:py-3.5 text-sm text-white placeholder:text-white/30 outline-none"
                  autoComplete="off"
                />
                {propertyInput && (
                  <button
                    type="button"
                    onClick={clearProperty}
                    className="shrink-0 p-1 text-white/30 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {showSuggestions && propertyInput.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-white/10 bg-[#0f1117] shadow-2xl shadow-black/50 overflow-hidden"
                >
                  {filteredProperties.length === 0 ? (
                    <div className="px-4 py-5 text-center">
                      <p className="text-sm text-white/40 font-medium">
                        No properties found
                      </p>
                      <p className="text-xs text-white/25 mt-1">
                        Try a different search term
                      </p>
                    </div>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto divide-y divide-white/4">
                      {filteredProperties.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onMouseDown={() => handlePropertySelect(p)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/15">
                              <Building2
                                size={13}
                                className="text-amber-400/70"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {p.name}
                              </p>
                              <p className="text-xs text-white/40 truncate">
                                {p.address}
                                {p.town ? `, ${p.town}` : ''}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {selectedProperty && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {selectedProperty.name}
                  </p>
                  <p className="text-xs text-white/50 truncate">
                    {selectedProperty.address}
                    {selectedProperty.town
                      ? `, ${selectedProperty.town}`
                      : ''}{' '}
                    · {selectedProperty.state}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearProperty}
                  className="shrink-0 text-white/30 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* ── Card 2: Categories ── */}
          <div className="rounded-2xl border border-white/8 bg-white/2 p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/8 border border-white/10">
                <CheckCircle2 size={14} className="text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Categories</p>
                <p className="text-xs text-white/40">Select all that apply</p>
              </div>
              {form.categories.length > 0 && (
                <span className="shrink-0 rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                  {form.categories.length} selected
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <ThumbsUp size={12} className="text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400/80">
                  Positives
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {positive.map(([key, label]) => {
                  const active = form.categories.includes(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleCategory(key)}
                      className={`flex items-center gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium border transition-all text-left active:scale-[0.98] ${
                        active
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-white/8 bg-white/2 text-white/70 hover:border-white/15 hover:bg-white/5'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          active
                            ? 'border-emerald-400 bg-emerald-400'
                            : 'border-white/25'
                        }`}
                      >
                        {active && (
                          <svg
                            width="9"
                            height="7"
                            viewBox="0 0 9 7"
                            fill="none"
                          >
                            <path
                              d="M1 3.5L3.2 5.5L8 1"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-xs sm:text-sm">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Issues */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2">
                <ThumbsDown size={12} className="text-red-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-400/80">
                  Issues / Concerns
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {negative.map(([key, label]) => {
                  const active = form.categories.includes(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleCategory(key)}
                      className={`flex items-center gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium border transition-all text-left active:scale-[0.98] ${
                        active
                          ? 'border-red-500/40 bg-red-500/8 text-red-300'
                          : 'border-white/8 bg-white/2 text-white/70 hover:border-white/15 hover:bg-white/5'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          active
                            ? 'border-red-400 bg-red-400'
                            : 'border-white/25'
                        }`}
                      >
                        {active && (
                          <svg
                            width="9"
                            height="7"
                            viewBox="0 0 9 7"
                            fill="none"
                          >
                            <path
                              d="M1 3.5L3.2 5.5L8 1"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-xs sm:text-sm">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>


          <div className="rounded-2xl border border-white/8 bg-white/2 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/8 border border-white/10">
                <MessageSquare size={14} className="text-white/60" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Your Review</p>
                <p className="text-xs text-white/40">Be honest and specific</p>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none leading-relaxed"
                placeholder="e.g. Electricity was very unstable with frequent cuts. The landlord was slow to fix issues. Water supply was decent. Overall a difficult place to live in…"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
              <div className="absolute bottom-3 right-3">
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    charCount >= minChars
                      ? 'text-emerald-400/60'
                      : 'text-white/25'
                  }`}
                >
                  {charCount < minChars
                    ? `${minChars - charCount} more needed`
                    : `${charCount} chars ✓`}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/6 bg-white/2 px-3 sm:px-4 py-3">
              <p className="text-xs text-white/35 leading-relaxed">
                <span className="font-semibold text-white/50">Tip:</span> Focus
                on facts — electricity, water, landlord behaviour, road access,
                security. Your review is anonymous to landlords.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 pb-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="self-start text-xs sm:text-sm text-white/40 hover:text-white/70 transition-colors font-medium"
            >
              Cancel
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="
      w-full sm:w-auto
      inline-flex items-center justify-center gap-2
      rounded-xl bg-amber-500
      px-4 sm:px-6
      py-2.5 sm:py-3
      text-xs sm:text-sm font-semibold text-black
      hover:bg-amber-400 active:scale-95 transition
      shadow-md shadow-amber-500/20
      disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    "
            >
              {submitting ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                  <span>Submitting</span>
                </>
              ) : (
                <>
                  <Send size={14} className="shrink-0" />
                  <span className="whitespace-nowrap">Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
