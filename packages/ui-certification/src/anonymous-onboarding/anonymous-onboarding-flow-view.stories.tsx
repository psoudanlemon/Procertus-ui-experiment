import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";

import { ProcertusCategorizationProvider } from "../ProcertusCategorizationContext";
import {
  CERTIFICATION_PHASE_DESCRIPTION,
  CERTIFICATION_PHASE_TITLE,
} from "./anonymous-onboarding-constants";
import { stepIndex } from "./anonymous-onboarding-flow-helpers";
import { AnonymousOnboardingFlowView } from "./anonymous-onboarding-flow-view";
import {
  baseAnonymousOnboardingFlowViewProps,
  noop,
  storyCertificationWizardProps,
  storyCustomerContext,
  storyEmptyCompanyFieldKeySet,
  storyOnboardingDrafts,
  storyOnboardingStepperSteps,
} from "./anonymous-onboarding-story-fixtures";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  findVatPrototypePreset,
  vatLookupSimulationStepsForPreset,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";

const meta = {
  title: "Anonymous onboarding/AnonymousOnboardingFlowView",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Presentational shell for **anonymous onboarding**: wraps `CertificationRequestWizard` on the request step, then `StepLayout` for registratie (customer → company → summary) plus `RegistrationProcessingDialog`. Applications derive props from `useAnonymousOnboardingFlow` (router + localStorage). Stories use static fixtures and `backendKind: "memory"` for the wizard.',
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

const categorizationDecorator = (Story: ComponentType) => (
  <ProcertusCategorizationProvider>
    <Story />
  </ProcertusCategorizationProvider>
);

export const RequestPhase: StoryObj<typeof meta> = {
  name: "01 — Certification (wizard)",
  decorators: [categorizationDecorator],
  render: () => {
    const ctx = storyCustomerContext();
    return (
      <AnonymousOnboardingFlowView
        {...baseAnonymousOnboardingFlowViewProps({
          step: "request",
          certificationPhaseTitle: CERTIFICATION_PHASE_TITLE,
          certificationPhaseDescription: CERTIFICATION_PHASE_DESCRIPTION,
          certificationWizardProps: {
            ...storyCertificationWizardProps(ctx),
            sessionId: "storybook-anonymous-onboarding-request",
          },
        })}
      />
    );
  },
};

export const CustomerStep: StoryObj<typeof meta> = {
  name: "02 — Registratie (customer)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext({
      organizationName: "",
      country: "",
      addressStreet: "",
      addressHouseNumber: "",
      addressPostalCode: "",
      addressCity: "",
    });
    return (
      <AnonymousOnboardingFlowView
        {...baseAnonymousOnboardingFlowViewProps({
          step: "customer",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({ step: "customer", context: ctx, drafts }),
          activeStep: stepIndex("customer"),
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
      />
    );
  },
};

export const CompanyLookupLoading: StoryObj<typeof meta> = {
  name: "03 — Bedrijf (lookup loading)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext({
      organizationName: "",
      country: "",
      addressStreet: "",
      addressHouseNumber: "",
      addressPostalCode: "",
      addressCity: "",
    });
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return (
      <AnonymousOnboardingFlowView
        {...baseAnonymousOnboardingFlowViewProps({
          step: "company",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({ step: "company", context: ctx, drafts }),
          activeStep: stepIndex("company"),
          companyLookupPhase: "loading",
          lookupProgress: 48,
          lookupStepIndex: 2,
          vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
          companyPrefillFieldKeys: storyEmptyCompanyFieldKeySet,
          companyFieldsResolvedInSimulation: storyEmptyCompanyFieldKeySet,
          vatNumberForDisplay: ctx.vatNumber.trim(),
          emailForDisplay: ctx.representativeEmail.trim(),
          activeVatPreset: activePreset,
          prototypeVatPresetId: activePreset.id,
          primaryAction: { label: "Verder", onClick: noop, disabled: true },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
      />
    );
  },
};

export const CompanyLookupReady: StoryObj<typeof meta> = {
  name: "04 — Bedrijf (lookup ready)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext();
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return (
      <AnonymousOnboardingFlowView
        {...baseAnonymousOnboardingFlowViewProps({
          step: "company",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({ step: "company", context: ctx, drafts }),
          activeStep: stepIndex("company"),
          companyLookupPhase: "ready",
          lookupProgress: 100,
          lookupStepIndex: 4,
          vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
          companyPrefillFieldKeys: new Set([
            "organizationName",
            "country",
            "addressStreet",
            "addressHouseNumber",
            "addressPostalCode",
            "addressCity",
          ]),
          companyFieldsResolvedInSimulation: new Set(["organizationName", "country"]),
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
      />
    );
  },
};

export const SummaryStep: StoryObj<typeof meta> = {
  name: "05 — Summary",
  render: () => <AnonymousOnboardingFlowView {...baseAnonymousOnboardingFlowViewProps()} />,
};

export const RegistrationProcessingOpen: StoryObj<typeof meta> = {
  name: "06 — Registration dialog (open)",
  render: () => (
    <AnonymousOnboardingFlowView
      {...baseAnonymousOnboardingFlowViewProps({
        registrationSubmitOpen: true,
        registrationProgress: 78,
        registrationStepIndex: 2,
        primaryAction: { label: "Versturen", onClick: noop, disabled: true },
      })}
    />
  ),
};
