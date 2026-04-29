/** Session snapshot after mock submit: drives the dedicated registration-complete StatusPage. */
export type OnboardingRegistrationCompletePayload = {
  representativeEmail: string;
  organizationName: string;
  includedInquiryCount: number;
  onboardingCompleted: true;
  completedAt: string;
  /** Snapshot of `pt1:onboarding-flow-state` at completion (full wizard + context). */
  flowStateSnapshot: unknown;
  /** Raw `pt1:certification-request-store` value at completion, if present. */
  certificationStoreRaw: string | null;
};

/** Keep in sync with `AnonymousOnboardingFlow.tsx`. */
export const ONBOARDING_FLOW_STORAGE_KEY = "pt1:onboarding-flow-state";
/** Keep in sync with `AnonymousOnboardingFlow.tsx` / `authenticatedRequestStore`. */
export const ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY = "pt1:certification-request-store";

export const ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY = "pt1:onboarding-registration-complete";

/** @deprecated use ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY */
export const ONBOARDING_REGISTRATION_COMPLETE_SESSION_KEY = ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY;

function migrateLegacySessionStoragePayload(): void {
  if (typeof sessionStorage === "undefined" || typeof localStorage === "undefined") return;
  try {
    const legacy = sessionStorage.getItem(ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY);
    if (!legacy) return;
    if (!localStorage.getItem(ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY)) {
      localStorage.setItem(ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY, legacy);
    }
    sessionStorage.removeItem(ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function writeOnboardingRegistrationCompletePayload(
  payload: Omit<
    OnboardingRegistrationCompletePayload,
    "onboardingCompleted" | "completedAt"
  > & {
    flowStateSnapshot: unknown;
    certificationStoreRaw: string | null;
  },
): void {
  if (typeof localStorage === "undefined") return;
  try {
    const full: OnboardingRegistrationCompletePayload = {
      representativeEmail: payload.representativeEmail,
      organizationName: payload.organizationName,
      includedInquiryCount: payload.includedInquiryCount,
      onboardingCompleted: true,
      completedAt: new Date().toISOString(),
      flowStateSnapshot: payload.flowStateSnapshot,
      certificationStoreRaw: payload.certificationStoreRaw,
    };
    localStorage.setItem(ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY, JSON.stringify(full));
  } catch {
    /* ignore quota / private mode */
  }
}

function parsePayload(raw: string): OnboardingRegistrationCompletePayload | null {
  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingRegistrationCompletePayload> & {
      onboardingCompleted?: boolean;
    };
    const representativeEmail =
      typeof parsed.representativeEmail === "string" ? parsed.representativeEmail.trim() : "";
    const organizationName =
      typeof parsed.organizationName === "string" ? parsed.organizationName.trim() : "";
    const includedInquiryCount =
      typeof parsed.includedInquiryCount === "number" && Number.isFinite(parsed.includedInquiryCount)
        ? Math.max(0, Math.floor(parsed.includedInquiryCount))
        : 0;
    if (!representativeEmail || !organizationName) return null;
    const legacyComplete =
      parsed.onboardingCompleted !== true &&
      parsed.completedAt === undefined &&
      parsed.flowStateSnapshot === undefined;
    if (legacyComplete) {
      return {
        representativeEmail,
        organizationName,
        includedInquiryCount,
        onboardingCompleted: true,
        completedAt: new Date(0).toISOString(),
        flowStateSnapshot: null,
        certificationStoreRaw: null,
      };
    }
    if (parsed.onboardingCompleted !== true) return null;
    const completedAt =
      typeof parsed.completedAt === "string" && parsed.completedAt.length > 0
        ? parsed.completedAt
        : new Date(0).toISOString();
    return {
      representativeEmail,
      organizationName,
      includedInquiryCount,
      onboardingCompleted: true,
      completedAt,
      flowStateSnapshot:
        parsed.flowStateSnapshot !== undefined ? parsed.flowStateSnapshot : null,
      certificationStoreRaw:
        typeof parsed.certificationStoreRaw === "string" || parsed.certificationStoreRaw === null
          ? (parsed.certificationStoreRaw ?? null)
          : null,
    };
  } catch {
    return null;
  }
}

export function readOnboardingRegistrationCompletePayload(): OnboardingRegistrationCompletePayload | null {
  migrateLegacySessionStoragePayload();
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY);
    if (!raw) return null;
    return parsePayload(raw);
  } catch {
    return null;
  }
}

/** Removes completion record, onboarding flow state, and certification draft store used by anonymous onboarding. */
export function clearAnonymousOnboardingStorage(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_FLOW_STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  if (typeof sessionStorage !== "undefined") {
    try {
      sessionStorage.removeItem(ONBOARDING_REGISTRATION_COMPLETE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
