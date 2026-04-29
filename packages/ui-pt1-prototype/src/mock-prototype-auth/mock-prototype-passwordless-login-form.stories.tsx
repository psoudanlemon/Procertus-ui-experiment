import type { Meta, StoryObj } from "@storybook/react-vite";

import type { MockPrototypeUser } from "../types/mock-prototype-user";
import { MockPrototypeAuthProvider } from "./MockPrototypeAuthProvider";
import { MockPrototypePasswordlessLoginForm } from "./MockPrototypePasswordlessLoginForm";
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
      <MockPrototypeAuthProvider users={SAMPLE_USERS}>
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
