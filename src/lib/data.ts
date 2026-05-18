/**
 * Data loading layer — abstracts seed data imports.
 *
 * Currently reads from static JSON files.
 * Future: swap to MongoDB queries or API calls
 * without changing consumer components.
 */

import apisData from "@/data/apis.json";
import toolsData from "@/data/tools.json";

// ─── Types ──────────────────────────────────────────────────────

export interface EndpointParam {
  [key: string]: string;
}

export interface ExampleEndpoint {
  method: string;
  path: string;
  description: string;
  params?: EndpointParam;
  exampleResponse?: string;
}

export interface APIItem {
  id: string;
  slug: string;
  name: string;
  provider: string;
  tagline: string;
  description: string;
  category: string;
  baseUrl: string;
  authMethod: string;
  pricing: string;
  docsUrl: string;
  exampleEndpoints?: ExampleEndpoint[];
  tags: string[];
  savedCount: number;
  featured: boolean;
  createdAt: string;
}

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  platform: string[];
  license: string;
  websiteUrl: string;
  githubUrl?: string;
  docsUrl?: string;
  tags: string[];
  featured: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  source: string;
  publishedAt: string;
  readTime: number;
}

// ─── API Data ───────────────────────────────────────────────────

export function getAllAPIs(): APIItem[] {
  return apisData as APIItem[];
}

export function getFeaturedAPIs(limit = 6): APIItem[] {
  return (apisData as APIItem[])
    .filter((api) => api.featured)
    .slice(0, limit);
}

export function getAPIBySlug(slug: string): APIItem | undefined {
  return (apisData as APIItem[]).find((api) => api.slug === slug);
}

export function getRelatedAPIs(currentSlug: string, category: string, limit = 3): APIItem[] {
  return (apisData as APIItem[])
    .filter((api) => api.slug !== currentSlug && api.category === category)
    .slice(0, limit);
}

// ─── Tool Data ──────────────────────────────────────────────────

export function getAllTools(): ToolItem[] {
  return toolsData as ToolItem[];
}

export function getFeaturedTools(limit = 10): ToolItem[] {
  return (toolsData as ToolItem[])
    .filter((tool) => tool.featured)
    .slice(0, limit);
}

export function getToolBySlug(slug: string): ToolItem | undefined {
  return (toolsData as ToolItem[]).find((tool) => tool.slug === slug);
}

export function getRelatedTools(currentSlug: string, category: string, limit = 4): ToolItem[] {
  return (toolsData as ToolItem[])
    .filter((tool) => tool.slug !== currentSlug && tool.category === category)
    .slice(0, limit);
}

// ─── News Data (mock until Phase 13) ────────────────────────────

const MOCK_NEWS: NewsItem[] = [
  {
    id: "news-001",
    slug: "openai-gpt5-announcement",
    title: "OpenAI Announces GPT-5 with Real-Time Reasoning",
    excerpt: "The latest model introduces chain-of-thought streaming and native tool orchestration for complex multi-step tasks.",
    category: "AI & ML",
    source: "TechCrunch",
    publishedAt: "2025-01-15T09:00:00.000Z",
    readTime: 4,
  },
  {
    id: "news-002",
    slug: "docker-wasm-ga",
    title: "Docker Desktop Ships WebAssembly Support as GA",
    excerpt: "Run Wasm containers alongside Linux containers with full Docker Compose integration and Kubernetes support.",
    category: "DevOps",
    source: "The New Stack",
    publishedAt: "2025-01-14T14:30:00.000Z",
    readTime: 3,
  },
  {
    id: "news-003",
    slug: "react-20-compiler",
    title: "React 20 Compiler Eliminates Manual Memoization",
    excerpt: "The new React Compiler automatically optimizes re-renders, making useMemo, useCallback, and React.memo unnecessary.",
    category: "Frontend",
    source: "Vercel Blog",
    publishedAt: "2025-01-13T11:00:00.000Z",
    readTime: 5,
  },
  {
    id: "news-004",
    slug: "github-copilot-workspace",
    title: "GitHub Copilot Workspace Enters Public Beta",
    excerpt: "AI-powered development environment that plans, implements, and tests code changes from natural language issue descriptions.",
    category: "Developer Tools",
    source: "GitHub Blog",
    publishedAt: "2025-01-12T16:00:00.000Z",
    readTime: 3,
  },
];

export function getLatestNews(limit = 4): NewsItem[] {
  return MOCK_NEWS.slice(0, limit);
}

// ─── Stats ──────────────────────────────────────────────────────

export function getPlatformStats() {
  const apis = apisData as APIItem[];
  const tools = toolsData as ToolItem[];

  return {
    totalAPIs: apis.length,
    totalTools: tools.length,
    totalCategories:
      new Set([...apis.map((a) => a.category), ...tools.map((t) => t.category)])
        .size,
    totalEndpoints: apis.reduce((sum, api) => {
      // exampleEndpoints exists in JSON but not in typed interface
      const raw = apisData as Array<Record<string, unknown>>;
      const match = raw.find((r) => r.id === api.id);
      const endpoints = (match?.exampleEndpoints as unknown[]) || [];
      return sum + endpoints.length;
    }, 0),
  };
}
