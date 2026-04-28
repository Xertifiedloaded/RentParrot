'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ReviewCard from '@/components/ReviewCard';
import {
  Property,
  NEGATIVE_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_TAILWIND,
  Tab,
} from '@/types';
import { useAuth } from '@/components/AuthProvider';
import {
  HomeIcon,
  MapPin,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

const FONT_MONO = "'Instrument Mono', 'JetBrains Mono', monospace";
const GoogleMap = dynamic(() => import('@/components/GoogleMap'), { ssr: false });

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProperty(data.property);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch(`/api/summary/${id}`);
      const data = await res.json();
      setSummary(data.summary);
    } catch {
      setSummary('Summary unavailable.');
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#08090c]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border border-[#c8a96e]/20 animate-ping" />
            <div className="h-10 w-10 rounded-full border border-[#c8a96e]/40 border-t-[#c8a96e] animate-spin" />
          </div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/20">
            Loading property
          </p>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#08090c] text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-center">
          <HomeIcon size={28} className="text-white/15" />
        </div>
        <p className="text-base font-semibold text-white/40 mb-1">Property not found</p>
        <p className="text-xs text-white/20">
          This property may have been removed or doesn't exist.
        </p>
        <Link
          href="/properties"
          className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-5 py-2.5 text-xs font-medium text-white/40 hover:bg-white/6 hover:text-white/60 transition-all"
        >
          <ArrowLeft size={13} /> Back to Properties
        </Link>
      </div>
    );

  const reviews = property.reviews || [];
  const positiveReviews = reviews.filter(
    (r) => !r.categories.some((c) => NEGATIVE_CATEGORIES.includes(c))
  );
  const negativeReviews = reviews.filter((r) =>
    r.categories.some((c) => NEGATIVE_CATEGORIES.includes(c))
  );
  const displayedReviews =
    activeTab === 'positive'
      ? positiveReviews
      : activeTab === 'negative'
        ? negativeReviews
        : reviews;

  const categoryCounts: Record<string, number> = {};
  reviews.forEach((r) =>
    r.categories.forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    })
  );
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All Reviews', count: reviews.length },
    { key: 'positive', label: 'Positive', count: positiveReviews.length },
    { key: 'negative', label: 'Issues', count: negativeReviews.length },
  ];

  const scorePercent =
    reviews.length > 0 ? Math.round((positiveReviews.length / reviews.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#08090c] text-white font-sans">
      {/* Hero Section */}
      <div className="relative w-full h-100 sm:h-75 md:h-130 flex items-center justify-center bg-[#12141a]">
        <div className="flex flex-col items-center justify-center gap-2">
          <HomeIcon size={60} className="text-white/10" strokeWidth={1.5} />
          <span className="text-[9px] sm:text-[8px] font-mono uppercase text-white/50 tracking-wide">
            No photo available
          </span>
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-[#08090c] via-[#08090c]/60 to-transparent" />

        <div className="absolute bottom-4 left-4 sm:left-2 sm:bottom-2 text-white">
          <h1 className="text-2xl sm:text-xl md:text-5xl font-bold leading-tight">
            {property.name}
          </h1>
          <p className="text-sm capitalize sm:text-xs text-white/50 flex items-center gap-1">
            <MapPin size={12} /> {property.address}
          </p>
        </div>

        <div className="absolute top-4 left-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-md hover:bg-white/10 hover:text-white/80 transition-all"
          >
            <ArrowLeft size={12} /> Properties
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-white/5 bg-[#0c0e13]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-x sm:divide-y-0 divide-white/5">
            {[
              { label: 'Total Reviews', value: reviews.length, icon: '💬', color: 'text-white/70' },
              { label: 'Positive', value: positiveReviews.length, icon: '✅', color: 'text-emerald-400' },
              { label: 'Issues', value: negativeReviews.length, icon: '⚠️', color: 'text-red-400' },
              {
                label: 'Satisfaction',
                value: `${scorePercent}%`,
                icon: '📊',
                color: reviews.length === 0
                  ? 'text-white/30'
                  : scorePercent >= 70
                    ? 'text-emerald-400'
                    : 'text-amber-400',
              },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-1 px-4 py-4 flex-1"
              >
                <span className="text-[10px] sm:text-[9px] text-white/25 tracking-wide">{icon} {label}</span>
                <span className={`text-xl sm:text-lg font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-8 sm:py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          {topCategories.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-2 text-[10px] sm:text-[9px] font-semibold uppercase tracking-wider text-white/25">
                Most Reported
              </h2>
              <div className="flex flex-wrap gap-2">
                {topCategories.map(([cat, count]) => (
                  <span
                    key={cat}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1 text-xs sm:text-[11px] font-medium ring-1 transition-all hover:scale-105 hover:ring-[#c8a96e]/50 cursor-default ${CATEGORY_TAILWIND[cat] ?? 'bg-white/5 text-white/60 ring-white/10'
                      }`}
                  >
                    <span className="truncate max-w-22.5">
                      {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                    </span>
                    <span className="rounded-lg bg-black/20 px-1 py-px text-[10px] font-bold">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* AI Summary */}
          {summary ? (
            <div className="rounded-2xl border border-[#c8a96e]/20 bg-[#c8a96e]/5 p-4 sm:p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-[#c8a96e]" />
                <span className="text-[10px] sm:text-[9px] font-bold uppercase tracking-widest text-[#c8a96e]/70">
                  AI Summary
                </span>
              </div>
              <p className="text-sm sm:text-[12px] text-white/60 leading-relaxed">{summary}</p>
            </div>
          ) : (
            <button
              onClick={loadSummary}
              disabled={summaryLoading || reviews.length === 0}
              className="group flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-white/2.5 px-5 py-3 sm:py-2 text-sm sm:text-[12px] font-medium text-white/40 transition-all hover:border-[#c8a96e]/30 hover:bg-[#c8a96e]/[0.04] hover:text-[#c8a96e] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {summaryLoading ? (
                  <span className="h-4 w-4 rounded-full border border-white/20 border-t-[#c8a96e] animate-spin" />
                ) : (
                  <Sparkles size={15} className="group-hover:text-[#c8a96e] transition-colors" />
                )}
                {summaryLoading ? 'Generating AI summary…' : 'Generate AI Summary'}
              </span>
              {!summaryLoading && (
                <ChevronRight size={15} className="opacity-40 group-hover:opacity-70 transition-opacity" />
              )}
            </button>
          )}

          <section className="space-y-4">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base sm:text-sm font-semibold text-white/80">
                <MessageSquare size={15} className="text-white/30" /> Reviews
              </h2>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto sm:overflow-x-visible py-1 sm:py-0">
                {tabs.map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs sm:text-[10px] font-medium transition-all whitespace-nowrap ${activeTab === key
                        ? 'bg-white/8 text-white shadow-sm'
                        : 'text-white/30 hover:text-white/55'
                      }`}
                  >
                    {label}
                    <span
                      className={`text-[10px] font-bold rounded-md px-1 py-px ${activeTab === key ? 'bg-white/10 text-white/70' : 'bg-white/5 text-white/25'
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            {displayedReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/2 py-16 text-center px-4">
                <span className="text-4xl opacity-15">💬</span>
                <p className="text-xs text-white/20">No reviews in this category yet</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {displayedReviews.map((r) => (
                  <li key={r.id}>
                    <ReviewCard review={r} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {user && (
            <Link
              href={`/post-review?propertyId=${property.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c8a96e] px-6 py-3 text-xs sm:text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#d4b87e] active:scale-[0.98]"
            >
              + Leave a Review
            </Link>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl ring-1 ring-white/[0.07]" style={{ height: '220px' }}>
            <GoogleMap singleProperty={property} />
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 space-y-4">
            <h3 className="text-[10px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
              Property Details
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Listed by', value: property.user?.name || 'Unknown' },
                { label: 'Coordinates', value: `${property.latitude.toFixed(4)}, ${property.longitude.toFixed(4)}` },
                { label: 'Total Reviews', value: String(reviews.length) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-[11px] sm:text-[10px] text-white/25 leading-snug">{label}</span>
                  <span className="text-[11px] sm:text-[10px] font-semibold text-white/60 text-right leading-snug">{value}</span>
                </div>
              ))}
            </div>

            {reviews.length > 0 && (
              <div className="pt-2 border-t border-white/6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] sm:text-[10px] text-white/25">Satisfaction</span>
                  <span className="text-[11px] sm:text-[10px] font-bold text-white/60">{scorePercent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${scorePercent}%`,
                      backgroundColor:
                        scorePercent >= 70 ? '#4ade80' : scorePercent >= 40 ? '#facc15' : '#f87171',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {!user && (
            <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 space-y-3">
              <p className="text-xs sm:text-[10px] text-white/35 leading-relaxed">
                Sign in to share your experience at this property.
              </p>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-xl bg-[#c8a96e] py-2.5 text-xs sm:text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#d4b87e]"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}