import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const NEGATIVE_CATEGORIES = [
  'BAD_ELECTRICITY',
  'BAD_WATER',
  'BAD_LANDLORD',
  'UNFAIR_RENT_INCREASE',
  'POOR_SANITATION',
  'BAD_ROAD',
  'POOR_NETWORK',
];

const CATEGORY_WEIGHTS: Record<string, number> = {
  BAD_ELECTRICITY: 1.5,
  BAD_WATER: 1.5,
  BAD_LANDLORD: 2.0,
  UNFAIR_RENT_INCREASE: 1.8,
  POOR_SANITATION: 1.3,
  BAD_ROAD: 1.0,
  POOR_NETWORK: 1.0,
};

export async function GET() {
  try {
    const negativeReviews = await prisma.review.findMany({
      where: {
        category: { in: NEGATIVE_CATEGORIES as any[] },
      },
      include: {
        property: { select: { latitude: true, longitude: true } },
      },
    });

    const heatmapPoints = negativeReviews.map((review) => ({
      lat: review.property.latitude,
      lng: review.property.longitude,
      weight: CATEGORY_WEIGHTS[review.category] || 1.0,
    }));

    return NextResponse.json({ points: heatmapPoints });
  } catch (error) {
    console.error('Heatmap error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
