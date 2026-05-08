import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight02Icon, Call02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card } from "@procertus-ui/ui";

/**
 * **Proposal — not yet a primitive.**
 *
 * Inline pattern duplicated in `WegwijzerPage` and `TriagePage` to nudge
 * users toward an expert call as a side-route from the main flow. Same
 * brand-tinted surface, identical copy in both pages today.
 *
 * Story-only: visualises the composition so we can decide whether to
 * promote it into a real `CalloutBanner` primitive in `ui-lib`, or to
 * leave each occurrence as an inline `Card` composition.
 */
function CalloutBannerPattern({
  title,
  description,
  buttonLabel,
}: {
  title: string;
  description: string;
  buttonLabel: string;
}) {
  return (
    <Card className="flex flex-col gap-component border border-primary/20 bg-primary/5 px-section py-section sm:flex-row sm:items-center sm:justify-between sm:gap-section">
      <div className="flex min-w-0 flex-1 flex-col gap-micro">
        <p className="text-heading-sm font-semibold">{title}</p>
        <p className="text-sm leading-normal text-muted-foreground">{description}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full bg-background sm:w-auto sm:shrink-0"
      >
        <HugeiconsIcon icon={Call02Icon} className="size-4" />
        {buttonLabel}
        <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
      </Button>
    </Card>
  );
}

const meta = {
  title: "custom-components/Catalogue/CalloutBanner",
  component: CalloutBannerPattern,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Side-route nudge composed of `Card` + `Button` with brand-tinted chrome (`border-primary/20 bg-primary/5`). Currently inlined in `WegwijzerPage` and `TriagePage` with identical copy. Decide: extract to a `CalloutBanner` primitive, or keep inline.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CalloutBannerPattern>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExpertCall: Story = {
  args: {
    title: "Liever eerst een expert spreken?",
    description:
      "Plan een live online sessie van één uur en doorloop de vereisten samen met een PROCERTUS-expert.",
    buttonLabel: "Plan een expert call",
  },
};
