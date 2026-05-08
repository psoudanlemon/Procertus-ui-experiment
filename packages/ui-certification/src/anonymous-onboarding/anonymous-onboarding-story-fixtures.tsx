import type { OnboardingStepperStep } from "@procertus-ui/ui-lib";
import type { SetStateAction } from "react";

import { storyDrafts } from "../components/certification-request-wizard/certification-request-wizard-story-fixtures";
import type { CertificationRequestDraft } from "../CertificationRequestContext";
import type { CertificationRequestWizardProps } from "../components/certification-request-wizard/CertificationRequestWizard";
import type { AnonymousOnboardingFlowViewProps } from "./anonymous-onboarding-flow-view-props";
import {
  COUNTRY_SELECT_NONE,
  ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION,
} from "./anonymous-onboarding-constants";
import {
  buildRows,
  DEFAULT_CONTEXT,
  formatRequesterStepperLabel,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyCoreStepValid,
  isOnboardingCompanyStepValid,
  isOnboardingInvoicingStepValid,
  isRegistrantCaptureValidForContext,
  onboardingReviewRequesterFromContext,
  resolveFlowContext,
  stepIndex,
} from "./anonymous-onboarding-flow-helpers";
import type {
  AnonymousOnboardingFlowState,
  CustomerContext,
  OnboardingStep,
} from "./anonymous-onboarding-types";
import { registrationSimulationStepLabels } from "./lib/registrationSubmitSimulation";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  findVatPrototypePreset,
  isVatIdentifierPlausible,
  vatLookupSimulationStepsForPreset,
  VAT_PROTOTYPE_PRESETS,
  type CompanyFormFieldKey,
} from "./lib/vatPrototypePresets";
import { isRegistrationIdentifierValidForOrigin } from "./lib/registration-identifier-for-origin";
import {
  registrationCountryOptionsForRequestOrigin,
  vatPrototypePresetIdsForOrigin,
  type OnboardingRequestOrigin,
} from "./onboarding-request-origin";

export function noop(): void {}

export const storyOnboardingDrafts: CertificationRequestDraft[] = storyDrafts.map(
  ({ title: _title, subtitle: _subtitle, ...draft }) => draft,
);

export function storyCustomerContext(overrides: Partial<CustomerContext> = {}): CustomerContext {
  return resolveFlowContext({
    ...DEFAULT_CONTEXT,
    representativeFirstName: "Alex",
    representativeLastName: "Voorbeeld",
    representativeEmail: "alex@voorbeeld.nl",
    representativeRole: "Zaakvoerder",
    representativeRolePreset: "managing_director",
    applicantIsLegalRepresentative: "yes",
    headOfficeIsCertificationLegalEntity: "yes",
    organizationName: "Voorbeeld BV",
    country: "België",
    addressStreet: "Kerkstraat",
    addressHouseNumber: "12",
    addressPostalCode: "9000",
    addressCity: "Gent",
    invoicingEmail: "facturatie@voorbeeld.nl",
    ...overrides,
  });
}

function hasCustomerContext(
  ctx: CustomerContext,
  requestOrigin: OnboardingRequestOrigin | "",
): boolean {
  return (
    (ctx.applicantIsLegalRepresentative === "yes" || ctx.applicantIsLegalRepresentative === "no") &&
    isRegistrantCaptureValidForContext(ctx) &&
    isLegalRepresentativeCaptureComplete(ctx) &&
    (requestOrigin
      ? isRegistrationIdentifierValidForOrigin(ctx.vatNumber ?? "", requestOrigin)
      : isVatIdentifierPlausible(ctx.vatNumber ?? ""))
  );
}

function hasInvoicingContext(ctx: CustomerContext): boolean {
  return isOnboardingInvoicingStepValid(ctx);
}

function hasCompanyContext(ctx: CustomerContext, drafts: CertificationRequestDraft[]): boolean {
  return isOnboardingCompanyStepValid(
    ctx,
    drafts.map((d) => d.id),
  );
}

function hasCompanyCoreContext(ctx: CustomerContext, drafts: CertificationRequestDraft[]): boolean {
  return isOnboardingCompanyCoreStepValid(ctx, drafts.map((d) => d.id));
}

/** Default origin for Storybook fixtures (Belgium). */
export const storyRequestOrigin: OnboardingRequestOrigin = "be";

/** Mirrors step labels from `useAnonymousOnboardingFlow` for static Storybook fixtures. */
export function storyOnboardingStepperSteps(input: {
  step: OnboardingStep;
  context: CustomerContext;
  drafts: CertificationRequestDraft[];
  requestOrigin?: OnboardingRequestOrigin | "";
}): OnboardingStepperStep[] {
  const { step, context, drafts } = input;
  const requestOrigin = input.requestOrigin ?? "";
  const hasDrafts = drafts.length > 0;
  const hasCust = hasCustomerContext(context, requestOrigin);
  const hasInv = hasInvoicingContext(context);
  const hasComp = hasCompanyContext(context, drafts);
  const hasCore = hasCompanyCoreContext(context, drafts);
  const registrationStepOk = hasCust || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const companyStepOk = hasComp || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const companyCoreOk = hasCore || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const invoicingStepOk = hasInv || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  return [
    {
      id: "request",
      title: "Aanvraag",
      description:
        step !== "request" && drafts.length > 0
          ? `${drafts.length} concept${drafts.length === 1 ? "" : "en"} vastgelegd`
          : drafts.length > 0
            ? `${drafts.length} concepten`
            : "Start zonder account",
      available: true,
    },
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
      available:
        hasDrafts && requestOrigin !== "" && registrationStepOk && companyCoreOk,
    },
    {
      id: "extras",
      title: "Extra contacten",
      description: "Certificatie- en reservecontact (optioneel)",
      available:
        hasDrafts &&
        requestOrigin !== "" &&
        registrationStepOk &&
        companyCoreOk &&
        invoicingStepOk,
    },
    {
      id: "summary",
      title: "Nazicht",
      description: "Gegevens en aanvragen nakijken",
      available: hasDrafts && requestOrigin !== "" && registrationStepOk && companyStepOk,
    },
  ];
}

export function storyCertificationWizardProps(
  context: CustomerContext,
): CertificationRequestWizardProps {
  return {
    mode: "onboarding",
    initialDrafts: [],
    initialStep: "intent",
    backendKind: "memory",
    sessionId: "storybook-anonymous-onboarding",
    onCancel: noop,
    onComplete: noop,
    reviewRequester: onboardingReviewRequesterFromContext(context),
  };
}

const defaultRegistrationSimulation = registrationSimulationStepLabels(2);

export const storyEmptyCompanyFieldKeySet = new Set<CompanyFormFieldKey>();

const prefilledDemoKeys = new Set<CompanyFormFieldKey>([
  "organizationName",
  "country",
  "addressStreet",
]);

const resolvedDemoKeys = new Set<CompanyFormFieldKey>(["organizationName", "country"]);

function noopSetFlowState(_update: SetStateAction<AnonymousOnboardingFlowState>): void {
  void _update;
}

/**
 * Baseline presentational props for {@link AnonymousOnboardingFlowView}. Override slices per story.
 * Uses no-op `setFlowState` unless you wrap the story in local state (recommended for interactive steps).
 */
export function baseAnonymousOnboardingFlowViewProps(
  overrides: Partial<AnonymousOnboardingFlowViewProps> = {},
): AnonymousOnboardingFlowViewProps {
  const context = storyCustomerContext();
  const drafts = storyOnboardingDrafts;
  const includedIds = drafts.map((d) => d.id);
  const activePreset =
    findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
  const step: OnboardingStep = "summary";
  const requestOrigin = storyRequestOrigin;

  const countryTrim = context.country?.trim() ?? "";
  const countryOptions = [
    ...registrationCountryOptionsForRequestOrigin(requestOrigin, context.country),
  ];
  const countrySelectValue =
    countryTrim && countryOptions.includes(countryTrim) ? countryTrim : COUNTRY_SELECT_NONE;

  const vatPrototypePresetChoices = VAT_PROTOTYPE_PRESETS.filter((p) =>
    vatPrototypePresetIdsForOrigin(requestOrigin).includes(p.id),
  );

  const base: AnonymousOnboardingFlowViewProps = {
    step,
    certificationPhaseTitle: "Start je certificatieaanvraag",
    certificationPhaseDescription:
      "Kies eerst wat je wilt aanvragen. We vragen pas organisatie- en accountgegevens wanneer je een conceptaanvraag hebt samengesteld.",
    registrationPhaseTitle: "Registratie",
    registrationPhaseDescription:
      "Na een korte keuze voor land of regio vullen we de volgende stappen daarop aan: uw contactpersoon, ondernemingsnummer en bedrijfsadres.",
    onSignInClick: noop,
    certificationWizardProps: storyCertificationWizardProps(context),
    registrationSubmitOpen: false,
    onRegistrationSubmitOpenChange: noop,
    registrationProgress: 0,
    registrationStepIndex: -1,
    registrationSimulationLabels: defaultRegistrationSimulation,
    context,
    updateContext: noop as AnonymousOnboardingFlowViewProps["updateContext"],
    patchContext: noop as AnonymousOnboardingFlowViewProps["patchContext"],
    setFlowState: noopSetFlowState,
    drafts,
    effectiveSummaryIncludedDraftIds: includedIds,
    rows: buildRows(context, drafts, includedIds, { includeDraftRows: false }),
    steps: storyOnboardingStepperSteps({ step, context, drafts, requestOrigin }),
    activeStep: stepIndex(step),
    goToOnboardingStep: noop as AnonymousOnboardingFlowViewProps["goToOnboardingStep"],
    primaryAction: { label: "Indienen", onClick: noop, disabled: false },
    backAction: {
      label: "Terug",
      onClick: noop,
    },
    cancelAction: {
      label: "Annuleren",
      onClick: noop,
    },
    companyLookupPhase: "ready",
    lookupProgress: 100,
    lookupStepIndex: 4,
    vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
    companyPrefillFieldKeys: prefilledDemoKeys,
    companyFieldsResolvedInSimulation: resolvedDemoKeys,
    vatNumberForDisplay: context.vatNumber.trim(),
    emailForDisplay: context.representativeEmail.trim(),
    activeVatPreset: activePreset,
    prototypeVatPresetId: activePreset.id,
    vatPrototypePresetChoices,
    requestOrigin,
    setRequestOrigin: noop as AnonymousOnboardingFlowViewProps["setRequestOrigin"],
    countrySelectOptions: countryOptions,
    countrySelectValue,
    companyHints: {},
    summaryKlantenportaalByPersonId: {},
  };

  return { ...base, ...overrides };
}
