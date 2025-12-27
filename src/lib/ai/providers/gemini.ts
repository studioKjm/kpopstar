/**
 * Google Gemini AI 프로바이더
 * Gemini Pro API를 사용하는 구현체
 * 
 * TODO: Gemini API 연동 시 실제 구현 필요
 */

import type { AIProviderInterface, GenerateOptions } from '../types';

/**
 * Gemini 프로바이더 설정
 */
interface GeminiConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

/**
 * Gemini AI 프로바이더 클래스
 */
export class GeminiProvider implements AIProviderInterface {
  readonly name = 'gemini' as const;
  
  private config: GeminiConfig;
  private initialized = false;

  constructor(config: GeminiConfig = {}) {
    this.config = {
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      model: 'gemini-2.0-flash', // 사용 가능한 모델: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash
      apiKey: process.env.GEMINI_API_KEY,
      ...config,
    };
  }

  /**
   * 프로바이더 초기화
   */
  async initialize(): Promise<void> {
    if (!this.config.apiKey) {
      console.warn('[Gemini] API key is not configured');
      this.initialized = false;
      return;
    }
    
    // API 키 형식 간단 검증 (실제 API 호출은 첫 사용 시 검증)
    if (!this.config.apiKey.startsWith('AIza')) {
      console.warn('[Gemini] API key format may be invalid');
    }
    
    console.log('[Gemini] Provider initialized successfully');
    this.initialized = true;
  }

  /**
   * 프로바이더 사용 가능 여부 확인
   */
  isAvailable(): boolean {
    return this.initialized && !!this.config.apiKey;
  }

  /**
   * 텍스트 생성
   */
  async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Gemini provider is not available. Please check API key configuration.');
    }

    const url = `${this.config.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;
    
    const fullPrompt = options?.systemPrompt 
      ? `${options.systemPrompt}\n\n${prompt}`
      : prompt;

    const timeout = options?.timeout || 30000; // 기본 30초
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: fullPrompt }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: options?.maxTokens || 1000,
            temperature: options?.temperature ?? 0.7,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // 429 할당량 초과 에러 특별 처리
        if (response.status === 429) {
          const errorMessage = errorData?.error?.message || '';
          const retryDelay = errorData?.error?.details?.find(
            (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
          )?.retryDelay || '17s';
          
          // 재시도 가능 시간 추출 (초 단위)
          const retrySeconds = parseInt(retryDelay.replace('s', '')) || 17;
          const retryMinutes = Math.floor(retrySeconds / 60);
          const remainingSeconds = retrySeconds % 60;
          
          // 할당량 유형 확인 (일일 vs 분당)
          const quotaViolations = errorData?.error?.details?.find(
            (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.QuotaFailure'
          )?.violations || [];
          
          const isDailyLimit = quotaViolations.some((v: any) => 
            v.quotaMetric?.includes('PerDay') || v.quotaId?.includes('PerDay')
          );
          const isMinuteLimit = quotaViolations.some((v: any) => 
            v.quotaMetric?.includes('PerMinute') || v.quotaId?.includes('PerMinute')
          );
          
          let quotaType = '';
          let resetTime = '';
          
          if (isDailyLimit) {
            quotaType = '일일 요청 한도';
            resetTime = '내일 오전 10시 (한국 시간)';
          } else if (isMinuteLimit) {
            quotaType = '분당 요청 한도';
            resetTime = retrySeconds < 60 
              ? `${retrySeconds}초 후` 
              : `${retryMinutes}분 ${remainingSeconds > 0 ? `${remainingSeconds}초` : ''} 후`;
          } else {
            quotaType = '요청 한도';
            resetTime = retrySeconds < 60 
              ? `${retrySeconds}초 후` 
              : `${retryMinutes}분 ${remainingSeconds > 0 ? `${remainingSeconds}초` : ''} 후`;
          }
          
          throw new Error(
            `Gemini API 할당량 초과\n\n` +
            `무료 티어의 ${quotaType}를 초과했습니다.\n` +
            `재시도 가능: ${resetTime}\n\n` +
            `해결 방법:\n` +
            `1. ${resetTime} 다시 시도\n` +
            `2. 할당량 확인: https://ai.dev/usage?tab=rate-limit\n` +
            `3. 유료 플랜 업그레이드 고려`
          );
        }
        
        // 기타 API 에러
        throw new Error(`Gemini API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Gemini API request timeout');
      }
      throw error;
    }
  }

  /**
   * JSON 형식 응답 생성
   */
  async generateJSON<T>(prompt: string, options?: GenerateOptions): Promise<T> {
    const jsonPrompt = `${prompt}\n\n중요: 응답은 반드시 유효한 JSON 형식이어야 합니다. 다른 설명이나 텍스트 없이 순수 JSON만 출력하세요. JSON은 마크다운 코드 블록 없이 직접 출력해야 합니다.`;
    
    const response = await this.generateText(jsonPrompt, {
      ...options,
      temperature: 0.3, // JSON 생성 시 낮은 온도로 일관성 확보
    });

    // JSON 추출 (마크다운 코드 블록 처리)
    let jsonStr = response.trim();
    
    // 마크다운 코드 블록 제거 (여러 패턴 시도)
    // ```json ... ``` 패턴
    let jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // ``` ... ``` 패턴
      jsonMatch = jsonStr.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
    }

    // 앞뒤 불필요한 텍스트 제거 (예: "```json" 같은 부분이 남아있을 수 있음)
    jsonStr = jsonStr.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    // JSON 파싱 시도
    try {
      return JSON.parse(jsonStr) as T;
    } catch (parseError) {
      // 파싱 실패 시 JSON 복구 시도
      let cleanedJson = jsonStr;
      
      // 1. 첫 번째 완전한 JSON 객체 추출 (중괄호 매칭, 문자열 내부 고려)
      let braceCount = 0;
      let startIdx = cleanedJson.indexOf('{');
      let endIdx = -1;
      let inString = false;
      let escapeNext = false;
      
      if (startIdx !== -1) {
        for (let i = startIdx; i < cleanedJson.length; i++) {
          const char = cleanedJson[i];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }
          
          // 문자열 내부가 아닌 경우에만 중괄호 카운트
          if (!inString) {
            if (char === '{') {
              braceCount++;
            } else if (char === '}') {
              braceCount--;
              if (braceCount === 0) {
                endIdx = i + 1;
                break;
              }
            }
          }
        }
        
        if (endIdx > startIdx) {
          cleanedJson = cleanedJson.substring(startIdx, endIdx);
        }
      }
      
      // 2. 불완전한 JSON 수정
      // - 마지막 쉼표 제거
      cleanedJson = cleanedJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      // - 배열 마지막 쉼표 제거
      cleanedJson = cleanedJson.replace(/,\s*\]/g, ']');
      
      // 3. 첫 번째 시도: 수정된 JSON 파싱
      try {
        return JSON.parse(cleanedJson) as T;
      } catch (e1) {
        // 4. 두 번째 시도: 문자열 내 제대로 이스케이프되지 않은 따옴표 처리
        // 속성 값 내 큰따옴표를 이스케이프
        let escapedJson = cleanedJson;
        // 속성 값 패턴: "key": "value" 에서 value 내 따옴표 이스케이프
        escapedJson = escapedJson.replace(/:\s*"([^"]*(?:\\.[^"]*)*)"/g, (match, value) => {
          // 이미 이스케이프된 따옴표는 제외하고 처리
          const escaped = value.replace(/(?<!\\)"/g, '\\"');
          return `: "${escaped}"`;
        });
        
        try {
          return JSON.parse(escapedJson) as T;
        } catch (e2) {
          // 5. 최종 시도: 에러 위치 주변 컨텍스트 확인하여 수동 복구
          const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown error';
          const posMatch = errorMsg.match(/position (\d+)/);
          const pos = posMatch ? parseInt(posMatch[1]) : -1;
          
          if (pos > 0 && pos < cleanedJson.length) {
            // 에러 위치 주변 확인
            const contextStart = Math.max(0, pos - 100);
            const contextEnd = Math.min(cleanedJson.length, pos + 100);
            const context = cleanedJson.substring(contextStart, contextEnd);
            
            // 문자열 내 따옴표 문제 수정 시도
            let fixedJson = cleanedJson;
            
            // 방법 1: 닫히지 않은 문자열 찾아서 닫기
            let inString = false;
            let stringStart = -1;
            let fixedChars: string[] = [];
            
            for (let i = 0; i < fixedJson.length; i++) {
              const char = fixedJson[i];
              const prevChar = i > 0 ? fixedJson[i - 1] : '';
              
              if (prevChar !== '\\' && char === '"') {
                if (!inString) {
                  inString = true;
                  stringStart = i;
                } else {
                  inString = false;
                  stringStart = -1;
                }
                fixedChars.push(char);
              } else if (inString && (char === '\n' || char === '\r')) {
                // 문자열 내 줄바꿈은 이스케이프 처리
                fixedChars.push('\\n');
              } else if (inString && i === fixedJson.length - 1) {
                // 문자열이 끝까지 닫히지 않은 경우 닫기
                fixedChars.push(char);
                fixedChars.push('"');
                inString = false;
              } else {
                fixedChars.push(char);
              }
            }
            
            fixedJson = fixedChars.join('');
            
            // 방법 2: 불완전한 속성 값 복구
            fixedJson = fixedJson.replace(/:\s*"([^"]*?)(?:"|,|\n|\r|$)/g, (match, value, end) => {
              if (!end || end === '\n' || end === '\r' || end === '') {
                // 따옴표가 닫히지 않은 경우 닫기
                const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                return `: "${escaped}"${end || ''}`;
              }
              return match;
            });
            
            try {
              return JSON.parse(fixedJson) as T;
            } catch (e3) {
              throw new Error(
                `Failed to parse JSON response from Gemini: ${errorMsg}\n` +
                `Error position: ${pos}\n` +
                `Context: ${context}\n` +
                `Response (first 800 chars): ${jsonStr.substring(0, 800)}`
              );
            }
          }
          
          throw new Error(
            `Failed to parse JSON response from Gemini: ${errorMsg}\n` +
            `Response (first 800 chars): ${jsonStr.substring(0, 800)}`
          );
        }
      }
    }
  }
}

/**
 * Gemini 프로바이더 싱글톤 인스턴스
 */
let geminiInstance: GeminiProvider | null = null;

export function getGeminiProvider(config?: GeminiConfig): GeminiProvider {
  if (!geminiInstance) {
    geminiInstance = new GeminiProvider(config);
  }
  return geminiInstance;
}

/**
 * Gemini 프로바이더 초기화 및 반환
 */
export async function initializeGemini(config?: GeminiConfig): Promise<GeminiProvider> {
  const provider = getGeminiProvider(config);
  await provider.initialize();
  return provider;
}

