// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

function kmToDegLat(km: number) {
  return km / 111.32;
}

function kmToDegLng(km: number, lat: number) {
  return km / (111.32 * Math.cos((lat * Math.PI) / 180));
}

// Common include shape – avoids repetition
const PROPERTY_INCLUDE = {
  user: { select: { id: true, email: true, name: true } },
  _count: { select: { reviews: true } },
} as const;


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim() || undefined;
    const state  = searchParams.get('state')?.trim()  || undefined;
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const radiusKm = parseFloat(searchParams.get('radius') || '5');
    if (latStr && lngStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);

      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return NextResponse.json(
          { error: 'Invalid lat/lng values.' },
          { status: 400 },
        );
      }

      const safeRadius = Math.min(Math.max(radiusKm, 0.5), 100); // clamp 0.5–100 km
      const dLat = kmToDegLat(safeRadius);
      const dLng = kmToDegLng(safeRadius, lat);

      const properties = await prisma.property.findMany({
        where: {
          latitude:  { gte: lat - dLat, lte: lat + dLat },
          longitude: { gte: lng - dLng, lte: lng + dLng },
          ...(search && {
            OR: [
              { name:          { contains: search, mode: 'insensitive' } },
              { address:       { contains: search, mode: 'insensitive' } },
              { town:          { contains: search, mode: 'insensitive' } },
              { community:     { contains: search, mode: 'insensitive' } },
              { nearestBusStop:{ contains: search, mode: 'insensitive' } },
              { postalCode:    { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
        include: PROPERTY_INCLUDE,
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ properties, source: 'location' });
    }

    // ── Text / keyword search ────────────────────────────────────────────
    if (search) {
      const properties = await prisma.property.findMany({
        where: {
          OR: [
            { name:          { contains: search, mode: 'insensitive' } },
            { address:       { contains: search, mode: 'insensitive' } },
            { state:         { contains: search, mode: 'insensitive' } },
            { town:          { contains: search, mode: 'insensitive' } },
            { community:     { contains: search, mode: 'insensitive' } },
            { nearestBusStop:{ contains: search, mode: 'insensitive' } },
            { postalCode:    { contains: search, mode: 'insensitive' } },
          ],
        },
        include: PROPERTY_INCLUDE,
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ properties, source: 'search' });
    }

    // ── State filter ─────────────────────────────────────────────────────
    if (state) {
      const normalizedState = decodeURIComponent(state)
        .replace(/\s*State$/i, '')
        .trim();

      const properties = await prisma.property.findMany({
        where: { state: { contains: normalizedState, mode: 'insensitive' } },
        include: PROPERTY_INCLUDE,
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ properties, source: 'state' });
    }

    // ── Default: latest 50 ───────────────────────────────────────────────
    const properties = await prisma.property.findMany({
      include: PROPERTY_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ properties, source: 'default' });
  } catch (error) {
    console.error('[GET /api/properties]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/properties ────────────────────────────────────────────────────

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

    const {
      name, address, town, community,
      nearestBusStop, postalCode, state,
      latitude, longitude, description,
    } = fields;

    if (!name || !address || !town || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Name, address, town, latitude, and longitude are required.' },
        { status: 400 },
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'latitude and longitude must be valid numbers.' },
        { status: 400 },
      );
    }

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploaded = await uploadImage(buffer, imageFile.name);
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    const property = await prisma.property.create({
      data: {
        name,
        address,
        town,
        community:     community     || null,
        nearestBusStop:nearestBusStop || null,
        postalCode:    postalCode    || null,
        state:         state         || 'Lagos',
        latitude:      lat,
        longitude:     lng,
        description:   description   || null,
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
    console.error('[POST /api/properties]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}