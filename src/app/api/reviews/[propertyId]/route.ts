import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { propertyId: string } },
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { propertyId: params.propertyId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
