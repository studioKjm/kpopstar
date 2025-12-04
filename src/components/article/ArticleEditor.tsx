'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/utils/cn';
import {
  Button,
  Input,
  TextArea,
  Select,
  TagInput,
  Panel,
  PanelHeader,
  Badge,
  CollapsiblePanel,
} from '@/components/ui';
import { AIToolbar } from './AIToolbar';
import type { Article, ArticleCategory, ArticleStatus, ExposureOptions } from '@/types';
import {
  Save,
  Send,
  Clock,
  Eye,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Link2,
  Quote,
  Heading2,
  CheckCircle,
  AlertTriangle,
  Wand2,
  Copy,
  Shield,
  SpellCheck,
} from 'lucide-react';

// 카테고리 옵션
const CATEGORY_OPTIONS = [
  { value: '스타뉴스', label: '스타뉴스' },
  { value: '엔터테인먼트', label: '엔터테인먼트' },
  { value: '스타트렌드', label: '스타트렌드' },
  { value: '이슈', label: '이슈' },
  { value: '종합', label: '종합' },
  { value: '실시간인기', label: '실시간 인기' },
];

// 서브카테고리 옵션 (엔터테인먼트)
const SUB_CATEGORY_OPTIONS = [
  { value: '음악', label: '음악' },
  { value: '방송영화', label: '방송/영화' },
  { value: '공연', label: '공연' },
];

interface ArticleEditorProps {
  initialData?: Partial<Article>;
  onSave?: (article: Partial<Article>) => void;
  onPublish?: (article: Partial<Article>) => void;
}

/**
 * 기사 에디터 컴포넌트
 * - 제목, 부제목, 본문 입력
 * - 카테고리 및 태그 설정
 * - 노출 옵션 설정
 * - AI 도구 연동
 */
export function ArticleEditor({ initialData, onSave, onPublish }: ArticleEditorProps) {
  // 기사 데이터 상태
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState<ArticleCategory | ''>(initialData?.category || '');
  const [subCategory, setSubCategory] = useState(initialData?.subCategory || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [summary, setSummary] = useState(initialData?.summary || '');
  
  // AI 검수 결과
  const [aiResults, setAiResults] = useState<Record<string, any>>({});
  
  // 노출 옵션
  const [exposureOptions, setExposureOptions] = useState<ExposureOptions>(
    initialData?.exposureOptions || {
      isHeadline: false,
      isImportant: false,
      isTrendingCandidate: false,
      isStarTrend: false,
    }
  );

  // 저장 상태
  const [isSaving, setIsSaving] = useState(false);

  // 기사 데이터 수집
  const collectArticleData = useCallback((): Partial<Article> => {
    return {
      title,
      subtitle,
      content,
      category: category as ArticleCategory,
      subCategory: category === '엔터테인먼트' ? subCategory as '음악' | '방송영화' | '공연' : undefined,
      tags,
      summary,
      exposureOptions,
    };
  }, [title, subtitle, content, category, subCategory, tags, summary, exposureOptions]);

  // 임시 저장
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const articleData = collectArticleData();
      onSave?.(articleData);
      // TODO: 실제 저장 로직
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('임시 저장되었습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 발행
  const handlePublish = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('본문을 입력해주세요.');
      return;
    }
    if (!category) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const articleData = collectArticleData();
      onPublish?.(articleData);
      // TODO: 실제 발행 로직
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('기사가 발행되었습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // AI 콜백
  const handleTagsGenerated = (generatedTags: string[]) => {
    setTags((prev) => Array.from(new Set([...prev, ...generatedTags])));
  };

  const handleCategorySelected = (suggestedCategory: string) => {
    setCategory(suggestedCategory as ArticleCategory);
  };

  const handleSummaryGenerated = (generatedSummary: string) => {
    setSummary(generatedSummary);
  };

  const handleResultsGenerated = (results: Record<string, any>) => {
    setAiResults(results);
  };

  return (
    <div className="flex gap-6">
      {/* 메인 에디터 영역 */}
      <div className="flex-1 space-y-6">
        {/* 제목 영역 */}
        <Panel>
          <div className="space-y-4">
            <Input
              label="제목"
              placeholder="기사 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
            />
            
            <Input
              label="부제목 (선택)"
              placeholder="부제목을 입력하세요"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
        </Panel>

        {/* 본문 에디터 */}
        <Panel>
          <PanelHeader
            title="본문"
            description="기사 내용을 작성하세요"
            action={
              <div className="flex items-center gap-1">
                {/* 간단한 서식 도구 */}
                <button className="p-2 rounded hover:bg-surface-100" title="굵게">
                  <Bold className="w-4 h-4 text-surface-500" />
                </button>
                <button className="p-2 rounded hover:bg-surface-100" title="기울임">
                  <Italic className="w-4 h-4 text-surface-500" />
                </button>
                <button className="p-2 rounded hover:bg-surface-100" title="제목">
                  <Heading2 className="w-4 h-4 text-surface-500" />
                </button>
                <button className="p-2 rounded hover:bg-surface-100" title="목록">
                  <List className="w-4 h-4 text-surface-500" />
                </button>
                <button className="p-2 rounded hover:bg-surface-100" title="인용">
                  <Quote className="w-4 h-4 text-surface-500" />
                </button>
                <button className="p-2 rounded hover:bg-surface-100" title="링크">
                  <Link2 className="w-4 h-4 text-surface-500" />
                </button>
                <button className="p-2 rounded hover:bg-surface-100" title="이미지">
                  <ImageIcon className="w-4 h-4 text-surface-500" />
                </button>
              </div>
            }
          />
          
          <TextArea
            placeholder="기사 본문을 작성하세요...

연예 뉴스 작성 팁:
- 리드 문장에 핵심 정보를 담아주세요
- 인용구는 정확하게 표기해주세요
- 날짜와 일정은 명확하게 기재해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] font-normal"
            showCount
            maxLength={10000}
          />
        </Panel>

        {/* 요약 */}
        {summary && (
          <Panel>
            <PanelHeader title="AI 생성 요약" />
            <p className="text-surface-700">{summary}</p>
          </Panel>
        )}

        {/* AI 검수 결과 */}
        {Object.keys(aiResults).length > 0 && (
          <Panel>
            <PanelHeader title="AI 검수 결과" />
            <div className="space-y-4">
              {/* 팩트체크 결과 */}
              {aiResults['fact-check'] && (
                <div>
                  <h4 className="text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    팩트체크
                  </h4>
                  {(aiResults['fact-check'] as { issues: { message: string; severity: string; suggestion?: string }[] }).issues.length > 0 ? (
                    <div className="space-y-2">
                      {(aiResults['fact-check'] as { issues: { message: string; severity: string; suggestion?: string }[] }).issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'flex items-start gap-2 text-sm p-3 rounded-lg border',
                            issue.severity === 'error' 
                              ? 'bg-red-50 border-red-200 text-red-700' 
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          )}
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p>{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-xs mt-1 opacity-75">제안: {issue.suggestion}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      문제 없음
                    </p>
                  )}
                </div>
              )}

              {/* 문체 통일 결과 */}
              {aiResults['style-unify'] && (
                <div>
                  <h4 className="text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-600" />
                    문체 통일
                  </h4>
                  {(aiResults['style-unify'] as { suggestions: Array<{ original: string; suggested: string; reason?: string }> }).suggestions.length > 0 ? (
                    <div className="space-y-3">
                      {(aiResults['style-unify'] as { suggestions: Array<{ original: string; suggested: string; reason?: string }> }).suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="text-sm p-3 rounded-lg bg-purple-50 border border-purple-200"
                        >
                          <div className="mb-2">
                            <p className="text-xs text-surface-500 mb-1">원문</p>
                            <p className="text-surface-700 line-through">{suggestion.original}</p>
                          </div>
                          <div>
                            <p className="text-xs text-surface-500 mb-1">제안</p>
                            <p className="text-purple-700 font-medium">{suggestion.suggested}</p>
                          </div>
                          {suggestion.reason && (
                            <p className="text-xs text-surface-500 mt-2">{suggestion.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      일관성 있음
                    </p>
                  )}
                </div>
              )}

              {/* 중복 검사 결과 */}
              {aiResults['duplicate-check'] && (
                <div>
                  <h4 className="text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                    <Copy className="w-4 h-4 text-amber-600" />
                    중복 검사
                  </h4>
                  {(aiResults['duplicate-check'] as { hasDuplicates: boolean; duplicates?: Array<{ text: string; count: number }> }).hasDuplicates ? (
                    <div className="space-y-2">
                      <p className="text-sm text-amber-700">중복 내용이 발견되었습니다.</p>
                      {(aiResults['duplicate-check'] as { duplicates?: Array<{ text: string; count: number }> }).duplicates?.map((dup, idx) => (
                        <div key={idx} className="text-sm p-2 rounded bg-amber-50 border border-amber-200">
                          <span className="font-medium">{dup.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      중복 없음
                    </p>
                  )}
                </div>
              )}

              {/* 민감도 검사 결과 */}
              {aiResults['sensitivity-check'] && (
                <div>
                  <h4 className="text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    민감도 검사
                  </h4>
                  {(aiResults['sensitivity-check'] as { items: Array<{ type: string; text: string; severity: string; suggestion?: string }> }).items.length > 0 ? (
                    <div className="space-y-2">
                      {(aiResults['sensitivity-check'] as { items: Array<{ type: string; text: string; severity: string; suggestion?: string }> }).items.map((item, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'text-sm p-3 rounded-lg border',
                            item.severity === 'high'
                              ? 'bg-red-50 border-red-200 text-red-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          )}
                        >
                          <p className="font-medium">{item.text}</p>
                          <p className="text-xs mt-1 opacity-75">유형: {item.type}</p>
                          {item.suggestion && (
                            <p className="text-xs mt-1 opacity-75">제안: {item.suggestion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      문제 없음
                    </p>
                  )}
                </div>
              )}

              {/* 오탈자 체크 결과 */}
              {aiResults['spell-check'] && (
                <div>
                  <h4 className="text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                    <SpellCheck className="w-4 h-4 text-indigo-600" />
                    오탈자 체크
                  </h4>
                  {(aiResults['spell-check'] as { errors: Array<{ original: string; corrected?: string; reason?: string; severity: string }>; totalErrors: number }).totalErrors > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {(aiResults['spell-check'] as { errors: Array<{ original: string; corrected?: string; reason?: string; severity: string }> }).errors.map((error, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'text-sm p-3 rounded-lg border',
                            error.severity === 'high'
                              ? 'bg-red-50 border-red-200 text-red-700'
                              : error.severity === 'medium'
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-blue-50 border-blue-200 text-blue-700'
                          )}
                        >
                          <div className="font-medium">
                            <span className="line-through">{error.original}</span>
                            {error.corrected && (
                              <>
                                {' → '}
                                <span className="font-semibold">{error.corrected}</span>
                              </>
                            )}
                          </div>
                          {error.reason && (
                            <p className="text-xs mt-1 opacity-75">{error.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      오류 없음
                    </p>
                  )}
                </div>
              )}
            </div>
          </Panel>
        )}
      </div>

      {/* 사이드바 */}
      <div className="w-80 space-y-6">
        {/* 발행 액션 */}
        <Panel>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                leftIcon={<Save className="w-4 h-4" />}
                onClick={handleSave}
                isLoading={isSaving}
                className="flex-1"
              >
                임시 저장
              </Button>
              <Button
                variant="outline"
                leftIcon={<Eye className="w-4 h-4" />}
                className="flex-1"
              >
                미리보기
              </Button>
            </div>
            
            <Button
              variant="primary"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={handlePublish}
              isLoading={isSaving}
              fullWidth
            >
              기사 발행
            </Button>
            
            <Button
              variant="ghost"
              leftIcon={<Clock className="w-4 h-4" />}
              fullWidth
            >
              예약 발행
            </Button>
          </div>
        </Panel>

        {/* 카테고리 */}
        <Panel>
          <PanelHeader title="분류" />
          <div className="space-y-4">
            <Select
              label="카테고리"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(e) => setCategory(e.target.value as ArticleCategory)}
            />
            
            {category === '엔터테인먼트' && (
              <Select
                label="서브 카테고리"
                options={SUB_CATEGORY_OPTIONS}
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              />
            )}
          </div>
        </Panel>

        {/* 태그 */}
        <Panel>
          <PanelHeader title="태그" />
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder="태그 입력 (Enter)"
            maxTags={10}
          />
        </Panel>

        {/* 노출 옵션 */}
        <CollapsiblePanel title="노출 옵션" defaultOpen={false}>
          <div className="space-y-3">
            {[
              { key: 'isHeadline', label: '헤드라인', description: '메인 상단 노출' },
              { key: 'isImportant', label: '중요 기사', description: '중요 기사로 표시' },
              { key: 'isTrendingCandidate', label: '실시간 인기 후보', description: '인기 기사 후보' },
              { key: 'isStarTrend', label: '스타트렌드', description: '트렌드 섹션 노출' },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={exposureOptions[option.key as keyof ExposureOptions]}
                  onChange={(e) =>
                    setExposureOptions((prev) => ({
                      ...prev,
                      [option.key]: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <p className="text-sm font-medium text-surface-800">{option.label}</p>
                  <p className="text-xs text-surface-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </CollapsiblePanel>

        {/* AI 도구 */}
        <Panel>
          <AIToolbar
            title={title}
            subtitle={subtitle}
            content={content}
            onTagsGenerated={handleTagsGenerated}
            onCategorySelected={handleCategorySelected}
            onSummaryGenerated={handleSummaryGenerated}
            onResultsGenerated={handleResultsGenerated}
          />
        </Panel>
      </div>
    </div>
  );
}

