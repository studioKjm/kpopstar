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
  SpellCheck,
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
  {
    id: 'spell-check',
    label: '오탈자 체크',
    icon: SpellCheck,
    description: '맞춤법·띄어쓰기 검사',
    color: 'text-indigo-600',
  },
];

interface AIToolbarProps {
  title?: string;
  subtitle?: string;
  content: string;
  onTagsGenerated?: (tags: string[]) => void;
  onCategorySelected?: (category: string) => void;
  onSummaryGenerated?: (summary: string) => void;
  onResultsGenerated?: (results: Record<string, any>) => void;
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
  onResultsGenerated,
  className,
}: AIToolbarProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});

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
      const newResults = { ...results, [featureId]: data.data };
      setResults(newResults);
      
      // 결과 콜백 호출 (기사 하단에 표시하기 위해)
      onResultsGenerated?.(newResults);

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
          toast(`팩트체크 완료: ${issues.length}개의 이슈 발견`, {
            icon: '⚠️',
          });
        }
      }

      if (featureId === 'style-unify') {
        const suggestions = data.data?.suggestions || [];
        if (suggestions.length === 0) {
          toast.success('문체 통일 완료: 일관성 있음');
        } else {
          toast(`문체 통일 완료: ${suggestions.length}개의 제안`, {
            icon: 'ℹ️',
          });
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
          toast('중복 검사 완료: 중복 내용 발견', {
            icon: '⚠️',
          });
        }
      }

      if (featureId === 'spell-check') {
        const errors = data.data?.errors || [];
        const totalErrors = data.data?.totalErrors || 0;
        if (totalErrors === 0) {
          toast.success('오탈자 체크 완료: 오류 없음');
        } else {
          toast(`오탈자 체크 완료: ${totalErrors}개의 오류 발견`, {
            icon: '⚠️',
          });
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
          const hasResult = !!results[feature.id];

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
                hasResult ? 'border-emerald-300 bg-emerald-50/50' : ''
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
              {hasResult ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>

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
            const newResults = {
              ...results,
              'fact-check': data.data.factCheck.data,
              'style-unify': data.data.styleAnalysis.data,
              'duplicate-check': data.data.duplicateCheck.data,
              'sensitivity-check': data.data.sensitivityCheck.data,
              'spell-check': data.data.spellCheck.data,
            };
            setResults(newResults);
            
            // 결과 콜백 호출 (기사 하단에 표시하기 위해)
            onResultsGenerated?.(newResults);

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

