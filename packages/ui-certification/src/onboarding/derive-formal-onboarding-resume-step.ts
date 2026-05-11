import { ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION } from "./onboarding-constants";
import {
  effectiveIncludedCertificationDraftIds,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyLegalEntitiesStepValid,
  isOnboardingCompanyZetelStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
  isRegistrantCaptureValidForContext,
} from "./onboarding-flow-helpers";
import type { CustomerContext, OnboardingFlowState, OnboardingStep } from "./onboarding-types";
import { isRegistrationIdentifierValidForOrigin } from "./lib/registration-identifier-for-origin";
import { isVatIdentifierPlausible } from "./lib/vatPrototypePresets";

/**
 * First incomplete registration step (origin…summary) for the formal flow when the URL has no step id.
 * Also used by hosts to clamp impossible deep links (compare to URL step outside this package).
 */
export function deriveFormalOnboardingResumeStep(
  flowState: Pick<OnboardingFlowState, "drafts" | "requestOrigin" | "summaryIncludedDraftIds">,
  context: CustomerContext,
): OnboardingStep {
  const certificationInquiryDraftIds = effectiveIncludedCertificationDraftIds(
    flowState.drafts,
    flowState.summaryIncludedDraftIds,
  );
  const hasCustomerContext =
    (context.applicantIsLegalRepresentative === "yes" ||
      context.applicantIsLegalRepresentative === "no") &&
    isRegistrantCaptureValidForContext(context) &&
    isLegalRepresentativeCaptureComplete(context) &&
    (flowState.requestOrigin
      ? isRegistrationIdentifierValidForOrigin(context.vatNumber ?? "", flowState.requestOrigin)
      : isVatIdentifierPlausible(context.vatNumber ?? ""));
  const registrationStepOk = hasCustomerContext || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const companyZetelOk =
    isOnboardingCompanyZetelStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const companyLegalEntitiesOk = isOnboardingCompanyLegalEntitiesStepValid(
    context,
    certificationInquiryDraftIds,
  );
  const invoicingStepOk =
    isOnboardingInvoicingStepValid(context, certificationInquiryDraftIds) ||
    ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const optionalContactsOk =
    isOnboardingOptionalContactsStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;

  let step: OnboardingStep;
  if (flowState.requestOrigin === "") step = "origin";
  else if (!registrationStepOk) step = "customer";
  else if (!companyZetelOk) step = "company";
  else if (!companyLegalEntitiesOk) step = "companyLegalEntities";
  else if (!invoicingStepOk) step = "invoicing";
  else if (!optionalContactsOk) step = "extras";
  else step = "summary";

  return step;
}
