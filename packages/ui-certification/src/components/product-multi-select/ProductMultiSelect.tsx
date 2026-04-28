/**
 * Multi-select of product / product-type rows. Each check adds a line your parent maps to a
 * **draft** certification request. Presentational: parent controls `selectedIds` and
 * `onChange`.
 */
import { useId } from "react";

import {
  FieldSet,
  cn,
} from "@procertus-ui/ui";
import { SelectChoiceCard, SelectChoiceCardGroup } from "@procertus-ui/ui-lib";

export type ProductMultiSelectOption = {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type ProductMultiSelectProps = {
  className?: string;
  /** Ids the user has checked. */
  selectedIds: readonly string[];
  onChange: (ids: string[]) => void;
  options: ProductMultiSelectOption[];
  /** Fieldset / group heading. */
  legend: string;
  description?: string;
  /** Renders when `options` is empty. */
  emptyMessage?: string;
  /** Optional name for native form / testing. */
  name?: string;
};

function toggleIn(ids: readonly string[], id: string, on: boolean): string[] {
  if (on) {
    if (ids.includes(id)) {
      return [...ids];
    }
    return [...ids, id];
  }
  return ids.filter((x) => x !== id);
}

export function ProductMultiSelect({
  className,
  selectedIds,
  onChange,
  options,
  legend,
  description,
  emptyMessage = "No options to select.",
  name: nameProp,
}: ProductMultiSelectProps) {
  const set = new Set(selectedIds);
  const base = useId();
  const name = nameProp ?? `pms-${base}`;

  if (options.length === 0) {
    return (
      <FieldSet className={cn("w-full min-w-0", className)}>
        <div className="mb-component space-y-micro">
          <div className="text-base font-semibold">{legend}</div>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <p className="rounded-md border border-dashed border-border/60 px-component py-section text-sm text-muted-foreground">{emptyMessage}</p>
      </FieldSet>
    );
  }

  return (
    <SelectChoiceCardGroup
      selectionMode="multiple"
      legend={legend}
      hint={description}
      className={cn("max-h-[min(50vh,28rem)] overflow-y-auto rounded-md border border-border/50 p-micro", className)}
    >
      {options.map((opt) => {
        const cbId = `${name}-${opt.id}`;
        const checked = set.has(opt.id);
        return (
          <SelectChoiceCard
            key={opt.id}
            selectionMode="multiple"
            value={opt.id}
            controlId={cbId}
            name={name}
            title={opt.label}
            description={opt.description}
            checked={checked}
            disabled={opt.disabled}
            emphasis={opt.disabled ? "tertiary" : "primary"}
            onCheckedChange={(isChecked) => {
              if (opt.disabled) return;
              onChange(toggleIn(selectedIds, opt.id, isChecked));
            }}
          />
        );
      })}
    </SelectChoiceCardGroup>
  );
}
