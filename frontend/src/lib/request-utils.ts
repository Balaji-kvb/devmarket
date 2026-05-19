import type { HttpMethod, KeyValuePair } from "@/types";

export const PLAYGROUND_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export const METHOD_BADGE_CLASSES: Record<HttpMethod, string> = {
  GET: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  POST: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  PUT: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  PATCH: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  DELETE: "bg-red-500/10 text-red-300 border-red-500/20",
};

export function isBodyMethod(method: HttpMethod): boolean {
  return method !== "GET" && method !== "DELETE";
}

export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function validateUrl(rawUrl: string): boolean {
  try {
    new URL(normalizeUrl(rawUrl));
    return true;
  } catch {
    return false;
  }
}

export function buildHeaders(headers: KeyValuePair[]): Record<string, string> {
  return headers.reduce<Record<string, string>>((acc, header) => {
    const key = header.key.trim();
    if (header.enabled && key) {
      acc[key] = header.value.trim();
    }
    return acc;
  }, {});
}

export function getBodySizeLabel(body: string): string {
  const size = new TextEncoder().encode(body).length;
  return `${size} bytes`;
}

export function getResponseSizeLabel(size: number): string {
  return `${size} bytes`;
}
