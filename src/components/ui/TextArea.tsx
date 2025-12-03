'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

/**
 * 재사용 가능한 텍스트 영역 컴포넌트
 * - 라벨, 에러 메시지, 힌트 텍스트 지원
 * - 글자 수 카운터 지원
 * - 자동 높이 조절 가능
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      fullWidth = true,
      showCount = false,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* 라벨 및 글자 수 */}
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-surface-700"
            >
              {label}
            </label>
          )}
          
          {showCount && maxLength && (
            <span className={cn(
              'text-xs',
              currentLength > maxLength ? 'text-red-500' : 'text-surface-400'
            )}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>

        {/* 텍스트 영역 */}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={cn(
            // 기본 스타일
            'w-full px-4 py-3 text-sm rounded-lg resize-y min-h-[120px]',
            'bg-white border border-surface-200',
            'text-surface-900 placeholder:text-surface-400',
            // 포커스 스타일
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            // 트랜지션
            'transition-all duration-200',
            // 에러 스타일
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            // 비활성화 스타일
            'disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />

        {/* 에러 메시지 */}
        {error && (
          <p className="text-sm text-red-500 animate-fade-in">{error}</p>
        )}

        {/* 힌트 텍스트 */}
        {hint && !error && (
          <p className="text-sm text-surface-500">{hint}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

