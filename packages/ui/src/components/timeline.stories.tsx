import { Tick02Icon, Loading03Icon, ClockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "./timeline";

const roadmap = [
  {
    step: 1,
    date: "March 2024",
    title: "Project initialized",
    content: "Set up the repository, workspace packages, and initial architecture.",
  },
  {
    step: 2,
    date: "April 2024",
    title: "Beta release",
    content: "Launched the beta version for early testers and feedback.",
  },
  {
    step: 3,
    date: "June 2024",
    title: "Official launch",
    content: "Opened the platform to all organizations and production users.",
  },
];

const activity = [
  {
    step: 1,
    title: "Source code checkout",
    date: "12s",
    status: "success",
    content: "Fetched the latest changes from the main branch.",
  },
  {
    step: 2,
    title: "Dependency installation",
    date: "1m 45s",
    status: "success",
    content: "All packages installed and cached for future builds.",
  },
  {
    step: 3,
    title: "Unit and integration tests",
    date: "Running",
    status: "running",
    content: "Running 142 test suites across the workspace.",
  },
  {
    step: 4,
    title: "Production build",
    date: "Pending",
    status: "pending",
    content: "Waiting for tests before optimizing assets.",
  },
];

const meta = {
  title: "components/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Chronological timeline for events, history, and activity feeds. `TimelineIndicator` exposes two `variant` values (`outlined` and `filled`) and accepts text or icon children, so each timeline can pick a single visual treatment and tailor markers per item. Indicator size and rail geometry scale with `var(--spacing-component)` for density.",
      },
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj;

/** Outlined variant: white circle with a border. Reached steps pick up the primary outline matching the filled separator. */
export const Default: Story = {
  render: () => (
    <Timeline defaultValue={2} className="w-full max-w-xl">
      {roadmap.map((item) => (
        <TimelineItem key={item.step} step={item.step}>
          <TimelineHeader>
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator />
          <TimelineSeparator />
          <TimelineContent>{item.content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Date column on the left of the rail; titles and content on the right. Filled variant, so unreached steps fade to disabled intensity. */
export const LeftAlignedDates: Story = {
  render: () => (
    <Timeline defaultValue={2} className="w-full max-w-2xl">
      {roadmap.map((item) => (
        <TimelineItem
          key={item.step}
          step={item.step}
          className={cn(
            "grid items-start gap-x-component",
            "grid-cols-[7rem_calc(0.5rem+var(--spacing-component))_1fr]",
            "group-data-[orientation=vertical]/timeline:!ms-0"
          )}
        >
          <TimelineDate className="col-start-1 row-start-1 mt-[2px] mb-0 text-right">
            {item.date}
          </TimelineDate>
          <TimelineHeader className="col-start-3 row-start-1">
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator
            variant="filled"
            className="group-data-[orientation=vertical]/timeline:!left-[calc(7rem+var(--spacing-component)+0.25rem+var(--spacing-component)/2)]"
          />
          <TimelineSeparator className="group-data-[orientation=vertical]/timeline:!left-[calc(7rem+var(--spacing-component)+0.25rem+var(--spacing-component)/2)]" />
          <TimelineContent className="col-start-3">
            {item.content}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Three-column grid: right-aligned content on the left, the rail in the middle, left-aligned content on the right. Items alternate sides. Outlined variant on a Card surface. */
export const AlternatingLayout: Story = {
  render: () => (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent className="py-region">
        <Timeline defaultValue={2}>
          {roadmap.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <TimelineItem
                key={item.step}
                step={item.step}
                className={cn(
                  "grid items-start gap-x-component",
                  // minmax(0, 1fr) forces both content columns to share remaining space
                  // equally regardless of content length, keeping the rail dead-centre.
                  "grid-cols-[minmax(0,1fr)_calc(0.5rem+var(--spacing-component))_minmax(0,1fr)]",
                  "group-data-[orientation=vertical]/timeline:!ms-0"
                )}
              >
                <TimelineHeader
                  className={cn(
                    "row-start-1",
                    isLeft ? "col-start-1 text-right" : "col-start-3"
                  )}
                >
                  <TimelineDate>{item.date}</TimelineDate>
                  <TimelineTitle>{item.title}</TimelineTitle>
                </TimelineHeader>
                <TimelineIndicator
                  variant="outlined"
                  className="group-data-[orientation=vertical]/timeline:!left-1/2"
                />
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:!left-1/2" />
                <TimelineContent
                  className={cn(
                    "row-start-2",
                    isLeft ? "col-start-1 text-right" : "col-start-3"
                  )}
                >
                  {item.content}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  ),
};

/** CI-style activity feed. All indicators use the filled variant; status is communicated by the icon inside each one (tick for success, spinner for running, clock for pending). */
export const ActivityFeed: Story = {
  render: () => (
    <Timeline defaultValue={3} className="w-full max-w-2xl">
      {activity.map((item) => (
        <TimelineItem
          key={item.step}
          step={item.step}
          completed={item.status === "success"}
        >
          <TimelineHeader className="flex flex-wrap items-center gap-component">
            <TimelineTitle>{item.title}</TimelineTitle>
            <Badge
              variant={
                item.status === "success"
                  ? "success"
                  : item.status === "running"
                    ? "warning"
                    : "secondary"
              }
            >
              {item.status}
            </Badge>
            <TimelineDate className="mb-0 ml-auto">{item.date}</TimelineDate>
          </TimelineHeader>
          <TimelineIndicator variant="filled">
            {item.status === "success" ? (
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} className="size-3" />
            ) : item.status === "running" ? (
              <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
            ) : (
              <HugeiconsIcon icon={ClockIcon} className="size-3" />
            )}
          </TimelineIndicator>
          <TimelineSeparator />
          <TimelineContent>{item.content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};
