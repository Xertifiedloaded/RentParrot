import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    if (property.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.review.deleteMany({ where: { propertyId: params.id } });
    await prisma.property.delete({ where: { id: params.id } });

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
