'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Property, Review, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white/3 p-5 ring-1 ring-white/[0.07] transition-all hover:bg-white/[0.05]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xl ring-1 ring-amber-500/20">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-white/90">{value}</div>
        <div className="mt-0.5 text-[11px] uppercase tracking-widest text-white/30">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'properties' | 'reviews'>(
    'properties',
  );

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

useEffect(() => {
  if (!user) return;

  Promise.all([
    fetch('/api/properties').then((r) => r.json()),
    fetch(`/api/reviews?userId=${user.userId}`).then((r) => r.json()),
  ]).then(([propData, revData]) => {
    const filtered = (propData.properties || []).filter(
      (p: Property) => p.user?.id === user.userId,
    );

    setMyProperties(filtered);
    setMyReviews(revData.reviews || []);
    setDataLoading(false);
  });
}, [user]);

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Delete this property and all its reviews?')) return;
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setMyProperties((prev) => prev.filter((p) => p.id !== propertyId));
      toast.success('Property deleted');
    } catch {
      toast.error('Failed to delete property');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0c0f14]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-amber-500" />
      </div>
    );
  }

  const memberSince = formatDistanceToNow(
    new Date((user as any).createdAt || Date.now()),
    { addSuffix: true },
  );

  return (
    <div className="min-h-screen bg-[#0c0f14] font-['Geist_Mono','IBM_Plex_Mono',monospace] text-white">
      {/* Page header */}
      <div className="border-b border-white/6 bg-[#0e1117]">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-white/30">
                Dashboard
              </p>
              <h1 className="text-2xl font-bold text-white/90">
                Welcome back,{' '}
                <span className="text-amber-400">{user.name}</span>
              </h1>
            </div>
            {/* Avatar */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-lg font-bold text-amber-400 ring-1 ring-amber-500/30">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            icon="🏢"
            value={dataLoading ? '–' : myProperties.length}
            label="Properties Listed"
          />
          <StatCard
            icon="💬"
            value={dataLoading ? '–' : myReviews.length}
            label="Reviews Written"
          />
          <StatCard
            icon="📅"
            value={<span className="text-base">{memberSince}</span>}
            label="Member Since"
          />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/post-property"
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400 active:scale-[0.98]"
          >
            <span>+</span> Add Property
          </Link>
          <Link
            href="/post-review"
            className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/60 ring-1 ring-white/[0.09] transition-all hover:bg-white/[0.09] hover:text-white/80"
          >
            <span>+</span> Write Review
          </Link>
          <Link
            href="/properties"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/30 transition-all hover:text-white/60"
          >
            Browse All →
          </Link>
        </div>

        {/* Tabs + content */}
        <div>
          {/* Tab bar */}
          <div className="mb-5 flex gap-1 rounded-lg bg-white/3 p-1 ring-1 ring-white/6 w-fit">
            {(['properties', 'reviews'] as const).map((tab) => {
              const count =
                tab === 'properties' ? myProperties.length : myReviews.length;
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all ${
                    active
                      ? 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30'
                      : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {tab === 'properties' ? 'Properties' : 'Reviews'}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-white/6 text-white/25'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {dataLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-amber-500" />
            </div>
          ) : activeTab === 'properties' ? (
            myProperties.length === 0 ? (
              <EmptyState
                icon="🏘️"
                title="No properties yet"
                desc="Add a Lagos property to start collecting reviews."
                cta={{
                  label: 'Add Your First Property',
                  href: '/post-property',
                }}
              />
            ) : (
              <ul className="space-y-2">
                {myProperties.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white/[0.03] px-5 py-4 ring-1 ring-white/[0.07] transition-all hover:bg-white/[0.05]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/85">
                        {p.name}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-white/35">
                        📍 {p.address}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-white/20">
                        Added{' '}
                        {formatDistanceToNow(new Date(p.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/properties/${p.id}`}
                        className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50 ring-1 ring-white/[0.09] transition-all hover:bg-white/[0.09] hover:text-white/75"
                      >
                        View
                      </Link>
                      <Link
                        href={`/properties/${p.id}/edit`}
                        className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-green-300 ring-1 ring-white/9 transition-all hover:bg-white/9 hover:text-white/75"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(p.id)}
                        className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 ring-1 ring-red-500/20 transition-all hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : myReviews.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No reviews yet"
              desc="Share your rental experiences to help others."
              cta={{ label: 'Write Your First Review', href: '/post-review' }}
            />
          ) : (
            <ul className="space-y-2">
              {myReviews.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl bg-white/3 px-5 py-4 ring-1 ring-white/[0.07] transition-all hover:bg-white/[0.05]"
                >
                  {/* Header row */}
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {r.categories.map((cat) => (
                        <span
                          key={cat}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                            CATEGORY_COLORS[cat] ??
                            'bg-white/5 text-white/30 ring-1 ring-white/10'
                          }`}
                        >
                          {CATEGORY_LABELS[cat]}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-white/20">
                      {formatDistanceToNow(new Date(r.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm leading-relaxed text-white/50">
                    {r.comment}
                  </p>

                  {/* Property link */}
                  {r.property && (
                    <Link
                      href={`/properties/${r.property.id}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400/70 transition-colors hover:text-amber-400"
                    >
                      📍 {r.property.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  desc,
  cta,
}: {
  icon: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-white/[0.02] py-16 text-center ring-1 ring-white/[0.05]">
      <span className="text-4xl opacity-20">{icon}</span>
      <p className="text-sm font-semibold text-white/40">{title}</p>
      <p className="text-xs text-white/20">{desc}</p>
      <Link
        href={cta.href}
        className="mt-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400"
      >
        {cta.label}
      </Link>
    </div>
  );
}
