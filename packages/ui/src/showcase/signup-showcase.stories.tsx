import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignupForm } from "@/components/signup-form";

/**
 * Full-viewport sign-up — uses the **signup-01** block’s form (`SignupForm`).
 */
function SignupShowcase() {
  return (
    <div className="bg-muted flex min-h-svh w-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "examples/Sign up",
  component: SignupShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Anonymous registration surface paired with **Login** — form comes from the [signup-01](https://ui.shadcn.com/blocks) block.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SignupShowcase>;

export const Default: Story = {
  render: () => <SignupShowcase />,
};
