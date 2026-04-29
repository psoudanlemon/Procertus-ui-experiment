import type { AnonymousOnboardingFlowState, CustomerContext } from "@procertus-ui/ui-certification";
import {
  ONBOARDING_FLOW_STORAGE_KEY,
  readOnboardingRegistrationCompletePayload,
} from "@procertus-ui/ui-certification";

export type StoredOnboardingContexts = {
  /** Latest in-progress flow (`pt1:onboarding-flow-state`). */
  flowContext: CustomerContext | null;
  /** `context` from the registration-complete snapshot, if present. */
  completedSnapshotContext: CustomerContext | null;
};

function parseFlowStateRaw(raw: string): CustomerContext | null {
  try {
    const parsed = JSON.parse(raw) as AnonymousOnboardingFlowState;
    const ctx = parsed?.context;
    if (ctx && typeof ctx === "object") return ctx as CustomerContext;
  } catch {
    /* ignore */
  }
  return null;
}

function contextFromRegistrationSnapshot(snapshot: unknown): CustomerContext | null {
  if (!snapshot || typeof snapshot !== "object") return null;
  const flow = snapshot as Partial<AnonymousOnboardingFlowState>;
  const ctx = flow.context;
  if (ctx && typeof ctx === "object") return ctx as CustomerContext;
  return null;
}

/** Reads onboarding customer/company fields persisted during the anonymous flow (browser localStorage). */
export function readStoredOnboardingContexts(): StoredOnboardingContexts {
  let flowContext: CustomerContext | null = null;
  let completedSnapshotContext: CustomerContext | null = null;
  if (typeof localStorage === "undefined") {
    return { flowContext, completedSnapshotContext };
  }
  try {
    const flowRaw = localStorage.getItem(ONBOARDING_FLOW_STORAGE_KEY);
    if (flowRaw) flowContext = parseFlowStateRaw(flowRaw);
    const complete = readOnboardingRegistrationCompletePayload();
    if (complete?.flowStateSnapshot != null) {
      completedSnapshotContext = contextFromRegistrationSnapshot(complete.flowStateSnapshot);
    }
  } catch {
    /* ignore */
  }
  return { flowContext, completedSnapshotContext };
}

/** Structural compare for deduping when flow state and registration snapshot hold the same context. */
export function customerContextsEqual(a: CustomerContext, b: CustomerContext): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
