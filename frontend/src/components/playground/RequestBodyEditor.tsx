import type { JSONValidationResult } from "@/types";

interface RequestBodyEditorProps {
  body: string;
  onChange: (next: string) => void;
  disabled: boolean;
  validation: JSONValidationResult;
  sizeLabel: string;
  onValidate: () => void;
}

export function RequestBodyEditor({ body, onChange, disabled, validation, sizeLabel, onValidate }: RequestBodyEditorProps) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">Request body</p>
          <p className="text-sm text-text-muted">JSON payload for POST, PUT, and PATCH requests.</p>
        </div>
        <div className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.24em] text-text-muted">
          {sizeLabel}
        </div>
      </div>

      <textarea
        value={body}
        onChange={(event) => onChange(event.target.value)}
        rows={12}
        disabled={disabled}
        className="mt-4 min-h-[240px] w-full resize-none rounded-[2rem] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm font-mono leading-relaxed text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
        placeholder={
          `{
  "name": "DevMarket",
  "description": "A modern API playground."
}`
        }
        aria-label="Request body editor"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onValidate}
          disabled={disabled}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-semibold text-text-primary transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Validate JSON
        </button>
        {validation.valid ? (
          <span className="text-sm text-emerald-400">JSON is valid.</span>
        ) : (
          <span className="text-sm text-rose-300">
            {validation.error ? `${validation.error.message} (line ${validation.error.line}, col ${validation.error.column})` : "Invalid JSON."}
          </span>
        )}
      </div>
    </div>
  );
}
