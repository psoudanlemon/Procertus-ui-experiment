import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, Skeleton } from "@procertus-ui/ui";

// ---------------------------------------------------------------------------
// Logo (static SVG asset from packages/ui/public)
// ---------------------------------------------------------------------------

const logo = (
  <>
    <img src="/Procertus Logo with tagline.svg" alt="PROCERTUS" className="h-16 w-auto dark:hidden" />
    <img src="/Procertus Logo with tagline.svg" alt="PROCERTUS" className="hidden h-16 w-auto brightness-0 invert dark:block" />
  </>
);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Applied Guidelines/Logotype",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

/**
 * This story validates logotype contrast and watermark placement in a live UI
 * environment without content distraction.
 */
function BrandWatermark() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-0 bottom-0 h-auto w-[420px] translate-x-[15%] translate-y-[10%] opacity-100 sm:w-[540px] md:w-[660px]"
      viewBox="0 0 979 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="block dark:hidden" d="M547.152 485.365L404.547 358.595C359.607 318.697 355.626 249.96 395.523 205.019L398.797 201.304L580.681 362.929L818.297 91.4304C859.257 44.6324 930.471 39.8553 977.269 80.8146L978.065 81.5223L629.248 480.234C608.105 504.385 571.303 506.773 547.241 485.365H547.152Z" fill="#D4F3EC" />
      <path className="block dark:hidden" d="M430.913 14.6355L573.518 141.406C618.458 181.303 622.439 250.041 582.542 294.981L579.268 298.696L397.385 137.071L159.768 408.57C118.808 455.368 47.5941 460.145 0.796186 419.186L0 418.478L348.817 19.7665C369.96 -4.38444 406.762 -6.773 430.824 14.6355H430.913Z" fill="#E1F2FD" />
      <path className="hidden dark:block" d="M547.652 485.365L404.916 358.595C359.935 318.697 355.95 249.96 395.884 205.019L399.161 201.304L581.21 362.929L819.044 91.4304C860.041 44.6324 931.32 39.8553 978.161 80.8146L978.957 81.5223L629.822 480.234C608.66 504.385 571.825 506.773 547.74 485.365H547.652Z" fill="#0A2F47" />
      <path className="hidden dark:block" d="M431.306 14.6355L574.041 141.406C619.023 181.303 623.007 250.041 583.073 294.981L579.797 298.696L397.747 137.071L159.913 408.57C118.917 455.368 47.6376 460.145 0.796912 419.186L0 418.478L349.135 19.7665C370.298 -4.38444 407.133 -6.773 431.217 14.6355H431.306Z" fill="#0B2827" />
    </svg>
  );
}

export const IdentityStressTest: Story = {
  name: "Identity stress test",
  render: () => (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-background p-boundary">
      <BrandWatermark />
      <div className="absolute top-boundary left-1/2 -translate-x-1/2">{logo}</div>
      <Card className="relative z-10 w-full max-w-md shadow-[var(--shadow-proc-md)] ring-0">
        <CardContent className="flex flex-col items-center gap-component px-section py-section text-center">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex w-full flex-col items-center gap-2">
            <Skeleton className="h-7 w-48" />
            <div className="flex w-full flex-col items-center gap-1.5">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-4 w-full max-w-[260px]" />
            </div>
          </div>
          <Skeleton className="h-9 w-36 rounded-md" />
        </CardContent>
      </Card>
    </div>
  ),
};
