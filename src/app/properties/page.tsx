'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const url = query
        ? `/api/properties?search=${encodeURIComponent(query)}`
        : '/api/properties';
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
    fetchProperties();
  }, [fetchProperties]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 className="page-title">Properties</h1>
          <p className="page-subtitle">
            Browse {properties.length} listed properties across Lagos
          </p>
        </div>
        <Link href="/post-property" className="btn btn-primary">
          + Add Property
        </Link>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or address (e.g. Lekki, Yaba, Surulere…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        {query && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setSearch('');
              setQuery('');
            }}
          >
            Clear
          </button>
        )}
      </form>

      {query && (
        <p
          style={{
            marginBottom: '16px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}
        >
          Showing results for &quot;<strong>{query}</strong>&quot;
        </p>
      )}

      {loading ? (
        <div className="loader-wrap">
          <div className="loader" />
        </div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🏘️</span>
          <div className="empty-state-title">No properties found</div>
          <div className="empty-state-desc">
            {query
              ? 'Try a different search term'
              : 'Be the first to add a property in Lagos!'}
          </div>
          <Link href="/post-property" className="btn btn-primary">
            Add a Property
          </Link>
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
