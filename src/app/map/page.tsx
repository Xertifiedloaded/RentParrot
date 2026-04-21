'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Property } from '@/types';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), {
  ssr: false,
});

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);
  const [search, setSearch] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties || []);
        setFilteredProperties(data.properties || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredProperties(properties);
    } else {
      const q = search.toLowerCase();
      setFilteredProperties(
        properties.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q),
        ),
      );
    }
  }, [search, properties]);

  return (
    <div className="map-page">
      {/* Sidebar */}
      <div className="map-sidebar">
        <div className="map-sidebar-header">
          <div className="map-sidebar-title">Lagos Properties</div>
          <div className="search-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap" style={{ flex: 1 }}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search area or property…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: '10px',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            {filteredProperties.length} properties shown
          </div>
        </div>

        <div style={{ padding: '12px', flex: 1 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="loader" style={{ margin: '0 auto' }} />
            </div>
          ) : filteredProperties.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
              }}
            >
              No properties found
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {filteredProperties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  style={{
                    textAlign: 'left',
                    background:
                      selected?.id === p.id
                        ? 'var(--bg-elevated)'
                        : 'transparent',
                    border: `1px solid ${selected?.id === p.id ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '14px',
                      marginBottom: '4px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                  >
                    📍 {p.address}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    {p._count?.reviews || 0} review
                    {(p._count?.reviews || 0) !== 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div
            style={{
              padding: '16px',
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              {selected.name}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '12px',
              }}
            >
              {selected.address}
            </div>
            <Link
              href={`/properties/${selected.id}`}
              className="btn btn-primary btn-sm btn-full"
            >
              View Full Details & Reviews →
            </Link>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="map-main">
        <button
          className={`map-toggle ${showHeatmap ? 'active' : ''}`}
          onClick={() => setShowHeatmap(!showHeatmap)}
        >
          🔥 {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
        </button>
        <div className="map-full">
          <GoogleMap
            properties={filteredProperties}
            onMarkerClick={setSelected}
            showHeatmap={showHeatmap}
          />
        </div>
      </div>
    </div>
  );
}
