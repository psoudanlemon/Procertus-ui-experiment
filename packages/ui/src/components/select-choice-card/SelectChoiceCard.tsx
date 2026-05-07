/**
 * Selectable choice card — **single** (`RadioGroup`) or **multiple** (`Checkbox`).
 * Same chrome (variant, hover, selected) for `appearance="default"` (inline radio + text),
 * `appearance="hero"` (two-zone: header strip with title + control, body strip with
 * description), and `appearance="minimal"` (title-only chip with the native control kept
 * accessible but visually hidden — `description` and `leading` are ignored). Pair with
 * {@link useChoiceSelection}.
 */
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

import type { ChoiceSelectionMode } from "./useChoiceSelection";

export type SelectChoiceAppearance = "default" | "hero" | "minimal";

const shellVariants = cva(
  "group/choice w-full select-none has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:bg-card has-[>[data-slot=field]]:transition-[box-shadow,background-color,border-color,opacity]",
  {
    variants: {
      appearance: {
        default: "*:data-[slot=field]:p-section",
        hero: "has-[>[data-slot=field]]:overflow-hidden has-[>[data-slot=field]]:rounded-xl *:data-[slot=field]:p-0",
        minimal: "*:data-[slot=field]:p-component",
      },
      variant: {
        elevated: [
          "has-[>[data-slot=field]]:border-border has-[>[data-slot=field]]:bg-card has-[>[data-slot=field]]:shadow-proc-sm not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:border-accent-foreground not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:bg-accent not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:text-accent-foreground has-data-checked:has-[>[data-slot=field]]:border-accent-foreground has-data-checked:has-[>[data-slot=field]]:text-accent-foreground",
          "has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:border-accent-foreground has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:text-accent-foreground",
        ],
        default: [
          "has-[>[data-slot=field]]:border-border has-[>[data-slot=field]]:bg-card not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:border-accent-foreground not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:bg-accent not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:text-accent-foreground has-data-checked:has-[>[data-slot=field]]:border-accent-foreground has-data-checked:has-[>[data-slot=field]]:text-accent-foreground",
          "has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:border-accent-foreground has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:text-accent-foreground",
        ],
        faded: [
          "opacity-90 has-[>[data-slot=field]]:border-dashed has-[>[data-slot=field]]:border-muted-foreground/40 not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:opacity-100 not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:border-accent-foreground not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:bg-accent not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:text-accent-foreground has-data-checked:opacity-100 has-data-checked:has-[>[data-slot=field]]:border-accent-foreground has-data-checked:has-[>[data-slot=field]]:text-accent-foreground",
          "has-[[data-state=checked][data-slot=checkbox]]:opacity-100 has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:border-accent-foreground has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:text-accent-foreground",
        ],
        ghost: [
          "has-[>[data-slot=field]]:border-transparent has-[>[data-slot=field]]:bg-transparent has-[>[data-slot=field]]:shadow-none has-[>[data-slot=field]]:text-muted-foreground not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:bg-accent not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:text-accent-foreground has-data-checked:has-[>[data-slot=field]]:text-accent-foreground",
          "has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:text-accent-foreground",
        ],
        "no-border": [
          "has-[>[data-slot=field]]:border-transparent has-[>[data-slot=field]]:bg-card has-[>[data-slot=field]]:shadow-none has-[>[data-slot=field]]:text-foreground not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:border-accent-foreground not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:bg-accent not-has-data-checked:not-has-[[data-state=checked][data-slot=checkbox]]:hover:has-[>[data-slot=field]]:text-accent-foreground has-data-checked:has-[>[data-slot=field]]:text-accent-foreground",
          "has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:text-accent-foreground",
        ],
      },
    },
    defaultVariants: { appearance: "default", variant: "default" },
  },
);

const titleVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      elevated: "",
      default: "",
      faded:
        "text-muted-foreground group-hover/choice:text-accent-foreground group-has-data-checked/choice:text-accent-foreground group-has-[[data-state=checked][data-slot=checkbox]]/choice:text-accent-foreground",
      ghost: "",
      "no-border": "",
    },
  },
  defaultVariants: { variant: "default" },
});

const descVariants = cva("text-sm", {
  variants: {
    variant: {
      elevated: "",
      default: "",
      faded: "text-xs",
      ghost: "",
      "no-border": "",
    },
  },
  defaultVariants: { variant: "default" },
});

export type SelectChoiceVariant = NonNullable<VariantProps<typeof shellVariants>["variant"]>;

export type SelectChoiceCardProps = {
  className?: string;
  /** Option id — `RadioGroupItem` value (single) or stable key for toggling (multiple). */
  value: string;
  /** Stable id for native control + label (`htmlFor`). */
  controlId: string;
  title: ReactNode;
  description?: ReactNode;
  /**
   * Inline icon for **default** layout (start column). Ignored when `appearance="hero"`.
   */
  leading?: ReactNode;
  /**
   * @default "default" — `elevated` adds a soft drop shadow, `faded` is dashed and
   * de-emphasized, `ghost` drops the surface entirely (no background, no border) and
   * uses muted-foreground text like `faded`, and `no-border` keeps the card surface
   * but suppresses the border. `ghost` and `no-border` shift the text to
   * `accent-foreground` on hover and when selected.
   */
  variant?: SelectChoiceVariant;
  /**
   * @default "default" — `hero` uses a two-zone (header + body) tier-card layout;
   * `minimal` shows only the title and keeps the native control accessible but
   * visually hidden (`description` and `leading` are ignored).
   */
  appearance?: SelectChoiceAppearance;
  /** @default "leading" — only applies when `appearance="default"`; ignored for hero. */
  controlPosition?: "leading" | "trailing";
  /** @default "single" — use with `RadioGroup`; `multiple` uses `Checkbox` + `checked` props. */
  selectionMode?: ChoiceSelectionMode;
  disabled?: boolean;
  /** Multiple mode — controlled checked state */
  checked?: boolean;
  /** Multiple mode — toggle handler */
  onCheckedChange?: (checked: boolean) => void;
  /** Native control name, useful for checkbox groups and tests. */
  name?: string;
};

export function SelectChoiceCard({
  className,
  value,
  controlId,
  title,
  description,
  leading,
  variant = "default",
  appearance = "default",
  controlPosition = "leading",
  selectionMode = "single",
  disabled = false,
  checked,
  onCheckedChange,
  name,
}: SelectChoiceCardProps) {
  const isHero = appearance === "hero";
  const isMinimal = appearance === "minimal";
  const isMultiple = selectionMode === "multiple";

  const controlClass = isHero || isMinimal ? undefined : "mt-micro";

  const rawControl = isMultiple ? (
    <Checkbox
      name={name}
      id={controlId}
      checked={checked}
      onCheckedChange={(s) => onCheckedChange?.(s === true)}
      disabled={disabled}
      className={controlClass}
    />
  ) : (
    <RadioGroupItem value={value} id={controlId} disabled={disabled} className={controlClass} />
  );

  // In minimal appearance the native control stays in the DOM for keyboard + a11y,
  // but visually disappears AND must not occupy space. `sr-only` on the control
  // itself doesn't beat the control's own `relative size-4` classes via tailwind-merge,
  // so we wrap it in an absolutely-positioned (`sr-only`) span — that takes the
  // element out of the parent flex flow.
  const control = isMinimal ? <span className="sr-only">{rawControl}</span> : rawControl;

  const showLeading = !isHero && !isMinimal && leading;
  const titleLabelClass = cn(
    "block text-left text-sm font-medium normal-case leading-snug tracking-normal whitespace-normal wrap-break-word",
    variant === "faded" &&
      "text-muted-foreground group-hover/choice:text-accent-foreground group-has-data-checked/choice:text-accent-foreground group-has-[[data-state=checked][data-slot=checkbox]]/choice:text-accent-foreground",
  );

  return (
    <FieldLabel className={cn(shellVariants({ appearance, variant }), className)}>
      <Field
        data-choice-appearance={appearance}
        data-choice-variant={variant}
        orientation={isHero ? "vertical" : "horizontal"}
        className={cn(
          "items-stretch *:data-[slot=field-content]:min-w-0",
          isHero && "relative h-full",
          !isHero && "items-stretch",
          disabled && "opacity-55",
        )}
        data-disabled={disabled ? "true" : undefined}
      >
        {isHero ? (
          <div className="flex w-full flex-1 flex-col">
            <div
              className={cn(
                "flex w-full items-center justify-between gap-component border-b p-section transition-colors",
                variant === "ghost"
                  ? "border-transparent group-hover/choice:border-border/60 group-has-data-checked/choice:border-border/60 group-has-[[data-state=checked][data-slot=checkbox]]/choice:border-border/60"
                  : "border-border/60",
              )}
            >
              <FieldTitle className={cn(titleVariants({ variant }), "min-w-0")}>
                <Label htmlFor={controlId} className={cn(titleLabelClass, "text-base")}>
                  {title}
                </Label>
              </FieldTitle>
              {control}
            </div>
            {description ? (
              <div
                className={cn(
                  "w-full flex-1 p-section transition-colors",
                  variant === "ghost"
                    ? "group-hover/choice:bg-muted/20 group-has-data-checked/choice:bg-muted/20 group-has-[[data-state=checked][data-slot=checkbox]]/choice:bg-muted/20"
                    : "bg-muted/20",
                )}
              >
                <FieldDescription
                  className={cn(descVariants({ variant }), "whitespace-normal wrap-break-word")}
                >
                  {description}
                </FieldDescription>
              </div>
            ) : null}
          </div>
        ) : isMinimal ? (
          <>
            {control}
            <FieldContent>
              <FieldTitle className={titleVariants({ variant })}>
                <Label htmlFor={controlId} className={titleLabelClass}>
                  {title}
                </Label>
              </FieldTitle>
            </FieldContent>
          </>
        ) : (
          <>
            {controlPosition === "leading" ? control : null}
            <FieldContent
              className={cn(showLeading && "flex min-w-0 flex-row items-start gap-component")}
            >
              {showLeading ? (
                <div className="shrink-0 self-start pt-micro text-muted-foreground [&_svg]:size-5">
                  {leading}
                </div>
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col">
                <FieldTitle className={titleVariants({ variant })}>
                  <Label htmlFor={controlId} className={titleLabelClass}>
                    {title}
                  </Label>
                </FieldTitle>
                {description ? (
                  <FieldDescription
                    className={cn(descVariants({ variant }), "whitespace-normal wrap-break-word")}
                  >
                    {description}
                  </FieldDescription>
                ) : null}
              </div>
            </FieldContent>
            {controlPosition === "trailing" ? control : null}
          </>
        )}
      </Field>
    </FieldLabel>
  );
}
