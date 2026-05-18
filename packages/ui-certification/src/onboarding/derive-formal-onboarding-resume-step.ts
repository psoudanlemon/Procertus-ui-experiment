import {
  effectiveIncludedCertificationDraftIds,
  isApplicantLegalRepresentativeChoiceComplete,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyLegalEntitiesStepValid,
  isOnboardingCompanyZetelStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
  isRegistrantCaptureValidForContext,
} from "./onboarding-flow-helpers";
import { isInnovationAttestInquiryResumeOk } from "./onboarding-innovation-attest";
import { isMetrologyInquiryResumeOk } from "./onboarding-metrology";
import {
  registrationDraftsIncludeInnovationAttest,
  registrationDraftsIncludeMetrology,
  registrationStepsSequence,
} from "./onboarding-registration-steps";
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
 * Zolang “Bent u de wettelijke vertegenwoordiger?” onbeantwoord is, blijft resume **altijd** `customer`
 * (tweede stap na origin), nooit een latere stap — ook niet bij een diepe URL of stapper onder prototype‑relax.
 * De maatschappelijke‑zetelstap telt pas als afgerond als {@link OnboardingFlowState.companyZetelStepCompleted}
 * `true` is (na **Verder**); alléén een geldige lookup vult `context` al in.
 * Hetzelfde patroon geldt voor latere stappen waar validatie `true` kan zijn vóór **Verder**
 * (o.a. innovatie‑attest, metrologie, certificatie‑entiteit, facturatie, optionele contacten).
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
    | "innovationAttestInquiry"
    | "metrologyInquiry"
  >,
  context: CustomerContext,
): OnboardingStep {
  if (flowState.requestOrigin === "") return "origin";
  if (!isApplicantLegalRepresentativeChoiceComplete(context)) return "customer";

  const certificationInquiryDraftIds = effectiveIncludedCertificationDraftIds(
    flowState.drafts,
    flowState.summaryIncludedDraftIds,
  );
  const registrationSeq = registrationStepsSequence(flowState.drafts);
  const includesCompanyLegalEntitiesStep = registrationSeq.includes("companyLegalEntities");
  const hasCustomerContext =
    isRegistrantCaptureValidForContext(context) &&
    isLegalRepresentativeCaptureComplete(context) &&
    (flowState.requestOrigin
      ? isRegistrationIdentifierValidForOrigin(context.vatNumber ?? "", flowState.requestOrigin)
      : isVatIdentifierPlausible(context.vatNumber ?? ""));
  const registrationStepOk = hasCustomerContext;
  const companyZetelOk =
    isOnboardingCompanyZetelStepValid(context) && flowState.companyZetelStepCompleted;

  const needsInnovationAttest = registrationDraftsIncludeInnovationAttest(flowState.drafts);
  const innovationResumeOk = isInnovationAttestInquiryResumeOk(
    flowState.innovationAttestInquiry,
    needsInnovationAttest,
  );

  const needsMetrology = registrationDraftsIncludeMetrology(flowState.drafts);
  const metrologyResumeOk = isMetrologyInquiryResumeOk(
    flowState.metrologyInquiry,
    needsMetrology,
  );

  const companyLegalEntitiesOk =
    !includesCompanyLegalEntitiesStep ||
    (isOnboardingCompanyLegalEntitiesStepValid(
      context,
      certificationInquiryDraftIds,
      flowState.drafts,
    ) &&
      flowState.companyLegalEntitiesStepCompleted);
  const invoicingStepOk =
    isOnboardingInvoicingStepValid(context, certificationInquiryDraftIds, flowState.drafts) &&
    flowState.invoicingStepCompleted;
  const optionalContactsOk =
    isOnboardingOptionalContactsStepValid(context) && flowState.extrasStepCompleted;

  let step: OnboardingStep;
  if (!registrationStepOk) step = "customer";
  else if (!companyZetelOk) step = "company";
  else if (!innovationResumeOk) step = "innovationAttest";
  else if (!metrologyResumeOk) step = "metrologyAttest";
  else if (!companyLegalEntitiesOk) step = "companyLegalEntities";
  else if (!invoicingStepOk) step = "invoicing";
  else if (!optionalContactsOk) step = "extras";
  else step = "summary";

  return step;
}
