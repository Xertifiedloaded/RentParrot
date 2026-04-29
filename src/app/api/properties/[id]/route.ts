import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (existing.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Support multipart/form-data OR JSON
    const contentType = request.headers.get('content-type') || '';
    let fields: Record<string, string> = {};
    let imageFile: File | null = null;
    let removeImage = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      for (const [key, value] of Array.from(formData.entries())) {
        if (key === 'image' && value instanceof File && value.size > 0) {
          imageFile = value;
        } else if (key === 'removeImage' && value === 'true') {
          removeImage = true;
        } else if (typeof value === 'string') {
          fields[key] = value;
        }
      }
    } else {
      const body = await request.json();
      removeImage = body.removeImage === true;
      fields = body;
    }

    // Handle image changes
    let imageUrl = existing.imageUrl;
    let imagePublicId = existing.imagePublicId;

    if (removeImage && existing.imagePublicId) {
      await cloudinary.uploader.destroy(existing.imagePublicId);
      imageUrl = null;
      imagePublicId = null;
    } else if (imageFile) {
      if (existing.imagePublicId) {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      }

      const file = imageFile as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadImage(buffer, file.name);

      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    const updated = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...(fields.name && { name: fields.name }),
        ...(fields.address && { address: fields.address }),
        ...(fields.town && { town: fields.town }),
        ...('community' in fields && { community: fields.community || null }),
        ...('nearestBusStop' in fields && {
          nearestBusStop: fields.nearestBusStop || null,
        }),
        ...('postalCode' in fields && {
          postalCode: fields.postalCode || null,
        }),
        ...(fields.state && { state: fields.state }),
        ...(fields.latitude && { latitude: parseFloat(fields.latitude) }),
        ...(fields.longitude && { longitude: parseFloat(fields.longitude) }),
        ...('description' in fields && {
          description: fields.description || null,
        }),
        imageUrl,
        imagePublicId,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json({ property: updated });
  } catch (error) {
    console.error('Patch property error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (property.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Clean up Cloudinary image
    if (property.imagePublicId) {
      await cloudinary.uploader.destroy(property.imagePublicId);
    }

    await prisma.review.deleteMany({
      where: { propertyId: params.id },
    });

    await prisma.property.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
