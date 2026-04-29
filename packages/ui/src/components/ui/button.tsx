import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // Structure
    "group/button inline-flex shrink-0 items-center justify-center border border-transparent text-sm leading-none font-semibold uppercase tracking-wider text-box-trim-cap whitespace-nowrap outline-none select-none",
    // Blueprint State: 8px idle radius, 300ms ease-out transition, deep-corner token
    "rounded-[8px] [--cmd-deep:16px] transition-[color,background-color,border-color,border-radius,box-shadow,transform] duration-300 ease-out",
    // Command Confirm: mechanical travel on press (pulse animation lives on the primary variant only)
    "active:not-aria-[haspopup]:translate-y-[1px] active:not-aria-[haspopup]:duration-0",
    // Standard states
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive-foreground aria-invalid:ring-3 aria-invalid:ring-destructive-foreground/20 dark:aria-invalid:border-destructive-foreground/50 dark:aria-invalid:ring-destructive-foreground/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:stroke-[1.33px]",
    // Disable corner-shift animation on dropdown / popover triggers (Radix sets aria-haspopup on them)
    "aria-[haspopup]:hover:!rounded-[8px]",
  ].join(" "),
  {
    variants: {
      variant: {
        // Forward Curve: TL/BR deep, TR/BL sharp (forward-moving actions)
        default:
          "bg-clip-padding bg-primary text-primary-foreground hover:bg-primary/80 hover:rounded-tl-[var(--cmd-deep)] hover:rounded-br-[var(--cmd-deep)] hover:rounded-tr-[4px] hover:rounded-bl-[4px] data-[pulsing]:not-aria-[haspopup]:animate-[command-pulse_800ms_ease-out]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-destructive/60 focus-visible:ring-destructive/30 dark:bg-destructive dark:hover:bg-destructive/90 dark:focus-visible:ring-destructive/40 hover:rounded-tl-[var(--cmd-deep)] hover:rounded-br-[var(--cmd-deep)] hover:rounded-tr-[4px] hover:rounded-bl-[4px]",
        // Reciprocal Curve: TR/BL deep, TL/BR sharp (supporting/backward actions)
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 hover:rounded-tr-[var(--cmd-deep)] hover:rounded-bl-[var(--cmd-deep)] hover:rounded-tl-[4px] hover:rounded-br-[4px]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground hover:rounded-tr-[var(--cmd-deep)] hover:rounded-bl-[var(--cmd-deep)] hover:rounded-tl-[4px] hover:rounded-br-[4px]",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 hover:rounded-tr-[var(--cmd-deep)] hover:rounded-bl-[var(--cmd-deep)] hover:rounded-tl-[4px] hover:rounded-br-[4px]",
        link: "h-auto !rounded-none border-0 px-0 font-medium normal-case tracking-normal text-accent-foreground underline-offset-4 hover:!rounded-none hover:underline hover:text-accent-foreground/80 active:!rounded-none",
      },
      size: {
        default:
          "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 px-2.5 text-xs [--cmd-deep:10px] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 text-[0.8rem] [--cmd-deep:12px] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9",
        "icon-xs":
          "size-7 [--cmd-deep:10px] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 [--cmd-deep:12px] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ref,
  onPointerDown,
  onKeyDown,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const innerRef = React.useRef<HTMLButtonElement | null>(null);

  const setRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref && "current" in ref)
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
          node;
    },
    [ref],
  );

  const triggerPulse = () => {
    const el = innerRef.current;
    if (!el) return;
    el.removeAttribute("data-pulsing");
    // Force reflow so rapid re-presses restart the animation instead of
    // the browser collapsing the attribute toggle into a no-op.
    void el.offsetWidth;
    el.setAttribute("data-pulsing", "true");
  };

  return (
    <Comp
      ref={setRef}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerDown={(e) => {
        if (e.button === 0 && !e.currentTarget.disabled) triggerPulse();
        onPointerDown?.(e);
      }}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) triggerPulse();
        onKeyDown?.(e);
      }}
      {...props}
    />
  );
}

export { Button, buttonVariants };
