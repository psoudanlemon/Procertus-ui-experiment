import type { Meta, StoryObj } from "@storybook/react-vite";

import { OnboardingContextField } from "./onboarding-shared-fields";

const meta = {
  title: "Onboarding/Presentational/Context field",
  component: OnboardingContextField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Single labeled field row reused on customer and company steps.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    id: { control: false },
  },
} satisfies Meta<typeof OnboardingContextField>;

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

export const WithHint: StoryObj<typeof meta> = {
  name: "With description",
  args: {
    id: "organizationName",
    label: "Bedrijfsnaam",
    value: "Voorbeeld BV",
    onChange: () => {},
    placeholder: "Zoals geregistreerd",
    description: "Mock hint from lookup — clears when the user edits the field.",
  },
};
