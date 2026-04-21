import { Review } from '@/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, NEGATIVE_CATEGORIES } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewCard({ review }: { review: Review }) {
  const isNegative = NEGATIVE_CATEGORIES.includes(review.category);
  const color = CATEGORY_COLORS[review.category];
  const label = CATEGORY_LABELS[review.category];

  return (
    <div
      className={`review-card ${isNegative ? 'review-negative' : 'review-positive'}`}
    >
      <div className="review-header">
        <span
          className="review-badge"
          style={{ background: color + '22', color, borderColor: color + '44' }}
        >
          {label}
        </span>
        <span className="review-time">
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="review-comment">{review.comment}</p>
      <div className="review-footer">
        <span className="review-author">
          — {review.user?.name || 'Anonymous'}
        </span>
      </div>
    </div>
  );
}
