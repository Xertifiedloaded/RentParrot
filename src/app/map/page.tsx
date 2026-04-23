'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Property } from '@/types';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), { ssr: false });

type LocationState = 'prompt' | 'requesting' | 'granted' | 'denied';

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<Property[] | null>(null);
  const [selected, setSelected] = useState<Property | null>(null);
  const [search, setSearch] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationState, setLocationState] = useState<LocationState>('prompt');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);

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
          (p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q),
        ),
      );
    }
  }, [search, properties]);

  const requestLocation = () => {
    setLocationState('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationState('granted');
        // Find nearest properties (within ~5km)
        const nearby = properties.filter((p) => {
          const dist = Math.sqrt(
            Math.pow((p.latitude - loc.lat) * 111, 2) +
            Math.pow((p.longitude - loc.lng) * 111 * Math.cos((loc.lat * Math.PI) / 180), 2),
          );
          return dist <= 5;
        });
        setNearbyProperties(nearby);
      },
      () => {
        setLocationState('denied');
      },
    );
  };

  // Find properties near a clicked map point
  const handleMapClick = (lat: number, lng: number) => {
    setClickedLocation({ lat, lng });
    const nearby = properties.filter((p) => {
      const dist = Math.sqrt(
        Math.pow((p.latitude - lat) * 111, 2) +
        Math.pow((p.longitude - lng) * 111 * Math.cos((lat * Math.PI) / 180), 2),
      );
      return dist <= 2; // 2km radius on click
    });
    setNearbyProperties(nearby);
    setSelected(null);
  };

  const displayProperties = nearbyProperties !== null ? nearbyProperties : filteredProperties;

  return (
    <div className="map-page">
      {/* Location prompt banner */}
      {/* {locationState === 'prompt' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
          background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)',
          padding: '12px 20px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px',
        }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            📍 Enable location to see properties near you
          </span>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button className="btn btn-primary btn-sm" onClick={requestLocation}>Enable Location</button>
            <button className="btn btn-outline btn-sm" onClick={() => setLocationState('denied')}>Not now</button>
          </div>
        </div>
      )} */}

      {locationState === 'requesting' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
          background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)',
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div className="loader" style={{ width: '16px', height: '16px' }} />
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Getting your location…</span>
        </div>
      )}

      {/* Sidebar */}
      <div className="map-sidebar" style={{ marginTop: locationState === 'prompt' || locationState === 'requesting' ? '57px' : 0 }}>
        <div className="map-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div className="map-sidebar-title">
              {nearbyProperties !== null
                ? clickedLocation
                  ? '📍 Properties Here'
                  : '📡 Near You'
                : 'Lagos Properties'}
            </div>
            {nearbyProperties !== null && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setNearbyProperties(null); setClickedLocation(null); }}
              >
                Show All
              </button>
            )}
          </div>
          {nearbyProperties === null && (
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
          )}
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {displayProperties.length} propert{displayProperties.length !== 1 ? 'ies' : 'y'} shown
            {nearbyProperties !== null && nearbyProperties.length === 0 && (
              <span style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                No properties in this area yet
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="loader" style={{ margin: '0 auto' }} />
            </div>
          ) : displayProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏘️</div>
              {nearbyProperties !== null
                ? 'No properties found in this area'
                : 'No properties found'}
              <div style={{ marginTop: '12px' }}>
                <Link href="/post-property" className="btn btn-primary btn-sm">Add a Property</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {displayProperties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  style={{
                    textAlign: 'left',
                    background: selected?.id === p.id ? 'var(--bg-elevated)' : 'transparent',
                    border: `1px solid ${selected?.id === p.id ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '10px', padding: '12px', cursor: 'pointer',
                    transition: 'var(--transition)', width: '100%',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    📍 {p.address}
                    {(p as any).state && <span style={{ marginLeft: '6px', color: 'var(--text-muted)' }}>• {(p as any).state}</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {p._count?.reviews || 0} review{(p._count?.reviews || 0) !== 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '4px' }}>{selected.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{selected.address}</div>
            <Link href={`/properties/${selected.id}`} className="btn btn-primary btn-sm btn-full">
              View Full Details & Reviews →
            </Link>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="map-main">
        <button className={`map-toggle ${showHeatmap ? 'active' : ''}`} onClick={() => setShowHeatmap(!showHeatmap)}>
          🔥 {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
        </button>
        {locationState === 'granted' && userLocation && (
          <div style={{
            position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: 'var(--text-secondary)',
            pointerEvents: 'none',
          }}>
            📡 Showing properties near you • Click anywhere on map to explore
          </div>
        )}
        <div className="map-full">
          <GoogleMap
            properties={filteredProperties}
            onMarkerClick={setSelected}
            onMapClick={handleMapClick}
            showHeatmap={showHeatmap}
            userLocation={userLocation || undefined}
          />
        </div>
      </div>
    </div>
  );
}