/**
 * Workflow state as a Badge — preset labels and variants; optional override label.
 */
import { cn } from "@/lib/utils";
import { Badge } from "@procertus-ui/ui";

export type WorkflowStateBadgePreset =
  | "draft"
  | "submitted"
  | "in_review"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "blocked"
  | "cancelled";

const presetCopy: Record<
  WorkflowStateBadgePreset,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "outline" },
  in_review: { label: "In review", variant: "default" },
  pending_approval: { label: "Pending approval", variant: "outline" },
  approved: { label: "Approved", variant: "secondary" },
  rejected: { label: "Rejected", variant: "destructive" },
  blocked: { label: "Blocked", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

export type WorkflowStateBadgeProps = {
  className?: string;
  preset: WorkflowStateBadgePreset;
  /** Overrides the default label for the preset */
  label?: string;
};

export function WorkflowStateBadge({ className, preset, label }: WorkflowStateBadgeProps) {
  const { label: defaultLabel, variant } = presetCopy[preset];
  return (
    <Badge variant={variant} className={cn(className)}>
      {label ?? defaultLabel}
    </Badge>
  );
}
