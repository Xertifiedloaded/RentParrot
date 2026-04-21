'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { CATEGORY_LABELS, Category } from '@/types';
import { Property } from '@/types';
import toast from 'react-hot-toast';

export default function PostReviewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPropertyId = searchParams.get('propertyId');

  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({
    propertyId: preselectedPropertyId || '',
    category: '' as Category | '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.json())
      .then((data) => setProperties(data.properties || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.propertyId || !form.category || !form.comment) {
      setError('All fields are required');
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
      if (!res.ok) throw new Error(data.error || 'Failed to post review');
      toast.success('Review posted!');
      router.push(`/properties/${form.propertyId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="loader-wrap">
        <div className="loader" />
      </div>
    );

  if (!user) {
    return (
      <div className="page-sm">
        <div className="empty-state">
          <span className="empty-state-icon">🔒</span>
          <div className="empty-state-title">Sign in required</div>
          <div className="empty-state-desc">
            You need to be signed in to leave a review.
          </div>
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const categories = Object.entries(CATEGORY_LABELS) as [Category, string][];
  const positiveCategories = categories.filter(([k]) => k.startsWith('GOOD_'));
  const negativeCategories = categories.filter(([k]) => !k.startsWith('GOOD_'));

  return (
    <div className="page-md">
      <div className="page-header">
        <h1 className="page-title">Leave a Review</h1>
        <p className="page-subtitle">
          Share your real experience to help other Lagos renters
        </p>
      </div>

      <div className="card">
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property *</label>
            <select
              value={form.propertyId}
              onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              required
            >
              <option value="">Select a property…</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} – {p.address}
                </option>
              ))}
            </select>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '4px',
              }}
            >
              Don&apos;t see the property?{' '}
              <Link href="/post-property" style={{ color: 'var(--accent)' }}>
                Add it first
              </Link>
            </div>
          </div>

          <div className="form-group">
            <label>Review Category *</label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--green)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '6px',
                  }}
                >
                  Positive
                </div>
                {positiveCategories.map(([key, label]) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background:
                        form.category === key
                          ? 'rgba(34,197,94,0.1)'
                          : 'transparent',
                      border: `1px solid ${form.category === key ? 'var(--green)' : 'transparent'}`,
                      marginBottom: '4px',
                      textTransform: 'none',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontWeight: 400,
                      letterSpacing: 0,
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={key}
                      checked={form.category === key}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value as Category,
                        })
                      }
                      style={{ width: 'auto', padding: 0 }}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--red)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '6px',
                  }}
                >
                  Negative / Other
                </div>
                {negativeCategories.map(([key, label]) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background:
                        form.category === key
                          ? 'rgba(239,68,68,0.1)'
                          : 'transparent',
                      border: `1px solid ${form.category === key ? 'var(--red)' : 'transparent'}`,
                      marginBottom: '4px',
                      textTransform: 'none',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontWeight: 400,
                      letterSpacing: 0,
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={key}
                      checked={form.category === key}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value as Category,
                        })
                      }
                      style={{ width: 'auto', padding: 0 }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Your Review *</label>
            <textarea
              placeholder="Describe your experience honestly. The more specific, the more helpful…"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
              style={{ minHeight: '130px' }}
            />
          </div>

          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Posting…' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
