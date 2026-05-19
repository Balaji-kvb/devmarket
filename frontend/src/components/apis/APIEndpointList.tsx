import type { ExampleEndpoint } from "@/lib/data";

// ─── Method Color Map ───────────────────────────────────────────

const METHOD_COLORS: Record<string, string> = {
  GET: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  POST: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  PUT: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  PATCH: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  DELETE: "text-red-400 bg-red-400/10 border-red-400/20",
};

// ─── Component ──────────────────────────────────────────────────

interface APIEndpointListProps {
  endpoints: ExampleEndpoint[];
  baseUrl: string;
}

/**
 * Displays the list of example endpoints with method badges,
 * paths, descriptions, and parameter tables.
 */
export function APIEndpointList({ endpoints, baseUrl }: APIEndpointListProps) {
  if (endpoints.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="text-base font-semibold text-text-primary mb-1">
        Endpoints
      </h2>
      <p className="text-xs text-text-muted mb-5">
        Base URL: <code className="text-accent/80 font-mono">{baseUrl}</code>
      </p>

      <div className="space-y-4">
        {endpoints.map((endpoint, idx) => {
          const methodStyle = METHOD_COLORS[endpoint.method.toUpperCase()] || METHOD_COLORS.GET;

          return (
            <div
              key={idx}
              className="
                p-4 rounded-lg
                bg-white/[0.02] border border-white/[0.06]
              "
            >
              {/* ── Method + Path ──────────────────────────────── */}
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className={`
                    inline-flex items-center justify-center
                    h-5 px-1.5
                    text-[10px] font-bold tracking-wide
                    rounded border
                    ${methodStyle}
                  `}
                >
                  {endpoint.method.toUpperCase()}
                </span>
                <code className="text-xs text-text-primary font-mono break-all">
                  {endpoint.path}
                </code>
              </div>

              {/* ── Description ────────────────────────────────── */}
              <p className="text-xs text-text-secondary mb-3">
                {endpoint.description}
              </p>

              {/* ── Params table ───────────────────────────────── */}
              {endpoint.params && Object.keys(endpoint.params).length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1.5">
                    Parameters
                  </p>
                  <div className="rounded-md border border-white/[0.06] overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-white/[0.02]">
                          <th className="text-left py-1.5 px-3 text-text-muted font-medium">
                            Param
                          </th>
                          <th className="text-left py-1.5 px-3 text-text-muted font-medium">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(endpoint.params).map(([key, desc]) => (
                          <tr key={key} className="border-t border-white/[0.04]">
                            <td className="py-1.5 px-3 font-mono text-accent/80">
                              {key}
                            </td>
                            <td className="py-1.5 px-3 text-text-secondary">
                              {desc}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
