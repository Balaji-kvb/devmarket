import { Code } from "lucide-react";
import type { ExampleEndpoint } from "@/lib/data";

// ─── Component ──────────────────────────────────────────────────

interface APIExampleResponseProps {
  endpoints: ExampleEndpoint[];
}

/**
 * Displays example JSON responses from endpoints
 * with syntax-highlighted code blocks.
 */
export function APIExampleResponse({ endpoints }: APIExampleResponseProps) {
  // Only show endpoints that have example responses
  const withResponses = endpoints.filter((ep) => ep.exampleResponse);

  if (withResponses.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Code size={15} className="text-accent" aria-hidden="true" />
        <h2 className="text-base font-semibold text-text-primary">
          Example Responses
        </h2>
      </div>

      <div className="space-y-4">
        {withResponses.map((endpoint, idx) => {
          // Try to parse and pretty-print JSON
          let formattedResponse = endpoint.exampleResponse || "";
          try {
            formattedResponse = JSON.stringify(
              JSON.parse(formattedResponse),
              null,
              2
            );
          } catch {
            // Keep original if not valid JSON
          }

          return (
            <div key={idx}>
              <p className="text-xs text-text-muted mb-2 font-mono">
                <span className="text-emerald-400 font-bold">
                  {endpoint.method.toUpperCase()}
                </span>{" "}
                {endpoint.path}
              </p>
              <div
                className="
                  relative rounded-lg overflow-hidden
                  bg-[#0d1117] border border-white/[0.06]
                "
              >
                {/* Language label */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
                    json
                  </span>
                </div>
                <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
                  <code className="text-text-secondary font-mono">
                    {formattedResponse}
                  </code>
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
