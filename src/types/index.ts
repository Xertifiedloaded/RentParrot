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
  state: string;       
  latitude: number;
  longitude: number;
  description?: string;
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
  userId: string;
  email: string;
  name: string;
}
