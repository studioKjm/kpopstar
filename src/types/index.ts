// =============================================
// 기사 관련 타입 정의
// =============================================

/** 기사 발행 상태 */
export type ArticleStatus = 'draft' | 'review' | 'published' | 'scheduled';

/** 기사 카테고리 */
export type ArticleCategory = 
  | '스타뉴스' 
  | '엔터테인먼트' 
  | '스타트렌드' 
  | '이슈' 
  | '종합'
  | '실시간인기';

/** 엔터테인먼트 서브 카테고리 */
export type EntertainmentSubCategory = '음악' | '방송영화' | '공연';

/** 노출 옵션 */
export interface ExposureOptions {
  isHeadline: boolean;        // 헤드라인 여부
  isImportant: boolean;       // 중요 기사 여부
  isTrendingCandidate: boolean; // 실시간 인기 후보
  isStarTrend: boolean;       // 스타트렌드 기사
}

/** 기사 데이터 모델 */
export interface Article {
  id: string;
  title: string;              // 제목
  subtitle?: string;          // 부제목
  content: string;            // 본문 (HTML 또는 Markdown)
  summary?: string;           // AI 생성 요약
  
  // 분류 정보
  category: ArticleCategory;
  subCategory?: EntertainmentSubCategory;
  tags: string[];             // 태그 목록
  
  // 메타 정보
  author: Author;
  status: ArticleStatus;
  exposureOptions: ExposureOptions;
  
  // 이미지
  thumbnailUrl?: string;
  imageUrls: string[];
  
  // 일정
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  scheduledAt?: Date;
  
  // AI 검수 결과
  aiValidation?: AIValidationResult;
  
  // 통계
  viewCount: number;
}

/** 작성자 정보 */
export interface Author {
  id: string;
  name: string;
  email: string;
  role: 'reporter' | 'editor' | 'desk';
}

// =============================================
// AI 기능 관련 타입 정의
// =============================================

/** AI 검수 결과 */
export interface AIValidationResult {
  // 팩트체크 결과
  factCheck: FactCheckResult;
  // 문체 분석 결과
  styleAnalysis: StyleAnalysisResult;
  // 중복 검사 결과
  duplicateCheck: DuplicateCheckResult;
  // 민감도 분석 결과
  sensitivityAnalysis: SensitivityResult;
  // 전체 점수 (0-100)
  overallScore: number;
  // 검수 완료 시간
  validatedAt: Date;
}

/** 팩트체크 결과 */
export interface FactCheckResult {
  isValid: boolean;
  issues: FactCheckIssue[];
}

export interface FactCheckIssue {
  type: 'date' | 'name' | 'fact' | 'schedule';
  severity: 'warning' | 'error';
  message: string;
  suggestion?: string;
  position?: { start: number; end: number };
}

/** 문체 분석 결과 */
export interface StyleAnalysisResult {
  isConsistent: boolean;
  suggestions: StyleSuggestion[];
}

export interface StyleSuggestion {
  original: string;
  suggested: string;
  reason: string;
  position?: { start: number; end: number };
}

/** 중복 검사 결과 */
export interface DuplicateCheckResult {
  hasDuplicates: boolean;
  duplicates: DuplicateItem[];
  similarArticles: SimilarArticle[];
}

export interface DuplicateItem {
  text: string;
  occurrences: number;
  positions: { start: number; end: number }[];
}

export interface SimilarArticle {
  articleId: string;
  title: string;
  similarity: number; // 0-100
}

/** 민감도 분석 결과 */
export interface SensitivityResult {
  hasSensitiveContent: boolean;
  items: SensitivityItem[];
}

export interface SensitivityItem {
  type: 'offensive' | 'controversial' | 'privacy' | 'defamation';
  severity: 'low' | 'medium' | 'high';
  text: string;
  suggestion?: string;
  position?: { start: number; end: number };
}

// =============================================
// AI 요청/응답 타입
// =============================================

/** AI 프로바이더 타입 */
export type AIProvider = 'base44' | 'gemini';

/** AI 기능 타입 */
export type AIFeatureType = 
  | 'style-unify'       // 문체 통일
  | 'fact-check'        // 팩트체크
  | 'auto-tag'          // 자동 태그 생성
  | 'duplicate-check'   // 중복 검사
  | 'summarize'         // 요약
  | 'rewrite'           // 리라이팅
  | 'category-suggest'  // 카테고리 추천
  | 'sensitivity-check' // 민감도 검사
  | 'similarity-check'; // 유사도 검사

/** AI 요청 기본 인터페이스 */
export interface AIRequest {
  feature: AIFeatureType;
  content: string;
  options?: Record<string, unknown>;
}

/** AI 응답 기본 인터페이스 */
export interface AIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  processingTime?: number;
}

/** 태그 생성 응답 */
export interface AutoTagResponse {
  tags: string[];
  confidence: number[];
}

/** 요약 응답 */
export interface SummarizeResponse {
  summary: string;
  keyPoints: string[];
  snsVersion?: string;
  seoVersion?: string;
}

/** 카테고리 추천 응답 */
export interface CategorySuggestResponse {
  category: ArticleCategory;
  subCategory?: EntertainmentSubCategory;
  confidence: number;
  alternatives: { category: ArticleCategory; confidence: number }[];
}

// =============================================
// UI 관련 타입
// =============================================

/** 필터 옵션 */
export interface ArticleFilters {
  category?: ArticleCategory;
  status?: ArticleStatus;
  author?: string;
  tag?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

/** 정렬 옵션 */
export interface SortOptions {
  field: 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'title';
  direction: 'asc' | 'desc';
}

/** 페이지네이션 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** 토스트 알림 타입 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

