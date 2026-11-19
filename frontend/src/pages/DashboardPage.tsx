import { Activity, AlertTriangle, Shield, Zap } from "lucide-react";
import { useSimulationStore } from "@/stores/simulationStore";

export function DashboardPage() {
  const { incidents, events, agentRuns, simulation } = useSimulationStore();

  const openIncidents = incidents.filter((i) => i.status === "OPEN" || i.status === "INVESTIGATING");
  const criticalCount = incidents.filter((i) => i.severity === "CRITICAL").length;
  const activeAgents = agentRuns.filter((a) => a.status === "RUNNING").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Security Overview</h1>
        <p className="text-sm text-gray-400 mt-1">
          {simulation.status === "IDLE"
            ? "No active simulation — open Simulation Studio to begin"
            : `Simulation ${simulation.status.toLowerCase()} · ${simulation.scenario ?? ""}`}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Open Incidents"
          value={openIncidents.length}
          icon={<AlertTriangle className="w-4 h-4" />}
          accent={openIncidents.length > 0 ? "red" : "green"}
        />
        <StatCard
          label="Critical Findings"
          value={criticalCount}
          icon={<Shield className="w-4 h-4" />}
          accent={criticalCount > 0 ? "red" : "green"}
        />
        <StatCard
          label="Security Events"
          value={events.length}
          icon={<Activity className="w-4 h-4" />}
          accent="blue"
        />
        <StatCard
          label="Active Agents"
          value={activeAgents}
          icon={<Zap className="w-4 h-4" />}
          accent={activeAgents > 0 ? "yellow" : "gray"}
        />
      </div>

      {/* Recent incidents */}
      {incidents.length === 0 ? (
        <div className="rounded-lg border border-border-subtle bg-surface-elevated p-8 text-center">
          <Shield className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No incidents detected yet.</p>
          <p className="text-sm text-gray-600 mt-1">
            Launch a simulation in Simulation Studio to see agents in action.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border-subtle bg-surface-elevated overflow-hidden">
          <div className="px-4 py-3 border-b border-border-subtle">
            <h2 className="text-sm font-medium text-white">Recent Incidents</h2>
          </div>
          <ul className="divide-y divide-border-muted">
            {incidents.slice(0, 10).map((inc) => (
              <li key={inc.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">{inc.title}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{inc.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border ${severityClass(inc.severity)}`}>
                    {inc.severity}
                  </span>
                  <span className="text-xs text-gray-500">{inc.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function severityClass(s: string) {
  const map: Record<string, string> = {
    CRITICAL: "text-red-400 border-red-500/40",
    HIGH: "text-orange-400 border-orange-500/40",
    MEDIUM: "text-yellow-400 border-yellow-500/40",
    LOW: "text-green-400 border-green-500/40",
    INFORMATIONAL: "text-blue-400 border-blue-500/40",
  };
  return map[s] ?? "text-gray-400 border-gray-500/40";
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: "red" | "green" | "blue" | "yellow" | "gray";
}

const accentMap = {
  red: "text-red-400",
  green: "text-green-400",
  blue: "text-blue-400",
  yellow: "text-yellow-400",
  gray: "text-gray-500",
};

function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-elevated p-4 flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className={`text-3xl font-semibold mt-1 ${accentMap[accent]}`}>{value}</p>
      </div>
      <span className={accentMap[accent]}>{icon}</span>
    </div>
  );
}
