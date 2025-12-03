'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * 재사용 가능한 입력 필드 컴포넌트
 * - 라벨, 에러 메시지, 힌트 텍스트 지원
 * - 좌/우 아이콘 지원
 * - 다양한 입력 타입 지원
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    // 고유 ID 생성 (라벨 연결용)
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* 라벨 */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-700"
          >
            {label}
          </label>
        )}

        {/* 입력 필드 래퍼 */}
        <div className="relative">
          {/* 왼쪽 아이콘 */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
              {leftIcon}
            </span>
          )}

          {/* 입력 필드 */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // 기본 스타일
              'w-full px-4 py-2.5 text-sm rounded-lg',
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
              // 아이콘 패딩
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {/* 오른쪽 아이콘 */}
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
              {rightIcon}
            </span>
          )}
        </div>

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

Input.displayName = 'Input';

