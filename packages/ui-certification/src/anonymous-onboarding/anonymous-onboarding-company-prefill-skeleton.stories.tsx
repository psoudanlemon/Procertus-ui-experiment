import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnonymousOnboardingCompanyPrefillSkeleton } from "./anonymous-onboarding-flow-view";
import { storyEmptyCompanyFieldKeySet } from "./anonymous-onboarding-story-fixtures";
import type { CompanyFormFieldKey } from "./lib/vatPrototypePresets";

const prefilled = new Set<CompanyFormFieldKey>(["organizationName", "country", "addressStreet"]);
const resolved = new Set<CompanyFormFieldKey>(["organizationName", "country"]);

const meta = {
  title: "Anonymous onboarding/AnonymousOnboardingCompanyPrefillSkeleton",
  component: AnonymousOnboardingCompanyPrefillSkeleton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Skeleton grid during mock **company lookup**: shows which fields are being prefilled vs. resolved. Exported from `anonymous-onboarding-flow-view.tsx`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AnonymousOnboardingCompanyPrefillSkeleton>;

export default meta;

export const Empty: StoryObj<typeof meta> = {
  args: {
    prefilledKeys: storyEmptyCompanyFieldKeySet,
    resolvedKeys: storyEmptyCompanyFieldKeySet,
  },
};

export const PartiallyFilled: StoryObj<typeof meta> = {
  args: {
    prefilledKeys: prefilled,
    resolvedKeys: resolved,
  },
};

export const AllResolvedVisual: StoryObj<typeof meta> = {
  name: "Comparison (stacked)",
  render: () => (
    <div className="flex max-w-3xl flex-col gap-10">
      <section className="space-y-2">
        <p className="text-sm font-medium text-foreground">Lookup started</p>
        <AnonymousOnboardingCompanyPrefillSkeleton
          prefilledKeys={storyEmptyCompanyFieldKeySet}
          resolvedKeys={storyEmptyCompanyFieldKeySet}
        />
      </section>
      <section className="space-y-2">
        <p className="text-sm font-medium text-foreground">Mid simulation</p>
        <AnonymousOnboardingCompanyPrefillSkeleton
          prefilledKeys={prefilled}
          resolvedKeys={resolved}
        />
      </section>
    </div>
  ),
};
