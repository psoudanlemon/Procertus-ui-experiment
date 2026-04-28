import {
  createContext,
  Fragment,
  useContext,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
} from "react"
import type { ItemInstance } from "@headless-tree/core"
import { Slot } from "radix-ui"
import {
  ArrowDown01Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type ToggleIconType = "chevron" | "plus-minus"

interface TreeContextValue<T = any> {
  indent: number
  currentItem?: ItemInstance<T>
  tree?: any
  toggleIconType?: ToggleIconType
  showLines?: boolean
}

const TreeContext = createContext<TreeContextValue>({
  indent: 20,
  currentItem: undefined,
  tree: undefined,
  toggleIconType: "chevron",
  showLines: false,
})

function useTreeContext<T = any>() {
  return useContext(TreeContext) as TreeContextValue<T>
}

function hasChildren(item: { getChildren?: () => unknown }): boolean {
  if (typeof item.getChildren !== "function") return true
  const children = item.getChildren()
  return Array.isArray(children) && children.length > 0
}

interface TreeProps extends HTMLAttributes<HTMLDivElement> {
  indent?: number
  tree?: any
  toggleIconType?: ToggleIconType
  asChild?: boolean
  showLines?: boolean
}

function Tree({
  indent = 20,
  tree,
  className,
  toggleIconType = "chevron",
  asChild = false,
  showLines = false,
  ...props
}: TreeProps) {
  const containerProps =
    tree && typeof tree.getContainerProps === "function"
      ? tree.getContainerProps()
      : {}
  const mergedProps = { ...props, ...containerProps }

  const { style: propStyle, ...otherProps } = mergedProps

  const mergedStyle = {
    ...propStyle,
    "--tree-indent": `${indent}px`,
  } as CSSProperties

  const Comp = asChild ? Slot.Root : "div"

  return (
    <TreeContext.Provider value={{ indent, tree, toggleIconType, showLines }}>
      <Comp
        data-slot="tree"
        style={mergedStyle}
        className={cn("flex flex-col", className)}
        {...otherProps}
      />
    </TreeContext.Provider>
  )
}

interface TreeItemProps<T = any> extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "indent"
> {
  item: ItemInstance<T>
  indent?: number
  asChild?: boolean
}

function TreeItem<T = any>({
  item,
  className,
  asChild = false,
  children,
  ...props
}: TreeItemProps<T>) {
  const parentContext = useTreeContext<T>()
  const { indent, showLines } = parentContext

  const itemProps = typeof item.getProps === "function" ? item.getProps() : {}
  const mergedProps = { ...props, children, ...itemProps }

  const { style: propStyle, ...otherProps } = mergedProps

  const mergedStyle = {
    ...(showLines
      ? {
          backgroundImage:
            "repeating-linear-gradient(to right, transparent 0, transparent calc(var(--spacing-component) + var(--spacing-micro) - 0.5px), var(--color-border) calc(var(--spacing-component) + var(--spacing-micro) - 0.5px), var(--color-border) calc(var(--spacing-component) + var(--spacing-micro) + 0.5px), transparent calc(var(--spacing-component) + var(--spacing-micro) + 0.5px), transparent var(--tree-indent))",
          backgroundSize: "var(--tree-padding) 100%",
          backgroundRepeat: "no-repeat",
        }
      : {}),
    ...propStyle,
    "--tree-padding": `${item.getItemMeta().level * indent}px`,
  } as CSSProperties

  const defaultProps = {
    "data-slot": "tree-item",
    style: mergedStyle,
    className: cn(
      "z-10 w-full ps-(--tree-padding) text-left outline-hidden select-none focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    "data-focus":
      typeof item.isFocused === "function"
        ? item.isFocused() || false
        : undefined,
    "data-folder":
      typeof item.isFolder === "function"
        ? item.isFolder() || false
        : undefined,
    "data-selected":
      typeof item.isSelected === "function"
        ? item.isSelected() || false
        : undefined,
    "data-drag-target":
      typeof item.isDragTarget === "function"
        ? item.isDragTarget() || false
        : undefined,
    "data-search-match":
      typeof item.isMatchingSearch === "function"
        ? item.isMatchingSearch() || false
        : undefined,
    "aria-expanded": item.isExpanded(),
  }

  const Comp = asChild ? Slot.Root : "button"

  return (
    <TreeContext.Provider value={{ ...parentContext, currentItem: item }}>
      <Comp {...defaultProps} {...otherProps}>
        {children}
      </Comp>
    </TreeContext.Provider>
  )
}

interface TreeItemLabelProps<T = any> extends HTMLAttributes<HTMLSpanElement> {
  item?: ItemInstance<T>
  asChild?: boolean
}

function TreeItemLabel<T = any>({
  item: propItem,
  children,
  className,
  asChild = false,
  style: propStyle,
  ...props
}: TreeItemLabelProps<T>) {
  const { currentItem, toggleIconType } = useTreeContext<T>()
  const item = propItem || currentItem

  if (!item) {
    console.warn("TreeItemLabel: No item provided via props or context")
    return null
  }

  const Comp = asChild ? Slot.Root : "span"

  const fallbackName =
    typeof item.getItemName === "function" ? item.getItemName() : null
  const rawContent = children ?? fallbackName
  const content =
    typeof rawContent === "string" ? (
      <span className="min-w-0 flex-1 truncate">{rawContent}</span>
    ) : (
      rawContent
    )

  return (
    <Comp
      data-slot="tree-item-label"
      style={propStyle}
      className={cn(
        "flex w-full items-center gap-micro text-foreground transition-colors hover:bg-accent hover:text-accent-foreground in-focus-visible:ring-[3px] in-focus-visible:ring-ring/50 in-data-[selected=true]:bg-accent in-data-[selected=true]:font-medium in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent in-data-[search-match=true]:font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[1.33px]",
        "rounded-md",
        "my-[2px]",
        "py-micro",
        "px-component",
        "text-sm",
        className
      )}
      {...props}
    >
      <Fragment>
        {content}
        {item.isFolder() && hasChildren(item) && (
          <span className="ms-auto flex shrink-0 ps-micro">
            {toggleIconType === "plus-minus" ? (
              item.isExpanded() ? (
                <HugeiconsIcon
                  icon={MinusSignIcon}
                  className="size-4 text-muted-foreground"
                />
              ) : (
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  className="size-4 text-muted-foreground"
                />
              )
            ) : (
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className="size-4 text-muted-foreground in-aria-[expanded=false]:-rotate-90"
              />
            )}
          </span>
        )}
      </Fragment>
    </Comp>
  )
}

function TreeDragLine({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { tree } = useTreeContext()

  if (!tree || typeof tree.getDragLineStyle !== "function") {
    console.warn(
      "TreeDragLine: No tree provided via context or tree does not have getDragLineStyle method"
    )
    return null
  }

  const dragLine = tree.getDragLineStyle()
  return (
    <div
      style={dragLine}
      className={cn(
        "bg-primary before:bg-background before:border-primary absolute z-30 -mt-px h-0.5 w-[unset] before:absolute before:-top-[3px] before:left-0 before:size-2 before:border-2",
        "before:rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Tree, TreeItem, TreeItemLabel, TreeDragLine }
