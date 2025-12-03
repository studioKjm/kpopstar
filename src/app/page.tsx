'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 루트 페이지 - 기사 목록으로 리다이렉트
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/articles');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </div>
        <p className="text-surface-500">NewsFlow AI Console 로딩 중...</p>
      </div>
    </div>
  );
}

