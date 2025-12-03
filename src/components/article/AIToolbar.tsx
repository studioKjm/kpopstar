'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button, Badge } from '@/components/ui';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Tag,
  FileText,
  Wand2,
  Shield,
  Copy,
  LayoutGrid,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

// AI 기능 정의
const AI_FEATURES = [
  {
    id: 'auto-tag',
    label: '태그 생성',
    icon: Tag,
    description: '본문 기반 자동 태그 추출',
    color: 'text-blue-600',
  },
  {
    id: 'fact-check',
    label: '팩트체크',
    icon: CheckCircle,
    description: '사실 관계 및 일정 검증',
    color: 'text-emerald-600',
  },
  {
    id: 'style-unify',
    label: '문체 통일',
    icon: Wand2,
    description: '연예 뉴스 문체로 통일',
    color: 'text-purple-600',
  },
  {
    id: 'duplicate-check',
    label: '중복 검사',
    icon: Copy,
    description: '중복 정보 탐지',
    color: 'text-amber-600',
  },
  {
    id: 'sensitivity-check',
    label: '민감도 검사',
    icon: Shield,
    description: '부적절한 표현 감지',
    color: 'text-red-600',
  },
  {
    id: 'summarize',
    label: '요약',
    icon: FileText,
    description: '기사 요약 생성',
    color: 'text-cyan-600',
  },
  {
    id: 'category-suggest',
    label: '카테고리 추천',
    icon: LayoutGrid,
    description: '자동 카테고리 분류',
    color: 'text-pink-600',
  },
];

interface AIToolbarProps {
  title?: string;
  subtitle?: string;
  content: string;
  onTagsGenerated?: (tags: string[]) => void;
  onCategorySelected?: (category: string) => void;
  onSummaryGenerated?: (summary: string) => void;
  className?: string;
}

/**
 * AI 도구 모음 컴포넌트
 * 기사 작성 시 사용 가능한 AI 기능 버튼들을 제공
 */
export function AIToolbar({
  title,
  subtitle,
  content,
  onTagsGenerated,
  onCategorySelected,
  onSummaryGenerated,
  className,
}: AIToolbarProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, unknown>>({});

  // AI 기능 실행
  const handleFeatureClick = async (featureId: string) => {
    if (!content.trim()) {
      toast.error('본문을 먼저 작성해주세요.');
      return;
    }

    setActiveFeature(featureId);

    try {
      const response = await fetch(`/api/ai/${featureId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title?.trim() || '',
          subtitle: subtitle?.trim() || '',
          content: content.trim(),
          options: featureId === 'summarize' ? { type: 'brief' } : {},
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'AI 기능 실행 중 오류가 발생했습니다.');
      }

      // 결과 저장
      setResults((prev) => ({ ...prev, [featureId]: data.data }));

      // 콜백 호출
      if (featureId === 'auto-tag' && onTagsGenerated && data.data?.tags) {
        onTagsGenerated(data.data.tags);
        toast.success(`${data.data.tags.length}개의 태그가 생성되었습니다.`);
      }
      if (featureId === 'category-suggest' && onCategorySelected && data.data?.category) {
        onCategorySelected(data.data.category);
        toast.success(`카테고리 추천: ${data.data.category}`);
      }
      if (featureId === 'summarize' && onSummaryGenerated && data.data?.summary) {
        onSummaryGenerated(data.data.summary);
        toast.success('요약이 생성되었습니다.');
      }

      if (featureId === 'fact-check') {
        const issues = data.data?.issues || [];
        if (issues.length === 0) {
          toast.success('팩트체크 완료: 문제 없음');
        } else {
          toast.warning(`팩트체크 완료: ${issues.length}개의 이슈 발견`);
        }
      }

      if (featureId === 'style-unify') {
        const suggestions = data.data?.suggestions || [];
        if (suggestions.length === 0) {
          toast.success('문체 통일 완료: 일관성 있음');
        } else {
          toast.info(`문체 통일 완료: ${suggestions.length}개의 제안`);
        }
      }

      if (featureId === 'sensitivity-check') {
        const items = data.data?.items || [];
        if (items.length === 0) {
          toast.success('민감도 검사 완료: 문제 없음');
        } else {
          toast.error(`민감도 검사 완료: ${items.length}개의 문제 발견`);
        }
      }

      if (featureId === 'duplicate-check') {
        const hasDuplicates = data.data?.hasDuplicates || false;
        if (!hasDuplicates) {
          toast.success('중복 검사 완료: 중복 없음');
        } else {
          toast.warning('중복 검사 완료: 중복 내용 발견');
        }
      }
    } catch (error) {
      console.error('[AI Toolbar] Error:', error);
      toast.error(
        error instanceof Error ? error.message : 'AI 기능 실행 중 오류가 발생했습니다.'
      );
    } finally {
      setActiveFeature(null);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary-500" />
        <h3 className="font-semibold text-surface-900">AI 도구</h3>
        <Badge variant="primary" size="sm">Beta</Badge>
      </div>

      {/* AI 기능 버튼들 */}
      <div className="grid grid-cols-2 gap-2">
        {AI_FEATURES.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          const hasResult = results[feature.id];

          return (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              disabled={isActive || !content.trim()}
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg text-left',
                'border border-surface-200 bg-white',
                'hover:border-primary-300 hover:bg-primary-50/50',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                hasResult && 'border-emerald-300 bg-emerald-50/50'
              )}
            >
              {isActive ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
              ) : (
                <Icon className={cn('w-4 h-4', feature.color)} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800 truncate">
                  {feature.label}
                </p>
              </div>
              {hasResult && (
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* 결과 표시 영역 */}
      {Object.keys(results).length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-surface-50 border border-surface-200">
          <h4 className="text-sm font-medium text-surface-700 mb-3">
            AI 검수 결과
          </h4>
          
          <div className="space-y-3">
            {/* 태그 결과 */}
            {results['auto-tag'] && (
              <div>
                <p className="text-xs text-surface-500 mb-1">생성된 태그</p>
                <div className="flex flex-wrap gap-1">
                  {(results['auto-tag'] as { tags: string[] }).tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 팩트체크 결과 */}
            {results['fact-check'] && (
              <div>
                <p className="text-xs text-surface-500 mb-1">팩트체크</p>
                {(results['fact-check'] as { issues: { message: string; severity: string }[] }).issues.length > 0 ? (
                  <div className="space-y-1">
                    {(results['fact-check'] as { issues: { message: string; severity: string }[] }).issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-center gap-2 text-xs p-2 rounded',
                          issue.severity === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                        )}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {issue.message}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    문제 없음
                  </p>
                )}
              </div>
            )}

            {/* 요약 결과 */}
            {results['summarize'] && (
              <div>
                <p className="text-xs text-surface-500 mb-1">요약</p>
                <p className="text-sm text-surface-700">
                  {(results['summarize'] as { summary: string }).summary}
                </p>
              </div>
            )}

            {/* 카테고리 추천 결과 */}
            {results['category-suggest'] && (
              <div>
                <p className="text-xs text-surface-500 mb-1">추천 카테고리</p>
                <Badge variant="primary">
                  {(results['category-suggest'] as { category: string }).category}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 전체 검수 버튼 */}
      <Button
        variant="primary"
        fullWidth
        leftIcon={<Sparkles className="w-4 h-4" />}
        disabled={!content.trim() || activeFeature !== null}
        onClick={async () => {
          if (!content.trim()) {
            toast.error('본문을 먼저 작성해주세요.');
            return;
          }

          setActiveFeature('full-validation');
          toast.loading('전체 AI 검수를 실행 중입니다...', { id: 'full-validation' });

          try {
            const response = await fetch('/api/ai/full-validation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: title?.trim() || '',
                subtitle: subtitle?.trim() || '',
                content: content.trim(),
              }),
            });

            const data = await response.json();

            if (!data.success) {
              throw new Error(data.error || '전체 AI 검수 중 오류가 발생했습니다.');
            }

            // 결과 저장
            setResults((prev) => ({
              ...prev,
              'fact-check': data.data.factCheck.data,
              'style-unify': data.data.styleAnalysis.data,
              'duplicate-check': data.data.duplicateCheck.data,
              'sensitivity-check': data.data.sensitivityCheck.data,
            }));

            toast.success('전체 AI 검수가 완료되었습니다.', { id: 'full-validation' });
          } catch (error) {
            console.error('[AI Toolbar] Full validation error:', error);
            toast.error(
              error instanceof Error
                ? error.message
                : '전체 AI 검수 중 오류가 발생했습니다.',
              { id: 'full-validation' }
            );
          } finally {
            setActiveFeature(null);
          }
        }}
      >
        전체 AI 검수 실행
      </Button>
    </div>
  );
}

