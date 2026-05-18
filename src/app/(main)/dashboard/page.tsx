"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Layers,
  Wrench,
  Clock,
  LogOut,
  Sparkles,
  User,
  FolderOpen,
  TrendingUp,
  FolderPlus,
} from "lucide-react";
import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SavedGrid } from "@/components/dashboard/SavedGrid";
import { RecommendationGrid } from "@/components/dashboard/RecommendationGrid";
import { TrendingSection } from "@/components/dashboard/TrendingSection";
import { CollectionsOverview } from "@/components/dashboard/CollectionsOverview";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { CollectionModal } from "@/components/collections/CollectionModal";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useToast } from "@/providers/ToastProvider";

// ─── Tab Config ─────────────────────────────────────────────────

type DashboardTab = "overview" | "apis" | "tools" | "collections";

const TABS: { id: DashboardTab; label: string; icon: typeof Layers }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "apis", label: "Saved APIs", icon: Layers },
  { id: "tools", label: "Saved Tools", icon: Wrench },
  { id: "collections", label: "Collections", icon: FolderOpen },
];

// ─── Component ──────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { collections, createCollection, deleteCollection } = useUserStore();
  const { toast } = useToast();

  const userName = session?.user?.name || "Developer";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;

  const handleCreateCollection = (
    title: string,
    description: string,
    visibility: "public" | "private"
  ) => {
    createCollection(title, description, visibility);
    toast(`Created "${title}" collection`, "success");
  };

  const handleDeleteCollection = (id: string) => {
    const col = collections.find((c) => c.id === id);
    deleteCollection(id);
    toast(`Deleted "${col?.title}" collection`, "info");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="
            w-14 h-14 rounded-2xl
            flex items-center justify-center
            bg-gradient-to-br from-accent to-violet-600
            text-white text-xl font-bold
            overflow-hidden
          ">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <User size={24} />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome back, {userName.split(" ")[0]}
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              {userEmail || "Your personalized developer workspace"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Create collection */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="
              flex items-center gap-2 h-9 px-3
              text-sm text-text-muted
              bg-white/[0.04] border border-white/[0.08]
              rounded-lg
              hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5
              transition-all duration-200
            "
          >
            <FolderPlus size={14} />
            <span className="hidden sm:inline">New Collection</span>
          </button>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
              flex items-center gap-2 h-9 px-3
              text-sm text-text-muted
              bg-white/[0.04] border border-white/[0.08]
              rounded-lg
              hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5
              transition-all duration-200
            "
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      {/* ── Activity Summary ─────────────────────────────────── */}
      <ActivitySummary />

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 mt-8 mb-6 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl w-fit overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 h-9 px-4
                rounded-lg text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${isActive
                  ? "bg-white/[0.08] text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
                }
              `}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ──────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Recently Viewed */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-amber-400" />
              <h2 className="text-lg font-semibold text-text-primary">Recently Viewed</h2>
            </div>
            <RecentActivity />
          </section>

          {/* My Collections */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen size={16} className="text-amber-400" />
              <h2 className="text-lg font-semibold text-text-primary">My Collections</h2>
            </div>
            <CollectionsOverview onCreateNew={() => setShowCreateModal(true)} />
          </section>

          {/* Saved APIs */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Layers size={16} className="text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">Saved APIs</h2>
            </div>
            <SavedGrid filterType="api" />
          </section>

          {/* Saved Tools */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Wrench size={16} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-text-primary">Saved Tools</h2>
            </div>
            <SavedGrid filterType="tool" />
          </section>

          {/* Recommended For You */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-violet-400" />
              <h2 className="text-lg font-semibold text-text-primary">Recommended For You</h2>
            </div>
            <RecommendationGrid />
          </section>

          {/* Trending in Your Interests */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-amber-400" />
              <h2 className="text-lg font-semibold text-text-primary">Trending in Your Interests</h2>
            </div>
            <TrendingSection />
          </section>
        </div>
      )}

      {activeTab === "apis" && (
        <section>
          <h2 className="sr-only">Saved APIs</h2>
          <SavedGrid filterType="api" />
        </section>
      )}

      {activeTab === "tools" && (
        <section>
          <h2 className="sr-only">Saved Tools</h2>
          <SavedGrid filterType="tool" />
        </section>
      )}

      {activeTab === "collections" && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="sr-only">Collections</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="
                inline-flex items-center gap-2
                h-9 px-4
                bg-accent text-white
                rounded-lg text-sm font-medium
                hover:bg-accent/90
                transition-all duration-200
              "
            >
              <FolderPlus size={14} />
              New Collection
            </button>
          </div>
          <CollectionGrid
            collections={collections}
            onDelete={handleDeleteCollection}
            onCreateNew={() => setShowCreateModal(true)}
          />
        </section>
      )}

      {/* ── Create Collection Modal ──────────────────────────── */}
      <CollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCollection}
      />
    </div>
  );
}
