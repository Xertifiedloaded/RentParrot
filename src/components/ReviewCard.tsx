import { CATEGORY_TAILWIND, Review } from '@/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, NEGATIVE_CATEGORIES } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewCard({ review }: { review: Review }) {
  const categories = review.categories ?? [];
  const hasNegative = categories.some((c) => NEGATIVE_CATEGORIES.includes(c));

  return (
    <div
      className={`rounded-xl px-5 py-4 ring-1 transition-all hover:brightness-110 ${
        hasNegative
          ? 'bg-red-500/4 ring-red-500/15'
          : 'bg-emerald-500/4 ring-emerald-500/15'
      }`}
    >
      {/* Header: categories + time */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                CATEGORY_TAILWIND[cat] ??
                'bg-white/5 text-white/30 ring-1 ring-white/10'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-white/20">
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Comment */}
      <p className="text-sm leading-relaxed text-white/55">{review.comment}</p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white/25">
          — {review.user?.name || 'Anonymous'}
        </span>
        <span
          className={`h-1.5 w-1.5 rounded-full ${hasNegative ? 'bg-red-500/40' : 'bg-emerald-500/40'}`}
        />
      </div>
    </div>
  );
}
