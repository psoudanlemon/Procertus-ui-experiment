import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLayoutEffect, type ComponentType } from "react";

import { ProcertusCategorizationProvider } from "../ProcertusCategorizationContext";
import { buildRows } from "./onboarding-flow-helpers";
import { registrationStepIndex } from "./onboarding-registration-steps";
import { OnboardingFlowView } from "./onboarding-flow-view";
import {
  OnboardingFlowViewWithMemoryProvider,
  baseOnboardingFlowViewProps,
  noop,
  storyCustomerContext,
  storyEmptyCompanyFieldKeySet,
  storyOnboardingDrafts,
  storyOnboardingStepperSteps,
  storyRequestOrigin,
} from "./onboarding-story-fixtures";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  findVatPrototypePreset,
  vatLookupSimulationStepsForPreset,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";

/**
 * Mirrors `PublicAppShell` in the production app: sets `data-public-layout` on `<html>` so the
 * Storybook preview CSS unlocks document scrolling (shared `globals.css` keeps html/body locked
 * for the authenticated shell). Without this, tall guest-flow stories get clipped at viewport.
 */
const PublicLayoutDecorator = (Story: ComponentType) => {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);
  return <Story />;
};

const meta = {
  title: "Onboarding/Flow/Full flow view (composed)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full **onboarding** orchestration: certification wizard, registration `StepLayout`, and submit dialog. Live apps use `OnboardingFlowProvider` + `useOnboardingFlow`. Isolated step UIs: **Onboarding/Presentational/Steps**.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

const categorizationDecorator = (Story: ComponentType) => (
  <ProcertusCategorizationProvider>
    <Story />
  </ProcertusCategorizationProvider>
);

export const OriginStep: StoryObj<typeof meta> = {
  name: "01 — Land of regio (origin)",
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
      <OnboardingFlowView
        {...baseOnboardingFlowViewProps({
          step: "origin",
          context: ctx,
          drafts,
          requestOrigin: "",
          steps: storyOnboardingStepperSteps({
            step: "origin",
            context: ctx,
            drafts,
            requestOrigin: "",
          }),
          activeStep: registrationStepIndex("origin", drafts, []),
          primaryAction: { label: "Verder", onClick: noop, disabled: true },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
      />
    );
  },
};

export const CustomerStep: StoryObj<typeof meta> = {
  name: "03 — Registratie (customer)",
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
      <OnboardingFlowView
        {...baseOnboardingFlowViewProps({
          step: "customer",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({
            step: "customer",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: registrationStepIndex("customer", drafts, []),
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
      />
    );
  },
};

export const CompanyLookupLoading: StoryObj<typeof meta> = {
  name: "04 — Maatschappelijke zetel (lookup bezig)",
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
      <OnboardingFlowView
        {...baseOnboardingFlowViewProps({
          step: "company",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({
            step: "company",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: registrationStepIndex("company", drafts, []),
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
  name: "05 — Maatschappelijke zetel (lookup klaar)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext();
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return (
      <OnboardingFlowView
        {...baseOnboardingFlowViewProps({
          step: "company",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({
            step: "company",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: registrationStepIndex("company", drafts, []),
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

export const CompanyLegalEntitiesStep: StoryObj<typeof meta> = {
  name: "06 — Certificatie (juridische entiteit)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const included = drafts.map((d) => d.id);
    const ctx = storyCustomerContext({ headOfficeIsCertificationLegalEntity: "yes" });
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return (
      <OnboardingFlowView
        {...baseOnboardingFlowViewProps({
          step: "companyLegalEntities",
          context: ctx,
          drafts,
          effectiveSummaryIncludedDraftIds: included,
          rows: buildRows(ctx, drafts, included, { includeDraftRows: false }),
          steps: storyOnboardingStepperSteps({
            step: "companyLegalEntities",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: registrationStepIndex("companyLegalEntities", drafts, included),
          companyLookupPhase: "ready",
          lookupProgress: 100,
          lookupStepIndex: 4,
          vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
        })}
      />
    );
  },
};

export const InvoicingStep: StoryObj<typeof meta> = {
  name: "07 — Facturatie (invoicing)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext();
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return (
      <OnboardingFlowView
        {...baseOnboardingFlowViewProps({
          step: "invoicing",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({
            step: "invoicing",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: registrationStepIndex("invoicing", drafts, []),
          companyLookupPhase: "ready",
          lookupProgress: 100,
          lookupStepIndex: 4,
          vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
      />
    );
  },
};

export const ExtrasStep: StoryObj<typeof meta> = {
  name: "08 — Extra contacten",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext();
    return (
      <OnboardingFlowView
        {...baseOnboardingFlowViewProps({
          step: "extras",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({
            step: "extras",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: registrationStepIndex("extras", drafts, []),
          companyLookupPhase: "ready",
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
      />
    );
  },
};

export const SummaryStep: StoryObj<typeof meta> = {
  name: "09 — Nazicht",
  render: () => <OnboardingFlowView {...baseOnboardingFlowViewProps()} />,
};

export const RegistrationProcessingOpen: StoryObj<typeof meta> = {
  name: "10 — Registration dialog (open)",
  render: () => (
    <OnboardingFlowView
      {...baseOnboardingFlowViewProps({
        registrationSubmitOpen: true,
        registrationProgress: 78,
        registrationStepIndex: 2,
        primaryAction: { label: "Indienen", onClick: noop, disabled: true },
      })}
    />
  ),
};

export const ProviderMemorySummaryBaseline: StoryObj<typeof meta> = {
  name: "11 — Provider + memory (summary baseline)",
  decorators: [categorizationDecorator],
  render: () => (
    <OnboardingFlowViewWithMemoryProvider fixtureProps={baseOnboardingFlowViewProps()} />
  ),
};
