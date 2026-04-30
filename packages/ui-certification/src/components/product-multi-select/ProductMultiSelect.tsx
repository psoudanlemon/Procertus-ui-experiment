/**
 * Multi-select of product / product-type rows. Each check adds a line your parent maps to a
 * **draft** certification request. Presentational: parent controls `selectedIds` and
 * `onChange`.
 */
import { useId } from "react";

import {
  FadingScrollList,
  FieldSet,
  cn,
} from "@procertus-ui/ui";
import { SelectChoiceCard, SelectChoiceCardGroup } from "@procertus-ui/ui";

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
  /** Fieldset / group heading. Omit when the surrounding container already provides the title. */
  legend?: string;
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
        {legend || description ? (
          <div className="mb-component space-y-micro">
            {legend ? <div className="text-base font-semibold">{legend}</div> : null}
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        ) : null}
        <p className="rounded-md border border-dashed border-border/60 px-component py-section text-sm text-muted-foreground">{emptyMessage}</p>
      </FieldSet>
    );
  }

  return (
    <FadingScrollList
      maxHeight="min(50vh, 28rem)"
      fadeColor="from-card"
      wrapperClassName={cn(className)}
      className="p-micro"
    >
      <SelectChoiceCardGroup
        selectionMode="multiple"
        legend={legend}
        hint={description}
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
              variant={opt.disabled ? "faded" : "default"}
              onCheckedChange={(isChecked) => {
                if (opt.disabled) return;
                onChange(toggleIn(selectedIds, opt.id, isChecked));
              }}
            />
          );
        })}
      </SelectChoiceCardGroup>
    </FadingScrollList>
  );
}
