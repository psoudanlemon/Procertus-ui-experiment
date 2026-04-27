import type { CreateCertificationRequestSession } from "@procertus-ui/domain-certification";
import {
  createCertificationBackendFromRef,
  emptyCertificationStorageState,
  type CertificationRequestBackend,
  type CertificationStorageState,
} from "./core";

export function createInMemoryCertificationRequestBackend({
  sessionId = "certification-request-session",
  initialSession,
  initialState,
}: {
  sessionId?: string;
  initialSession: CreateCertificationRequestSession;
  initialState?: CertificationStorageState;
}): CertificationRequestBackend {
  return createCertificationBackendFromRef({
    ref: { state: initialState ?? emptyCertificationStorageState() },
    sessionId,
    initialSession,
  });
}
