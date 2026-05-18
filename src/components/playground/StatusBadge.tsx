interface StatusBadgeProps {
  code: number;
}

const STATUS_CLASSES: { [key: string]: string } = {
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  redirect: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  client: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  server: "bg-red-500/10 text-red-300 border-red-500/20",
  unknown: "bg-white/[0.05] text-text-secondary border-white/[0.08]",
};

export function StatusBadge({ code }: StatusBadgeProps) {
  const variant =
    code >= 200 && code < 300
      ? "success"
      : code >= 300 && code < 400
      ? "redirect"
      : code >= 400 && code < 500
      ? "client"
      : code >= 500
      ? "server"
      : "unknown";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] ${STATUS_CLASSES[variant]}`}>
      {code === 0 ? "No response" : `HTTP ${code}`}
    </span>
  );
}
