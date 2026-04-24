'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Property } from '@/types';
import { LocationState, LISTING_TYPE_COLORS } from '../../types/index';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), {
  ssr: false,
});

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<Property[] | null>(
    null,
  );
  const [selected, setSelected] = useState<Property | null>(null);
  const [focusedProperty, setFocusedProperty] = useState<Property | null>(null);
  const [search, setSearch] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationState, setLocationState] = useState<LocationState>('prompt');
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties || []);
        setFilteredProperties(data.properties || []);
        setLoading(false);
        requestLocation();
      });
  }, []);

  useEffect(() => {
    if (!search) return setFilteredProperties(properties);
    const q = search.toLowerCase();
    setFilteredProperties(
      properties.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.town?.toLowerCase().includes(q) ||
          p.community?.toLowerCase().includes(q) ||
          p.nearestBusStop?.toLowerCase().includes(q) ||
          p.postalCode?.toLowerCase().includes(q),
      ),
    );
  }, [search, properties]);

  const requestLocation = () => {
    setLocationState('requesting');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationState('granted');
        const res = await fetch(
          `/api/properties?lat=${loc.lat}&lng=${loc.lng}&radius=5`,
        );
        const data = await res.json();
        setNearbyProperties(data.properties || []);
      },
      () => setLocationState('denied'),
    );
  };

  const handleMapClick = async (lat: number, lng: number, state?: string) => {
    const url = state
      ? `/api/properties?state=${encodeURIComponent(state)}`
      : `/api/properties?lat=${lat}&lng=${lng}&radius=5`;
    const res = await fetch(url);
    const data = await res.json();
    setNearbyProperties(data.properties || []);
    setSelected(null);
    setFocusedProperty(null);
  };

  const handlePropertyClick = (property: Property) => {
    setSelected(property);
    setFocusedProperty(property);
  };

  const displayProperties = nearbyProperties ?? filteredProperties;

  const buildLocationLine = (p: any) =>
    [p.town, p.community, p.state].filter(Boolean).join(' · ');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#111111] font-['DM_Sans',_'Outfit',_sans-serif]">
      <aside className="relative z-20 flex w-[340px] shrink-0 flex-col border-r border-white/[0.05] bg-[#161616]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
              <svg
                className="h-4 w-4 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60">
                PropertyMap
              </p>
              <p className="text-[10px] text-white/25">Nigeria</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/[0.06]">
            <span className="text-sm font-bold tabular-nums text-amber-400">
              {displayProperties.length}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-white/25">
              listings
            </span>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-white/[0.05] space-y-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ring-1 transition-all ${
                nearbyProperties
                  ? 'bg-amber-500/10 text-amber-300 ring-amber-500/25'
                  : 'bg-white/[0.04] text-white/35 ring-white/[0.07]'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${nearbyProperties ? 'bg-amber-400 animate-pulse' : 'bg-white/20'}`}
              />
              {nearbyProperties ? 'Nearby' : 'All Nigeria'}
            </span>

            {nearbyProperties && (
              <button
                onClick={() => {
                  setNearbyProperties(null);
                  setFocusedProperty(null);
                }}
                className="ml-auto text-[10px] text-white/30 hover:text-white/60 underline underline-offset-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {nearbyProperties === null && (
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Area, bus stop, property…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-white/[0.04] py-2 pl-9 pr-8 text-xs text-white/70 placeholder-white/20 ring-1 ring-white/[0.07] outline-none transition focus:bg-white/[0.07] focus:ring-amber-500/40"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-amber-500" />
              <p className="text-[10px] uppercase tracking-widest text-white/20">
                Loading…
              </p>
            </div>
          ) : displayProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-24 px-6 text-center">
              <div className="text-3xl opacity-20 mb-1">🗺️</div>
              <p className="text-sm font-semibold text-white/30">
                No properties found
              </p>
              <p className="text-xs text-white/20">
                Try a different area or click the map
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.03] px-3 py-2">
              {displayProperties.map((p) => {
                const isSelected = selected?.id === p.id;
                const typeColor =
                  LISTING_TYPE_COLORS[(p as any).listingType] ??
                  'bg-white/5 text-white/30 ring-1 ring-white/10';

                return (
                  <li key={p.id}>
                    <button
                      onClick={() => handlePropertyClick(p)}
                      className={`group w-full rounded-xl px-3 py-3 text-left transition-all duration-150 ${
                        isSelected
                          ? 'bg-amber-500/10 ring-1 ring-amber-500/25'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base transition-colors ${
                            isSelected
                              ? 'bg-amber-500/20'
                              : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
                          }`}
                        >
                          🏠
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`truncate text-[13px] font-semibold leading-snug transition-colors ${
                                isSelected
                                  ? 'text-amber-300'
                                  : 'text-white/75 group-hover:text-white/90'
                              }`}
                            >
                              {p.name}
                            </p>
                            {(p as any).price && (
                              <span className="shrink-0 text-[11px] font-bold text-amber-400 bg-amber-500/10 rounded px-1.5 py-0.5 ring-1 ring-amber-500/20">
                                {(p as any).price}
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-[11px] text-white/30">
                            {p.address}
                          </p>

                          <div className="mt-1.5 flex items-center gap-2">
                            {buildLocationLine(p) && (
                              <span className="truncate text-[10px] text-white/25 uppercase tracking-wide">
                                {buildLocationLine(p)}
                              </span>
                            )}
                            <div className="ml-auto flex shrink-0 items-center gap-1.5">
                              {(p as any).listingType && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${typeColor}`}
                                >
                                  {(p as any).listingType}
                                </span>
                              )}
                              {(p as any).distance && (
                                <span className="text-[10px] font-semibold text-emerald-400">
                                  {(p as any).distance}km
                                </span>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <p className="mt-1.5 text-[10px] text-amber-400/70 font-medium flex items-center gap-1">
                              <span>📍</span> Zoomed to location on map
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {selected && (
          <div className="border-t border-white/[0.05] p-4 bg-[#161616]">
            <div className="mb-3 flex items-start gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-base">
                🏠
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-white/80">
                  {selected.name}
                </p>
                <p className="truncate text-[11px] text-white/35">
                  {(selected as any).address}
                </p>
              </div>
            </div>
            <Link
              href={`/properties/${selected.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all duration-150 shadow-lg shadow-amber-500/20"
            >
              View Full Details
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </aside>

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4 gap-3">
          <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-[#161616]/90 px-3.5 py-2 text-xs ring-1 ring-white/[0.07] backdrop-blur-xl shadow-xl">
            <span
              className={`h-2 w-2 rounded-full ${
                locationState === 'granted'
                  ? 'bg-blue-400 animate-pulse'
                  : locationState === 'requesting'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-white/20'
              }`}
            />
            <span className="font-medium text-white/55">
              {locationState === 'granted'
                ? 'Your location active'
                : locationState === 'requesting'
                  ? 'Locating…'
                  : 'Lagos, Nigeria'}
            </span>
          </div>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold ring-1 backdrop-blur-xl shadow-xl transition-all duration-150 ${
              showHeatmap
                ? 'bg-orange-500/20 text-orange-300 ring-orange-500/30 shadow-orange-500/10'
                : 'bg-[#161616]/90 text-white/45 ring-white/[0.07] hover:text-white/70'
            }`}
          >
            <span>🔥</span>
            <span>{showHeatmap ? 'Heatmap On' : 'Heatmap'}</span>
          </button>
        </div>

        <div className="absolute inset-0">
          <GoogleMap
            properties={displayProperties}
            onMarkerClick={handlePropertyClick}
            onMapClick={handleMapClick}
            showHeatmap={showHeatmap}
            userLocation={userLocation || undefined}
            focusedProperty={focusedProperty}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center z-10">
          <div className="flex items-center gap-3 rounded-full bg-[#161616]/95 px-5 py-2.5 text-[11px] ring-1 ring-white/[0.07] backdrop-blur-xl shadow-2xl">
            <span className="font-bold tabular-nums text-amber-400">
              {displayProperties.length}
            </span>
            <span className="text-white/35">
              {nearbyProperties !== null
                ? 'properties nearby'
                : 'properties across Nigeria'}
            </span>
            <span className="h-3 w-px bg-white/[0.10]" />
            <span className="text-white/20">Click a listing to zoom</span>
          </div>
        </div>
      </main>
    </div>
  );
}
