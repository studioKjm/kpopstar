'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

/**
 * 재사용 가능한 셀렉트 컴포넌트
 * - 라벨, 에러 메시지, 힌트 텍스트 지원
 * - 커스텀 드롭다운 아이콘
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      placeholder = '선택하세요',
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* 라벨 */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-surface-700"
          >
            {label}
          </label>
        )}

        {/* 셀렉트 래퍼 */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              // 기본 스타일
              'w-full px-4 py-2.5 text-sm rounded-lg appearance-none',
              'bg-white border border-surface-200',
              'text-surface-900',
              // 포커스 스타일
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              // 트랜지션
              'transition-all duration-200',
              // 에러 스타일
              error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
              // 비활성화 스타일
              'disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed',
              // 오른쪽 패딩 (아이콘용)
              'pr-10',
              className
            )}
            {...props}
          >
            {/* 플레이스홀더 옵션 */}
            <option value="" disabled>
              {placeholder}
            </option>
            
            {/* 옵션 목록 */}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* 드롭다운 아이콘 */}
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
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

Select.displayName = 'Select';

