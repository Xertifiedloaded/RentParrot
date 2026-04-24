'use client';

import { useEffect, useState } from 'react';
import { MapPin, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { PermissionState } from '../types/index';

export function LocationPermission() {
  const { detectedState } = useUserLocation();
  const [permissionState, setPermissionState] =
    useState<PermissionState>('loading');
  const [isSystemLocationDisabled, setIsSystemLocationDisabled] =
    useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionState('unavailable');
      setIsSystemLocationDisabled(true);
      return;
    }

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permResult) => {
          setPermissionState(permResult.state as PermissionState);
          permResult.onchange = () =>
            setPermissionState(permResult.state as PermissionState);
        });
    } else {
      navigator.geolocation.getCurrentPosition(
        () => setPermissionState('granted'),
        (err) => {
          if (err.code === 1) setPermissionState('denied');
          else if (err.code === 3) {
            setPermissionState('denied');
            setIsSystemLocationDisabled(true);
          } else setPermissionState('prompt');
        },
        { timeout: 5000 },
      );
    }
  }, []);

  const handleRequestLocation = () => {
    setPermissionState('loading');
    navigator.geolocation.getCurrentPosition(
      () => setPermissionState('granted'),
      (error) => {
        if (error.code === 1) setPermissionState('denied');
        else if (error.code === 3) {
          setPermissionState('denied');
          setIsSystemLocationDisabled(true);
        } else setPermissionState('prompt');
      },
      { timeout: 10000 },
    );
  };

  const handleOpenLocationSettings = () => {
    const isMobile = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);
    alert(
      isMobile
        ? 'Enable location:\n\niOS: Settings > Privacy > Location Services\nAndroid: Settings > Apps > Permissions > Location'
        : 'Enable location:\n\nWindows: Settings > Privacy > Location\nmacOS: System Preferences > Security & Privacy > Location Services',
    );
  };

  const statusVariants = {
    loading: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: <Loader className="h-4 w-4 animate-spin text-blue-400" />,
      text: 'text-blue-300',
      label: 'Requesting location permission…',
    },
    granted: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: <CheckCircle className="h-4 w-4 text-emerald-400" />,
      text: 'text-emerald-300',
      label: detectedState
        ? `Location granted · ${detectedState}`
        : 'Location access granted',
    },
    denied: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: <AlertCircle className="h-4 w-4 text-red-400" />,
      text: 'text-red-300',
      label: isSystemLocationDisabled
        ? 'Location is disabled on your device.'
        : 'Location permission was denied.',
    },
    unavailable: {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
      icon: <AlertCircle className="h-4 w-4 text-gray-400" />,
      text: 'text-gray-400',
      label: 'Your browser does not support geolocation.',
    },
    prompt: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: <MapPin className="h-4 w-4 text-amber-400" />,
      text: 'text-amber-300',
      label: 'Enable location to discover properties near you.',
    },
  };

  const current = statusVariants[permissionState] ?? statusVariants.prompt;

  return (
    <div className="space-y-3">
      <div
        className={`flex items-start gap-3 rounded-xl border p-3.5 ${current.bg} ${current.border}`}
      >
        <div className="mt-0.5 shrink-0">{current.icon}</div>
        <p className={`text-[13px] font-medium leading-snug ${current.text}`}>
          {current.label}
        </p>
      </div>

      {(permissionState === 'prompt' || permissionState === 'denied') && (
        <div className="flex gap-2">
          <button
            onClick={handleRequestLocation}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all duration-150 shadow-lg shadow-amber-500/20"
          >
            <MapPin className="h-3.5 w-3.5" />
            {permissionState === 'denied' ? 'Try Again' : 'Enable Location'}
          </button>
          {permissionState === 'denied' && (
            <button
              onClick={handleOpenLocationSettings}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] px-4 py-2.5 text-xs font-semibold text-white/50 hover:text-white/70 transition-all duration-150"
            >
              Open Settings
            </button>
          )}
          {permissionState === 'prompt' && (
            <button className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] px-4 py-2.5 text-xs font-semibold text-white/50 hover:text-white/70 transition-all duration-150">
              Browse All
            </button>
          )}
        </div>
      )}

      {isSystemLocationDisabled && permissionState === 'denied' && (
        <button
          onClick={handleOpenLocationSettings}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] px-4 py-2.5 text-xs font-semibold text-white/50 hover:text-white/70 transition-all duration-150"
        >
          View Device Settings
        </button>
      )}
    </div>
  );
}
