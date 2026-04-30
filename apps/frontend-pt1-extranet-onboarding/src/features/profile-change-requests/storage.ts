import type { ProfileChangeRequestStore } from "./types";

export const PROFILE_CHANGE_REQUESTS_STORAGE_KEY = "pt1-profile-change-requests";

/** Bumped on every successful in-app write so `useSyncExternalStore` consumers re-render together. */
let profileChangeRequestStoreGeneration = 0;
const profileChangeRequestStoreListeners = new Set<() => void>();

function notifyProfileChangeRequestStoreListeners() {
  profileChangeRequestStoreGeneration += 1;
  profileChangeRequestStoreListeners.forEach((listener) => {
    listener();
  });
}

export function subscribeProfileChangeRequestStore(onStoreChange: () => void) {
  profileChangeRequestStoreListeners.add(onStoreChange);
  ensureCrossTabProfileChangeRequestSync();
  return () => {
    profileChangeRequestStoreListeners.delete(onStoreChange);
  };
}

export function getProfileChangeRequestStoreGeneration(): number {
  return profileChangeRequestStoreGeneration;
}

let crossTabSyncAttached = false;
function ensureCrossTabProfileChangeRequestSync() {
  if (typeof window === "undefined" || crossTabSyncAttached) return;
  crossTabSyncAttached = true;
  window.addEventListener("storage", (event) => {
    if (event.key === PROFILE_CHANGE_REQUESTS_STORAGE_KEY) {
      notifyProfileChangeRequestStoreListeners();
    }
  });
}

function emptyStore(): ProfileChangeRequestStore {
  return { requests: [] };
}

export function readProfileChangeRequestStore(): ProfileChangeRequestStore {
  if (typeof localStorage === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(PROFILE_CHANGE_REQUESTS_STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as ProfileChangeRequestStore).requests)) {
      return emptyStore();
    }
    return parsed as ProfileChangeRequestStore;
  } catch {
    return emptyStore();
  }
}

export function writeProfileChangeRequestStore(store: ProfileChangeRequestStore): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(PROFILE_CHANGE_REQUESTS_STORAGE_KEY, JSON.stringify(store));
    notifyProfileChangeRequestStoreListeners();
  } catch {
    /* ignore */
  }
}

export function newChangeNoteId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `n-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function newChangeRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `cr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
