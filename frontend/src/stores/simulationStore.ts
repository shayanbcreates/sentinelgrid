import { create } from "zustand";
import type { AgentRun, Incident, RemediationAction, SecurityEvent, SimulationState } from "@/types";

interface SimulationStore {
  simulation: SimulationState;
  events: SecurityEvent[];
  incidents: Incident[];
  agentRuns: AgentRun[];
  remediationActions: RemediationAction[];

  setSimulation: (s: Partial<SimulationState>) => void;
  addEvents: (events: SecurityEvent[]) => void;
  addIncident: (incident: Incident) => void;
  updateAgentRun: (run: AgentRun) => void;
  addRemediationAction: (action: RemediationAction) => void;
  approveRemediation: (id: string) => void;
  rejectRemediation: (id: string) => void;
  reset: () => void;
}

const initialSimulation: SimulationState = {
  id: null,
  status: "IDLE",
  scenario: null,
  startedAt: null,
  elapsedSeconds: 0,
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  simulation: initialSimulation,
  events: [],
  incidents: [],
  agentRuns: [],
  remediationActions: [],

  setSimulation: (s) =>
    set((state) => ({ simulation: { ...state.simulation, ...s } })),

  addEvents: (events) =>
    set((state) => ({ events: [...state.events, ...events] })),

  addIncident: (incident) =>
    set((state) => ({ incidents: [...state.incidents, incident] })),

  updateAgentRun: (run) =>
    set((state) => ({
      agentRuns: [
        ...state.agentRuns.filter((r) => r.agent !== run.agent),
        run,
      ],
    })),

  addRemediationAction: (action) =>
    set((state) => ({ remediationActions: [...state.remediationActions, action] })),

  approveRemediation: (id) =>
    set((state) => ({
      remediationActions: state.remediationActions.map((a) =>
        a.id === id ? { ...a, approvalStatus: "APPROVED" } : a
      ),
    })),

  rejectRemediation: (id) =>
    set((state) => ({
      remediationActions: state.remediationActions.map((a) =>
        a.id === id ? { ...a, approvalStatus: "REJECTED" } : a
      ),
    })),

  reset: () =>
    set({
      simulation: initialSimulation,
      events: [],
      incidents: [],
      agentRuns: [],
      remediationActions: [],
    }),
}));
