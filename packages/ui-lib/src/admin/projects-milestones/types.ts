/**
 * Shared props-only types for projects & milestones UI (no data layer).
 */

export type MilestoneTimelineSegmentStatus = "complete" | "current" | "upcoming" | "at-risk";

export type MilestoneTimelineSegment = {
  id: string;
  title: string;
  /** Short label under the title (e.g. date or range). */
  caption?: string;
  status: MilestoneTimelineSegmentStatus;
  /** When set, a compact deadline chip is shown on the node. */
  deadlineLabel?: string;
  deadlineTone?: "default" | "muted" | "warning" | "critical";
};
