'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { StatusBadge, Tag, Badge } from '@/components/ui';
import { formatSmartDate, formatViewCount, truncateText } from '@/utils/format';
import type { Article } from '@/types';
import {
  Eye,
  Clock,
  User,
  Star,
  TrendingUp,
  Zap,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
  onEdit?: (article: Article) => void;
  onDelete?: (article: Article) => void;
  onDuplicate?: (article: Article) => void;
}

/**
 * 기사 카드 컴포넌트
 * 리스트에서 개별 기사를 표시
 */
export function ArticleCard({
  article,
  onEdit,
  onDelete,
  onDuplicate,
}: ArticleCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={cn(
      'group bg-white rounded-xl border border-surface-200',
      'hover:border-primary-200 hover:shadow-md',
      'transition-all duration-200'
    )}>
      <div className="p-4">
        {/* 상단: 카테고리, 상태, 메뉴 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm">
              {article.category}
            </Badge>
            {article.subCategory && (
              <Badge variant="info" size="sm">
                {article.subCategory}
              </Badge>
            )}
            <StatusBadge status={article.status} />
          </div>

          {/* 더보기 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={cn(
                'p-1.5 rounded-lg opacity-0 group-hover:opacity-100',
                'hover:bg-surface-100 transition-all',
                showMenu && 'opacity-100 bg-surface-100'
              )}
            >
              <MoreVertical className="w-4 h-4 text-surface-500" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className={cn(
                  'absolute right-0 top-full mt-1 w-36 z-20',
                  'bg-white rounded-lg shadow-lg border border-surface-200',
                  'py-1 animate-fade-in'
                )}>
                  <button
                    onClick={() => {
                      onEdit?.(article);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                  >
                    <Edit className="w-4 h-4" />
                    편집
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate?.(article);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                  >
                    <Copy className="w-4 h-4" />
                    복제
                  </button>
                  <div className="border-t border-surface-100 my-1" />
                  <button
                    onClick={() => {
                      onDelete?.(article);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 제목 */}
        <Link href={`/articles/${article.id}`}>
          <h3 className="font-semibold text-surface-900 hover:text-primary-600 transition-colors mb-1 line-clamp-2">
            {article.title}
          </h3>
        </Link>

        {/* 부제목 */}
        {article.subtitle && (
          <p className="text-sm text-surface-500 mb-2 line-clamp-1">
            {article.subtitle}
          </p>
        )}

        {/* 요약 또는 본문 미리보기 */}
        <p className="text-sm text-surface-600 line-clamp-2 mb-3">
          {article.summary || truncateText(article.content.replace(/<[^>]*>/g, ''), 100)}
        </p>

        {/* 태그 */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.slice(0, 4).map((tag) => (
              <Tag key={tag} variant="default" size="sm">
                #{tag}
              </Tag>
            ))}
            {article.tags.length > 4 && (
              <span className="text-xs text-surface-400">
                +{article.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 노출 옵션 아이콘 */}
        {(article.exposureOptions.isHeadline ||
          article.exposureOptions.isImportant ||
          article.exposureOptions.isTrendingCandidate ||
          article.exposureOptions.isStarTrend) && (
          <div className="flex items-center gap-2 mb-3">
            {article.exposureOptions.isHeadline && (
              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3" />
                헤드라인
              </span>
            )}
            {article.exposureOptions.isImportant && (
              <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3" />
                중요
              </span>
            )}
            {article.exposureOptions.isTrendingCandidate && (
              <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                인기 후보
              </span>
            )}
          </div>
        )}

        {/* 하단: 작성자, 날짜, 조회수 */}
        <div className="flex items-center justify-between text-xs text-surface-500 pt-3 border-t border-surface-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {article.author.name}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatSmartDate(article.createdAt)}
            </span>
          </div>
          
          {article.status === 'published' && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatViewCount(article.viewCount)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

