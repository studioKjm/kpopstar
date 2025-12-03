'use client';

import { cn } from '@/utils/cn';
import { useArticleStore } from '@/store/articleStore';
import {
  FileText,
  Edit3,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
} from 'lucide-react';

/**
 * 기사 통계 컴포넌트
 * 대시보드 상단에 표시되는 요약 통계
 */
export function ArticleStats() {
  const { articles } = useArticleStore();

  // 통계 계산
  const stats = {
    total: articles.length,
    draft: articles.filter((a) => a.status === 'draft').length,
    review: articles.filter((a) => a.status === 'review').length,
    published: articles.filter((a) => a.status === 'published').length,
    scheduled: articles.filter((a) => a.status === 'scheduled').length,
    totalViews: articles.reduce((sum, a) => sum + a.viewCount, 0),
  };

  const statCards = [
    {
      label: '전체 기사',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: '초안',
      value: stats.draft,
      icon: Edit3,
      color: 'bg-surface-500',
      bgColor: 'bg-surface-50',
      textColor: 'text-surface-700',
    },
    {
      label: '검토중',
      value: stats.review,
      icon: Clock,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: '발행됨',
      value: stats.published,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      label: '총 조회수',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.label}
            className={cn(
              'p-4 rounded-xl bg-white border border-surface-200',
              'hover:shadow-md transition-shadow duration-200',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <Icon className={cn('w-5 h-5', stat.textColor)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {stat.value}
                </p>
                <p className="text-sm text-surface-500">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

