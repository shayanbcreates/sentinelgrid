import type {
  CloudEnvironmentRecord,
  CloudResourceRecord,
  ResourceRelationshipRecord,
} from "@/types";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Environments
export const api = {
  environments: {
    list: () => request<CloudEnvironmentRecord[]>("/environments"),
    create: (body: { name: string; description?: string; region?: string }) =>
      request<CloudEnvironmentRecord>("/environments", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<{ name: string; description: string; state: string }>) =>
      request<CloudEnvironmentRecord>(`/environments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    delete: (id: string) => request<void>(`/environments/${id}`, { method: "DELETE" }),
  },

  resources: {
    list: (envId: string) => request<CloudResourceRecord[]>(`/environments/${envId}/resources`),
    create: (
      envId: string,
      body: { resource_type: string; name: string; region?: string; properties?: Record<string, unknown> }
    ) =>
      request<CloudResourceRecord>(`/environments/${envId}/resources`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<{ name: string; state: string; properties: Record<string, unknown> }>) =>
      request<CloudResourceRecord>(`/resources/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    delete: (id: string) => request<void>(`/resources/${id}`, { method: "DELETE" }),
  },

  relationships: {
    create: (body: { source_id: string; target_id: string; relationship_type: string }) =>
      request<ResourceRelationshipRecord>("/relationships", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
};
