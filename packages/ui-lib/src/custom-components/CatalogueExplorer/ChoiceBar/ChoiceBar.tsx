/**
 * Horizontal pill-bar of single-select choices, built from `SelectChoiceCard`
 * (minimal appearance) inside a `FadingScrollList`. Per-item `variant`
 * (`elevated` / `default` / `faded` / `ghost` / `no-border`) lets callers tier
 * the options — selection state is rendered uniformly by the choice-card
 * chrome itself (no variant swap on select).
 *
 * Trailing prev/next icon buttons step linearly through enabled items,
 * disabling at the boundaries and auto-scrolling the new active pill into
 * view inside the fading scroll container.
 *
 * **Design system:** primitives sourced from `@procertus-ui/ui`
 * (`SelectChoiceCardGroup` for radio semantics, `FadingScrollList` for
 * overflow affordance, `Button` for the icon nav).
 */
import { useId, useRef, type ReactNode } from "react";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import {
  Button,
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
  /** Class applied to the outer wrapper (flex row containing the scroll list + nav buttons). */
  className?: string;
  /**
   * Tailwind `from-*` color class matching the surrounding surface so the
   * scroll-edge gradients melt into it.
   * @default "from-background"
   */
  fadeColor?: string;
  /**
   * Accessible labels for the prev/next nav icon buttons. Override per-locale.
   * @default { prev: "Previous option", next: "Next option" }
   */
  navLabels?: { prev: string; next: string };
};

export function ChoiceBar({
  items,
  value,
  onValueChange,
  className,
  fadeColor = "from-background",
  "aria-label": ariaLabel,
  navLabels = { prev: "Previous option", next: "Next option" },
}: ChoiceBarProps) {
  const idPrefix = useId();
  const groupRef = useRef<HTMLDivElement>(null);

  const enabledValues = items.filter((item) => !item.disabled).map((item) => item.value);
  const currentIndex = enabledValues.indexOf(value);
  const prevValue = currentIndex > 0 ? enabledValues[currentIndex - 1] : undefined;
  const nextValue =
    currentIndex >= 0 && currentIndex < enabledValues.length - 1
      ? enabledValues[currentIndex + 1]
      : undefined;

  const step = (target: string | undefined) => {
    if (!target) return;
    onValueChange(target);
    requestAnimationFrame(() => {
      const container = groupRef.current;
      if (!container) return;
      const el = container.querySelector<HTMLElement>(
        `label[for="${idPrefix}-${target}"]`,
      );
      el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  };

  return (
    <div className={cn("flex w-full min-w-0 items-center gap-component", className)}>
      <FadingScrollList
        orientation="horizontal"
        fadeColor={fadeColor}
        wrapperClassName="min-w-0 flex-1"
        className="-my-2 py-2"
      >
        <div ref={groupRef}>
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
                className={cn(
                  "shrink-0 cursor-pointer has-[>[data-slot=field]]:w-auto",
                  "transition-[transform,box-shadow,background-color,border-color,opacity] duration-300 ease-out",
                  "motion-safe:hover:-translate-y-0.5",
                )}
              />
            ))}
          </SelectChoiceCardGroup>
        </div>
      </FadingScrollList>
      <div className="hidden shrink-0 items-center gap-component sm:flex">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="bg-card"
          aria-label={navLabels.prev}
          disabled={!prevValue}
          onClick={() => step(prevValue)}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="bg-card"
          aria-label={navLabels.next}
          disabled={!nextValue}
          onClick={() => step(nextValue)}
        >
          <HugeiconsIcon icon={ArrowRight02Icon} />
        </Button>
      </div>
    </div>
  );
}
