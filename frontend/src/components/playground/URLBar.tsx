import { ArrowRight, Link2 } from "lucide-react";

interface URLBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  valid: boolean;
}

export function URLBar({ value, onChange, onSubmit, loading, valid }: URLBarProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary" htmlFor="playground-url">
        Endpoint URL
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
          <Link2 size={16} aria-hidden="true" />
        </div>
        <input
          id="playground-url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
          }}
          className="w-full rounded-3xl border border-white/[0.08] bg-white/[0.03] py-4 pl-11 pr-32 text-sm text-text-primary transition-all duration-200 placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="https://api.example.com/v1/resource"
          aria-invalid={!valid}
          aria-describedby="playground-url-help"
          disabled={loading}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="absolute right-2 top-2 inline-flex h-11 items-center gap-2 rounded-2xl bg-accent px-4 text-sm font-semibold text-black transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send"}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      <p id="playground-url-help" className="text-xs text-text-muted">
        Include the full API URL with protocol. Missing protocol will be completed automatically.
      </p>
    </div>
  );
}
