import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NewsFlow AI Console | kpopstar.ai.kr',
  description: 'AI 기반 뉴스 기사 관리 콘솔 - K-POP 및 연예 뉴스 작성, 검수, 발행',
  keywords: ['K-POP', '뉴스', 'AI', '기사 관리', 'CMS'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

