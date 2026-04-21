import { Suspense } from 'react';
import PostReviewContent from './PostReviewContent';

export default function PostReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="loader-wrap">
          <div className="loader" />
        </div>
      }
    >
      <PostReviewContent />
    </Suspense>
  );
}
