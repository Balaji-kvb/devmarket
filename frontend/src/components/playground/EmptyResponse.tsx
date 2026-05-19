import { Zap } from "lucide-react";

interface EmptyResponseProps {
  message?: string;
}

export function EmptyResponse({ message = "Send a request to inspect the response." }: EmptyResponseProps) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 text-center text-text-secondary">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/[0.04] text-text-muted">
        <Zap size={24} />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">No response yet</h3>
      <p className="mt-2 max-w-xs text-sm leading-6">{message}</p>
      <div className="mt-6 rounded-3xl bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.24em] text-text-muted">
        Tip: use the request panel to send live API calls and inspect results.
      </div>
    </div>
  );
}
