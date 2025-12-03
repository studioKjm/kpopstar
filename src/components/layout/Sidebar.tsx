'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import {
  FileText,
  PenTool,
  LayoutGrid,
  Settings,
  TrendingUp,
  Sparkles,
  Users,
  Tag,
} from 'lucide-react';

// 네비게이션 메뉴 항목
const navItems = [
  {
    label: '기사 작성',
    href: '/articles/new',
    icon: PenTool,
    description: '새 기사 작성',
  },
  {
    label: '기사 목록',
    href: '/articles',
    icon: FileText,
    description: '기사 관리',
  },
  {
    label: '카테고리',
    href: '/categories',
    icon: LayoutGrid,
    description: '카테고리 관리',
  },
  {
    label: '태그',
    href: '/tags',
    icon: Tag,
    description: '태그 관리',
  },
  {
    label: '트렌드',
    href: '/trends',
    icon: TrendingUp,
    description: '실시간 인기',
  },
];

const bottomNavItems = [
  {
    label: '작성자 관리',
    href: '/authors',
    icon: Users,
  },
  {
    label: 'AI 설정',
    href: '/settings/ai',
    icon: Sparkles,
  },
  {
    label: '설정',
    href: '/settings',
    icon: Settings,
  },
];

/**
 * 사이드바 컴포넌트
 * - 메인 네비게이션
 * - AI 기능 바로가기
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-surface-200 flex flex-col">
      {/* 로고 영역 */}
      <div className="p-6 border-b border-surface-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-surface-900">
              NewsFlow
            </h1>
            <p className="text-xs text-surface-500">AI Console</p>
          </div>
        </Link>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
          기사 관리
        </p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-nav-item',
                isActive && 'active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="my-4 border-t border-surface-100" />

        <p className="px-4 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
          시스템
        </p>

        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-nav-item',
                isActive && 'active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* AI 상태 표시 */}
      <div className="p-4 border-t border-surface-100">
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-surface-700">AI 활성화</span>
          </div>
          <p className="text-xs text-surface-500">
            Gemini Pro 연결됨
          </p>
        </div>
      </div>
    </aside>
  );
}

