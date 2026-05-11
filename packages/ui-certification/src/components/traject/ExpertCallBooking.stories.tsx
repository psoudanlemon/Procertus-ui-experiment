import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Calendar,
  Field,
  FieldLabel,
  H3,
  Input,
  Separator,
} from "@procertus-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect, useState } from "react";

import { TrajectLayout } from "./TrajectLayout";
import { TrajectStoryFooter } from "./TrajectStoryFooter";

const STORY_FOOTER = {
  companyDetails: [
    { label: "© 2026 PROCERTUS asbl/vzw" },
    { label: "TVA/BTW: BE 1000.472.054" },
  ],
  legalLinks: [
    { label: "Privacy policy", url: "#" },
    { label: "Contact", url: "#" },
  ],
};

/**
 * Mirrors `PublicAppShell` in the production app: sets `data-public-layout` on `<html>` so the
 * shared `globals.css` unlocks document scrolling (it keeps html/body locked for the
 * authenticated shell) and paints the public bottom chrome (footer + action bar) on a white
 * surface. Without this, tall traject pages get clipped at viewport.
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
  title: "Traject configuration/Layout/Informatieve aanvraag",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
      description: {
        component:
          "Plan een expert call: kalender, tijdslots en contactgegevens. Navigatie via de gedeelde `TrajectStoryFooter` (Terug + Verzenden) in de `actionBar`-slot van `TrajectLayout`; 'Verzenden' blijft uitgeschakeld tot datum en tijdslot gekozen zijn.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

const SESSION_HIGHLIGHTS = [
  "Eén uur live online, videogesprek met scherm delen",
  "Doorloop van de minimale vereisten en uw dossier",
  "Concrete inschatting van het te volgen traject",
] as const;

const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00"] as const;

export const Default: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    title: "Plan een expert call",
    children: null,
    description:
      "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.",
  },
  render: (args) => <ExpertCallStoryBody args={args} />,
};

export const ExpertCall: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    title: "Plan een expert call",
    children: null,
    description:
      "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.",
  },
  render: (args) => <ExpertCallStoryBody args={args} />,
};

function ExpertCallStoryBody({ args }: { args: React.ComponentProps<typeof TrajectLayout> }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  const canSubmit = selectedDate != null && selectedSlot != null;
  return (
    <TrajectLayout
      {...args}
      actionBar={
        <TrajectStoryFooter
          onBack={noop}
          onContinue={noop}
          continueLabel="Verzenden"
          continueDisabled={!canSubmit}
        />
      }
    >
      <div className="flex flex-col gap-section">
        <section className="flex flex-col gap-component">
          <H3>Wat u kunt verwachten</H3>
          <ul className="flex flex-col gap-component">
            {SESSION_HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-component text-sm leading-normal"
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="mt-0.5 size-5 shrink-0 text-accent-foreground"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-component">
          <div className="flex flex-col gap-micro">
            <H3>Kies een moment</H3>
            <p className="text-sm text-muted-foreground">
              Sessies duren één uur en starten op het hele of halve uur.
            </p>
          </div>
          <div className="flex flex-col gap-section md:flex-row md:items-stretch md:gap-0">
            <div className="flex flex-1 justify-center md:justify-start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-fit"
              />
            </div>
            <Separator orientation="vertical" className="hidden md:block" />
            <div className="flex max-h-80 flex-col gap-micro overflow-y-auto md:w-44 md:pl-section">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <Button
                    key={slot}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedSlot(slot)}
                    className="w-full justify-center"
                    disabled={!selectedDate}
                  >
                    {slot}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-component">
          <H3>Uw gegevens</H3>
          <div className="grid grid-cols-1 gap-section sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="story-expert-call-firstname">Voornaam</FieldLabel>
              <Input id="story-expert-call-firstname" autoComplete="given-name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="story-expert-call-lastname">Achternaam</FieldLabel>
              <Input id="story-expert-call-lastname" autoComplete="family-name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="story-expert-call-email">E-mailadres</FieldLabel>
              <Input id="story-expert-call-email" type="email" autoComplete="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="story-expert-call-company">Bedrijfsnaam</FieldLabel>
              <Input id="story-expert-call-company" autoComplete="organization" />
            </Field>
          </div>
        </section>
      </div>
    </TrajectLayout>
  );
}
