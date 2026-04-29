'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Property, Review, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Building2, MessageSquare, Calendar, Plus, MapIcon, MapPin } from 'lucide-react';

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:bg-white/10 transition">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
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
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 py-20 px-6 text-center">
      <div className="text-5xl opacity-20">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-white/80">{title}</h3>
      <p className="mt-2 text-sm text-white/40">{desc}</p>
      <Link
        href={cta.href}
        className="mt-6 inline-flex items-center rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-400 transition"
      >
        {cta.label}
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'properties' | 'reviews'>('properties');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      fetch('/api/properties').then((r) => r.json()),
      fetch(`/api/reviews?userId=${user.id}`).then((r) => r.json()),
    ]).then(([propData, revData]) => {
      const filtered = (propData.properties || []).filter((p: Property) => p.user?.id === user.id);
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-orange-500" />
      </div>
    );
  }

  const memberSince = formatDistanceToNow(new Date((user as any).createdAt || Date.now()), { addSuffix: true });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Dashboard</p>
            <h1 className="text-2xl md:text-4xl font-bold">
              Welcome back, <span className="text-orange-500">{user.name}</span>
            </h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-lg font-bold text-orange-400 border border-orange-500/30">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={<Building2 size={20} />} value={dataLoading ? '–' : myProperties.length} label="Properties" />
          <StatCard icon={<MessageSquare size={20} />} value={dataLoading ? '–' : myReviews.length} label="Reviews" />
          <StatCard
            icon={<Calendar size={20} />}
            value={<span className="text-base">{memberSince}</span>}
            label="Member Since"
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/post-property"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold hover:bg-orange-400 transition"
          >
            <Plus size={16} />
            Add Property
          </Link>

          <Link
            href="/post-review"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10 transition"
          >
            <Plus size={16} />
            Write Review
          </Link>

          <Link
            href="/properties"
            className="inline-flex items-center px-5 py-3 text-sm text-white/50 hover:text-white transition"
          >
            Browse All →
          </Link>
        </div>

        {/* Tabs */}
        <div className="mt-8 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          {(['properties', 'reviews'] as const).map((tab) => {
            const count = tab === 'properties' ? myProperties.length : myReviews.length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                  activeTab === tab ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-8">
          {dataLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-orange-500" />
            </div>
          ) : activeTab === 'properties' ? (
            myProperties.length === 0 ? (
              <EmptyState
                icon="🏠"
                title="No properties yet"
                desc="Add your first property listing."
                cta={{ label: 'Add Property', href: '/post-property' }}
              />
            ) : (
              <div className="space-y-4">
                {myProperties.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{p.name}</h3>
                        <p className="text-sm flex items-center gap-1 capitalize text-white/40">
                          <MapPin size={12} /> {p.address}
                        </p>
                        <p className="text-xs text-white/30 mt-1">
                          Added{' '}
                          {formatDistanceToNow(new Date(p.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/properties/${p.id}`}
                          className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                        >
                          View
                        </Link>
                        <Link
                          href={`/properties/${p.id}/edit`}
                          className="rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-400 hover:bg-green-500/20"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : myReviews.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No reviews yet"
              desc="Write your first review."
              cta={{ label: 'Write Review', href: '/post-review' }}
            />
          ) : (
            <div className="space-y-4">
              {myReviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {r.categories.map((cat) => (
                        <span
                          key={cat}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[cat]}`}
                        >
                          {CATEGORY_LABELS[cat]}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-white/30">
                      {formatDistanceToNow(new Date(r.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  <p className="mt-4 text-sm text-white/70 leading-relaxed">{r.comment}</p>

                  {r.property && (
                    <Link
                      href={`/properties/${r.property.id}`}
                      className="mt-4  flex items-center gap-1 capitalize  text-sm text-orange-400 hover:text-orange-300"
                    >
                      <MapPin size={12} /> {r.property.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
