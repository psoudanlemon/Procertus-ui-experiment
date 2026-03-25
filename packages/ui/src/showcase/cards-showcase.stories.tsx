import type { Meta, StoryObj } from "@storybook/react-vite"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

/**
 * Dense card grid inspired by the Tweakcn “Cards” preview — KPI cards, charts, forms, and lists using the same primitives as the dashboard block.
 */
function CardsShowcase() {
  return (
    <div className="bg-background p-4 text-foreground md:p-6">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <div className="@container/main">
          <SectionCards />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardDescription>Exercise Minutes</CardDescription>
              <CardTitle>Weekly activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartAreaInteractive />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Move Goal</CardDescription>
              <CardTitle className="text-2xl tabular-nums">350</CardTitle>
              <CardAction>
                <Badge variant="outline">cal / day</Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-muted-foreground text-sm">
              Adjust your daily target in settings.
            </CardFooter>
          </Card>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upgrade subscription</CardTitle>
              <CardDescription>Update payment details and pick a plan.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="card-name">Name on card</Label>
                <Input id="card-name" placeholder="Jane Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="card-email">Email</Label>
                <Input id="card-email" type="email" placeholder="m@example.com" />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Optional message" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Enter your email below to register.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" type="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="su-password">Password</Label>
                <Input id="su-password" type="password" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-2xl tabular-nums">$15,231.89</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUpIcon />
                  +20.1%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-muted-foreground text-xs">From last month</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Subscriptions</CardDescription>
              <CardTitle className="text-2xl tabular-nums">+2,350</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUpIcon />
                  +180.1%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-muted-foreground text-xs">From last month</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>New Customers</CardDescription>
              <CardTitle className="text-2xl tabular-nums">1,234</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingDownIcon />
                  -20%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-muted-foreground text-xs">From last month</CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

const meta: Meta = {
  title: "theme/showcase/Cards",
  component: CardsShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Composite card grid (KPIs, chart, forms) to stress-test tokens like the Tweakcn “Cards” tab — uses primitives from the dashboard block where applicable.",
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof CardsShowcase>

export const Default: Story = {
  render: () => <CardsShowcase />,
}
