import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { HomeIcon, MapPin } from 'lucide-react';

export default function PropertyCard({ property }: { property: Property }) {
  const reviewCount = property._count?.reviews ?? property.reviews?.length ?? 0;
  const imageUrl = (property as any).imageUrl as string | null | undefined;
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-[#222222] hover:bg-[#272727] border border-gray-800 hover:border-gray-600 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-black/30"
    >
      {imageUrl ? (
        <div
          className="relative w-full overflow-hidden bg-[#1a1a1a]"
          style={{ aspectRatio: '16/9' }}
        >
          <Image
            src={imageUrl}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center w-full bg-[#1e1e1e] border-b border-gray-800"
          style={{ aspectRatio: '16/9' }}
        >
          <HomeIcon size={32} className="text-gray-700" />
        </div>
      )}

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-orange-400 transition-colors duration-150">
              {property.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 capitalize text-xs text-gray-500 truncate">
              <MapPin size={12} /> {property.address}
            </p>
            {(property as any).state && (
              <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded px-2 py-0.5">
                {(property as any).state}
              </span>
            )}
          </div>

          <span className="shrink-0 text-gray-700 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all duration-150 mt-0.5 text-sm">
            →
          </span>
        </div>

        {property.description && (
          <p className="mt-3 text-xs text-gray-500 leading-relaxed line-clamp-2">
            {property.description}
          </p>
        )}

        <div className="mt-4 border-t border-gray-800" />

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-gray-600">
            {formatDistanceToNow(new Date(property.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
