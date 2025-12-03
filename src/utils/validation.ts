import type { Article } from '@/types';

/**
 * 기사 유효성 검사 결과
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * 기사 데이터 유효성 검사
 */
export function validateArticle(article: Partial<Article>): ValidationResult {
  const errors: ValidationError[] = [];

  // 제목 검사
  if (!article.title?.trim()) {
    errors.push({ field: 'title', message: '제목을 입력해주세요.' });
  } else if (article.title.length > 100) {
    errors.push({ field: 'title', message: '제목은 100자 이내로 입력해주세요.' });
  }

  // 본문 검사
  if (!article.content?.trim()) {
    errors.push({ field: 'content', message: '본문을 입력해주세요.' });
  } else if (article.content.length < 50) {
    errors.push({ field: 'content', message: '본문은 최소 50자 이상 입력해주세요.' });
  }

  // 카테고리 검사
  if (!article.category) {
    errors.push({ field: 'category', message: '카테고리를 선택해주세요.' });
  }

  // 예약 발행 시간 검사
  if (article.status === 'scheduled' && !article.scheduledAt) {
    errors.push({ field: 'scheduledAt', message: '예약 발행 시간을 설정해주세요.' });
  }

  if (article.scheduledAt && new Date(article.scheduledAt) <= new Date()) {
    errors.push({ field: 'scheduledAt', message: '예약 시간은 현재 시간 이후여야 합니다.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 빈 문자열 또는 공백만 있는지 확인
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * HTML 태그 제거
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * URL 유효성 검사
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

