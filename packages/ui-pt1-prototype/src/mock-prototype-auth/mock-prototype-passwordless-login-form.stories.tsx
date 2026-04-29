import type { Meta, StoryObj } from "@storybook/react-vite";

import { MOCK_PROTOTYPE_USERS } from "../data/mock-prototype-users";
import { MockPrototypeAuthProvider } from "./MockPrototypeAuthProvider";
import { MockPrototypePasswordlessLoginForm } from "./MockPrototypePasswordlessLoginForm";
import { useMockPrototypeAuth } from "./useMockPrototypeAuth";

function SessionReadout() {
  const { session, isAuthenticated } = useMockPrototypeAuth();
  if (!isAuthenticated || !session) {
    return <p className="text-muted-foreground text-sm">Not signed in.</p>;
  }
  const { user } = session;
  return (
    <div className="text-muted-foreground max-w-md space-y-1 border-t border-border pt-4 text-sm">
      <p>
        Signed in as{" "}
        <span className="text-foreground font-medium">{user.displayName}</span> ({user.email})
      </p>
    </div>
  );
}

const meta: Meta<typeof MockPrototypePasswordlessLoginForm> = {
  title: "pt1-prototype/MockPrototypePasswordlessLoginForm",
  component: MockPrototypePasswordlessLoginForm,
  decorators: [
    (Story) => (
      <MockPrototypeAuthProvider users={[...MOCK_PROTOTYPE_USERS]}>
        <div className="flex w-[min(100%,24rem)] flex-col gap-6">
          <Story />
          <SessionReadout />
        </div>
      </MockPrototypeAuthProvider>
    ),
  ],
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof MockPrototypePasswordlessLoginForm>;

export const Default: Story = {
  args: {
    submitLabel: "Sign in",
    onLoggedIn: () => {},
  },
};
