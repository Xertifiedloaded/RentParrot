'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Property } from '@/types';
import { MapProps } from '../types/index';

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
  focusedProperty,
}: MapProps & { focusedProperty?: Property | null }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(
    null,
  );
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const clickMarkerRef = useRef<google.maps.Circle | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  const stableOnMapClick = useCallback(
    (lat: number, lng: number, state?: string) => {
      onMapClickRef.current?.(lat, lng, state);
    },
    [],
  );

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
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#263c3f' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#6b9a76' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9ca5b3' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#746855' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1f2835' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#f3d19c' }],
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#2f3948' }],
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }],
        },
      ],
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
    });

    infoWindowRef.current = new google.maps.InfoWindow();

    if (onMapClick) {
      mapInstanceRef.current.addListener(
        'click',
        (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          if (clickMarkerRef.current) clickMarkerRef.current.setMap(null);

          clickMarkerRef.current = new google.maps.Circle({
            center: { lat, lng },
            radius: 2000,
            map: mapInstanceRef.current!,
            fillColor: '#f59e0b',
            fillOpacity: 0.07,
            strokeColor: '#f59e0b',
            strokeOpacity: 0.3,
            strokeWeight: 1.5,
          });

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            let detectedState: string | undefined;
            if (status === 'OK' && results?.length) {
              const stateComp = results[0].address_components.find((c) =>
                c.types.includes('administrative_area_level_1'),
              );
              detectedState = stateComp?.long_name;
            }
            stableOnMapClick(lat, lng, detectedState);
          });
        },
      );
    }
  }, [loaded, center, zoom, singleProperty, stableOnMapClick, onMapClick]);

  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;
    if (userMarkerRef.current) userMarkerRef.current.setMap(null);

    userMarkerRef.current = new google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
    });

    mapInstanceRef.current.panTo(userLocation);
    mapInstanceRef.current.setZoom(14);
  }, [userLocation]);

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
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: '#f59e0b',
          fillOpacity: 1,
          strokeColor: '#1a1a1a',
          strokeWeight: 1.5,
          scale: 1.4,
          anchor: new google.maps.Point(12, 22),
        },
      });

      marker.addListener('click', () => {
        onMarkerClick?.(property);

        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="background:#1e1e1e;color:#fff;padding:10px 14px;border-radius:8px;font-family:sans-serif;min-width:180px;">
              <div style="font-size:13px;font-weight:700;color:#f59e0b;margin-bottom:4px;">${property.name}</div>
              <div style="font-size:11px;color:#9ca3af;">${property.address}</div>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });
  }, [properties, singleProperty, onMarkerClick]);

  useEffect(() => {
    if (!mapInstanceRef.current || !focusedProperty) return;

    const target = {
      lat: focusedProperty.latitude,
      lng: focusedProperty.longitude,
    };
    mapInstanceRef.current.panTo(target);
    mapInstanceRef.current.setZoom(15);

    const focusedMarker = markersRef.current.find((_, i) => {
      const allProperties = singleProperty ? [singleProperty] : properties;
      return allProperties[i]?.id === focusedProperty.id;
    });

    if (focusedMarker && infoWindowRef.current) {
      infoWindowRef.current.setContent(`
        <div style="background:#1e1e1e;color:#fff;padding:10px 14px;border-radius:8px;font-family:sans-serif;min-width:180px;">
          <div style="font-size:13px;font-weight:700;color:#f59e0b;margin-bottom:4px;">${focusedProperty.name}</div>
          <div style="font-size:11px;color:#9ca3af;">${focusedProperty.address}</div>
        </div>
      `);
      infoWindowRef.current.open(mapInstanceRef.current, focusedMarker);
    }
  }, [focusedProperty, properties, singleProperty]);

  useEffect(() => {
    if (!mapInstanceRef.current || !showHeatmap) {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
      return;
    }

    fetch('/api/heatmap')
      .then((r) => r.json())
      .then(({ points }) => {
        if (heatmapRef.current) heatmapRef.current.setMap(null);
        const heatmapData = points.map(
          (p: { lat: number; lng: number; weight: number }) => ({
            location: new google.maps.LatLng(p.lat, p.lng),
            weight: p.weight,
          }),
        );
        heatmapRef.current = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: mapInstanceRef.current!,
        });
      });
  }, [showHeatmap]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#111111]">
        <div className="text-center">
          <div className="mb-2 text-3xl">🗺️</div>
          <p className="text-sm font-medium text-gray-400">
            Google Maps API key required
          </p>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#111111]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-amber-500" />
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
}
