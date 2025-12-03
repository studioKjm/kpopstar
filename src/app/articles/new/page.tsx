'use client';

import { MainLayout } from '@/components/layout';
import { ArticleEditor } from '@/components/article';
import { useArticleStore } from '@/store/articleStore';
import type { Article } from '@/types';

/**
 * 새 기사 작성 페이지
 */
export default function NewArticlePage() {
  const { addArticle } = useArticleStore();

  // 기사 저장 핸들러
  const handleSave = (articleData: Partial<Article>) => {
    console.log('Saving draft:', articleData);
    // TODO: 실제 저장 로직 구현
  };

  // 기사 발행 핸들러
  const handlePublish = (articleData: Partial<Article>) => {
    const newArticle: Article = {
      id: `article-${Date.now()}`,
      title: articleData.title || '',
      subtitle: articleData.subtitle,
      content: articleData.content || '',
      summary: articleData.summary,
      category: articleData.category || '스타뉴스',
      subCategory: articleData.subCategory,
      tags: articleData.tags || [],
      author: {
        id: 'author-1',
        name: '김기자',
        email: 'reporter@kpopstar.ai.kr',
        role: 'reporter',
      },
      status: 'published',
      exposureOptions: articleData.exposureOptions || {
        isHeadline: false,
        isImportant: false,
        isTrendingCandidate: false,
        isStarTrend: false,
      },
      imageUrls: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      viewCount: 0,
    };

    addArticle(newArticle);
    console.log('Published:', newArticle);
  };

  return (
    <MainLayout
      title="새 기사 작성"
      subtitle="AI 도구를 활용하여 기사를 작성하세요"
    >
      <ArticleEditor
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </MainLayout>
  );
}

