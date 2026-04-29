import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CompactWizardTimeline } from "./CompactWizardTimeline";
import type { WizardStepperModel } from "./certification-request-wizard-types";

const fourStepWizard: WizardStepperModel = {
  activeStep: 0,
  steps: [
    { id: "intent", title: "Intent", description: "Kies het type aanvraag" },
    { id: "details", title: "Product", description: "Beslissingsboom" },
    { id: "drafts", title: "Bundel", description: "Aanvragen" },
    { id: "review", title: "Controle", description: "Indienen" },
  ],
  onStepChange: () => {
    // Storybook: static; use OnStepChangeLog for interaction
  },
};

const fiveStepMobileSplit: WizardStepperModel = {
  activeStep: 2,
  steps: [
    { id: "intent", title: "Intent", description: "Type" },
    { id: "product", title: "Product", description: "Boom" },
    {
      id: "inquiries",
      title: "Aanvragen",
      description: "Kies certificaten en attesten",
      available: true,
    },
    { id: "drafts", title: "Bundel", description: "Selectie" },
    { id: "review", title: "Controle", description: "Klaar" },
  ],
  onStepChange: () => {},
};

const withDisabledStep: WizardStepperModel = {
  activeStep: 1,
  steps: [
    { id: "a", title: "Eerste" },
    {
      id: "b",
      title: "Nog geblokkeerd",
      description: "Vul vorige stap in",
      available: false,
    },
    { id: "c", title: "Derde" },
  ],
  onStepChange: () => {},
};

const meta = {
  title: "Certification Request/CompactWizardTimeline",
  component: CompactWizardTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Compact **horizontal timeline** for mobile wizard chrome: one row of tappable step labels with optional secondary line. Used above the fold on small viewports when the full vertical `OnboardingStepper` is hidden. `activeStep` is **0-based**; completed steps use primary emphasis; unavailable steps are `disabled` and de-emphasized.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CompactWizardTimeline>;

export default meta;

export const FirstStepActive: StoryObj<typeof meta> = {
  args: {
    model: fourStepWizard,
  },
};

export const MiddleOfFlow: StoryObj<typeof meta> = {
  name: "Middle of flow (step 2 active)",
  args: {
    model: { ...fourStepWizard, activeStep: 2 },
  },
};

export const MobileSplitFiveSteps: StoryObj<typeof meta> = {
  name: "Five steps (product + inquiries split)",
  args: {
    model: fiveStepMobileSplit,
  },
};

export const UnavailableStep: StoryObj<typeof meta> = {
  name: "With disabled / unavailable step",
  args: {
    model: withDisabledStep,
  },
};

function OnStepChangeLog() {
  const [log, setLog] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const model: WizardStepperModel = {
    activeStep: active,
    steps: fourStepWizard.steps,
    onStepChange: (step) => {
      setActive(step);
      setLog((prev) => [`→ step ${step}`, ...prev].slice(0, 6));
    },
  };
  return (
    <div className="w-full max-w-3xl space-y-4">
      <CompactWizardTimeline model={model} />
      <p className="text-xs text-muted-foreground" role="status">
        Active index: {active}. Tap a step to update (story).
      </p>
      {log.length > 0 ? (
        <ul className="list-inside list-disc text-xs text-muted-foreground">
          {log.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export const InteractiveStepChange: StoryObj<typeof meta> = {
  render: () => <OnStepChangeLog />,
};
