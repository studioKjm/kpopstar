'use client';

import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type TagSize = 'sm' | 'md' | 'lg';

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

// 변형별 스타일
const variantStyles: Record<TagVariant, string> = {
  default: 'bg-surface-100 text-surface-700 hover:bg-surface-200',
  primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
  success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  warning: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  danger: 'bg-red-100 text-red-700 hover:bg-red-200',
  info: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
};

// 크기별 스타일
const sizeStyles: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

/**
 * 태그 컴포넌트
 * - 다양한 색상 변형 지원
 * - 삭제 가능한 태그 지원
 * - 클릭 가능한 태그 지원
 */
export function Tag({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  onClick,
  className,
  icon,
}: TagProps) {
  const isClickable = !!onClick;

  return (
    <span
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        // 기본 스타일
        'inline-flex items-center font-medium rounded-full',
        'transition-all duration-200',
        // 변형 및 크기
        variantStyles[variant],
        sizeStyles[size],
        // 클릭 가능 스타일
        isClickable && 'cursor-pointer',
        className
      )}
    >
      {/* 아이콘 */}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      
      {/* 태그 텍스트 */}
      <span>{children}</span>
      
      {/* 삭제 버튼 */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={cn(
            'flex-shrink-0 rounded-full p-0.5',
            'hover:bg-black/10 transition-colors',
            'focus:outline-none focus:ring-1 focus:ring-current'
          )}
          aria-label="태그 삭제"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

/**
 * 태그 입력 컴포넌트 (태그 목록 + 입력 필드)
 */
interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = '태그 입력 후 Enter',
  maxTags = 10,
  className,
}: TagInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value.trim();

    // Enter 또는 쉼표로 태그 추가
    if ((e.key === 'Enter' || e.key === ',') && value) {
      e.preventDefault();
      
      // 중복 및 최대 개수 체크
      if (!tags.includes(value) && tags.length < maxTags) {
        onTagsChange([...tags, value]);
        input.value = '';
      }
    }

    // Backspace로 마지막 태그 삭제
    if (e.key === 'Backspace' && !value && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 p-2',
        'bg-white border border-surface-200 rounded-lg',
        'focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500',
        'transition-all duration-200',
        className
      )}
    >
      {/* 태그 목록 */}
      {tags.map((tag) => (
        <Tag
          key={tag}
          variant="primary"
          size="sm"
          removable
          onRemove={() => handleRemove(tag)}
          onClick={() => {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(tag)}`;
            window.open(searchUrl, '_blank');
          }}
        >
          #{tag}
        </Tag>
      ))}

      {/* 입력 필드 */}
      {tags.length < maxTags && (
        <input
          type="text"
          placeholder={tags.length === 0 ? placeholder : ''}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex-1 min-w-[120px] px-1 py-1 text-sm',
            'bg-transparent outline-none',
            'placeholder:text-surface-400'
          )}
        />
      )}
    </div>
  );
}

