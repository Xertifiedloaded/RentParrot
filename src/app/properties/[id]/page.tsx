'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ReviewCard from '@/components/ReviewCard';
import { Property, NEGATIVE_CATEGORIES, CATEGORY_LABELS } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), {
  ssr: false,
});

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'negative'>(
    'all',
  );

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
      <div className="loader-wrap">
        <div className="loader" />
      </div>
    );
  if (!property)
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-state-icon">🏚️</span>
          <div className="empty-state-title">Property not found</div>
          <Link href="/properties" className="btn btn-outline">
            Back to Properties
          </Link>
        </div>
      </div>
    );

  const reviews = property.reviews || [];
  const positiveReviews = reviews.filter(
    (r) => !r.categories.some((c) => NEGATIVE_CATEGORIES.includes(c))
  );
  const negativeReviews = reviews.filter(
    (r) => r.categories.some((c) => NEGATIVE_CATEGORIES.includes(c))
  );

  const displayedReviews =
    activeTab === 'positive'
      ? positiveReviews
      : activeTab === 'negative'
        ? negativeReviews
        : reviews;

  const categoryCounts: Record<string, number> = {};
  reviews.forEach((r) => {
    r.categories.forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="page">
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/properties"
          style={{ color: 'var(--text-secondary)', fontSize: '14px' }}
        >
          ← Back to Properties
        </Link>
      </div>

      <div className="property-detail-grid">
        {/* Left column */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h1 className="page-title" style={{ marginBottom: '8px' }}>
              {property.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              📍 {property.address}
            </p>
            {property.description && (
              <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                {property.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-chip stat-chip-neutral">
              💬 {reviews.length} total review{reviews.length !== 1 ? 's' : ''}
            </div>
            <div className="stat-chip stat-chip-positive">
              ✅ {positiveReviews.length} positive
            </div>
            <div className="stat-chip stat-chip-negative">
              ⚠️ {negativeReviews.length} negative
            </div>
          </div>

          {/* Top issues */}
          {topCategories.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  marginBottom: '12px',
                  fontSize: '14px',
                }}
              >
                Most Reported Issues
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {topCategories.map(([cat, count]) => (
                  <span
                    key={cat}
                    className="filter-chip active"
                    style={{ fontSize: '12px' }}
                  >
                    {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]} ×{' '}
                    {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          {summary ? (
            <div className="ai-summary">
              <div className="ai-summary-label">🤖 AI Summary</div>
              <p className="ai-summary-text">{summary}</p>
            </div>
          ) : (
            <button
              className="btn btn-outline"
              style={{ marginBottom: '24px' }}
              onClick={loadSummary}
              disabled={summaryLoading || reviews.length === 0}
            >
              {summaryLoading
                ? 'Generating summary…'
                : '✨ Generate AI Summary'}
            </button>
          )}

          {/* Reviews */}
          <div className="tabs">
            {(['all', 'positive', 'negative'] as const).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all'
                  ? `All (${reviews.length})`
                  : tab === 'positive'
                    ? `✅ Good (${positiveReviews.length})`
                    : `⚠️ Issues (${negativeReviews.length})`}
              </button>
            ))}
          </div>

          {displayedReviews.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <span className="empty-state-icon">💬</span>
              <div className="empty-state-desc">
                No reviews in this category yet
              </div>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {displayedReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}

          {user && (
            <div style={{ marginTop: '24px' }}>
              <Link
                href={`/post-review?propertyId=${property.id}`}
                className="btn btn-primary"
              >
                + Leave a Review
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="sticky-card">
          <div
            className="card"
            style={{
              marginBottom: '16px',
              height: '300px',
              padding: 0,
              overflow: 'hidden',
            }}
          >
            <GoogleMap singleProperty={property} />
          </div>

          <div className="card">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              Property Details
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Listed by</span>
                <span>{property.user?.name || 'Unknown'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Coordinates</span>
                <span
                  style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                >
                  {property.latitude.toFixed(4)},{' '}
                  {property.longitude.toFixed(4)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Total Reviews
                </span>
                <span>{reviews.length}</span>
              </div>
            </div>

            {!user && (
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    marginBottom: '10px',
                  }}
                >
                  Sign in to leave a review
                </p>
                <Link href="/login" className="btn btn-primary btn-full btn-sm">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
