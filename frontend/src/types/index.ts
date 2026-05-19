/* ================================================================
   DevMarket — Type System
   Organized by domain. All shared types exported from this barrel.
   ================================================================ */

// ─── Category Unions ────────────────────────────────────────────

export type APICategory =
  | "AI & ML"
  | "Weather"
  | "Maps & Geo"
  | "Finance"
  | "Communication"
  | "Authentication"
  | "Media"
  | "Developer Tools"
  | "Government"
  | "Entertainment";

export type ToolCategory =
  | "DevOps"
  | "Testing"
  | "Design"
  | "Database"
  | "IDE"
  | "Security"
  | "Mobile";

export type NewsCategory =
  | "AI"
  | "Cloud"
  | "Open Source"
  | "APIs"
  | "Web Development"
  | "Mobile"
  | "Database"
  | "Kubernetes"
  | "Docker"
  | "TypeScript"
  | "Next.js"
  | "Prisma"
  | "React"
  | "GenAI"
  | "LLMs"
  | "Productivity tools"
  | "DevOps"
  | "Security"
  | "General";

// ─── Shared Enumerations ────────────────────────────────────────

export type PricingModel = "free" | "premium" | "paid";
export type AuthMethod = "api-key" | "oauth" | "none";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type Platform = "web" | "desktop" | "cli" | "mobile";
export type License = "open-source" | "paid" | "premium";

/** Sort options available across marketplace and directory views. */
export type SortOption = "popular" | "newest" | "alphabetical";

// ─── API Domain ─────────────────────────────────────────────────

/** A single callable endpoint within an API. */
export interface Endpoint {
  method: HttpMethod;
  path: string;
  description: string;
  params?: Record<string, string>;
  exampleResponse?: string;
}

/**
 * Represents a third-party API listed in the marketplace.
 *
 * Design notes:
 * - `id` is a client-side identifier; `_id` is reserved for MongoDB ObjectId.
 * - `slug` is used for URL routing: /apis/[slug].
 * - `createdAt` and `updatedAt` are ISO 8601 strings for JSON serialization
 *   compatibility. Convert to Date objects at the service layer when needed.
 * - `savedCount` is denormalized for read performance on listing pages.
 */
export interface API {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  provider: string;
  tagline: string;
  description: string;
  category: APICategory;
  baseUrl: string;
  authMethod: AuthMethod;
  pricing: PricingModel;
  docsUrl: string;
  exampleEndpoints: Endpoint[];
  tags: string[];
  savedCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** Subset of API fields rendered in card/list views. */
export type APICardData = Pick<
  API,
  | "id"
  | "slug"
  | "name"
  | "provider"
  | "tagline"
  | "category"
  | "authMethod"
  | "pricing"
  | "tags"
  | "savedCount"
  | "featured"
>;

/** Filter state for the API marketplace sidebar. */
export interface APIFilterState {
  categories: APICategory[];
  pricing: PricingModel[];
  authMethods: AuthMethod[];
  sort: SortOption;
  search: string;
}

// ─── Tool Domain ────────────────────────────────────────────────

/**
 * A developer tool listed in the tools directory.
 *
 * - `platform` is an array because many tools run on multiple platforms.
 * - `githubUrl` and `docsUrl` are optional — not all commercial tools expose these.
 */
export interface Tool {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  platform: Platform[];
  license: License;
  websiteUrl: string;
  githubUrl?: string;
  docsUrl?: string;
  tags: string[];
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Subset of Tool fields rendered in card/list views. */
export type ToolCardData = Pick<
  Tool,
  | "id"
  | "slug"
  | "name"
  | "tagline"
  | "category"
  | "platform"
  | "license"
  | "tags"
  | "featured"
  | "websiteUrl"
>;

/** Filter state for the tools directory. */
export interface ToolFilterState {
  category: ToolCategory | "All";
  license: License[];
  platform: Platform[];
  search: string;
}

// ─── News Domain ────────────────────────────────────────────────

/** A tech news article aggregated from external sources (Dev.to, HN). */
export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: "dev.to" | "hackernews" | "other";
  author?: string;
  coverImage?: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  category: NewsCategory;
  reactions?: number;
  comments?: number;
}

/** Filter state for the news feed. */
export interface NewsFilterState {
  category: NewsCategory | "All";
}

// ─── User Domain ────────────────────────────────────────────────

/**
 * A record of a single API request made in the Playground.
 * Stored as a subdocument within the User document.
 */
export interface PlaygroundHistory {
  id: string;
  method: HttpMethod;
  url: string;
  statusCode: number;
  responseTime: number;
  requestBody?: string;
  timestamp: string;
}

/**
 * Authenticated user profile.
 *
 * - `savedAPIs` and `savedTools` store IDs (not full objects) to keep
 *   the user document lightweight. Full objects are resolved at query time.
 * - `recentPlayground` is capped at the last 20 entries to prevent unbounded growth.
 */
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  image?: string;
  savedAPIs: string[];
  savedTools: string[];
  recentPlayground: PlaygroundHistory[];
  createdAt: string;
  updatedAt?: string;
}

/** Public-safe subset of user data (no saved items or history). */
export type PublicUser = Pick<User, "id" | "name" | "image">;

// ─── Playground Domain ──────────────────────────────────────────

/** Configuration for a single API request in the Playground. */
export interface PlaygroundRequest {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  body: string;
  authType: "bearer" | "api-key" | "none";
  authValue: string;
}

/** Parsed response from a Playground API call. */
export interface PlaygroundResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
  size: number;
}

/** Reusable key-value pair for headers, params, and form data. */
export interface KeyValuePair {
  key: string;
  value: string;
  enabled: boolean;
}

/** Language options available in the Code Formatter. */
export type FormatterLanguage =
  | "json"
  | "xml"
  | "yaml"
  | "html"
  | "css"
  | "javascript";

/** Result of JSON validation. */
export interface JSONValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line: number;
    column: number;
  };
  parsedTree?: JSONTreeNode[];
}

/** A node in the parsed JSON tree view. */
export interface JSONTreeNode {
  key: string;
  value: string | number | boolean | null;
  type: "string" | "number" | "boolean" | "null" | "object" | "array";
  children?: JSONTreeNode[];
  depth: number;
}

// ─── Monitoring Domain ──────────────────────────────────────────

/** System metrics exposed by the /api/health endpoint. */
export interface MetricsData {
  uptime: number;
  requestCount: number;
  avgResponseTime: number;
  memoryUsage: MemoryMetrics;
  cpuUsage: number;
}

/** Breakdown of Node.js memory usage (from process.memoryUsage()). */
export interface MemoryMetrics {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
}

/** Shape of the /api/health response. */
export interface HealthCheckResponse {
  status: "ok" | "degraded" | "down";
  uptime: number;
  timestamp: string;
  memory: MemoryMetrics;
  version: string;
}

// ─── Shared / UI Types ──────────────────────────────────────────

/**
 * Generic paginated API response wrapper.
 * Used by all listing endpoints (APIs, Tools, News).
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Standard API error response shape. */
export interface APIErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

/** Unified search result returned by the CommandPalette. */
export interface SearchResult {
  id: string;
  type: "api" | "tool" | "news";
  title: string;
  subtitle: string;
  slug: string;
  url: string;
}

/** Badge component variant options. */
export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

/** Sidebar navigation item configuration. */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  requiresAuth?: boolean;
}

// ─── Utility Types ──────────────────────────────────────────────

/**
 * Makes specified keys optional while keeping the rest required.
 * Useful for create/update DTOs derived from entity interfaces.
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Strips MongoDB-specific fields for client-side usage.
 * Applied when transforming database documents to API responses.
 */
export type ClientEntity<T> = Omit<T, "_id" | "__v">;

/** Input shape for creating a new API entry (server-generated fields omitted). */
export type CreateAPIInput = Omit<API, "id" | "_id" | "savedCount" | "createdAt" | "updatedAt">;

/** Input shape for creating a new Tool entry. */
export type CreateToolInput = Omit<Tool, "id" | "_id" | "createdAt" | "updatedAt">;
