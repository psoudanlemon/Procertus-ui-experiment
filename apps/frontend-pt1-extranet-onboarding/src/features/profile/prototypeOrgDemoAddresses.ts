const STORAGE_KEY = "pt1:extranet-prototype-org-demo-addresses";

function readAll(): Record<string, string> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "string" && v.trim().length > 0) out[k] = v.trim();
    }
    return out;
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, string>): void {
  if (typeof localStorage === "undefined") return;
  try {
    if (Object.keys(map).length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/** Demo-only address line shown on the organisation profile (overrides static mock per org id). */
export function resolveOrgDemoAddress(organizationId: string, fallback: string): string {
  const v = readAll()[organizationId];
  return v !== undefined && v.length > 0 ? v : fallback;
}

export function setOrgDemoAddressOverride(organizationId: string, address: string): void {
  const next = readAll();
  const t = address.trim();
  if (t.length === 0) delete next[organizationId];
  else next[organizationId] = t;
  writeAll(next);
}
