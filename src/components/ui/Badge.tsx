'use client';

import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

// 변형별 스타일
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-100 text-surface-600',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

// 점 색상
const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-500',
  primary: 'bg-primary-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

// 크기별 스타일
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

/**
 * 배지 컴포넌트
 * - 상태 표시에 사용
 * - 점(dot) 표시 옵션
 */
export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            dotStyles[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}

/**
 * 상태 배지 - 기사 상태 표시용
 */
interface StatusBadgeProps {
  status: 'draft' | 'review' | 'published' | 'scheduled';
  className?: string;
}

const statusConfig: Record<StatusBadgeProps['status'], { label: string; variant: BadgeVariant }> = {
  draft: { label: '초안', variant: 'default' },
  review: { label: '검토중', variant: 'warning' },
  published: { label: '발행됨', variant: 'success' },
  scheduled: { label: '예약됨', variant: 'info' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
}

