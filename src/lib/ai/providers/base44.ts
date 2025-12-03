/**
 * Base44 AI 프로바이더
 * Base44 플랫폼의 AI 기능을 사용하는 구현체
 * 
 * TODO: Base44 API 연동 시 실제 구현 필요
 */

import type { AIProviderInterface, GenerateOptions } from '../types';

/**
 * Base44 프로바이더 설정
 */
interface Base44Config {
  apiKey?: string;
  projectId?: string;
  baseUrl?: string;
}

/**
 * Base44 AI 프로바이더 클래스
 */
export class Base44Provider implements AIProviderInterface {
  readonly name = 'base44' as const;
  
  private config: Base44Config;
  private initialized = false;

  constructor(config: Base44Config = {}) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_BASE44_URL || 'https://api.base44.com',
      apiKey: process.env.BASE44_API_KEY,
      projectId: process.env.BASE44_PROJECT_ID,
      ...config,
    };
  }

  /**
   * 프로바이더 초기화
   */
  async initialize(): Promise<void> {
    if (!this.config.apiKey) {
      console.warn('[Base44] API key is not configured');
      this.initialized = false;
      return;
    }
    
    // API 키만 확인 (실제 API 호출은 첫 사용 시 검증)
    console.log('[Base44] Provider initialized successfully');
    this.initialized = true;
  }

  /**
   * 프로바이더 사용 가능 여부 확인
   */
  isAvailable(): boolean {
    // TODO: 실제 연결 상태 확인 로직 구현
    return this.initialized && !!this.config.apiKey;
  }

  /**
   * 텍스트 생성
   */
  async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Base44 provider is not available. Please check API key configuration.');
    }

    // Base44 AI Functions 엔드포인트
    // 실제 Base44 플랫폼의 엔드포인트 구조에 맞게 조정 필요
    const url = `${this.config.baseUrl}/v1/chat/completions`;
    
    const timeout = options?.timeout || 30000; // 기본 30초
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const messages = [];
      
      if (options?.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          ...(this.config.projectId && { 'X-Project-Id': this.config.projectId }),
        },
        body: JSON.stringify({
          model: 'gpt-4', // Base44가 사용하는 모델 (실제로는 Base44 설정에 따라 다를 수 있음)
          messages,
          max_tokens: options?.maxTokens || 1000,
          temperature: options?.temperature ?? 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Base44 API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      
      // Base44 응답 형식에 맞게 파싱 (일반적인 OpenAI 호환 형식 가정)
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      }
      
      // 다른 응답 형식 시도
      if (data.result || data.text || data.content) {
        return data.result || data.text || data.content;
      }

      throw new Error('Invalid response format from Base44 API');
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Base44 API request timeout');
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
    
    // 마크다운 코드 블록 제거
    const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/) || 
                      jsonStr.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // JSON 파싱 시도
    try {
      return JSON.parse(jsonStr) as T;
    } catch (parseError) {
      // 파싱 실패 시 첫 번째 JSON 객체만 추출 시도
      const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        try {
          return JSON.parse(jsonObjectMatch[0]) as T;
        } catch {
          throw new Error(`Failed to parse JSON response from Base44: ${parseError instanceof Error ? parseError.message : 'Unknown error'}\nResponse: ${jsonStr.substring(0, 200)}`);
        }
      }
      throw new Error(`Invalid JSON response from Base44: ${jsonStr.substring(0, 200)}`);
    }
  }
}

/**
 * Base44 프로바이더 싱글톤 인스턴스
 */
let base44Instance: Base44Provider | null = null;

export function getBase44Provider(config?: Base44Config): Base44Provider {
  if (!base44Instance) {
    base44Instance = new Base44Provider(config);
  }
  return base44Instance;
}

/**
 * Base44 프로바이더 초기화 및 반환
 */
export async function initializeBase44(config?: Base44Config): Promise<Base44Provider> {
  const provider = getBase44Provider(config);
  await provider.initialize();
  return provider;
}

