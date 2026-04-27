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

type FilterValue = string | number | boolean;

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
    key: "title",
    label: "Title",
    type: "text",
    defaultOperator: "contains",
    placeholder: "Document title",
  },
  {
    key: "score",
    label: "Score",
    type: "number",
    defaultOperator: "gte",
    placeholder: "Enter number",
  },
  {
    key: "amount",
    label: "Amount",
    type: "number",
    defaultOperator: "between",
    placeholder: "Enter number",
  },
  {
    key: "isPublished",
    label: "Published",
    type: "boolean",
  },
  {
    key: "renewalAt",
    label: "Renewal time",
    type: "timestamp",
    defaultOperator: "before",
  },
  {
    key: "shiftWindow",
    label: "Shift window",
    type: "timestamp",
    defaultOperator: "between",
  },
];

const meta = {
  title: "components/Filters",
  component: Filters,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ReUI filters for data-heavy surfaces. Supports text, number, boolean, timestamp, select, multiselect, custom triggers, size variants, keyboard shortcut hints, and i18n overrides.",
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
  i18n,
}: {
  initialFilters: Filter<FilterValue>[];
  size?: "sm" | "default" | "lg";
  variant?: "solid" | "default";
  radius?: "default" | "full";
  i18n?: Partial<FilterI18nConfig>;
}) {
  const [filters, setFilters] = useState<Filter<FilterValue>[]>(initialFilters);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-section">
      <Filters
        filters={filters}
        fields={fields}
        onChange={setFilters}
        size={size}
        variant={variant}
        radius={radius}
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
        createFilter<FilterValue>("title", "contains", ["renewal"]),
      ]}
    />
  ),
};

export const Trigger: Story = {
  render: () => <FiltersDemo initialFilters={[]} />,
};

export const Small: Story = {
  render: () => (
    <FiltersDemo
      size="sm"
      initialFilters={[
        createFilter<FilterValue>("priority", "is_any_of", [
          "low",
          "medium",
          "critical",
        ]),
        createFilter<FilterValue>("title", "contains", ["renewal"]),
      ]}
    />
  ),
};

export const Large: Story = {
  render: () => (
    <FiltersDemo
      size="lg"
      initialFilters={[
        createFilter<FilterValue>("priority", "is_any_of", [
          "low",
          "medium",
          "critical",
        ]),
        createFilter<FilterValue>("title", "contains", ["renewal"]),
      ]}
    />
  ),
};

export const TextOperators: Story = {
  render: () => (
    <FiltersDemo
      initialFilters={[
        createFilter<FilterValue>("title", "is", ["Compliance handbook"]),
        createFilter<FilterValue>("title", "contains", ["renewal"]),
        createFilter<FilterValue>("title", "starts_with", ["Q3"]),
      ]}
    />
  ),
};

export const NumberOperators: Story = {
  render: () => (
    <FiltersDemo
      initialFilters={[
        createFilter<FilterValue>("score", "is", [42]),
        createFilter<FilterValue>("score", "gt", [10]),
        createFilter<FilterValue>("score", "lte", [100]),
        createFilter<FilterValue>("amount", "between", [50, 200]),
      ]}
    />
  ),
};

export const SelectAndMultiselect: Story = {
  render: () => (
    <FiltersDemo
      initialFilters={[
        createFilter<FilterValue>("status", "is", ["active"]),
        createFilter<FilterValue>("priority", "is_any_of", ["high", "critical"]),
        createFilter<FilterValue>("owner", "includes_all", ["jd", "ab"]),
      ]}
    />
  ),
};

export const BooleanAndTimestamp: Story = {
  render: () => (
    <FiltersDemo
      initialFilters={[
        createFilter<FilterValue>("isPublished", "is", [true]),
        createFilter<FilterValue>("renewalAt", "before", ["18:00:00"]),
        createFilter<FilterValue>("shiftWindow", "between", ["09:00:00", "17:30:00"]),
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
        clearAll: "Borrar todos los filtros",
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
