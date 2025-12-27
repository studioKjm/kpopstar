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
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [quotaExceededUntil, setQuotaExceededUntil] = useState<number | null>(null);
  
  // 요청 빈도 제한 (최소 3초 간격)
  const MIN_REQUEST_INTERVAL = 3000;
  
  // 할당량 초과 상태 확인
  const isQuotaExceeded = quotaExceededUntil !== null && Date.now() < quotaExceededUntil;

  // AI 기능 실행
  const handleFeatureClick = async (featureId: string) => {
    if (!content.trim()) {
      toast.error('본문을 먼저 작성해주세요.');
      return;
    }

    // 할당량 초과 상태 체크
    if (isQuotaExceeded) {
      const remainingTime = Math.ceil((quotaExceededUntil! - Date.now()) / 1000);
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      const timeText = minutes > 0 
        ? `${minutes}분 ${seconds}초`
        : `${seconds}초`;
      
      toast.error(
        `할당량 초과\n\n${timeText} 후 다시 시도해주세요.`,
        {
          duration: 5000,
          icon: '⚠️',
        }
      );
      return;
    }

    // 요청 빈도 제한 체크
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const remainingSeconds = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000);
      toast.error(`요청 간격을 두고 시도해주세요. (${remainingSeconds}초 후 가능)`);
      return;
    }

    // 본문 길이 경고 (2000자 초과 시)
    if (content.length > 2000) {
      toast('긴 본문은 일부만 분석됩니다. (2000자 제한)', {
        icon: '⚠️',
        duration: 3000,
      });
    }

    setActiveFeature(featureId);
    setLastRequestTime(now);

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
      
      // 에러 메시지 처리
      let errorMessage = 'AI 기능 실행 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 할당량 초과 에러인 경우 더 명확한 메시지 및 기능 비활성화
        if (error.message.includes('할당량이 초과') || error.message.includes('429')) {
          // 재시도 시간 추출 (에러 메시지에서)
          let retrySeconds = 60; // 기본값 1분
          const retryMatch = error.message.match(/(\d+)초 후|(\d+)분 후/);
          if (retryMatch) {
            if (error.message.includes('분')) {
              const minutes = parseInt(retryMatch[1] || retryMatch[2] || '1');
              retrySeconds = minutes * 60;
            } else {
              retrySeconds = parseInt(retryMatch[1] || retryMatch[2] || '60');
            }
          }
          
          // 할당량 초과 상태 설정 (재시도 시간 + 여유 10초)
          setQuotaExceededUntil(Date.now() + (retrySeconds * 1000) + 10000);
          
          // 에러 메시지에서 재시도 시간 추출하여 표시
          const messageLines = error.message.split('\n');
          const retryLine = messageLines.find(line => line.includes('재시도 가능') || line.includes('후'));
          
          toast.error(
            retryLine || 'Gemini API 할당량 초과\n\n잠시 후 다시 시도해주세요.',
            {
              duration: 8000,
              icon: '⚠️',
            }
          );
          return;
        }
      }
      
      toast.error(errorMessage, {
        duration: 5000,
      });
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
              disabled={isActive || !content.trim() || isQuotaExceeded}
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg text-left',
                'border border-surface-200 bg-white',
                'hover:border-primary-300 hover:bg-primary-50/50',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                hasResult ? 'border-emerald-300 bg-emerald-50/50' : '',
                isQuotaExceeded ? 'opacity-40' : ''
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

      {/* 할당량 초과 안내 */}
      {isQuotaExceeded && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">할당량 초과</span>
          </div>
          <p className="text-amber-600 text-xs">
            {(() => {
              const remainingTime = Math.ceil((quotaExceededUntil! - Date.now()) / 1000);
              const minutes = Math.floor(remainingTime / 60);
              const seconds = remainingTime % 60;
              return minutes > 0 
                ? `${minutes}분 ${seconds}초 후 다시 시도 가능`
                : `${seconds}초 후 다시 시도 가능`;
            })()}
          </p>
        </div>
      )}

      {/* 전체 검수 버튼 */}
      <Button
        variant="primary"
        fullWidth
        leftIcon={<Sparkles className="w-4 h-4" />}
        disabled={!content.trim() || activeFeature !== null || isQuotaExceeded}
        onClick={async () => {
          if (!content.trim()) {
            toast.error('본문을 먼저 작성해주세요.');
            return;
          }

          // 할당량 초과 상태 체크
          if (isQuotaExceeded) {
            const remainingTime = Math.ceil((quotaExceededUntil! - Date.now()) / 1000);
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            const timeText = minutes > 0 
              ? `${minutes}분 ${seconds}초`
              : `${seconds}초`;
            
            toast.error(
              `할당량 초과\n\n${timeText} 후 다시 시도해주세요.`,
              {
                duration: 5000,
                icon: '⚠️',
              }
            );
            return;
          }

          // 요청 빈도 제한 체크
          const now = Date.now();
          const timeSinceLastRequest = now - lastRequestTime;
          
          if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            const remainingSeconds = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000);
            toast.error(`요청 간격을 두고 시도해주세요. (${remainingSeconds}초 후 가능)`);
            return;
          }

          // 본문 길이 경고
          if (content.length > 2000) {
            toast('긴 본문은 일부만 분석됩니다. (2000자 제한)', {
              icon: '⚠️',
              duration: 3000,
            });
          }

          setActiveFeature('full-validation');
          setLastRequestTime(now);
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
            
            let errorMessage = '전체 AI 검수 중 오류가 발생했습니다.';
            if (error instanceof Error) {
              errorMessage = error.message;
              
              // 할당량 초과 에러인 경우 더 명확한 메시지 및 기능 비활성화
              if (error.message.includes('할당량이 초과') || error.message.includes('429')) {
                // 재시도 시간 추출
                let retrySeconds = 60;
                const retryMatch = error.message.match(/(\d+)초 후|(\d+)분 후/);
                if (retryMatch) {
                  if (error.message.includes('분')) {
                    const minutes = parseInt(retryMatch[1] || retryMatch[2] || '1');
                    retrySeconds = minutes * 60;
                  } else {
                    retrySeconds = parseInt(retryMatch[1] || retryMatch[2] || '60');
                  }
                }
                
                setQuotaExceededUntil(Date.now() + (retrySeconds * 1000) + 10000);
                
                const messageLines = error.message.split('\n');
                const retryLine = messageLines.find(line => line.includes('재시도 가능') || line.includes('후'));
                
                toast.error(
                  retryLine || 'Gemini API 할당량 초과\n\n잠시 후 다시 시도해주세요.',
                  {
                    id: 'full-validation',
                    duration: 8000,
                    icon: '⚠️',
                  }
                );
                return;
              }
            }
            
            toast.error(errorMessage, { id: 'full-validation' });
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

