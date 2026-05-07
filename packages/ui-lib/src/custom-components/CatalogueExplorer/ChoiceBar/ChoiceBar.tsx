/**
 * Horizontal pill-bar of single-select choices, built from `SelectChoiceCard`
 * (minimal appearance) inside a `FadingScrollList`. Per-item `variant`
 * (`elevated` / `default` / `faded` / `ghost` / `no-border`) lets callers tier
 * the options — selection state is rendered uniformly by the choice-card
 * chrome itself (no variant swap on select).
 *
 * **Design system:** primitives sourced from `@procertus-ui/ui`
 * (`SelectChoiceCardGroup` for radio semantics, `FadingScrollList` for
 * overflow affordance).
 */
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  FadingScrollList,
  SelectChoiceCard,
  SelectChoiceCardGroup,
  type SelectChoiceVariant,
} from "@procertus-ui/ui";

export type ChoiceBarItem = {
  /** Option id, used as the `RadioGroupItem` value. */
  value: string;
  /** Pill label. */
  label: ReactNode;
  /**
   * @default "default" — same vocabulary as `SelectChoiceCard`. Use `elevated`
   * for primary tier, `faded` for de-emphasized siblings, and `ghost` for an
   * overflow / "other" option at the end of the bar.
   */
  variant?: SelectChoiceVariant;
  disabled?: boolean;
};

export type ChoiceBarProps = {
  items: readonly ChoiceBarItem[];
  /** Currently selected `value`. */
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name for the underlying radio group. */
  "aria-label": string;
  /** Class applied to the outer `FadingScrollList` wrapper. */
  className?: string;
  /**
   * Tailwind `from-*` color class matching the surrounding surface so the
   * scroll-edge gradients melt into it.
   * @default "from-background"
   */
  fadeColor?: string;
};

export function ChoiceBar({
  items,
  value,
  onValueChange,
  className,
  fadeColor = "from-background",
  "aria-label": ariaLabel,
}: ChoiceBarProps) {
  const idPrefix = useId();

  return (
    <FadingScrollList
      orientation="horizontal"
      fadeColor={fadeColor}
      wrapperClassName={className}
    >
      <SelectChoiceCardGroup
        layout="stack"
        value={value}
        onValueChange={onValueChange}
        aria-label={ariaLabel}
        className="flex-row flex-nowrap gap-component"
      >
        {items.map((item) => (
          <SelectChoiceCard
            key={item.value}
            value={item.value}
            controlId={`${idPrefix}-${item.value}`}
            title={item.label}
            variant={item.variant ?? "default"}
            appearance="minimal"
            disabled={item.disabled}
            className={cn("shrink-0 has-[>[data-slot=field]]:w-auto")}
          />
        ))}
      </SelectChoiceCardGroup>
    </FadingScrollList>
  );
}
