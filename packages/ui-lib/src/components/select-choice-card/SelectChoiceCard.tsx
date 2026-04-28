/**
 * Selectable choice card — **single** (`RadioGroup`) or **multiple** (`Checkbox`). Use
 * `appearance="hero"` for empty-state–style prominence (centered, large type, padding).
 * Pair with {@link useChoiceSelection} for selection state.
 */
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ChoiceSelectionMode } from "./useChoiceSelection";
import {
  Checkbox,
  EmptyIcon,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
  Label,
  RadioGroupItem,
} from "@procertus-ui/ui";

export type SelectChoiceAppearance = "default" | "hero";

const shellVariants = cva(
  "group/choice w-full select-none has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:transition-[box-shadow,background-color,border-color,opacity]",
  {
    variants: {
      appearance: {
        default: "*:data-[slot=field]:p-component",
        hero: [
          "has-[>[data-slot=field]]:flex has-[>[data-slot=field]]:min-h-[220px] has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:items-center has-[>[data-slot=field]]:justify-center *:data-[slot=field]:p-region",
          "has-[>[data-slot=field]]:rounded-xl",
        ],
      },
      emphasis: {
        primary: [
          "has-[>[data-slot=field]]:border-2 has-[>[data-slot=field]]:border-border has-[>[data-slot=field]]:shadow-proc-xs has-data-checked:has-[>[data-slot=field]]:border-primary/40 has-data-checked:has-[>[data-slot=field]]:bg-primary/5 has-data-checked:has-[>[data-slot=field]]:shadow-proc-tactile dark:has-data-checked:has-[>[data-slot=field]]:bg-primary/10",
          "has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:border-primary/40 has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:bg-primary/5 has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:shadow-proc-tactile",
        ],
        secondary: [
          "has-[>[data-slot=field]]:border-border/80 has-[>[data-slot=field]]:bg-card has-data-checked:has-[>[data-slot=field]]:border-primary/30 has-data-checked:has-[>[data-slot=field]]:bg-muted/40",
          "has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:border-primary/30 has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:bg-muted/40",
        ],
        tertiary: [
          "has-[>[data-slot=field]]:border-dashed has-[>[data-slot=field]]:border-muted-foreground/30 has-[>[data-slot=field]]:bg-muted/10 *:data-[slot=field]:p-component has-data-checked:has-[>[data-slot=field]]:border-primary/25 has-data-checked:has-[>[data-slot=field]]:bg-muted/25",
          "has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:border-primary/25 has-[[data-state=checked][data-slot=checkbox]]:has-[>[data-slot=field]]:bg-muted/25",
        ],
      },
    },
    compoundVariants: [
      {
        appearance: "hero",
        emphasis: "tertiary",
        class: "*:data-[slot=field]:!p-region",
      },
    ],
    defaultVariants: { appearance: "default", emphasis: "primary" },
  },
);

const titleVariants = cva("font-medium", {
  variants: {
    appearance: {
      default: "",
      hero: "text-xl font-semibold tracking-tight text-brand-primary-700 md:text-2xl dark:text-brand-primary-200",
    },
    emphasis: {
      primary: "",
      secondary: "",
      tertiary: "",
    },
  },
  compoundVariants: [
    {
      appearance: "default",
      emphasis: "primary",
      class: "text-base",
    },
    {
      appearance: "default",
      emphasis: "secondary",
      class: "text-sm",
    },
    {
      appearance: "default",
      emphasis: "tertiary",
      class: "text-sm font-medium text-muted-foreground",
    },
  ],
  defaultVariants: { appearance: "default", emphasis: "primary" },
});

const descVariants = cva("", {
  variants: {
    appearance: {
      default: "",
      hero: "mx-auto max-w-md text-base leading-relaxed text-muted-foreground",
    },
    emphasis: {
      primary: "text-sm",
      secondary: "text-sm",
      tertiary: "text-xs",
    },
  },
  compoundVariants: [
    {
      appearance: "hero",
      emphasis: "tertiary",
      class: "text-sm",
    },
  ],
  defaultVariants: { appearance: "default", emphasis: "primary" },
});

export type SelectChoiceEmphasis = NonNullable<VariantProps<typeof shellVariants>["emphasis"]>;

export type SelectChoiceCardProps = {
  className?: string;
  /** Option id — `RadioGroupItem` value (single) or stable key for toggling (multiple). */
  value: string;
  /** Stable id for native control + label (`htmlFor`). */
  controlId: string;
  title: ReactNode;
  description?: ReactNode;
  /**
   * Inline icon for **default** layout (start column). Ignored when `appearance="hero"` and `icon` is set.
   */
  leading?: ReactNode;
  /**
   * Prominent centered icon (Empty-style circular well), **hero** layout.
   */
  icon?: ReactNode;
  /** Styles the hero icon well as selected; useful when the hidden control is represented by the icon. */
  iconSelected?: boolean;
  /** @default "primary" */
  emphasis?: SelectChoiceEmphasis;
  /** @default "default" — `hero` uses larger centered type and padding (empty-state outline). */
  appearance?: SelectChoiceAppearance;
  /** @default "single" — use with `RadioGroup`; `multiple` uses `Checkbox` + `checked` props. */
  selectionMode?: ChoiceSelectionMode;
  disabled?: boolean;
  /** Multiple mode — controlled checked state */
  checked?: boolean;
  /** Multiple mode — toggle handler */
  onCheckedChange?: (checked: boolean) => void;
};

export function SelectChoiceCard({
  className,
  value,
  controlId,
  title,
  description,
  leading,
  icon,
  iconSelected = false,
  emphasis = "primary",
  appearance = "default",
  selectionMode = "single",
  disabled = false,
  checked,
  onCheckedChange,
}: SelectChoiceCardProps) {
  const isHero = appearance === "hero";
  const isMultiple = selectionMode === "multiple";

  const controlClass = cn(
    isHero && "sr-only",
    !isHero && "mt-micro",
  );

  const control =
    isMultiple ? (
      <Checkbox
        id={controlId}
        checked={checked}
        onCheckedChange={(s) => onCheckedChange?.(s === true)}
        disabled={disabled}
        className={controlClass}
      />
    ) : (
      <RadioGroupItem value={value} id={controlId} disabled={disabled} className={controlClass} />
    );

  const showHeroIcon = isHero && icon !== undefined && icon !== null;
  const showLeading = !isHero && leading;

  return (
    <FieldLabel className={cn(shellVariants({ appearance, emphasis }), className)}>
      <Field
        data-choice-appearance={appearance}
        data-choice-emphasis={emphasis}
        orientation={isHero ? "vertical" : "horizontal"}
        className={cn(
          "items-stretch *:data-[slot=field-content]:min-w-0",
          isHero && "relative",
          isHero && "items-center justify-center text-center",
          !isHero && "items-stretch",
        )}
        data-disabled={disabled ? "true" : undefined}
      >
        {control}
        <FieldContent
          className={cn(
            showLeading && "flex min-w-0 flex-row items-start gap-component",
            isHero && "flex w-full flex-col items-center gap-section text-center",
          )}
        >
          {showHeroIcon ? (
            <EmptyIcon
              className={cn(
                "shrink-0 transition-colors [&>svg]:size-7",
                iconSelected &&
                  "bg-primary text-primary-foreground ring-2 ring-primary/20 dark:bg-primary dark:text-primary-foreground",
                !iconSelected && "bg-transparent text-muted-foreground",
              )}
            >
              {icon}
            </EmptyIcon>
          ) : null}
          {showLeading ? (
            <div className="shrink-0 self-start pt-micro text-muted-foreground [&_svg]:size-5">{leading}</div>
          ) : null}
          <div className={cn("flex min-w-0 flex-col gap-micro", !isHero && "flex-1", isHero && "items-center")}>
            <FieldTitle
              className={cn(
                titleVariants({ appearance, emphasis }),
                isHero ? "justify-center text-center" : "",
              )}
            >
              <Label
                htmlFor={controlId}
                className={cn(
                  !isHero && emphasis === "tertiary" && "text-muted-foreground",
                  !isHero && "text-left leading-snug",
                  isHero && "block text-center",
                )}
              >
                {title}
              </Label>
            </FieldTitle>
            {description ? (
              <FieldDescription className={cn(descVariants({ appearance, emphasis }))}>
                {description}
              </FieldDescription>
            ) : null}
          </div>
        </FieldContent>
      </Field>
    </FieldLabel>
  );
}
