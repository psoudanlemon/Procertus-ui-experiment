import type { Meta, StoryObj } from "@storybook/react-vite";
import { Call02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, H3 } from "@procertus-ui/ui";

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
  onActivate,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onActivate?: () => void;
}) {
  return (
    <Card
      className="relative flex cursor-pointer flex-col gap-component px-section py-section sm:flex-row sm:items-center sm:justify-between sm:gap-section"
      style={{ background: "var(--gradient-neutral)" }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-micro">
        <H3>{title}</H3>
        <p className="text-sm leading-normal text-muted-foreground">{description}</p>
      </div>
      <Button
        asChild
        variant="outline"
        className="w-full bg-background group-hover/card:rounded-tl-[4px] group-hover/card:rounded-tr-[var(--cmd-deep)] group-hover/card:rounded-br-[4px] group-hover/card:rounded-bl-[var(--cmd-deep)] group-hover/card:bg-muted group-hover/card:text-foreground sm:w-auto sm:shrink-0"
      >
        <button
          type="button"
          onClick={onActivate}
          className="before:absolute before:inset-0 before:content-['']"
        >
          <HugeiconsIcon icon={Call02Icon} className="size-4" />
          {buttonLabel}
        </button>
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
          "Side-route nudge composed of `Card` + `Button` on a `var(--gradient-neutral)` wash. The whole card is the click target via a `before:absolute before:inset-0` stretched link, and the button mirrors its outline-hover state on `group-hover/card:` so the entire surface reacts as one. Currently inlined in `WegwijzerPage` and `TriagePage` with identical copy. Decide: extract to a `CalloutBanner` primitive, or keep inline.",
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
