import type { AnonymousOnboardingFlowState, CustomerContext } from "@procertus-ui/ui-certification";
import {
  ONBOARDING_FLOW_STORAGE_KEY,
  readOnboardingRegistrationCompletePayload,
  writeOnboardingRegistrationCompletePayload,
} from "@procertus-ui/ui-certification";

function mergeCustomerContext(base: CustomerContext, partial: Partial<CustomerContext>): CustomerContext {
  return { ...base, ...partial };
}

/**
 * Merges partial {@link CustomerContext} into persisted anonymous onboarding storage (flow state
 * and registration-complete snapshot when present). No-op when nothing is stored or parsing fails.
 */
export function mergeStoredOnboardingCustomerContext(partial: Partial<CustomerContext>): void {
  if (typeof localStorage === "undefined") return;
  try {
    const flowRaw = localStorage.getItem(ONBOARDING_FLOW_STORAGE_KEY);
    if (flowRaw) {
      const parsed = JSON.parse(flowRaw) as AnonymousOnboardingFlowState;
      if (parsed?.context && typeof parsed.context === "object") {
        parsed.context = mergeCustomerContext(parsed.context as CustomerContext, partial);
        localStorage.setItem(ONBOARDING_FLOW_STORAGE_KEY, JSON.stringify(parsed));
      }
    }
    const complete = readOnboardingRegistrationCompletePayload();
    if (
      complete &&
      complete.flowStateSnapshot != null &&
      typeof complete.flowStateSnapshot === "object"
    ) {
      const snap = complete.flowStateSnapshot as AnonymousOnboardingFlowState;
      if (snap.context && typeof snap.context === "object") {
        snap.context = mergeCustomerContext(snap.context as CustomerContext, partial);
        writeOnboardingRegistrationCompletePayload({
          representativeEmail:
            partial.representativeEmail !== undefined
              ? partial.representativeEmail
              : complete.representativeEmail,
          organizationName:
            partial.organizationName !== undefined ? partial.organizationName : complete.organizationName,
          includedInquiryCount: complete.includedInquiryCount,
          flowStateSnapshot: snap,
          certificationStoreRaw: complete.certificationStoreRaw,
        });
      }
    }
  } catch {
    /* ignore */
  }
}
