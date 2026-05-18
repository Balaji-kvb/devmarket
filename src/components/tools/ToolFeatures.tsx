import { Zap, Terminal } from "lucide-react";
import type { ToolItem } from "@/lib/data";

// ─── Install Command Map ────────────────────────────────────────

const INSTALL_COMMANDS: Record<string, { label: string; command: string }[]> = {
  docker: [
    { label: "macOS / Windows", command: "brew install --cask docker" },
    { label: "Linux (Ubuntu)", command: "sudo apt-get install docker-ce docker-ce-cli containerd.io" },
  ],
  kubernetes: [
    { label: "kubectl", command: "brew install kubectl" },
    { label: "minikube", command: "brew install minikube" },
  ],
  terraform: [
    { label: "Homebrew", command: "brew install terraform" },
    { label: "Binary", command: "wget https://releases.hashicorp.com/terraform/latest" },
  ],
  ansible: [
    { label: "pip", command: "pip install ansible" },
    { label: "Homebrew", command: "brew install ansible" },
  ],
  jenkins: [
    { label: "Docker", command: "docker run -p 8080:8080 jenkins/jenkins:lts" },
    { label: "Homebrew", command: "brew install jenkins-lts" },
  ],
  prometheus: [
    { label: "Docker", command: "docker run -p 9090:9090 prom/prometheus" },
    { label: "Homebrew", command: "brew install prometheus" },
  ],
  grafana: [
    { label: "Docker", command: "docker run -p 3000:3000 grafana/grafana" },
    { label: "Homebrew", command: "brew install grafana" },
  ],
  "github-actions": [
    { label: "CLI", command: "gh extension install actions/gh-actions-cache" },
  ],
  "argo-cd": [
    { label: "kubectl", command: "kubectl create namespace argocd && kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml" },
  ],
  "visual-studio-code": [
    { label: "Homebrew", command: "brew install --cask visual-studio-code" },
    { label: "Direct", command: "Download from https://code.visualstudio.com" },
  ],
  postman: [
    { label: "Homebrew", command: "brew install --cask postman" },
  ],
  figma: [
    { label: "Homebrew", command: "brew install --cask figma" },
  ],
  git: [
    { label: "Homebrew", command: "brew install git" },
    { label: "Linux", command: "sudo apt-get install git" },
  ],
  "pgadmin-4": [
    { label: "pip", command: "pip install pgadmin4" },
    { label: "Docker", command: "docker run -p 5050:80 dpage/pgadmin4" },
  ],
};

// ─── Feature Map ────────────────────────────────────────────────

const TOOL_FEATURES: Record<string, string[]> = {
  docker: ["Multi-stage builds", "Docker Compose orchestration", "Layer caching", "Docker Hub registry", "BuildKit support", "Container networking"],
  kubernetes: ["Auto-scaling", "Self-healing deployments", "Service discovery", "Rolling updates", "Namespace isolation", "Helm chart support"],
  terraform: ["Declarative IaC", "State management", "Module registry", "Multi-cloud support", "Plan & apply workflow", "Drift detection"],
  ansible: ["Agentless automation", "YAML playbooks", "Role-based structure", "Vault secrets", "Inventory management", "Idempotent execution"],
  jenkins: ["Pipeline as code", "Plugin ecosystem", "Distributed builds", "Blue Ocean UI", "Credential management", "Shared libraries"],
  prometheus: ["Pull-based metrics", "PromQL queries", "AlertManager", "Service discovery", "Multi-dimensional data", "Federation support"],
  grafana: ["Dashboard templates", "Data source plugins", "Alert rules", "Annotations", "Team permissions", "Provisioning API"],
  "visual-studio-code": ["IntelliSense", "Integrated terminal", "Extension marketplace", "Git integration", "Remote development", "Debugging support"],
  postman: ["API testing", "Collection runner", "Mock servers", "Documentation generation", "Environment variables", "CI/CD integration"],
  figma: ["Real-time collaboration", "Auto layout", "Component libraries", "Design tokens", "Prototyping", "Developer handoff"],
  git: ["Branching & merging", "Distributed version control", "Staging area", "Hooks & automation", "Submodules", "Bisect debugging"],
};

// ─── Component ──────────────────────────────────────────────────

interface ToolFeaturesProps {
  tool: ToolItem;
}

/**
 * Features and installation section.
 * Shows key capabilities as a grid, plus install commands in code blocks.
 */
export function ToolFeatures({ tool }: ToolFeaturesProps) {
  const features = TOOL_FEATURES[tool.slug] || [];
  const installs = INSTALL_COMMANDS[tool.slug] || [];

  if (features.length === 0 && installs.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* ── Features ──────────────────────────────────────── */}
      {features.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} className="text-emerald-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-text-primary">
              Key Features
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {features.map((feature) => (
              <div
                key={feature}
                className="
                  flex items-center gap-2.5
                  p-2.5 rounded-lg
                  bg-white/[0.02] border border-white/[0.06]
                "
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-xs text-text-secondary">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Installation ──────────────────────────────────── */}
      {installs.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Terminal size={15} className="text-emerald-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-text-primary">
              Installation
            </h2>
          </div>
          <div className="space-y-3">
            {installs.map((install) => (
              <div key={install.label}>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1.5">
                  {install.label}
                </p>
                <div className="relative rounded-lg overflow-hidden bg-[#0d1117] border border-white/[0.06]">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
                    <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
                      shell
                    </span>
                  </div>
                  <pre className="p-3 overflow-x-auto text-xs leading-relaxed">
                    <code className="text-emerald-300 font-mono">
                      $ {install.command}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
