/**
 * 전체 AI 검수 API Route
 * POST /api/ai/full-validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { runFullValidation } from '@/lib/ai/features';
import { initializeAllProviders } from '@/lib/ai/providers';

export async function POST(request: NextRequest) {
  try {
    // 프로바이더 초기화
    await initializeAllProviders();

    const body = await request.json();
    const { title, subtitle, content } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const result = await runFullValidation(content, title, subtitle);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('[AI API] Full validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

