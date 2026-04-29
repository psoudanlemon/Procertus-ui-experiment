/** Session snapshot after mock submit: drives the dedicated registration-complete StatusPage. */
export type OnboardingRegistrationCompletePayload = {
  representativeEmail: string;
  organizationName: string;
  includedInquiryCount: number;
};

export const ONBOARDING_REGISTRATION_COMPLETE_SESSION_KEY = "pt1:onboarding-registration-complete";

export function writeOnboardingRegistrationCompletePayload(payload: OnboardingRegistrationCompletePayload): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(ONBOARDING_REGISTRATION_COMPLETE_SESSION_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

export function readOnboardingRegistrationCompletePayload(): OnboardingRegistrationCompletePayload | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ONBOARDING_REGISTRATION_COMPLETE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingRegistrationCompletePayload>;
    const representativeEmail = typeof parsed.representativeEmail === "string" ? parsed.representativeEmail.trim() : "";
    const organizationName = typeof parsed.organizationName === "string" ? parsed.organizationName.trim() : "";
    const includedInquiryCount =
      typeof parsed.includedInquiryCount === "number" && Number.isFinite(parsed.includedInquiryCount)
        ? Math.max(0, Math.floor(parsed.includedInquiryCount))
        : 0;
    if (!representativeEmail || !organizationName) return null;
    return { representativeEmail, organizationName, includedInquiryCount };
  } catch {
    return null;
  }
}
