import { Play, Square, RotateCcw } from "lucide-react";
import { useSimulationStore } from "@/stores/simulationStore";
import type { AttackScenario } from "@/types";

const SCENARIOS: { id: AttackScenario; label: string; description: string }[] = [
  {
    id: "COMPROMISED_IAM_CREDENTIALS",
    label: "Compromised IAM Credentials",
    description: "Attacker uses stolen access keys to enumerate AWS resources and exfiltrate data.",
  },
  {
    id: "IAM_PRIVILEGE_ESCALATION",
    label: "IAM Privilege Escalation",
    description: "Low-privilege user exploits misconfigured policies to gain admin access.",
  },
  {
    id: "EXPOSED_S3_BUCKET",
    label: "Exposed S3 Bucket",
    description: "Public S3 bucket exposes sensitive data, triggering detection and containment.",
  },
  {
    id: "DDOS_SURGE",
    label: "DDoS Traffic Surge",
    description: "Flood of synthetic traffic targets EC2 instances, triggering rate-limit alerts.",
  },
  {
    id: "LATERAL_MOVEMENT",
    label: "Lateral Movement",
    description: "Attacker pivots across VPC subnets after initial EC2 compromise.",
  },
];

export function SimulationStudioPage() {
  const { simulation, setSimulation, reset } = useSimulationStore();
  const isIdle = simulation.status === "IDLE";
  const isRunning = simulation.status === "RUNNING";

  const handleStart = () => {
    if (!simulation.scenario) return;
    setSimulation({
      id: crypto.randomUUID(),
      status: "RUNNING",
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
    });
  };

  const handleStop = () => setSimulation({ status: "PAUSED" });
  const handleReset = () => reset();

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-surface-elevated">
        <span className="text-sm font-medium text-white">Simulation Studio</span>
        <div className="flex-1" />
        <button
          onClick={handleStart}
          disabled={!isIdle || !simulation.scenario}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent/90 hover:bg-accent text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          Launch Attack
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-subtle text-gray-300 text-xs hover:bg-surface-overlay disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Square className="w-3.5 h-3.5" />
          Pause
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-subtle text-gray-400 text-xs hover:bg-surface-overlay transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Scenario selector sidebar */}
        <div className="w-64 border-r border-border-subtle bg-surface-elevated flex flex-col">
          <div className="px-3 py-2 border-b border-border-muted">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Attack Scenario</p>
          </div>
          <ul className="flex-1 overflow-y-auto scrollbar-thin">
            {SCENARIOS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => isIdle && setSimulation({ scenario: s.id })}
                  className={`w-full text-left px-3 py-3 border-b border-border-muted transition-colors ${
                    simulation.scenario === s.id
                      ? "bg-accent-glow border-l-2 border-l-accent"
                      : "hover:bg-surface-overlay"
                  } ${!isIdle ? "cursor-not-allowed" : ""}`}
                >
                  <p className="text-xs font-medium text-white leading-tight">{s.label}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{s.description}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Canvas area — React Flow goes here in Phase 3 */}
        <div className="flex-1 flex items-center justify-center bg-surface relative overflow-hidden">
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #58a6ff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative text-center max-w-md px-6">
            {simulation.status === "IDLE" ? (
              <>
                <div className="w-14 h-14 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-gray-400 text-sm">
                  {simulation.scenario
                    ? "Press Launch Attack to start the simulation"
                    : "Select an attack scenario from the sidebar, then press Launch Attack"}
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-glow border border-accent/30 text-accent text-sm mb-3">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  {simulation.status}
                </div>
                <p className="text-gray-400 text-sm">
                  Architecture canvas and live topology visualization — Phase 3
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
