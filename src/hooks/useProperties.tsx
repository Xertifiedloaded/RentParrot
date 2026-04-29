import { useState, useCallback, useEffect } from 'react';
import { useUserLocation } from './useUserLocation';
import { Property } from '../types/index';

interface UsePropertiesOptions {
  stateKey?: 'featuredProperties' | 'properties';
}

export function useProperties(query: string) {
  const { status, detectedState, clearLocation } = useUserLocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { properties, loading, status, detectedState, clearLocation };
}
