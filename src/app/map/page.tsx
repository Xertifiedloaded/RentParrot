'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Search, Flame, X, ChevronUp, HomeIcon } from 'lucide-react';

import { Property } from '@/types';
import { LocationState, LISTING_TYPE_COLORS } from '../../types/index';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), {
  ssr: false,
});

type SidebarContentProps = {
  search: string;
  setSearch: (value: string) => void;
  loading: boolean;
  displayProperties: Property[];
  selected: Property | null;
  handlePropertyClick: (property: Property) => void;
  buildLocationLine: (p: Property) => string;
};

function SidebarContent({
  search,
  setSearch,
  loading,
  displayProperties,
  selected,
  handlePropertyClick,
  buildLocationLine,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-5 py-2 md:py-3 text-sm border-b border-white/5 shrink-0">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 sm:gap-3 group"
        >
          <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-500 to-red-500 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="absolute -top-1 -right-1 text-[8px] sm:text-[10px]">
              🦜
            </span>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight text-white">
              Rent<span className="text-orange-500">Parrot</span>
            </span>
            <span className="text-[9px] sm:text-[10px] lg:text-xs text-gray-400 font-medium">
              Hear before you rent
            </span>
          </div>
        </Link>
        <h1 className="text-sm mt-4 font-semibold tracking-tight text-white">
          Explore Properties
        </h1>
        <p className="text-xs text-white/40 mt-1">
          Trusted rentals across Nigeria
        </p>
      </div>

      <div className="p-4 border-b border-white/5 shrink-0">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Search location or property"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full placeholder:text-xs rounded-2xl bg-white/4 px-11 py-3 text-base text-white placeholder:text-white/25 outline-none focus:ring-1 focus:ring-amber-500/40"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 text-sm min-h-0 overflow-y-auto px-3 pb-4">
        {loading ? (
          <div className="flex justify-center py-10 text-white/40">
            Loading...
          </div>
        ) : displayProperties.length === 0 ? (
          <div className="flex text-xs items-center justify-center py-10 text-white/40">
            No properties found
          </div>
        ) : (
          <div className="space-y-2">
            {displayProperties.map((p: any) => {
              const isSelected = selected?.id === p.id;
              const typeColor =
                LISTING_TYPE_COLORS[p.listingType] ??
                'bg-white/5 text-white/40';

              return (
                <button
                  key={p.id}
                  onClick={() => handlePropertyClick(p)}
                  className={`w-full rounded-2xl p-4 text-left transition ${
                    isSelected ? 'bg-white/6' : 'hover:bg-white/3'
                  }`}
                >
                  <div className="flex  justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-white capitalize">
                        {p.address}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-[10px]">
                    {buildLocationLine(p) && (
                      <span className="text-white/30 truncate">
                        {buildLocationLine(p)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {selected && (
        <div className="shrink-0 sticky bottom-0 p-4 border-t border-white/5 bg-[#111214]">
          <Link
            href={`/properties/${selected.id}`}
            className="w-full flex items-center justify-center rounded-2xl bg-amber-500 hover:bg-amber-400 py-3 text-sm font-semibold text-black"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
}

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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY;

    if (diff > 50) setMobileOpen(false);
    if (diff < -50) setMobileOpen(true);

    setTouchStartY(null);
  };

  const displayProperties = nearbyProperties ?? filteredProperties;

  const buildLocationLine = (p: any) =>
    [p.town, p.community, p.state].filter(Boolean).join(' · ');

  return (
    <div className="h-dvh w-screen bg-[#0B0B0C] text-white overflow-hidden flex">
      <aside className="hidden md:flex w-85 xl:w-95 flex-col border-r border-white/5 bg-[#111214] h-dvh overflow-hidden">
        <SidebarContent
          search={search}
          setSearch={setSearch}
          loading={loading}
          displayProperties={displayProperties}
          selected={selected}
          handlePropertyClick={handlePropertyClick}
          buildLocationLine={buildLocationLine}
        />
      </aside>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`fixed md:hidden inset-x-0 bottom-0 z-30 rounded-t-3xl bg-[#111214] border-t border-white/5 overflow-hidden transition-transform duration-300 ${
          mobileOpen
            ? 'translate-y-0 h-[75vh]'
            : 'translate-y-[calc(100%-80px)] h-[75vh]'
        }`}
      >
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex justify-center"
        >
          <ChevronUp
            className={`text-white/40 transition-transform ${
              mobileOpen ? 'rotate-180' : ''
            }`}
            size={20}
          />
        </button>

        <SidebarContent
          search={search}
          setSearch={setSearch}
          loading={loading}
          displayProperties={displayProperties}
          selected={selected}
          handlePropertyClick={handlePropertyClick}
          buildLocationLine={buildLocationLine}
        />
      </div>

      {/* Map */}
      <main className="relative flex-1 overflow-hidden">
        <div className="absolute z-20 top-4 left-4 right-4 flex justify-between">
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl px-4 py-2 text-xs">
            {locationState === 'granted'
              ? 'Live Location'
              : locationState === 'requesting'
                ? 'Locating...'
                : 'Nigeria'}
          </div>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`backdrop-blur-xl rounded-2xl px-4 py-2 text-xs border ${
              showHeatmap
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'bg-black/40 border-white/10 text-white/70'
            }`}
          >
            <Flame size={14} />
          </button>
        </div>

        <GoogleMap
          properties={displayProperties}
          onMarkerClick={handlePropertyClick}
          onMapClick={handleMapClick}
          showHeatmap={showHeatmap}
          userLocation={userLocation || undefined}
          focusedProperty={focusedProperty}
        />
      </main>
    </div>
  );
}
