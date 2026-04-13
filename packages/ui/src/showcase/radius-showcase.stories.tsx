import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BarChart3Icon,
  BookOpenIcon,
  DatabaseIcon,
  HelpCircleIcon,
  MapIcon,
  NetworkIcon,
  PaletteIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ManagementAppShell } from "../../../ui-lib/src/management-interface/app-shell/ManagementAppShell";
import type {
  Workspace,
  NavItem,
  NavGroup,
} from "../../../ui-lib/src/management-interface/app-shell/ManagementSidebar";

/* ---------------------------------------------------------------------------
 * Shell Configuration
 * ------------------------------------------------------------------------- */

const procertusLogo = (
  <img
    src="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F1F5F9'/%3E%3Cpath d='M17.4262 21.7754L13.9269 18.6647C12.8241 17.6857 12.7265 15.999 13.7055 14.8963L13.7858 14.8051L18.2489 18.7711L24.0796 12.109C25.0846 10.9607 26.8321 10.8435 27.9804 11.8485L28 11.8659L19.4406 21.6495C18.9218 22.2422 18.0188 22.3008 17.4283 21.7754H17.4262Z' fill='%2371D2C1'/%3E%3Cpath d='M14.5738 10.2246L18.0731 13.3353C19.1758 14.3143 19.2735 16.001 18.2945 17.1038L18.2142 17.1949L13.7511 13.2289L7.92041 19.891C6.91534 21.0394 5.16787 21.1566 4.01954 20.1515L4 20.1342L12.5593 10.3505C13.0781 9.75789 13.9812 9.69928 14.5716 10.2246H14.5738Z' fill='%23076293'/%3E%3C/svg%3E"
    alt="PROCERTUS"
    className="size-full rounded-sm"
  />
);

const sidebarProps = {
  workspaces: [
    {
      id: "1",
      name: "PROCERTUS",
      logo: procertusLogo,
      plan: "Certification platform",
    },
  ] as Workspace[],
  activeWorkspaceId: "1",
  showSearch: false,
  navItems: [
    { title: "Certifications", url: "#", icon: ShieldCheckIcon },
    { title: "Candidates", url: "#", icon: UsersIcon },
    { title: "Roadmap", url: "#", icon: MapIcon },
  ] as NavItem[],
  navGroups: [
    {
      label: "Verification",
      items: [
        {
          title: "Analytics",
          url: "#",
          icon: BarChart3Icon,
          isActive: true,
          items: [
            { title: "Overview", url: "#" },
            { title: "Reports", url: "#", isActive: true },
          ],
        },
        { title: "Design System", url: "#", icon: PaletteIcon },
      ],
    },
    {
      label: "Platform",
      items: [
        { title: "Domain Browser", url: "#", icon: DatabaseIcon },
        { title: "Architecture", url: "#", icon: NetworkIcon },
        { title: "Events", url: "#", icon: ZapIcon },
        { title: "Docs", url: "#", icon: BookOpenIcon },
      ],
    },
  ] as NavGroup[],
  secondaryItems: [
    { title: "Settings", url: "#", icon: SettingsIcon },
    { title: "Help", url: "#", icon: HelpCircleIcon },
  ] as NavItem[],
};

const headerProps = {
  showNavigation: false,
  breadcrumbs: [
    { label: "Dashboard", href: "#" },
    { label: "Verification", href: "#" },
    { label: "Applied Guidelines" },
  ],
  canGoBack: true,
  canGoForward: false,
  user: {
    name: "Radius Theatre",
    email: "geometry@procertus.dev",
    role: "Design system",
  },
  version: "Geometry of Trust v1.0",
};

/* ---------------------------------------------------------------------------
 * Verification Modal (skeleton content, real buttons)
 * ------------------------------------------------------------------------- */

function VerificationModal() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-proc-md">
      {/* Header */}
      <div className="border-b border-border p-8">
        <Skeleton className="mb-4 h-6 w-56" />
        <Skeleton className="mb-2 h-3 w-80" />
        <Skeleton className="h-3 w-64" />
      </div>

      {/* Body: skeleton form fields */}
      <div className="p-8">
        {/* Field 1 */}
        <Skeleton className="h-2.5 w-24" />
        <div className="mt-3 mb-10">
          <Skeleton className="h-10 w-full rounded-[8px]" />
        </div>
        {/* Field 2 */}
        <Skeleton className="h-2.5 w-32" />
        <div className="mt-3 mb-10">
          <Skeleton className="h-10 w-full rounded-[8px]" />
        </div>
        {/* Field 3: wider textarea */}
        <Skeleton className="h-2.5 w-20" />
        <div className="mt-3">
          <Skeleton className="h-24 w-full rounded-[8px]" />
        </div>
      </div>

      {/* Footer: The Kinetic Pair */}
      <div className="flex items-center justify-end gap-3 border-t border-border p-8">
        {/* Reciprocal Curve: TR/BL deep on hover (mirrored, supporting action) */}
        <Button variant="outline">Cancel</Button>
        {/* Forward Curve: TL/BR deep on hover (default, forward-moving action) */}
        <Button variant="default">Confirm Action</Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Story
 * ------------------------------------------------------------------------- */

/**
 * **Radius Theatre: Geometry of Trust**
 *
 * A visual proof-of-concept demonstrating how Procertus buttons encode
 * directional intent through asymmetric border radii.
 *
 * **The Kinetic Pair** in the modal footer:
 * - *Cancel* (Outline): Reciprocal Curve, TR/BL deep radius on hover.
 *   The mirrored geometry signals a backward or supporting action.
 * - *Confirm Action* (Primary): Forward Curve, TL/BR deep radius on hover.
 *   The forward geometry signals progression and commitment.
 *
 * Together they form a **Symmetrical Bracket** that echoes the mirrored
 * checkmarks in the Procertus logotype.
 *
 * **Interaction model (Command Click):**
 * - Hover: 300ms ease-out transition to the Signature Radius.
 * - Active: 2px downward translation + Beacon Pulse
 *   (Teal-400 for Primary, defined via `command-pulse` keyframe).
 *
 * This is not a functional form. It is a geometry showcase.
 */
const meta = {
  title: "Applied Guidelines/Radius",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 720 },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The complete Radius Theatre: a verification modal centered inside the
 * Procertus application shell. Skeleton content ensures the eye is drawn
 * exclusively to border radii and button shapes.
 *
 * Hover the button pair to see the Symmetrical Bracket form.
 * Click to trigger the Command Confirm: mechanical travel + Beacon Pulse.
 */
export const Default: Story = {
  render: () => (
    <ManagementAppShell sidebar={sidebarProps} header={headerProps}>
      <VerificationModal />
    </ManagementAppShell>
  ),
};
