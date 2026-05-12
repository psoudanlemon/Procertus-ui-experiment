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
 *
 * Uses **strict** completion checks only — unlike the live stepper UI, which may honor the prototype
 * relax-validation flag for faster navigation. Resume must reflect what is actually captured so users
 * who only chose a country (origin) are sent back to **customer** until registratiegegevens are complete.
 * De maatschappelijke‑zetelstap telt pas als afgerond als {@link OnboardingFlowState.companyZetelStepCompleted}
 * `true` is (na **Verder**); alléén een geldige lookup vult `context` al in.
 * Hetzelfde patroon geldt voor latere stappen waar validatie `true` kan zijn vóór **Verder**
 * (o.a. certificatie‑entiteit, facturatie, optionele contacten).
 */
export function deriveFormalOnboardingResumeStep(
  flowState: Pick<
    OnboardingFlowState,
    | "drafts"
    | "requestOrigin"
    | "summaryIncludedDraftIds"
    | "companyZetelStepCompleted"
    | "companyLegalEntitiesStepCompleted"
    | "invoicingStepCompleted"
    | "extrasStepCompleted"
  >,
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
  const registrationStepOk = hasCustomerContext;
  const companyZetelOk =
    isOnboardingCompanyZetelStepValid(context) && flowState.companyZetelStepCompleted;
  const companyLegalEntitiesOk =
    isOnboardingCompanyLegalEntitiesStepValid(context, certificationInquiryDraftIds) &&
    flowState.companyLegalEntitiesStepCompleted;
  const invoicingStepOk =
    isOnboardingInvoicingStepValid(context, certificationInquiryDraftIds) &&
    flowState.invoicingStepCompleted;
  const optionalContactsOk =
    isOnboardingOptionalContactsStepValid(context) && flowState.extrasStepCompleted;

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
