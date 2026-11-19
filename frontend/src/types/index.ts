// Severity levels aligned with AWS Security Hub
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL";

// Virtual cloud resource types
export type ResourceType =
  | "IAM_USER"
  | "IAM_ROLE"
  | "IAM_POLICY"
  | "EC2_INSTANCE"
  | "S3_BUCKET"
  | "LAMBDA_FUNCTION"
  | "VPC"
  | "SUBNET"
  | "SECURITY_GROUP";

export type ResourceState = "NORMAL" | "COMPROMISED" | "ISOLATED" | "REMEDIATED" | "ALERTING";

export interface CloudResource {
  id: string;
  type: ResourceType;
  name: string;
  region: string;
  state: ResourceState;
  properties: Record<string, unknown>;
  createdAt: string;
}

// Simulation
export type SimulationStatus = "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED";

export type AttackScenario =
  | "COMPROMISED_IAM_CREDENTIALS"
  | "IAM_PRIVILEGE_ESCALATION"
  | "EXPOSED_S3_BUCKET"
  | "DDOS_SURGE"
  | "LATERAL_MOVEMENT";

export interface SimulationState {
  id: string | null;
  status: SimulationStatus;
  scenario: AttackScenario | null;
  startedAt: string | null;
  elapsedSeconds: number;
}

// Security events (synthetic CloudTrail-like)
export interface SecurityEvent {
  id: string;
  eventName: string;
  eventSource: string;
  timestamp: string;
  sourceIpAddress: string;
  userAgent: string;
  resourceArn: string | null;
  severity: Severity;
  raw: Record<string, unknown>;
}

// Incidents and alerts
export type IncidentStatus = "OPEN" | "INVESTIGATING" | "CONTAINED" | "RESOLVED";

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  createdAt: string;
  affectedResources: string[];
  eventIds: string[];
}

// Agent state
export type AgentName = "DETECTION" | "INVESTIGATION" | "RISK_ASSESSMENT" | "REMEDIATION";
export type AgentStatus = "IDLE" | "RUNNING" | "COMPLETED" | "ERROR";

export interface AgentRun {
  agent: AgentName;
  status: AgentStatus;
  startedAt: string | null;
  completedAt: string | null;
  findings: string[];
}

// Remediation
export interface RemediationAction {
  id: string;
  incidentId: string;
  description: string;
  actionType: string;
  targetResourceId: string;
  proposedBy: AgentName;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED";
  createdAt: string;
}
