import type { StepLayoutStep } from "@procertus-ui/ui";
import type { SetStateAction } from "react";
import { useCallback, useRef, useState } from "react";

import type { CertificationRequestDraft } from "../CertificationRequestContext";
import type { OnboardingFlowViewProps } from "./onboarding-flow-view-props";
import {
  COUNTRY_SELECT_NONE,
} from "./onboarding-constants";
import {
  buildRows,
  DEFAULT_CONTEXT,
  effectiveIncludedCertificationDraftIds,
  resolveFlowContext,
} from "./onboarding-flow-helpers";
import {
  createEmptyInnovationAttestCapture,
  createEmptyInnovationAttestInquiry,
} from "./onboarding-innovation-attest";
import { createEmptyMetrologyInquiry, normalizeMetrologyInquiry } from "./onboarding-metrology";
import { buildOnboardingStepperSteps } from "./onboarding-stepper-model";
import type {
  OnboardingFlowState,
  CustomerContext,
  OnboardingStep,
} from "./onboarding-types";
import {
  registrationStepIndex,
  registrationStepsSequence,
} from "./onboarding-registration-steps";
import { registrationSimulationStepLabels } from "./lib/registrationSubmitSimulation";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  findVatPrototypePreset,
  vatLookupSimulationStepsForPreset,
  VAT_PROTOTYPE_PRESETS,
  type CompanyFormFieldKey,
} from "./lib/vatPrototypePresets";
import {
  registrationCountryOptionsForRequestOrigin,
  vatPrototypePresetIdsForOrigin,
  type OnboardingRequestOrigin,
} from "./onboarding-request-origin";
import { hydrateOnboardingFlowStateFromStored } from "./onboarding-default-flow-state";
import { OnboardingFlowProvider } from "./onboarding-flow-provider";
import { OnboardingFlowView } from "./onboarding-flow-view";
import { createMemoryOnboardingFlowPersistence } from "./persistence";
import { useOnboardingFlow } from "./use-onboarding-flow";
import { useOnboardingCompanyLookupPrototypeEffects } from "./use-onboarding-company-lookup-prototype-effects";

export function noop(): void {}

export const storyOnboardingDrafts: CertificationRequestDraft[] = [
  {
    id: "draft-1",
    entryId: "product-certification",
    label: "BENOR, Rainscreen (fixture)",
    shortLabel: "BENOR",
    productId: "p-rain",
    productLabel: "Rainscreen (fixture)",
    productPath: "Cladding / Facade / Rainscreen",
    productTypeStreamLabel: "BENOR",
  },
  {
    id: "draft-2",
    entryId: "atg",
    label: "ATG technische goedkeuring",
    shortLabel: "ATG",
    productId: "p-siding",
    productLabel: "Siding product (fixture)",
    productPath: "Cladding / Siding",
  },
];

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

/** Default origin for Storybook fixtures (Belgium). */
export const storyRequestOrigin: OnboardingRequestOrigin = "be";

/** Mirrors step labels from `useOnboardingFlow` for static Storybook fixtures. */
export function storyOnboardingStepperSteps(input: {
  step: OnboardingStep;
  context: CustomerContext;
  drafts: CertificationRequestDraft[];
  requestOrigin?: OnboardingRequestOrigin | "";
  innovationAttestStepCompleted?: boolean;
  metrologyAttestStepCompleted?: boolean;
}): StepLayoutStep[] {
  const ids = effectiveIncludedCertificationDraftIds(input.drafts, undefined);
  return buildOnboardingStepperSteps({
    drafts: input.drafts,
    requestOrigin: input.requestOrigin ?? "",
    context: input.context,
    certificationInquiryDraftIds: ids,
    innovationAttestInquiry: {
      capture: createEmptyInnovationAttestCapture(),
      stepCompleted: input.innovationAttestStepCompleted ?? false,
    },
    metrologyInquiry: normalizeMetrologyInquiry({
      stepCompleted: input.metrologyAttestStepCompleted ?? false,
    }),
  });
}

const defaultRegistrationSimulation = registrationSimulationStepLabels(2);

export const storyEmptyCompanyFieldKeySet = new Set<CompanyFormFieldKey>();

const prefilledDemoKeys = new Set<CompanyFormFieldKey>([
  "organizationName",
  "country",
  "addressStreet",
]);

const resolvedDemoKeys = new Set<CompanyFormFieldKey>(["organizationName", "country"]);

function noopSetFlowState(_update: SetStateAction<OnboardingFlowState>): void {
  void _update;
}

/**
 * Baseline presentational props for {@link OnboardingFlowView}. Override slices per story.
 * Uses no-op `setFlowState` unless you wrap the story in local state (recommended for interactive steps).
 */
export function baseOnboardingFlowViewProps(
  overrides: Partial<OnboardingFlowViewProps> = {},
): OnboardingFlowViewProps {
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

  const base: OnboardingFlowViewProps = {
    step,
    registrationPhaseTitle: "Registratie",
    registrationPhaseDescription:
      "Na een korte keuze voor land of regio vullen we de volgende stappen daarop aan: uw contactpersoon, ondernemingsnummer en bedrijfsadres.",
    onSignInClick: noop,
    registrationSubmitOpen: false,
    onRegistrationSubmitOpenChange: noop,
    registrationProgress: 0,
    registrationStepIndex: -1,
    registrationSimulationLabels: defaultRegistrationSimulation,
    context,
    updateContext: noop as OnboardingFlowViewProps["updateContext"],
    patchContext: noop as OnboardingFlowViewProps["patchContext"],
    setFlowState: noopSetFlowState,
    drafts,
    effectiveSummaryIncludedDraftIds: includedIds,
    rows: buildRows(context, drafts, includedIds, { includeDraftRows: false }),
    steps: storyOnboardingStepperSteps({ step, context, drafts, requestOrigin }),
    activeStep: registrationStepIndex(step, drafts),
    goToOnboardingStep: noop as OnboardingFlowViewProps["goToOnboardingStep"],
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
    setRequestOrigin: noop as OnboardingFlowViewProps["setRequestOrigin"],
    countrySelectOptions: countryOptions,
    countrySelectValue,
    companyHints: {},
    summaryKlantenportaalByPersonId: {},
    submissionNote: "",
    submissionNoteUnlocked: false,
    innovationAttestInquiry: createEmptyInnovationAttestInquiry(),
    metrologyInquiry: createEmptyMetrologyInquiry(),
    onSummaryEditInquiriesClick: noop,
  };

  return { ...base, ...overrides };
}

/** Maps static Storybook view props to persisted flow state (memory adapter seeding). */
export function flowStateSeedFromOnboardingFlowViewProps(
  props: OnboardingFlowViewProps,
): OnboardingFlowState {
  const summaryIds = props.effectiveSummaryIncludedDraftIds;
  const seq = registrationStepsSequence(props.drafts);
  const stepIdx = seq.indexOf(props.step);
  const innoIdx = seq.indexOf("innovationAttest");
  const metroIdx = seq.indexOf("metrologyAttest");

  return hydrateOnboardingFlowStateFromStored({
    trajectServiceId: "",
    guestIntakeChannel: props.requestOrigin ? "formal" : "",
    formalRequestPackageCommitted:
      props.requestOrigin !== "" || (props.drafts?.length ?? 0) > 0,
    requestOrigin: props.requestOrigin,
    drafts: [...props.drafts],
    summaryIncludedDraftIds: summaryIds !== undefined ? [...summaryIds] : undefined,
    context: props.context,
    prototypeVatPresetId: props.prototypeVatPresetId,
    companyFieldHints: props.companyHints ?? {},
    summaryKlantenportaalByPersonId: props.summaryKlantenportaalByPersonId ?? {},
    submissionNote: props.submissionNote,
    submissionNoteUnlocked: props.submissionNoteUnlocked,
    innovationAttestInquiry: props.innovationAttestInquiry ?? {
      capture: createEmptyInnovationAttestCapture(),
      stepCompleted: innoIdx >= 0 ? stepIdx > innoIdx : false,
    },
    metrologyInquiry: props.metrologyInquiry ?? {
      ...createEmptyMetrologyInquiry(),
      stepCompleted: metroIdx >= 0 ? stepIdx > metroIdx : false,
    },
    companyZetelStepCompleted: stepIdx > seq.indexOf("company"),
    companyLegalEntitiesStepCompleted: stepIdx > seq.indexOf("companyLegalEntities"),
    invoicingStepCompleted: stepIdx > seq.indexOf("invoicing"),
    extrasStepCompleted: stepIdx > seq.indexOf("extras"),
  });
}

function OnboardingFlowStoryHookBody({
  activeStep,
  onRegistrationStepChange,
}: {
  activeStep: OnboardingStep;
  onRegistrationStepChange: (next: OnboardingStep) => void;
}) {
  const navigate = useCallback(() => {}, []);
  useOnboardingCompanyLookupPrototypeEffects(activeStep);
  const { viewProps } = useOnboardingFlow({
    navigate,
    activeStep,
    onRegistrationStepChange,
  });
  return <OnboardingFlowView {...viewProps} />;
}

/**
 * Renders the live controller + provider with in-memory persistence seeded from static fixtures.
 * Step-specific UI outside flow state (e.g. forced company lookup phase) stays on presentational-only stories.
 */
export function OnboardingFlowViewWithMemoryProvider({
  fixtureProps,
}: {
  fixtureProps: OnboardingFlowViewProps;
}) {
  const noopNavigate = useCallback(() => {}, []);
  const persistence = useRef(
    createMemoryOnboardingFlowPersistence({
      snapshot: flowStateSeedFromOnboardingFlowViewProps(fixtureProps),
    }),
  ).current;

  const [routedStep, setRoutedStep] = useState<OnboardingStep>(fixtureProps.step);

  return (
    <OnboardingFlowProvider persistence={persistence} navigate={noopNavigate}>
      <OnboardingFlowStoryHookBody
        activeStep={routedStep}
        onRegistrationStepChange={setRoutedStep}
      />
    </OnboardingFlowProvider>
  );
}
