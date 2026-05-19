import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { KeyValuePair } from "@/types";

interface HeaderEditorProps {
  headers: KeyValuePair[];
  onHeaderChange: (index: number, header: KeyValuePair) => void;
  onAddHeader: () => void;
  onRemoveHeader: (index: number) => void;
  authType: "none" | "bearer" | "api-key";
  authValue: string;
  onAuthTypeChange: (value: "none" | "bearer" | "api-key") => void;
  onAuthValueChange: (value: string) => void;
}

export function HeaderEditor({
  headers,
  onHeaderChange,
  onAddHeader,
  onRemoveHeader,
  authType,
  authValue,
  onAuthTypeChange,
  onAuthValueChange,
}: HeaderEditorProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div>
          <p className="text-sm font-semibold text-text-primary">Request headers</p>
          <p className="text-sm text-text-muted">Add optional HTTP headers and auth values.</p>
        </div>
        {open ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
      </button>

      {open ? (
        <div className="mt-5 space-y-4">
          {headers.map((header, index) => (
            <div key={`${header.key}-${index}`} className="grid gap-3 sm:grid-cols-[auto_1fr_1fr_auto] items-start">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(event) => onHeaderChange(index, { ...header, enabled: event.target.checked })}
                  className="h-4 w-4 rounded border-white/[0.12] bg-white/[0.03] text-accent focus:ring-accent"
                />
                Enabled
              </label>
              <input
                value={header.key}
                onChange={(event) => onHeaderChange(index, { ...header, key: event.target.value })}
                placeholder="Header name"
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <input
                value={header.value}
                onChange={(event) => onHeaderChange(index, { ...header, value: event.target.value })}
                placeholder="Header value"
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="button"
                onClick={() => onRemoveHeader(index)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] text-text-muted transition hover:bg-red-500/10 hover:text-red-200"
                aria-label="Remove header"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={onAddHeader}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-white/[0.14] hover:bg-white/[0.05]"
          >
            <Plus size={16} aria-hidden="true" />
            Add header
          </button>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0f1117]/75 p-4">
            <label className="text-sm font-medium text-text-secondary">Authentication</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <select
                value={authType}
                onChange={(event) => onAuthTypeChange(event.target.value as "none" | "bearer" | "api-key")}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="none">No auth</option>
                <option value="bearer">Bearer token</option>
                <option value="api-key">API key</option>
              </select>
              <input
                value={authValue}
                onChange={(event) => onAuthValueChange(event.target.value)}
                placeholder={authType === "bearer" ? "Bearer token" : authType === "api-key" ? "API key value" : "No auth selected"}
                disabled={authType === "none"}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
