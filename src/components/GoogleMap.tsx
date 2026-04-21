'use client';

import { useEffect, useRef, useState } from 'react';
import { Property } from '@/types';

interface MapProps {
  properties?: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (property: Property) => void;
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
  showHeatmap = false,
  singleProperty,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(
    null,
  );

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Load script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your-google-maps-api-key') {
      setError(true);
      return;
    }

    if (window.google?.maps) {
      setLoaded(true);
      return;
    }

    window.initGoogleMaps = () => setLoaded(true);

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => setError(true);

    document.head.appendChild(script);
  }, []);

  // Init map
  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const mapCenter = singleProperty
      ? { lat: singleProperty.latitude, lng: singleProperty.longitude }
      : center;

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: singleProperty ? 15 : zoom,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#b0b8d1' }] },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#334155' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#2d3748' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#334155' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#0f3460' }],
        },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      ],
    });
  }, [loaded, center, zoom, singleProperty]);

  // Markers
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
          fillColor: '#e85d04',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:8px;min-width:200px;font-family:sans-serif">
            <strong style="color:#f97316;font-size:14px">${property.name}</strong>
            <p style="margin:6px 0 0;font-size:12px;color:#94a3b8">📍 ${property.address}</p>
            <a href="/properties/${property.id}" style="display:inline-block;margin-top:8px;background:#e85d04;color:#fff;padding:4px 10px;border-radius:4px;font-size:11px;text-decoration:none">View Details →</a>
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

  // Heatmap (FIXED HERE)
  useEffect(() => {
    if (!mapInstanceRef.current || !showHeatmap) return;

    fetch('/api/heatmap')
      .then((r) => r.json())
      .then(({ points }) => {
        if (heatmapRef.current) {
          heatmapRef.current.setMap(null);
        }

        // ✅ Correct: NO "new WeightedLocation"
        const heatmapData: google.maps.visualization.WeightedLocation[] =
          points.map((p: { lat: number; lng: number; weight: number }) => ({
            location: new google.maps.LatLng(p.lat, p.lng),
            weight: p.weight,
          }));

        heatmapRef.current = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: mapInstanceRef.current!,
          radius: 40,
          opacity: 0.7,
          gradient: [
            'rgba(0,0,0,0)',
            'rgba(255,200,0,0.4)',
            'rgba(255,120,0,0.7)',
            'rgba(220,38,38,1)',
          ],
        });
      });
  }, [showHeatmap, loaded]);

  if (error) {
    return (
      <div className="map-placeholder">
        <div className="map-placeholder-inner">
          <span>🗺️</span>
          <p>Google Maps API key required</p>
          <small>Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file</small>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="map-placeholder">
        <div className="map-placeholder-inner">
          <div className="map-loader" />
          <p>Loading map…</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="map-container" />;
}
