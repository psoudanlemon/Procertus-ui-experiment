/**
 * Presentational priority chip for tasks — UI only (minimal template).
 * Maps priority levels to `Badge` variants from `@procertus-ui/ui`.
 */
import { cn } from "@/lib/utils";
import { Badge } from "@procertus-ui/ui";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

const defaultLabel: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const variantForPriority: Record<
  TaskPriority,
  "secondary" | "outline" | "default" | "destructive"
> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  urgent: "destructive",
};

export type TaskPriorityBadgeProps = {
  className?: string;
  priority: TaskPriority;
  /** Overrides the default label for the level */
  label?: string;
};

export function TaskPriorityBadge({ className, priority, label }: TaskPriorityBadgeProps) {
  return (
    <Badge variant={variantForPriority[priority]} className={cn("shrink-0", className)}>
      {label ?? defaultLabel[priority]}
    </Badge>
  );
}
