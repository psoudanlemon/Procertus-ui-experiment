import * as React from "react";
import { Tick02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

const inputClasses =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-1.5 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:not-disabled:not-focus-visible:not-aria-invalid:border-ring focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive-foreground aria-invalid:ring-3 aria-invalid:ring-destructive-foreground/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive-foreground/50 dark:aria-invalid:ring-destructive-foreground/40";

type InputState = "valid" | "invalid";

type InputProps = React.ComponentProps<"input"> & {
  state?: InputState;
};

function Input({ className, type, state, "aria-invalid": ariaInvalid, ...props }: InputProps) {
  if (!state) {
    return (
      <input
        type={type}
        data-slot="input"
        aria-invalid={ariaInvalid}
        className={cn(inputClasses, className)}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="input-wrapper"
      data-state={state}
      className={cn("relative w-full", className)}
    >
      <input
        type={type}
        data-slot="input"
        aria-invalid={state === "invalid" ? true : ariaInvalid}
        className={cn(inputClasses, "pr-9")}
        {...props}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      >
        {state === "valid" ? (
          <HugeiconsIcon
            icon={Tick02Icon}
            className="size-4 text-sys-success-700 dark:text-sys-success-300"
            strokeWidth={2.5}
          />
        ) : (
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="size-4 text-destructive-foreground"
          />
        )}
      </span>
    </div>
  );
}

export { Input };
