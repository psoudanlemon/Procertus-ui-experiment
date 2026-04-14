import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin [animation-duration:2s] [animation-timing-function:ease-out] text-muted-foreground", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function Spinner({
  className,
  size = "default",
  ...props
}: Omit<HugeiconsIconProps, "icon"> & VariantProps<typeof spinnerVariants>) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      data-slot="spinner"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
