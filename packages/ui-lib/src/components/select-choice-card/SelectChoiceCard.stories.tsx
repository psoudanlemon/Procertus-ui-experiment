import { Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { RadioGroup } from "@procertus-ui/ui";

import { SelectChoiceCard } from "./SelectChoiceCard";
import { SelectChoiceCardGroup } from "./SelectChoiceCardGroup";
import { useChoiceSelection } from "./useChoiceSelection";

const meta = {
  title: "UILib/SelectChoiceCard",
  component: SelectChoiceCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "**Single** (`RadioGroup`) or **multiple** (`Checkbox`) selectable cards; `appearance=\"hero\"` matches empty-state prominence (centered, large type, optional icon well). Selection state via {@link useChoiceSelection}.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectChoiceCard>;

export default meta;

const emphases = ["primary", "secondary", "tertiary"] as const;

function RowEmphasesSingle() {
  const [v, setV] = useState("primary-option");
  return (
    <RadioGroup value={v} onValueChange={setV} className="flex w-full max-w-md flex-col gap-component">
      {emphases.map((e) => (
        <SelectChoiceCard
          key={e}
          value={`${e}-option`}
          controlId={`sc-${e}`}
          title={`${e[0]!.toUpperCase()}${e.slice(1)} path`}
          description="Optional description that scales with the emphasis level."
          emphasis={e}
        />
      ))}
    </RadioGroup>
  );
}

export const DefaultEmphasesSingle = {
  render: () => <RowEmphasesSingle />,
} as unknown as StoryObj<typeof meta>;

function HeroSingleStory() {
  const choice = useChoiceSelection({ mode: "single", defaultSelectedId: "plans" });
  return (
    <div className="flex w-full max-w-5xl flex-col gap-region">
      <SelectChoiceCardGroup
        legend="Hero appearance"
        hint="Large type, padded, centered — control is visually hidden."
        layout="grid"
        selectionMode="single"
        value={choice.selectedId ?? ""}
        onValueChange={(id) => choice.setSelectedId(id === "" ? undefined : id)}
      >
        <SelectChoiceCard
          appearance="hero"
          value="plans"
          controlId="hero-plans"
          emphasis="primary"
          icon={<HugeiconsIcon icon={Tick01Icon} strokeWidth={1.5} className="size-8" />}
          title="Structured plans"
          description="Highest emphasis path with icon in an Empty-style circular well."
        />
        <SelectChoiceCard
          appearance="hero"
          value="consult"
          controlId="hero-consult"
          emphasis="secondary"
          icon={<HugeiconsIcon icon={Tick01Icon} strokeWidth={1.5} className="size-7 opacity-70" />}
          title="Consulting attestation"
          description="Secondary surface — still readable at a glance."
        />
        <SelectChoiceCard
          appearance="hero"
          value="later"
          controlId="hero-later"
          emphasis="tertiary"
          title="Explore later"
          description="De-emphasized tertiary card with dashed chrome when applicable."
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
            emphasis={id === "a" ? "primary" : id === "b" ? "secondary" : "tertiary"}
            checked={choice.isSelected(id)}
            onCheckedChange={(c) => choice.setIncluded(id, c === true)}
            icon={<HugeiconsIcon icon={Tick01Icon} className="size-7" strokeWidth={1.5} />}
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
        hint="Tertiary options are visually lighter for de-emphasized routes."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          value="a"
          controlId="fs-a"
          title="Primary (product certification)"
          description="Heaviest border and focus ring when selected."
          emphasis="primary"
        />
        <SelectChoiceCard
          value="b"
          controlId="fs-b"
          title="Secondary (ATG)"
          description="Standard card weight."
          emphasis="secondary"
        />
        <SelectChoiceCard
          value="c"
          controlId="fs-c"
          title="Tertiary (innovation)"
          description="Dashed border, compact padding."
          emphasis="tertiary"
        />
      </SelectChoiceCardGroup>
    </div>
  );
}

export const GroupWithLegend = {
  render: () => <FieldsetGridStory />,
} as unknown as StoryObj<typeof meta>;
