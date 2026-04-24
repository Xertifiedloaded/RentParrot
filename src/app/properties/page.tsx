'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';
import { useUserLocation } from '@/hooks/useUserLocation';
import { MapPinCheck } from 'lucide-react';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

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

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Properties
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {query
                ? 'Search results across Nigeria'
                : detectedState
                  ? `Showing properties in ${detectedState} State`
                  : status === 'idle'
                    ? 'Detecting your location…'
                    : `Browse ${properties.length} properties across Nigeria`}
            </p>
          </div>
          <Link
            href="/post-property"
            className="inline-flex items-center gap-2 bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 shadow-lg shadow-orange-500/20"
          >
            <span className="text-base leading-none">+</span>
            Add Property
          </Link>
        </div>

        {detectedState && !query && (
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-orange-400">
              <span>
                <MapPinCheck size={12} />
              </span>
              {detectedState} State
              <button
                onClick={clearLocation}
                className="ml-0.5 text-orange-400 hover:text-orange-300 transition-colors text-sm leading-none"
                aria-label="Remove state filter"
              >
                ×
              </button>
            </span>
            <button
              onClick={clearLocation}
              className="text-xs font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full px-4 py-1.5 transition-colors duration-150"
            >
              Show All States
            </button>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none select-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, address or state…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#242424] border border-gray-700  rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition-all duration-150"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 whitespace-nowrap shadow-md shadow-amber-500/20"
          >
            Search
          </button>
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-4 py-2.5 transition-colors duration-150 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </form>

        {/* Active Query Banner */}
        {query && (
          <p className="mb-5 text-sm text-gray-400">
            Results for{' '}
            <strong className="text-gray-200 font-semibold">"{query}"</strong>
            {' · '}
            <button
              onClick={clearSearch}
              className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
            >
              ← Back to {detectedState ? `${detectedState} State` : 'browse'}
            </button>
          </p>
        )}

        {/* Content Area */}
        {loading || status === 'idle' ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-9 h-9 rounded-full border-2 border-gray-700 border-t-orange-500 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center gap-3">
            <span className="text-5xl mb-1">🏘️</span>
            <h3 className="text-lg font-semibold text-white">
              No properties found
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {query
                ? 'Try a different search term'
                : detectedState
                  ? `No properties listed in ${detectedState} State yet`
                  : 'Be the first to add a property!'}
            </p>
            <div className="flex gap-3 flex-wrap justify-center mt-2">
              {detectedState && !query && (
                <button
                  onClick={clearLocation}
                  className="text-sm font-medium text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white rounded-lg px-4 py-2 transition-colors"
                >
                  Browse All States
                </button>
              )}
              <Link
                href="/post-property"
                className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-5 py-2 transition-colors shadow-md shadow-orange-500/20"
              >
                Add a Property
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
