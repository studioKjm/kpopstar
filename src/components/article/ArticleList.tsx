'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { ArticleCard } from './ArticleCard';
import { Button, Input, Select, Badge } from '@/components/ui';
import { useArticleStore } from '@/store/articleStore';
import type { Article, ArticleCategory, ArticleStatus } from '@/types';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  RefreshCw,
  X,
} from 'lucide-react';

// 필터 옵션
const STATUS_OPTIONS = [
  { value: '', label: '전체 상태' },
  { value: 'draft', label: '초안' },
  { value: 'review', label: '검토중' },
  { value: 'published', label: '발행됨' },
  { value: 'scheduled', label: '예약됨' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: '전체 카테고리' },
  { value: '스타뉴스', label: '스타뉴스' },
  { value: '엔터테인먼트', label: '엔터테인먼트' },
  { value: '스타트렌드', label: '스타트렌드' },
  { value: '이슈', label: '이슈' },
  { value: '종합', label: '종합' },
  { value: '실시간인기', label: '실시간 인기' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: '작성일' },
  { value: 'updatedAt', label: '수정일' },
  { value: 'publishedAt', label: '발행일' },
  { value: 'viewCount', label: '조회수' },
  { value: 'title', label: '제목' },
];

interface ArticleListProps {
  onArticleEdit?: (article: Article) => void;
  onArticleDelete?: (article: Article) => void;
}

/**
 * 기사 목록 컴포넌트
 * - 필터링, 검색, 정렬 기능
 * - 그리드/리스트 뷰 전환
 */
export function ArticleList({ onArticleEdit, onArticleDelete }: ArticleListProps) {
  const {
    filters,
    setFilters,
    sortOptions,
    setSortOptions,
    getFilteredArticles,
    deleteArticle,
  } = useArticleStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  const articles = getFilteredArticles();

  // 검색 핸들러
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({ ...filters, search: value || undefined });
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setSearchValue('');
    setFilters({});
  };

  // 정렬 방향 토글
  const toggleSortDirection = () => {
    setSortOptions({
      ...sortOptions,
      direction: sortOptions.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  // 기사 삭제
  const handleDelete = (article: Article) => {
    if (confirm(`"${article.title}" 기사를 삭제하시겠습니까?`)) {
      deleteArticle(article.id);
      onArticleDelete?.(article);
    }
  };

  // 활성 필터 개수
  const activeFilterCount = [
    filters.category,
    filters.status,
    filters.tag,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 바 */}
      <div className="flex items-center gap-4">
        {/* 검색 */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="기사 검색..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchValue ? (
                <button onClick={() => handleSearch('')}>
                  <X className="w-4 h-4 text-surface-400 hover:text-surface-600" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* 필터 토글 */}
        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          leftIcon={<Filter className="w-4 h-4" />}
          onClick={() => setShowFilters(!showFilters)}
        >
          필터
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* 정렬 */}
        <div className="flex items-center gap-2">
          <Select
            options={SORT_OPTIONS}
            value={sortOptions.field}
            onChange={(e) =>
              setSortOptions({
                ...sortOptions,
                field: e.target.value as typeof sortOptions.field,
              })
            }
            className="w-32"
          />
          <button
            onClick={toggleSortDirection}
            className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50"
            title={sortOptions.direction === 'asc' ? '오름차순' : '내림차순'}
          >
            {sortOptions.direction === 'asc' ? (
              <SortAsc className="w-4 h-4 text-surface-600" />
            ) : (
              <SortDesc className="w-4 h-4 text-surface-600" />
            )}
          </button>
        </div>

        {/* 뷰 모드 전환 */}
        <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'grid'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-surface-600 hover:bg-surface-50'
            )}
            title="그리드 보기"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'list'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-surface-600 hover:bg-surface-50'
            )}
            title="리스트 보기"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* 새로고침 */}
        <button
          onClick={() => {
            // TODO: 데이터 새로고침
          }}
          className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50"
          title="새로고침"
        >
          <RefreshCw className="w-4 h-4 text-surface-600" />
        </button>
      </div>

      {/* 확장 필터 패널 */}
      {showFilters && (
        <div className="p-4 bg-white rounded-xl border border-surface-200 animate-slide-down">
          <div className="flex items-end gap-4">
            <Select
              label="상태"
              options={STATUS_OPTIONS}
              value={filters.status || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: (e.target.value as ArticleStatus) || undefined,
                })
              }
              className="w-40"
            />
            
            <Select
              label="카테고리"
              options={CATEGORY_OPTIONS}
              value={filters.category || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: (e.target.value as ArticleCategory) || undefined,
                })
              }
              className="w-40"
            />

            <Input
              label="태그"
              placeholder="태그로 필터"
              value={filters.tag || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tag: e.target.value || undefined,
                })
              }
              className="w-40"
            />

            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="mb-0.5"
            >
              필터 초기화
            </Button>
          </div>
        </div>
      )}

      {/* 결과 요약 */}
      <div className="flex items-center justify-between text-sm text-surface-500">
        <span>
          총 <strong className="text-surface-900">{articles.length}</strong>개의 기사
        </span>
        
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-primary-600 hover:text-primary-700"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 기사 목록 */}
      {articles.length > 0 ? (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'space-y-3'
          )}
        >
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ArticleCard
                article={article}
                onEdit={onArticleEdit}
                onDelete={handleDelete}
                onDuplicate={(a) => {
                  // TODO: 기사 복제 기능
                  console.log('Duplicate:', a);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-surface-200">
          <div className="text-surface-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-surface-700 mb-1">
            기사가 없습니다
          </h3>
          <p className="text-surface-500">
            {activeFilterCount > 0
              ? '필터 조건에 맞는 기사가 없습니다.'
              : '새 기사를 작성해보세요.'}
          </p>
        </div>
      )}
    </div>
  );
}

