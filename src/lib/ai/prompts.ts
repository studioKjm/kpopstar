/**
 * AI 프롬프트 템플릿 모음
 * 모든 AI 기능에서 사용되는 프롬프트를 중앙 관리
 */

import type { PromptTemplate } from './types';

// =============================================
// 시스템 프롬프트 (공통)
// =============================================

export const SYSTEM_PROMPTS = {
  /** K-POP 뉴스 전문가 역할 */
  KPOP_NEWS_EXPERT: `당신은 K-POP 및 연예 뉴스 전문 에디터입니다.
한국 엔터테인먼트 산업에 대한 깊은 이해를 바탕으로,
정확하고 전문적인 기사 분석 및 편집 지원을 제공합니다.

주요 역할:
- 기사 문체 분석 및 통일
- 팩트체크 및 사실 관계 검증
- 민감한 표현 감지 및 대안 제시
- SEO 최적화 태그 생성

응답 시 주의사항:
- 항상 한국어로 응답
- 객관적이고 중립적인 관점 유지
- 구체적인 개선 제안 포함`,

  /** JSON 응답 전용 */
  JSON_RESPONDER: `당신은 정확한 JSON 형식으로만 응답하는 AI입니다.
응답에 추가 설명이나 마크다운 형식을 사용하지 마세요.
오직 유효한 JSON만 출력하세요.`,
} as const;

// =============================================
// 기능별 프롬프트 템플릿
// =============================================

/**
 * 문체 통일 프롬프트
 */
export const STYLE_UNIFY_PROMPT: PromptTemplate = {
  name: 'style-unify',
  description: '연예 뉴스 문체로 통일',
  systemPrompt: SYSTEM_PROMPTS.KPOP_NEWS_EXPERT,
  userPromptTemplate: `다음 기사의 문체를 분석하고 연예 뉴스 스타일로 통일해주세요.

[기사 내용]
{{content}}

[분석 및 수정 요청]
1. 현재 문체의 일관성 분석
2. 연예 뉴스 표준 문체 패턴:
   - "~임을 밝혔다"
   - "~라고 전했다"
   - "~라고 답했다"
   - "~기대를 모으고 있다"
   - "관심이 모인다"
3. 수정이 필요한 문장과 제안 문장 제시

JSON 형식으로 응답:
{
  "isConsistent": boolean,
  "suggestions": [
    {
      "original": "원본 문장",
      "suggested": "수정 제안",
      "reason": "수정 이유"
    }
  ]
}`,
  outputFormat: 'json',
};

/**
 * 팩트체크 프롬프트
 */
export const FACT_CHECK_PROMPT: PromptTemplate = {
  name: 'fact-check',
  description: '사실 관계 및 일정 검증',
  systemPrompt: SYSTEM_PROMPTS.KPOP_NEWS_EXPERT,
  userPromptTemplate: `다음 기사의 사실 관계를 검증해주세요.

[기사 내용]
{{content}}

[검증 항목]
1. 인물/그룹명 정확도
   - 멤버 이름, 소속사, 그룹명 확인
2. 날짜/일정 정확도
   - 컴백일, 발매일, 공연일 등
3. 사실 관계 일관성
   - 기사 내 정보 모순 여부

JSON 형식으로 응답:
{
  "isValid": boolean,
  "issues": [
    {
      "type": "date" | "name" | "fact" | "schedule",
      "severity": "warning" | "error",
      "message": "문제 설명",
      "suggestion": "수정 제안 (선택)"
    }
  ]
}`,
  outputFormat: 'json',
};

/**
 * 자동 태그 생성 프롬프트
 */
export const AUTO_TAG_PROMPT: PromptTemplate = {
  name: 'auto-tag',
  description: '기사 기반 태그 자동 생성',
  systemPrompt: SYSTEM_PROMPTS.KPOP_NEWS_EXPERT,
  userPromptTemplate: `다음 기사에서 적절한 태그를 추출해주세요.

[기사 내용]
{{content}}

[태그 추출 기준]
1. 인물명 (아티스트, 멤버 이름)
2. 그룹명
3. 앨범/곡명
4. 이벤트명 (콘서트, 시상식 등)
5. 키워드 (컴백, 데뷔, 월드투어 등)

최대 {{maxTags}}개의 태그를 생성하세요.

JSON 형식으로 응답:
{
  "tags": ["태그1", "태그2", ...],
  "confidence": [0.95, 0.87, ...] // 각 태그의 신뢰도 (0-1)
}`,
  outputFormat: 'json',
};

/**
 * 중복 검사 프롬프트
 */
export const DUPLICATE_CHECK_PROMPT: PromptTemplate = {
  name: 'duplicate-check',
  description: '기사 내 중복 정보 탐지',
  systemPrompt: SYSTEM_PROMPTS.KPOP_NEWS_EXPERT,
  userPromptTemplate: `다음 기사에서 중복되는 정보나 문장을 찾아주세요.

[기사 내용]
{{content}}

[검사 항목]
1. 리드와 본문 간 동일 정보 반복
2. 동일한 문체/표현 반복 사용
3. 불필요한 정보 중복

JSON 형식으로 응답:
{
  "hasDuplicates": boolean,
  "duplicates": [
    {
      "text": "중복된 텍스트",
      "occurrences": 2,
      "positions": [{"start": 0, "end": 50}, {"start": 200, "end": 250}]
    }
  ],
  "similarArticles": [] // 유사 기사가 있으면 추가
}`,
  outputFormat: 'json',
};

/**
 * 요약 프롬프트
 */
export const SUMMARIZE_PROMPT: PromptTemplate = {
  name: 'summarize',
  description: '기사 요약 생성',
  systemPrompt: SYSTEM_PROMPTS.KPOP_NEWS_EXPERT,
  userPromptTemplate: `다음 기사를 요약해주세요.

[기사 내용]
{{content}}

[요약 유형: {{type}}]
- brief: 1-2문장 핵심 요약
- detailed: 주요 포인트 포함 상세 요약
- sns: SNS 공유용 짧은 요약 (이모지 포함 가능)
- seo: SEO 최적화된 메타 설명

JSON 형식으로 응답:
{
  "summary": "요약 내용",
  "keyPoints": ["핵심 포인트 1", "핵심 포인트 2", ...],
  "snsVersion": "SNS용 버전 (sns 타입일 때)",
  "seoVersion": "SEO용 버전 (seo 타입일 때)"
}`,
  outputFormat: 'json',
};

/**
 * 카테고리 추천 프롬프트
 */
export const CATEGORY_SUGGEST_PROMPT: PromptTemplate = {
  name: 'category-suggest',
  description: 'K-POP 뉴스 카테고리 자동 분류',
  systemPrompt: SYSTEM_PROMPTS.KPOP_NEWS_EXPERT,
  userPromptTemplate: `다음 기사의 적절한 카테고리를 추천해주세요.

[기사 내용]
{{content}}

[카테고리 옵션]
- 스타뉴스: 연예인 관련 일반 뉴스
- 엔터테인먼트: 음악 / 방송영화 / 공연
- 스타트렌드: 트렌드, 패션, 라이프스타일
- 이슈: 논란, 사건사고
- 종합: 복합적인 내용
- 실시간인기: 화제성 높은 기사

JSON 형식으로 응답:
{
  "category": "메인 카테고리",
  "subCategory": "서브 카테고리 (엔터테인먼트인 경우)",
  "confidence": 0.95,
  "alternatives": [
    {"category": "대안 카테고리", "confidence": 0.7}
  ]
}`,
  outputFormat: 'json',
};

/**
 * 민감도 검사 프롬프트
 */
export const SENSITIVITY_CHECK_PROMPT: PromptTemplate = {
  name: 'sensitivity-check',
  description: '민감한 표현 및 금칙어 검사',
  systemPrompt: SYSTEM_PROMPTS.KPOP_NEWS_EXPERT,
  userPromptTemplate: `다음 기사에서 민감한 표현이나 부적절한 내용을 검사해주세요.

[기사 내용]
{{content}}

[검사 항목]
1. 공격적/비하 표현
2. 논란 유발 가능 표현
3. 개인정보 노출
4. 명예훼손 가능 표현
5. 성적/선정적 표현

JSON 형식으로 응답:
{
  "hasSensitiveContent": boolean,
  "items": [
    {
      "type": "offensive" | "controversial" | "privacy" | "defamation",
      "severity": "low" | "medium" | "high",
      "text": "문제 표현",
      "suggestion": "대체 표현 제안"
    }
  ]
}`,
  outputFormat: 'json',
};

// =============================================
// 프롬프트 유틸리티 함수
// =============================================

/**
 * 프롬프트 템플릿에 변수 대입
 */
export function fillPromptTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  }
  
  return result;
}

/**
 * 기능별 프롬프트 가져오기
 */
export function getPromptByFeature(feature: string): PromptTemplate | null {
  const prompts: Record<string, PromptTemplate> = {
    'style-unify': STYLE_UNIFY_PROMPT,
    'fact-check': FACT_CHECK_PROMPT,
    'auto-tag': AUTO_TAG_PROMPT,
    'duplicate-check': DUPLICATE_CHECK_PROMPT,
    'summarize': SUMMARIZE_PROMPT,
    'category-suggest': CATEGORY_SUGGEST_PROMPT,
    'sensitivity-check': SENSITIVITY_CHECK_PROMPT,
  };
  
  return prompts[feature] || null;
}

