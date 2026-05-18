"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ─── Context ────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* ── Toast Container ──────────────────────────────────── */}
      <div
        className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Toast Item ─────────────────────────────────────────────────

const ICON_MAP = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const COLOR_MAP = {
  success: "text-emerald-400 border-emerald-500/30",
  error: "text-red-400 border-red-500/30",
  info: "text-blue-400 border-blue-500/30",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const Icon = ICON_MAP[toast.type];
  const colorClass = COLOR_MAP[toast.type];

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3
        bg-[#0f1117]/95 border ${colorClass.split(" ")[1]}
        backdrop-blur-xl rounded-lg
        shadow-xl shadow-black/30
        animate-fade-in-up
      `}
      role="alert"
    >
      <Icon size={16} className={colorClass.split(" ")[0]} aria-hidden="true" />
      <span className="flex-1 text-sm text-text-primary">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-text-muted hover:text-text-secondary transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Hook ───────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
