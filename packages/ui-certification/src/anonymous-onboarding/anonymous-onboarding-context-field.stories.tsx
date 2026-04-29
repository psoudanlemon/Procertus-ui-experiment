import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnonymousOnboardingContextField } from "./anonymous-onboarding-flow-view";

const meta = {
  title: "Anonymous onboarding/AnonymousOnboardingContextField",
  component: AnonymousOnboardingContextField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Single labeled field row used in customer and company steps. Exported from `anonymous-onboarding-flow-view.tsx` for Storybook and reuse.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    id: { control: false },
  },
} satisfies Meta<typeof AnonymousOnboardingContextField>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    id: "representativeEmail",
    label: "E-mail",
    value: "alex@voorbeeld.nl",
    onChange: () => {},
  },
};

export const ReadOnly: StoryObj<typeof meta> = {
  args: {
    id: "vatNumber",
    label: "Btw- of ondernemingsnummer",
    value: "BE0123456789",
    onChange: () => {},
    readOnly: true,
  },
};

export const WithDescription: StoryObj<typeof meta> = {
  args: {
    id: "organizationName",
    label: "Bedrijfsnaam",
    value: "Voorbeeld BV",
    onChange: () => {},
    placeholder: "Zoals geregistreerd",
    description: "Mock hint from lookup — clears when the user edits the field.",
  },
};
