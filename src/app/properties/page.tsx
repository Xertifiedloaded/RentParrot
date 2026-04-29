'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';
import { useUserLocation } from '@/hooks/useUserLocation';
import { MapPin, Search, X, Plus } from 'lucide-react';

const FONT_MONO = "'Instrument Mono', 'JetBrains Mono', monospace";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const { status, detectedState, clearLocation } = useUserLocation();

  const fetchProperties = useCallback(
    async (stateFilter?: string) => {
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
    },
    [query],
  );

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

  const isLoading = loading || status === 'idle';
  const isEmpty = !isLoading && properties.length === 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
          <div className="min-w-0">
            <p
              className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-amber-400/60 font-semibold"
              style={{ fontFamily: FONT_MONO }}
            >
              {detectedState && !query
                ? `${detectedState} State`
                : 'All Nigeria'}
            </p>

            <h1 className="mt-1 text-xl sm:text-3xl font-black tracking-tight wrap-break-word">
              Properties
              {!isLoading && !isEmpty && (
                <span
                  className="ml-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] sm:text-xs text-amber-400 align-middle"
                  style={{ fontFamily: FONT_MONO }}
                >
                  {properties.length}
                </span>
              )}
            </h1>

            <p className="mt-1 text-[11px] sm:text-sm text-white/40">
              {query
                ? `Results for "${query}"`
                : detectedState
                  ? `Near your location in ${detectedState}`
                  : status === 'idle'
                    ? 'Detecting location…'
                    : 'Browse trusted properties across Nigeria'}
            </p>
          </div>

          <Link
            href="/post-property"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition"
          >
            <Plus size={14} />
            Add Property
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-5">
          <div
            className={`flex items-center gap-2 rounded-2xl border bg-white/5 px-3 sm:px-4 transition-all ${
              focused
                ? 'border-amber-400/40 ring-2 ring-amber-400/20'
                : 'border-white/10'
            }`}
          >
            <Search size={14} className="text-white/30 shrink-0" />

            <input
              type="text"
              placeholder="Search property, address or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="flex-1 bg-transparent py-3 text-xs sm:text-sm text-white placeholder:text-white/25 outline-none"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-lg p-1 text-white/30 hover:text-white"
              >
                <X size={14} />
              </button>
            )}

            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-black hover:bg-amber-400 transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {detectedState && !query && (
            <>
              <span
                className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] sm:text-xs text-amber-400"
                style={{ fontFamily: FONT_MONO }}
              >
                <MapPin size={10} />
                {detectedState}
                <button onClick={clearLocation}>
                  <X size={10} />
                </button>
              </span>

              <button
                onClick={clearLocation}
                className="rounded-full border border-white/10 px-3 py-1 text-[10px] sm:text-xs text-white/50 hover:text-white"
              >
                All states
              </button>
            </>
          )}

          {query && (
            <button
              onClick={clearSearch}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[10px] sm:text-xs text-white/50 hover:text-white"
            >
              <X size={10} />
              Clear Search
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center">
            <div className="text-4xl">🏠</div>
            <h3 className="mt-4 text-sm sm:text-lg font-semibold text-white/80">
              No properties found
            </h3>
            <p className="mt-2 max-w-xs text-xs sm:text-sm text-white/40">
              {query
                ? 'Try another search term.'
                : detectedState
                  ? `No listings in ${detectedState} yet.`
                  : 'Be the first to add a property.'}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {detectedState && !query && (
                <button
                  onClick={clearLocation}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white"
                >
                  Browse All
                </button>
              )}

              <Link
                href="/post-property"
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
              >
                Add Property
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {properties.map((p) => (
              <div
                key={p.id}
                className="transition-transform hover:scale-[1.02]"
              >
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
