'use client';

import { NIGERIAN_STATE_COORDS } from '@/lib';
import { useState, useEffect } from 'react';

interface StoredLocation {
  lat: number;
  lng: number;
  detectedState: string | null;
  timestamp: number;
}

const STORAGE_KEY = 'naija_rent_location';
const CACHE_TTL = 24 * 60 * 60 * 1000;

export function detectStateFromCoords(lat: number, lng: number): string | null {
  let closest: string | null = null;
  let minDist = Infinity;
  for (const s of NIGERIAN_STATE_COORDS) {
    const dist = Math.sqrt(Math.pow(lat - s.lat, 2) + Math.pow(lng - s.lng, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = s.name;
    }
  }
  return minDist < 3 ? closest : null;
}

export type LocationStatus = 'idle' | 'granted' | 'denied';

export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [detectedState, setDetectedState] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((permResult) => {
        if (permResult.state === 'denied') {
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {}
          setStatus('denied');
          return;
        }

        if (permResult.state === 'granted') {
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

          navigator.geolocation.getCurrentPosition(
            (pos) => savePosition(pos.coords.latitude, pos.coords.longitude),
            () => {
              try {
                localStorage.removeItem(STORAGE_KEY);
              } catch {}
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

        permResult.onchange = () => {
          if (permResult.state === 'denied') {
            try {
              localStorage.removeItem(STORAGE_KEY);
            } catch {}
            setStatus('denied');
            setDetectedState(null);
            setUserCoords(null);
          }
        };
      });
    } else {
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

      navigator.geolocation.getCurrentPosition(
        (pos) => savePosition(pos.coords.latitude, pos.coords.longitude),
        () => {
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {}
          setStatus('denied');
        },
        { timeout: 10000, enableHighAccuracy: false },
      );
    }
  }, []);

  const savePosition = (lat: number, lng: number) => {
    const state = detectStateFromCoords(lat, lng);
    const toStore: StoredLocation = {
      lat,
      lng,
      detectedState: state,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {}
    setUserCoords({ lat, lng });
    setDetectedState(state);
    setStatus('granted');
  };

  const clearLocation = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setStatus('denied');
    setDetectedState(null);
    setUserCoords(null);
  };

  return { status, detectedState, userCoords, clearLocation };
}
