import { ExternalLink, Link2 } from "lucide-react";
import type { SocialLinks } from "@/lib/profile";

interface ProfileHeaderProps {
  name: string;
  username?: string;
  email: string;
  image?: string;
  bio?: string;
  website?: string;
  socialLinks: SocialLinks;
  joinedAt: string;
}

export function ProfileHeader({
  name,
  username,
  email,
  image,
  bio,
  website,
  socialLinks,
  joinedAt,
}: ProfileHeaderProps) {
  return (
    <div className="glass-card p-6 border-white/[0.06] grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] items-start">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-violet-600 overflow-hidden shadow-lg shadow-black/20 flex items-center justify-center text-white text-3xl font-bold">
            {image ? (
               
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          <div>
            <p className="text-sm text-text-muted uppercase tracking-[0.28em]">Profile</p>
            <h1 className="text-3xl font-semibold text-text-primary">{name}</h1>
            {username ? (
              <p className="text-sm text-text-secondary">@{username}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-text-secondary leading-6">{bio || "A developer profile for DevMarket."}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Email</p>
              <p className="mt-2 text-sm text-text-primary break-all">{email}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Joined</p>
              <p className="mt-2 text-sm text-text-primary">{new Date(joinedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="truncate">{website}</span>
            <ExternalLink size={14} aria-hidden="true" className="text-text-muted group-hover:text-text-primary" />
          </a>
        ) : null}

        <div className="space-y-3">
          {Object.entries(socialLinks).length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Social links</p>
              <div className="grid gap-2">
                {Object.entries(socialLinks).map(([key, value]) =>
                  value ? (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <span className="capitalize">{key}</span>
                      <Link2 size={14} aria-hidden="true" />
                    </a>
                  ) : null
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 text-sm text-text-secondary">
              Add social links in Settings to show your profile extras.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
