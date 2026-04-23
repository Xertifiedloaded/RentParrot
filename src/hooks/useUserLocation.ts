'use client';

import { useState, useEffect } from 'react';

interface StoredLocation {
  lat: number;
  lng: number;
  detectedState: string | null;
  timestamp: number;
}

const STORAGE_KEY = 'naija_rent_location';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const NIGERIAN_STATE_COORDS: { lat: number; lng: number; name: string }[] = [
  { lat: 6.5244, lng: 3.3792, name: 'Lagos' },
  { lat: 7.1608, lng: 3.3473, name: 'Ogun' },
  { lat: 7.8489, lng: 3.9470, name: 'Oyo' },
  { lat: 9.0765, lng: 7.3986, name: 'FCT' },
  { lat: 4.8156, lng: 7.0498, name: 'Rivers' },
  { lat: 12.0022, lng: 8.5920, name: 'Kano' },
  { lat: 10.5105, lng: 7.4165, name: 'Kaduna' },
  { lat: 6.2104, lng: 6.9623, name: 'Anambra' },
  { lat: 6.4584, lng: 7.5464, name: 'Enugu' },
  { lat: 5.8904, lng: 5.6800, name: 'Delta' },
  { lat: 6.3350, lng: 5.6270, name: 'Edo' },
  { lat: 7.2500, lng: 5.1950, name: 'Ondo' },
  { lat: 7.7190, lng: 5.3110, name: 'Ekiti' },
  { lat: 7.5629, lng: 4.5200, name: 'Osun' },
  { lat: 8.4966, lng: 4.5421, name: 'Kwara' },
  { lat: 7.3369, lng: 8.7400, name: 'Benue' },
  { lat: 9.2182, lng: 9.5179, name: 'Plateau' },
  { lat: 5.8702, lng: 8.5881, name: 'Cross River' },
  { lat: 5.0077, lng: 7.8536, name: 'Akwa Ibom' },
  { lat: 5.4895, lng: 7.0269, name: 'Imo' },
  { lat: 5.4527, lng: 7.5248, name: 'Abia' },
  { lat: 6.2649, lng: 8.0137, name: 'Ebonyi' },
  { lat: 4.7719, lng: 6.0699, name: 'Bayelsa' },
  { lat: 7.7337, lng: 6.6906, name: 'Kogi' },
  { lat: 9.9309, lng: 5.5983, name: 'Niger' },
  { lat: 8.5378, lng: 8.3206, name: 'Nasarawa' },
  { lat: 7.9994, lng: 10.7740, name: 'Taraba' },
  { lat: 9.3265, lng: 12.3984, name: 'Adamawa' },
  { lat: 10.2791, lng: 11.1670, name: 'Gombe' },
  { lat: 11.8333, lng: 13.1500, name: 'Borno' },
  { lat: 12.0000, lng: 11.5000, name: 'Yobe' },
  { lat: 10.3158, lng: 9.8442, name: 'Bauchi' },
  { lat: 12.2280, lng: 9.5616, name: 'Jigawa' },
  { lat: 12.9889, lng: 7.6006, name: 'Katsina' },
  { lat: 12.4539, lng: 4.1975, name: 'Kebbi' },
  { lat: 13.0059, lng: 5.2476, name: 'Sokoto' },
  { lat: 12.1704, lng: 6.6624, name: 'Zamfara' },
];

export function detectStateFromCoords(lat: number, lng: number): string | null {
  let closest: string | null = null;
  let minDist = Infinity;
  for (const s of NIGERIAN_STATE_COORDS) {
    const dist = Math.sqrt(Math.pow(lat - s.lat, 2) + Math.pow(lng - s.lng, 2));
    if (dist < minDist) { minDist = dist; closest = s.name; }
  }
  return minDist < 3 ? closest : null;
}

export type LocationStatus = 'idle' | 'granted' | 'denied';

export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [detectedState, setDetectedState] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      return;
    }

    // Always check the LIVE permission state first — don't trust cache if permission was revoked
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((permResult) => {

        if (permResult.state === 'denied') {
          // Permission is off at OS/browser level — clear any stale cache and stop
          try { localStorage.removeItem(STORAGE_KEY); } catch {}
          setStatus('denied');
          return;
        }

        if (permResult.state === 'granted') {
          // Permission is on — check localStorage cache
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
              const stored: StoredLocation = JSON.parse(raw);
              if (Date.now() - stored.timestamp < CACHE_TTL) {
                // Fresh cache — restore immediately, no geolocation call needed
                setUserCoords({ lat: stored.lat, lng: stored.lng });
                setDetectedState(stored.detectedState);
                setStatus('granted');
                return;
              }
            }
          } catch {}

          // Cache stale or missing — get fresh position (no browser dialog since already granted)
          navigator.geolocation.getCurrentPosition(
            (pos) => savePosition(pos.coords.latitude, pos.coords.longitude),
            () => {
              try { localStorage.removeItem(STORAGE_KEY); } catch {}
              setStatus('denied');
            },
            { timeout: 10000, enableHighAccuracy: false },
          );
          return;
        }

        // permResult.state === 'prompt' — first time, trigger native browser dialog
        navigator.geolocation.getCurrentPosition(
          (pos) => savePosition(pos.coords.latitude, pos.coords.longitude),
          () => {
            setStatus('denied');
          },
          { timeout: 10000, enableHighAccuracy: false },
        );

        // Listen for permission changes in real time (e.g. user toggles location off mid-session)
        permResult.onchange = () => {
          if (permResult.state === 'denied') {
            try { localStorage.removeItem(STORAGE_KEY); } catch {}
            setStatus('denied');
            setDetectedState(null);
            setUserCoords(null);
          }
        };
      });
    } else {
      // Fallback for browsers without permissions API (some mobile browsers)
      // Check cache first
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored: StoredLocation = JSON.parse(raw);
          if (Date.now() - stored.timestamp < CACHE_TTL) {
            setUserCoords({ lat: stored.lat, lng: stored.lng });
            setDetectedState(stored.detectedState);
            setStatus('granted');
            return;
          }
        }
      } catch {}

      // No cache — try geolocation directly (will show browser dialog if needed)
      navigator.geolocation.getCurrentPosition(
        (pos) => savePosition(pos.coords.latitude, pos.coords.longitude),
        () => {
          try { localStorage.removeItem(STORAGE_KEY); } catch {}
          setStatus('denied');
        },
        { timeout: 10000, enableHighAccuracy: false },
      );
    }
  }, []);

  const savePosition = (lat: number, lng: number) => {
    const state = detectStateFromCoords(lat, lng);
    const toStore: StoredLocation = { lat, lng, detectedState: state, timestamp: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore)); } catch {}
    setUserCoords({ lat, lng });
    setDetectedState(state);
    setStatus('granted');
  };

  const clearLocation = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setStatus('denied');
    setDetectedState(null);
    setUserCoords(null);
  };

  return { status, detectedState, userCoords, clearLocation };
}