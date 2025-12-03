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
    setTags((prev) => [...new Set([...prev, ...generatedTags])]);
  };

  const handleCategorySelected = (suggestedCategory: string) => {
    setCategory(suggestedCategory as ArticleCategory);
  };

  const handleSummaryGenerated = (generatedSummary: string) => {
    setSummary(generatedSummary);
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
        <Panel>
          <PanelHeader title="노출 옵션" />
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
        </Panel>

        {/* AI 도구 */}
        <Panel>
          <AIToolbar
            content={content}
            onTagsGenerated={handleTagsGenerated}
            onCategorySelected={handleCategorySelected}
            onSummaryGenerated={handleSummaryGenerated}
          />
        </Panel>
      </div>
    </div>
  );
}

