import { Activity } from "lucide-react";
import { useSimulationStore } from "@/stores/simulationStore";
import { SeverityBadge } from "@/components/ui/Badge";

export function EventsPage() {
  const { events } = useSimulationStore();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Security Events</h1>

      {events.length === 0 ? (
        <div className="rounded-lg border border-border-subtle bg-surface-elevated p-10 text-center">
          <Activity className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            No security events yet. Launch a simulation to generate synthetic telemetry.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border-subtle bg-surface-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border-subtle text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">Event</th>
                  <th className="text-left px-4 py-2">Source</th>
                  <th className="text-left px-4 py-2">IP</th>
                  <th className="text-left px-4 py-2">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-surface-overlay transition-colors">
                    <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2 text-white">{ev.eventName}</td>
                    <td className="px-4 py-2 text-gray-400">{ev.eventSource}</td>
                    <td className="px-4 py-2 text-gray-400">{ev.sourceIpAddress}</td>
                    <td className="px-4 py-2">
                      <SeverityBadge severity={ev.severity} />
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
}
