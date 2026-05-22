/**
 * Redesign-tegenhanger van {@link file:./onboarding-flow-view.stories.tsx}.
 *
 * Toont elke onboarding-step inside de echte flow-shell (stepper + footer-actiebar)
 * maar met de redesign-step-componenten als body. Mogelijk gemaakt door de optionele
 * `renderStepBody`-slot op {@link OnboardingFlowView} — de originele componenten en
 * stories blijven volledig onaangetast.
 *
 * Vergelijk side-by-side met `Onboarding/Flow/Full flow view (composed)` om het effect
 * van het redesign in de daadwerkelijke flow te beoordelen.
 *
 * NB: de zetel-stap (3.7) van het redesign-traject is gepromoveerd naar productie en
 * leeft hier dus niet meer als aparte body-swap. Deze story toont alleen nog de
 * resterende redesign-experimenten: Certificatie (Accordion-variant), Facturatie en
 * Nazicht.
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLayoutEffect, type ComponentType } from "react";

import { OnboardingCertificatieStepRedesign } from "../components/onboarding/redesign/OnboardingCertificatieStepRedesign";
import { OnboardingInvoicingStepRedesign } from "../components/onboarding/redesign/OnboardingInvoicingStepRedesign";
import { OnboardingSummaryStepRedesign } from "../components/onboarding/redesign/OnboardingSummaryStepRedesign";

import { registrationStepIndex } from "./onboarding-registration-steps";
import {
  OnboardingFlowStoryView,
  baseOnboardingFlowViewProps,
  noop,
  storyCustomerContext,
  storyOnboardingDrafts,
  storyOnboardingStepperSteps,
  storyRequestOrigin,
} from "./onboarding-story-fixtures";
import type { OnboardingFlowViewRenderStepBody } from "./onboarding-flow-view-props";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  findVatPrototypePreset,
  vatLookupSimulationStepsForPreset,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";

/**
 * Mirror van `PublicAppShell` voor public-layout scroll-unlock. Identiek aan de
 * originele flow-story decorator.
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

/**
 * Eén renderStepBody-callback voor de hele redesign. Pakt elke step-id en swapt de
 * redesign-component erin. Onbekende steps (innovation, metrology, …) geven `null`
 * terug zodat de flow-view daar de originele body kan blijven gebruiken.
 */
const renderRedesignStepBody: OnboardingFlowViewRenderStepBody = ({ step, model }) => {
  if (step === "companyLegalEntities") {
    return <OnboardingCertificatieStepRedesign model={model} />;
  }
  if (step === "invoicing") return <OnboardingInvoicingStepRedesign model={model} />;
  if (step === "summary") return <OnboardingSummaryStepRedesign model={model} />;
  if (step === "extras") {
    return (
      <div className="space-y-3 rounded-lg border border-dashed border-border bg-muted/20 p-section text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Extra contacten verdwijnt als aparte stap</p>
        <p>
          In het redesign zit cert/inspectie-contact (en het reservecontact) inline op de
          stap Facturatie. Deze stap kan uit de stepper-volgorde verdwijnen.
        </p>
      </div>
    );
  }
  return null;
};

const meta = {
  title: "Onboarding/Redesign/Flow/Full flow view (composed, redesign)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Volledige onboarding-shell (stepper + step-layout + footer-actiebar) met de **redesign**-step-bodies erin. Vergelijk side-by-side met `Onboarding/Flow/Full flow view (composed)` voor een eerlijke evaluatie tegen de huidige flow.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const CertificatieStep: StoryObj<typeof meta> = {
  name: "04 — Bedrijfslocaties & certificatie · Accordion (redesign)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const includedIds = drafts.map((d) => d.id);
    const ctx = storyCustomerContext({ headOfficeIsCertificationLegalEntity: "yes" });
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return (
      <OnboardingFlowStoryView
        {...baseOnboardingFlowViewProps({
          step: "companyLegalEntities",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({
            step: "companyLegalEntities",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: registrationStepIndex("companyLegalEntities", drafts),
          companyLookupPhase: "ready",
          lookupProgress: 100,
          lookupStepIndex: 2,
          vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
          activeVatPreset: activePreset,
          prototypeVatPresetId: activePreset.id,
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: includedIds,
        })}
        renderStepBody={renderRedesignStepBody}
      />
    );
  },
};

export const InvoicingStep: StoryObj<typeof meta> = {
  name: "06 — Facturatie · met cert-contact inline (redesign)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext();
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return (
      <OnboardingFlowStoryView
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
          activeStep: registrationStepIndex("invoicing", drafts),
          companyLookupPhase: "ready",
          lookupProgress: 100,
          lookupStepIndex: 2,
          vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
        renderStepBody={renderRedesignStepBody}
      />
    );
  },
};

export const SummaryStep: StoryObj<typeof meta> = {
  name: "07 — Nazicht (redesign)",
  render: () => (
    <OnboardingFlowStoryView
      {...baseOnboardingFlowViewProps()}
      renderStepBody={renderRedesignStepBody}
    />
  ),
};
