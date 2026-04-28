import { Tick01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
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
  title: "reui/Stepper",
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

/** Uncontrolled: initial step via `defaultValue` only. */
export const Uncontrolled: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Stepper defaultValue={2} className="w-full">
        <StepperNav>
          {[
            { step: 1, label: "Start" },
            { step: 2, label: "Details" },
            { step: 3, label: "Done" },
          ].map((s, i, arr) => (
            <StepperItem key={s.step} step={s.step}>
              <StepperTrigger className="w-full min-w-0 max-w-full flex-col gap-micro sm:flex-row sm:items-center sm:gap-component">
                <StepperIndicator>{s.step}</StepperIndicator>
                <span className="sr-only sm:not-sr-only">
                  <StepperTitle className="text-left">{s.label}</StepperTitle>
                </span>
              </StepperTrigger>
              {i < arr.length - 1 ? <StepperSeparator /> : null}
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
        <Stepper className="w-full" value={value} onValueChange={setValue}>
          <StepperNav>
            {[
              { step: 1, title: "Account" },
              { step: 2, title: "Profile" },
              { step: 3, title: "Review" },
            ].map((s, i, arr) => (
              <StepperItem key={s.step} step={s.step}>
                <StepperTrigger>
                  <StepperIndicator />
                  <StepperTitle className="hidden min-w-0 sm:block">{s.title}</StepperTitle>
                </StepperTrigger>
                {i < arr.length - 1 ? <StepperSeparator /> : null}
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
    <Stepper className="w-full" defaultValue={1} orientation="horizontal">
      <StepperNav>
        {[
          { n: 1, t: "User details" },
          { n: 2, t: "Payment" },
          { n: 3, t: "Confirm" },
          { n: 4, t: "Receipt" },
        ].map((row, i, a) => (
          <StepperItem key={row.n} className="min-w-0 flex-1" step={row.n}>
            <StepperTrigger className="w-full min-w-0 max-w-md flex-col sm:flex-row sm:items-center">
              <StepperIndicator>{row.n}</StepperIndicator>
              <StepperTitle className="line-clamp-2 w-full min-w-0 text-center sm:text-left">{row.t}</StepperTitle>
            </StepperTrigger>
            {i < a.length - 1 ? <StepperSeparator /> : null}
          </StepperItem>
        ))}
      </StepperNav>
    </Stepper>
  ),
};

/** Titles and descriptions under each label (ReUI “Title & description”). */
export const HorizontalTitleAndDescription: Story = {
  render: () => (
    <Stepper className="w-full" defaultValue={2} orientation="horizontal">
      <StepperNav>
        {[
          { s: 1, title: "Account", desc: "Email and password" },
          { s: 2, title: "Profile", desc: "Organization" },
          { s: 3, title: "Complete", desc: "Review" },
        ].map((r, i, a) => (
          <StepperItem key={r.s} className="min-w-0 flex-1" step={r.s}>
            <StepperTrigger className="w-full min-w-0 max-w-sm flex-col items-stretch sm:flex-row sm:items-start">
              <div className="flex shrink-0 items-start gap-component">
                <StepperIndicator />
                <div className="min-w-0 space-y-micro text-left">
                  <StepperTitle>{r.title}</StepperTitle>
                  <StepperDescription className="line-clamp-2 text-xs leading-[1.5]">{r.desc}</StepperDescription>
                </div>
              </div>
            </StepperTrigger>
            {i < a.length - 1 ? <StepperSeparator /> : null}
          </StepperItem>
        ))}
      </StepperNav>
    </Stepper>
  ),
};

/** Read-heavy vertical rail (e.g. beside a form or `StepLayout` with `stepperPosition="start"`). */
export const Vertical: Story = {
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-section md:flex-row">
      <Stepper className="w-full max-w-full shrink-0 md:max-w-[12rem]" defaultValue={2} orientation="vertical">
        <StepperNav>
          {[
            { s: 1, t: "Start" },
            { s: 2, t: "Middle" },
            { s: 3, t: "End" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} className="w-full" step={r.s}>
              <StepperTrigger className="w-full flex-row items-center justify-start text-left">
                <StepperIndicator>{r.s}</StepperIndicator>
                <div className="min-w-0 pl-0">
                  <StepperTitle className="line-clamp-2">{r.t}</StepperTitle>
                </div>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
      <p className="min-h-20 flex-1 rounded-xl border border-border bg-card p-section text-sm text-muted-foreground">
        Main content (form, `StepperContent`, or shell) sits beside the vertical stepper.
      </p>
    </div>
  ),
};

/** Vertical: title + short description in the rail. */
export const VerticalTitleAndDescription: Story = {
  render: () => (
    <div className="flex w-full max-w-2xl flex-col gap-component md:flex-row">
      <Stepper className="w-full max-w-full shrink-0 md:max-w-xs" defaultValue={2} orientation="vertical">
        <StepperNav>
          {[
            { s: 1, t: "Basics", d: "Name and country" },
            { s: 2, t: "Compliance", d: "Policies" },
            { s: 3, t: "Sign off", d: "Confirm" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} className="w-full" step={r.s}>
              <StepperTrigger className="w-full min-w-0 max-w-sm flex-col items-stretch !gap-component !rounded-md py-micro">
                <div className="flex items-start gap-component">
                  <StepperIndicator>{r.s}</StepperIndicator>
                  <div className="min-w-0 space-y-micro text-left">
                    <StepperTitle>{r.t}</StepperTitle>
                    <StepperDescription className="line-clamp-2 text-xs">{r.d}</StepperDescription>
                  </div>
                </div>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
      <p className="min-h-24 flex-1 rounded-lg border border-dashed border-border p-section text-xs text-muted-foreground">
        Map 0-based flow state to this stepper with <code className="text-foreground">value = activeStep + 1</code> (or use
        `OnboardingStepper` in ui-lib).
      </p>
    </div>
  ),
};

/** All steps inert: display progress only. */
export const AllStepsNonInteractive: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-component text-xs text-muted-foreground">
      <Stepper className="w-full" value={2}>
        <StepperNav>
          {[
            { s: 1, t: "A" },
            { s: 2, t: "B" },
            { s: 3, t: "C" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} disabled step={r.s}>
              <StepperTrigger>
                <StepperIndicator>{r.s}</StepperIndicator>
                <StepperTitle>{r.t}</StepperTitle>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator /> : null}
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
            <StepperItem step={1}>
              <StepperTrigger>
                <StepperIndicator>1</StepperIndicator>
                <StepperTitle>Config</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            <StepperItem step={2} loading>
              <StepperTrigger>
                <StepperIndicator>2</StepperIndicator>
                <StepperTitle>Submitting</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            <StepperItem step={3}>
              <StepperTrigger>
                <StepperIndicator>3</StepperIndicator>
                <StepperTitle>Done</StepperTitle>
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
    <Stepper className="w-full" defaultValue={2} orientation="horizontal">
      <StepperNav>
        <StepperItem step={1} completed>
          <StepperTrigger>
            <StepperIndicator>1</StepperIndicator>
            <StepperTitle>Forced done</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem step={2}>
          <StepperTrigger>
            <StepperIndicator>2</StepperIndicator>
            <StepperTitle>Active</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem step={3}>
          <StepperTrigger>
            <StepperIndicator>3</StepperIndicator>
            <StepperTitle>Upcoming</StepperTitle>
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
          <StepperItem step={1} loading>
            <StepperTrigger>
              <StepperIndicator>1</StepperIndicator>
              <StepperTitle>Submitting…</StepperTitle>
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
      <Stepper className="w-full" defaultValue={1} orientation="horizontal">
        <StepperNav>
          {[
            { s: 1, t: "Open" },
            { s: 2, t: "Locked" },
            { s: 3, t: "End" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} disabled={r.s === 2} step={r.s}>
              <StepperTrigger>
                <StepperIndicator>{r.s}</StepperIndicator>
                <StepperTitle>{r.t}</StepperTitle>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator /> : null}
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
    <div className="w-full max-w-sm">
      <Stepper className="w-full" defaultValue={3} orientation="horizontal">
        <StepperNav>
          {[
            { s: 1, v: 1 },
            { s: 2, v: 2 },
            { s: 3, v: 3 },
            { s: 4, v: 4 },
            { s: 5, v: 5 },
          ].map((r, i, a) => (
            <StepperItem key={r.s} step={r.s}>
              <StepperTrigger aria-label={`Step ${r.s}`} className="!gap-0">
                <StepperIndicator>{r.v}</StepperIndicator>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator /> : null}
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
      <Stepper className="w-full" defaultValue={1}>
        <StepperNav>
          {[
            { s: 1, t: "A" },
            { s: 2, t: "B" },
            { s: 3, t: "C" },
          ].map((r, i, a) => (
            <StepperItem key={r.s} step={r.s}>
              <StepperTrigger>
                <StepperIndicator>{r.s}</StepperIndicator>
                <StepperTitle>Panel {r.t}</StepperTitle>
              </StepperTrigger>
              {i < a.length - 1 ? <StepperSeparator /> : null}
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
        <Stepper className="w-full" value={v} onValueChange={setV}>
          <StepperNav>
            <StepperItem step={1}>
              <StepperTrigger>
                <StepperIndicator>1</StepperIndicator>
                <StepperTitle>Form A</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            <StepperItem step={2}>
              <StepperTrigger>
                <StepperIndicator>2</StepperIndicator>
                <StepperTitle>Form B</StepperTitle>
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
    return (
      <div className={cn("w-full", orientation === "vertical" && "max-w-4xl")}>
        <Stepper
          className="w-full"
          defaultValue={defaultValue}
          orientation={orientation}
        >
          <StepperNav>
            {[1, 2, 3, 4].map((n, i, arr) => (
              <StepperItem key={n} step={n}>
                <StepperTrigger>
                  <StepperIndicator>{n}</StepperIndicator>
                  <StepperTitle>Step {n}</StepperTitle>
                </StepperTrigger>
                {i < arr.length - 1 ? <StepperSeparator /> : null}
              </StepperItem>
            ))}
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
