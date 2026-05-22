"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";

type AutocompleteProps<TItem> = {
  /** Currently-selected item, or `null` when nothing is picked yet. */
  value: TItem | null;
  onChange: (item: TItem | null) => void;
  /**
   * Async lookup. Must honour `signal.aborted` so out-of-order responses are
   * dropped when the user keeps typing.
   */
  fetchSuggestions: (query: string, signal: AbortSignal) => Promise<TItem[]>;
  /** Stable, unique key per item. Used for React keys and equality checks. */
  itemKey: (item: TItem) => string;
  /** Plain-text label. Shown in the input when an item is selected. */
  itemLabel: (item: TItem) => string;
  /** Result row rendering — can be richer than `itemLabel`. */
  renderItem: (item: TItem) => React.ReactNode;
  /** Minimum characters before `fetchSuggestions` is called. Default 2. */
  minQueryLength?: number;
  /** Debounce window in milliseconds before firing `fetchSuggestions`. Default 250. */
  debounceMs?: number;
  /**
   * Called when a fetch fails (non-abort). The caller is responsible for any
   * user-facing error surface (e.g. a FieldDescription below the input).
   * The primitive itself never renders error UI inside the popover, because
   * the popover only opens when there are results.
   */
  onError?: (error: unknown) => void;
  /**
   * Optional renderer for the empty state. When provided, the popover opens
   * with this message after a successful fetch that returned zero items. The
   * function receives the trimmed query so callers can show contextual copy
   * like `Geen btw-nummer gevonden voor "X"`. When omitted, the popover stays
   * closed on empty results.
   */
  emptyMessage?: (query: string) => React.ReactNode;
  /**
   * Optional subtitle rendered above the result list when there are matches.
   * The function receives the count and the trimmed query so callers can use
   * either or both. Use to give the user a quick read on what was found
   * (e.g. `Gevonden bedrijven`, `5 resultaten voor "X"`).
   */
  resultsHeading?: (count: number, query: string) => React.ReactNode;
  placeholder?: string;
  clearAriaLabel?: string;
  className?: string;
  contentClassName?: string;
  id?: string;
  disabled?: boolean;
  /** Apply input-like progressive state styling (mirrors the `Input` primitive). */
  state?: "valid" | "invalid";
  "aria-invalid"?: boolean;
};

const wrapperBaseClasses = cn(
  "relative flex h-9 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-1.5 text-base transition-colors outline-none md:text-sm dark:bg-input/30",
  "hover:not-[:has(input:disabled)]:not-[:has(input:focus-visible)]:not-aria-invalid:not-data-[state=valid]:border-ring",
  "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50",
  "aria-invalid:border-destructive-foreground aria-invalid:ring-3 aria-invalid:ring-destructive-foreground/20 dark:aria-invalid:border-destructive-foreground/50 dark:aria-invalid:ring-destructive-foreground/40",
  "data-[state=valid]:border-sys-success-500 data-[state=valid]:has-[input:focus-visible]:border-sys-success-500 data-[state=valid]:has-[input:focus-visible]:ring-sys-success-500/20 dark:data-[state=valid]:border-sys-success-400 dark:data-[state=valid]:has-[input:focus-visible]:border-sys-success-400 dark:data-[state=valid]:has-[input:focus-visible]:ring-sys-success-400/40",
  "has-[input:disabled]:pointer-events-none has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-input/50 has-[input:disabled]:opacity-50 dark:has-[input:disabled]:bg-input/80",
);

function Autocomplete<TItem>({
  value,
  onChange,
  fetchSuggestions,
  itemKey,
  itemLabel,
  renderItem,
  minQueryLength = 2,
  debounceMs = 250,
  onError,
  emptyMessage,
  resultsHeading,
  placeholder = "Typ om te zoeken",
  clearAriaLabel = "Wis selectie",
  className,
  contentClassName,
  id,
  disabled,
  state,
  "aria-invalid": ariaInvalid,
}: AutocompleteProps<TItem>) {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<TItem[]>([]);
  const [status, setStatus] = React.useState<"idle" | "loading">("idle");
  const [highlighted, setHighlighted] = React.useState(0);
  const [focused, setFocused] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasValue = value !== null;
  const trimmedSearch = search.trim();
  const belowMinQuery = trimmedSearch.length < minQueryLength;
  const hasResults = results.length > 0;
  const showEmptyState = !hasResults && !!emptyMessage;
  const popoverOpen =
    focused && !hasValue && !belowMinQuery && status === "idle" && (hasResults || showEmptyState);

  React.useEffect(() => {
    setHighlighted(0);
  }, [results]);

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (hasValue) {
      abortRef.current?.abort();
      setResults([]);
      setStatus("idle");
      return;
    }

    if (belowMinQuery) {
      abortRef.current?.abort();
      setResults([]);
      setStatus("idle");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("loading");
      fetchSuggestions(trimmedSearch, controller.signal)
        .then((fetched) => {
          if (controller.signal.aborted) return;
          setResults(fetched);
          setStatus("idle");
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          if (err instanceof DOMException && err.name === "AbortError") return;
          setResults([]);
          setStatus("idle");
          onError?.(err);
        });
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [trimmedSearch, hasValue, belowMinQuery, debounceMs, fetchSuggestions, onError]);

  const handleSelect = (item: TItem) => {
    onChange(item);
    setSearch("");
    setResults([]);
    setStatus("idle");
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange(null);
    setSearch("");
    setResults([]);
    setStatus("idle");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!popoverOpen) {
      if (e.key === "Escape" && hasValue) {
        e.preventDefault();
        handleClear();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[highlighted];
      if (item) handleSelect(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  const inputValue = hasValue ? itemLabel(value) : search;
  const listboxId = id ? `${id}-listbox` : undefined;

  return (
    <Popover open={popoverOpen}>
      <PopoverAnchor asChild>
        <div
          data-slot="autocomplete"
          data-state={state}
          aria-invalid={state === "invalid" ? true : ariaInvalid}
          className={cn(wrapperBaseClasses, className)}
        >
          <input
            ref={inputRef}
            id={id}
            type="text"
            role="combobox"
            aria-expanded={popoverOpen}
            aria-controls={popoverOpen ? listboxId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              popoverOpen && results[highlighted]
                ? `${listboxId}-${itemKey(results[highlighted])}`
                : undefined
            }
            value={inputValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={hasValue}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none read-only:cursor-default"
          />
          {hasValue ? (
            <button
              type="button"
              aria-label={clearAriaLabel}
              onClick={handleClear}
              className="inline-flex shrink-0 cursor-pointer rounded-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
            </button>
          ) : status === "loading" ? (
            <Spinner size="sm" className="shrink-0" />
          ) : (
            <HugeiconsIcon
              icon={Search01Icon}
              className="size-4 shrink-0 opacity-50"
              aria-hidden
            />
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        className={cn(
          "w-(--radix-popover-trigger-width) overflow-hidden p-0",
          contentClassName,
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {hasResults ? (
          <div className="flex max-h-72 flex-col overflow-hidden">
            {resultsHeading ? (
              <div className="px-component pt-component pb-micro text-xs font-medium text-muted-foreground">
                {resultsHeading(results.length, trimmedSearch)}
              </div>
            ) : null}
            <ul
              id={listboxId}
              role="listbox"
              className="overflow-y-auto p-micro"
            >
              {results.map((item, i) => {
                const key = itemKey(item);
                const isHighlighted = i === highlighted;
                return (
                  <li
                    key={key}
                    id={listboxId ? `${listboxId}-${key}` : undefined}
                    role="option"
                    aria-selected={isHighlighted}
                    onMouseEnter={() => setHighlighted(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center rounded-sm px-component py-micro text-sm",
                      isHighlighted && "bg-accent text-accent-foreground",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate text-left">{renderItem(item)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="px-component py-micro text-sm text-muted-foreground"
          >
            {emptyMessage?.(trimmedSearch)}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { Autocomplete };
export type { AutocompleteProps };
