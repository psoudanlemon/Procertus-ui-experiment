import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@procertus-ui/ui";

import { ProjectHeader } from "./ProjectHeader";

const meta = {
  title: "Admin/Projects & Milestones/ProjectHeader",
  component: ProjectHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Project summary header with optional code, status, meta, actions, and child content.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectHeader>;

export default meta;

const mockMeta = (
  <span>
    Owner <strong className="text-foreground">Jordan Lee</strong>
    <span className="mx-2 text-border">·</span>
    Target go-live <strong className="text-foreground">2025-06-30</strong>
  </span>
);

export const Default: StoryObj<typeof meta> = {
  args: {
    title: "Atlas customer portal",
    code: "PRJ-ATLAS-204",
    description: "Self-service billing, contracts, and support requests for enterprise accounts.",
    status: { label: "On track", variant: "secondary" },
    meta: mockMeta,
    primaryLabel: "Edit project",
    secondaryLabel: "Archive",
    onPrimary: () => undefined,
    onSecondary: () => undefined,
    children: (
      <p className="text-sm text-muted-foreground">
        Place milestone timeline, phase groups, or forms below the header.
      </p>
    ),
  },
};

export const Minimal: StoryObj<typeof meta> = {
  args: {
    title: "Mobile SDK hardening",
    code: "PRJ-MOB-12",
    description: "Security review and dependency upgrades before GA.",
    status: { label: "At risk", variant: "destructive" },
  },
};

export const WithSlotActions: StoryObj<typeof meta> = {
  render: () => (
    <ProjectHeader
      title="Data residency — EU shard"
      code="PRJ-RES-EU"
      description="Replication, backups, and legal review for EU-only storage."
      status={{ label: "Planning", variant: "outline" }}
      meta={mockMeta}
    >
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary">
          View brief
        </Button>
        <Button type="button" size="sm" variant="outline">
          Share link
        </Button>
      </div>
    </ProjectHeader>
  ),
};
