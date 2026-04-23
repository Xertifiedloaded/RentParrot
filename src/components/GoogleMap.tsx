'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Property } from '@/types';

interface MapProps {
  properties?: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (property: Property) => void;
  onMapClick?: (lat: number, lng: number) => void;
  userLocation?: { lat: number; lng: number };
  showHeatmap?: boolean;
  singleProperty?: Property;
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

export default function GoogleMap({
  properties = [],
  center = { lat: 6.5244, lng: 3.3792 },
  zoom = 12,
  onMarkerClick,
  onMapClick,
  userLocation,
  showHeatmap = false,
  singleProperty,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const clickMarkerRef = useRef<google.maps.Circle | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Keep a stable ref so the map-click effect doesn't re-run on every render
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => { onMapClickRef.current = onMapClick; }, [onMapClick]);

  const stableOnMapClick = useCallback((lat: number, lng: number) => {
    onMapClickRef.current?.(lat, lng);
  }, []);

  // ── Load Google Maps script ──────────────────────────────────────────────
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your-google-maps-api-key') { setError(true); return; }
    if (window.google?.maps) { setLoaded(true); return; }
    window.initGoogleMaps = () => setLoaded(true);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const mapCenter = singleProperty
      ? { lat: singleProperty.latitude, lng: singleProperty.longitude }
      : center;

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: singleProperty ? 15 : zoom,
      styles: [
        { elementType: 'geometry',              stylers: [{ color: '#f4f4f5' }] },
        { elementType: 'labels.text.stroke',    stylers: [{ color: '#f4f4f5' }] },
        { elementType: 'labels.text.fill',      stylers: [{ color: '#52525b' }] },
        { featureType: 'administrative',        elementType: 'geometry.stroke', stylers: [{ color: '#d4d4d8' }] },
        { featureType: 'road',                  elementType: 'geometry',        stylers: [{ color: '#e4e4e7' }] },
        { featureType: 'road',                  elementType: 'labels.text.fill',stylers: [{ color: '#71717a' }] },
        { featureType: 'road.highway',          elementType: 'geometry',        stylers: [{ color: '#d4d4d8' }] },
        { featureType: 'water',                 elementType: 'geometry',        stylers: [{ color: '#bfdbfe' }] },
        { featureType: 'water',                 elementType: 'labels.text.fill',stylers: [{ color: '#60a5fa' }] },
        { featureType: 'poi',                                                    stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.park',              elementType: 'geometry',        stylers: [{ color: '#dcfce7' }] },
        { featureType: 'landscape.natural',     elementType: 'geometry',        stylers: [{ color: '#f0fdf4' }] },
      ],
    });

    if (onMapClick) {
      mapInstanceRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        if (clickMarkerRef.current) clickMarkerRef.current.setMap(null);

        // 2 km search-area indicator
        clickMarkerRef.current = new google.maps.Circle({
          center: { lat, lng },
          radius: 2000,
          map: mapInstanceRef.current!,
          fillColor: '#18181b',
          fillOpacity: 0.06,
          strokeColor: '#18181b',
          strokeOpacity: 0.25,
          strokeWeight: 1.5,
        });

        stableOnMapClick(lat, lng);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, center, zoom, singleProperty, stableOnMapClick]);

  // ── User location marker ─────────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    if (userMarkerRef.current) userMarkerRef.current.setMap(null);

    new google.maps.Circle({
      center: userLocation,
      radius: 300,
      map: mapInstanceRef.current,
      fillColor: '#3b82f6',
      fillOpacity: 0.12,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.25,
      strokeWeight: 1,
    });

    userMarkerRef.current = new google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      title: 'Your Location',
      zIndex: 999,
    });

    mapInstanceRef.current.panTo(userLocation);
    mapInstanceRef.current.setZoom(14);
  }, [userLocation, loaded]);

  // ── Property markers ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const allProperties = singleProperty ? [singleProperty] : properties;

    allProperties.forEach((property) => {
      const marker = new google.maps.Marker({
        position: { lat: property.latitude, lng: property.longitude },
        map: mapInstanceRef.current!,
        title: property.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#18181b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2.5,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="
            background:#ffffff;
            color:#18181b;
            padding:14px 16px;
            border-radius:10px;
            min-width:210px;
            font-family:ui-sans-serif,system-ui,sans-serif;
            box-shadow:0 4px 20px rgba(0,0,0,.10);
            border:1px solid #e4e4e7;
          ">
            <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#18181b;">${property.name}</p>
            <p style="margin:0 0 2px;font-size:12px;color:#71717a;">📍 ${property.address}</p>
            ${(property as any).state ? `<p style="margin:0 0 4px;font-size:11px;color:#a1a1aa;">${(property as any).state} State</p>` : ''}
            <p style="margin:0 0 10px;font-size:11px;color:#a1a1aa;">💬 ${property._count?.reviews ?? property.reviews?.length ?? 0} review(s)</p>
            <a href="/properties/${property.id}" style="
              display:inline-block;
              background:#18181b;
              color:#ffffff;
              padding:5px 12px;
              border-radius:6px;
              font-size:11px;
              font-weight:600;
              text-decoration:none;
            ">View Details →</a>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        onMarkerClick?.(property);
      });

      markersRef.current.push(marker);
    });
  }, [properties, singleProperty, onMarkerClick]);

  // ── Heatmap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !showHeatmap) {
      if (heatmapRef.current) { heatmapRef.current.setMap(null); heatmapRef.current = null; }
      return;
    }

    fetch('/api/heatmap')
      .then((r) => r.json())
      .then(({ points }) => {
        if (heatmapRef.current) heatmapRef.current.setMap(null);
        const heatmapData: google.maps.visualization.WeightedLocation[] = points.map(
          (p: { lat: number; lng: number; weight: number }) => ({
            location: new google.maps.LatLng(p.lat, p.lng),
            weight: p.weight,
          }),
        );
        heatmapRef.current = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: mapInstanceRef.current!,
          radius: 40,
          opacity: 0.65,
          gradient: [
            'rgba(0,0,0,0)',
            'rgba(161,161,170,0.4)',
            'rgba(82,82,91,0.65)',
            'rgba(24,24,27,0.9)',
          ],
        });
      });
  }, [showHeatmap, loaded]);

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-full min-h-[360px] w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100">
        <div className="text-center">
          <span className="text-4xl">🗺️</span>
          <p className="mt-2 text-sm font-semibold text-zinc-800">
            Google Maps API key required
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file
          </p>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex h-full min-h-[360px] w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-800" />
          <p className="mt-3 text-sm text-zinc-500">Loading map…</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
}