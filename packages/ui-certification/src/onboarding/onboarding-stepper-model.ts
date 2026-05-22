import type { StepLayoutStep } from "@procertus-ui/ui";

import type {
  InnovationAttestInquiryState,
  MetrologyInquiryState,
  OnboardingFlowState,
  CustomerContext,
  OnboardingStep,
} from "./onboarding-types";
import {
  isApplicantLegalRepresentativeChoiceComplete,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyCoreStepValid,
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
  registrationDraftsIncludeProductBoundCertification,
  registrationStepsSequence,
} from "./onboarding-registration-steps";
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
  /** Innovatie‑attest blok afgerond (of niet van toepassing). */
  innovationAttestOk: boolean;
  /** Metrologie-intake afgerond (of niet van toepassing). */
  metrologyAttestOk: boolean;
  summaryStepOk: boolean;
};

export type DeriveOnboardingPhaseValidityInput = {
  requestOrigin: OnboardingFlowState["requestOrigin"];
  context: CustomerContext;
  drafts: OnboardingFlowState["drafts"];
  certificationInquiryDraftIds: readonly string[];
  innovationAttestInquiry: InnovationAttestInquiryState;
  metrologyInquiry: MetrologyInquiryState;
};

/** Legal representative (+ registrant when “Nee”), VAT plausible or valid-for-origin — not affected by prototype relax. */
export function isOnboardingRegistrationBodyCompleteForFlow(
  requestOrigin: OnboardingFlowState["requestOrigin"],
  context: CustomerContext,
): boolean {
  return (
    isRegistrantCaptureValidForContext(context) &&
    isLegalRepresentativeCaptureComplete(context) &&
    (requestOrigin
      ? isRegistrationIdentifierValidForOrigin(context.vatNumber ?? "", requestOrigin)
      : isVatIdentifierPlausible(context.vatNumber ?? ""))
  );
}

/** @param requestOrigin Flow `requestOrigin`; `""` treated as unset. */
export function deriveOnboardingPhaseValidityForFlow(
  input: DeriveOnboardingPhaseValidityInput,
): OnboardingPhaseValidity & { hasCustomerContext: boolean } {
  const { requestOrigin, context, drafts, certificationInquiryDraftIds, innovationAttestInquiry, metrologyInquiry } =
    input;

  const legalRepChoiceOk = isApplicantLegalRepresentativeChoiceComplete(context);
  const registrationBodyComplete = isOnboardingRegistrationBodyCompleteForFlow(
    requestOrigin,
    context,
  );
  const hasCustomerContext = legalRepChoiceOk && registrationBodyComplete;
  /** Same as primary "Verder" on registratie — prototype relax does not skip person/VAT completeness. */
  const registrationStepOk = legalRepChoiceOk && registrationBodyComplete;
  const companyZetelOk =
    isOnboardingCompanyZetelStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  /** Strict: alle aanvragen moeten gekoppeld zijn voor verder naar facturatie. */
  const companyLegalEntitiesOk = isOnboardingCompanyLegalEntitiesStepValid(
    context,
    certificationInquiryDraftIds,
    drafts,
  );
  const companyCoreOk = isOnboardingCompanyCoreStepValid(context, certificationInquiryDraftIds, drafts);
  const invoicingStepOk = isOnboardingInvoicingStepValid(context, certificationInquiryDraftIds, drafts);
  /** Strict: gelijk aan {@link deriveFormalOnboardingResumeStep} — geen prototype‑relax. */
  const optionalContactsOk = isOnboardingOptionalContactsStepValid(context);

  const needsInnovationAttest = registrationDraftsIncludeInnovationAttest(drafts);
  const innovationAttestOk = isInnovationAttestInquiryResumeOk(
    innovationAttestInquiry,
    needsInnovationAttest,
  );

  const needsMetrologyAttest = registrationDraftsIncludeMetrology(drafts);
  const metrologyAttestOk = isMetrologyInquiryResumeOk(metrologyInquiry, needsMetrologyAttest);

  const summaryStepOk =
    companyCoreOk &&
    invoicingStepOk &&
    optionalContactsOk &&
    innovationAttestOk &&
    metrologyAttestOk;

  return {
    hasCustomerContext,
    registrationStepOk,
    companyZetelOk,
    companyLegalEntitiesOk,
    companyCoreOk,
    invoicingStepOk,
    optionalContactsOk,
    innovationAttestOk,
    metrologyAttestOk,
    summaryStepOk,
  };
}

export type BuildOnboardingStepperStepsInput = {
  drafts: OnboardingFlowState["drafts"];
  requestOrigin: OnboardingFlowState["requestOrigin"];
  context: CustomerContext;
  certificationInquiryDraftIds: readonly string[];
  innovationAttestInquiry: InnovationAttestInquiryState;
  metrologyInquiry: MetrologyInquiryState;
};

export function buildOnboardingStepperSteps(
  input: BuildOnboardingStepperStepsInput,
): StepLayoutStep[] {
  const { drafts, requestOrigin, context, certificationInquiryDraftIds, innovationAttestInquiry, metrologyInquiry } =
    input;

  const hasDrafts = drafts.length > 0;
  const legalRepChoiceOk = isApplicantLegalRepresentativeChoiceComplete(context);
  const needsInnovationAttest = registrationDraftsIncludeInnovationAttest(drafts);
  const needsMetrologyAttest = registrationDraftsIncludeMetrology(drafts);

  const {
    registrationStepOk,
    companyZetelOk,
    companyLegalEntitiesOk,
    companyCoreOk,
    invoicingStepOk,
    optionalContactsOk,
    summaryStepOk,
    innovationAttestOk,
    metrologyAttestOk,
  } = deriveOnboardingPhaseValidityForFlow({
    requestOrigin,
    context,
    drafts,
    certificationInquiryDraftIds,
    innovationAttestInquiry,
    metrologyInquiry,
  });

  const companyStepOk = companyCoreOk;
  const extrasAvailabilityDepsOk =
    legalRepChoiceOk &&
    registrationStepOk &&
    companyCoreOk &&
    invoicingStepOk &&
    innovationAttestOk &&
    metrologyAttestOk;

  const seq = registrationStepsSequence(drafts);

  const innovationStepAvailable =
    hasDrafts &&
    requestOrigin !== "" &&
    legalRepChoiceOk &&
    registrationStepOk &&
    companyZetelOk &&
    needsInnovationAttest;

  const metrologyStepAvailable =
    hasDrafts &&
    requestOrigin !== "" &&
    legalRepChoiceOk &&
    registrationStepOk &&
    companyZetelOk &&
    needsMetrologyAttest &&
    (!needsInnovationAttest || innovationAttestInquiry.stepCompleted);

  const needsProductBoundCertification = registrationDraftsIncludeProductBoundCertification(drafts);

  const legalEntitiesAvailable =
    hasDrafts &&
    requestOrigin !== "" &&
    legalRepChoiceOk &&
    registrationStepOk &&
    companyZetelOk &&
    needsProductBoundCertification &&
    (!needsInnovationAttest || innovationAttestInquiry.stepCompleted) &&
    (!needsMetrologyAttest || metrologyInquiry.stepCompleted);

  const stepLayouts: Record<OnboardingStep, StepLayoutStep> = {
    origin: {
      id: "origin",
      title: "Land of regio",
      description: "Kies waar uw bedrijf gevestigd is.",
      available: hasDrafts,
      completed: requestOrigin !== "",
    },
    customer: {
      id: "customer",
      title: "Registratie",
      description: "Vul uw aanspreekpunt en juridische vertegenwoordiging in.",
      available: hasDrafts && requestOrigin !== "",
      completed: registrationStepOk,
    },
    company: {
      id: "company",
      title: "Maatschappelijke zetel",
      description: "Bevestig de officiële gegevens van uw hoofdrechtspersoon.",
      available: hasDrafts && requestOrigin !== "" && legalRepChoiceOk && registrationStepOk,
      completed: companyZetelOk,
    },
    innovationAttest: {
      id: "innovationAttest",
      title: "Innovatie-attest",
      description: "Bezorg ons de context voor uw innovatie-attest.",
      available: innovationStepAvailable,
      completed: innovationAttestOk,
    },
    metrologyAttest: {
      id: "metrologyAttest",
      title: "Metrologie",
      description: "Geef uw meetuitrusting en tussenkomsten door.",
      available: metrologyStepAvailable,
      completed: metrologyAttestOk,
    },
    companyLegalEntities: {
      id: "companyLegalEntities",
      title: "Certificatie (entiteit)",
      description: "Koppel de juiste rechtspersoon aan elke productaanvraag.",
      available: legalEntitiesAvailable,
      completed: companyLegalEntitiesOk,
    },
    invoicing: {
      id: "invoicing",
      title: "Facturatie",
      description: "Geef door waar de facturen heen moeten.",
      available:
        hasDrafts &&
        requestOrigin !== "" &&
        legalRepChoiceOk &&
        registrationStepOk &&
        companyStepOk,
      completed: invoicingStepOk,
    },
    extras: {
      id: "extras",
      title: "Extra contacten",
      description: "Voeg eventueel extra contactpersonen toe.",
      available: hasDrafts && requestOrigin !== "" && extrasAvailabilityDepsOk,
      completed: optionalContactsOk,
    },
    summary: {
      id: "summary",
      title: "Nazicht",
      description: "Controleer alle gegevens voor u indient.",
      available:
        hasDrafts &&
        requestOrigin !== "" &&
        legalRepChoiceOk &&
        registrationStepOk &&
        summaryStepOk,
      completed: summaryStepOk,
    },
  };

  return seq.map((id) => stepLayouts[id]);
}
