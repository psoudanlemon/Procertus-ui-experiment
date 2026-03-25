/**
 * Full-width CRM / ERP admin shell for Storybook: sidebar “routes” compose ui-lib presentation components.
 * Mock data lives in `./crm-admin-mock-data` — keep stories data-only there.
 */
import * as React from "react";
import type { CSSProperties } from "react";
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@procertus-ui/ui";
import {
  Building2,
  CalendarDays,
  CheckSquare,
  Columns3,
  FolderKanban,
  GanttChart,
  GitBranch,
  LayoutDashboard,
  Route,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { AvailabilityGrid } from "../admin/calendar-scheduling/availability-grid/AvailabilityGrid";
import { MeetingAgendaSection } from "../admin/calendar-scheduling/meeting-agenda-section/MeetingAgendaSection";
import { MeetingCard } from "../admin/calendar-scheduling/meeting-card/MeetingCard";
import { MeetingComposerFields } from "../admin/calendar-scheduling/meeting-composer-fields/MeetingComposerFields";
import { MeetingList } from "../admin/calendar-scheduling/meeting-list/MeetingList";
import { RecurrenceSummary } from "../admin/calendar-scheduling/recurrence-summary/RecurrenceSummary";
import { KanbanBoard } from "../admin/kanban/kanban-board/KanbanBoard";
import { KanbanCard } from "../admin/kanban/kanban-card/KanbanCard";
import { KanbanColumn } from "../admin/kanban/kanban-column/KanbanColumn";
import { KanbanColumnHeader } from "../admin/kanban/kanban-column-header/KanbanColumnHeader";
import { KanbanWipLimitBadge } from "../admin/kanban/kanban-wip-limit-badge/KanbanWipLimitBadge";
import { MilestoneTimeline } from "../admin/projects-milestones/milestone-timeline/MilestoneTimeline";
import { ProjectHeader } from "../admin/projects-milestones/project-header/ProjectHeader";
import { ProjectPhaseGroup } from "../admin/projects-milestones/project-phase-group/ProjectPhaseGroup";
import { ProjectStatsRow } from "../admin/projects-milestones/project-stats-row/ProjectStatsRow";
import { DeadlinePill } from "../admin/projects-milestones/deadline-pill/DeadlinePill";
import { ObjectiveKeyResultRow } from "../admin/roadmap/objective-key-result-row/ObjectiveKeyResultRow";
import { ReleaseTrainCard } from "../admin/roadmap/release-train-card/ReleaseTrainCard";
import { RoadmapQuarterDivider } from "../admin/roadmap/roadmap-quarter-divider/RoadmapQuarterDivider";
import { RoadmapSwimlane } from "../admin/roadmap/roadmap-swimlane/RoadmapSwimlane";
import { AdminPageHeader } from "../admin/shell/admin-page-header/AdminPageHeader";
import { AuditMetadataFooter } from "../admin/shell/audit-metadata-footer/AuditMetadataFooter";
import { DensityToggle } from "../admin/shell/density-toggle/DensityToggle";
import { FilterBar } from "../admin/shell/filter-bar/FilterBar";
import { RecordSummaryStrip } from "../admin/shell/record-summary-strip/RecordSummaryStrip";
import { SavedViewChips } from "../admin/shell/saved-view-chips/SavedViewChips";
import { TaskAssigneeRow } from "../admin/tasks/task-assignee-row/TaskAssigneeRow";
import { TaskDetailPanel } from "../admin/tasks/task-detail-panel/TaskDetailPanel";
import { TaskDueDateDisplay } from "../admin/tasks/task-due-date-display/TaskDueDateDisplay";
import { TaskListItem } from "../admin/tasks/task-list-item/TaskListItem";
import { HorizontalTimeline } from "../admin/timelines/horizontal-timeline/HorizontalTimeline";
import { PlanningWindowBar } from "../admin/timelines/planning-window-bar/PlanningWindowBar";
import { ResourceLoadStrip } from "../admin/timelines/resource-load-strip/ResourceLoadStrip";
import { TimelineEventMarker } from "../admin/timelines/timeline-event-marker/TimelineEventMarker";
import { TimelineLegend } from "../admin/timelines/timeline-legend/TimelineLegend";
import { ApprovalChainList } from "../admin/workflows/approval-chain-list/ApprovalChainList";
import { SlaCountdownDisplay } from "../admin/workflows/sla-countdown-display/SlaCountdownDisplay";
import { WorkflowCommentThread } from "../admin/workflows/workflow-comment-thread/WorkflowCommentThread";
import { WorkflowStateBadge } from "../admin/workflows/workflow-state-badge/WorkflowStateBadge";
import { WorkflowStep } from "../admin/workflows/workflow-step/WorkflowStep";
import { WorkflowStepper } from "../admin/workflows/workflow-stepper/WorkflowStepper";

import * as mock from "./crm-admin-mock-data";

export type CrmAdminRouteId =
  | "overview"
  | "calendar"
  | "tasks"
  | "kanban"
  | "projects"
  | "timelines"
  | "roadmap"
  | "workflows";

const sidebarStyle = {
  "--sidebar-width": "calc(var(--spacing) * 56)",
  "--header-height": "calc(var(--spacing) * 12)",
} as CSSProperties;

const NAV: { id: CrmAdminRouteId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { id: "calendar", label: "Calendar & meetings", icon: <CalendarDays className="size-4" /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare className="size-4" /> },
  { id: "kanban", label: "Kanban", icon: <Columns3 className="size-4" /> },
  { id: "projects", label: "Projects", icon: <FolderKanban className="size-4" /> },
  { id: "timelines", label: "Timelines", icon: <GanttChart className="size-4" /> },
  { id: "roadmap", label: "Roadmap", icon: <Route className="size-4" /> },
  { id: "workflows", label: "Workflows", icon: <GitBranch className="size-4" /> },
];

function routeTitle(id: CrmAdminRouteId): string {
  return NAV.find((n) => n.id === id)?.label ?? "Admin";
}

/** Bento width cap — left-aligned in the main column (`self-start`), wider than typical 1400px docs. */
const bentoMax = "w-full max-w-[1680px] self-start";

/** Presentation cards often ship with `mx-auto max-w-*`; override in this shell for left-aligned full-width lanes. */
const showcaseCardAlign = "mx-0 w-full max-w-none";

/** List rows that default to `max-w-xl` — span the bento column in this shell. */
const showcaseRowFull = "max-w-none";

/**
 * KPI strip (SectionCards-style): responsive 1 → 2 → 4 columns with gradient card shells.
 */
function OverviewKpiBento() {
  const stats = mock.crmProjectStats;
  const trends = ["up", "down", "up", "neutral"] as const;
  return (
    <div
      className={
        "grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"
      }
    >
      {stats.map((s, i) => {
        const t = trends[i] ?? "neutral";
        return (
          <Card key={s.id} className="@container/card" data-slot="card">
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {s.value}
              </CardTitle>
              <CardAction>
                {t === "up" ? (
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="size-3.5" aria-hidden />
                    On track
                  </Badge>
                ) : t === "down" ? (
                  <Badge variant="outline" className="gap-1">
                    <TrendingDown className="size-3.5" aria-hidden />
                    Watch
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    {s.hint ?? "—"}
                  </Badge>
                )}
              </CardAction>
            </CardHeader>
            {s.hint ? (
              <CardFooter className="text-muted-foreground text-xs">{s.hint}</CardFooter>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}

export function CrmAdminShowcaseApp() {
  const uid = React.useId();
  const [route, setRoute] = React.useState<CrmAdminRouteId>("overview");
  const [meetingSearch, setMeetingSearch] = React.useState("");
  const [taskSearch, setTaskSearch] = React.useState("");
  const [taskFilterSearch, setTaskFilterSearch] = React.useState("");
  const [approvalSearch, setApprovalSearch] = React.useState("");
  const [availabilitySearch, setAvailabilitySearch] = React.useState("");
  const [openMeetingMenu, setOpenMeetingMenu] = React.useState<string | null>(null);
  const [openTaskMenu, setOpenTaskMenu] = React.useState<string | null>(null);
  const [openKanbanMenu, setOpenKanbanMenu] = React.useState<string | null>(null);
  const [assigneeMenu, setAssigneeMenu] = React.useState<string | null>(null);
  const [taskDetailSearch, setTaskDetailSearch] = React.useState("");
  const [releaseTrainMenu, setReleaseTrainMenu] = React.useState<string | null>(null);
  const [okrMenu, setOkrMenu] = React.useState<string | null>(null);
  const [density, setDensity] = React.useState<"comfortable" | "compact" | "spacious">("comfortable");
  const [composer, setComposer] = React.useState({
    title: "Executive steering",
    location: "Meet / Berlin",
    start: "2026-03-28T09:00",
    end: "2026-03-28T09:30",
    allDay: false,
    notes: "Review rollout risks and SLA.",
  });

  const filteredMeetings = React.useMemo(() => {
    const q = meetingSearch.trim().toLowerCase();
    if (!q) {
      return mock.crmMeetings;
    }
    return mock.crmMeetings.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q) ||
        m.meetingTypeLabel.toLowerCase().includes(q),
    );
  }, [meetingSearch]);

  const filteredTasks = React.useMemo(() => {
    const q = taskFilterSearch.trim().toLowerCase();
    if (!q) {
      return mock.crmTasks;
    }
    return mock.crmTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.subtitle?.toLowerCase().includes(q) ?? false),
    );
  }, [taskFilterSearch]);

  const firstTask = mock.crmTasks[0]!;

  return (
    <SidebarProvider style={sidebarStyle}>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <Building2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">Procertus Ops</span>
              <span className="text-sidebar-foreground/70 truncate text-xs">CRM · ERP console</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Modules</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={route === item.id}
                      onClick={() => setRoute(item.id)}
                      tooltip={item.label}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b px-4 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <h1 className="text-base font-medium">{routeTitle(route)}</h1>
          <div className="ml-auto flex items-center gap-2">
            <WorkflowStateBadge preset="submitted" label="Sandbox" />
            <SlaCountdownDisplay
              label="Deal desk SLA"
              remainingLabel="4h 12m left"
              tone="warning"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
            {route === "overview" ? (
              <OverviewRoute
                density={density}
                onDensityChange={setDensity}
                taskSearch={taskSearch}
                onTaskSearchChange={setTaskSearch}
              />
            ) : null}
            {route === "calendar" ? (
              <CalendarRoute
                meetingSearch={meetingSearch}
                onMeetingSearchChange={setMeetingSearch}
                filteredMeetings={filteredMeetings}
                openMeetingMenu={openMeetingMenu}
                setOpenMeetingMenu={setOpenMeetingMenu}
                availabilitySearch={availabilitySearch}
                onAvailabilitySearchChange={setAvailabilitySearch}
                composer={composer}
                setComposer={setComposer}
                uid={uid}
              />
            ) : null}
            {route === "tasks" ? (
              <TasksRoute
                taskFilterSearch={taskFilterSearch}
                onTaskFilterSearchChange={setTaskFilterSearch}
                filteredTasks={filteredTasks}
                openTaskMenu={openTaskMenu}
                setOpenTaskMenu={setOpenTaskMenu}
                firstTask={firstTask}
                taskDetailSearch={taskDetailSearch}
                onTaskDetailSearchChange={setTaskDetailSearch}
                assigneeMenu={assigneeMenu}
                setAssigneeMenu={setAssigneeMenu}
              />
            ) : null}
            {route === "kanban" ? (
              <KanbanRoute openKanbanMenu={openKanbanMenu} setOpenKanbanMenu={setOpenKanbanMenu} />
            ) : null}
            {route === "projects" ? <ProjectsRoute /> : null}
            {route === "timelines" ? <TimelinesRoute /> : null}
            {route === "roadmap" ? (
              <RoadmapRoute
                releaseTrainMenu={releaseTrainMenu}
                setReleaseTrainMenu={setReleaseTrainMenu}
                okrMenu={okrMenu}
                setOkrMenu={setOkrMenu}
              />
            ) : null}
            {route === "workflows" ? (
              <WorkflowsRoute
                approvalSearch={approvalSearch}
                onApprovalSearchChange={setApprovalSearch}
              />
            ) : null}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function OverviewRoute({
  density,
  onDensityChange,
  taskSearch,
  onTaskSearchChange,
}: {
  density: "comfortable" | "compact" | "spacious";
  onDensityChange: (v: "comfortable" | "compact" | "spacious") => void;
  taskSearch: string;
  onTaskSearchChange: (v: string) => void;
}) {
  return (
    <div className={`${bentoMax} flex flex-col gap-6`}>
      <AdminPageHeader
        badge="Showcase"
        title="Operations overview"
        description="Cross-module snapshot using the same mock org, people, and records as other routes."
        primaryLabel="New record"
        secondaryLabel="Export"
        onPrimary={() => undefined}
        onSecondary={() => undefined}
      />
      <OverviewKpiBento />
      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <RecordSummaryStrip
            items={mock.crmRecordSummary}
            actions={
              <Button type="button" size="sm" variant="outline">
                Open customer
              </Button>
            }
          />
        </div>
        <div className="flex flex-col gap-4">
          <SavedViewChips
            views={mock.crmSavedViews}
            selectedId="v1"
            onSelect={() => undefined}
          />
          <DensityToggle
            title="Table density"
            description="Applies to list and grid layouts in this console."
            value={density}
            onValueChange={onDensityChange}
          />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FilterBar
            className={showcaseCardAlign}
            title="Quick find — tasks"
            description="Search is local to this panel; data is shared from crm-admin-mock-data."
            searchValue={taskSearch}
            onSearchChange={onTaskSearchChange}
            actions={<Button size="sm">Save view</Button>}
          >
            <ul className="divide-y rounded-md border">
              {mock.crmTasks.slice(0, 3).map((t) => (
                <li key={t.id} className="px-3 py-2 text-sm">
                  <span className="font-medium">{t.title}</span>
                  {t.dueHint ? (
                    <span className="text-muted-foreground ml-2 text-xs">{t.dueHint}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </FilterBar>
        </div>
        <Card className="flex h-full flex-col justify-between shadow-xs" data-slot="card">
          <CardHeader>
            <CardDescription>Meetings today</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{mock.crmMeetings.length}</CardTitle>
            <CardAction>
              <Badge variant="outline">Shared mock</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-muted-foreground text-xs">
            Same rows as Calendar route
          </CardFooter>
        </Card>
      </div>
      <AuditMetadataFooter
        parts={[
          { label: "Created", value: "Mar 1, 2026 · Taylor Chen" },
          { label: "Updated", value: "Mar 24, 2026 · Alex Morgan" },
          { label: "Record", value: "acct_01HZ…" },
        ]}
      />
    </div>
  );
}

function CalendarRoute({
  meetingSearch,
  onMeetingSearchChange,
  filteredMeetings,
  openMeetingMenu,
  setOpenMeetingMenu,
  availabilitySearch,
  onAvailabilitySearchChange,
  composer,
  setComposer,
  uid,
}: {
  meetingSearch: string;
  onMeetingSearchChange: (v: string) => void;
  filteredMeetings: typeof mock.crmMeetings;
  openMeetingMenu: string | null;
  setOpenMeetingMenu: (id: string | null) => void;
  availabilitySearch: string;
  onAvailabilitySearchChange: (v: string) => void;
  composer: {
    title: string;
    location: string;
    start: string;
    end: string;
    allDay: boolean;
    notes: string;
  };
  setComposer: React.Dispatch<
    React.SetStateAction<{
      title: string;
      location: string;
      start: string;
      end: string;
      allDay: boolean;
      notes: string;
    }>
  >;
  uid: string;
}) {
  return (
    <div className={`${bentoMax} flex flex-col gap-6`}>
      <MeetingList
        className={showcaseCardAlign}
        title="Meetings"
        description="Same meetings appear in overview quick list and here."
        searchValue={meetingSearch}
        onSearchChange={onMeetingSearchChange}
        actions={<Button size="sm">Schedule</Button>}
      >
        <div className="flex flex-col gap-3">
          {filteredMeetings.map((m) => (
            <MeetingCard
              key={m.id}
              className={showcaseRowFull}
              title={m.title}
              subtitle={m.subtitle}
              meetingTypeLabel={m.meetingTypeLabel}
              status={m.status}
              avatarFallback={m.avatarFallback}
              menuOpen={openMeetingMenu === m.id}
              onMenuOpenChange={(open) => setOpenMeetingMenu(open ? m.id : null)}
            />
          ))}
        </div>
      </MeetingList>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MeetingAgendaSection
            className={showcaseCardAlign}
            badge="Agenda"
            title="Customer renewal workshop"
            description="Shared talking points for Acme Corp Q1 renewal."
            primaryLabel="Open board deck"
            secondaryLabel="Copy agenda"
            onPrimary={() => undefined}
            onSecondary={() => undefined}
          >
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>Executive summary & health score</li>
              <li>Expansion opportunities</li>
              <li>Support & SLA review</li>
            </ol>
          </MeetingAgendaSection>
        </div>
        <RecurrenceSummary
          className={showcaseCardAlign}
          title={mock.crmRecurrence.title}
          summary={mock.crmRecurrence.summary}
          detail={mock.crmRecurrence.detail}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <AvailabilityGrid
          className={showcaseCardAlign}
          title="Team availability"
          description="Mock grid — participants match crmPeople."
          columnLabels={mock.crmAvailability.columnLabels}
          rows={mock.crmAvailability.rows}
          searchValue={availabilitySearch}
          onSearchChange={onAvailabilitySearchChange}
        />
        <MeetingComposerFields
          className={showcaseCardAlign}
          title="Composer (controlled)"
          description="State is local to the showcase shell."
          titleFieldId={`${uid}-title`}
          titleLabel="Title"
          titleValue={composer.title}
          onTitleChange={(v) => setComposer((s) => ({ ...s, title: v }))}
          locationFieldId={`${uid}-loc`}
          locationLabel="Location"
          locationValue={composer.location}
          onLocationChange={(v) => setComposer((s) => ({ ...s, location: v }))}
          startFieldId={`${uid}-start`}
          startLabel="Start"
          startValue={composer.start}
          onStartChange={(v) => setComposer((s) => ({ ...s, start: v }))}
          endFieldId={`${uid}-end`}
          endLabel="End"
          endValue={composer.end}
          onEndChange={(v) => setComposer((s) => ({ ...s, end: v }))}
          allDayId={`${uid}-allday`}
          allDayLabel="All day"
          allDay={composer.allDay}
          onAllDayChange={(checked) => setComposer((s) => ({ ...s, allDay: checked }))}
          notesFieldId={`${uid}-notes`}
          notesLabel="Notes"
          notesValue={composer.notes}
          onNotesChange={(v) => setComposer((s) => ({ ...s, notes: v }))}
          submitLabel="Save draft"
          cancelLabel="Discard"
          onSubmit={() => undefined}
          onCancel={() => undefined}
        />
      </div>
    </div>
  );
}

function TasksRoute({
  taskFilterSearch,
  onTaskFilterSearchChange,
  filteredTasks,
  openTaskMenu,
  setOpenTaskMenu,
  firstTask,
  taskDetailSearch,
  onTaskDetailSearchChange,
  assigneeMenu,
  setAssigneeMenu,
}: {
  taskFilterSearch: string;
  onTaskFilterSearchChange: (v: string) => void;
  filteredTasks: typeof mock.crmTasks;
  openTaskMenu: string | null;
  setOpenTaskMenu: (id: string | null) => void;
  firstTask: (typeof mock.crmTasks)[number];
  taskDetailSearch: string;
  onTaskDetailSearchChange: (v: string) => void;
  assigneeMenu: string | null;
  setAssigneeMenu: (id: string | null) => void;
}) {
  return (
    <div className={`${bentoMax} grid gap-4 lg:grid-cols-3 lg:items-start`}>
      <div className="lg:col-span-2">
        <FilterBar
          className={showcaseCardAlign}
          title="Work queue"
          description="Tasks tied to the rollout project."
          searchValue={taskFilterSearch}
          onSearchChange={onTaskFilterSearchChange}
          filters={
            <Button type="button" size="sm" variant="secondary">
              Priority: Any
            </Button>
          }
          actions={<Button size="sm">New task</Button>}
        >
          <div className="flex flex-col gap-3">
            {filteredTasks.map((t) => (
              <TaskListItem
                key={t.id}
                className={showcaseRowFull}
                title={t.title}
                subtitle={t.subtitle}
                priority={t.priority}
                status={t.status}
                dueHint={t.dueHint}
                completed={t.completed}
                onToggleComplete={() => undefined}
                menuOpen={openTaskMenu === t.id}
                onMenuOpenChange={(open) => setOpenTaskMenu(open ? t.id : null)}
              />
            ))}
          </div>
        </FilterBar>
      </div>
      <div className="flex flex-col gap-4">
        <TaskDetailPanel
          className={showcaseCardAlign}
          title={firstTask.title}
          description={firstTask.subtitle}
          searchValue={taskDetailSearch}
          onSearchChange={onTaskDetailSearchChange}
          searchLabel="Filter subtasks"
          searchPlaceholder="Filter…"
          showSearch
          actions={
            <Button type="button" size="sm" variant="outline">
              Open in ERP
            </Button>
          }
        >
          <div className="flex flex-col gap-3 px-4">
            {firstTask.priority ? (
              <p className="text-sm">
                <span className="text-muted-foreground">Priority:</span>{" "}
                <span className="font-medium capitalize">{firstTask.priority}</span>
              </p>
            ) : null}
            {firstTask.dueHint ? (
              <TaskDueDateDisplay
                primaryLabel="Mar 28, 2026"
                secondaryLabel={firstTask.dueHint}
                tone="soon"
              />
            ) : null}
          </div>
        </TaskDetailPanel>
        <div className="grid gap-3 @md/main:grid-cols-2 lg:grid-cols-1">
        <TaskAssigneeRow
          className={showcaseRowFull}
          assigneeName={mock.crmPeople.alex.name}
          subtitle="Owner"
            avatarFallback={mock.crmPeople.alex.initials}
            menuOpen={assigneeMenu === "alex"}
            onMenuOpenChange={(open) => setAssigneeMenu(open ? "alex" : null)}
            onViewProfile={() => undefined}
            onReassign={() => undefined}
          />
        <TaskAssigneeRow
          className={showcaseRowFull}
          assigneeName={mock.crmPeople.jordan.name}
          subtitle="Contributor"
            avatarFallback={mock.crmPeople.jordan.initials}
            menuOpen={assigneeMenu === "jordan"}
            onMenuOpenChange={(open) => setAssigneeMenu(open ? "jordan" : null)}
            onViewProfile={() => undefined}
            onReassign={() => undefined}
          />
        </div>
      </div>
    </div>
  );
}

function KanbanRoute({
  openKanbanMenu,
  setOpenKanbanMenu,
}: {
  openKanbanMenu: string | null;
  setOpenKanbanMenu: (id: string | null) => void;
}) {
  return (
    <div className={bentoMax}>
      <KanbanBoard
        title="Delivery board"
        description="Columns and cards use shared Kanban mock IDs."
      >
        {mock.crmKanban.columns.map((col) => (
          <KanbanColumn
            key={col.id}
            header={
              <KanbanColumnHeader
                title={col.title}
                subtitle={`${col.cards.length} cards`}
                trailing={
                  col.wipLimit != null ? (
                    <KanbanWipLimitBadge current={col.cards.length} limit={col.wipLimit} />
                  ) : undefined
                }
              />
            }
          >
            {col.cards.map((c) => (
              <KanbanCard
                key={c.id}
                title={c.title}
                subtitle={"subtitle" in c ? c.subtitle : undefined}
                tag={c.tag}
                avatarFallback={c.avatarFallback}
                menuOpen={openKanbanMenu === c.id}
                onMenuOpenChange={(open) => setOpenKanbanMenu(open ? c.id : null)}
                onEdit={() => undefined}
                onMove={() => undefined}
                onArchive={() => undefined}
              />
            ))}
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </div>
  );
}

function ProjectsRoute() {
  return (
    <div className={`${bentoMax} flex flex-col gap-6`}>
      <ProjectHeader
        title={mock.crmProject.title}
        code={mock.crmProject.code}
        description={mock.crmProject.description}
        status={mock.crmProject.status}
        meta={
          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
            <DeadlinePill label="Next gate Apr 30" tone="warning" />
            <WorkflowStateBadge preset="in_review" label="Stage: Build" />
          </div>
        }
        primaryLabel="Open workspace"
        secondaryLabel="Share"
        onPrimary={() => undefined}
        onSecondary={() => undefined}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MilestoneTimeline
            title="Milestones"
            description="Horizontal milestone rail for executive status."
            segments={mock.crmMilestoneSegments}
            actions={<Button size="sm">Add milestone</Button>}
          />
        </div>
        <ProjectPhaseGroup
          label="Phase 2"
          title="Platform integration"
          description="Workstreams under the shared project code."
        >
          <p className="text-muted-foreground text-sm">
            Dependencies: calendar free-busy, workflow approvals, and ERP cutover checklist (see Kanban).
          </p>
        </ProjectPhaseGroup>
      </div>
      <ProjectStatsRow
        title="Project pulse"
        description="KPIs computed from the same mock record."
        stats={mock.crmProjectStats}
      />
    </div>
  );
}

function TimelinesRoute() {
  return (
    <div className={`${bentoMax} flex flex-col gap-6`}>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HorizontalTimeline
            className={showcaseCardAlign}
            title="Program timeline"
            description="0–100% segments align with planning windows below."
            segments={mock.crmHorizontalTimeline.segments}
            ticks={mock.crmHorizontalTimeline.ticks}
          />
        </div>
        <Card className="flex flex-col justify-between shadow-xs" data-slot="card">
          <CardHeader>
            <CardDescription>Legend & today</CardDescription>
            <CardTitle className="text-base">Readout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimelineLegend
              legendTitle="Phases"
              orientation="vertical"
              items={[
                { id: "l1", label: "Discovery", swatchClassName: "bg-muted-foreground/40" },
                { id: "l2", label: "Build", swatchClassName: "bg-primary" },
                { id: "l3", label: "UAT", swatchClassName: "bg-chart-2" },
              ]}
            />
            <TimelineEventMarker position={52} label="Today" variant="flag" emphasized />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <PlanningWindowBar
          className={showcaseCardAlign}
          title="Change windows"
          description="Background = blackout / freeze; foreground = allowed deploy slots."
          windows={mock.crmPlanningWindows.windows}
          backgroundSegments={mock.crmPlanningWindows.backgroundSegments}
        />
        <ResourceLoadStrip
          className={showcaseCardAlign}
          title="Team load"
          description="Same people as meetings and tasks."
          rows={mock.crmResourceLoad}
        />
      </div>
    </div>
  );
}

function RoadmapRoute({
  releaseTrainMenu,
  setReleaseTrainMenu,
  okrMenu,
  setOkrMenu,
}: {
  releaseTrainMenu: string | null;
  setReleaseTrainMenu: (id: string | null) => void;
  okrMenu: string | null;
  setOkrMenu: (id: string | null) => void;
}) {
  return (
    <div className={`${bentoMax} flex flex-col gap-6`}>
      <RoadmapQuarterDivider quarterLabel="2026 · Q2" hint="Fiscal alignment" />
      <div className="grid gap-4 lg:grid-cols-2">
        <RoadmapSwimlane
          laneLabel="Customer platform"
          laneMeta="CRM + self-service"
          badge="2 trains"
          accent="primary"
        >
          <ReleaseTrainCard
            trainCode="R14.2"
            title="Customer analytics train"
            windowLabel="May 12 cutoff"
            status={{ label: "Planning", variant: "outline" }}
            menuOpen={releaseTrainMenu === "r142"}
            onMenuOpenChange={(open) => setReleaseTrainMenu(open ? "r142" : null)}
            onViewDetails={() => undefined}
          />
          <ObjectiveKeyResultRow
            keyResultId="KR 1.2"
            title="Increase ARR from installed base"
            progressPercent={62}
            status={{ label: "On track", variant: "secondary" }}
            menuOpen={okrMenu === "kr1"}
            onMenuOpenChange={(open) => setOkrMenu(open ? "kr1" : null)}
            onEdit={() => undefined}
          />
        </RoadmapSwimlane>
        <RoadmapSwimlane laneLabel="ERP core" laneMeta="Finance + inventory" badge="1 train">
          <ReleaseTrainCard
            trainCode="R3.9"
            title="GL cutover train"
            windowLabel="Cutover Jun 15"
            status={{ label: "Committed", variant: "secondary" }}
            menuOpen={releaseTrainMenu === "r39"}
            onMenuOpenChange={(open) => setReleaseTrainMenu(open ? "r39" : null)}
            onViewDetails={() => undefined}
          />
          <ObjectiveKeyResultRow
            keyResultId="KR 2.1"
            title="Close books on new GL with zero blocking defects"
            progressPercent={38}
            status={{ label: "At risk", variant: "outline" }}
            menuOpen={okrMenu === "kr2"}
            onMenuOpenChange={(open) => setOkrMenu(open ? "kr2" : null)}
            onEdit={() => undefined}
          />
        </RoadmapSwimlane>
      </div>
    </div>
  );
}

function WorkflowsRoute({
  approvalSearch,
  onApprovalSearchChange,
}: {
  approvalSearch: string;
  onApprovalSearchChange: (v: string) => void;
}) {
  return (
    <div className={`${bentoMax} flex flex-col gap-6`}>
      <WorkflowStepper aria-label="Opportunity approval" steps={mock.crmWorkflowSteps} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-xs lg:col-span-1" data-slot="card">
          <CardHeader>
            <CardDescription>Current step</CardDescription>
            <CardTitle className="text-base">Deal desk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <WorkflowStep
              stepNumber={2}
              label="Deal desk review"
              description="Pricing exception for Acme Corp"
              state="current"
            />
            <WorkflowStateBadge preset="pending_approval" label="Awaiting deal desk" />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <ApprovalChainList
            className={showcaseCardAlign}
            title="Approval chain"
            description="Approvers mirror crmPeople where possible."
            members={mock.crmApprovalMembers}
            searchValue={approvalSearch}
            onSearchChange={onApprovalSearchChange}
            actions={<Button size="sm">Nudge</Button>}
          />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WorkflowCommentThread
            className={showcaseCardAlign}
            title="Discussion"
            description="Thread on the same opportunity record."
            comments={mock.crmWorkflowComments}
          />
        </div>
        <Card className="h-fit shadow-xs" data-slot="card">
          <CardHeader>
            <CardDescription>SLA</CardDescription>
            <CardTitle className="text-lg">Same header chip</CardTitle>
          </CardHeader>
          <CardContent>
            <SlaCountdownDisplay
              label="Approval SLA"
              remainingLabel="4h 12m left"
              tone="warning"
              caption="Resets when deal desk acts"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
