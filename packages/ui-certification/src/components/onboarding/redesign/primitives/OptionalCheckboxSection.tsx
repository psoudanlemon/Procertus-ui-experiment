/**
 * Redesign-variant van `IdentificatieOptionalBlock`: zelfde "rij + optionele
 * onderliggende content" patroon, maar gestuurd door een checkbox in plaats
 * van een Switch. Reden: de Switch suggereert een systeeminstelling, terwijl
 * dit conceptueel een "ik wil extra info opgeven"-keuze is.
 *
 * Niet gebruikt in productie — leeft alleen in redesign-stories tot het
 * ontwerp is goedgekeurd.
 */
import { Checkbox, cn } from "@procertus-ui/ui";
import type { ReactNode } from "react";

export type OptionalCheckboxSectionProps = {
  checkboxId: string;
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  headerTrailing?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  disabledHint?: string;
  className?: string;
};

export function OptionalCheckboxSection({
  checkboxId,
  title,
  description,
  checked,
  onCheckedChange,
  headerTrailing,
  children,
  disabled = false,
  disabledHint,
  className,
}: OptionalCheckboxSectionProps) {
  const labelId = `${checkboxId}-label`;
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-muted/20 transition-colors",
        checked && !disabled && "border-border/80 bg-card",
        className,
      )}
      aria-labelledby={labelId}
      aria-disabled={disabled ? true : undefined}
    >
      <div
        className={cn(
          "flex items-start gap-3 p-4",
          disabled ? "opacity-60" : undefined,
        )}
      >
        <Checkbox
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(v) => {
            if (disabled) return;
            onCheckedChange(v === true);
          }}
          className="mt-0.5 shrink-0"
          aria-labelledby={labelId}
        />
        <label
          htmlFor={checkboxId}
          className={cn(
            "min-w-0 flex-1 space-y-1",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <span
            id={labelId}
            className="block text-sm leading-snug font-medium text-foreground"
          >
            {title}
          </span>
          {description ? (
            <span className="block text-xs leading-relaxed text-muted-foreground">
              {description}
            </span>
          ) : null}
          {disabled && disabledHint ? (
            <span className="block text-xs leading-relaxed text-muted-foreground">
              {disabledHint}
            </span>
          ) : null}
        </label>
        {headerTrailing ? (
          <div className="flex shrink-0 items-start">{headerTrailing}</div>
        ) : null}
      </div>
      {checked && !disabled ? (
        <div className="space-y-4 border-t border-border/60 px-4 pt-4 pb-4">{children}</div>
      ) : null}
    </section>
  );
}
