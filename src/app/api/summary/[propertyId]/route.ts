import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';

const NEGATIVE_CATEGORIES = new Set<Category>([
  Category.BAD_ELECTRICITY,
  Category.BAD_WATER,
  Category.BAD_LANDLORD,
  Category.UNFAIR_RENT_INCREASE,
  Category.POOR_SANITATION,
  Category.BAD_ROAD,
  Category.POOR_NETWORK,
]);

const POSITIVE_CATEGORIES = new Set<Category>([Category.GOOD_ELECTRICITY, Category.GOOD_WATER, Category.GOOD_LANDLORD]);

const CATEGORY_LABELS: Record<Category, string> = {
  GOOD_ELECTRICITY: 'stable electricity',
  BAD_ELECTRICITY: 'poor electricity',
  GOOD_WATER: 'good water supply',
  BAD_WATER: 'poor water supply',
  GOOD_LANDLORD: 'responsive landlord',
  BAD_LANDLORD: 'problematic landlord',
  UNFAIR_RENT_INCREASE: 'unfair rent increases',
  POOR_SANITATION: 'poor sanitation',
  BAD_ROAD: 'bad road access',
  POOR_NETWORK: 'poor network coverage',
  OTHER: 'other concerns',
};

export async function GET(_request: NextRequest, { params }: { params: { propertyId: string } }) {
  try {
    const reviews = await prisma.review.findMany({
      where: { propertyId: params.propertyId },
      select: { categories: true, comment: true },
    });

    if (reviews.length === 0) {
      return NextResponse.json({
        summary: 'No reviews yet. Be the first to share your experience with this property.',
      });
    }

    let positiveScore = 0;
    let negativeScore = 0;
    const positiveSeen = new Set<string>();
    const negativeSeen = new Set<string>();

    for (const review of reviews) {
      for (const cat of review.categories) {
        const label = CATEGORY_LABELS[cat];
        if (POSITIVE_CATEGORIES.has(cat)) {
          positiveScore++;
          positiveSeen.add(label);
        } else if (NEGATIVE_CATEGORIES.has(cat)) {
          negativeScore++;
          negativeSeen.add(label);
        }
      }
    }

    const total = positiveScore + negativeScore;
    const positiveRatio = total > 0 ? positiveScore / total : 0;

    let recommendation: string;
    if (negativeScore === 0 && positiveScore > 0) {
      recommendation = 'Tenants are largely satisfied — this property is worth considering.';
    } else if (positiveRatio >= 0.65) {
      recommendation = 'Despite some concerns, this property is generally well regarded.';
    } else if (positiveRatio >= 0.35) {
      recommendation = 'This property has mixed reviews — visit and inspect carefully before committing.';
    } else {
      recommendation = 'Most tenants report significant issues. Approach with caution or you can avoid this Apartment.';
    }

    const positives = [...positiveSeen].slice(0, 3).join(', ');
    const negatives = [...negativeSeen].slice(0, 3).join(', ');

    let summary: string;

    if (positives && negatives) {
      summary = `Tenants highlight ${positives} as positives, but report concerns around ${negatives}. ${recommendation}`;
    } else if (negatives && !positives) {
      summary = `Tenants report concerns around ${negatives} with no standout positives mentioned. ${recommendation}`;
    } else if (positives && !negatives) {
      summary = `Tenants consistently praise ${positives} with no major complaints reported. ${recommendation}`;
    } else {
      summary = `This property has ${reviews.length} review(s) with general feedback. ${recommendation}`;
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Review summary error:', error);
    return NextResponse.json({
      summary: 'Summary could not be generated at this time. Please check the reviews manually.',
    });
  }
}
