'use client';

import { useEffect, useState } from 'react';
import { MapPin, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useUserLocation } from '@/hooks/useUserLocation';

type PermissionState = 'loading' | 'prompt' | 'granted' | 'denied' | 'unavailable';

export function LocationPermission() {
  const { detectedState } = useUserLocation();
  const [permissionState, setPermissionState] = useState<PermissionState>('loading');
  const [isSystemLocationDisabled, setIsSystemLocationDisabled] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionState('unavailable');
      setIsSystemLocationDisabled(true);
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((permResult) => {
        setPermissionState(permResult.state as PermissionState);

        permResult.onchange = () => {
          setPermissionState(permResult.state as PermissionState);
        };
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
        { timeout: 5000 }
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
      { timeout: 10000 }
    );
  };

  const handleOpenLocationSettings = () => {
    const isMobile = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);

    alert(
      isMobile
        ? 'Enable location:\n\niOS: Settings > Privacy > Location Services\nAndroid: Settings > Apps > Permissions > Location'
        : 'Enable location:\n\nWindows: Settings > Privacy > Location\nmacOS: System Preferences > Security & Privacy > Location Services'
    );
  };

  const AlertBox = ({
    icon,
    text,
    bg,
    border,
    color,
  }: {
    icon: React.ReactNode;
    text: React.ReactNode;
    bg: string;
    border: string;
    color: string;
  }) => (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${bg} ${border}`}>
      <div className={color}>{icon}</div>
      <div className={`text-sm ${color}`}>{text}</div>
    </div>
  );

  if (permissionState === 'loading') {
    return (
      <AlertBox
        icon={<Loader className="h-4 w-4 animate-spin" />}
        text="Requesting location permission..."
        bg="bg-blue-50"
        border="border-blue-200"
        color="text-blue-700"
      />
    );
  }

  if (permissionState === 'granted') {
    return (
      <AlertBox
        icon={<CheckCircle className="h-4 w-4" />}
        text={
          <>
            ✓ Location access granted.
            {detectedState && ` You are in ${detectedState}.`}
          </>
        }
        bg="bg-green-50"
        border="border-green-200"
        color="text-green-700"
      />
    );
  }

  if (isSystemLocationDisabled) {
    return (
      <div className="space-y-3">
        <AlertBox
          icon={<AlertCircle className="h-4 w-4" />}
          text="Location is disabled on your device."
          bg="bg-red-50"
          border="border-red-200"
          color="text-red-700"
        />
        <div className="flex gap-2">
          <button
            onClick={handleOpenLocationSettings}
            className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-red-600"
          >
            View Settings
          </button>
          <button className="flex-1 rounded-lg border px-4 py-2">Browse All</button>
        </div>
      </div>
    );
  }

  if (permissionState === 'denied') {
    return (
      <div className="space-y-3">
        <AlertBox
          icon={<AlertCircle className="h-4 w-4" />}
          text="Location permission was denied."
          bg="bg-orange-50"
          border="border-orange-200"
          color="text-orange-700"
        />
        <div className="flex gap-2">
          <button
            onClick={handleRequestLocation}
            className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Try Again
          </button>
          <button
            onClick={handleOpenLocationSettings}
            className="flex-1 rounded-lg border border-orange-300 px-4 py-2 text-orange-600"
          >
            Enable in Settings
          </button>
        </div>
      </div>
    );
  }

  if (permissionState === 'unavailable') {
    return (
      <AlertBox
        icon={<AlertCircle className="h-4 w-4" />}
        text="Your browser does not support geolocation."
        bg="bg-gray-50"
        border="border-gray-200"
        color="text-gray-700"
      />
    );
  }

  return (
    <div className="space-y-3">
      <AlertBox
        icon={<MapPin className="h-4 w-4" />}
        text="Enable location access to discover properties near you."
        bg="bg-blue-50"
        border="border-blue-200"
        color="text-blue-700"
      />
      <div className="flex gap-2">
        <button
          onClick={handleRequestLocation}
          className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </button>
        <button className="flex-1 rounded-lg border px-4 py-2">Browse All</button>
      </div>
    </div>
  );
}