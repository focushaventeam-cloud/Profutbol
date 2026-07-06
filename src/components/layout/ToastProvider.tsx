'use client';

import { useEffect, useState, useCallback, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-emerald-500/20 bg-emerald-500/[0.07]',
  warning: 'border-amber-500/20 bg-amber-500/[0.07]',
  info: 'border-cyan-500/20 bg-cyan-500/[0.07]',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      const timer = setTimeout(() => removeToast(id), 3000);
      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  // cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container — fixed at top right, below header */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, y: -8, scale: 0.95, x: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`
                pointer-events-auto flex items-center gap-3 px-4 py-3
                rounded-xl border backdrop-blur-xl shadow-xl
                ${borderMap[toast.type]}
              `}
            >
              {iconMap[toast.type]}
              <span className="text-sm font-medium text-white/90 flex-1 leading-snug">
                {toast.message}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/30 hover:text-white/60 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}