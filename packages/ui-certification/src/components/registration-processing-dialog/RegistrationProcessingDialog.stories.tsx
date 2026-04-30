import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import { RegistrationProcessingDialog } from "./RegistrationProcessingDialog";
import type { RegistrationProcessingStep } from "./RegistrationProcessingDialog";

const sampleSteps: RegistrationProcessingStep[] = [
  { id: "a", label: "Registratiegegevens en organisatie worden vastgelegd…" },
  { id: "b", label: "Uw profiel en bedrijfsadres worden veilig opgeslagen…" },
  {
    id: "c",
    label: "Uw 2 geselecteerde aanvragen worden aan het dossier gekoppeld…",
  },
  { id: "d", label: "Uw account wordt voorbereid en aan de organisatie gekoppeld…" },
];

const meta = {
  title: "Certification Request/RegistrationProcessingDialog",
  component: RegistrationProcessingDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Blocking dialog during **registration processing**: spinner, linear progress, and a phased checklist. Parents supply `steps`, `progress` (0–100), and `activeStepIndex` (-1 before the simulation starts). Used after onboarding submit while navigation completes.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RegistrationProcessingDialog>;

export default meta;

export const MidSimulation: StoryObj<typeof meta> = {
  args: {
    open: true,
    progress: 56,
    activeStepIndex: 2,
    steps: sampleSteps,
  },
};

export const BeforeStart: StoryObj<typeof meta> = {
  name: "Before steps advance",
  args: {
    open: true,
    progress: 0,
    activeStepIndex: -1,
    steps: sampleSteps,
  },
};

export const Complete: StoryObj<typeof meta> = {
  args: {
    open: true,
    progress: 100,
    activeStepIndex: 3,
    steps: sampleSteps,
  },
};

function AnimatedSimulation() {
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  useEffect(() => {
    if (!open) return;
    const t: number[] = [];
    t.push(window.setTimeout(() => setProgress(12), 0));
    t.push(window.setTimeout(() => setActiveStepIndex(0), 150));
    t.push(window.setTimeout(() => setProgress(34), 750));
    t.push(window.setTimeout(() => setActiveStepIndex(1), 750));
    t.push(window.setTimeout(() => setProgress(56), 1400));
    t.push(window.setTimeout(() => setActiveStepIndex(2), 1400));
    t.push(window.setTimeout(() => setProgress(78), 2100));
    t.push(window.setTimeout(() => setActiveStepIndex(3), 2100));
    t.push(window.setTimeout(() => setProgress(100), 2900));
    return () => t.forEach((id) => window.clearTimeout(id));
  }, [open]);

  return (
    <RegistrationProcessingDialog
      open={open}
      onOpenChange={setOpen}
      progress={progress}
      activeStepIndex={activeStepIndex}
      steps={sampleSteps}
    />
  );
}

export const AnimatedFixture: StoryObj<typeof meta> = {
  name: "Animated (story timers)",
  args: {
    open: true,
    progress: 0,
    activeStepIndex: -1,
    steps: sampleSteps,
  },
  render: () => <AnimatedSimulation />,
};
