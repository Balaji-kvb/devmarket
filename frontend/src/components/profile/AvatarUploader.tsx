"use client";

import { useMemo, useState } from "react";

interface AvatarUploaderProps {
  image?: string;
  onChange: (value: string) => void;
}

export function AvatarUploader({ image, onChange }: AvatarUploaderProps) {
  const [value, setValue] = useState(image ?? "");

  const preview = useMemo(() => {
    if (!value) return undefined;
    return value;
  }, [value]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] overflow-hidden flex items-center justify-center text-text-muted">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">?</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Avatar image</p>
          <p className="text-sm text-text-muted">Paste any public image URL to update your profile avatar.</p>
        </div>
      </div>

      <label className="block text-sm font-medium text-text-secondary">
        Image URL
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            onChange(event.target.value);
          }}
          className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="https://example.com/avatar.jpg"
          type="url"
          aria-label="Avatar image URL"
        />
      </label>
    </div>
  );
}
