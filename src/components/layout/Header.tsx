'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button, Input } from '@/components/ui';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

/**
 * 헤더 컴포넌트
 * - 페이지 제목
 * - 검색
 * - 사용자 메뉴
 */
export function Header({ title, subtitle }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6">
      {/* 페이지 제목 */}
      <div>
        {title && (
          <h1 className="text-lg font-semibold text-surface-900">{title}</h1>
        )}
        {subtitle && (
          <p className="text-sm text-surface-500">{subtitle}</p>
        )}
      </div>

      {/* 우측 액션 */}
      <div className="flex items-center gap-4">
        {/* 검색 */}
        <div className="w-64">
          <Input
            placeholder="기사 검색..."
            leftIcon={<Search className="w-4 h-4" />}
            className="h-9"
          />
        </div>

        {/* 알림 */}
        <button
          className={cn(
            'relative p-2 rounded-lg',
            'text-surface-500 hover:text-surface-700',
            'hover:bg-surface-100 transition-colors'
          )}
        >
          <Bell className="w-5 h-5" />
          {/* 알림 뱃지 */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* 사용자 메뉴 */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={cn(
              'flex items-center gap-2 p-1.5 pr-3 rounded-lg',
              'hover:bg-surface-100 transition-colors'
            )}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-surface-700">김기자</span>
            <ChevronDown className={cn(
              'w-4 h-4 text-surface-400 transition-transform',
              isUserMenuOpen && 'rotate-180'
            )} />
          </button>

          {/* 드롭다운 메뉴 */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className={cn(
                'absolute right-0 top-full mt-2 w-48 z-20',
                'bg-white rounded-lg shadow-lg border border-surface-200',
                'py-1 animate-fade-in'
              )}>
                <div className="px-4 py-2 border-b border-surface-100">
                  <p className="text-sm font-medium text-surface-900">김기자</p>
                  <p className="text-xs text-surface-500">reporter@kpopstar.ai.kr</p>
                </div>
                
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                  <Settings className="w-4 h-4" />
                  설정
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                  <HelpCircle className="w-4 h-4" />
                  도움말
                </button>
                <div className="border-t border-surface-100 mt-1 pt-1">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

