'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { Toast as ToastType, ToastType as ToastVariant } from '@/types';

// 토스트 아이콘 및 스타일
const toastConfig: Record<ToastVariant, { icon: typeof CheckCircle; className: string }> = {
  success: {
    icon: CheckCircle,
    className: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 border-red-200 text-red-800',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
  },
};

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

/**
 * 단일 토스트 컴포넌트
 */
export function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  // 마운트 애니메이션
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 자동 닫기
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 200);
      }, toast.duration);
      
      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 200);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'transition-all duration-200',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        config.className
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
        aria-label="닫기"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * 토스트 컨테이너 - 여러 토스트를 관리
 */
interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastContainer({
  toasts,
  onClose,
  position = 'top-right',
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 w-full max-w-sm',
        positionStyles[position]
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

