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
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  cn,
  H2,
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
    title: "Wat voor aanvraag wilt u graag indienen?",
    children: null,
    description:
      "Kies een vrijblijvende informatieaanvraag voor een prijsopgave en advies, of start meteen het formele dossier zodat de ontvankelijkheidsbeoordeling kan beginnen.",
    bodyGap: "section",
  },
  render: (args) => (
    <TrajectLayout
      {...args}
      actionBar={<TrajectStoryFooter mode="decision" onCancel={noop} onBack={noop} />}
    >
      <div className="flex flex-col gap-region">
        <div className="grid grid-cols-1 gap-region md:grid-cols-2">
          <TriageOptionCard
            variant="faded"
            icon={Mail01Icon}
            title="Informatieve aanvraag"
            description="Voor wie eerst wil afstemmen."
            bullets={[
              "Prijsopgave en advies op maat",
              "Geen verplichting tot opstart",
              "Reactie binnen enkele werkdagen",
              "Live sessie mogelijk tijdens het invullen",
            ]}
            cta="Start aanvraag"
          />
          <TriageOptionCard
            variant="elevated"
            icon={FilePlusIcon}
            title="Formele aanvraag"
            description="Voor wie klaar is om in te dienen."
            bullets={[
              "Volledige aanvraagwizard",
              "Ontvankelijkheidsbeoordeling start meteen",
              "Dossier wordt actief opgevolgd",
              "Account pas nodig bij indiening",
            ]}
            cta="Start aanvraag"
          />
        </div>
        <Card
          asChild
          interactive
          className="relative px-section py-section"
          style={{ background: "var(--gradient-neutral)" }}
        >
          <button
            type="button"
            onClick={noop}
            className="flex flex-col gap-component sm:flex-row sm:items-center sm:justify-between sm:gap-section"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-micro">
              <H3>Liever eerst een expert spreken?</H3>
              <p className="text-sm leading-normal text-muted-foreground">
                Plan een live online sessie van één uur en doorloop de vereisten samen met een
                PROCERTUS-expert.
              </p>
            </div>
            <span
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full bg-background sm:w-auto sm:shrink-0",
                "group-hover/card:bg-muted group-hover/card:text-foreground group-hover/card:rounded-tl-[4px] group-hover/card:rounded-tr-[var(--cmd-deep)] group-hover/card:rounded-br-[4px] group-hover/card:rounded-bl-[var(--cmd-deep)]",
              )}
              aria-hidden="true"
            >
              <HugeiconsIcon icon={Call02Icon} className="size-4" />
              Plan een gesprek
            </span>
          </button>
        </Card>
      </div>
    </TrajectLayout>
  ),
};

type TriageOptionCardProps = {
  variant: "elevated" | "faded";
  icon: IconSvgElement;
  title: string;
  description: string;
  bullets: readonly string[];
  cta: string;
  onSelect?: () => void;
};

function TriageOptionCard({
  variant,
  icon,
  title,
  description,
  bullets,
  cta,
  onSelect,
}: TriageOptionCardProps) {
  const isElevated = variant === "elevated";
  return (
    <Card
      asChild
      interactive
      variant={variant}
      className="h-full gap-section py-section"
    >
      <button type="button" onClick={onSelect}>
        <CardHeader className="!flex flex-row items-start gap-section px-section">
          <div
            className={
              isElevated
                ? "flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
                : "flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
            }
          >
            <HugeiconsIcon icon={icon} className="size-6" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <H2>{title}</H2>
            <CardDescription className="text-sm leading-normal">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-section px-section">
          <ul className="flex flex-col gap-micro">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-micro text-sm leading-normal">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <span
            className={cn(
              buttonVariants({ variant: isElevated ? "default" : "outline" }),
              "w-full justify-between",
              isElevated
                ? "group-hover/card:bg-primary/80 group-hover/card:rounded-tl-[var(--cmd-deep)] group-hover/card:rounded-tr-[4px] group-hover/card:rounded-br-[var(--cmd-deep)] group-hover/card:rounded-bl-[4px]"
                : "group-hover/card:bg-muted group-hover/card:text-foreground group-hover/card:rounded-tl-[4px] group-hover/card:rounded-tr-[var(--cmd-deep)] group-hover/card:rounded-br-[4px] group-hover/card:rounded-bl-[var(--cmd-deep)]",
            )}
            aria-hidden="true"
          >
            {cta}
            <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
          </span>
        </CardContent>
      </button>
    </Card>
  );
}
