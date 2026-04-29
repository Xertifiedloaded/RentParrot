'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  Building2,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Users,
  PenSquare,
} from 'lucide-react';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), {
  ssr: false,
});

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const reviews = property?.reviews || [];

  const loadSummary = async () => {
    setSummaryLoading(true);

    try {
      const res = await fetch(`/api/summary/${id}`);
      const data = await res.json();
      setSummary(data.summary || 'Summary unavailable.');
    } catch {
      setSummary('Summary unavailable.');
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        setProperty(data.property);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!property || reviews.length === 0) {
      setSummaryLoading(false);
      return;
    }

    loadSummary();
  }, [property, id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#080a0f]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping" />
            <div className="h-12 w-12 rounded-full border-2 border-white/10 border-t-amber-400 animate-spin" />
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-medium">
            Loading property
          </p>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080a0f] text-white">
        Property not found
      </div>
    );

  const positiveReviews = reviews.filter(
    (r) => !r.categories.some((c) => NEGATIVE_CATEGORIES.includes(c)),
  );

  const negativeReviews = reviews.filter((r) =>
    r.categories.some((c) => NEGATIVE_CATEGORIES.includes(c)),
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
    }),
  );
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: reviews.length },
    { key: 'positive', label: 'Positive', count: positiveReviews.length },
    { key: 'negative', label: 'Issues', count: negativeReviews.length },
  ];

  const scorePercent =
    reviews.length > 0
      ? Math.round((positiveReviews.length / reviews.length) * 100)
      : 0;

  const scoreColor =
    reviews.length === 0
      ? 'text-white/30'
      : scorePercent >= 70
        ? 'text-emerald-400'
        : scorePercent >= 40
          ? 'text-amber-400'
          : 'text-red-400';

  const scoreBarColor =
    scorePercent >= 70 ? '#4ade80' : scorePercent >= 40 ? '#facc15' : '#f87171';

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-87.5 rounded-full bg-amber-500/6 blur-[140px]" />
      </div>

      <div className="relative z-20 border-b border-white/6 bg-[#080a0f]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={15} />
            <span>Properties</span>
          </Link>

          {user && (
            <Link
              href={`/post-review?propertyId=${property.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
            >
              <PenSquare size={14} />
              <span>Write Review</span>
            </Link>
          )}
        </div>
      </div>

      <div className="relative z-10 border-b border-white/6 bg-linear-to-b from-white/3 to-transparent">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
            <div className="shrink-0 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl border border-amber-500/20 bg-amber-500/10 shadow-lg shadow-amber-500/10">
              <Building2
                size={28}
                className="text-amber-400 sm:w-8 sm:h-8"
                strokeWidth={1.6}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Rental Property
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {property.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="flex capitalize items-center gap-2 text-white/90 font-medium">
                  <MapPin size={14} className="text-amber-400 shrink-0" />
                  {property.address}
                </span>

                {property.town && (
                  <>
                    <span className="hidden sm:block text-white/20">•</span>
                    <span className="text-white/65">{property.town}</span>
                  </>
                )}

                <span className="hidden sm:block text-white/20">•</span>

                <span className="text-white/65">{property.state}</span>
              </div>

              {property.description && (
                <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/70 leading-7">
                  {property.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-b border-white/6 bg-[#0c0f16]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                label: 'Reviews',
                value: reviews.length,
                icon: <Users size={16} className="text-white/70" />,
                color: 'text-white',
                bg: 'bg-white/[0.03]',
              },
              {
                label: 'Positive',
                value: positiveReviews.length,
                icon: <ThumbsUp size={16} className="text-emerald-400" />,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/5',
              },
              {
                label: 'Issues',
                value: negativeReviews.length,
                icon: <ThumbsDown size={16} className="text-red-400" />,
                color: 'text-red-400',
                bg: 'bg-red-500/5',
              },
              {
                label: 'Score',
                value: reviews.length === 0 ? '—' : `${scorePercent}%`,
                icon: <BarChart3 size={16} className="text-amber-400" />,
                color: scoreColor,
                bg: 'bg-amber-500/5',
              },
            ].map(({ label, value, icon, color, bg }) => (
              <div
                key={label}
                className={`rounded-2xl border border-white/8 ${bg} px-4 py-4 sm:py-5 backdrop-blur-xl transition-all hover:border-white/15`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-white/45">
                    {label}
                  </span>
                  {icon}
                </div>

                <div
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${color}`}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          {topCategories.length > 0 && (
            <section>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/30">
                Most Reported
              </p>
              <div className="flex flex-wrap gap-2">
                {topCategories.map(([cat, count]) => (
                  <span
                    key={cat}
                    className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold ring-1 ${
                      CATEGORY_TAILWIND[cat] ??
                      'bg-white/5 text-white/70 ring-white/10'
                    }`}
                  >
                    <span>
                      {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                    </span>
                    <span className="rounded-lg bg-black/25 px-1.5 py-px text-[10px] font-bold">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                <Sparkles size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  AI Review Insights
                </p>
                <p className="text-xs uppercase tracking-wider text-amber-400/70">
                  Live Summary
                </p>
              </div>
            </div>

            {summaryLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 bg-white/5 rounded-full w-full" />
                <div className="h-3 bg-white/5 rounded-full w-5/6" />
                <div className="h-3 bg-white/5 rounded-full w-4/6" />
                <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-amber-400 animate-spin" />
                  Generating insights...
                </div>
              </div>
            ) : (
              <p className="text-sm leading-7 text-white/75">
                {summary || 'No summary available.'}
              </p>
            )}
          </div>

          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="flex items-center gap-2 text-base font-black text-white">
                <MessageSquare size={16} className="text-white/40" />
                Tenant Reviews
              </h2>

              <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/6 w-fit">
                {tabs.map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === key
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {label}
                    <span
                      className={`text-[10px] font-bold rounded-md px-1.5 py-px ${
                        activeTab === key
                          ? 'bg-white/15 text-white/80'
                          : 'bg-white/5 text-white/30'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {displayedReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/6 bg-white/2 py-16 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <MessageSquare size={22} className="text-white/20" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/60 mb-1">
                    No reviews yet
                  </p>
                  <p className="text-xs text-white/30">
                    No reviews in this category.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {displayedReviews.map((r) => (
                  <li key={r.id}>
                    <ReviewCard review={r} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {!user && (
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">
                  Have experience with this property?
                </p>
                <p className="text-xs text-white/50">
                  Sign in to share your review and help other renters.
                </p>
              </div>
              <Link
                href="/login"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-amber-400 active:scale-95 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div
            className="overflow-hidden rounded-2xl ring-1 ring-white/8 shadow-xl"
            style={{ height: '220px' }}
          >
            <GoogleMap singleProperty={property} />
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">
              Property Details
            </h3>
            <div className="space-y-3.5">
              {[
                {
                  label: 'Listed by',
                  value: property.user?.name || 'Anonymous',
                },
                { label: 'Town', value: property.town || '—' },
                { label: 'State', value: property.state },
                {
                  label: 'Coordinates',
                  value: `${property.latitude.toFixed(4)}, ${property.longitude.toFixed(4)}`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-3"
                >
                  <span className="text-xs text-white/40 font-medium leading-snug">
                    {label}
                  </span>
                  <span className="text-xs font-semibold text-white/80 text-right leading-snug">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {reviews.length > 0 && (
              <div className="pt-3 border-t border-white/6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40 font-medium">
                    Satisfaction Score
                  </span>
                  <span className={`text-sm font-black ${scoreColor}`}>
                    {scorePercent}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${scorePercent}%`,
                      backgroundColor: scoreBarColor,
                    }}
                  />
                </div>
                <p className="text-[10px] text-white/30">
                  Based on {reviews.length}{' '}
                  {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
