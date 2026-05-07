/**
 * Clickable navigation card for catalogue / drill-down surfaces — title,
 * optional eyebrow + description, and a ghost-button affordance below the
 * description (label + trailing icon). Mirrors the five chrome variants of
 * `SelectChoiceCard` (`elevated`, `default`, `faded`, `ghost`, `no-border`)
 * without the form-control machinery, so callers can tier a grid of cards
 * with the same visual vocabulary as a `ChoiceBar`.
 *
 * Built on top of the `Item` primitive: layout, focus-ring, and slot
 * conventions come from there; chrome is overridden per variant. The cta is
 * rendered as a visually-only ghost button (the entire card is the real
 * click target — passing `asChild` swaps the root element to `<a>`,
 * `<button>`, `<Link>`, …).
 *
 * **Design system:** `Item` family from `@procertus-ui/ui`, variant vocabulary
 * shared with `SelectChoiceCard` / `ChoiceBar`.
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
  "cursor-pointer transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 motion-safe:hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        elevated:
          "border-border bg-card shadow-proc-sm hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground",
        default:
          "border-border bg-card hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground",
        faded:
          "border-dashed border-muted-foreground/40 bg-card opacity-90 hover:opacity-100 hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border-transparent bg-card text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground",
        "no-border":
          "border-transparent bg-card text-foreground shadow-none hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground",
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
   * @default "default" — same vocabulary as `SelectChoiceCard`. `elevated` adds
   * a soft shadow, `faded` is dashed and de-emphasized, `ghost` drops surface
   * and uses muted-foreground text, `no-border` keeps the surface but suppresses
   * the border.
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
  ...props
}: BrowseCardProps) {
  const ctaNode = cta === null ? null : (cta ?? defaultCta);
  const ctaIcon = ctaNode ? (ctaNode.icon === null ? null : (ctaNode.icon ?? defaultCtaIcon)) : null;

  const inner = (
    <ItemContent className="gap-component">
      {eyebrow ? (
        <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
          {eyebrow}
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
