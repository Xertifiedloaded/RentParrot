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
        categories: form.categories,  // ← single request with array
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

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  if (!user) {
    return (
      <div className="page-sm">
        <div className="empty-state">
          <span className="empty-state-icon">🔒</span>
          <div className="empty-state-title">Sign in required</div>
          <div className="empty-state-desc">You need to be signed in to leave a review.</div>
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const categories = Object.entries(CATEGORY_LABELS) as [Category, string][];
  const positiveCategories = categories.filter(([k]) => k.startsWith('GOOD_'));
  const negativeCategories = categories.filter(([k]) => !k.startsWith('GOOD_'));

  const CategoryCheckbox = ({ catKey, label, isPositive }: { catKey: Category; label: string; isPositive: boolean }) => {
    const selected = form.categories.includes(catKey);
    return (
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          borderRadius: '8px',
          cursor: 'pointer',
          background: selected
            ? isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'
            : 'transparent',
          border: `1px solid ${selected ? (isPositive ? 'var(--green)' : 'var(--red)') : 'transparent'}`,
          marginBottom: '4px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontWeight: 400,
          transition: 'var(--transition)',
        }}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleCategory(catKey)}
          style={{ width: 'auto', padding: 0, accentColor: isPositive ? 'var(--green)' : 'var(--red)' }}
        />
        {label}
      </label>
    );
  };

  return (
    <div className="page-md">
      <div className="page-header">
        <h1 className="page-title">Leave a Review</h1>
        <p className="page-subtitle">Share your real experience to help other renters</p>
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
                <option key={p.id} value={p.id}>{p.name} – {p.address}</option>
              ))}
            </select>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Don&apos;t see the property?{' '}
              <Link href="/post-property" style={{ color: 'var(--accent)' }}>Add it first</Link>
            </div>
          </div>

          <div className="form-group">
            <label>
              Review Categories *{' '}
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>
                (select all that apply)
              </span>
            </label>
            {form.categories.length > 0 && (
              <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {form.categories.map((c) => (
                  <span key={c} className="filter-chip active" style={{ fontSize: '12px' }}>
                    {CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS]}
                    <button
                      type="button"
                      onClick={() => toggleCategory(c)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 4px', color: 'inherit' }}
                    >×</button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Positive
                </div>
                {positiveCategories.map(([key, label]) => (
                  <CategoryCheckbox key={key} catKey={key} label={label} isPositive={true} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Negative / Other
                </div>
                {negativeCategories.map(([key, label]) => (
                  <CategoryCheckbox key={key} catKey={key} label={label} isPositive={false} />
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

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting…' : `Post Review${form.categories.length > 1 ? ` (${form.categories.length} categories)` : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}