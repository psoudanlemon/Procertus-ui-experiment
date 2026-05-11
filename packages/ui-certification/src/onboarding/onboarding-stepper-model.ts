import type { StepLayoutStep } from "@procertus-ui/ui";

import type {
  OnboardingFlowState,
  CustomerContext,
  OnboardingStep,
} from "./onboarding-types";
import {
  formatRequesterStepperLabel,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyCoreStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
  isRegistrantCaptureValidForContext,
} from "./onboarding-flow-helpers";
import { isRegistrationIdentifierValidForOrigin } from "./lib/registration-identifier-for-origin";
import { isVatIdentifierPlausible } from "./lib/vatPrototypePresets";
import { ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION } from "./onboarding-constants";

export type OnboardingPhaseValidity = {
  registrationStepOk: boolean;
  companyCoreOk: boolean;
  invoicingStepOk: boolean;
  optionalContactsOk: boolean;
  summaryStepOk: boolean;
};

/** @param requestOrigin Flow `requestOrigin`; `""` treated as unset. */
export function deriveOnboardingPhaseValidityForFlow(
  requestOrigin: OnboardingFlowState["requestOrigin"],
  context: CustomerContext,
  certificationInquiryDraftIds: readonly string[],
): OnboardingPhaseValidity & { hasCustomerContext: boolean } {
  const hasCustomerContext =
    (context.applicantIsLegalRepresentative === "yes" ||
      context.applicantIsLegalRepresentative === "no") &&
    isRegistrantCaptureValidForContext(context) &&
    isLegalRepresentativeCaptureComplete(context) &&
    (requestOrigin
      ? isRegistrationIdentifierValidForOrigin(context.vatNumber ?? "", requestOrigin)
      : isVatIdentifierPlausible(context.vatNumber ?? ""));
  const registrationStepOk = hasCustomerContext || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const companyCoreOk =
    isOnboardingCompanyCoreStepValid(context, certificationInquiryDraftIds) ||
    ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const invoicingStepOk =
    isOnboardingInvoicingStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const optionalContactsOk =
    isOnboardingOptionalContactsStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const summaryStepOk = companyCoreOk && invoicingStepOk && optionalContactsOk;
  return {
    hasCustomerContext,
    registrationStepOk,
    companyCoreOk,
    invoicingStepOk,
    optionalContactsOk,
    summaryStepOk,
  };
}

export type BuildOnboardingStepperStepsInput = {
  step: OnboardingStep;
  drafts: OnboardingFlowState["drafts"];
  requestOrigin: OnboardingFlowState["requestOrigin"];
  context: CustomerContext;
  certificationInquiryDraftIds: readonly string[];
};

export function buildOnboardingStepperSteps(
  input: BuildOnboardingStepperStepsInput,
): StepLayoutStep[] {
  const { drafts, requestOrigin, context, certificationInquiryDraftIds } = input;
  const hasDrafts = drafts.length > 0;
  const {
    registrationStepOk,
    companyCoreOk,
    invoicingStepOk,
    summaryStepOk,
  } = deriveOnboardingPhaseValidityForFlow(requestOrigin, context, certificationInquiryDraftIds);
  const companyStepOk = companyCoreOk;
  const extrasAvailabilityDepsOk = registrationStepOk && companyCoreOk && invoicingStepOk;

  return [
    {
      id: "origin",
      title: "Land of regio",
      description:
        requestOrigin === ""
          ? "Waar is uw bedrijf?"
          : ({
              be: "België",
              nl: "Nederland",
              eu: "Europa (EU)",
              us: "Verenigde Staten",
              other: "Anders",
            }[requestOrigin] ?? ""),
      available: hasDrafts,
    },
    {
      id: "customer",
      title: "Registratie",
      description: formatRequesterStepperLabel(context),
      available: hasDrafts && requestOrigin !== "",
    },
    {
      id: "company",
      title: "Bedrijfsgegevens",
      description:
        context.organizationName.trim() ||
        (context.headOfficeIsCertificationLegalEntity === "no"
          ? "Maatschappelijke zetel · vestigingen"
          : "Maatschappelijke zetel"),
      available: hasDrafts && requestOrigin !== "" && registrationStepOk,
    },
    {
      id: "invoicing",
      title: "Facturatie",
      description:
        context.invoicingEmail.trim() ||
        (context.invoicingDiffersFromHeadOffice ? "Vestiging voor facturatie" : "Zetel als facturatie"),
      available: hasDrafts && requestOrigin !== "" && registrationStepOk && companyStepOk,
    },
    {
      id: "extras",
      title: "Extra contacten",
      description: "Certificatie- en reservecontact (optioneel)",
      available: hasDrafts && requestOrigin !== "" && extrasAvailabilityDepsOk,
    },
    {
      id: "summary",
      title: "Nazicht",
      description: "Gegevens en aanvragen nakijken",
      available: hasDrafts && requestOrigin !== "" && registrationStepOk && summaryStepOk,
    },
  ];
}
