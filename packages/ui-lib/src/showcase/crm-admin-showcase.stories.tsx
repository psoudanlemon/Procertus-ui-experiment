import type { Meta, StoryObj } from "@storybook/react-vite";

import { CrmAdminShowcaseApp } from "./CrmAdminShowcaseApp";

/**
 * Full application shell — **Showcase** category (not `Admin/…` component stories).
 * Mock data: `crm-admin-mock-data.ts`. Presentation components: `src/admin/**`.
 */
const meta: Meta = {
  title: "Showcase/CRM & ERP admin",
  component: CrmAdminShowcaseApp,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Interactive shell with sidebar routes. Main views use bento-style grids: `max-w-[1680px]`, left-aligned (`self-start`, no `mx-auto`), `@container/main`, `lg:col-span-*` splits, and a SectionCards-style KPI row on Overview. Shared mock data: `crm-admin-mock-data.ts`.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CrmAdminShowcaseApp>;

export const Application: Story = {
  render: () => <CrmAdminShowcaseApp />,
};
