import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { HomeIcon, MapPin, Star, ArrowUpRight } from 'lucide-react';

const FONT_MONO = "'Instrument Mono', 'JetBrains Mono', monospace";

export default function PropertyCard({ property }: { property: Property }) {
  const reviewCount = property._count?.reviews ?? property.reviews?.length ?? 0;
  const imageUrl = (property as any).imageUrl as string | null | undefined;
  const state = (property as any).state as string | undefined;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group relative flex flex-col bg-[#0d0f13] border border-white/[0.07] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40"
    >
      <div
        className="relative w-full overflow-hidden bg-[#111318]"
        style={{ aspectRatio: '4/3' }}
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0d0f13] via-transparent to-transparent opacity-70" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <HomeIcon size={28} className="text-white/10" strokeWidth={1.5} />
            <span
              className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/10"
              style={{ fontFamily: FONT_MONO }}
            >
              No photo
            </span>
          </div>
        )}

        {state && (
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] uppercase text-white/50"
              style={{ fontFamily: FONT_MONO }}
            >
              <MapPin size={7} className="text-amber-400" />
              {state}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
          <span
            className="text-[9px] font-bold tracking-[0.12em] text-white/40"
            style={{ fontFamily: FONT_MONO }}
          >
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-bold text-white/85 leading-snug truncate group-hover:text-amber-400 transition-colors duration-200">
              {property.name}
            </h3>
            <p className="mt-1 capitalize flex items-center gap-1 text-[11px] text-white/25 truncate">
              <MapPin size={9} className="shrink-0 text-white/20" />
              {property.address}
            </p>
          </div>
          <div className="shrink-0 w-7 h-7 rounded-xl bg-white/4 border border-white/[0.07] flex items-center justify-center group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all duration-200">
            <ArrowUpRight
              size={12}
              className="text-white/20 group-hover:text-amber-400 transition-colors duration-200"
            />
          </div>
        </div>

        {property.description && (
          <p className="text-[11px] text-white/25 leading-relaxed line-clamp-2 flex-1">
            {property.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={9}
                className={
                  s <= Math.min(Math.ceil(reviewCount / 3), 5) &&
                  reviewCount > 0
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-white/[0.08]'
                }
              />
            ))}
          </div>
          <span
            className="text-[10px] text-white/20"
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
