import { PLAYGROUND_METHODS, METHOD_BADGE_CLASSES } from "@/lib/request-utils";
import type { HttpMethod } from "@/types";

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (value: HttpMethod) => void;
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-text-secondary">Method</legend>
      <div className="grid grid-cols-5 gap-2">
        {PLAYGROUND_METHODS.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => onChange(method)}
            className={`inline-flex h-12 items-center justify-center rounded-2xl border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/30 ${
              value === method
                ? `${METHOD_BADGE_CLASSES[method]} border ${METHOD_BADGE_CLASSES[method].split(" ")[2]}`
                : "border-white/[0.08] bg-white/[0.03] text-text-secondary hover:border-white/[0.16] hover:bg-white/[0.05]"
            }`}
          >
            {method}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
