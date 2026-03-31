import type { Meta, StoryObj } from "@storybook/react-vite";

import { SidebarProvider } from "@/components/ui/sidebar";

import { ManagementHeader } from "./ManagementHeader";

const meta = {
  title: "Management Tool/Application Shell/Header",
  component: ManagementHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
    },
  },
  args: {
    showNavigation: false,
    breadcrumbs: [
      { label: "Dashboard", href: "#" },
      { label: "Projects", href: "#" },
      { label: "Procertus", href: "#" },
      { label: "Settings" },
    ],
    canGoBack: true,
    canGoForward: false,
    user: {
      name: "🍋",
      email: "somone@lemon.be",
      role: "Platform administrator",
    },
    version: "Webapp: V10.00.00  Api: V10.00.00",
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="flex h-svh w-full flex-col bg-sidebar">
          <Story />
          <div className="mt-1 ml-3 mr-4 flex-1 rounded-t-xl bg-background p-6">
            <div className="min-h-[50vh] rounded-xl border border-dashed" />
          </div>
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof ManagementHeader> as Meta<typeof ManagementHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Header with sidebar toggle, breadcrumbs, and avatar dropdown.
 */
export const Default: Story = {};

/**
 * Header with a centered search bar (⌘K to focus).
 */
export const WithSearch: Story = {
  args: {
    showSearch: true,
  },
};
