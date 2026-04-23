import { Review } from '@/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, NEGATIVE_CATEGORIES } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewCard({ review }: { review: Review }) {
  const categories = review.categories ?? [];
  const hasNegative = categories.some((c) => NEGATIVE_CATEGORIES.includes(c));

  return (
    <div className={`review-card ${hasNegative ? 'review-negative' : 'review-positive'}`}>
      <div className="review-header" style={{ flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
          {categories.map((cat) => (
            <span
              key={cat}
              className="review-badge"
              style={{
                background: CATEGORY_COLORS[cat] + '22',
                color: CATEGORY_COLORS[cat],
                borderColor: CATEGORY_COLORS[cat] + '44',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>
        <span className="review-time">
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="review-comment">{review.comment}</p>
      <div className="review-footer">
        <span className="review-author">— {review.user?.name || 'Anonymous'}</span>
      </div>
    </div>
  );
}