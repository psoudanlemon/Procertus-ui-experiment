import type { Meta, StoryObj } from "@storybook/react-vite";

import { storyEmptyCompanyFieldKeySet } from "../../../onboarding/onboarding-story-fixtures";
import type { CompanyFormFieldKey } from "../../../onboarding/lib/vatPrototypePresets";

import { OnboardingCompanyPrefillSkeleton } from "./onboarding-shared-fields";

const prefilled = new Set<CompanyFormFieldKey>(["organizationName", "country", "addressStreet"]);
const resolved = new Set<CompanyFormFieldKey>(["organizationName", "country"]);

const meta = {
  title: "Onboarding/Presentational/Prefill skeleton",
  component: OnboardingCompanyPrefillSkeleton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Skeleton grid during mock company lookup (prefilled vs resolved fields).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingCompanyPrefillSkeleton>;

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

export const Comparison: StoryObj<typeof meta> = {
  name: "Comparison (stacked)",
  render: () => (
    <div className="flex max-w-3xl flex-col gap-10">
      <section className="space-y-2">
        <p className="text-sm font-medium text-foreground">Lookup started</p>
        <OnboardingCompanyPrefillSkeleton
          prefilledKeys={storyEmptyCompanyFieldKeySet}
          resolvedKeys={storyEmptyCompanyFieldKeySet}
        />
      </section>
      <section className="space-y-2">
        <p className="text-sm font-medium text-foreground">Mid simulation</p>
        <OnboardingCompanyPrefillSkeleton prefilledKeys={prefilled} resolvedKeys={resolved} />
      </section>
    </div>
  ),
};
