import type { PlaygroundRequest, PlaygroundResponse } from "@/types";

const DEFAULT_TIMEOUT_MS = 20000;

function getResponseSize(body: string): number {
  return new TextEncoder().encode(body).length;
}

export async function sendPlaygroundRequest(
  request: PlaygroundRequest,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<PlaygroundResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers();
  request.headers.forEach((header) => {
    if (header.enabled && header.key.trim()) {
      headers.set(header.key.trim(), header.value);
    }
  });

  if (request.authType === "bearer" && request.authValue.trim()) {
    headers.set("Authorization", `Bearer ${request.authValue.trim()}`);
  }

  if (request.authType === "api-key" && request.authValue.trim()) {
    headers.set("x-api-key", request.authValue.trim());
  }

  const body = request.body?.trim() ? request.body : undefined;
  if (body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const start = performance.now();
  const response = await fetch(request.url, {
    method: request.method,
    headers,
    body,
    signal: controller.signal,
  });
  const responseTime = Math.round(performance.now() - start);
  const text = await response.text();

  window.clearTimeout(timeout);

  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  return {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    body: text,
    responseTime,
    size: getResponseSize(text),
  };
}
