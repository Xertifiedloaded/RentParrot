import Link from 'next/link';
import { Property } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function PropertyCard({ property }: { property: Property }) {
  const reviewCount = property._count?.reviews ?? property.reviews?.length ?? 0;

  return (
    <Link href={`/properties/${property.id}`} className="property-card">
      <div className="property-card-header">
        <div className="property-icon">🏢</div>
        <div className="property-meta">
          <h3>{property.name}</h3>
          <p className="property-address">📍 {property.address}</p>
          {(property as any).state && (
            <span
              style={{
                display: 'inline-block',
                marginTop: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--accent)',
                background: 'var(--accent-glow)',
                border: '1px solid rgba(232,93,4,0.2)',
                borderRadius: '4px',
                padding: '1px 7px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {(property as any).state}
            </span>
          )}
        </div>
      </div>
      {property.description && (
        <p className="property-description">{property.description}</p>
      )}
      <div className="property-card-footer">
        <span className="review-count">
          <span className="review-dot" />
          {reviewCount} review{reviewCount !== 1 ? 's' : ''}
        </span>
        <span className="property-date">
          {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}
        </span>
      </div>
    </Link>
  );
}