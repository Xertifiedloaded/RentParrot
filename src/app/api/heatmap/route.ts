import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';

const NEGATIVE_CATEGORIES: Category[] = [
  Category.BAD_ELECTRICITY,
  Category.BAD_WATER,
  Category.BAD_LANDLORD,
  Category.UNFAIR_RENT_INCREASE,
  Category.POOR_SANITATION,
  Category.BAD_ROAD,
  Category.POOR_NETWORK,
];

const CATEGORY_WEIGHTS: Partial<Record<Category, number>> = {
  [Category.BAD_ELECTRICITY]: 1.5,
  [Category.BAD_WATER]: 1.5,
  [Category.BAD_LANDLORD]: 2.0,
  [Category.UNFAIR_RENT_INCREASE]: 1.8,
  [Category.POOR_SANITATION]: 1.3,
  [Category.BAD_ROAD]: 1.0,
  [Category.POOR_NETWORK]: 1.0,
};

export async function GET() {
  try {
    const negativeReviews = await prisma.review.findMany({
      where: {
        categories: {
          hasSome: NEGATIVE_CATEGORIES,
        },
      },
      include: {
        property: { select: { latitude: true, longitude: true } },
      },
    });

    const heatmapPoints = negativeReviews.map((review) => {
      // Sum weights for all negative categories on this review
      const weight = review.categories.reduce((total, cat) => {
        return total + (CATEGORY_WEIGHTS[cat] ?? 0);
      }, 0);

      return {
        lat: review.property.latitude,
        lng: review.property.longitude,
        weight: weight || 1.0,
      };
    });

    return NextResponse.json({ points: heatmapPoints });
  } catch (error) {
    console.error('Heatmap error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
