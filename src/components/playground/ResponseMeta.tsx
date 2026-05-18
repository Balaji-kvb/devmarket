import { CircleCheck, Clock3, Download, Layers } from "lucide-react";
import type { PlaygroundResponse } from "@/types";

interface ResponseMetaProps {
  response: PlaygroundResponse;
}

export function ResponseMeta({ response }: ResponseMetaProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Status</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-text-primary">
          <CircleCheck size={16} className="text-accent" aria-hidden="true" />
          <span>{response.status} {response.statusText}</span>
        </div>
      </div>
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Timing</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-text-primary">
          <Clock3 size={16} className="text-sky-300" aria-hidden="true" />
          <span>{response.responseTime} ms</span>
        </div>
      </div>
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Payload size</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-text-primary">
          <Download size={16} className="text-emerald-300" aria-hidden="true" />
          <span>{response.size} bytes</span>
        </div>
      </div>
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Headers</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-text-primary">
          <Layers size={16} className="text-violet-300" aria-hidden="true" />
          <span>{Object.keys(response.headers).length}</span>
        </div>
      </div>
    </div>
  );
}
