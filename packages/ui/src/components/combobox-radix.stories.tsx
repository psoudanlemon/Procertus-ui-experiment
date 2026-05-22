"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Combobox } from "@/components/ui/combobox";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";

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
        className="w-[240px]"
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
        className="w-[240px]"
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
    className: "w-[240px]",
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
 * Searchable combobox that lets the user add the typed value as a new option
 * when it doesn't match anything in the list. Replaces the "select + Anders +
 * extra losstaand input field"-pattern on the Registratie step (Role-veld) and
 * any similar field where the canonical list is suggestive, not exhaustive.
 */
export const Creatable: Story = {
  render: () => {
    const [options, setOptions] = React.useState(roleSeedOptions);
    const [value, setValue] = React.useState("");

    const handleCreate = (label: string) => {
      const baseSlug =
        label
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "") || `custom_${options.length + 1}`;
      const existingSlugs = new Set(options.map((option) => option.value));
      let slug = baseSlug;
      let suffix = 2;
      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}_${suffix++}`;
      }
      setOptions((prev) => [...prev, { value: slug, label }]);
      setValue(slug);
    };

    return (
      <CreatableCombobox
        options={options}
        value={value}
        onValueChange={setValue}
        onCreate={handleCreate}
        placeholder="Kies een functie..."
        searchPlaceholder="Zoek functienaam"
        createLabel={(s) => (
          <>
            Voeg &quot;<span className="font-medium">{s}</span>&quot; toe
          </>
        )}
        createTooltip={(s) => `Voeg "${s}" toe als nieuwe functie`}
        clearAriaLabel="Wis selectie"
        className="w-[320px]"
      />
    );
  },
};
