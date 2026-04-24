import type { Meta, StoryObj } from "@storybook/react-vite";

import type { MockPrototypeUser } from "../types/mock-prototype-user";
import { MockPrototypeAuthProvider } from "./MockPrototypeAuthProvider";
import { MockPrototypeUserSelect } from "./MockPrototypeUserSelect";
import { useMockPrototypeAuth } from "./useMockPrototypeAuth";

const SAMPLE_USERS: MockPrototypeUser[] = [
  {
    id: "u-1",
    displayName: "Ava Vermeer",
    email: "ava@procertus.example",
    role: "Certification lead",
    homeOrganization: { id: "org-procertus", name: "PROCERTUS" },
    representedOrganization: { id: "org-northwind", name: "Northwind Foods" },
  },
  {
    id: "u-2",
    displayName: "Ben Okonkwo",
    email: "ben@clientco.example",
    role: "Quality manager",
    homeOrganization: { id: "org-clientco", name: "ClientCo Manufacturing" },
    representedOrganization: { id: "org-clientco", name: "ClientCo Manufacturing" },
  },
];

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
      <MockPrototypeAuthProvider users={SAMPLE_USERS}>
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
