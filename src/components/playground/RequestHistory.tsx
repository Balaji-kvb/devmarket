import { Clock3, Delete, History, Loader2, RotateCcw } from "lucide-react";
import type { PlaygroundHistory } from "@/types";

interface RequestHistoryProps {
  history: PlaygroundHistory[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  activeRequestId?: string;
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("default", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function RequestHistory({ history, onRestore, onDelete, onClear, activeRequestId }: RequestHistoryProps) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <History className="h-5 w-5 text-text-muted" />
          <div>
            <p className="font-semibold text-text-primary">Request history</p>
            <p className="text-text-muted">Restore past requests, edit them, or clear the list.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted transition hover:bg-white/[0.06]"
        >
          <RotateCcw size={14} /> Clear all
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {history.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/[0.08] bg-black/5 p-6 text-center text-sm text-text-muted">
            No requests saved yet. Send one to start building your history.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`group rounded-3xl border p-4 transition ${
                item.id === activeRequestId
                  ? "border-accent/50 bg-accent/5"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">{item.method} {item.url}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                    <Clock3 className="h-3.5 w-3.5" /> {formatTimestamp(item.timestamp)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRestore(item.id)}
                    className="inline-flex h-9 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-semibold text-text-primary transition hover:bg-white/[0.06]"
                  >
                    <Loader2 className="h-4 w-4" /> Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="inline-flex h-9 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-semibold text-text-primary transition hover:bg-white/[0.06]"
                  >
                    <Delete className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
