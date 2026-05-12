/**
 * Clickable navigation card for catalogue / drill-down surfaces — title,
 * optional eyebrow + description, and a ghost-button affordance below the
 * description (label + trailing icon). Six chrome variants
 * (`elevated`, `standout`, `default`, `faded`, `ghost`, `no-border`)
 * mirror the choice-bar vocabulary so callers can tier a grid of cards
 * with the same visual hierarchy.
 *
 * Built on top of the `Item` primitive: layout, focus-ring, and slot
 * conventions come from there; chrome is overridden per variant. The cta is
 * rendered as a visually-only ghost button (the entire card is the real
 * click target — passing `asChild` swaps the root element to `<a>`,
 * `<button>`, `<Link>`, …).
 *
 * **Design system:** `Item` family from `@procertus-ui/ui`, variant vocabulary
 * shared with `ChoiceCard` / `ChoiceBar`.
 */
import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import {
  Button,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@procertus-ui/ui";

const browseCardVariants = cva(
  "cursor-pointer transition-[border-color,color,opacity] duration-200",
  {
    variants: {
      variant: {
        elevated:
          "border-border bg-card shadow-proc-glow-tactile hover:border-accent-foreground hover:text-accent-foreground",
        standout:
          "border-border bg-muted/50 hover:border-accent-foreground hover:text-accent-foreground",
        default:
          "border-border bg-card hover:border-accent-foreground hover:text-accent-foreground",
        faded:
          "border-dashed border-muted-foreground/40 bg-card opacity-90 hover:border-accent-foreground hover:text-accent-foreground hover:opacity-100",
        ghost:
          "border-transparent bg-card text-muted-foreground shadow-none hover:text-accent-foreground",
        "no-border":
          "border-transparent bg-card text-foreground shadow-none hover:border-accent-foreground hover:text-accent-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BrowseCardVariant = NonNullable<VariantProps<typeof browseCardVariants>["variant"]>;

export type BrowseCardCta = {
  label: ReactNode;
  /** Defaults to a chevron-right when omitted. Pass `null` to suppress. */
  icon?: ReactNode | null;
};

export type BrowseCardProps = Omit<ComponentProps<"div">, "title" | "children"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Small uppercase label above the title (e.g. "Externe verwijzing"). */
  eyebrow?: ReactNode;
  /**
   * @default "default" — same vocabulary as `ChoiceCard`. `elevated` adds
   * a static branded glow (quiet-promotion tier), `standout` swaps to a muted
   * background tint, `faded` is dashed and de-emphasized, `ghost` drops
   * surface and uses muted-foreground text, `no-border` keeps the surface
   * but suppresses the border.
   */
  variant?: BrowseCardVariant;
  /**
   * Affordance shown below the description as a ghost button. Pass `null` to
   * suppress; defaults to `{ label: "Meer info" }` with a chevron-right.
   */
  cta?: BrowseCardCta | null;
  /**
   * When true, `children` must be a single React element (`<a>`, `<button>`,
   * `<Link>`, …) used as the card's root. The element's own children are
   * replaced by the composed inner content.
   */
  asChild?: boolean;
  /** Single wrapper element when `asChild` is true; ignored otherwise. */
  children?: ReactNode;
  /** Traject/wegwijzer: versterkte rand wanneer er al producten voor deze route gekozen zijn. */
  selected?: boolean;
  /** Optioneel aantal unieke producten in het lopende pakket voor deze route. */
  selectionCount?: number;
};

const defaultCtaIcon = (
  <HugeiconsIcon icon={ArrowRight02Icon} className="size-3.5" strokeWidth={1.5} />
);

const defaultCta: BrowseCardCta = { label: "Meer info" };

export function BrowseCard({
  title,
  description,
  eyebrow,
  variant = "default",
  cta,
  asChild = false,
  className,
  children,
  selected = false,
  selectionCount,
  ...props
}: BrowseCardProps) {
  const ctaNode = cta === null ? null : (cta ?? defaultCta);
  const ctaIcon = ctaNode ? (ctaNode.icon === null ? null : (ctaNode.icon ?? defaultCtaIcon)) : null;

  const resolvedEyebrow =
    eyebrow ??
    (selectionCount != null && selectionCount > 0 ? (
      <span className="flex flex-wrap items-center gap-micro">
        <span>Al in uw pakket</span>
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
          {selectionCount} {selectionCount === 1 ? "product" : "producten"}
        </span>
      </span>
    ) : undefined);

  const inner = (
    <ItemContent className="gap-component">
      {resolvedEyebrow ? (
        <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
          {resolvedEyebrow}
        </span>
      ) : null}
      <ItemTitle className="text-base leading-snug">{title}</ItemTitle>
      {description ? <ItemDescription>{description}</ItemDescription> : null}
      {ctaNode ? (
        <Button
          asChild
          variant="ghost"
          size="sm"
          tabIndex={-1}
          className="-ml-3 self-start pointer-events-none"
        >
          <span>
            {ctaNode.label}
            {ctaIcon}
          </span>
        </Button>
      ) : null}
    </ItemContent>
  );

  const itemClassName = cn(
    "items-start gap-region p-section",
    browseCardVariants({ variant }),
    selected && "ring-2 ring-primary/40 ring-offset-2 ring-offset-background",
    className,
  );

  if (asChild) {
    const onlyChild = Children.only(children) as ReactElement;
    if (!isValidElement(onlyChild)) {
      throw new Error("BrowseCard: asChild requires a single React element child.");
    }
    return (
      <Item
        asChild
        role="listitem"
        data-browse-variant={variant}
        className={itemClassName}
        {...props}
      >
        {cloneElement(onlyChild, undefined, inner)}
      </Item>
    );
  }

  return (
    <Item
      role="listitem"
      data-browse-variant={variant}
      className={itemClassName}
      {...props}
    >
      {inner}
    </Item>
  );
}
