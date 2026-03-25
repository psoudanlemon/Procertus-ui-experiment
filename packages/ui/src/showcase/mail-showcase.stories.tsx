import type { Meta, StoryObj } from "@storybook/react-vite"

import { MailShowcase } from "./mail-showcase"

const meta: Meta<typeof MailShowcase> = {
  title: "theme/showcase/Mail",
  component: MailShowcase,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Three-pane mail client using **scroll-area** + **resizable** primitives (Tweakcn-style layout; there is no dedicated mail block in the [Shadcn blocks](https://ui.shadcn.com/blocks) catalog).",
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof MailShowcase>

export const Default: Story = {}
