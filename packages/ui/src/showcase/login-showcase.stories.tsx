import type { Meta, StoryObj } from "@storybook/react-vite"
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

/**
 * Full-viewport anonymous login — [Shadcn login-03](https://ui.shadcn.com/blocks) pattern.
 */
function LoginShowcase() {
  return (
    <div className="bg-muted flex min-h-svh w-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}

const meta: Meta = {
  title: "theme/showcase/Login",
  component: LoginShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Centered login on muted full-screen background — mirrors **login-03** from the Shadcn blocks registry.",
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof LoginShowcase>

export const Default: Story = {
  render: () => <LoginShowcase />,
}
