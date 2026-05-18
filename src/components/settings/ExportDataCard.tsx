"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { exportUserData } from "@/actions/settings";
import { useToast } from "@/providers/ToastProvider";

export function ExportDataCard() {
  const [isPending, startTransition] = useTransition();
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    startTransition(async () => {
      const data = await exportUserData();
      if (!data) {
        toast("Unable to export your data.", "error");
        return;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `devmarket-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setHasDownloaded(true);
      toast("Your export is ready.", "success");
    });
  };

  return (
    <div className="glass-card p-6 border-white/[0.06]">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Export data</p>
          <h3 className="text-lg font-semibold text-text-primary">Download your account snapshot</h3>
        </div>
        <Download size={20} className="text-accent" aria-hidden="true" />
      </div>

      <p className="text-sm text-text-secondary mb-6">
        Export your profile, collections, bookmarks, and preference settings in a portable JSON file.
      </p>

      <button
        type="button"
        onClick={handleExport}
        disabled={isPending}
        className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-sm font-semibold text-text-primary transition-all duration-200 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Preparing export…" : "Download export"}
      </button>
      {hasDownloaded ? (
        <p className="mt-3 text-sm text-emerald-400">Export created successfully.</p>
      ) : null}
    </div>
  );
}
