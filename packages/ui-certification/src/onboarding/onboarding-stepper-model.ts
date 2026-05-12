import type { StepLayoutStep } from "@procertus-ui/ui";

import type {
  OnboardingFlowState,
  CustomerContext,
  OnboardingStep,
} from "./onboarding-types";
import {
  formatRequesterStepperLabel,
  isApplicantLegalRepresentativeChoiceComplete,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyCoreStepValid,
  isOnboardingCompanyLegalEntitiesStepValid,
  isOnboardingCompanyZetelStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
  isRegistrantCaptureValidForContext,
} from "./onboarding-flow-helpers";
import { isRegistrationIdentifierValidForOrigin } from "./lib/registration-identifier-for-origin";
import { isVatIdentifierPlausible } from "./lib/vatPrototypePresets";
import { ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION } from "./onboarding-constants";

export type OnboardingPhaseValidity = {
  registrationStepOk: boolean;
  /** Maatschappelijke zetel (naam + adres). */
  companyZetelOk: boolean;
  /** Juridisch aanspreekpunt / vestigingen per aanvraag. */
  companyLegalEntitiesOk: boolean;
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
  const legalRepChoiceOk = isApplicantLegalRepresentativeChoiceComplete(context);
  const registrationBodyComplete =
    isRegistrantCaptureValidForContext(context) &&
    isLegalRepresentativeCaptureComplete(context) &&
    (requestOrigin
      ? isRegistrationIdentifierValidForOrigin(context.vatNumber ?? "", requestOrigin)
      : isVatIdentifierPlausible(context.vatNumber ?? ""));
  const hasCustomerContext = legalRepChoiceOk && registrationBodyComplete;
  const registrationStepOk =
    legalRepChoiceOk &&
    (registrationBodyComplete || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION);
  const companyZetelOk =
    isOnboardingCompanyZetelStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  /** Strict: alle aanvragen moeten gekoppeld zijn voor verder naar facturatie. */
  const companyLegalEntitiesOk = isOnboardingCompanyLegalEntitiesStepValid(
    context,
    certificationInquiryDraftIds,
  );
  const companyCoreOk = isOnboardingCompanyCoreStepValid(context, certificationInquiryDraftIds);
  const invoicingStepOk =
    isOnboardingInvoicingStepValid(context, certificationInquiryDraftIds) ||
    ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const optionalContactsOk =
    isOnboardingOptionalContactsStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const summaryStepOk = companyCoreOk && invoicingStepOk && optionalContactsOk;
  return {
    hasCustomerContext,
    registrationStepOk,
    companyZetelOk,
    companyLegalEntitiesOk,
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
  const legalRepChoiceOk = isApplicantLegalRepresentativeChoiceComplete(context);
  const {
    registrationStepOk,
    companyZetelOk,
    companyCoreOk,
    invoicingStepOk,
    summaryStepOk,
  } = deriveOnboardingPhaseValidityForFlow(requestOrigin, context, certificationInquiryDraftIds);
  const companyStepOk = companyCoreOk;
  const extrasAvailabilityDepsOk =
    legalRepChoiceOk && registrationStepOk && companyCoreOk && invoicingStepOk;

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
      title: "Maatschappelijke zetel",
      description:
        context.organizationName.trim() ||
        "Officiële gegevens van de hoofdrechtspersoon",
      available:
        hasDrafts && requestOrigin !== "" && legalRepChoiceOk && registrationStepOk,
    },
    {
      id: "companyLegalEntities",
      title: "Certificatie (entiteit)",
      description:
        context.headOfficeIsCertificationLegalEntity === ""
          ? "Zetel of vestigingen per aanvraag"
          : context.headOfficeIsCertificationLegalEntity === "yes"
            ? "Zetel voor alle aanvragen in dit dossier"
            : "Vestiging per aanvraag",
      available:
        hasDrafts &&
        requestOrigin !== "" &&
        legalRepChoiceOk &&
        registrationStepOk &&
        companyZetelOk,
    },
    {
      id: "invoicing",
      title: "Facturatie",
      description:
        context.invoicingEmail.trim() ||
        (context.invoicingMirrorCertificationLegalEntities
          ? "Zelfde rechts‑persoon als bij certificatie"
          : "Factuur‑rechtspersoon per aanvraag"),
      available:
        hasDrafts &&
        requestOrigin !== "" &&
        legalRepChoiceOk &&
        registrationStepOk &&
        companyStepOk,
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
      available:
        hasDrafts &&
        requestOrigin !== "" &&
        legalRepChoiceOk &&
        registrationStepOk &&
        summaryStepOk,
    },
  ];
}
