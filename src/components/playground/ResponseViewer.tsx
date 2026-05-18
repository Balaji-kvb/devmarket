import { Copy, FileJson, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/playground/StatusBadge";
import { ResponseMeta } from "@/components/playground/ResponseMeta";
import { EmptyResponse } from "@/components/playground/EmptyResponse";
import type { PlaygroundResponse } from "@/types";

interface ResponseViewerProps {
  response: PlaygroundResponse | null;
  loading: boolean;
}

export function ResponseViewer({ response, loading }: ResponseViewerProps) {
  const bodyText = response?.body ?? "";
  const isJson = (() => {
    try {
      JSON.parse(bodyText);
      return true;
    } catch {
      return false;
    }
  })();

  const copyResponse = async () => {
    if (!bodyText) return;
    await navigator.clipboard.writeText(bodyText);
  };

  if (loading) {
    return (
      <div className="min-h-[320px] rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded-full bg-white/[0.06]" />
          <div className="h-4 w-56 rounded-full bg-white/[0.06]" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-20 rounded-3xl bg-white/[0.04]" />
            <div className="h-20 rounded-3xl bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return <EmptyResponse />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Response snapshot</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge code={response.status} />
              <span className="text-sm text-text-primary">{response.statusText}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={copyResponse}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-white/[0.06]"
          >
            <Copy size={16} />
            Copy body
          </button>
        </div>
      </div>

      <ResponseMeta response={response} />

      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">Body</p>
            <p className="text-sm text-text-muted">Formatted response payload.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.24em] text-text-muted">
            <FileJson size={14} aria-hidden="true" />
            {isJson ? "JSON" : "Raw text"}
          </div>
        </div>
        {bodyText ? (
          <pre className="max-h-[440px] overflow-auto rounded-3xl border border-white/[0.06] bg-black/10 p-4 text-sm font-mono leading-relaxed text-text-primary">
            {isJson ? JSON.stringify(JSON.parse(bodyText), null, 2) : bodyText}
          </pre>
        ) : (
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 text-sm text-text-muted">
            <ShieldAlert size={18} className="inline-block mr-2 align-middle" aria-hidden="true" />
            Empty response body.
          </div>
        )}
      </div>
    </div>
  );
}
