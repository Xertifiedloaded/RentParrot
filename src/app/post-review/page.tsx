import { Suspense } from 'react';
import PostReviewContent from './PostReviewContent';

export default function PostReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#0c0f14]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-amber-500" />
        </div>
      }
    >
      <PostReviewContent />
    </Suspense>
  );
}
