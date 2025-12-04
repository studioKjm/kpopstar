'use client';

import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PanelProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'elevated';
}

// 패딩 스타일
const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

// 변형 스타일
const variantStyles = {
  default: 'bg-white',
  bordered: 'bg-white border border-surface-200',
  elevated: 'bg-white shadow-lg shadow-surface-200/50',
};

/**
 * 패널 컴포넌트
 * - 콘텐츠를 감싸는 카드 형태의 컨테이너
 */
export function Panel({
  children,
  className,
  padding = 'md',
  variant = 'bordered',
}: PanelProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        paddingStyles[padding],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 패널 헤더 컴포넌트
 */
interface PanelHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PanelHeader({
  title,
  description,
  action,
  className,
}: PanelHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-surface-500">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/**
 * 패널 섹션 컴포넌트
 * - 패널 내부를 구분할 때 사용
 */
interface PanelSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function PanelSection({
  children,
  title,
  className,
}: PanelSectionProps) {
  return (
    <div className={cn('py-4 border-t border-surface-100 first:border-t-0 first:pt-0', className)}>
      {title && (
        <h3 className="text-sm font-medium text-surface-700 mb-3">{title}</h3>
      )}
      {children}
    </div>
  );
}

/**
 * 접을 수 있는 패널 컴포넌트
 */
interface CollapsiblePanelProps {
  children: ReactNode;
  title: string;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsiblePanel({
  children,
  title,
  defaultOpen = false,
  className,
}: CollapsiblePanelProps) {
  return (
    <Panel className={cn('overflow-hidden', className)}>
      <details open={defaultOpen} className="group">
        <summary
          className={cn(
            'flex items-center justify-between cursor-pointer',
            'list-none [&::-webkit-details-marker]:hidden',
            '-m-6 p-6 mb-0'
          )}
        >
          <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
          <svg
            className="w-5 h-5 text-surface-500 transition-transform group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-6">
          {children}
        </div>
      </details>
    </Panel>
  );
}

