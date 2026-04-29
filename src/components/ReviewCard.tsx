import { CATEGORY_TAILWIND, Review } from '@/types';
import { CATEGORY_LABELS, NEGATIVE_CATEGORIES } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock3 } from 'lucide-react';

export default function ReviewCard({ review }: { review: Review }) {
  const categories = review.categories ?? [];
  const hasNegative = categories.some((c) => NEGATIVE_CATEGORIES.includes(c));

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:shadow-lg ${
        hasNegative
          ? 'border-red-500/20 bg-red-500/5'
          : 'border-emerald-500/20 bg-emerald-500/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                CATEGORY_TAILWIND[cat] ||
                'bg-white/10 text-white border border-white/10'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-white/65 whitespace-nowrap">
          <Clock3 size={12} />
          {formatDistanceToNow(new Date(review.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>

      <p className="text-sm sm:text-[15px] leading-6 text-white/90">
        {review.comment}
      </p>

      <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              hasNegative ? 'bg-red-500/15' : 'bg-emerald-500/15'
            }`}
          >
            {hasNegative ? (
              <AlertCircle size={15} className="text-red-400" />
            ) : (
              <CheckCircle2 size={15} className="text-emerald-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {review.user?.name || 'Anonymous'}
            </p>
            <p className="text-[11px] text-white/55">Tenant Review</p>
          </div>
        </div>

        <div
          className={`h-2.5 w-2.5 rounded-full ${
            hasNegative ? 'bg-red-400' : 'bg-emerald-400'
          }`}
        />
      </div>
    </div>
  );
}
