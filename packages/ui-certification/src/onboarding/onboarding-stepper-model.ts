import type { StepLayoutStep } from "@procertus-ui/ui";

import type {
  InnovationAttestInquiryState,
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
import { isInnovationAttestInquiryResumeOk } from "./onboarding-innovation-attest";
import {
  registrationDraftsIncludeInnovationAttest,
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
  summaryStepOk: boolean;
};

export type DeriveOnboardingPhaseValidityInput = {
  requestOrigin: OnboardingFlowState["requestOrigin"];
  context: CustomerContext;
  drafts: OnboardingFlowState["drafts"];
  certificationInquiryDraftIds: readonly string[];
  innovationAttestInquiry: InnovationAttestInquiryState;
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
  const { requestOrigin, context, drafts, certificationInquiryDraftIds, innovationAttestInquiry } =
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

  const needsInnovationAttest = registrationDraftsIncludeInnovationAttest(
    drafts,
    certificationInquiryDraftIds,
  );
  const innovationAttestOk = isInnovationAttestInquiryResumeOk(
    innovationAttestInquiry,
    needsInnovationAttest,
  );

  const summaryStepOk =
    companyCoreOk && invoicingStepOk && optionalContactsOk && innovationAttestOk;

  return {
    hasCustomerContext,
    registrationStepOk,
    companyZetelOk,
    companyLegalEntitiesOk,
    companyCoreOk,
    invoicingStepOk,
    optionalContactsOk,
    innovationAttestOk,
    summaryStepOk,
  };
}

export type BuildOnboardingStepperStepsInput = {
  drafts: OnboardingFlowState["drafts"];
  requestOrigin: OnboardingFlowState["requestOrigin"];
  context: CustomerContext;
  certificationInquiryDraftIds: readonly string[];
  innovationAttestInquiry: InnovationAttestInquiryState;
};

export function buildOnboardingStepperSteps(
  input: BuildOnboardingStepperStepsInput,
): StepLayoutStep[] {
  const { drafts, requestOrigin, context, certificationInquiryDraftIds, innovationAttestInquiry } =
    input;

  const hasDrafts = drafts.length > 0;
  const legalRepChoiceOk = isApplicantLegalRepresentativeChoiceComplete(context);
  const needsInnovationAttest = registrationDraftsIncludeInnovationAttest(
    drafts,
    certificationInquiryDraftIds,
  );

  const {
    registrationStepOk,
    companyZetelOk,
    companyCoreOk,
    invoicingStepOk,
    summaryStepOk,
    innovationAttestOk,
  } = deriveOnboardingPhaseValidityForFlow({
    requestOrigin,
    context,
    drafts,
    certificationInquiryDraftIds,
    innovationAttestInquiry,
  });

  const companyStepOk = companyCoreOk;
  const extrasAvailabilityDepsOk =
    legalRepChoiceOk &&
    registrationStepOk &&
    companyCoreOk &&
    invoicingStepOk &&
    innovationAttestOk;

  const seq = registrationStepsSequence(drafts, certificationInquiryDraftIds);

  const innovationStepAvailable =
    hasDrafts &&
    requestOrigin !== "" &&
    legalRepChoiceOk &&
    registrationStepOk &&
    companyZetelOk &&
    needsInnovationAttest;

  const needsProductBoundCertification = registrationDraftsIncludeProductBoundCertification(
    drafts,
    certificationInquiryDraftIds,
  );

  const legalEntitiesAvailable =
    hasDrafts &&
    requestOrigin !== "" &&
    legalRepChoiceOk &&
    registrationStepOk &&
    companyZetelOk &&
    needsProductBoundCertification &&
    (!needsInnovationAttest || innovationAttestInquiry.stepCompleted);

  const stepLayouts: Record<OnboardingStep, StepLayoutStep> = {
    origin: {
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
    customer: {
      id: "customer",
      title: "Registratie",
      description: formatRequesterStepperLabel(context),
      available: hasDrafts && requestOrigin !== "",
    },
    company: {
      id: "company",
      title: "Maatschappelijke zetel",
      description:
        context.organizationName.trim() || "Officiële gegevens van de hoofdrechtspersoon",
      available: hasDrafts && requestOrigin !== "" && legalRepChoiceOk && registrationStepOk,
    },
    innovationAttest: {
      id: "innovationAttest",
      title: "Innovatie-attest",
      description: "Innovatief product en project",
      available: innovationStepAvailable,
    },
    companyLegalEntities: {
      id: "companyLegalEntities",
      title: "Certificatie (entiteit)",
      description:
        context.headOfficeIsCertificationLegalEntity === ""
          ? "Zetel of vestigingen per product"
          : context.headOfficeIsCertificationLegalEntity === "yes"
            ? "Zetel voor alle productgebonden aanvragen in dit dossier"
            : "Vestiging per geselecteerd product",
      available: legalEntitiesAvailable,
    },
    invoicing: {
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
    extras: {
      id: "extras",
      title: "Extra contacten",
      description: "Certificatie- en reservecontact (optioneel)",
      available: hasDrafts && requestOrigin !== "" && extrasAvailabilityDepsOk,
    },
    summary: {
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
  };

  return seq.map((id) => stepLayouts[id]);
}
