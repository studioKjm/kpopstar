'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

// 버튼 변형 타입
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// 변형별 스타일 정의
const variantStyles: Record<ButtonVariant, string> = {
  primary: 
    'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-md hover:shadow-lg',
  secondary: 
    'bg-surface-100 text-surface-700 hover:bg-surface-200 border border-surface-200',
  outline: 
    'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
  ghost: 
    'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
  danger: 
    'bg-red-500 text-white hover:bg-red-600 shadow-md',
};

// 크기별 스타일 정의
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

/**
 * 재사용 가능한 버튼 컴포넌트
 * - 다양한 변형(primary, secondary, outline, ghost, danger) 지원
 * - 크기 조절 가능 (sm, md, lg)
 * - 로딩 상태 지원
 * - 아이콘 삽입 지원 (좌/우)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // 기본 스타일
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          // 비활성화 스타일
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // 변형 및 크기 스타일
          variantStyles[variant],
          sizeStyles[size],
          // 전체 너비
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {/* 로딩 스피너 또는 왼쪽 아이콘 */}
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        
        {/* 버튼 텍스트 */}
        {children}
        
        {/* 오른쪽 아이콘 */}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

