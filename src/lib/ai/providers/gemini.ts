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
      // 파싱 실패 시 첫 번째 JSON 객체만 추출 시도
      // 중괄호로 시작하고 끝나는 부분 찾기
      const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        try {
          return JSON.parse(jsonObjectMatch[0]) as T;
        } catch (e) {
          // 마지막 시도: 불완전한 JSON 수정 시도
          let cleanedJson = jsonObjectMatch[0];
          // 불완전한 문자열이나 특수문자 제거
          cleanedJson = cleanedJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          try {
            return JSON.parse(cleanedJson) as T;
          } catch {
            throw new Error(`Failed to parse JSON response from Gemini: ${parseError instanceof Error ? parseError.message : 'Unknown error'}\nResponse: ${jsonStr.substring(0, 300)}`);
          }
        }
      }
      throw new Error(`Invalid JSON response from Gemini. Expected JSON object but got: ${jsonStr.substring(0, 300)}`);
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

