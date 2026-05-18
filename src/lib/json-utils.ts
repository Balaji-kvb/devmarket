import type { JSONValidationResult } from "@/types";

function parseSyntaxError(error: Error): JSONValidationResult["error"] | undefined {
  const message = error.message;
  const lineMatch = message.match(/line (\d+)/i);
  const columnMatch = message.match(/column (\d+)/i);

  if (lineMatch || columnMatch) {
    return {
      message,
      line: lineMatch ? Number(lineMatch[1]) : 0,
      column: columnMatch ? Number(columnMatch[1]) : 0,
    };
  }

  return {
    message,
    line: 0,
    column: 0,
  };
}

export function parseJSON(value: string) {
  return JSON.parse(value);
}

export function formatJSON(value: string): string {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function minifyJSON(value: string): string {
  return JSON.stringify(JSON.parse(value));
}

export function validateJSON(value: string): JSONValidationResult {
  try {
    JSON.parse(value);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: parseSyntaxError(error instanceof Error ? error : new Error("Invalid JSON")),
    };
  }
}
