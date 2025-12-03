/**
 * AI 프로바이더 통합 모듈
 * Base44와 Gemini 프로바이더를 통합 관리
 */

import type { AIProvider, AIProviderInterface } from '../types';
import { Base44Provider, getBase44Provider, initializeBase44 } from './base44';
import { GeminiProvider, getGeminiProvider, initializeGemini } from './gemini';

// 프로바이더 클래스 내보내기
export { Base44Provider, GeminiProvider };
export { getBase44Provider, initializeBase44 };
export { getGeminiProvider, initializeGemini };

/**
 * 현재 활성화된 프로바이더 타입
 * 환경 변수로 설정 가능
 */
export function getActiveProviderType(): AIProvider {
  const providerEnv = process.env.NEXT_PUBLIC_AI_PROVIDER;
  
  if (providerEnv === 'gemini') {
    return 'gemini';
  }
  
  // 기본값: base44
  return 'base44';
}

/**
 * 활성 프로바이더 인스턴스 가져오기
 */
export function getActiveProvider(): AIProviderInterface {
  const providerType = getActiveProviderType();
  
  if (providerType === 'gemini') {
    return getGeminiProvider();
  }
  
  return getBase44Provider();
}

/**
 * 특정 프로바이더 인스턴스 가져오기
 */
export function getProvider(type: AIProvider): AIProviderInterface {
  if (type === 'gemini') {
    return getGeminiProvider();
  }
  
  return getBase44Provider();
}

/**
 * 모든 프로바이더 초기화
 */
export async function initializeAllProviders(): Promise<void> {
  await Promise.all([
    initializeBase44().catch((err) => {
      console.warn('[AI] Base44 initialization failed:', err.message);
    }),
    initializeGemini().catch((err) => {
      console.warn('[AI] Gemini initialization failed:', err.message);
    }),
  ]);
}

/**
 * 프로바이더 상태 확인
 */
export function getProvidersStatus(): Record<AIProvider, boolean> {
  return {
    base44: getBase44Provider().isAvailable(),
    gemini: getGeminiProvider().isAvailable(),
  };
}

