import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-muted-foreground", {
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
}: React.ComponentProps<"svg"> & VariantProps<typeof spinnerVariants>) {
  return (
    <LoaderCircleIcon
      data-slot="spinner"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
