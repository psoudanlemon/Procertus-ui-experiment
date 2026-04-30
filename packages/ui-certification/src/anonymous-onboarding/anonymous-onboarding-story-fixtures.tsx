import type { OnboardingStepperStep } from "@procertus-ui/ui-lib";
import type { SetStateAction } from "react";

import { storyDrafts } from "../components/certification-request-wizard/certification-request-wizard-story-fixtures";
import type { CertificationRequestDraft } from "../CertificationRequestContext";
import type { CertificationRequestWizardProps } from "../components/certification-request-wizard/CertificationRequestWizard";
import type { AnonymousOnboardingFlowViewProps } from "./anonymous-onboarding-flow-view-props";
import { COUNTRY_SELECT_NONE } from "./anonymous-onboarding-constants";
import {
  buildRows,
  DEFAULT_CONTEXT,
  formatRequesterStepperLabel,
  hasStructuredPostalAddress,
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
    organizationName: "Voorbeeld BV",
    country: "België",
    addressStreet: "Kerkstraat",
    addressHouseNumber: "12",
    addressPostalCode: "9000",
    addressCity: "Gent",
    ...overrides,
  });
}

function hasCustomerContext(ctx: CustomerContext): boolean {
  return (
    (ctx.representativeFirstName?.trim() ?? "").length > 0 &&
    (ctx.representativeLastName?.trim() ?? "").length > 0 &&
    (ctx.representativeEmail?.trim() ?? "").length > 0 &&
    (ctx.representativeRole?.trim() ?? "").length > 0 &&
    isVatIdentifierPlausible(ctx.vatNumber ?? "")
  );
}

function hasCompanyContext(ctx: CustomerContext): boolean {
  return (
    (ctx.organizationName?.trim() ?? "").length > 0 &&
    (ctx.country?.trim() ?? "").length > 0 &&
    hasStructuredPostalAddress(ctx)
  );
}

/** Mirrors step labels from `useAnonymousOnboardingFlow` for static Storybook fixtures. */
export function storyOnboardingStepperSteps(input: {
  step: OnboardingStep;
  context: CustomerContext;
  drafts: CertificationRequestDraft[];
}): OnboardingStepperStep[] {
  const { step, context, drafts } = input;
  const hasDrafts = drafts.length > 0;
  const hasCust = hasCustomerContext(context);
  const hasComp = hasCompanyContext(context);
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
      id: "customer",
      title: "Registratie",
      description: formatRequesterStepperLabel(context),
      available: hasDrafts,
    },
    {
      id: "company",
      title: "Bedrijfsgegevens",
      description: context.organizationName || "Uit BTW-nummer",
      available: hasDrafts && hasCust,
    },
    {
      id: "summary",
      title: "Versturen",
      description: "Annvraag controleren",
      available: hasDrafts && hasCust && hasComp,
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

  const countryTrim = context.country?.trim() ?? "";
  const countryOptions = ["België", "Nederland", "Duitsland"];
  const countrySelectValue =
    countryTrim && countryOptions.includes(countryTrim) ? countryTrim : COUNTRY_SELECT_NONE;

  const base: AnonymousOnboardingFlowViewProps = {
    step,
    certificationPhaseTitle: "Start je certificatieaanvraag",
    certificationPhaseDescription:
      "Kies eerst wat je wilt aanvragen. We vragen pas organisatie- en accountgegevens wanneer je een conceptaanvraag hebt samengesteld.",
    registrationPhaseTitle: "Registratie",
    registrationPhaseDescription:
      "Vertegenwoordiger, e-mail en ondernemingsnummer. Land leiden we af uit uw gevalideerde nummer.",
    onSignInClick: noop,
    certificationWizardProps: storyCertificationWizardProps(context),
    registrationSubmitOpen: false,
    onRegistrationSubmitOpenChange: noop,
    registrationProgress: 0,
    registrationStepIndex: -1,
    registrationSimulationLabels: defaultRegistrationSimulation,
    context,
    updateContext: noop as AnonymousOnboardingFlowViewProps["updateContext"],
    setFlowState: noopSetFlowState,
    drafts,
    effectiveSummaryIncludedDraftIds: includedIds,
    rows: buildRows(context, drafts, includedIds),
    steps: storyOnboardingStepperSteps({ step, context, drafts }),
    activeStep: stepIndex(step),
    goToOnboardingStep: noop as AnonymousOnboardingFlowViewProps["goToOnboardingStep"],
    primaryAction: { label: "Versturen", onClick: noop, disabled: false },
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
    countrySelectOptions: countryOptions,
    countrySelectValue,
    companyHints: {},
  };

  return { ...base, ...overrides };
}
