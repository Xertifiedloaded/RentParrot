'use client';

import { useState, useEffect } from 'react';
import { useUserLocation } from './useUserLocation';

export function useProperties(query: string) {
  const {
    status,
    detectedState,
    clearLocation,
  } = useUserLocation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProperties() {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (query) {
          params.set('search', query);
        } else if (
          status === 'granted' &&
          detectedState
        ) {
          params.set('state', detectedState);
        }

        const res = await fetch(
          `/api/properties?${params}`,
          {
            cache: 'no-store',
            signal: controller.signal,
          }
        );

        const data = await res.json();
        setProperties(data.properties || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }

    if (status !== 'loading') {
      fetchProperties();
    }

    return () => controller.abort();
  }, [query, status, detectedState]);

  return {
    properties,
    loading,
    status,
    detectedState,
    clearLocation,
  };
}