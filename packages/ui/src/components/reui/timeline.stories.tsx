import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    title: "Project Initialized",
    content: "Set up the repository, workspace packages, and initial architecture.",
  },
  {
    step: 2,
    date: "April 2024",
    title: "Beta Release",
    content: "Launched the beta version for early testers and feedback.",
  },
  {
    step: 3,
    date: "June 2024",
    title: "Official Launch",
    content: "Opened the platform to all organizations and production users.",
  },
];

const activity = [
  {
    step: 1,
    title: "Source Code Checkout",
    date: "12s",
    status: "success",
    content: "Fetched the latest changes from the main branch.",
  },
  {
    step: 2,
    title: "Dependency Installation",
    date: "1m 45s",
    status: "success",
    content: "All packages installed and cached for future builds.",
  },
  {
    step: 3,
    title: "Unit & Integration Tests",
    date: "Running",
    status: "running",
    content: "Running 142 test suites across the workspace.",
  },
  {
    step: 4,
    title: "Production Build",
    date: "Pending",
    status: "pending",
    content: "Waiting for tests before optimizing assets.",
  },
];

const meta = {
  title: "reui/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ReUI timeline for chronological events, process history, roadmaps, and activity feeds. Supports controlled active step state plus vertical and horizontal orientations.",
      },
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj;

function RoadmapItem({
  item,
  indicatorClassName,
}: {
  item: (typeof roadmap)[number];
  indicatorClassName?: string;
}) {
  return (
    <TimelineItem step={item.step}>
      <TimelineHeader>
        <TimelineDate>{item.date}</TimelineDate>
        <TimelineTitle>{item.title}</TimelineTitle>
      </TimelineHeader>
      <TimelineIndicator className={indicatorClassName} />
      <TimelineSeparator />
      <TimelineContent>{item.content}</TimelineContent>
    </TimelineItem>
  );
}

export const Default: Story = {
  render: () => (
    <Timeline defaultValue={2} className="w-full max-w-xl">
      {roadmap.map((item) => (
        <RoadmapItem key={item.step} item={item} />
      ))}
    </Timeline>
  ),
};

export const LeftAlignedDates: Story = {
  render: () => (
    <Timeline defaultValue={3} className="w-full max-w-2xl">
      {roadmap.map((item) => (
        <TimelineItem
          key={item.step}
          step={item.step}
          className="grid grid-cols-[7rem_1fr] gap-x-region"
        >
          <TimelineDate className="col-start-1 row-start-1 text-right">
            {item.date}
          </TimelineDate>
          <TimelineHeader className="col-start-2 row-start-1">
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator />
          <TimelineSeparator />
          <TimelineContent className="col-start-2">
            {item.content}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

export const CustomIndicators: Story = {
  render: () => (
    <Timeline defaultValue={2} className="w-full max-w-xl">
      {roadmap.map((item) => (
        <TimelineItem key={item.step} step={item.step}>
          <TimelineHeader>
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator className="grid place-items-center bg-background text-[10px] font-semibold text-primary">
            {item.step}
          </TimelineIndicator>
          <TimelineSeparator />
          <TimelineContent>{item.content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

export const AlternatingLayout: Story = {
  render: () => (
    <Timeline defaultValue={3} className="mx-auto w-full max-w-3xl">
      {roadmap.map((item, index) => (
        <TimelineItem
          key={item.step}
          step={item.step}
          className={cn(
            "w-1/2",
            index % 2 === 0 ? "mr-auto pr-10 text-right" : "ml-auto pl-10"
          )}
        >
          <TimelineHeader>
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator
            className={cn(index % 2 === 0 ? "-right-2 left-auto" : "-left-2")}
          />
          <TimelineSeparator
            className={cn(index % 2 === 0 ? "-right-2 left-auto" : "-left-2")}
          />
          <TimelineContent>{item.content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Card className="w-full max-w-4xl">
      <CardContent className="pt-region">
        <Timeline defaultValue={2} orientation="horizontal" className="w-full">
          {roadmap.map((item) => (
            <TimelineItem key={item.step} step={item.step}>
              <TimelineIndicator />
              <TimelineSeparator />
              <TimelineHeader>
                <TimelineDate>{item.date}</TimelineDate>
                <TimelineTitle>{item.title}</TimelineTitle>
              </TimelineHeader>
              <TimelineContent>{item.content}</TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  ),
};

export const ActivityFeed: Story = {
  render: () => (
    <Timeline defaultValue={2} className="w-full max-w-2xl">
      {activity.map((item) => (
        <TimelineItem key={item.step} step={item.step}>
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
          <TimelineIndicator
            className={cn(
              item.status === "running" && "animate-pulse border-warning",
              item.status === "pending" && "border-muted-foreground/30"
            )}
          />
          <TimelineSeparator />
          <TimelineContent>{item.content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

export const Controlled: Story = {
  render: function ControlledRender() {
    const [value, setValue] = useState(2);

    return (
      <div className="flex w-full max-w-xl flex-col gap-section">
        <div className="flex flex-wrap gap-component">
          {roadmap.map((item) => (
            <Button
              key={item.step}
              type="button"
              size="sm"
              variant={value === item.step ? "default" : "outline"}
              onClick={() => setValue(item.step)}
            >
              Step {item.step}
            </Button>
          ))}
        </div>
        <Timeline value={value} onValueChange={setValue}>
          {roadmap.map((item) => (
            <RoadmapItem
              key={item.step}
              item={item}
              indicatorClassName={value === item.step ? "bg-primary" : undefined}
            />
          ))}
        </Timeline>
      </div>
    );
  },
};
