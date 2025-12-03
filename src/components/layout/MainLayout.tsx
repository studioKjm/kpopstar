'use client';

import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * 메인 레이아웃 컴포넌트
 * - 사이드바 + 헤더 + 메인 콘텐츠 구조
 */
export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 영역 */}
      <div className="ml-64">
        {/* 헤더 */}
        <Header title={title} subtitle={subtitle} />

        {/* 콘텐츠 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

