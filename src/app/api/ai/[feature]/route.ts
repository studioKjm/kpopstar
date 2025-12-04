/**
 * AI 기능 API Route
 * 서버 사이드에서 AI 기능을 호출하여 API 키 보호
 * 
 * GET /api/ai/[feature]?content=...
 * POST /api/ai/[feature] - body: { content, options }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateTags,
  checkFacts,
  unifyStyle,
  checkDuplicates,
  summarize,
  suggestCategory,
  checkSensitivity,
  checkSpelling,
  runFullValidation,
} from '@/lib/ai/features';
import { initializeAllProviders } from '@/lib/ai/providers';

// AI 기능 매핑
const AI_FEATURES: Record<string, (content: string, options?: any) => Promise<any>> = {
  'auto-tag': async (content, options) => generateTags(content, options?.maxTags),
  'fact-check': checkFacts,
  'style-unify': unifyStyle,
  'duplicate-check': checkDuplicates,
  'summarize': async (content, options) => summarize(content, options?.type || 'brief'),
  'category-suggest': suggestCategory,
  'sensitivity-check': checkSensitivity,
  'spell-check': checkSpelling,
};

/**
 * GET: 간단한 AI 기능 호출
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { feature: string } }
) {
  try {
    // 프로바이더 초기화
    await initializeAllProviders();

    const { searchParams } = new URL(request.url);
    const content = searchParams.get('content');
    const feature = params.feature;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (feature === 'full-validation') {
      const result = await runFullValidation(content);
      return NextResponse.json({ success: true, data: result });
    }

    const featureHandler = AI_FEATURES[feature];
    if (!featureHandler) {
      return NextResponse.json(
        { success: false, error: `Unknown feature: ${feature}` },
        { status: 400 }
      );
    }

    const result = await featureHandler(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[AI API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * POST: 옵션을 포함한 AI 기능 호출
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { feature: string } }
) {
  try {
    // 프로바이더 초기화
    await initializeAllProviders();

    const body = await request.json();
    const { title, subtitle, content, options } = body;
    const feature = params.feature;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (feature === 'full-validation') {
      const result = await runFullValidation(content, title, subtitle);
      return NextResponse.json({ success: true, data: result });
    }

    const featureHandler = AI_FEATURES[feature];
    if (!featureHandler) {
      return NextResponse.json(
        { success: false, error: `Unknown feature: ${feature}` },
        { status: 400 }
      );
    }

    // 팩트체크와 오탈자 체크는 제목과 부제목을 함께 전달
    if (feature === 'fact-check') {
      const result = await checkFacts(content, title, subtitle);
      return NextResponse.json(result);
    }

    if (feature === 'spell-check') {
      const result = await checkSpelling(content, title, subtitle);
      return NextResponse.json(result);
    }

    const result = await featureHandler(content, options);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[AI API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

