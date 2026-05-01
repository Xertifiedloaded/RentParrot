'use client';

import { useState, useEffect, useCallback } from 'react';
import { NIGERIAN_STATE_COORDS } from '@/lib';

interface StoredLocation {
  lat: number;
  lng: number;
  detectedState: string | null;
  timestamp: number;
}

const STORAGE_KEY = 'naija_rent_location';
const CACHE_TTL = 30 * 60 * 1000;

export type LocationStatus =
  | 'idle'
  | 'loading'
  | 'granted'
  | 'denied';

function detectStateFromCoords(lat: number, lng: number) {
  let closest = null;
  let minDist = Infinity;

  for (const state of NIGERIAN_STATE_COORDS) {
    const dist =
      (lat - state.lat) ** 2 +
      (lng - state.lng) ** 2;

    if (dist < minDist) {
      minDist = dist;
      closest = state.name;
    }
  }

  return closest;
}

export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [detectedState, setDetectedState] = useState<string | null>(null);

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      return;
    }

    setStatus('loading');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;

        const state = detectStateFromCoords(latitude, longitude);

        const data: StoredLocation = {
          lat: latitude,
          lng: longitude,
          detectedState: state,
          timestamp: Date.now(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        setLat(latitude);       
        setLng(longitude);      
        setDetectedState(state);
        setStatus('granted');
      },
      () => setStatus('denied'),
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);

    if (cached) {
      const parsed: StoredLocation = JSON.parse(cached);

      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        setLat(parsed.lat);          
        setLng(parsed.lng);          
        setDetectedState(parsed.detectedState);
        setStatus('granted');
        return;
      }
    }

    getLocation();

    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((permission) => {
        permission.onchange = () => {
          if (permission.state === 'granted') {
            getLocation();
          } else if (permission.state === 'denied') {
            setStatus('denied');
          }
        };
      });
  }, [getLocation]);

  const clearLocation = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDetectedState(null);
    setLat(null);   
    setLng(null);   
    setStatus('idle');
    getLocation();
  };

  return {
    status,
    detectedState,
    lat,            
    lng,            
    clearLocation,
    refreshLocation: getLocation,
  };
}