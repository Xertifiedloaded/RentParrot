import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const userId = searchParams.get('id');

    const reviews = await prisma.review.findMany({
      where: {
        ...(propertyId && { propertyId }),
        ...(userId && { userId }),
      },
      include: {
        user: { select: { id: true, name: true } },
        property: { select: { id: true, name: true, address: true } },
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

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, categories, comment } = body;

    if (!propertyId || !categories?.length || !comment) {
      return NextResponse.json(
        {
          error: 'Property ID, at least one category, and comment are required',
        },
        { status: 400 },
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    const review = await prisma.review.create({
      data: {
        categories, // ← store the whole array
        comment,
        userId: authUser.userId,
        propertyId,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
