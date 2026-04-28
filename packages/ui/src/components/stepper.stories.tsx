import { Tick01Icon, Tick02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "./stepper";

const meta = {
  title: "components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ReUI process stepper: **1-based** `value` / `defaultValue` / `onValueChange`, horizontal or vertical `orientation`, per-step `completed` / `disabled` / `loading` on `StepperItem`, optional `indicators` on the root, and `StepperPanel` + `StepperContent` for wizards. Keyboard: arrows, Home, End, Enter, Space. Styles use Procertus tokens (`shadow-proc-tactile`, semantic borders, `ring-foreground/10`).",
      },
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof meta>;

const completedTickIcon = (
  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} className="size-3.5 shrink-0 text-primary-foreground" />
);
const horizontalIndicators = { completed: completedTickIcon };

// Indicator size scales with density: base 32px + a density-scaled component padding
// (8/12/16px), giving roughly 40/44/48px circles. Every dependent measurement (line
// center alignment, label `top`) is derived from the same calc so geometry stays correct.
const horizontalIndicatorClass =
  "size-[calc(2rem+var(--spacing-component))] min-h-[calc(2rem+var(--spacing-component))] min-w-[calc(2rem+var(--spacing-component))] bg-secondary text-secondary-foreground ring-0 data-[state=completed]:border-primary/30 data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground";

// Line center = half of the indicator size minus half the line thickness (1px).
const horizontalSeparatorClass =
  "group-data-[orientation=horizontal]/stepper-nav:mt-[calc((2rem+var(--spacing-component))/2-1px)]";

// Horizontal layout: trigger is a fixed-size box around the indicator so the connecting
// line lands at the same gap from every indicator. The label group (title or title+desc)
// is positioned absolutely below the indicator so its width never affects the trigger.
// `px-section` makes the indicator-to-line gap scale with density; the label `top`
// derives from indicator size + a component-sized gap.
const horizontalItemClass = "items-start";
const horizontalTriggerClass =
  "relative w-fit min-h-20 shrink-0 flex-col items-center justify-start rounded-md px-section";
const horizontalTitleClass =
  "absolute left-1/2 top-[calc(2rem+var(--spacing-component)*2)] -translate-x-1/2 whitespace-nowrap text-center";

// Vertical layout: each item stacks a row (indicator + text group, vertically centered
// to each other) on top of a separator. The separator is shifted right to align with the
// indicator's center; `my-component` keeps line breathing room density-aware (8–12px).
const verticalItemClass = "w-full !items-stretch !justify-start";
const verticalRowClass = "flex items-center gap-component";
const verticalTriggerClass = "shrink-0 !rounded-md";
const verticalSeparatorClass =
  "group-data-[orientation=vertical]/stepper-nav:ml-[calc((2rem+var(--spacing-component))/2-1px)] group-data-[orientation=vertical]/stepper-nav:my-component";

/** Uncontrolled: initial step via `defaultValue` only. */
export const Uncontrolled: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Stepper defaultValue={2} className="w-full" indicators={horizontalIndicators}>
        <StepperNav>
          {[
            { step: 1, label: "Start" },
            { step: 2, label: "Details" },
            { step: 3, label: "Done" },
          ].map((s, i, arr) => (
            <StepperItem key={s.step} className={horizontalItemClass} step={s.step}>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>{s.step}</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>{s.label}</StepperTitle>
              </StepperTrigger>
              {i < arr.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </div>
  ),
};

/** Fully controlled: parent owns `value` and updates on `onValueChange`. */
export const Controlled: Story = {
  render: function ControlledRender() {
    const [value, setValue] = useState(2);
    return (
      <div className="flex w-full max-w-3xl flex-col gap-section">
        <div className="flex flex-wrap items-center gap-component text-sm text-muted-foreground">
          <span>Current 1-based value: {value}</span>
          <div className="flex gap-component">
            <Button type="button" size="sm" variant="outline" onClick={() => setValue(1)}>
              Set 1
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setValue(2)}>
              Set 2
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setValue(3)}>
              Set 3
            </Button>
          </div>
        </div>
        <Stepper className="w-full" value={value} onValueChange={setValue} indicators={horizontalIndicators}>
          <StepperNav>
            {[
              { step: 1, title: "Account" },
              { step: 2, title: "Profile" },
              { step: 3, title: "Review" },
            ].map((s, i, arr) => (
              <StepperItem key={s.step} className={horizontalItemClass} step={s.step}>
                <StepperTrigger className={horizontalTriggerClass}>
                  <StepperIndicator className={horizontalIndicatorClass}>{s.step}</StepperIndicator>
                  <StepperTitle className={horizontalTitleClass}>{s.title}</StepperTitle>
                </StepperTrigger>
                {i < arr.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
              </StepperItem>
            ))}
          </StepperNav>
        </Stepper>
      </div>
    );
  },
};

/** Horizontal full-width: titles visible from `md` and up. */
export const HorizontalWithTitles: Story = {
  render: () => (
    <Stepper className="w-full" defaultValue={1} orientation="horizontal" indicators={horizontalIndicators}>
      <StepperNav>
        {[
          { n: 1, t: "User details" },
          { n: 2, t: "Payment" },
          { n: 3, t: "Confirm" },
          { n: 4, t: "Receipt" },
        ].map((row, i, a) => (
          <StepperItem key={row.n} className={horizontalItemClass} step={row.n}>
            <StepperTrigger className={horizontalTriggerClass}>
              <StepperIndicator className={horizontalIndicatorClass}>{row.n}</StepperIndicator>
              <StepperTitle className={horizontalTitleClass}>{row.t}</StepperTitle>
            </StepperTrigger>
            {i < a.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
          </StepperItem>
        ))}
      </StepperNav>
    </Stepper>
  ),
};

/** Titles and descriptions under each label (ReUI “Title & description”). */
export const HorizontalTitleAndDescription: Story = {
  render: () => (
    <Stepper className="w-full" defaultValue={2} orientation="horizontal" indicators={horizontalIndicators}>
      <StepperNav>
        {[
          { s: 1, title: "Account", desc: "Email and password" },
          { s: 2, title: "Profile", desc: "Organization" },
          { s: 3, title: "Complete", desc: "Review" },
        ].map((r, i, a) => (
          <StepperItem key={r.s} className={horizontalItemClass} step={r.s}>
            <StepperTrigger className={horizontalTriggerClass}>
              <StepperIndicator className={horizontalIndicatorClass}>{r.s}</StepperIndicator>
              <div className={horizontalTitleClass}>
                <StepperTitle>{r.title}</StepperTitle>
                <StepperDescription className="text-xs leading-[1.4]">{r.desc}</StepperDescription>
              </div>
            </StepperTrigger>
            {i < a.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
          </StepperItem>
        ))}
      </StepperNav>
    </Stepper>
  ),
};

/** Read-heavy vertical rail (e.g. beside a form or `StepLayout` with `stepperPosition="start"`). */
export const Vertical: Story = {
  render: () => (
    <div className="mx-auto w-fit">
      <Stepper
        className="w-fit"
        defaultValue={2}
        orientation="vertical"
        indicators={horizontalIndicators}
      >
        <StepperNav>
          {[
            { s: 1, t: "Start" },
            { s: 2, t: "Middle" },
            { s: 3, t: "End" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} className={verticalItemClass} step={r.s}>
              <div className={verticalRowClass}>
                <StepperTrigger className={verticalTriggerClass}>
                  <StepperIndicator className={horizontalIndicatorClass}>{r.s}</StepperIndicator>
                </StepperTrigger>
                <div className="min-w-0 flex-1 text-left">
                  <StepperTitle className="line-clamp-2">{r.t}</StepperTitle>
                </div>
              </div>
              {i < a.length - 1 ? <StepperSeparator className={verticalSeparatorClass} /> : null}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </div>
  ),
};

/** Vertical: title + short description in the rail. */
export const VerticalTitleAndDescription: Story = {
  render: () => (
    <div className="mx-auto w-fit">
      <Stepper
        className="w-fit"
        defaultValue={2}
        orientation="vertical"
        indicators={horizontalIndicators}
      >
        <StepperNav>
          {[
            { s: 1, t: "Basics", d: "Name and country" },
            { s: 2, t: "Compliance", d: "Policies" },
            { s: 3, t: "Sign off", d: "Confirm" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} className={verticalItemClass} step={r.s}>
              <div className={verticalRowClass}>
                <StepperTrigger className={verticalTriggerClass}>
                  <StepperIndicator className={horizontalIndicatorClass}>{r.s}</StepperIndicator>
                </StepperTrigger>
                <div className="min-w-0 flex-1 text-left">
                  <StepperTitle>{r.t}</StepperTitle>
                  <StepperDescription className="line-clamp-2 text-xs leading-[1.4]">{r.d}</StepperDescription>
                </div>
              </div>
              {i < a.length - 1 ? <StepperSeparator className={verticalSeparatorClass} /> : null}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </div>
  ),
};

/** All steps inert: display progress only. */
export const AllStepsNonInteractive: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-component text-xs text-muted-foreground">
      <Stepper className="w-full" value={2} indicators={horizontalIndicators}>
        <StepperNav>
          {[
            { s: 1, t: "A" },
            { s: 2, t: "B" },
            { s: 3, t: "C" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} className={horizontalItemClass} disabled step={r.s}>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>{r.s}</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>{r.t}</StepperTitle>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
      <p>
        Controlled with <code className="rounded bg-muted px-micro py-micro">value=2</code> and every
        <code className="mx-micro rounded bg-muted px-micro py-micro">StepperItem</code>
        is <code className="rounded bg-muted px-micro py-micro">disabled</code> (read-only rail).
      </p>
    </div>
  ),
};

const tick = <HugeiconsIcon icon={Tick01Icon} className="size-3.5 text-primary" />;
const alert = <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 text-muted-foreground" />;

/**
 * Custom `indicators` override default numeric chips per state. Loading uses `Spinner` when
 * the active item has `loading` on `StepperItem` (see `ItemPropLoading`).
 */
export const CustomIndicators: Story = {
  render: function CustomIndicatorsRender() {
    return (
      <div className="w-full max-w-3xl space-y-component">
        <p className="text-xs text-muted-foreground">Step 1 uses custom inactive/complete/active; step 2 is forced loading.</p>
        <Stepper
          className="w-full"
          defaultValue={2}
          indicators={{
            active: <span className="text-sm font-bold text-primary-foreground">·</span>,
            completed: tick,
            inactive: alert,
            loading: <Spinner className="size-3.5 text-primary-foreground" />,
          }}
        >
          <StepperNav>
            <StepperItem className={horizontalItemClass} step={1}>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>1</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>Config</StepperTitle>
              </StepperTrigger>
              <StepperSeparator className={horizontalSeparatorClass} />
            </StepperItem>
            <StepperItem className={horizontalItemClass} step={2} loading>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>2</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>Submitting</StepperTitle>
              </StepperTrigger>
              <StepperSeparator className={horizontalSeparatorClass} />
            </StepperItem>
            <StepperItem className={horizontalItemClass} step={3}>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>3</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>Done</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperNav>
        </Stepper>
      </div>
    );
  },
};

/** `completed` forces prior steps to show completed even if the active index is behind (edge cases for async flows). */
export const ItemPropsCompleted: Story = {
  render: () => (
    <Stepper className="w-full" defaultValue={2} orientation="horizontal" indicators={horizontalIndicators}>
      <StepperNav>
        <StepperItem className={horizontalItemClass} step={1} completed>
          <StepperTrigger className={horizontalTriggerClass}>
            <StepperIndicator className={horizontalIndicatorClass}>1</StepperIndicator>
            <StepperTitle className={horizontalTitleClass}>Forced done</StepperTitle>
          </StepperTrigger>
          <StepperSeparator className={horizontalSeparatorClass} />
        </StepperItem>
        <StepperItem className={horizontalItemClass} step={2}>
          <StepperTrigger className={horizontalTriggerClass}>
            <StepperIndicator className={horizontalIndicatorClass}>2</StepperIndicator>
            <StepperTitle className={horizontalTitleClass}>Active</StepperTitle>
          </StepperTrigger>
          <StepperSeparator className={horizontalSeparatorClass} />
        </StepperItem>
        <StepperItem className={horizontalItemClass} step={3}>
          <StepperTrigger className={horizontalTriggerClass}>
            <StepperIndicator className={horizontalIndicatorClass}>3</StepperIndicator>
            <StepperTitle className={horizontalTitleClass}>Upcoming</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </StepperNav>
    </Stepper>
  ),
};

/** `disabled` blocks activation for specific steps. */
/** `loading` on the **active** `StepperItem` shows the `indicators.loading` slot (or children fallback). */
export const ItemPropsLoading: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-micro">
      <p className="text-xs text-muted-foreground">Only the active step can be in a loading state.</p>
      <Stepper
        className="w-full"
        defaultValue={1}
        indicators={{ loading: <Spinner className="size-3.5 text-primary-foreground" /> }}
      >
        <StepperNav>
          <StepperItem className={horizontalItemClass} step={1} loading>
            <StepperTrigger className={horizontalTriggerClass}>
              <StepperIndicator className={horizontalIndicatorClass}>1</StepperIndicator>
              <StepperTitle className={horizontalTitleClass}>Submitting…</StepperTitle>
            </StepperTrigger>
          </StepperItem>
        </StepperNav>
      </Stepper>
    </div>
  ),
};

export const ItemPropsDisabled: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-micro">
      <p className="text-xs text-muted-foreground">Step 2 is disabled: click does not change value when active elsewhere.</p>
      <Stepper className="w-full" defaultValue={1} orientation="horizontal" indicators={horizontalIndicators}>
        <StepperNav>
          {[
            { s: 1, t: "Open" },
            { s: 2, t: "Locked" },
            { s: 3, t: "End" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} className={horizontalItemClass} disabled={r.s === 2} step={r.s}>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>{r.s}</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>{r.t}</StepperTitle>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </div>
  ),
};

/** Dots/numbers only — narrow toolbars. */
export const IndicatorsOnly: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Stepper className="w-full" defaultValue={3} orientation="horizontal" indicators={horizontalIndicators}>
        <StepperNav>
          {[
            { s: 1, v: 1 },
            { s: 2, v: 2 },
            { s: 3, v: 3 },
            { s: 4, v: 4 },
            { s: 5, v: 5 },
          ].map((r, i, a) => (
            <StepperItem key={r.s} className={horizontalItemClass} step={r.s}>
              <StepperTrigger aria-label={`Step ${r.s}`} className={cn(horizontalTriggerClass, "min-h-0")}>
                <StepperIndicator className={horizontalIndicatorClass}>{r.v}</StepperIndicator>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </div>
  ),
};

/** `StepperPanel` + one `StepperContent` per step. */
export const WithPanel: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-section">
      <Stepper className="w-full" defaultValue={1} indicators={horizontalIndicators}>
        <StepperNav>
          {[
            { s: 1, t: "A" },
            { s: 2, t: "B" },
            { s: 3, t: "C" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} className={horizontalItemClass} step={r.s}>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>{r.s}</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>Panel {r.t}</StepperTitle>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel className="mt-section rounded-lg border border-border bg-muted/20 p-section text-sm text-foreground">
          <StepperContent value={1}>Content for step 1. Switch step above.</StepperContent>
          <StepperContent value={2}>Content for step 2.</StepperContent>
          <StepperContent value={3}>Content for step 3.</StepperContent>
        </StepperPanel>
      </Stepper>
    </div>
  ),
};

/**
 * `forceMount` keeps inert content in the DOM (e.g. preserve form state); inactive panels
 * are `hidden` until the step is active.
 */
export const WithPanelForceMount: Story = {
  render: function ForceMount() {
    const [v, setV] = useState(1);
    return (
      <div className="w-full max-w-2xl space-y-section">
        <p className="text-xs text-muted-foreground">Both panels stay mounted; only one is visible.</p>
        <Stepper className="w-full" value={v} onValueChange={setV} indicators={horizontalIndicators}>
          <StepperNav>
            <StepperItem className={horizontalItemClass} step={1}>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>1</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>Form A</StepperTitle>
              </StepperTrigger>
              <StepperSeparator className={horizontalSeparatorClass} />
            </StepperItem>
            <StepperItem className={horizontalItemClass} step={2}>
              <StepperTrigger className={horizontalTriggerClass}>
                <StepperIndicator className={horizontalIndicatorClass}>2</StepperIndicator>
                <StepperTitle className={horizontalTitleClass}>Form B</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperNav>
          <StepperPanel className="mt-section space-y-component rounded-lg border p-section">
            <StepperContent value={1} forceMount>
              <input
                className={cn("w-full rounded border border-border bg-background px-component py-micro text-sm")}
                placeholder="Type here — value persists when switching…"
                defaultValue=""
                aria-label="Preserved field 1"
              />
            </StepperContent>
            <StepperContent value={2} forceMount>
              <input
                className="w-full rounded border border-border bg-background px-component py-micro text-sm"
                placeholder="Second form"
                defaultValue=""
                aria-label="Preserved field 2"
              />
            </StepperContent>
          </StepperPanel>
        </Stepper>
      </div>
    );
  },
};

/**
 * Interactively change `defaultValue` and `orientation` from the Controls table.
 * (Storybook shows initial step only; changing controls remounts the uncontrolled `Stepper`.)
 */
export const Playground: Story = {
  render: (args) => {
    const a = args as { defaultValue?: number; orientation?: "horizontal" | "vertical" };
    const orientation = a.orientation ?? "horizontal";
    const defaultValue = a.defaultValue ?? 1;
    const isHorizontal = orientation === "horizontal";
    return (
      <div className={cn("w-full", orientation === "vertical" && "max-w-4xl")}>
        <Stepper
          className="w-full"
          defaultValue={defaultValue}
          orientation={orientation}
          indicators={horizontalIndicators}
        >
          <StepperNav>
            {[1, 2, 3, 4].map((n, i, arr) =>
              isHorizontal ? (
                <StepperItem key={n} className={horizontalItemClass} step={n}>
                  <StepperTrigger className={horizontalTriggerClass}>
                    <StepperIndicator className={horizontalIndicatorClass}>{n}</StepperIndicator>
                    <StepperTitle className={horizontalTitleClass}>Step {n}</StepperTitle>
                  </StepperTrigger>
                  {i < arr.length - 1 ? <StepperSeparator className={horizontalSeparatorClass} /> : null}
                </StepperItem>
              ) : (
                <StepperItem key={n} className={verticalItemClass} step={n}>
                  <div className={verticalRowClass}>
                    <StepperTrigger className={verticalTriggerClass}>
                      <StepperIndicator className={horizontalIndicatorClass}>{n}</StepperIndicator>
                    </StepperTrigger>
                    <div className="min-w-0 flex-1 text-left">
                      <StepperTitle className="line-clamp-2">Step {n}</StepperTitle>
                    </div>
                  </div>
                  {i < arr.length - 1 ? <StepperSeparator className={verticalSeparatorClass} /> : null}
                </StepperItem>
              )
            )}
          </StepperNav>
        </Stepper>
      </div>
    );
  },
  args: {
    defaultValue: 2,
    orientation: "horizontal",
  },
  argTypes: {
    defaultValue: {
      control: { type: "number", min: 1, max: 4 },
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"] as const,
    },
  },
};
