import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "group/card flex flex-col gap-section overflow-hidden rounded-xl py-section text-sm text-card-foreground has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
  {
    variants: {
      variant: {
        default: "bg-card ring-1 ring-foreground/10",
        outlined: "border border-border bg-card",
        subtle: "border border-border/60 bg-muted/5",
        muted: "border border-border bg-muted/30",
        elevated: "border border-border bg-card shadow-proc-glow-tactile",
        faded: "border border-dashed border-muted-foreground/40 bg-card opacity-90",
      },
      interactive: {
        true: "w-full cursor-pointer text-left outline-none transition-[box-shadow,transform,border-color,background-color,opacity,--tw-ring-color] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        interactive: true,
        className: "hover:shadow-proc-sm hover:ring-foreground/25",
      },
      {
        variant: "outlined",
        interactive: true,
        className: "hover:shadow-proc-sm hover:border-foreground/25",
      },
      {
        variant: "subtle",
        interactive: true,
        className: "hover:shadow-proc-sm hover:border-foreground/25 hover:bg-card",
      },
      {
        variant: "muted",
        interactive: true,
        className: "hover:shadow-proc-sm hover:border-foreground/25 hover:bg-muted/50",
      },
      {
        variant: "elevated",
        interactive: true,
        className: "hover:shadow-proc-glow-xs hover:border-accent-foreground",
      },
      {
        variant: "faded",
        interactive: true,
        className: "hover:opacity-100 hover:border-solid hover:border-accent-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  },
);

function Card({
  className,
  variant,
  interactive,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="card"
      data-variant={variant ?? "default"}
      data-interactive={interactive ? "true" : undefined}
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-section has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-section",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-base leading-snug font-medium", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-section", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center rounded-b-xl border-t bg-muted/50 p-section", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};
