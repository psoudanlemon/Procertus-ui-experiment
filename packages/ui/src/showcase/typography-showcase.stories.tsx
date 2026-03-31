import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * Long-form typography preview inspired by [Tweakcn Typography](https://tweakcn.com/editor/theme?p=typography).
 */
function TypographyShowcase() {
  return (
    <article className="bg-background text-foreground mx-auto max-w-3xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant="outline">Technology</Badge>
        <Badge variant="outline">Web Development</Badge>
        <Badge variant="outline">React</Badge>
      </div>
      <h1 className="text-foreground scroll-m-20 text-4xl font-bold tracking-tight md:text-5xl">
        The Future of Web Development: Embracing Modern Technologies
      </h1>
      <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
        Discover how cutting-edge technologies are reshaping the landscape of web development, from
        AI-powered tools to frameworks that change how we build for the web.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium leading-none">Jane Doe</div>
            <div className="text-muted-foreground text-sm">Senior Developer</div>
          </div>
        </div>
        <Separator orientation="vertical" className="hidden h-8 md:block" />
        <p className="text-muted-foreground text-sm">Dec 15, 2024 · 8 min read</p>
      </div>
      <div className="bg-muted/40 mt-10 flex aspect-video items-center justify-center rounded-xl border border-dashed">
        <span className="text-muted-foreground text-sm">Featured image</span>
      </div>
      <div className="mt-10 max-w-none space-y-4">
        <p className="text-foreground leading-7">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris.
        </p>
        <h2 className="text-foreground mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          The Evolution of Modern Frameworks
        </h2>
        <p className="text-foreground leading-7">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
        <blockquote className="border-primary/30 text-muted-foreground mt-6 border-l-4 pl-4 italic">
          The best way to predict the future is to create it. In web development, we are not just
          following trends — we are setting them.
        </blockquote>
        <h3 className="text-foreground mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
          Key technologies
        </h3>
        <ul className="text-foreground my-4 ml-6 list-disc space-y-2">
          <li>Artificial intelligence and machine learning integration</li>
          <li>Edge computing and serverless architectures</li>
          <li>Progressive web applications (PWAs)</li>
          <li>WebAssembly for high-performance applications</li>
        </ul>
      </div>
    </article>
  );
}

const meta: Meta = {
  title: "examples/Typography",
  component: TypographyShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Article-style typography preview (headings, lead, quote, lists) — aligned with the Tweakcn Typography tab.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TypographyShowcase>;

export const Default: Story = {
  render: () => <TypographyShowcase />,
};
