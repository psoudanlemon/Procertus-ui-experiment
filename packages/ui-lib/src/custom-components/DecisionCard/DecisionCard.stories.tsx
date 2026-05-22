import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Call02Icon,
  FilePlusIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

import { DecisionCard, DecisionCardCallout } from "./DecisionCard";

const meta = {
  title: "custom-components/Decision/DecisionCard",
  component: DecisionCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Pair of decision surfaces that present a route forward. `DecisionCard` is the vertical option card (icon tile, title, description, optional check-bullets, trailing-icon CTA). `DecisionCardCallout` is the gradient side-route nudge for adjacent expert-call / contact invitations.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DecisionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const informalBullets = [
  "Geen verplichting om op te starten",
  "Antwoord binnen enkele werkdagen",
  "Live sessie met een expert mogelijk",
] as const;

const formalBullets = [
  "Je hebt voldoende informatie over het traject",
  "Je hebt je bedrijfsgegevens bij de hand",
  "Je wil nu indienen",
  "De ontvankelijkheidsbeoordeling start meteen",
  "PROCERTUS volgt je dossier actief op",
  "Je account wordt aangemaakt bij indiening",
] as const;

/**
 * Quiet, secondary card. Lower-stakes route or fallback option.
 */
export const Muted: Story = {
  args: {
    tone: "muted",
    icon: Mail01Icon,
    title: "Aanvraag meer informatie",
    description: "Voor wie eerst wil afstemmen.",
    bullets: [...informalBullets],
    cta: {
      label: "Vrijblijvende aanvraag",
      asChild: true,
      children: <a href="#info-request" />,
    },
  },
};

/**
 * Raised, command-surface card. Recommended route or primary action.
 * Uses `ring-2 ring-primary/30` + `shadow-proc-md` to lift it above the muted twin.
 */
export const Primary: Story = {
  args: {
    tone: "primary",
    icon: FilePlusIcon,
    title: "Traject opstarten",
    description: "Voor wie klaar is om in te dienen.",
    bullets: [...formalBullets],
    cta: {
      label: "Start traject",
      asChild: true,
      children: <a href="#formal" />,
    },
  },
};

/**
 * Decision moment: muted + primary side by side. Reproduces the Triage choice
 * between an informative request and a formal traject.
 */
export const Pair: Story = {
  args: {
    title: "",
    cta: { label: "" },
  },
  render: () => (
    <div className="grid grid-cols-1 gap-region md:grid-cols-2">
      <DecisionCard
        tone="muted"
        icon={Mail01Icon}
        title="Aanvraag meer informatie"
        description="Voor wie eerst wil afstemmen."
        bullets={[...informalBullets]}
        cta={{
          label: "Vrijblijvende aanvraag",
          asChild: true,
          children: <a href="#info-request" />,
        }}
      />
      <DecisionCard
        tone="primary"
        icon={FilePlusIcon}
        title="Traject opstarten"
        description="Voor wie klaar is om in te dienen."
        bullets={[...formalBullets]}
        cta={{
          label: "Start traject",
          asChild: true,
          children: <a href="#formal" />,
        }}
      />
    </div>
  ),
};

/**
 * Variant without bullets — title, description, and CTA only. Useful when the
 * decision is binary and doesn't need supporting checklist context.
 */
export const NoBullets: Story = {
  args: {
    tone: "muted",
    icon: Mail01Icon,
    title: "Aanvraag meer informatie",
    description: "Voor wie eerst wil afstemmen.",
    cta: {
      label: "Vrijblijvende aanvraag",
      asChild: true,
      children: <a href="#info-request" />,
    },
  },
};

/**
 * Variant without an icon tile. Used when the surrounding surface or copy
 * already carries enough recognition.
 */
export const NoIcon: Story = {
  args: {
    tone: "muted",
    title: "Aanvraag meer informatie",
    description: "Voor wie eerst wil afstemmen.",
    bullets: [...informalBullets],
    cta: {
      label: "Vrijblijvende aanvraag",
      asChild: true,
      children: <a href="#info-request" />,
    },
  },
};

/**
 * Gradient side-route nudge. Horizontal layout for the typical case where the
 * callout sits as a full-row banner below a row of decision cards (Triage).
 */
export const CalloutHorizontal: StoryObj<typeof DecisionCardCallout> = {
  render: (args) => <DecisionCardCallout {...args} />,
  args: {
    title: "Wil je eerst een expert spreken?",
    description:
      "Reserveer een live online sessie van één uur en overloop de vereisten samen met een PROCERTUS-expert.",
    cta: {
      label: "Plan een gesprek",
      icon: Call02Icon,
      asChild: true,
      children: <a href="#expert-call" />,
    },
  },
};

/**
 * Vertical layout for narrow grid cells (e.g. the expert-call card inside
 * `AllCertificatesGrid` on Wegwijzer). Title + description stack above a
 * left-aligned CTA at natural width.
 */
export const CalloutVertical: StoryObj<typeof DecisionCardCallout> = {
  render: (args) => (
    <div className="max-w-md">
      <DecisionCardCallout {...args} />
    </div>
  ),
  args: {
    orientation: "vertical",
    title: "Wil je eerst een expert spreken?",
    description:
      "Reserveer een live online sessie van één uur en overloop de vereisten samen met een PROCERTUS-expert.",
    cta: {
      label: "Plan een gesprek",
      icon: Call02Icon,
      asChild: true,
      children: <a href="#expert-call" />,
    },
  },
};
