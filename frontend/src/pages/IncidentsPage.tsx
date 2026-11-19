import { Shield } from "lucide-react";
import { useSimulationStore } from "@/stores/simulationStore";
import { SeverityBadge } from "@/components/ui/Badge";

export function IncidentsPage() {
  const { incidents, remediationActions, approveRemediation, rejectRemediation } =
    useSimulationStore();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Incidents</h1>

      {incidents.length === 0 ? (
        <div className="rounded-lg border border-border-subtle bg-surface-elevated p-10 text-center">
          <Shield className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No incidents yet. Run a simulation to generate findings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((inc) => {
            const actions = remediationActions.filter((a) => a.incidentId === inc.id);
            return (
              <div
                key={inc.id}
                className="rounded-lg border border-border-subtle bg-surface-elevated overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border-muted flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={inc.severity} />
                    <span className="text-sm font-medium text-white">{inc.title}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-500">{inc.status}</span>
                </div>

                <div className="px-4 py-3 text-xs text-gray-500 font-mono space-y-1">
                  <p>ID: {inc.id}</p>
                  <p>Created: {new Date(inc.createdAt).toLocaleString()}</p>
                  <p>Resources: {inc.affectedResources.join(", ") || "—"}</p>
                </div>

                {actions.length > 0 && (
                  <div className="px-4 pb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Remediation Proposals
                    </p>
                    {actions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center justify-between gap-4 rounded border border-border-muted px-3 py-2 mb-2"
                      >
                        <p className="text-sm text-gray-300 flex-1">{action.description}</p>
                        {action.approvalStatus === "PENDING" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveRemediation(action.id)}
                              className="px-2 py-1 rounded bg-green-900/50 text-green-400 border border-green-500/30 text-xs hover:bg-green-900/80 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectRemediation(action.id)}
                              className="px-2 py-1 rounded bg-red-900/50 text-red-400 border border-red-500/30 text-xs hover:bg-red-900/80 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`text-xs font-mono ${
                              action.approvalStatus === "APPROVED"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {action.approvalStatus}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
