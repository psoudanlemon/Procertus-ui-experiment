import { Button, Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle } from "@procertus-ui/ui";
import { useNavigate } from "react-router-dom";

function LayoutGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-6"
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

/**
 * Signed-in landing: **`ManagementAppShell`** is active — this region is an intentional empty workspace until Task E.
 */
export function AuthenticatedHomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Home</h1>
      <Empty className="min-h-[320px] w-full max-w-2xl border-border">
        <EmptyIcon>
          <LayoutGlyph />
        </EmptyIcon>
        <EmptyTitle>Workspace is empty</EmptyTitle>
        <EmptyDescription>
          You are inside the authenticated management shell: collapsible sidebar, workspace header, and header
          breadcrumbs match the layout used in{" "}
          <span className="font-medium text-foreground">@procertus-ui/ui-lib</span> authentication and management
          stories. There is no tenant data wired in this prototype yet.
        </EmptyDescription>
        <div className="max-w-lg text-left text-sm leading-relaxed text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">What you can try</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Open <span className="font-medium text-foreground">Design system</span> from the sidebar to
              preview tokens and showcase content in the main panel.
            </li>
            <li>
              Use <span className="font-medium text-foreground">Log out</span> in the avatar menu (top right) to
              return to the guest AuthLayout sign-in screen.
            </li>
            <li>
              Resize the viewport to confirm the sidebar becomes a mobile drawer (toggle with the menu control in
              the header).
            </li>
          </ul>
        </div>
        <EmptyActions>
          <Button type="button" onClick={() => navigate("/app/design-system")}>
            Open design system
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/app")}>
            Refresh home
          </Button>
        </EmptyActions>
      </Empty>
    </div>
  );
}
