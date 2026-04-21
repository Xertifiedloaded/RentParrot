'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function PostPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleGeocodeAddress = async () => {
    if (!form.address) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your-google-maps-api-key') {
      toast.error('Add Google Maps API key to geocode addresses');
      return;
    }
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(form.address + ', Lagos, Nigeria')}&key=${apiKey}`,
      );
      const data = await res.json();
      if (data.results?.[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setForm((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));
        toast.success('Coordinates found!');
      } else {
        toast.error('Address not found. Enter coordinates manually.');
      }
    } catch {
      toast.error('Geocoding failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.latitude || !form.longitude) {
      setError(
        "Please add coordinates. Click 'Get Coordinates' or enter manually.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create property');
      toast.success('Property added!');
      router.push(`/properties/${data.property.id}`);
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
            You need to be signed in to post a property.
          </div>
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-md">
      <div className="page-header">
        <h1 className="page-title">Add a Property</h1>
        <p className="page-subtitle">
          List a Lagos property to collect tenant reviews
        </p>
      </div>

      <div className="card">
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property Name *</label>
            <input
              type="text"
              placeholder="e.g. Sunshine Apartments, Lekki Phase 1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Address *</label>
            <input
              type="text"
              placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ alignSelf: 'flex-start', marginTop: '8px' }}
              onClick={handleGeocodeAddress}
            >
              📍 Get Coordinates from Address
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude *</label>
              <input
                type="number"
                step="any"
                placeholder="6.4281"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Longitude *</label>
              <input
                type="number"
                step="any"
                placeholder="3.4219"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              placeholder="Briefly describe this property or estate…"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
          >
            <Link href="/properties" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Adding Property…' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>

      <div
        className="card"
        style={{
          marginTop: '16px',
          background: 'var(--accent-glow)',
          borderColor: 'rgba(232,93,4,0.2)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            marginBottom: '8px',
            fontSize: '14px',
            color: 'var(--accent)',
          }}
        >
          💡 Lagos Coordinate Hints
        </div>
        <div
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span>🏖️ Lekki Phase 1: 6.4281, 3.4219</span>
          <span>🏙️ Victoria Island: 6.4281, 3.4219</span>
          <span>🎓 Yaba: 6.5059, 3.3760</span>
          <span>🌇 Surulere: 6.4983, 3.3563</span>
          <span>🏘️ Ikeja: 6.5954, 3.3353</span>
        </div>
      </div>
    </div>
  );
}
