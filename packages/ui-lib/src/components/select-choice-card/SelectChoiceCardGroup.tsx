import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { FieldLegend, FieldSet, RadioGroup } from "@procertus-ui/ui";

import type { ChoiceSelectionMode } from "./useChoiceSelection";

export type SelectChoiceCardGroupProps = Omit<ComponentProps<typeof RadioGroup>, "children"> & {
  className?: string;
  children: ReactNode;
  /**
   * Visible group title; renders a `legend` as the first child of the fieldset.
   */
  legend?: string;
  /** Renders as supportive copy under the legend. */
  hint?: string;
  /**
   * `stack` — one column. `grid` — responsive multi-column for equal card widths.
   * @default "stack"
   */
  layout?: "stack" | "grid";
  /**
   * **single** — inner `RadioGroup` (one value). **multiple** — `role="group"` div; pair each
   * {@link SelectChoiceCard} with `selectionMode="multiple"` and `checked` / `onCheckedChange`.
   * When `multiple`, `value` / `onValueChange` / `defaultValue` on this component are ignored.
   * @default "single"
   */
  selectionMode?: ChoiceSelectionMode;
};

const layoutClass = (layout: "stack" | "grid") =>
  cn(
    "w-full gap-component p-0",
    layout === "grid" && "grid grid-cols-1 gap-component md:grid-cols-2 xl:grid-cols-3",
    layout === "stack" && "flex flex-col",
  );

/**
 * `fieldset` + either a `RadioGroup` (single) or a grouping `div` (multiple).
 */
export function SelectChoiceCardGroup({
  className,
  legend,
  hint,
  layout = "stack",
  selectionMode = "single",
  children,
  ...radioRest
}: SelectChoiceCardGroupProps) {
  return (
    <FieldSet className="w-full min-w-0">
      {legend ? <FieldLegend className="text-base font-semibold">{legend}</FieldLegend> : null}
      {hint ? <p className="mb-component text-sm text-muted-foreground">{hint}</p> : null}
      {selectionMode === "multiple" ? (
        <div role="group" className={cn(layoutClass(layout), className)}>
          {children}
        </div>
      ) : (
        <RadioGroup className={cn(layoutClass(layout), className)} {...radioRest}>
          {children}
        </RadioGroup>
      )}
    </FieldSet>
  );
}
