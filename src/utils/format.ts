import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export function formatDate(date: Date | string, formatStr = 'yyyy.MM.dd'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr, { locale: ko });
}

/**
 * 날짜를 상대적 시간으로 표시 (예: 3시간 전)
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ko });
}

/**
 * 스마트 날짜 포맷팅
 * - 오늘: HH:mm
 * - 어제: 어제 HH:mm
 * - 그 외: yyyy.MM.dd HH:mm
 */
export function formatSmartDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(d)) {
    return format(d, 'HH:mm', { locale: ko });
  }
  
  if (isYesterday(d)) {
    return `어제 ${format(d, 'HH:mm', { locale: ko })}`;
  }
  
  return format(d, 'yyyy.MM.dd HH:mm', { locale: ko });
}

/**
 * 조회수를 읽기 쉬운 형식으로 변환
 */
export function formatViewCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천`;
  }
  return count.toLocaleString();
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * 기사 상태를 한국어로 변환
 */
export function formatArticleStatus(status: string): string {
  const statusMap: Record<string, string> = {
    draft: '초안',
    review: '검토중',
    published: '발행됨',
    scheduled: '예약됨',
  };
  return statusMap[status] || status;
}

/**
 * 기사 상태에 따른 색상 클래스 반환
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    draft: 'bg-surface-200 text-surface-600',
    review: 'bg-amber-100 text-amber-700',
    published: 'bg-emerald-100 text-emerald-700',
    scheduled: 'bg-blue-100 text-blue-700',
  };
  return colorMap[status] || 'bg-surface-200 text-surface-600';
}

