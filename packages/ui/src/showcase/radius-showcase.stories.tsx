import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BarChartIcon,
  BookOpen01Icon,
  Database01Icon,
  HelpCircleIcon,
  CompassIcon,
  AiNetworkIcon,
  ColorPickerIcon,
  Setting06Icon,
  SecurityCheckIcon,
  UserGroupIcon,
  FlashIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ManagementAppShell } from "../../../ui-lib/src/management-interface/app-shell/ManagementAppShell";
import type { Workspace, NavItem, NavGroup } from "@/components/app-sidebar";

/* ---------------------------------------------------------------------------
 * Shell Configuration
 * ------------------------------------------------------------------------- */

const procertusLogo = (
  <img
    src="/logomark.svg"
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
    { title: "Certifications", url: "#", icon: SecurityCheckIcon },
    { title: "Candidates", url: "#", icon: UserGroupIcon },
    { title: "Roadmap", url: "#", icon: CompassIcon },
  ] as NavItem[],
  navGroups: [
    {
      label: "Verification",
      items: [
        {
          title: "Analytics",
          url: "#",
          icon: BarChartIcon,
          isActive: true,
          items: [
            { title: "Overview", url: "#" },
            { title: "Reports", url: "#", isActive: true },
          ],
        },
        { title: "Design system", url: "#", icon: ColorPickerIcon },
      ],
    },
    {
      label: "Platform",
      items: [
        { title: "Domain browser", url: "#", icon: Database01Icon },
        { title: "Architecture", url: "#", icon: AiNetworkIcon },
        { title: "Events", url: "#", icon: FlashIcon },
        { title: "Docs", url: "#", icon: BookOpen01Icon },
      ],
    },
  ] as NavGroup[],
  secondaryItems: [
    { title: "Settings", url: "#", icon: Setting06Icon },
    { title: "Help", url: "#", icon: HelpCircleIcon },
  ] as NavItem[],
};

const headerProps = {
  showNavigation: false,
  breadcrumbs: [
    { label: "Dashboard", href: "#" },
    { label: "Verification", href: "#" },
    { label: "Applied guidelines" },
  ],
  canGoBack: true,
  canGoForward: false,
  user: {
    name: "Radius theatre",
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
        <Button variant="default">Confirm action</Button>
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
  title: "Applied guidelines/Radius",
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
