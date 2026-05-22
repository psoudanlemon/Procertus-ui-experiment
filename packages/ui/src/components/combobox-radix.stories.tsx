"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  PlusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
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

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

/**
 * A searchable select component that combines a Command input with a Popover.
 */
const meta: Meta<typeof Combobox> = {
  title: "components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default combobox with a list of frameworks.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyMessage="No framework found."
      />
    );
  },
};

/**
 * Combobox with a pre-selected value.
 */
export const WithValue: Story = {
  render: () => {
    const [value, setValue] = React.useState("next.js");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
      />
    );
  },
};

/**
 * Disabled combobox.
 */
export const Disabled: Story = {
  args: {
    options: frameworks,
    disabled: true,
    placeholder: "Select framework...",
  },
};

const roleSeedOptions = [
  { value: "managing_director", label: "Zaakvoerder / bestuurder" },
  { value: "legal_representative", label: "Wettelijk vertegenwoordiger" },
  { value: "quality", label: "Kwaliteit / compliance" },
  { value: "technical", label: "Technisch / R&D" },
  { value: "procurement", label: "Inkoop / aanbesteding" },
  { value: "sales", label: "Sales / accountmanagement" },
  { value: "administration", label: "Administratie / finance" },
];

/**
 * Same progressive states (idle → hover → focus-visible → invalid → valid →
 * disabled) as the `Input` primitive, so the combobox trigger sits in the form
 * field family visually rather than feeling like a button.
 */
const inputLikeTriggerClasses = cn(
  "flex h-9 w-[320px] min-w-0 items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-1.5 text-base transition-colors outline-none md:text-sm dark:bg-input/30",
  "hover:not-disabled:not-focus-visible:not-aria-invalid:not-data-[state=valid]:border-ring",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/50",
  "aria-invalid:border-destructive-foreground aria-invalid:ring-3 aria-invalid:ring-destructive-foreground/20 dark:aria-invalid:border-destructive-foreground/50 dark:aria-invalid:ring-destructive-foreground/40",
  "data-[state=valid]:border-sys-success-500 data-[state=valid]:focus-visible:border-sys-success-500 data-[state=valid]:focus-visible:ring-sys-success-500/20 dark:data-[state=valid]:border-sys-success-400 dark:data-[state=valid]:focus-visible:border-sys-success-400 dark:data-[state=valid]:focus-visible:ring-sys-success-400/40",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:disabled:bg-input/80",
);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Wraps inline text in a Tooltip that only opens when the text is actually
 * truncated (scrollWidth > clientWidth). When everything fits, hovering
 * does nothing — no redundant restating of visible copy.
 */
function MaybeTruncated({
  children,
  tooltipText,
  side = "right",
  muted = false,
}: {
  children: React.ReactNode;
  tooltipText: string;
  side?: "top" | "right" | "bottom" | "left";
  muted?: boolean;
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
        <span
          ref={ref}
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            muted && "text-muted-foreground",
          )}
        >
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

/**
 * Searchable combobox that lets the user add the typed value as a new option
 * when it doesn't match anything in the list. Replaces the "select + Anders +
 * extra losstaand input field"-pattern on the Registratie step (Role-veld) and
 * any similar field where the canonical list is suggestive, not exhaustive.
 *
 * Built ad-hoc from Popover + Command primitives so we can iterate on the UX
 * before deciding whether to lift this into a `creatable` prop on the
 * `Combobox` component itself.
 */
export const Creatable: Story = {
  render: () => {
    const [options, setOptions] = React.useState(roleSeedOptions);
    const [value, setValue] = React.useState("");
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

    const selectedLabel = options.find((option) => option.value === value)?.label;

    const handleCreate = () => {
      const baseSlug = slugify(trimmedSearch) || `custom_${options.length + 1}`;
      const existingSlugs = new Set(options.map((option) => option.value));
      let slug = baseSlug;
      let suffix = 2;
      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}_${suffix++}`;
      }
      const newOption = { value: slug, label: trimmedSearch };
      setOptions((prev) => [...prev, newOption]);
      setValue(slug);
      setSearch("");
      setOpen(false);
    };

    return (
      <TooltipProvider delayDuration={300}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-slot="combobox"
              role="combobox"
              aria-expanded={open}
              className={inputLikeTriggerClasses}
            >
              {selectedLabel ? (
                <MaybeTruncated side="top" tooltipText={selectedLabel}>
                  {selectedLabel}
                </MaybeTruncated>
              ) : (
                <span className="min-w-0 flex-1 truncate text-left text-muted-foreground">
                  Kies een functie...
                </span>
              )}
              {value ? (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Wis selectie"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setValue("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      setValue("");
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
          <PopoverContent className="w-[320px] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Zoek functienaam"
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
                        tooltipText={`Voeg "${trimmedSearch}" toe als nieuwe functie`}
                      >
                        Voeg "<span className="font-medium">{trimmedSearch}</span>" toe
                      </MaybeTruncated>
                    </CommandItem>
                  ) : null}
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={[option.label]}
                      className="pr-0"
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setSearch("");
                        setOpen(false);
                      }}
                    >
                      <MaybeTruncated side="right" tooltipText={option.label}>
                        {option.label}
                      </MaybeTruncated>
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className={cn(
                          "ml-auto size-4 shrink-0",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    );
  },
};
