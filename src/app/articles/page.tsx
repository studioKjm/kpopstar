'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { ArticleList, ArticleStats } from '@/components/article';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';

/**
 * 기사 목록 페이지
 */
export default function ArticlesPage() {
  return (
    <MainLayout
      title="기사 관리"
      subtitle="작성된 기사를 관리하고 새 기사를 작성하세요"
    >
      <div className="space-y-6">
        {/* 통계 카드 */}
        <ArticleStats />

        {/* 액션 바 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900">
            기사 목록
          </h2>
          
          <Link href="/articles/new">
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              새 기사 작성
            </Button>
          </Link>
        </div>

        {/* 기사 목록 */}
        <ArticleList
          onArticleEdit={(article) => {
            // TODO: 편집 페이지로 이동
            console.log('Edit:', article);
          }}
          onArticleDelete={(article) => {
            console.log('Deleted:', article);
          }}
        />
      </div>
    </MainLayout>
  );
}

