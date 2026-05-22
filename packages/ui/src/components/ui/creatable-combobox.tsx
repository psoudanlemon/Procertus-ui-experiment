"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CreatableComboboxOption = {
  value: string;
  label: string;
};

type CreatableComboboxProps = {
  options: CreatableComboboxOption[];
  /** Currently-selected value. Matches an option's `value` for presets, or a free string for custom entries. */
  value: string;
  onValueChange: (value: string) => void;
  /** Called when the user adds a new entry by typing and confirming. */
  onCreate: (label: string) => void;
  /** Optional override for the trigger label — useful when `value` is a custom string that needs a different visible form. */
  selectedLabel?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  /** Renders the leading row in the dropdown when the user has typed text not matching any option. */
  createLabel?: (search: string) => React.ReactNode;
  /** Tooltip text used when the create row's label is visually truncated. */
  createTooltip?: (search: string) => string;
  clearAriaLabel?: string;
  className?: string;
  contentClassName?: string;
  id?: string;
  disabled?: boolean;
  /** Apply input-like progressive state styling (mirrors the `Input` primitive). */
  state?: "valid" | "invalid";
  "aria-invalid"?: boolean;
};

const triggerBaseClasses = cn(
  "flex h-9 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-1.5 text-base transition-colors outline-none md:text-sm dark:bg-input/30",
  "hover:not-disabled:not-focus-visible:not-aria-invalid:not-data-[state=valid]:border-ring",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/50",
  "aria-invalid:border-destructive-foreground aria-invalid:ring-3 aria-invalid:ring-destructive-foreground/20 dark:aria-invalid:border-destructive-foreground/50 dark:aria-invalid:ring-destructive-foreground/40",
  "data-[state=valid]:border-sys-success-500 data-[state=valid]:focus-visible:border-sys-success-500 data-[state=valid]:focus-visible:ring-sys-success-500/20 dark:data-[state=valid]:border-sys-success-400 dark:data-[state=valid]:focus-visible:border-sys-success-400 dark:data-[state=valid]:focus-visible:ring-sys-success-400/40",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:disabled:bg-input/80",
);

/**
 * Wraps inline text in a Tooltip that only opens when the text is actually
 * truncated (scrollWidth > clientWidth). When everything fits, hovering
 * does nothing — no redundant restating of visible copy.
 */
function MaybeTruncated({
  children,
  tooltipText,
  side = "right",
}: {
  children: React.ReactNode;
  tooltipText: string;
  side?: "top" | "right" | "bottom" | "left";
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setIsTruncated(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span ref={ref} className="min-w-0 flex-1 truncate text-left">
          {children}
        </span>
      </TooltipTrigger>
      {isTruncated ? (
        <TooltipContent side={side} className="z-30">
          {tooltipText}
        </TooltipContent>
      ) : null}
    </Tooltip>
  );
}

const defaultCreateLabel = (search: string) => (
  <>
    Add &quot;<span className="font-medium">{search}</span>&quot;
  </>
);

const defaultCreateTooltip = (search: string) => `Add "${search}"`;

function CreatableCombobox({
  options,
  value,
  onValueChange,
  onCreate,
  selectedLabel: selectedLabelProp,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  createLabel = defaultCreateLabel,
  createTooltip = defaultCreateTooltip,
  clearAriaLabel = "Clear selection",
  className,
  contentClassName,
  id,
  disabled,
  state,
  "aria-invalid": ariaInvalid,
}: CreatableComboboxProps) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const trimmedSearch = search.trim();
  const searchLower = trimmedSearch.toLowerCase();
  const hasExactMatch = options.some((option) => option.label.toLowerCase() === searchLower);
  const canCreate = trimmedSearch.length > 0 && !hasExactMatch;

  const filteredOptions = React.useMemo(() => {
    if (!searchLower) return options;
    return options.filter((option) => option.label.toLowerCase().includes(searchLower));
  }, [options, searchLower]);

  const selectedLabel =
    selectedLabelProp ??
    options.find((option) => option.value === value)?.label ??
    (value || undefined);

  const handleCreate = () => {
    onCreate(trimmedSearch);
    setSearch("");
    setOpen(false);
  };

  const handleClear = () => {
    onValueChange("");
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            data-slot="creatable-combobox"
            role="combobox"
            aria-expanded={open}
            aria-invalid={state === "invalid" ? true : ariaInvalid}
            data-state={state}
            disabled={disabled}
            className={cn(triggerBaseClasses, className)}
          >
            {selectedLabel ? (
              <MaybeTruncated side="top" tooltipText={selectedLabel}>
                {selectedLabel}
              </MaybeTruncated>
            ) : (
              <span className="min-w-0 flex-1 truncate text-left text-muted-foreground">
                {placeholder}
              </span>
            )}
            {value ? (
              <span
                role="button"
                tabIndex={0}
                aria-label={clearAriaLabel}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClear();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }
                }}
                className="inline-flex shrink-0 cursor-pointer rounded-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
              </span>
            ) : (
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className="size-4 shrink-0 opacity-50"
              />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-(--radix-popover-trigger-width) p-0", contentClassName)}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandGroup className="p-0">
                {canCreate ? (
                  <CommandItem value="__create__" onSelect={handleCreate}>
                    <HugeiconsIcon icon={PlusSignIcon} className="size-4 shrink-0" />
                    <MaybeTruncated
                      side="right"
                      tooltipText={createTooltip(trimmedSearch)}
                    >
                      {createLabel(trimmedSearch)}
                    </MaybeTruncated>
                  </CommandItem>
                ) : null}
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    className="pr-micro"
                    data-checked={value === option.value ? "true" : undefined}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue);
                      setSearch("");
                      setOpen(false);
                    }}
                  >
                    <MaybeTruncated side="right" tooltipText={option.label}>
                      {option.label}
                    </MaybeTruncated>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

export { CreatableCombobox };
export type { CreatableComboboxOption, CreatableComboboxProps };
