import type { ReactNode } from 'react';
export type Category =
  | 'GOOD_ELECTRICITY'
  | 'BAD_ELECTRICITY'
  | 'GOOD_WATER'
  | 'BAD_WATER'
  | 'GOOD_LANDLORD'
  | 'BAD_LANDLORD'
  | 'UNFAIR_RENT_INCREASE'
  | 'POOR_SANITATION'
  | 'BAD_ROAD'
  | 'POOR_NETWORK'
  | 'OTHER';

export const NEGATIVE_CATEGORIES: Category[] = [
  'BAD_ELECTRICITY',
  'BAD_WATER',
  'BAD_LANDLORD',
  'UNFAIR_RENT_INCREASE',
  'POOR_SANITATION',
  'BAD_ROAD',
  'POOR_NETWORK',
];

export const POSITIVE_CATEGORIES: Category[] = [
  'GOOD_ELECTRICITY',
  'GOOD_WATER',
  'GOOD_LANDLORD',
];

export const CATEGORY_LABELS: Record<Category, string> = {
  GOOD_ELECTRICITY: '✅ Good Electricity',
  BAD_ELECTRICITY: '⚡ Bad Electricity',
  GOOD_WATER: '💧 Good Water',
  BAD_WATER: '🚱 Bad Water',
  GOOD_LANDLORD: '👍 Good Landlord',
  BAD_LANDLORD: '👎 Bad Landlord',
  UNFAIR_RENT_INCREASE: '💸 Unfair Rent Increase',
  POOR_SANITATION: '🗑️ Poor Sanitation',
  BAD_ROAD: '🚧 Bad Road',
  POOR_NETWORK: '📵 Poor Network',
  OTHER: '💬 Other',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  GOOD_ELECTRICITY: '#22c55e',
  BAD_ELECTRICITY: '#ef4444',
  GOOD_WATER: '#3b82f6',
  BAD_WATER: '#f97316',
  GOOD_LANDLORD: '#10b981',
  BAD_LANDLORD: '#dc2626',
  UNFAIR_RENT_INCREASE: '#f59e0b',
  POOR_SANITATION: '#8b5cf6',
  BAD_ROAD: '#78716c',
  POOR_NETWORK: '#6b7280',
  OTHER: '#94a3b8',
};

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  town?: string;
  community?: string;
  nearestBusStop?: string;
  postalCode?: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  createdAt: string;
  user?: { id: string; email: string; name: string };
  reviews?: Review[];
  _count?: { reviews: number };
}

export interface Review {
  id: string;
  categories: Category[];
  comment: string;
  createdAt: string;
  user?: { id: string; name: string };
  property?: { id: string; name: string; address: string };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export interface Step {
  n: string;
  title: string;
  desc: string;
  icon: ReactNode;
}

export interface Testimonial {
  initials: string;
  name: string;
  area: string;
  tenure: string;
  stars: number;
  text: string;
  tag: string;
  accent: string;
}

export interface MapProps {
  properties?: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (property: Property) => void;
  onMapClick?: (lat: number, lng: number, state?: string) => void;
  userLocation?: { lat: number; lng: number };
  showHeatmap?: boolean;
  singleProperty?: Property;
}

export const CATEGORY_TAILWIND: Record<string, string> = {
  noise: 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20',
  security: 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20',
  landlord: 'bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20',
  infrastructure: 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20',
  flooding: 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20',
};

export type Tab = 'all' | 'positive' | 'negative';
export type PermissionState =
  | 'loading'
  | 'prompt'
  | 'granted'
  | 'denied'
  | 'unavailable';
export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmReset: (token: string, password: string) => Promise<void>;
}

export interface Props {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export type LocationState = 'prompt' | 'requesting' | 'granted' | 'denied';

export const LISTING_TYPE_COLORS: Record<string, string> = {
  Rent: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  Sale: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  Shortlet: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
};
