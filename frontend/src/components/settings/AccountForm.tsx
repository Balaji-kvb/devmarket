"use client";

import { useState, useTransition } from "react";
import { updateUserProfile } from "@/actions/profile";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { useToast } from "@/providers/ToastProvider";
import type { SocialLinks } from "@/lib/profile";

interface AccountFormProps {
  name: string;
  username?: string;
  bio?: string;
  website?: string;
  image?: string;
  socialLinks: SocialLinks;
}

export function AccountForm({ name, username, bio, website, image, socialLinks }: AccountFormProps) {
  const [formState, setFormState] = useState({
    name: name || "",
    username: username || "",
    bio: bio || "",
    website: website || "",
    image: image || "",
    twitter: socialLinks.twitter || "",
    github: socialLinks.github || "",
    linkedin: socialLinks.linkedin || "",
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateUserProfile({
        name: formState.name,
        username: formState.username || undefined,
        bio: formState.bio || undefined,
        website: formState.website || undefined,
        image: formState.image || undefined,
        socialLinks: {
          twitter: formState.twitter || undefined,
          github: formState.github || undefined,
          linkedin: formState.linkedin || undefined,
        },
      });

      if (result.success) {
        toast("Profile updated successfully.", "success");
      } else {
        toast(result.error || "Unable to update profile.", "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Profile settings form">
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <label className="block text-sm font-medium text-text-secondary">
            Display name
            <input
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Your full name"
              required
            />
          </label>

          <label className="block text-sm font-medium text-text-secondary">
            Username
            <input
              value={formState.username}
              onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="devmarketuser"
            />
          </label>

          <label className="block text-sm font-medium text-text-secondary">
            Bio
            <textarea
              value={formState.bio}
              onChange={(event) => setFormState((prev) => ({ ...prev, bio: event.target.value }))}
              className="mt-2 w-full min-h-[120px] rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none"
              placeholder="Describe your developer focus, tools, and workflows."
            />
          </label>

          <label className="block text-sm font-medium text-text-secondary">
            Website
            <input
              value={formState.website}
              onChange={(event) => setFormState((prev) => ({ ...prev, website: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="https://your-site.com"
              type="url"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-text-secondary">
              GitHub
              <input
                value={formState.github}
                onChange={(event) => setFormState((prev) => ({ ...prev, github: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="https://github.com/username"
                type="url"
              />
            </label>
            <label className="block text-sm font-medium text-text-secondary">
              Twitter
              <input
                value={formState.twitter}
                onChange={(event) => setFormState((prev) => ({ ...prev, twitter: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="https://twitter.com/username"
                type="url"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-text-secondary">
            LinkedIn
            <input
              value={formState.linkedin}
              onChange={(event) => setFormState((prev) => ({ ...prev, linkedin: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="https://linkedin.com/in/username"
              type="url"
            />
          </label>
        </div>

        <div className="space-y-5">
          <AvatarUploader image={formState.image} onChange={(value) => setFormState((prev) => ({ ...prev, image: value }))} />
          <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4 text-sm text-text-muted">
            Your email is managed by DevMarket authentication. Profile edits will reflect across connected interfaces.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">Changes are saved to your DevMarket account and persisted securely.</p>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center h-11 px-5 rounded-2xl bg-accent text-sm font-semibold text-black transition-all duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}
