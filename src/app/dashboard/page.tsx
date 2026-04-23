'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Property, Review, CATEGORY_LABELS } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

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
      fetch(`/api/reviews?userId=${user.id}`).then((r) => r.json()),
    ]).then(([propData, revData]) => {
      const filtered = (propData.properties || []).filter(
        (p: Property) => p.user?.id === user.id,  // fix: use p.user?.id
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

  if (loading || !user)
    return (
      <div className="loader-wrap">
        <div className="loader" />
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user.name}</p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div className="dash-stat-card">
          <div className="dash-stat-icon">🏢</div>
          <div>
            <div className="dash-stat-value">
              {dataLoading ? '–' : myProperties.length}
            </div>
            <div className="dash-stat-label">Properties Listed</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon">💬</div>
          <div>
            <div className="dash-stat-value">
              {dataLoading ? '–' : myReviews.length}
            </div>
            <div className="dash-stat-label">Reviews Written</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon">📅</div>
          <div>
            <div
              className="dash-stat-value"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              {formatDistanceToNow(
                new Date(
                  user ? (user as any).createdAt || Date.now() : Date.now(),
                ),
                { addSuffix: true },
              )}
            </div>
            <div className="dash-stat-label">Member Since</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/post-property" className="btn btn-primary">
          + Add Property
        </Link>
        <Link href="/post-review" className="btn btn-outline">
          + Write Review
        </Link>
        <Link href="/properties" className="btn btn-ghost">
          Browse All Properties
        </Link>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          My Properties ({myProperties.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          My Reviews ({myReviews.length})
        </button>
      </div>

      {dataLoading ? (
        <div className="loader-wrap">
          <div className="loader" />
        </div>
      ) : activeTab === 'properties' ? (
        myProperties.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🏘️</span>
            <div className="empty-state-title">No properties yet</div>
            <div className="empty-state-desc">
              Add a Lagos property to start collecting reviews.
            </div>
            <Link href="/post-property" className="btn btn-primary">
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {myProperties.map((p) => (
              <div
                key={p.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      marginBottom: '4px',
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
                  >
                    📍 {p.address}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    Added{' '}
                    {formatDistanceToNow(new Date(p.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/properties/${p.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View
                  </Link>
                  <button
                    className="btn btn-sm"
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      color: 'var(--red)',
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}
                    onClick={() => handleDeleteProperty(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : myReviews.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">💬</span>
          <div className="empty-state-title">No reviews yet</div>
          <div className="empty-state-desc">
            Share your rental experiences to help others.
          </div>
          <Link href="/post-review" className="btn btn-primary">
            Write Your First Review
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {myReviews.map((r) => (
            <div key={r.id} className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {r.categories.map((cat) => (
                    <span
                      key={cat}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'var(--bg-elevated)',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {CATEGORY_LABELS[cat]}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatDistanceToNow(new Date(r.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}
              >
                {r.comment}
              </p>
              {r.property && (
                <Link
                  href={`/properties/${r.property.id}`}
                  style={{ fontSize: '12px', color: 'var(--accent)' }}
                >
                  📍 {r.property.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}