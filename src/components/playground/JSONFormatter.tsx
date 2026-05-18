import { CheckCircle2, Copy, Minimize2, RefreshCcw, Trash2 } from "lucide-react";
import type { JSONValidationResult } from "@/types";

interface JSONFormatterProps {
  value: string;
  onChange: (value: string) => void;
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  validation: JSONValidationResult;
  disabled: boolean;
}

export function JSONFormatter({ value, onChange, onFormat, onMinify, onValidate, validation, disabled }: JSONFormatterProps) {
  const copyToClipboard = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">JSON formatter</p>
          <p className="text-sm text-text-muted">Format, minify, validate, and copy your request body.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.24em] text-text-muted">
          JSON only
        </div>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={10}
        disabled={disabled}
        className="mt-4 min-h-[220px] w-full resize-none rounded-[2rem] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm font-mono leading-relaxed text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Paste JSON to format or validate it here..."
        aria-label="JSON formatter input"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onFormat}
          disabled={disabled}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-semibold text-text-primary transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw size={16} /> Format
        </button>
        <button
          type="button"
          onClick={onMinify}
          disabled={disabled}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-semibold text-text-primary transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minimize2 size={16} /> Minify
        </button>
        <button
          type="button"
          onClick={onValidate}
          disabled={disabled}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-semibold text-text-primary transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 size={16} /> Validate
        </button>
        <button
          type="button"
          onClick={copyToClipboard}
          disabled={!value || disabled}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-semibold text-text-primary transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Copy size={16} /> Copy
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-semibold text-text-primary transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} /> Clear
        </button>
      </div>

      <div className="mt-4 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4 text-sm text-text-muted">
        {validation.valid ? (
          <span className="inline-flex items-center gap-2 text-emerald-300">
            <CheckCircle2 size={16} /> JSON is valid.
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-rose-300">
            <span className="font-semibold">Invalid JSON:</span> {validation.error?.message} at line {validation.error?.line}, col {validation.error?.column}
          </span>
        )}
      </div>
    </div>
  );
}
