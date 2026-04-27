import type { CreateCertificationRequestSession } from "@procertus-ui/domain-certification";
import {
  createCertificationBackendFromRef,
  emptyCertificationStorageState,
  type CertificationRequestBackend,
  type CertificationStorageState,
} from "./core";
import { createInMemoryCertificationRequestBackend } from "./memory";

function readStorage(storage: Storage, storageKey: string): CertificationStorageState {
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptyCertificationStorageState();
    const parsed = JSON.parse(raw) as Partial<CertificationStorageState>;
    return {
      sessions: parsed.sessions ?? {},
      customerContexts: parsed.customerContexts ?? {},
      packages: parsed.packages ?? {},
    };
  } catch {
    return emptyCertificationStorageState();
  }
}

export function createLocalStorageCertificationRequestBackend({
  storageKey = "procertus-certification-request-store",
  sessionId = "certification-request-session",
  initialSession,
  storage = typeof localStorage !== "undefined" ? localStorage : undefined,
}: {
  storageKey?: string;
  sessionId?: string;
  initialSession: CreateCertificationRequestSession;
  storage?: Storage;
}): CertificationRequestBackend {
  if (!storage) {
    return createInMemoryCertificationRequestBackend({ sessionId, initialSession });
  }

  return createCertificationBackendFromRef({
    ref: { state: readStorage(storage, storageKey) },
    sessionId,
    initialSession,
    persist: (state) => storage.setItem(storageKey, JSON.stringify(state)),
  });
}
