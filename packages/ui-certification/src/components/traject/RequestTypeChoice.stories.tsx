import {
  ArrowRight02Icon,
  Call02Icon,
  CheckmarkCircle02Icon,
  FilePlusIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  H3,
} from "@procertus-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect } from "react";

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
  title: "Traject configuration/Layout/Keuze aanvraag type",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
      description: {
        component:
          "Hoe wilt u {service} aanvragen? Keuze tussen informatieve en formele aanvraag, met 'expert call'-uitnodiging onderaan.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

export const Default: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    kicker: "Keuring",
    title: "Hoe wilt u Partijkeuring aanvragen?",
    children: null,
    description:
      "Kies een vrijblijvende informatieaanvraag voor een prijsopgave en advies, of start meteen het formele dossier zodat de ontvankelijkheidsbeoordeling kan beginnen.",
  },
  render: (args) => (
    <TrajectLayout
      {...args}
      actionBar={<TrajectStoryFooter onBack={noop} backLabel="Terug naar wegwijzer" />}
    >
      <div className="flex flex-col gap-section">
        <div className="grid grid-cols-1 gap-section md:grid-cols-2">
          <TriageOptionCard
            tone="muted"
            icon={Mail01Icon}
            title="Informatieve aanvraag"
            description="Voor wie eerst wil afstemmen. U bezorgt enkele basisgegevens en uw vraag, wij komen terug met een prijsopgave en het te volgen traject."
            bullets={[
              "Geen verplichting tot opstart",
              "Reactie binnen enkele werkdagen",
              "Mogelijkheid tot live sessie tijdens het invullen",
            ]}
            cta="Start informatieve aanvraag"
          />
          <TriageOptionCard
            tone="primary"
            icon={FilePlusIcon}
            title="Formele aanvraag"
            description="Voor wie klaar is om in te dienen. Het volledige aanvraagpakket wordt opgebouwd en de ontvankelijkheidsbeoordeling kan starten."
            bullets={[
              "Volledige aanvraagwizard",
              "Dossier wordt actief opgevolgd",
              "Account aanmaken pas bij indiening",
            ]}
            cta="Start formele aanvraag"
          />
        </div>
        <Card
          className="relative flex flex-col gap-component px-section py-section sm:flex-row sm:items-center sm:justify-between sm:gap-section"
          style={{ background: "var(--gradient-neutral)" }}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-micro">
            <H3>Liever eerst een expert spreken?</H3>
            <p className="text-sm leading-normal text-muted-foreground">
              Plan een live online sessie van één uur en doorloop de vereisten samen met een
              PROCERTUS-expert.
            </p>
          </div>
          <Button variant="outline" className="w-full bg-background sm:w-auto sm:shrink-0">
            <HugeiconsIcon icon={Call02Icon} className="size-4" />
            Plan een expert call
          </Button>
        </Card>
      </div>
    </TrajectLayout>
  ),
};

type TriageOptionCardProps = {
  tone: "muted" | "primary";
  icon: IconSvgElement;
  title: string;
  description: string;
  bullets: readonly string[];
  cta: string;
};

function TriageOptionCard({ tone, icon, title, description, bullets, cta }: TriageOptionCardProps) {
  const isPrimary = tone === "primary";
  return (
    <Card
      className={
        isPrimary
          ? "flex h-full flex-col gap-section py-section shadow-proc-md ring-2 ring-primary/30"
          : "flex h-full flex-col gap-section py-section shadow-proc-xs"
      }
    >
      <CardHeader className="gap-component px-section">
        <div
          className={
            isPrimary
              ? "flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground"
              : "flex size-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
          }
        >
          <HugeiconsIcon icon={icon} className="size-6" />
        </div>
        <div className="flex flex-col gap-micro">
          <CardTitle className="text-heading-md">{title}</CardTitle>
          <CardDescription className="text-sm leading-normal">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-section px-section">
        <ul className="flex flex-col gap-micro">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-micro text-sm leading-normal">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="mt-0.5 size-4 shrink-0 text-success"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Button variant={isPrimary ? "default" : "outline"} className="w-full justify-between">
          {cta}
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
