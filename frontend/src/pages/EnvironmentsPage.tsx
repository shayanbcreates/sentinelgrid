import { useEffect, useState } from "react";
import {
  Cloud,
  Database,
  Globe,
  Layers,
  Plus,
  Server,
  Shield,
  Trash2,
  Workflow,
} from "lucide-react";
import { api } from "@/lib/api";
import type { CloudEnvironmentRecord, CloudResourceRecord } from "@/types";

const RESOURCE_TYPE_OPTIONS = [
  "vpc",
  "subnet",
  "ec2_instance",
  "security_group",
  "s3_bucket",
  "iam_role",
  "lambda_function",
  "rds_instance",
] as const;

function resourceIcon(type: string) {
  const map: Record<string, React.ReactNode> = {
    vpc: <Workflow className="w-4 h-4" />,
    subnet: <Layers className="w-4 h-4" />,
    ec2_instance: <Server className="w-4 h-4" />,
    security_group: <Shield className="w-4 h-4" />,
    s3_bucket: <Database className="w-4 h-4" />,
    iam_role: <Globe className="w-4 h-4" />,
    lambda_function: <Cloud className="w-4 h-4" />,
    rds_instance: <Database className="w-4 h-4" />,
  };
  return map[type] ?? <Server className="w-4 h-4" />;
}

function stateColor(state: string) {
  const map: Record<string, string> = {
    active: "text-green-400",
    available: "text-green-400",
    running: "text-green-400",
    stopped: "text-yellow-400",
    inactive: "text-gray-500",
    terminated: "text-red-400",
    archived: "text-gray-600",
  };
  return map[state] ?? "text-gray-400";
}

export function EnvironmentsPage() {
  const [environments, setEnvironments] = useState<CloudEnvironmentRecord[]>([]);
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [resources, setResources] = useState<CloudResourceRecord[]>([]);
  const [loadingEnvs, setLoadingEnvs] = useState(true);
  const [loadingResources, setLoadingResources] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create-environment modal state
  const [showEnvForm, setShowEnvForm] = useState(false);
  const [envName, setEnvName] = useState("");
  const [envDescription, setEnvDescription] = useState("");
  const [envRegion, setEnvRegion] = useState("us-east-1");
  const [creating, setCreating] = useState(false);

  // Create-resource modal state
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [resourceType, setResourceType] = useState<string>(RESOURCE_TYPE_OPTIONS[0]);
  const [resourceName, setResourceName] = useState("");
  const [creatingResource, setCreatingResource] = useState(false);

  const selectedEnv = environments.find((e) => e.id === selectedEnvId) ?? null;

  useEffect(() => {
    setLoadingEnvs(true);
    api.environments
      .list()
      .then(setEnvironments)
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoadingEnvs(false));
  }, []);

  useEffect(() => {
    if (!selectedEnvId) {
      setResources([]);
      return;
    }
    setLoadingResources(true);
    api.resources
      .list(selectedEnvId)
      .then(setResources)
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoadingResources(false));
  }, [selectedEnvId]);

  async function handleCreateEnvironment(e: React.FormEvent) {
    e.preventDefault();
    if (!envName.trim()) return;
    setCreating(true);
    try {
      const env = await api.environments.create({
        name: envName.trim(),
        description: envDescription.trim() || undefined,
        region: envRegion,
      });
      setEnvironments((prev) => [...prev, env]);
      setSelectedEnvId(env.id);
      setShowEnvForm(false);
      setEnvName("");
      setEnvDescription("");
    } catch (err) {
      setError(String(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteEnvironment(id: string) {
    try {
      await api.environments.delete(id);
      setEnvironments((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnvId === id) setSelectedEnvId(null);
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleCreateResource(e: React.FormEvent) {
    e.preventDefault();
    if (!resourceName.trim() || !selectedEnvId) return;
    setCreatingResource(true);
    try {
      const resource = await api.resources.create(selectedEnvId, {
        resource_type: resourceType,
        name: resourceName.trim(),
      });
      setResources((prev) => [...prev, resource]);
      setShowResourceForm(false);
      setResourceName("");
    } catch (err) {
      setError(String(err));
    } finally {
      setCreatingResource(false);
    }
  }

  async function handleDeleteResource(id: string) {
    try {
      await api.resources.delete(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="flex h-full">
      {/* Left panel — environment list */}
      <div className="w-64 flex-shrink-0 border-r border-border-subtle flex flex-col">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Environments</h2>
          <button
            onClick={() => setShowEnvForm(true)}
            className="p-1 rounded hover:bg-surface-overlay text-gray-400 hover:text-white transition-colors"
            title="New environment"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {loadingEnvs ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-500">Loading…</p>
          </div>
        ) : environments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <Cloud className="w-8 h-8 text-gray-600" />
            <p className="text-xs text-gray-500">No environments yet.</p>
            <button
              onClick={() => setShowEnvForm(true)}
              className="text-xs text-accent hover:underline"
            >
              Create one
            </button>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-border-muted">
            {environments.map((env) => (
              <li key={env.id}>
                <button
                  onClick={() => setSelectedEnvId(env.id)}
                  className={`w-full text-left px-4 py-3 group flex items-start justify-between gap-2 transition-colors ${
                    selectedEnvId === env.id
                      ? "bg-accent/10 text-white"
                      : "text-gray-400 hover:bg-surface-overlay hover:text-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{env.name}</p>
                    <p className="text-xs font-mono text-gray-500 mt-0.5">{env.region}</p>
                    <p className={`text-xs mt-0.5 font-mono ${stateColor(env.state)}`}>
                      {env.state}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDeleteEnvironment(env.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right panel — resource list */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedEnv ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center p-8">
            <Layers className="w-10 h-10 text-gray-700" />
            <p className="text-gray-400">Select an environment to view its resources.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-white">{selectedEnv.name}</h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {selectedEnv.region} · {selectedEnv.id}
                </p>
              </div>
              <button
                onClick={() => setShowResourceForm(true)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Resource
              </button>
            </div>

            {loadingResources ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-gray-500">Loading resources…</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center">
                <Server className="w-10 h-10 text-gray-700" />
                <p className="text-gray-400">No resources in this environment.</p>
                <button
                  onClick={() => setShowResourceForm(true)}
                  className="text-xs text-accent hover:underline"
                >
                  Add the first resource
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {resources.map((r) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      onDelete={() => void handleDeleteResource(r.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create environment form */}
      {showEnvForm && (
        <Modal title="New Environment" onClose={() => setShowEnvForm(false)}>
          <form onSubmit={(e) => void handleCreateEnvironment(e)} className="space-y-4">
            <Field label="Name">
              <input
                autoFocus
                value={envName}
                onChange={(e) => setEnvName(e.target.value)}
                placeholder="Production AWS"
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <input
                value={envDescription}
                onChange={(e) => setEnvDescription(e.target.value)}
                placeholder="Optional"
                className={inputCls}
              />
            </Field>
            <Field label="Region">
              <select
                value={envRegion}
                onChange={(e) => setEnvRegion(e.target.value)}
                className={inputCls}
              >
                {["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEnvForm(false)}
                className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded hover:bg-surface-overlay transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || !envName.trim()}
                className="text-sm px-4 py-1.5 rounded bg-accent text-white disabled:opacity-50 hover:bg-accent/80 transition-colors"
              >
                {creating ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create resource form */}
      {showResourceForm && (
        <Modal title="Add Resource" onClose={() => setShowResourceForm(false)}>
          <form onSubmit={(e) => void handleCreateResource(e)} className="space-y-4">
            <Field label="Type">
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className={inputCls}
              >
                {RESOURCE_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Name">
              <input
                autoFocus
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="main-vpc"
                className={inputCls}
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResourceForm(false)}
                className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded hover:bg-surface-overlay transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingResource || !resourceName.trim()}
                className="text-sm px-4 py-1.5 rounded bg-accent text-white disabled:opacity-50 hover:bg-accent/80 transition-colors"
              >
                {creatingResource ? "Adding…" : "Add"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-500/40 rounded px-4 py-2 text-sm text-red-200 flex items-center gap-3">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Sub-components ----

function ResourceCard({
  resource,
  onDelete,
}: {
  resource: CloudResourceRecord;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-elevated p-4 group hover:border-border-subtle/80 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span className="text-gray-400">{resourceIcon(resource.resource_type)}</span>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <p className="text-sm font-medium text-white truncate">{resource.name}</p>
      <p className="text-xs font-mono text-gray-500 mt-0.5">{resource.resource_type}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs font-mono text-gray-600">{resource.region}</p>
        <span className={`text-xs font-mono ${stateColor(resource.state)}`}>
          {resource.state}
        </span>
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface-elevated border border-border-subtle rounded-lg w-full max-w-sm mx-4 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-surface border border-border-subtle rounded px-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent/60";
