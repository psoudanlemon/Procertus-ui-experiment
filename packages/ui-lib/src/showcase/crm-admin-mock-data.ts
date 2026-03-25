/**
 * Shared mock data for CRM / ERP admin showcase stories.
 * Single source of truth so cross-module UI references the same org, people, and records.
 */

import type { MilestoneTimelineSegment } from "../admin/projects-milestones/types";
import type { WorkflowStepperStep } from "../admin/workflows/workflow-stepper/WorkflowStepper";
import type { WorkflowCommentThreadItem } from "../admin/workflows/workflow-comment-thread/WorkflowCommentThread";
import type { ApprovalChainListMember } from "../admin/workflows/approval-chain-list/ApprovalChainList";
import type { HorizontalTimelineSegment, HorizontalTimelineTick } from "../admin/timelines/horizontal-timeline/HorizontalTimeline";
import type { PlanningWindowSegment } from "../admin/timelines/planning-window-bar/PlanningWindowBar";
import type { ResourceLoadRow } from "../admin/timelines/resource-load-strip/ResourceLoadStrip";
import type {
  AvailabilityCellTone,
  AvailabilityGridRow,
} from "../admin/calendar-scheduling/availability-grid/AvailabilityGrid";
import type { TaskPriority } from "../admin/tasks/task-priority-badge/TaskPriorityBadge";

export const crmPeople = {
  alex: { name: "Alex Morgan", initials: "AM" },
  jordan: { name: "Jordan Lee", initials: "JL" },
  sam: { name: "Sam Rivera", initials: "SR" },
  taylor: { name: "Taylor Chen", initials: "TC" },
  riley: { name: "Riley Patel", initials: "RP" },
} as const;

export type MeetingMock = {
  id: string;
  title: string;
  subtitle: string;
  meetingTypeLabel: string;
  status: { label: string; variant?: "default" | "secondary" | "outline" | "destructive" };
  avatarFallback: string;
};

export const crmMeetings: MeetingMock[] = [
  {
    id: "m1",
    title: "Q1 renewal — Acme Corp",
    subtitle: "Today · 10:00–10:45 · Google Meet",
    meetingTypeLabel: "Customer",
    status: { label: "Confirmed", variant: "secondary" },
    avatarFallback: crmPeople.alex.initials,
  },
  {
    id: "m2",
    title: "Sprint planning · Platform",
    subtitle: "Tomorrow · 14:00–15:00 · Room Berlin",
    meetingTypeLabel: "Internal",
    status: { label: "Tentative", variant: "outline" },
    avatarFallback: crmPeople.jordan.initials,
  },
  {
    id: "m3",
    title: "Executive steering",
    subtitle: "Fri · 09:00–09:30",
    meetingTypeLabel: "1:1",
    status: { label: "Cancelled", variant: "destructive" },
    avatarFallback: crmPeople.sam.initials,
  },
];

export type TaskMock = {
  id: string;
  title: string;
  subtitle?: string;
  priority?: TaskPriority;
  status?: { label: string; variant?: "default" | "secondary" | "outline" | "destructive" };
  dueHint?: string;
  completed?: boolean;
};

export const crmTasks: TaskMock[] = [
  {
    id: "t1",
    title: "Prepare SOC2 evidence pack",
    subtitle: "Security · Due legal review",
    priority: "high",
    status: { label: "In progress", variant: "secondary" },
    dueHint: "Due Fri",
    completed: false,
  },
  {
    id: "t2",
    title: "Import EU customer backlog",
    subtitle: "CRM migration wave 2",
    priority: "medium",
    dueHint: "Due Mon",
    completed: false,
  },
  {
    id: "t3",
    title: "Approve vendor invoice #8842",
    priority: "low",
    status: { label: "Blocked", variant: "destructive" },
    completed: false,
  },
];

export type KanbanCardMock = {
  id: string;
  title: string;
  subtitle?: string;
  tag?: { label: string; variant?: "default" | "secondary" | "outline" | "destructive" };
  avatarFallback?: string;
};

export const crmKanban = {
  columns: [
    {
      id: "todo",
      title: "Backlog",
      wipLimit: 12 as number | undefined,
      cards: [
        {
          id: "k1",
          title: "Define ERP cutover checklist",
          subtitle: "Platform",
          tag: { label: "Epic", variant: "outline" },
          avatarFallback: crmPeople.alex.initials,
        },
        {
          id: "k2",
          title: "Train finance on new AR workflow",
          tag: { label: "Training", variant: "secondary" },
          avatarFallback: crmPeople.taylor.initials,
        },
      ] satisfies KanbanCardMock[],
    },
    {
      id: "doing",
      title: "In progress",
      wipLimit: 5,
      cards: [
        {
          id: "k3",
          title: "Integrate calendar free-busy",
          subtitle: "Alex · Jordan",
          tag: { label: "Feature", variant: "default" },
          avatarFallback: crmPeople.jordan.initials,
        },
      ] satisfies KanbanCardMock[],
    },
    {
      id: "done",
      title: "Done",
      wipLimit: undefined,
      cards: [
        {
          id: "k4",
          title: "Ship workflow approvals v1",
          tag: { label: "Released", variant: "secondary" },
          avatarFallback: crmPeople.sam.initials,
        },
      ] satisfies KanbanCardMock[],
    },
  ],
};

export const crmProject = {
  title: "Procertus CRM & ERP rollout",
  code: "PRJ-2048",
  description: "Single pane for sales, delivery, and finance with shared customer record.",
  status: { label: "On track", variant: "secondary" as const },
};

export const crmMilestoneSegments: MilestoneTimelineSegment[] = [
  {
    id: "ms1",
    title: "Discovery",
    caption: "Jan",
    status: "complete",
    deadlineLabel: "Done",
    deadlineTone: "muted",
  },
  {
    id: "ms2",
    title: "Build",
    caption: "Feb–Apr",
    status: "current",
    deadlineLabel: "Apr 30",
    deadlineTone: "warning",
  },
  {
    id: "ms3",
    title: "UAT",
    caption: "May",
    status: "upcoming",
  },
  {
    id: "ms4",
    title: "Go-live",
    caption: "Jun 15",
    status: "at-risk",
    deadlineLabel: "Jun 15",
    deadlineTone: "critical",
  },
];

export const crmProjectStats = [
  { id: "s1", label: "Open tasks", value: "38", hint: "12 unassigned" },
  { id: "s2", label: "Milestones", value: "4", hint: "1 at risk" },
  { id: "s3", label: "Budget burn", value: "62%", hint: "Under cap" },
  { id: "s4", label: "CSAT (pilot)", value: "4.6", hint: "n=24" },
];

export const crmHorizontalTimeline: {
  segments: HorizontalTimelineSegment[];
  ticks: HorizontalTimelineTick[];
} = {
  segments: [
    { start: 0, end: 22, intent: "muted", label: "Discovery" },
    { start: 22, end: 55, intent: "primary", label: "Build" },
    { start: 55, end: 78, intent: "success", label: "UAT" },
    { start: 78, end: 100, intent: "warning", label: "Hypercare" },
  ],
  ticks: [
    { at: 0, label: "Kickoff" },
    { at: 50, label: "Mid" },
    { at: 100, label: "Close" },
  ],
};

export const crmPlanningWindows: {
  windows: PlanningWindowSegment[];
  backgroundSegments: PlanningWindowSegment[];
} = {
  backgroundSegments: [
    { start: 0, end: 15, intent: "default", label: "Blackout" },
    { start: 85, end: 100, intent: "primary", label: "Change freeze" },
  ],
  windows: [
    { start: 20, end: 45, intent: "success", label: "Deploy window A" },
    { start: 50, end: 72, intent: "default", label: "Deploy window B" },
  ],
};

export const crmResourceLoad: ResourceLoadRow[] = [
  {
    resourceLabel: crmPeople.alex.name,
    segments: [
      { start: 0, end: 35, level: "low", label: "Admin" },
      { start: 35, end: 80, level: "high", label: "Build" },
      { start: 80, end: 100, level: "medium", label: "Review" },
    ],
  },
  {
    resourceLabel: crmPeople.jordan.name,
    segments: [
      { start: 0, end: 60, level: "medium" },
      { start: 60, end: 100, level: "critical", label: "Overallocated" },
    ],
  },
];

export const crmWorkflowSteps: WorkflowStepperStep[] = [
  { id: "w1", label: "Submitted", description: "Rep filed opportunity", state: "completed" },
  { id: "w2", label: "Deal desk", description: "Pricing & terms", state: "current" },
  { id: "w3", label: "Legal", state: "pending" },
  { id: "w4", label: "Signed", state: "pending" },
];

export const crmApprovalMembers: ApprovalChainListMember[] = [
  {
    id: "a1",
    name: crmPeople.alex.name,
    title: "Deal desk",
    statusLabel: "Approved",
    statusVariant: "secondary",
    avatarFallback: crmPeople.alex.initials,
  },
  {
    id: "a2",
    name: crmPeople.jordan.name,
    title: "Finance BP",
    statusLabel: "Waiting",
    statusVariant: "outline",
    avatarFallback: crmPeople.jordan.initials,
  },
  {
    id: "a3",
    name: crmPeople.sam.name,
    title: "Legal",
    statusLabel: "Not started",
    statusVariant: "secondary",
    avatarFallback: crmPeople.sam.initials,
  },
];

export const crmWorkflowComments: WorkflowCommentThreadItem[] = [
  {
    id: "c1",
    authorName: crmPeople.taylor.name,
    body: "Can we align payment terms with the EU template?",
    timestampLabel: "Today · 09:12",
    avatarFallback: crmPeople.taylor.initials,
    variant: "incoming",
  },
  {
    id: "c2",
    authorName: "You",
    body: "Yes — use NET45 with staged milestones.",
    timestampLabel: "Today · 09:40",
    variant: "outgoing",
  },
];

export const crmSavedViews = [
  { id: "v1", label: "My open deals" },
  { id: "v2", label: "At-risk projects" },
  { id: "v3", label: "This week’s meetings" },
];

export const crmRecordSummary = [
  { label: "Organization", value: "Acme Corp" },
  { label: "Region", value: "EU-West" },
  { label: "Owner", value: crmPeople.alex.name },
  { label: "Health", value: "Green · SLA 99.2%" },
];

export const crmAvailability: { columnLabels: string[]; rows: AvailabilityGridRow[] } = {
  columnLabels: ["09:00", "10:00", "11:00", "12:00"],
  rows: [
    {
      id: "p1",
      label: crmPeople.alex.name,
      cells: ["busy", "busy", "free", "tentative"] as AvailabilityCellTone[],
    },
    {
      id: "p2",
      label: crmPeople.jordan.name,
      cells: ["free", "busy", "busy", "busy"] as AvailabilityCellTone[],
    },
    {
      id: "p3",
      label: crmPeople.sam.name,
      cells: ["outOfOffice", "outOfOffice", "free", "free"] as AvailabilityCellTone[],
    },
  ] as AvailabilityGridRow[],
};

export const crmRecurrence = {
  title: "Repeats",
  summary: "Every weekday",
  detail: "Until Dec 31, 2026 · Europe/Brussels",
};
