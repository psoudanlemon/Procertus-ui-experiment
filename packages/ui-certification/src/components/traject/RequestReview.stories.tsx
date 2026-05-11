import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect, useMemo } from "react";

import { CertificationRequestWizard } from "../certification-request-wizard";
import {
  storyCertificationWizardProps,
  storyCustomerContext,
  storyOnboardingDrafts,
} from "../../onboarding/onboarding-story-fixtures";
import { ProcertusCategorizationProvider } from "../../ProcertusCategorizationContext";
import { TrajectLayout } from "./TrajectLayout";

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
  title: "Traject configuration/Layout/Aanvraag controleren",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
      description: {
        component:
          "Aanvraag controleren: wizard geseed met conceptaanvragen, geopend op de review-stap zodat de samenvatting met regelset-documenten meteen zichtbaar is.",
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
    title: "Controleer je aanvraagpakket",
    children: null,
    description:
      "Bekijk de samengestelde conceptaanvragen en de bijhorende regelset-documenten voordat je doorgaat met registratie.",
  },
  render: (args) => <RequestReviewStoryBody args={args} />,
};

function RequestReviewStoryBody({ args }: { args: React.ComponentProps<typeof TrajectLayout> }) {
  const wizardProps = useMemo(
    () => ({
      ...storyCertificationWizardProps(storyCustomerContext()),
      initialDrafts: storyOnboardingDrafts,
      initialStep: "review" as const,
    }),
    [],
  );
  return (
    <ProcertusCategorizationProvider>
      <TrajectLayout {...args}>
        <CertificationRequestWizard
          {...wizardProps}
          sessionId="storybook-traject-layout-request-review"
          stepLayoutChromeStyle="bare"
        />
      </TrajectLayout>
    </ProcertusCategorizationProvider>
  );
}
