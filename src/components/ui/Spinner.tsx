'use client';

import { cn } from '@/utils/cn';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
};

/**
 * 로딩 스피너 컴포넌트
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full border-primary-500 border-t-transparent animate-spin',
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label="로딩 중"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

/**
 * 전체 화면 로딩 오버레이
 */
interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = '로딩 중...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-surface-600">{message}</p>
      </div>
    </div>
  );
}

/**
 * 인라인 로딩 표시
 */
interface InlineLoaderProps {
  message?: string;
  className?: string;
}

export function InlineLoader({ message, className }: InlineLoaderProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner size="sm" />
      {message && <span className="text-sm text-surface-500">{message}</span>}
    </div>
  );
}

