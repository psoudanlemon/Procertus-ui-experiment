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
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLayoutEffect, type ComponentType } from "react";

import { OnboardingCompanyZetelStepRedesign } from "../components/onboarding/redesign/OnboardingCompanyZetelStepRedesign";
import { OnboardingCustomerStepRedesign } from "../components/onboarding/redesign/OnboardingCustomerStepRedesign";
import { OnboardingInvoicingStepRedesign } from "../components/onboarding/redesign/OnboardingInvoicingStepRedesign";
import { OnboardingOriginStepRedesign } from "../components/onboarding/redesign/OnboardingOriginStepRedesign";
import { OnboardingSummaryStepRedesign } from "../components/onboarding/redesign/OnboardingSummaryStepRedesign";

import { registrationStepIndex } from "./onboarding-registration-steps";
import {
  OnboardingFlowStoryView,
  baseOnboardingFlowViewProps,
  noop,
  storyCustomerContext,
  storyEmptyCompanyFieldKeySet,
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
 * redesign-component erin. Onbekende steps (innovation, metrology, companyLegalEntities)
 * geven `undefined` terug zodat de flow-view daar de originele body kan blijven gebruiken.
 *
 * NB: we returnen `null` voor steps die in het redesign-traject niet meer bestaan (zoals
 * companyLegalEntities, dat is samengevoegd in de zetel-step) — dat houdt de stepper-volgorde
 * intact terwijl de body leeg blijft. Zie design-doc § 3.8.
 */
const renderRedesignStepBody: OnboardingFlowViewRenderStepBody = ({
  step,
  model,
  requestOrigin,
  setRequestOrigin,
}) => {
  if (step === "origin") {
    return (
      <OnboardingOriginStepRedesign
        originFieldBase={model.originFieldBase}
        requestOrigin={requestOrigin}
        setRequestOrigin={setRequestOrigin}
      />
    );
  }
  if (step === "customer") return <OnboardingCustomerStepRedesign model={model} />;
  if (step === "company") return <OnboardingCompanyZetelStepRedesign model={model} />;
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
  if (step === "companyLegalEntities") {
    return (
      <div className="space-y-3 rounded-lg border border-dashed border-border bg-muted/20 p-section text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Certificatie (entiteit) verdwijnt als aparte stap</p>
        <p>
          In het redesign zit de koppeling product → zetel inline op de stap Maatschappelijke
          zetel. Deze stap kan uit de stepper-volgorde verdwijnen.
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

export const OriginStep: StoryObj<typeof meta> = {
  name: "01 — Land of regio (redesign)",
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
      <OnboardingFlowStoryView
        {...baseOnboardingFlowViewProps({
          step: "origin",
          context: ctx,
          drafts,
          requestOrigin: "be",
          steps: storyOnboardingStepperSteps({
            step: "origin",
            context: ctx,
            drafts,
            requestOrigin: "be",
          }),
          activeStep: registrationStepIndex("origin", drafts),
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
          registrationChromeOverrides: {
            origin: {
              title: "Kies uw land of regio",
              description:
                "Uw keuze bepaalt welke gegevens we in de volgende stappen vragen.",
            },
          },
        })}
        renderStepBody={renderRedesignStepBody}
      />
    );
  },
};

export const CustomerStep: StoryObj<typeof meta> = {
  name: "03 — Registratie (redesign)",
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
      <OnboardingFlowStoryView
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
          activeStep: registrationStepIndex("customer", drafts),
          primaryAction: { label: "Verder", onClick: noop, disabled: false },
          rows: [],
          effectiveSummaryIncludedDraftIds: [],
        })}
        renderStepBody={renderRedesignStepBody}
      />
    );
  },
};

export const CompanyLookupLoading: StoryObj<typeof meta> = {
  name: "04 — Maatschappelijke zetel · lookup (redesign)",
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
      <OnboardingFlowStoryView
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
          activeStep: registrationStepIndex("company", drafts),
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
        renderStepBody={renderRedesignStepBody}
      />
    );
  },
};

export const CompanyLookupReady: StoryObj<typeof meta> = {
  name: "05 — Maatschappelijke zetel · klaar + multi-zetel (redesign)",
  render: () => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext();
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return (
      <OnboardingFlowStoryView
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
          activeStep: registrationStepIndex("company", drafts),
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
          lookupStepIndex: 4,
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
