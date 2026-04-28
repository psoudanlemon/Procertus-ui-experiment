import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppHeader, type AppHeaderProps } from "@/components/app-header";
import {
  PublicRegistryHeader,
  type PublicRegistryHeaderProps,
} from "@/components/public-header";
import { SidebarProvider } from "@/components/ui/sidebar";

const authenticatedAppArgs: AppHeaderProps = {
  showNavigation: false,
  breadcrumbs: [
    { label: "Dashboard", href: "#" },
    { label: "Projects", href: "#" },
    { label: "PROCERTUS", href: "#" },
    { label: "Settings" },
  ],
  canGoBack: true,
  canGoForward: false,
  user: {
    name: "Some lemoneer",
    email: "somone@lemon.be",
    role: "Platform administrator",
    avatarFallback: "🍋",
  },
  version: "Webapp: V10.00.00  Api: V10.00.00",
};

const publicRegistryArgs: PublicRegistryHeaderProps = {
  navLinks: [
    { title: "Over", url: "#" },
    { title: "Contact", url: "#" },
  ],
  languages: [
    { code: "nl", label: "Nederlands", flag: "\u{1F1F3}\u{1F1F1}" },
    { code: "fr", label: "Français", flag: "\u{1F1EB}\u{1F1F7}" },
    { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
  ],
  activeLanguage: "nl",
};

function AuthenticatedAppFrame({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-svh w-full flex-col bg-sidebar">
        {children}
        <div className="mt-1 ml-3 mr-4 flex-1 rounded-t-xl bg-background p-6">
          <div className="min-h-[50vh] rounded-xl border border-dashed" />
        </div>
      </div>
    </SidebarProvider>
  );
}

function PublicRegistryFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {children}
      <div className="flex-1 px-boundary py-region">
        <div className="min-h-[50vh] rounded-xl border border-dashed" />
      </div>
    </div>
  );
}

const meta = {
  title: "components/Header",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Header with sidebar toggle, breadcrumbs, and avatar dropdown.
 */
export const Default: Story = {
  render: () => (
    <AuthenticatedAppFrame>
      <AppHeader {...authenticatedAppArgs} />
    </AuthenticatedAppFrame>
  ),
};

/**
 * Adds a centered search bar (⌘K to focus) to the default header.
 */
export const WithSearch: Story = {
  name: "With search",
  render: () => (
    <AuthenticatedAppFrame>
      <AppHeader {...authenticatedAppArgs} showSearch />
    </AuthenticatedAppFrame>
  ),
};

/**
 * Stripped-down header: navigation menu, language selector, and a
 * login button. No sidebar, no breadcrumbs.
 */
export const Simple: Story = {
  render: () => (
    <PublicRegistryFrame>
      <PublicRegistryHeader {...publicRegistryArgs} />
    </PublicRegistryFrame>
  ),
};

/**
 * Same simple header, but signed in — the login button is replaced by
 * the avatar dropdown.
 */
export const SimpleSignedIn: Story = {
  name: "Simple signed in",
  render: () => (
    <PublicRegistryFrame>
      <PublicRegistryHeader
        {...publicRegistryArgs}
        user={{
          name: "Some lemoneer",
          email: "somone@lemon.be",
          avatarFallback: "🍋",
        }}
      />
    </PublicRegistryFrame>
  ),
};
