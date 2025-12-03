/**
 * AI 모듈 공통 타입 정의
 * Base44와 Gemini API 모두에서 사용되는 타입들
 */

import type {
  AIFeatureType,
  AIProvider,
  AIRequest,
  AIResponse,
  AutoTagResponse,
  SummarizeResponse,
  CategorySuggestResponse,
  FactCheckResult,
  StyleAnalysisResult,
  DuplicateCheckResult,
  SensitivityResult,
} from '@/types';

// =============================================
// AI 프로바이더 인터페이스
// =============================================

/**
 * AI 프로바이더가 구현해야 하는 인터페이스
 * Base44와 Gemini 모두 이 인터페이스를 구현
 */
export interface AIProviderInterface {
  /** 프로바이더 이름 */
  readonly name: AIProvider;
  
  /** 프로바이더 초기화 */
  initialize(): Promise<void>;
  
  /** 프로바이더 사용 가능 여부 확인 */
  isAvailable(): boolean;
  
  /** 기본 텍스트 생성 */
  generateText(prompt: string, options?: GenerateOptions): Promise<string>;
  
  /** JSON 형식 응답 생성 */
  generateJSON<T>(prompt: string, options?: GenerateOptions): Promise<T>;
}

/**
 * 텍스트 생성 옵션
 */
export interface GenerateOptions {
  /** 최대 토큰 수 */
  maxTokens?: number;
  /** 온도 (창의성 조절, 0-1) */
  temperature?: number;
  /** 시스템 프롬프트 */
  systemPrompt?: string;
  /** 타임아웃 (ms) */
  timeout?: number;
}

// =============================================
// AI 기능별 요청/응답 타입
// =============================================

/** 문체 통일 요청 */
export interface StyleUnifyRequest extends AIRequest {
  feature: 'style-unify';
  options?: {
    targetStyle?: 'formal' | 'casual' | 'news';
  };
}

/** 팩트체크 요청 */
export interface FactCheckRequest extends AIRequest {
  feature: 'fact-check';
  options?: {
    checkDates?: boolean;
    checkNames?: boolean;
    checkFacts?: boolean;
  };
}

/** 자동 태그 생성 요청 */
export interface AutoTagRequest extends AIRequest {
  feature: 'auto-tag';
  options?: {
    maxTags?: number;
    includePersons?: boolean;
    includeEvents?: boolean;
  };
}

/** 중복 검사 요청 */
export interface DuplicateCheckRequest extends AIRequest {
  feature: 'duplicate-check';
  options?: {
    threshold?: number; // 유사도 임계값 (0-100)
  };
}

/** 요약 요청 */
export interface SummarizeRequest extends AIRequest {
  feature: 'summarize';
  options?: {
    type?: 'brief' | 'detailed' | 'sns' | 'seo';
    maxLength?: number;
  };
}

/** 리라이팅 요청 */
export interface RewriteRequest extends AIRequest {
  feature: 'rewrite';
  options?: {
    style?: 'formal' | 'casual' | 'engaging';
    keepLength?: boolean;
  };
}

/** 카테고리 추천 요청 */
export interface CategorySuggestRequest extends AIRequest {
  feature: 'category-suggest';
}

/** 민감도 검사 요청 */
export interface SensitivityCheckRequest extends AIRequest {
  feature: 'sensitivity-check';
  options?: {
    strictMode?: boolean;
  };
}

/** 유사도 검사 요청 */
export interface SimilarityCheckRequest extends AIRequest {
  feature: 'similarity-check';
  options?: {
    compareWith?: string[]; // 비교할 기사 ID 목록
  };
}

// =============================================
// 응답 타입 매핑
// =============================================

export type AIFeatureResponse = {
  'style-unify': StyleAnalysisResult;
  'fact-check': FactCheckResult;
  'auto-tag': AutoTagResponse;
  'duplicate-check': DuplicateCheckResult;
  'summarize': SummarizeResponse;
  'rewrite': { rewrittenContent: string };
  'category-suggest': CategorySuggestResponse;
  'sensitivity-check': SensitivityResult;
  'similarity-check': { similarArticles: { id: string; similarity: number }[] };
};

// =============================================
// 프롬프트 템플릿 타입
// =============================================

export interface PromptTemplate {
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  outputFormat?: 'text' | 'json';
  jsonSchema?: Record<string, unknown>;
}

// Re-export for convenience
export type {
  AIFeatureType,
  AIProvider,
  AIRequest,
  AIResponse,
  AutoTagResponse,
  SummarizeResponse,
  CategorySuggestResponse,
  FactCheckResult,
  StyleAnalysisResult,
  DuplicateCheckResult,
  SensitivityResult,
};

