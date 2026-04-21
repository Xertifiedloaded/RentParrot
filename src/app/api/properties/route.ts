import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '5';

    let properties;

    if (lat && lng) {
      const latF = parseFloat(lat);
      const lngF = parseFloat(lng);
      const rad = parseFloat(radius) / 111; // rough km to degrees

      properties = await prisma.property.findMany({
        where: {
          latitude: { gte: latF - rad, lte: latF + rad },
          longitude: { gte: lngF - rad, lte: lngF + rad },
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          user: { select: { id: true, email: true, name: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (search) {
      properties = await prisma.property.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
          ],
        },
        include: {
          user: { select: { id: true, email: true, name: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      properties = await prisma.property.findMany({
        include: {
          user: { select: { id: true, email: true, name: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Get properties error:', error);
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
    const { name, address, latitude, longitude, description } = body;

    if (
      !name ||
      !address ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return NextResponse.json(
        { error: 'Name, address, latitude, and longitude are required' },
        { status: 400 },
      );
    }

    const property = await prisma.property.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description,
        userId: authUser.userId,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
