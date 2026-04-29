import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { RadioGroup } from "@/components/ui/radio-group";

import { SelectChoiceCard } from "./SelectChoiceCard";
import { SelectChoiceCardGroup } from "./SelectChoiceCardGroup";
import { useChoiceSelection } from "./useChoiceSelection";

const meta = {
  title: "components/SelectChoiceCard",
  component: SelectChoiceCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "**Single** (`RadioGroup`) or **multiple** (`Checkbox`) selectable cards; `appearance=\"hero\"` gives a two-zone tier-card layout. Selection state via {@link useChoiceSelection}.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectChoiceCard>;

export default meta;

const variants = ["elevated", "default", "faded"] as const;

function RowVariantsSingle() {
  const [v, setV] = useState("default-option");
  return (
    <RadioGroup value={v} onValueChange={setV} className="flex w-full max-w-md flex-col gap-component">
      {variants.map((variant) => (
        <SelectChoiceCard
          key={variant}
          value={`${variant}-option`}
          controlId={`sc-${variant}`}
          title={`${variant[0]!.toUpperCase()}${variant.slice(1)} variant`}
          description="Optional description that scales with the variant."
          variant={variant}
        />
      ))}
    </RadioGroup>
  );
}

export const Variants = {
  render: () => <RowVariantsSingle />,
} as unknown as StoryObj<typeof meta>;

function HeroSingleStory() {
  const choice = useChoiceSelection({ mode: "single", defaultSelectedId: "plans" });
  return (
    <div className="flex w-full max-w-5xl flex-col gap-section">
      <SelectChoiceCardGroup
        legend="Hero appearance"
        hint="Two-zone tier-card layout — same variants as the default cards."
        layout="grid"
        selectionMode="single"
        value={choice.selectedId ?? ""}
        onValueChange={(id) => choice.setSelectedId(id === "" ? undefined : id)}
      >
        <SelectChoiceCard
          appearance="hero"
          variant="elevated"
          value="plans"
          controlId="hero-plans"
          title="Elevated"
          description="Adds a soft drop shadow for the recommended path."
        />
        <SelectChoiceCard
          appearance="hero"
          variant="default"
          value="consult"
          controlId="hero-consult"
          title="Default"
          description="Standard surface with a clean border."
        />
        <SelectChoiceCard
          appearance="hero"
          variant="faded"
          value="later"
          controlId="hero-later"
          title="Faded"
          description="Dashed border and reduced opacity for de-emphasized routes."
        />
      </SelectChoiceCardGroup>
      <p className="text-sm text-muted-foreground" role="status">
        Hook: selectedId = {choice.selectedId ?? "(none)"}
      </p>
    </div>
  );
}

export const HeroAppearanceSingleWithHook = {
  render: () => <HeroSingleStory />,
} as unknown as StoryObj<typeof meta>;

function MultipleWithHookStory() {
  const choice = useChoiceSelection({ mode: "multiple", defaultSelectedIds: ["a"] });
  const ids = ["a", "b", "c"] as const;
  return (
    <div className="w-full max-w-4xl space-y-component">
      <SelectChoiceCardGroup selectionMode="multiple" legend="Pick any" layout="grid">
        {ids.map((id) => (
          <SelectChoiceCard
            key={id}
            appearance="hero"
            selectionMode="multiple"
            value={id}
            controlId={`multi-${id}`}
            checked={choice.isSelected(id)}
            onCheckedChange={(c) => choice.setIncluded(id, c === true)}
            title={id === "a" ? "First option" : id === "b" ? "Second option" : "Third option"}
            description="Checkbox-backed; each toggle updates useChoiceSelection."
          />
        ))}
      </SelectChoiceCardGroup>
      <p className="text-sm text-muted-foreground" role="status">
        selectedIds: [{choice.selectedIds.join(", ") || " "}]
      </p>
    </div>
  );
}

function SmallMultipleWithHookStory() {
  const choice = useChoiceSelection({ mode: "multiple", defaultSelectedIds: ["benor", "epd"] });
  const options = [
    {
      id: "ce",
      title: "CE-markering",
      description: "Productgebonden conformiteitsmarkering voor het traject dat de uitvoerder volgt.",
    },
    {
      id: "benor",
      title: "BENOR-certificatie",
      description: "BENOR-beschikbaarheid voor deze productgroep.",
    },
    {
      id: "epd",
      title: "Environmental Product Declaration",
      description: "Milieuproductverklaring die samen met andere aanvragen kan worden toegevoegd.",
    },
  ];

  return (
    <div className="w-full max-w-2xl space-y-component">
      <SelectChoiceCardGroup
        selectionMode="multiple"
        legend="Small multi-select cards"
        hint="Default-size cards for dense option lists. Multiple choices can be active at once."
      >
        {options.map((option) => (
          <SelectChoiceCard
            key={option.id}
            selectionMode="multiple"
            value={option.id}
            controlId={`small-multi-${option.id}`}
            name="small-multi"
            title={option.title}
            description={option.description}
            checked={choice.isSelected(option.id)}
            onCheckedChange={(checked) => choice.setIncluded(option.id, checked)}
          />
        ))}
      </SelectChoiceCardGroup>
      <p className="text-sm text-muted-foreground" role="status">
        selectedIds: [{choice.selectedIds.join(", ") || " "}]
      </p>
    </div>
  );
}

export const SmallCardsMultipleWithHook = {
  render: () => <SmallMultipleWithHookStory />,
} as unknown as StoryObj<typeof meta>;

export const HeroMultipleWithHook = {
  render: () => <MultipleWithHookStory />,
} as unknown as StoryObj<typeof meta>;

function FieldsetGridStory() {
  const [v, setV] = useState("");
  return (
    <div className="w-full min-w-0 max-w-2xl">
      <SelectChoiceCardGroup
        layout="grid"
        legend="Pick one"
        hint="All cards use the default variant; switch to elevated or faded per card when needed."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          value="a"
          controlId="fs-a"
          title="Product certification"
          description="Standard card weight."
        />
        <SelectChoiceCard
          value="b"
          controlId="fs-b"
          title="ATG"
          description="Standard card weight."
        />
        <SelectChoiceCard
          value="c"
          controlId="fs-c"
          title="Innovation"
          description="Standard card weight."
        />
      </SelectChoiceCardGroup>
    </div>
  );
}

export const GroupWithLegend = {
  render: () => <FieldsetGridStory />,
} as unknown as StoryObj<typeof meta>;

function ControlPositionStory() {
  const [v, setV] = useState("trailing-b");
  return (
    <div className="flex w-full max-w-2xl flex-col gap-section">
      <SelectChoiceCardGroup
        legend="Leading control (default)"
        hint="Radio renders before the title — the original layout."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          value="leading-a"
          controlId="cp-leading-a"
          title="Product certification"
          description="Control sits at the start of the row."
        />
        <SelectChoiceCard
          value="leading-b"
          controlId="cp-leading-b"
          title="ATG"
          description="Control sits at the start of the row."
        />
      </SelectChoiceCardGroup>
      <SelectChoiceCardGroup
        legend="Trailing control"
        hint="Pair non-hero cards with hero cards above to keep the radio aligned to the right."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          value="trailing-a"
          controlId="cp-trailing-a"
          title="PROCERTUS attest"
          description="Control sits at the end of the row."
          controlPosition="trailing"
          variant="faded"
        />
        <SelectChoiceCard
          value="trailing-b"
          controlId="cp-trailing-b"
          title="EPD"
          description="Control sits at the end of the row."
          controlPosition="trailing"
          variant="faded"
        />
      </SelectChoiceCardGroup>
      <p className="text-sm text-muted-foreground" role="status">
        Selected: {v}
      </p>
    </div>
  );
}

export const ControlPosition = {
  render: () => <ControlPositionStory />,
} as unknown as StoryObj<typeof meta>;
