/**
 * 기사 상태 관리 스토어
 * Zustand를 사용한 전역 상태 관리
 */

import { create } from 'zustand';
import type { Article, ArticleFilters, SortOptions, Pagination } from '@/types';

// 임시 샘플 데이터
const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    title: '뉴진스, 새 미니앨범 "How Sweet" 발매…글로벌 차트 석권',
    subtitle: '발매 첫날 100만 장 돌파, K-POP 신기록',
    content: `<p>그룹 뉴진스가 새 미니앨범 'How Sweet'를 발매하며 글로벌 음악 시장을 강타했다.</p>
<p>소속사 어도어에 따르면, 뉴진스의 새 앨범은 발매 첫날 100만 장 이상의 판매고를 올리며 K-POP 걸그룹 역대 최고 기록을 경신했다.</p>
<p>타이틀곡 'How Sweet'는 청량하면서도 중독성 있는 멜로디가 특징으로, 뉴진스 특유의 Y2K 감성을 현대적으로 재해석했다는 평가를 받고 있다.</p>`,
    summary: '뉴진스 새 앨범 발매 첫날 100만 장 돌파',
    category: '스타뉴스',
    tags: ['뉴진스', 'How Sweet', '컴백', 'K-POP'],
    author: {
      id: 'author-1',
      name: '김기자',
      email: 'reporter@kpopstar.ai.kr',
      role: 'reporter',
    },
    status: 'published',
    exposureOptions: {
      isHeadline: true,
      isImportant: true,
      isTrendingCandidate: true,
      isStarTrend: false,
    },
    imageUrls: [],
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    publishedAt: new Date('2024-01-15T11:00:00'),
    viewCount: 125000,
  },
  {
    id: '2',
    title: '르세라핌, 월드투어 "FLAME RISES" 서울 공연 성료',
    subtitle: '3일간 6만 관객 동원, 열정적인 무대로 팬들 열광',
    content: `<p>그룹 르세라핌이 첫 월드투어 'FLAME RISES'의 서울 공연을 성황리에 마쳤다.</p>
<p>르세라핌은 지난 12일부터 14일까지 서울 올림픽공원 KSPO돔에서 월드투어의 서울 공연을 개최, 3일간 총 6만 명의 관객을 동원했다.</p>`,
    category: '엔터테인먼트',
    subCategory: '공연',
    tags: ['르세라핌', '월드투어', 'FLAME RISES', '콘서트'],
    author: {
      id: 'author-2',
      name: '이편집',
      email: 'editor@kpopstar.ai.kr',
      role: 'editor',
    },
    status: 'published',
    exposureOptions: {
      isHeadline: false,
      isImportant: true,
      isTrendingCandidate: true,
      isStarTrend: false,
    },
    imageUrls: [],
    createdAt: new Date('2024-01-14T15:00:00'),
    updatedAt: new Date('2024-01-14T16:00:00'),
    publishedAt: new Date('2024-01-14T17:00:00'),
    viewCount: 89000,
  },
  {
    id: '3',
    title: '에스파, 새 싱글 "Supernova" 음원 차트 올킬',
    subtitle: '국내외 주요 차트 1위 석권, 글로벌 인기 입증',
    content: `<p>그룹 에스파가 새 싱글 'Supernova'로 음원 차트 올킬을 달성했다.</p>
<p>에스파의 새 싱글은 발매 직후 멜론, 지니, 벅스 등 국내 주요 음원 사이트 실시간 차트 1위에 올랐다.</p>`,
    category: '엔터테인먼트',
    subCategory: '음악',
    tags: ['에스파', 'Supernova', '음원차트', 'SM'],
    author: {
      id: 'author-1',
      name: '김기자',
      email: 'reporter@kpopstar.ai.kr',
      role: 'reporter',
    },
    status: 'review',
    exposureOptions: {
      isHeadline: false,
      isImportant: false,
      isTrendingCandidate: true,
      isStarTrend: false,
    },
    imageUrls: [],
    createdAt: new Date('2024-01-13T11:00:00'),
    updatedAt: new Date('2024-01-13T14:00:00'),
    viewCount: 0,
  },
  {
    id: '4',
    title: 'BTS 정국, 솔로 앨범 "GOLDEN" 빌보드 200 진입',
    content: `<p>BTS 멤버 정국의 솔로 앨범 'GOLDEN'이 빌보드 200 차트에 진입했다.</p>`,
    category: '스타뉴스',
    tags: ['BTS', '정국', 'GOLDEN', '빌보드'],
    author: {
      id: 'author-1',
      name: '김기자',
      email: 'reporter@kpopstar.ai.kr',
      role: 'reporter',
    },
    status: 'draft',
    exposureOptions: {
      isHeadline: false,
      isImportant: false,
      isTrendingCandidate: false,
      isStarTrend: false,
    },
    imageUrls: [],
    createdAt: new Date('2024-01-12T09:00:00'),
    updatedAt: new Date('2024-01-12T09:00:00'),
    viewCount: 0,
  },
];

interface ArticleState {
  // 기사 목록
  articles: Article[];
  
  // 현재 편집 중인 기사
  currentArticle: Partial<Article> | null;
  
  // 필터 및 정렬
  filters: ArticleFilters;
  sortOptions: SortOptions;
  
  // 페이지네이션
  pagination: Pagination;
  
  // 로딩 상태
  isLoading: boolean;
  
  // 액션
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  
  setCurrentArticle: (article: Partial<Article> | null) => void;
  updateCurrentArticle: (updates: Partial<Article>) => void;
  
  setFilters: (filters: ArticleFilters) => void;
  setSortOptions: (options: SortOptions) => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  
  setLoading: (loading: boolean) => void;
  
  // 필터링된 기사 가져오기
  getFilteredArticles: () => Article[];
}

export const useArticleStore = create<ArticleState>((set, get) => ({
  // 초기 상태
  articles: SAMPLE_ARTICLES,
  currentArticle: null,
  filters: {},
  sortOptions: { field: 'createdAt', direction: 'desc' },
  pagination: { page: 1, limit: 10, total: SAMPLE_ARTICLES.length, totalPages: 1 },
  isLoading: false,

  // 기사 목록 관리
  setArticles: (articles) => set({ articles }),
  
  addArticle: (article) => set((state) => ({
    articles: [article, ...state.articles],
  })),
  
  updateArticle: (id, updates) => set((state) => ({
    articles: state.articles.map((article) =>
      article.id === id ? { ...article, ...updates, updatedAt: new Date() } : article
    ),
  })),
  
  deleteArticle: (id) => set((state) => ({
    articles: state.articles.filter((article) => article.id !== id),
  })),

  // 현재 기사 관리
  setCurrentArticle: (article) => set({ currentArticle: article }),
  
  updateCurrentArticle: (updates) => set((state) => ({
    currentArticle: state.currentArticle
      ? { ...state.currentArticle, ...updates }
      : updates,
  })),

  // 필터 및 정렬
  setFilters: (filters) => set({ filters }),
  setSortOptions: (sortOptions) => set({ sortOptions }),
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),

  setLoading: (isLoading) => set({ isLoading }),

  // 필터링된 기사 가져오기
  getFilteredArticles: () => {
    const { articles, filters, sortOptions } = get();
    
    let filtered = [...articles];

    // 카테고리 필터
    if (filters.category) {
      filtered = filtered.filter((a) => a.category === filters.category);
    }

    // 상태 필터
    if (filters.status) {
      filtered = filtered.filter((a) => a.status === filters.status);
    }

    // 태그 필터
    if (filters.tag) {
      filtered = filtered.filter((a) => a.tags.includes(filters.tag!));
    }

    // 검색어 필터
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          a.content.toLowerCase().includes(searchLower) ||
          a.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      const aValue = a[sortOptions.field];
      const bValue = b[sortOptions.field];

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOptions.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOptions.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOptions.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return filtered;
  },
}));

