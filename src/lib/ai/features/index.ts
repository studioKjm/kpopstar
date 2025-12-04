/**
 * AI 기능 모듈 통합
 * 각 AI 기능을 독립적인 함수로 제공
 * 
 * 사용 예시:
 * import { generateTags, checkFacts, unifyStyle } from '@/lib/ai/features';
 * 
 * const tags = await generateTags(articleContent);
 * const factCheckResult = await checkFacts(articleContent);
 */

import { getActiveProvider } from '../providers';
import { fillPromptTemplate, getPromptByFeature } from '../prompts';
import type {
  AIResponse,
  AutoTagResponse,
  SummarizeResponse,
  CategorySuggestResponse,
  FactCheckResult,
  StyleAnalysisResult,
  DuplicateCheckResult,
  SensitivityResult,
  SpellCheckResult,
} from '../types';

// =============================================
// 공통 헬퍼 함수
// =============================================

/**
 * AI 기능 실행 래퍼
 * 에러 처리 및 로깅을 포함
 */
async function executeAIFeature<T>(
  featureName: string,
  content: string,
  variables: Record<string, string | number> = {}
): Promise<AIResponse<T>> {
  const startTime = Date.now();
  
  try {
    const provider = getActiveProvider();
    const promptTemplate = getPromptByFeature(featureName);
    
    if (!promptTemplate) {
      throw new Error(`Unknown feature: ${featureName}`);
    }
    
    // 프롬프트 생성
    const prompt = fillPromptTemplate(promptTemplate.userPromptTemplate, {
      content,
      ...variables,
    });
    
    // AI 호출
    const result = await provider.generateJSON<T>(prompt, {
      systemPrompt: promptTemplate.systemPrompt,
    });
    
    return {
      success: true,
      data: result,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error(`[AI:${featureName}] Error:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processingTime: Date.now() - startTime,
    };
  }
}

// =============================================
// AI 기능 함수들
// =============================================

/**
 * 자동 태그 생성
 * 기사 내용을 분석하여 관련 태그를 추출
 * 
 * @param content - 기사 본문
 * @param maxTags - 최대 태그 수 (기본: 10)
 */
export async function generateTags(
  content: string,
  maxTags = 10
): Promise<AIResponse<AutoTagResponse>> {
  return executeAIFeature<AutoTagResponse>('auto-tag', content, { maxTags });
}

/**
 * 팩트체크
 * 기사의 사실 관계, 날짜, 인물 정보 등을 검증
 * 
 * @param content - 기사 본문
 * @param title - 기사 제목 (선택)
 * @param subtitle - 기사 부제목 (선택)
 */
export async function checkFacts(
  content: string,
  title?: string,
  subtitle?: string
): Promise<AIResponse<FactCheckResult>> {
  // 제목과 본문을 합쳐서 검증
  const fullContent = [title, subtitle, content].filter(Boolean).join('\n\n');
  return executeAIFeature<FactCheckResult>('fact-check', fullContent, {
    title: title || '',
    subtitle: subtitle || '',
    content,
  });
}

/**
 * 문체 통일
 * 연예 뉴스 스타일로 문체를 분석하고 통일 제안
 * 
 * @param content - 기사 본문
 */
export async function unifyStyle(
  content: string
): Promise<AIResponse<StyleAnalysisResult>> {
  return executeAIFeature<StyleAnalysisResult>('style-unify', content);
}

/**
 * 중복 검사
 * 기사 내 중복 정보 및 유사 기사 탐지
 * 
 * @param content - 기사 본문
 */
export async function checkDuplicates(
  content: string
): Promise<AIResponse<DuplicateCheckResult>> {
  return executeAIFeature<DuplicateCheckResult>('duplicate-check', content);
}

/**
 * 기사 요약
 * 다양한 형식의 요약 생성 (간략, 상세, SNS, SEO)
 * 
 * @param content - 기사 본문
 * @param type - 요약 유형
 */
export async function summarize(
  content: string,
  type: 'brief' | 'detailed' | 'sns' | 'seo' = 'brief'
): Promise<AIResponse<SummarizeResponse>> {
  return executeAIFeature<SummarizeResponse>('summarize', content, { type });
}

/**
 * 카테고리 추천
 * 기사 내용 기반 자동 카테고리 분류
 * 
 * @param content - 기사 본문
 */
export async function suggestCategory(
  content: string
): Promise<AIResponse<CategorySuggestResponse>> {
  return executeAIFeature<CategorySuggestResponse>('category-suggest', content);
}

/**
 * 민감도 검사
 * 부적절한 표현, 금칙어, 민감한 내용 탐지
 * 
 * @param content - 기사 본문
 */
export async function checkSensitivity(
  content: string
): Promise<AIResponse<SensitivityResult>> {
  return executeAIFeature<SensitivityResult>('sensitivity-check', content);
}

/**
 * 오탈자 체크
 * 맞춤법, 띄어쓰기, 문법 오류 검사
 * 
 * @param content - 기사 본문
 * @param title - 기사 제목 (선택)
 * @param subtitle - 기사 부제목 (선택)
 */
export async function checkSpelling(
  content: string,
  title?: string,
  subtitle?: string
): Promise<AIResponse<SpellCheckResult>> {
  // 제목과 본문을 합쳐서 검증
  const fullContent = [title, subtitle, content].filter(Boolean).join('\n\n');
  return executeAIFeature<SpellCheckResult>('spell-check', fullContent, {
    title: title || '',
    subtitle: subtitle || '',
    content,
  });
}

// =============================================
// 통합 검수 기능
// =============================================

/**
 * 전체 AI 검수 실행
 * 모든 AI 검수 기능을 한 번에 실행
 * 
 * @param content - 기사 본문
 * @param title - 기사 제목 (선택)
 * @param subtitle - 기사 부제목 (선택)
 */
export async function runFullValidation(
  content: string,
  title?: string,
  subtitle?: string
): Promise<{
  factCheck: AIResponse<FactCheckResult>;
  styleAnalysis: AIResponse<StyleAnalysisResult>;
  duplicateCheck: AIResponse<DuplicateCheckResult>;
  sensitivityCheck: AIResponse<SensitivityResult>;
}> {
  // 병렬로 모든 검수 실행
  const [factCheck, styleAnalysis, duplicateCheck, sensitivityCheck] = await Promise.all([
    checkFacts(content, title, subtitle),
    unifyStyle(content),
    checkDuplicates(content),
    checkSensitivity(content),
  ]);
  
  return {
    factCheck,
    styleAnalysis,
    duplicateCheck,
    sensitivityCheck,
  };
}

