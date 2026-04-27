import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";

import {
  createFilter,
  DEFAULT_I18N,
  Filters,
  type Filter,
  type FilterFieldConfig,
  type FilterI18nConfig,
} from "./filters";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type FilterValue = string;

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

const ownerOptions = [
  { value: "jd", label: "Jane Doe" },
  { value: "ab", label: "Alex Brown" },
  { value: "nb", label: "Nadia Bell" },
  { value: "sl", label: "Sam Lee" },
];

const fields: FilterFieldConfig<FilterValue>[] = [
  {
    key: "priority",
    label: "Priority",
    type: "multiselect",
    options: priorityOptions,
    searchable: false,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: statusOptions,
    searchable: false,
  },
  {
    key: "owner",
    label: "Owner",
    type: "multiselect",
    options: ownerOptions,
    maxSelections: 3,
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    defaultOperator: "contains",
    placeholder: "alex@example.com",
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    validation: (value) => ({
      valid: typeof value === "string" && value.includes("@"),
      message: "Enter a valid email address.",
    }),
  },
  {
    key: "query",
    label: "Search",
    type: "text",
    defaultOperator: "contains",
    placeholder: "Document title",
  },
];

const meta = {
  title: "reui/Filters",
  component: Filters,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ReUI filters for data-heavy surfaces. Supports text, select, multiselect, custom triggers, validation, size variants, keyboard shortcut hints, and i18n overrides.",
      },
    },
  },
} satisfies Meta<typeof Filters>;

export default meta;

type Story = StoryObj;

function FiltersDemo({
  initialFilters,
  size = "default",
  variant = "default",
  radius = "default",
  trigger,
  i18n,
}: {
  initialFilters: Filter<FilterValue>[];
  size?: "sm" | "default" | "lg";
  variant?: "solid" | "default";
  radius?: "default" | "full";
  trigger?: React.ReactNode;
  i18n?: Partial<FilterI18nConfig>;
}) {
  const [filters, setFilters] = useState<Filter<FilterValue>[]>(initialFilters);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-section">
      <Filters
        filters={filters}
        fields={fields}
        onChange={setFilters}
        size={size}
        variant={variant}
        radius={radius}
        trigger={trigger}
        i18n={i18n}
        enableShortcut
      />
      <pre className="max-h-64 overflow-auto rounded-lg border bg-muted/30 p-section text-xs text-muted-foreground">
        {JSON.stringify(filters, null, 2)}
      </pre>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <FiltersDemo
      initialFilters={[
        createFilter<FilterValue>("priority", "is_any_of", [
          "low",
          "medium",
          "critical",
        ]),
      ]}
    />
  ),
};

export const TriggerButton: Story = {
  render: () => (
    <FiltersDemo
      initialFilters={[createFilter<FilterValue>("status", "is", ["active"])]}
      trigger={
        <Button variant="secondary">
          Add condition
          <Badge variant="outline" className="ml-micro">
            F
          </Badge>
        </Button>
      }
    />
  ),
};

export const SmallSize: Story = {
  render: () => (
    <FiltersDemo
      size="sm"
      initialFilters={[
        createFilter<FilterValue>("owner", "is_any_of", ["jd", "ab"]),
        createFilter<FilterValue>("query", "contains", ["renewal"]),
      ]}
    />
  ),
};

export const LargeSolid: Story = {
  render: () => (
    <FiltersDemo
      size="lg"
      variant="solid"
      radius="full"
      initialFilters={[
        createFilter<FilterValue>("priority", "is_any_of", ["high"]),
        createFilter<FilterValue>("status", "is_not", ["archived"]),
      ]}
    />
  ),
};

export const Validation: Story = {
  render: () => (
    <FiltersDemo
      initialFilters={[
        createFilter<FilterValue>("email", "contains", ["invalid-email"]),
      ]}
    />
  ),
};

export const I18n: Story = {
  render: () => (
    <FiltersDemo
      initialFilters={[createFilter<FilterValue>("status", "is", ["active"])]}
      i18n={{
        addFilter: "Filtrar",
        searchFields: "Buscar filtros...",
        selectedCount: "seleccionados",
        operators: {
          ...DEFAULT_I18N.operators,
          is: "es",
          isNot: "no es",
          isAnyOf: "es cualquiera de",
          contains: "contiene",
        },
      }}
    />
  ),
};
