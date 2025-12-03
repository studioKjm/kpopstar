/**
 * AI API 연동 테스트 엔드포인트
 * GET /api/ai/test - 프로바이더 상태 확인
 * POST /api/ai/test - 실제 API 호출 테스트
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getActiveProvider, 
  getActiveProviderType,
  getProvidersStatus,
  initializeAllProviders 
} from '@/lib/ai';

/**
 * GET: 프로바이더 상태 확인
 */
export async function GET() {
  try {
    // 모든 프로바이더 초기화
    await initializeAllProviders();
    
    const status = getProvidersStatus();
    const activeProvider = getActiveProviderType();
    const provider = getActiveProvider();
    
    return NextResponse.json({
      success: true,
      activeProvider,
      providers: {
        base44: {
          available: status.base44,
          name: 'Base44',
        },
        gemini: {
          available: status.gemini,
          name: 'Google Gemini',
        },
      },
      currentProvider: {
        type: activeProvider,
        available: provider.isAvailable(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST: 실제 API 호출 테스트
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType = 'text', prompt = '안녕하세요. 간단히 자기소개를 해주세요.' } = body;

    await initializeAllProviders();
    const provider = getActiveProvider();
    
    if (!provider.isAvailable()) {
      return NextResponse.json(
        {
          success: false,
          error: `Active provider (${getActiveProviderType()}) is not available. Please check API key configuration.`,
        },
        { status: 400 }
      );
    }

    let result: string | object;
    
    if (testType === 'json') {
      // JSON 응답 테스트
      result = await provider.generateJSON<{ message: string; timestamp: string }>(
        '다음 형식으로 JSON을 반환해주세요: {"message": "테스트 성공", "timestamp": "현재 시간"}',
        {
          maxTokens: 200,
          temperature: 0.3,
        }
      );
    } else {
      // 텍스트 응답 테스트
      result = await provider.generateText(prompt, {
        maxTokens: 500,
        temperature: 0.7,
        systemPrompt: '당신은 친절한 AI 어시스턴트입니다.',
      });
    }

    return NextResponse.json({
      success: true,
      provider: getActiveProviderType(),
      testType,
      prompt,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.stack : undefined)
          : undefined,
      },
      { status: 500 }
    );
  }
}

