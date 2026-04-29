import type { Meta, StoryObj } from "@storybook/react-vite";

import { MOCK_PROTOTYPE_USERS } from "../data/mock-prototype-users";
import { MockPrototypeAuthProvider } from "./MockPrototypeAuthProvider";
import { MockPrototypeUserSelect } from "./MockPrototypeUserSelect";
import { useMockPrototypeAuth } from "./useMockPrototypeAuth";

function SessionReadout() {
  const { session, isAuthenticated } = useMockPrototypeAuth();
  if (!isAuthenticated || !session) {
    return <p className="text-muted-foreground text-sm">Not signed in.</p>;
  }
  const { user } = session;
  return (
    <div className="text-muted-foreground max-w-md space-y-1 text-sm">
      <p>
        <span className="text-foreground font-medium">{user.displayName}</span> ({user.email})
      </p>
      <p>Home org: {user.homeOrganization.name}</p>
      <p>Represents: {user.representedOrganization.name}</p>
    </div>
  );
}

const meta: Meta<typeof MockPrototypeUserSelect> = {
  title: "pt1-prototype/MockPrototypeUserSelect",
  component: MockPrototypeUserSelect,
  decorators: [
    (Story) => (
      <MockPrototypeAuthProvider users={[...MOCK_PROTOTYPE_USERS]}>
        <div className="flex w-96 flex-col gap-4">
          <Story />
          <SessionReadout />
        </div>
      </MockPrototypeAuthProvider>
    ),
  ],
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof MockPrototypeUserSelect>;

export const Default: Story = {
  render: () => <MockPrototypeUserSelect className="w-full" />,
};
