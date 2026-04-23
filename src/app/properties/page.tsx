'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';
import { useUserLocation } from '@/hooks/useUserLocation';


export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { status, detectedState, clearLocation } = useUserLocation();

  const fetchProperties = useCallback(async (stateFilter?: string) => {
    setLoading(true);
    try {
      let url = '/api/properties';
      if (query) {
        url += `?search=${encodeURIComponent(query)}`;
      } else if (stateFilter) {
        url += `?state=${encodeURIComponent(stateFilter)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setProperties(data.properties || []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (status === 'idle') return;
    if (query) {
      fetchProperties();
    } else {
      fetchProperties(detectedState || undefined);
    }
  }, [fetchProperties, query, detectedState, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
  };

  const clearSearch = () => {
    setSearch('');
    setQuery('');
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Properties</h1>
          <p className="page-subtitle">
            {query
              ? 'Search results across Nigeria'
              : detectedState
              ? `Showing properties in ${detectedState} State`
              : status === 'idle'
              ? 'Detecting your location…'
              : `Browse ${properties.length} properties across Nigeria`}
          </p>
        </div>
        <Link href="/post-property" className="btn btn-primary">+ Add Property</Link>
      </div>

      {/* State filter pill */}
      {detectedState && !query && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--accent-glow)', border: '1px solid rgba(232,93,4,0.3)',
            borderRadius: '20px', padding: '6px 14px', fontSize: '13px',
            color: 'var(--accent)', fontWeight: 600,
          }}>
            📍 {detectedState} State
            <button
              onClick={clearLocation}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: '0 0 0 2px', fontSize: '14px', lineHeight: 1 }}
            >×</button>
          </span>
          <button className="btn btn-outline btn-sm" onClick={clearLocation}>
            Show All States
          </button>
        </div>
      )}

      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, address or state…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
        {query && (
          <button type="button" className="btn btn-outline" onClick={clearSearch}>Clear</button>
        )}
      </form>

      {query && (
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Showing all results for &ldquo;<strong>{query}</strong>&rdquo;{' '}
          <button onClick={clearSearch} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '14px', padding: 0 }}>
            ← Back to {detectedState ? `${detectedState} State` : 'browse'}
          </button>
        </p>
      )}

      {loading || status === 'idle' ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🏘️</span>
          <div className="empty-state-title">No properties found</div>
          <div className="empty-state-desc">
            {query
              ? 'Try a different search term'
              : detectedState
              ? `No properties listed in ${detectedState} State yet`
              : 'Be the first to add a property!'}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {detectedState && !query && (
              <button className="btn btn-outline" onClick={clearLocation}>Browse All States</button>
            )}
            <Link href="/post-property" className="btn btn-primary">Add a Property</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}