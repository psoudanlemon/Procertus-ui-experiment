"use client"

import type React from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertCircleIcon,
  ArrowDown01Icon,
  Cancel01Icon,
  PlusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

// i18n Configuration Interface
export interface FilterI18nConfig {
  // UI Labels
  addFilter: string
  searchFields: string
  noFieldsFound: string
  noResultsFound: string
  select: string
  true: string
  false: string
  min: string
  max: string
  to: string
  typeAndPressEnter: string
  selected: string
  selectedCount: string
  percent: string
  defaultCurrency: string
  defaultColor: string
  addFilterTitle: string
  clearAll: string

  // Operators
  operators: {
    is: string
    isNot: string
    isAnyOf: string
    isNotAnyOf: string
    includesAll: string
    excludesAll: string
    before: string
    after: string
    between: string
    notBetween: string
    contains: string
    notContains: string
    startsWith: string
    endsWith: string
    isExactly: string
    equals: string
    notEquals: string
    greaterThan: string
    lessThan: string
    greaterThanOrEqual: string
    lessThanOrEqual: string
    overlaps: string
    includes: string
    excludes: string
    includesAllOf: string
    includesAnyOf: string
    empty: string
    notEmpty: string
  }

  // Placeholders
  placeholders: {
    enterField: (fieldType: string) => string
    selectField: string
    searchField: (fieldName: string) => string
    enterKey: string
    enterValue: string
  }

  // Helper functions
  helpers: {
    formatOperator: (operator: string) => string
  }

  // Validation
  validation: {
    invalidEmail: string
    invalidUrl: string
    invalidTel: string
    invalid: string
  }
}

// Default English i18n configuration
export const DEFAULT_I18N: FilterI18nConfig = {
  // UI Labels
  addFilter: "Filter",
  searchFields: "Filter...",
  noFieldsFound: "No filters found.",
  noResultsFound: "No results found.",
  select: "Select...",
  true: "True",
  false: "False",
  min: "Min",
  max: "Max",
  to: "to",
  typeAndPressEnter: "Type and press Enter to add tag",
  selected: "selected",
  selectedCount: "selected",
  percent: "%",
  defaultCurrency: "$",
  defaultColor: "#000000",
  addFilterTitle: "Add filter",
  clearAll: "Clear all filters",

  // Operators
  operators: {
    is: "is",
    isNot: "is not",
    isAnyOf: "is any of",
    isNotAnyOf: "is not any of",
    includesAll: "includes all",
    excludesAll: "excludes all",
    before: "before",
    after: "after",
    between: "between",
    notBetween: "not between",
    contains: "contains",
    notContains: "does not contain",
    startsWith: "starts with",
    endsWith: "ends with",
    isExactly: "is exactly",
    equals: "equals",
    notEquals: "not equals",
    greaterThan: "is greater than",
    lessThan: "is less than",
    greaterThanOrEqual: "is greater than or equal to",
    lessThanOrEqual: "is less than or equal to",
    overlaps: "overlaps",
    includes: "includes",
    excludes: "excludes",
    includesAllOf: "includes all of",
    includesAnyOf: "includes any of",
    empty: "is empty",
    notEmpty: "is not empty",
  },

  // Placeholders
  placeholders: {
    enterField: (fieldType: string) => `Enter ${fieldType}...`,
    selectField: "Select...",
    searchField: (fieldName: string) => `Search ${fieldName.toLowerCase()}...`,
    enterKey: "Enter key...",
    enterValue: "Enter value...",
  },

  // Helper functions
  helpers: {
    formatOperator: (operator: string) => operator.replace(/_/g, " "),
  },

  // Validation
  validation: {
    invalidEmail: "Invalid email format",
    invalidUrl: "Invalid URL format",
    invalidTel: "Invalid phone format",
    invalid: "Invalid input format",
  },
}

// Context for all Filter component props
interface FilterContextValue {
  variant: "solid" | "default"
  size: "sm" | "default" | "lg"
  radius: "default" | "full"
  i18n: FilterI18nConfig
  className?: string
  showSearchInput?: boolean
  trigger?: React.ReactNode
  allowMultiple?: boolean
}

const FilterContext = createContext<FilterContextValue>({
  variant: "default",
  size: "default",
  radius: "default",
  i18n: DEFAULT_I18N,
  className: undefined,
  showSearchInput: true,
  trigger: undefined,
  allowMultiple: true,
})

const useFilterContext = () => useContext(FilterContext)

// Container variant for filters wrapper
const filtersContainerVariants = cva("flex flex-wrap items-center", {
  variants: {
    variant: {
      solid: "gap-component",
      default: "",
    },
    size: {
      sm: "gap-micro",
      default: "gap-component",
      lg: "gap-section",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function FilterInput<T = unknown>({
  field,
  onBlur,
  onKeyDown,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  field?: FilterFieldConfig<T>
}) {
  const context = useFilterContext()
  const [isValid, setIsValid] = useState(true)
  const [validationMessage, setValidationMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [props.autoFocus])

  // Validation function to check if input matches pattern
  const validateInput = (value: string, pattern?: string): boolean => {
    if (!pattern || !value) return true
    const regex = new RegExp(pattern)
    return regex.test(value)
  }

  // Get validation message for field type
  const getValidationMessage = (): string => {
    return context.i18n.validation.invalid
  }

  // Handle blur event - validate when user leaves input
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    const pattern = field?.pattern || props.pattern

    // Only validate if there's a value and (pattern or validation function)
    if (value && (pattern || field?.validation)) {
      let valid = true
      let customMessage = ""

      // If there's a custom validation function, use it
      if (field?.validation) {
        const result = field.validation(value)
        // Handle both boolean and object return types
        if (typeof result === "boolean") {
          valid = result
        } else {
          valid = result.valid
          customMessage = result.message || ""
        }
      } else if (pattern) {
        // Use pattern validation
        valid = validateInput(value, pattern)
      }

      setIsValid(valid)
      setValidationMessage(valid ? "" : customMessage || getValidationMessage())
    } else {
      // Reset validation state for empty values or no validation
      setIsValid(true)
      setValidationMessage("")
    }

    // Call the original onBlur if provided
    onBlur?.(e)
  }

  // Handle keydown event - hide validation error when user starts typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Hide validation error when user starts typing (any key except special keys)
    if (
      !isValid &&
      ![
        "Tab",
        "Escape",
        "Enter",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ].includes(e.key)
    ) {
      setIsValid(true)
      setValidationMessage("")
    }

    // Call the original onKeyDown if provided
    onKeyDown?.(e)
  }

  return (
    <InputGroup
      className={cn(
        "w-36",
        context.size == "sm" &&
          "h-7!",
        context.size == "default" &&
          "h-8!",
        context.size == "lg" &&
          "h-9!",
        className
      )}
    >
      {field?.prefix && (
        <InputGroupAddon>
          <InputGroupText>{field.prefix}</InputGroupText>
        </InputGroupAddon>
      )}
      <InputGroupInput
        ref={inputRef}
        aria-invalid={!isValid}
        aria-describedby={
          !isValid && validationMessage
            ? `${field?.key || "input"}-error`
            : undefined
        }
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          context.size == "sm" &&
            "h-7! text-xs",
          context.size == "default" &&
            "h-8!",
          context.size == "lg" &&
            "h-9!"
        )}
        {...props}
      />
      {!isValid && validationMessage && (
        <InputGroupAddon align="inline-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton size="icon-xs">
                  <HugeiconsIcon
                    icon={AlertCircleIcon}
                    className="text-destructive size-3.5"
                  />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{validationMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InputGroupAddon>
      )}

      {field?.suffix && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>{field.suffix}</InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

// Generic types for flexible filter system
export interface FilterOption<T = unknown> {
  value: T
  label: string
  icon?: React.ReactNode
  metadata?: Record<string, unknown>
  className?: string
}

export interface FilterOperator {
  value: string
  label: string
  supportsMultiple?: boolean
}

// Custom renderer props interface
export interface CustomRendererProps<T = unknown> {
  field: FilterFieldConfig<T>
  values: T[]
  onChange: (values: T[]) => void
  operator: string
}

// Grouped field configuration interface
export interface FilterFieldGroup<T = unknown> {
  group?: string
  fields: FilterFieldConfig<T>[]
}

// Union type for both flat and grouped field configurations
export type FilterFieldsConfig<T = unknown> =
  | FilterFieldConfig<T>[]
  | FilterFieldGroup<T>[]

export interface FilterFieldConfig<T = unknown> {
  key?: string
  label?: string
  icon?: React.ReactNode
  type?:
    | "select"
    | "multiselect"
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "timestamp"
    | "custom"
    | "separator"
  // Group-level configuration
  group?: string
  fields?: FilterFieldConfig<T>[]
  // Field-specific options
  options?: FilterOption<T>[]
  operators?: FilterOperator[]
  customRenderer?: (props: CustomRendererProps<T>) => React.ReactNode
  customValueRenderer?: (
    values: T[],
    options: FilterOption<T>[]
  ) => React.ReactNode
  placeholder?: string
  searchable?: boolean
  maxSelections?: number
  min?: number
  max?: number
  step?: number
  prefix?: string | React.ReactNode
  suffix?: string | React.ReactNode
  pattern?: string
  validation?: (
    value: unknown
  ) => boolean | { valid: boolean; message?: string }
  allowCustomValues?: boolean
  className?: string
  menuPopupClassName?: string
  // Grouping options (legacy support)
  groupLabel?: string
  // Boolean field options
  onLabel?: string
  offLabel?: string
  // Input event handlers
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  // Default operator to use when creating a filter for this field
  defaultOperator?: string
  // Controlled values support for this field
  value?: T[]
  onValueChange?: (values: T[]) => void
}

// Helper functions to handle both flat and grouped field configurations
const isFieldGroup = <T = unknown,>(
  item: FilterFieldConfig<T> | FilterFieldGroup<T>
): item is FilterFieldGroup<T> => {
  return "fields" in item && Array.isArray(item.fields)
}

// Helper function to check if a FilterFieldConfig is a group-level configuration
const isGroupLevelField = <T = unknown,>(
  field: FilterFieldConfig<T>
): boolean => {
  return Boolean(field.group && field.fields)
}

const flattenFields = <T = unknown,>(
  fields: FilterFieldsConfig<T>
): FilterFieldConfig<T>[] => {
  return fields.reduce<FilterFieldConfig<T>[]>((acc, item) => {
    if (isFieldGroup(item)) {
      return [...acc, ...item.fields]
    }
    // Handle group-level fields (new structure)
    if (isGroupLevelField(item)) {
      return [...acc, ...item.fields!]
    }
    return [...acc, item]
  }, [])
}

const getFieldsMap = <T = unknown,>(
  fields: FilterFieldsConfig<T>
): Record<string, FilterFieldConfig<T>> => {
  const flatFields = flattenFields(fields)
  return flatFields.reduce(
    (acc, field) => {
      // Only add fields that have a key (skip group-level configurations)
      if (field.key) {
        acc[field.key] = field
      }
      return acc
    },
    {} as Record<string, FilterFieldConfig<T>>
  )
}

// Helper function to create operators from i18n config
const createOperatorsFromI18n = (
  i18n: FilterI18nConfig
): Record<string, FilterOperator[]> => ({
  select: [
    { value: "is", label: i18n.operators.is },
    { value: "is_not", label: i18n.operators.isNot },
    { value: "empty", label: i18n.operators.empty },
    { value: "not_empty", label: i18n.operators.notEmpty },
  ],
  multiselect: [
    { value: "is_any_of", label: i18n.operators.isAnyOf },
    { value: "is_not_any_of", label: i18n.operators.isNotAnyOf },
    { value: "includes_all", label: i18n.operators.includesAll },
    { value: "excludes_all", label: i18n.operators.excludesAll },
    { value: "empty", label: i18n.operators.empty },
    { value: "not_empty", label: i18n.operators.notEmpty },
  ],
  text: [
    { value: "is", label: i18n.operators.is },
    { value: "is_not", label: i18n.operators.isNot },
    { value: "contains", label: i18n.operators.contains },
    { value: "not_contains", label: i18n.operators.notContains },
    { value: "starts_with", label: i18n.operators.startsWith },
    { value: "ends_with", label: i18n.operators.endsWith },
    { value: "empty", label: i18n.operators.empty },
    { value: "not_empty", label: i18n.operators.notEmpty },
  ],
  number: [
    { value: "is", label: i18n.operators.is },
    { value: "is_not", label: i18n.operators.isNot },
    { value: "gt", label: i18n.operators.greaterThan },
    { value: "lt", label: i18n.operators.lessThan },
    { value: "gte", label: i18n.operators.greaterThanOrEqual },
    { value: "lte", label: i18n.operators.lessThanOrEqual },
    { value: "between", label: i18n.operators.between },
    { value: "not_empty", label: i18n.operators.notEmpty },
    { value: "empty", label: i18n.operators.empty },
  ],
  boolean: [
    { value: "is", label: i18n.operators.is },
    { value: "is_not", label: i18n.operators.isNot },
  ],
  date: [
    { value: "is", label: i18n.operators.is },
    { value: "is_not", label: i18n.operators.isNot },
    { value: "before", label: i18n.operators.before },
    { value: "after", label: i18n.operators.after },
    { value: "between", label: i18n.operators.between },
    { value: "empty", label: i18n.operators.empty },
    { value: "not_empty", label: i18n.operators.notEmpty },
  ],
  timestamp: [
    { value: "is", label: i18n.operators.is },
    { value: "is_not", label: i18n.operators.isNot },
    { value: "before", label: i18n.operators.before },
    { value: "after", label: i18n.operators.after },
    { value: "between", label: i18n.operators.between },
    { value: "not_empty", label: i18n.operators.notEmpty },
    { value: "empty", label: i18n.operators.empty },
  ],
  custom: [
    { value: "is", label: i18n.operators.is },
    { value: "is_not", label: i18n.operators.isNot },
    { value: "empty", label: i18n.operators.empty },
    { value: "not_empty", label: i18n.operators.notEmpty },
  ],
})

// Default operators for different field types (using default i18n)
export const DEFAULT_OPERATORS: Record<string, FilterOperator[]> =
  createOperatorsFromI18n(DEFAULT_I18N)

// Helper function to get operators for a field
const getOperatorsForField = <T = unknown,>(
  field: FilterFieldConfig<T>,
  values: T[],
  i18n: FilterI18nConfig
): FilterOperator[] => {
  if (field.operators) return field.operators

  const operators = createOperatorsFromI18n(i18n)

  // Determine field type for operator selection
  let fieldType = field.type || "select"

  // If it's a select field but has multiple values, treat as multiselect
  if (fieldType === "select" && values.length > 1) {
    fieldType = "multiselect"
  }

  // If it's a multiselect field or has multiselect operators, use multiselect operators
  if (fieldType === "multiselect" || field.type === "multiselect") {
    return operators.multiselect
  }

  return operators[fieldType] || operators.select
}

interface FilterOperatorDropdownProps<T = unknown> {
  field: FilterFieldConfig<T>
  operator: string
  values: T[]
  onChange: (operator: string) => void
}

function FilterOperatorDropdown<T = unknown>({
  field,
  operator,
  values,
  onChange,
}: FilterOperatorDropdownProps<T>) {
  const context = useFilterContext()
  const operators = getOperatorsForField(field, values, context.i18n)

  // Find the operator label, with fallback to formatted operator name
  const operatorLabel =
    operators.find((op) => op.value === operator)?.label ||
    context.i18n.helpers.formatOperator(operator)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className="font-medium normal-case tracking-normal text-muted-foreground hover:text-foreground"
        >
          {operatorLabel}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            data-icon="inline-end"
            className="opacity-70"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-fit">
        {operators.map((op) => (
          <DropdownMenuItem
            key={op.value}
            onClick={() => onChange(op.value)}
            className={cn(
              "data-highlighted:bg-accent data-highlighted:text-accent-foreground flex items-center justify-between"
            )}
          >
            <span>{op.label}</span>
            <HugeiconsIcon
              icon={Tick02Icon}
              className={cn(
                "text-primary ms-auto",
                op.value === operator ? "opacity-100" : "opacity-0"
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface FilterValueSelectorProps<T = unknown> {
  field: FilterFieldConfig<T>
  values: T[]
  onChange: (values: T[]) => void
  operator: string
  autoFocus?: boolean
}


function FilterValueSelector<T = unknown>({
  field,
  values,
  onChange,
  operator,
  autoFocus,
}: FilterValueSelectorProps<T>) {
  if (operator === "empty" || operator === "not_empty") {
    return null
  }

  if (field.customRenderer) {
    return (
      <div className="w-full">
        {field.customRenderer({ field, values, onChange, operator })}
      </div>
    )
  }

  if (field.type === "text") {
    return (
      <FilterInput
        type="text"
        value={(values[0] as string) || ""}
        onChange={(e) => onChange([e.target.value] as T[])}
        placeholder={field.placeholder}
        pattern={field.pattern}
        field={field}
        className={cn("w-full", field.className)}
        autoFocus={autoFocus}
      />
    )
  }

  if (field.type === "number") {
    if (operator === "between") {
      return (
        <BetweenInputs
          values={values as unknown as (string | number)[]}
          onChange={(next) => onChange(next as T[])}
          inputType="number"
          placeholder={field.placeholder}
          autoFocus={autoFocus}
        />
      )
    }
    return (
      <FilterInput
        type="number"
        value={(values[0] as string) || ""}
        onChange={(e) => onChange([e.target.value] as T[])}
        placeholder={field.placeholder}
        field={field}
        className={cn("w-full", field.className)}
        autoFocus={autoFocus}
      />
    )
  }

  if (field.type === "timestamp") {
    if (operator === "between") {
      return (
        <BetweenInputs
          values={values as unknown as (string | number)[]}
          onChange={(next) => onChange(next as T[])}
          inputType="time"
          step={1}
          placeholder="00:00:00"
          autoFocus={autoFocus}
        />
      )
    }
    return (
      <FilterInput
        type="time"
        step={1}
        value={(values[0] as string) || ""}
        onChange={(e) => onChange([e.target.value] as T[])}
        placeholder="00:00:00"
        field={field}
        className={cn("w-full", field.className)}
        autoFocus={autoFocus}
      />
    )
  }

  if (field.type === "boolean") {
    return (
      <BooleanList<T>
        values={values}
        onChange={onChange}
      />
    )
  }

  if (field.type === "select" || field.type === "multiselect") {
    return (
      <InlineSelectList<T>
        field={field}
        values={values}
        onChange={onChange}
        isMultiSelect={field.type === "multiselect"}
      />
    )
  }

  return (
    <InlineSelectList<T>
      field={field}
      values={values}
      onChange={onChange}
      isMultiSelect={false}
    />
  )
}

function BetweenInputs({
  values,
  onChange,
  inputType,
  step,
  placeholder,
  autoFocus,
}: {
  values: (string | number)[]
  onChange: (next: (string | number)[]) => void
  inputType: "number" | "time"
  step?: number
  placeholder?: string
  autoFocus?: boolean
}) {
  const a = values[0] ?? ""
  const b = values[1] ?? ""
  const context = useFilterContext()
  return (
    <div className="flex w-full items-center gap-component">
      <InputGroup className="h-8 flex-1">
        <InputGroupInput
          type={inputType}
          step={step}
          value={String(a)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={(e) => onChange([e.target.value, b])}
          className="h-8 text-sm"
        />
      </InputGroup>
      <span className="text-xs font-medium text-muted-foreground">
        {context.i18n.to.toUpperCase() === "TO" ? "AND" : context.i18n.to}
      </span>
      <InputGroup className="h-8 flex-1">
        <InputGroupInput
          type={inputType}
          step={step}
          value={String(b)}
          placeholder={placeholder}
          onChange={(e) => onChange([a, e.target.value])}
          className="h-8 text-sm"
        />
      </InputGroup>
    </div>
  )
}

function BooleanList<T = unknown>({
  values,
  onChange,
}: {
  values: T[]
  onChange: (values: T[]) => void
}) {
  const context = useFilterContext()
  const current = values[0]
  const options: { value: T; label: string }[] = [
    { value: true as unknown as T, label: context.i18n.true },
    { value: false as unknown as T, label: context.i18n.false },
  ]
  return (
    <div className="flex flex-col gap-micro">
      {options.map((option) => {
        const isSelected = current === option.value
        return (
          <button
            key={String(option.value)}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onChange([option.value])}
            className={cn(
              "flex h-8 items-center gap-micro rounded-sm px-component text-start text-sm outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isSelected && "bg-accent text-accent-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring/50"
            )}
          >
            <span className="truncate">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

interface InlineSelectListProps<T = unknown> {
  field: FilterFieldConfig<T>
  values: T[]
  onChange: (values: T[]) => void
  isMultiSelect: boolean
}

function InlineSelectList<T = unknown>({
  field,
  values,
  onChange,
  isMultiSelect,
}: InlineSelectListProps<T>) {
  const context = useFilterContext()
  const [searchInput, setSearchInput] = useState("")
  const baseId = useId()

  const effectiveValues =
    field.value !== undefined ? (field.value as T[]) : values
  const options = field.options || []
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchInput.toLowerCase())
  )

  const toggle = (option: FilterOption<T>) => {
    const isSelected = effectiveValues.includes(option.value)
    const next = (isSelected
      ? effectiveValues.filter((v) => v !== option.value)
      : isMultiSelect
        ? [...effectiveValues, option.value]
        : [option.value]) as T[]

    if (
      !isSelected &&
      isMultiSelect &&
      field.maxSelections &&
      next.length > field.maxSelections
    ) {
      return
    }

    if (field.onValueChange) {
      field.onValueChange(next)
    } else {
      onChange(next)
    }
  }

  return (
    <div className="flex w-full flex-col gap-micro">
      {field.searchable !== false && (
        <InputGroup className="h-8 w-full">
          <InputGroupInput
            placeholder={context.i18n.placeholders.searchField(
              field.label || ""
            )}
            className="h-8 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </InputGroup>
      )}
      <ScrollArea
        className="max-h-60 **:data-[slot=scroll-area-scrollbar]:m-0"
        role="listbox"
        id={`${baseId}-listbox`}
      >
        <div className="flex flex-col gap-micro">
          {filtered.length === 0 ? (
            <div className="text-muted-foreground py-2 text-center text-sm">
              {context.i18n.noResultsFound}
            </div>
          ) : (
            filtered.map((option) => {
              const isSelected = effectiveValues.includes(option.value)
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggle(option)}
                  className={cn(
                    "flex h-8 items-center gap-micro rounded-sm px-component text-start text-sm outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent text-accent-foreground",
                    "focus-visible:ring-2 focus-visible:ring-ring/50",
                    option.className
                  )}
                >
                  {option.icon}
                  <span className="truncate">{option.label}</span>
                  {isMultiSelect && isSelected && (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      className="ms-auto size-3.5"
                    />
                  )}
                </button>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function getOperatorLabel<T = unknown>(
  field: FilterFieldConfig<T>,
  operator: string,
  values: T[],
  i18n: FilterI18nConfig
): string {
  const operators = getOperatorsForField(field, values, i18n)
  return (
    operators.find((op) => op.value === operator)?.label ||
    i18n.helpers.formatOperator(operator)
  )
}

function getValueSummary<T = unknown>(
  field: FilterFieldConfig<T>,
  values: T[],
  operator: string,
  i18n: FilterI18nConfig
): React.ReactNode {
  if (!values || values.length === 0) return null

  const nonEmpty = values.filter(
    (v) => v !== "" && v !== null && v !== undefined
  )
  if (nonEmpty.length === 0) return null

  if (field.customValueRenderer) {
    return field.customValueRenderer(values, field.options || [])
  }

  if (field.type === "boolean") {
    return values[0] ? i18n.true : i18n.false
  }

  if (operator === "between" && nonEmpty.length >= 2) {
    return `${nonEmpty[0]} – ${nonEmpty[1]}`
  }

  if (
    field.type === "text" ||
    field.type === "number" ||
    field.type === "date" ||
    field.type === "timestamp" ||
    !field.options ||
    field.options.length === 0
  ) {
    return nonEmpty.map(String).join(", ")
  }

  const selected = field.options.filter((opt) => values.includes(opt.value))
  if (selected.length === 0) return null
  if (selected.length === 1) return selected[0].label
  return `${selected.length} ${i18n.selectedCount}`
}

const chipVariants = cva(
  "group/chip inline-flex cursor-pointer items-center rounded-md border border-transparent bg-secondary text-secondary-foreground font-medium transition-[color,background-color,border-color,box-shadow] hover:bg-secondary/80 data-[open]:ring-2 data-[open]:ring-ring/50",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        default: "h-9 text-sm",
        lg: "h-10 text-sm",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const chipTriggerVariants = cva(
  "group/chip-trigger inline-flex h-full cursor-pointer items-center gap-micro rounded-l-md text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:pointer-events-none",
  {
    variants: {
      size: {
        sm: "ps-2.5 pe-1.5 [&_svg:not([class*='size-'])]:size-3",
        default: "ps-3 pe-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "ps-4 pe-2.5 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const chipCloseVariants = cva(
  "inline-flex h-full items-center justify-center rounded-r-md opacity-60 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      size: {
        sm: "w-5 pe-1 [&_svg]:size-3",
        default: "w-6 pe-1.5 [&_svg]:size-3.5",
        lg: "w-7 pe-2 [&_svg]:size-4",
      },
    },
    defaultVariants: { size: "default" },
  }
)

interface FilterChipProps<T = unknown> {
  filter: Filter<T>
  field: FilterFieldConfig<T>
  initiallyOpen?: boolean
  onUpdate: (updates: Partial<Filter<T>>) => void
  onRemove: () => void
}

function FilterChip<T = unknown>({
  filter,
  field,
  initiallyOpen,
  onUpdate,
  onRemove,
}: FilterChipProps<T>) {
  const context = useFilterContext()
  const [open, setOpen] = useState(false)
  const justMountedRef = useRef(true)

  useEffect(() => {
    if (!initiallyOpen) return
    const id = window.setTimeout(() => setOpen(true), 50)
    return () => window.clearTimeout(id)
  }, [initiallyOpen])

  useEffect(() => {
    const id = window.setTimeout(() => {
      justMountedRef.current = false
    }, 200)
    return () => window.clearTimeout(id)
  }, [])

  const valueSummary = getValueSummary(
    field,
    filter.values,
    filter.operator,
    context.i18n
  )
  const operatorLabel = getOperatorLabel(
    field,
    filter.operator,
    filter.values,
    context.i18n
  )
  const hasOperatorWithoutValue =
    filter.operator === "empty" || filter.operator === "not_empty"
  const isApplied = valueSummary != null || hasOperatorWithoutValue

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        data-active={isApplied || undefined}
        data-open={open || undefined}
        className={chipVariants({ size: context.size })}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className={chipTriggerVariants({ size: context.size })}
          >
            {field.icon}
            <span>{field.label}</span>
            {isApplied && (
              <>
                <span className="opacity-70 transition-opacity group-hover/chip-trigger:opacity-100">
                  {operatorLabel}
                </span>
                {valueSummary != null && <span>{valueSummary}</span>}
              </>
            )}
          </button>
        </PopoverTrigger>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label="Remove filter"
          className={chipCloseVariants({ size: context.size })}
        >
          <HugeiconsIcon icon={Cancel01Icon} />
        </button>
      </div>
      <PopoverContent
        align="start"
        className="w-72 gap-component p-component"
        onInteractOutside={(e) => {
          if (justMountedRef.current) e.preventDefault()
        }}
      >
        <div className="flex items-center gap-component">
          <span className="text-sm font-medium text-muted-foreground">
            {field.label}
          </span>
          <FilterOperatorDropdown<T>
            field={field}
            operator={filter.operator}
            values={filter.values}
            onChange={(operator) => onUpdate({ operator })}
          />
        </div>
        {filter.operator !== "empty" && filter.operator !== "not_empty" && (
          <FilterValueSelector<T>
            field={field}
            values={filter.values}
            operator={filter.operator}
            onChange={(values) => onUpdate({ values })}
            autoFocus={initiallyOpen}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

export interface Filter<T = unknown> {
  id: string
  field: string
  operator: string
  values: T[]
}

export interface FilterGroup<T = unknown> {
  id: string
  label?: string
  filters: Filter<T>[]
  fields: FilterFieldConfig<T>[]
}

interface FiltersContentProps<T = unknown> {
  filters: Filter<T>[]
  fields: FilterFieldsConfig<T>
  onChange: (filters: Filter<T>[]) => void
}

export const FiltersContent = <T = unknown,>({
  filters,
  fields,
  onChange,
}: FiltersContentProps<T>) => {
  const context = useFilterContext()
  const fieldsMap = useMemo(() => getFieldsMap(fields), [fields])

  const updateFilter = useCallback(
    (filterId: string, updates: Partial<Filter<T>>) => {
      onChange(
        filters.map((filter) => {
          if (filter.id === filterId) {
            const updatedFilter = { ...filter, ...updates }
            if (
              updates.operator === "empty" ||
              updates.operator === "not_empty"
            ) {
              updatedFilter.values = [] as T[]
            }
            return updatedFilter
          }
          return filter
        })
      )
    },
    [filters, onChange]
  )

  const removeFilter = useCallback(
    (filterId: string) => {
      onChange(filters.filter((filter) => filter.id !== filterId))
    },
    [filters, onChange]
  )

  return (
    <div
      className={cn(
        filtersContainerVariants({
          variant: context.variant,
          size: context.size,
        }),
        context.className
      )}
    >
      {filters.map((filter) => {
        const field = fieldsMap[filter.field]
        if (!field) return null

        return (
          <FilterChip<T>
            key={filter.id}
            filter={filter}
            field={field}
            onUpdate={(updates) => updateFilter(filter.id, updates)}
            onRemove={() => removeFilter(filter.id)}
          />
        )
      })}
    </div>
  )
}

interface FiltersProps<T = unknown> {
  filters: Filter<T>[]
  fields: FilterFieldsConfig<T>
  onChange: (filters: Filter<T>[]) => void
  className?: string
  variant?: "solid" | "default"
  size?: "sm" | "default" | "lg"
  radius?: "default" | "full"
  i18n?: Partial<FilterI18nConfig>
  showSearchInput?: boolean
  trigger?: React.ReactNode
  allowMultiple?: boolean
  menuPopupClassName?: string
  collapseAddButton?: boolean
  enableShortcut?: boolean
  shortcutKey?: string
  shortcutLabel?: string
}


export function Filters<T = unknown>({
  filters,
  fields,
  onChange,
  className,
  variant = "default",
  size = "default",
  radius = "default",
  i18n,
  showSearchInput = true,
  trigger,
  allowMultiple = true,
  menuPopupClassName,
  enableShortcut = false,
  shortcutKey = "f",
  shortcutLabel = "⌘F",
}: FiltersProps<T>) {
  const [addFilterOpen, setAddFilterOpen] = useState(false)
  const [menuSearchInput, setMenuSearchInput] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [lastAddedFilterId, setLastAddedFilterId] = useState<string | null>(
    null
  )
  const rootInputRef = useRef<HTMLInputElement>(null)
  const rootId = useId()

  useEffect(() => {
    if (!enableShortcut) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === shortcutKey.toLowerCase() &&
        !addFilterOpen
      ) {
        e.preventDefault()
        setAddFilterOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enableShortcut, shortcutKey, addFilterOpen])

  useEffect(() => {
    setHighlightedIndex(-1)
  }, [menuSearchInput])

  useEffect(() => {
    if (highlightedIndex >= 0 && addFilterOpen) {
      const element = document.getElementById(
        `${rootId}-item-${highlightedIndex}`
      )
      element?.scrollIntoView({ block: "nearest" })
    }
  }, [highlightedIndex, addFilterOpen, rootId])

  useEffect(() => {
    if (lastAddedFilterId) {
      const timer = setTimeout(() => {
        setLastAddedFilterId(null)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [lastAddedFilterId])

  const mergedI18n: FilterI18nConfig = {
    ...DEFAULT_I18N,
    ...i18n,
    operators: { ...DEFAULT_I18N.operators, ...i18n?.operators },
    placeholders: { ...DEFAULT_I18N.placeholders, ...i18n?.placeholders },
    validation: { ...DEFAULT_I18N.validation, ...i18n?.validation },
  }

  const fieldsMap = useMemo(() => getFieldsMap(fields), [fields])

  const updateFilter = useCallback(
    (filterId: string, updates: Partial<Filter<T>>) => {
      onChange(
        filters.map((filter) => {
          if (filter.id === filterId) {
            const updatedFilter = { ...filter, ...updates }
            if (
              updates.operator === "empty" ||
              updates.operator === "not_empty"
            ) {
              updatedFilter.values = [] as T[]
            }
            return updatedFilter
          }
          return filter
        })
      )
    },
    [filters, onChange]
  )

  const removeFilter = useCallback(
    (filterId: string) => {
      onChange(filters.filter((filter) => filter.id !== filterId))
    },
    [filters, onChange]
  )

  const addFilter = useCallback(
    (fieldKey: string) => {
      const field = fieldsMap[fieldKey]
      if (field && field.key) {
        const defaultOperator =
          field.defaultOperator ||
          (field.type === "multiselect"
            ? "is_any_of"
            : field.type === "text"
              ? "contains"
              : "is")
        const defaultValues: unknown[] =
          field.type === "text" || field.type === "number"
            ? [""]
            : field.type === "timestamp"
              ? [""]
              : []
        const newFilter = createFilter<T>(
          fieldKey,
          defaultOperator,
          defaultValues as T[]
        )
        setLastAddedFilterId(newFilter.id)
        onChange([...filters, newFilter])
        setAddFilterOpen(false)
        setMenuSearchInput("")
      }
    },
    [fieldsMap, filters, onChange]
  )

  const selectableFields = useMemo(() => {
    const flatFields = flattenFields(fields)
    return flatFields.filter((field) => {
      if (!field.key || field.type === "separator") return false
      if (allowMultiple) return true
      return !filters.some((filter) => filter.field === field.key)
    })
  }, [fields, filters, allowMultiple])

  const filteredFields = useMemo(() => {
    return selectableFields.filter(
      (f) =>
        !menuSearchInput ||
        f.label?.toLowerCase().includes(menuSearchInput.toLowerCase())
    )
  }, [selectableFields, menuSearchInput])

  useEffect(() => {
    if (addFilterOpen && filteredFields.length > 0) {
      setHighlightedIndex(0)
    }
  }, [addFilterOpen, filteredFields.length])

  return (
    <FilterContext.Provider
      value={{
        variant,
        size,
        radius,
        i18n: mergedI18n,
        className,
        trigger,
        allowMultiple,
      }}
    >
      <div
        className={cn(filtersContainerVariants({ variant, size }), className)}
      >
        {selectableFields.length > 0 && (
          <DropdownMenu
            open={addFilterOpen}
            onOpenChange={(open) => {
              setAddFilterOpen(open)
              if (!open) {
                setMenuSearchInput("")
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              {trigger || (
                <Button
                  variant="outline"
                  size={size}
                  className="font-medium normal-case tracking-normal"
                >
                  <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
                  {mergedI18n.addFilter}
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={cn("w-[220px]", menuPopupClassName)}
              align="start"
            >
              {showSearchInput && (
                <>
                  <div className="relative">
                    <Input
                      ref={rootInputRef}
                      role="combobox"
                      aria-controls={`${rootId}-listbox`}
                      aria-activedescendant={
                        highlightedIndex >= 0
                          ? `${rootId}-item-${highlightedIndex}`
                          : undefined
                      }
                      placeholder={mergedI18n.searchFields}
                      className={cn(
                        "h-8 rounded-none border-0 bg-transparent! px-component text-sm shadow-none",
                        "focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                      )}
                      value={menuSearchInput}
                      onChange={(e) => setMenuSearchInput(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault()
                          if (filteredFields.length > 0) {
                            setHighlightedIndex((prev) =>
                              prev < filteredFields.length - 1 ? prev + 1 : 0
                            )
                          }
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault()
                          if (filteredFields.length > 0) {
                            setHighlightedIndex((prev) =>
                              prev > 0 ? prev - 1 : filteredFields.length - 1
                            )
                          }
                        } else if (e.key === "Enter" && highlightedIndex >= 0) {
                          e.preventDefault()
                          const field = filteredFields[highlightedIndex]
                          if (field.key) {
                            addFilter(field.key)
                          }
                        } else if (e.key === "Escape") {
                          setAddFilterOpen(false)
                        }
                        e.stopPropagation()
                      }}
                    />
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}

              <div className="relative flex max-h-full">
                <div
                  className="flex max-h-[min(var(--radix-dropdown-menu-content-available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain"
                  role="listbox"
                  id={`${rootId}-listbox`}
                >
                  <ScrollArea className="**:data-[slot=scroll-area-scrollbar]:m-0">
                    {(() => {
                      if (filteredFields.length === 0) {
                        return (
                          <div className="text-muted-foreground py-2 text-center text-sm">
                            {mergedI18n.noFieldsFound}
                          </div>
                        )
                      }

                      return filteredFields.map((field, index) => {
                        const isHighlighted = highlightedIndex === index
                        const itemId = `${rootId}-item-${index}`

                        return (
                          <DropdownMenuItem
                            key={field.key}
                            id={itemId}
                            role="option"
                            aria-selected={isHighlighted}
                            data-highlighted={isHighlighted || undefined}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onClick={() => field.key && addFilter(field.key)}
                            className="data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                          >
                            {field.icon}
                            <span>{field.label}</span>
                          </DropdownMenuItem>
                        )
                      })
                    })()}
                  </ScrollArea>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {filters.map((filter) => {
          const field = fieldsMap[filter.field]
          if (!field) return null
          return (
            <FilterChip<T>
              key={filter.id}
              filter={filter}
              field={field}
              initiallyOpen={filter.id === lastAddedFilterId}
              onUpdate={(updates) => updateFilter(filter.id, updates)}
              onRemove={() => removeFilter(filter.id)}
            />
          )
        })}

        {filters.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="cursor-pointer px-component text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:rounded-md"
          >
            {mergedI18n.clearAll}
          </button>
        )}
      </div>
    </FilterContext.Provider>
  )
}

export const createFilter = <T = unknown,>(
  field: string,
  operator?: string,
  values: T[] = []
): Filter<T> => ({
  id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
  field,
  operator: operator || "is",
  values,
})

export const createFilterGroup = <T = unknown,>(
  id: string,
  label: string,
  fields: FilterFieldConfig<T>[],
  initialFilters: Filter<T>[] = []
): FilterGroup<T> => ({
  id,
  label,
  filters: initialFilters,
  fields,
})