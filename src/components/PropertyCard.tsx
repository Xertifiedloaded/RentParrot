import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { HomeIcon, MapPin, Star, ArrowUpRight } from 'lucide-react';

const FONT_MONO =
  "'Instrument Mono', 'JetBrains Mono', monospace";

export default function PropertyCard({
  property,
}: {
  property: Property;
}) {
  const reviewCount =
    property._count?.reviews ??
    property.reviews?.length ??
    0;

  const imageUrl = (property as any).imageUrl as string | null;
  const state = (property as any).state as string | undefined;

  const rating =
    reviewCount > 0
      ? Math.min(Math.ceil(reviewCount / 3), 5)
      : 0;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/50 bg-[#0B0C0F] transition-all duration-300  hover:-translate-y-0.5"
    >
      <div
        className="relative w-full bg-[#0f1116]"
        style={{ aspectRatio: '4/3' }}
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />

            <div className="absolute inset-0 bg-linear-to-t from-[#0B0C0F] via-transparent to-transparent opacity-80" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-b border-white/5">
            <HomeIcon className="text-white" size={50} />
            <span
              className="text-[10px] tracking-widest text-white/10 uppercase"
              style={{ fontFamily: FONT_MONO }}
            >
              No image
            </span>
          </div>
        )}

        {state && (
          <div className="absolute top-3 left-3">
            <div
              className="flex items-center gap-1 rounded-full border border-white/10  px-2.5 py-1 text-[10px] text-white backdrop-blur-md"
              style={{ fontFamily: FONT_MONO }}
            >
              <MapPin size={10} className="text-amber-400" />
              {state}
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span
            className="text-[10px] text-white/60"
            style={{ fontFamily: FONT_MONO }}
          >
            {reviewCount} reviews
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-3 p-4">
        {/* TITLE */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
              {property.name}
            </h3>

            <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-white capitalize">
              <MapPin size={10} className="text-white" />
              {property.address}
            </p>
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/5 bg-white/5 transition group-hover:border-white/20 group-hover:bg-white/10">
            <ArrowUpRight
              size={12}
              className="text-white/40 group-hover:text-white"
            />
          </div>
        </div>

        {property.description && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-white">
            {property.description}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-white'
                }
              />
            ))}
          </div>

          <span
            className="text-[10px] text-white"
            style={{ fontFamily: FONT_MONO }}
          >
            {formatDistanceToNow(new Date(property.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}