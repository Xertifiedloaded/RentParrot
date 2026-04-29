import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search');
    const state = searchParams.get('state');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '5';

    let properties;

    if (lat && lng) {
      const latF = parseFloat(lat);
      const lngF = parseFloat(lng);
      const rad = parseFloat(radius) / 111;

      properties = await prisma.property.findMany({
        where: {
          latitude: { gte: latF - rad, lte: latF + rad },
          longitude: { gte: lngF - rad, lte: lngF + rad },
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { town: { contains: search, mode: 'insensitive' } },
              { community: { contains: search, mode: 'insensitive' } },
              { nearestBusStop: { contains: search, mode: 'insensitive' } },
              { postalCode: { contains: search, mode: 'insensitive' } },
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
            { state: { contains: search, mode: 'insensitive' } },
            { town: { contains: search, mode: 'insensitive' } },
            { community: { contains: search, mode: 'insensitive' } },
            { nearestBusStop: { contains: search, mode: 'insensitive' } },
            { postalCode: { contains: search, mode: 'insensitive' } },
          ],
        },
        include: {
          user: { select: { id: true, email: true, name: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (state) {
      const normalizedState = decodeURIComponent(state)
        .replace(/\s*State$/i, '')
        .trim();

      properties = await prisma.property.findMany({
        where: { state: { contains: normalizedState, mode: 'insensitive' } },
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let fields: Record<string, string> = {};
    let imageFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      for (const [key, value] of Array.from(formData.entries())) {
        if (key === 'image' && value instanceof File && value.size > 0) {
          imageFile = value;
        } else if (typeof value === 'string') {
          fields[key] = value;
        }
      }
    } else {
      fields = await request.json();
    }

    const { name, address, town, community, nearestBusStop, postalCode, state, latitude, longitude, description } =
      fields;

    if (!name || !address || !town || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Name, address, town, latitude, and longitude are required' }, { status: 400 });
    }

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (imageFile) {
      const file = imageFile as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadImage(buffer, file.name);

      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    const property = await prisma.property.create({
      data: {
        name,
        address,
        town,
        community: community || null,
        nearestBusStop: nearestBusStop || null,
        postalCode: postalCode || null,
        state: state || 'Lagos',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description || null,
        imageUrl,
        imagePublicId,
        userId: authUser.userId,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
