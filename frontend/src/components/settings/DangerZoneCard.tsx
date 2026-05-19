"use client";

import { useState, useTransition } from "react";
import { ShieldAlert, Trash2 } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { requestAccountDeletion } from "@/actions/settings";
import { signOut } from "next-auth/react";

export function DangerZoneCard() {
  const [confirmation, setConfirmation] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    if (confirmation.trim() !== "DELETE") {
      toast("Type DELETE to confirm.", "error");
      return;
    }

    startTransition(async () => {
      const result = await requestAccountDeletion();
      if (result.success) {
        toast("Account deletion requested. You are being signed out.", "success");
        signOut({ callbackUrl: "/" });
      } else {
        toast(result.error || "Unable to delete account.", "error");
      }
    });
  };

  return (
    <div className="glass-card p-6 border-white/[0.06] space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-red-400">Danger zone</p>
          <h3 className="text-lg font-semibold text-text-primary">Delete account</h3>
        </div>
        <ShieldAlert size={20} className="text-red-400" aria-hidden="true" />
      </div>

      <div className="rounded-3xl bg-[#631f1f]/10 border border-red-500/20 p-4 text-sm text-text-secondary">
        Deleting your account will disable your DevMarket access and mark your profile for removal. Your bookmarks, collections, and preferences will no longer be available.
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-secondary">
          Confirm deletion
          <input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            placeholder="Type DELETE to confirm"
            aria-label="Confirm account deletion"
          />
        </label>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center justify-center h-11 px-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm font-semibold text-red-300 transition-all duration-200 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Deleting…" : "Delete account"}
        </button>
      </div>
    </div>
  );
}
