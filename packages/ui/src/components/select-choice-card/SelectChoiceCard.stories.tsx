import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

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
          "**Single** (`RadioGroup`) or **multiple** (`Checkbox`) selectable cards across three appearances (`default`, `hero`, `minimal`) and five styles (`elevated`, `default`, `faded`, `ghost`, `no-border`). Selection state via {@link useChoiceSelection}.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectChoiceCard>;

export default meta;

// — — — Default — — —
function DefaultStory() {
  const [v, setV] = useState("default-card");
  return (
    <div className="w-full max-w-md">
      <SelectChoiceCardGroup value={v} onValueChange={setV} selectionMode="single">
        <SelectChoiceCard
          value="default-card"
          controlId="default-card"
          title="Product certification"
          description="Canonical card — default style, default appearance, leading radio."
        />
      </SelectChoiceCardGroup>
    </div>
  );
}

export const Default = {
  render: () => <DefaultStory />,
} as unknown as StoryObj<typeof meta>;

// — — — Style: elevated · default · faded · no-border · ghost — — —
const styleVariants = ["elevated", "default", "faded", "no-border", "ghost"] as const;

function StyleVariantsStory() {
  const [v, setV] = useState("default-option");
  return (
    <div className="w-full max-w-md">
      <SelectChoiceCardGroup
        legend="Style variants"
        hint="elevated · default · faded · no-border · ghost — same chrome, different emphasis."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        {styleVariants.map((variant) => (
          <SelectChoiceCard
            key={variant}
            value={`${variant}-option`}
            controlId={`sc-${variant}`}
            title={`${variant[0]!.toUpperCase()}${variant.slice(1)} variant`}
            description="Optional description that scales with the variant."
            variant={variant}
          />
        ))}
      </SelectChoiceCardGroup>
    </div>
  );
}

export const StyleVariants = {
  render: () => <StyleVariantsStory />,
} as unknown as StoryObj<typeof meta>;

// — — — Appearance: default — — —
function AppearanceDefaultStory() {
  const [v, setV] = useState("def-a");
  return (
    <div className="w-full max-w-md">
      <SelectChoiceCardGroup
        legend="Default appearance"
        hint="Inline control + title with optional description below — the standard list layout."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          value="def-a"
          controlId="def-a"
          title="Product certification"
          description="Inline description sits below the title."
        />
        <SelectChoiceCard
          value="def-b"
          controlId="def-b"
          title="ATG"
          description="Inline description sits below the title."
        />
      </SelectChoiceCardGroup>
    </div>
  );
}

export const AppearanceDefault = {
  render: () => <AppearanceDefaultStory />,
} as unknown as StoryObj<typeof meta>;

// — — — Appearance: hero — — —
function AppearanceHeroStory() {
  const choice = useChoiceSelection({ mode: "single", defaultSelectedId: "plans" });
  return (
    <div className="flex w-full max-w-5xl flex-col gap-section">
      <SelectChoiceCardGroup
        legend="Hero appearance"
        hint="Two-zone tier-card layout — title + control in the header strip, description in the body."
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
        <SelectChoiceCard
          appearance="hero"
          variant="no-border"
          value="no-border"
          controlId="hero-no-border"
          title="No-border"
          description="Card surface without the border outline."
        />
        <SelectChoiceCard
          appearance="hero"
          variant="ghost"
          value="ghost"
          controlId="hero-ghost"
          title="Ghost"
          description="Surface-less option that lifts to foreground on hover and selection."
        />
      </SelectChoiceCardGroup>
      <p className="text-sm text-muted-foreground" role="status">
        Hook: selectedId = {choice.selectedId ?? "(none)"}
      </p>
    </div>
  );
}

export const AppearanceHero = {
  render: () => <AppearanceHeroStory />,
} as unknown as StoryObj<typeof meta>;

// — — — Appearance: minimal (also covers the “no visible control” case) — — —
function AppearanceMinimalStory() {
  const [v, setV] = useState("min-default");
  return (
    <div className="w-full max-w-2xl">
      <SelectChoiceCardGroup
        legend="Minimal appearance"
        hint="Title-only chip — no description, no leading icon. The native control stays sr-only for keyboard + screen-reader access, so this also covers the “no visible control” case."
        layout="grid"
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          appearance="minimal"
          variant="default"
          value="min-default"
          controlId="min-default"
          title="Default"
        />
        <SelectChoiceCard
          appearance="minimal"
          variant="elevated"
          value="min-elevated"
          controlId="min-elevated"
          title="Elevated"
        />
        <SelectChoiceCard
          appearance="minimal"
          variant="faded"
          value="min-faded"
          controlId="min-faded"
          title="Faded"
        />
        <SelectChoiceCard
          appearance="minimal"
          variant="no-border"
          value="min-no-border"
          controlId="min-no-border"
          title="No-border"
        />
        <SelectChoiceCard
          appearance="minimal"
          variant="ghost"
          value="min-ghost"
          controlId="min-ghost"
          title="Ghost"
        />
      </SelectChoiceCardGroup>
    </div>
  );
}

export const AppearanceMinimal = {
  render: () => <AppearanceMinimalStory />,
} as unknown as StoryObj<typeof meta>;

// — — — Control position: leading — — —
function ControlPositionLeadingStory() {
  const [v, setV] = useState("");
  return (
    <div className="w-full max-w-md">
      <SelectChoiceCardGroup
        legend="Leading control"
        hint="Control renders before the title — the default layout."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          value="lead-a"
          controlId="lead-a"
          title="Product certification"
          description="Control sits at the start of the row."
          controlPosition="leading"
        />
        <SelectChoiceCard
          value="lead-b"
          controlId="lead-b"
          title="ATG"
          description="Control sits at the start of the row."
          controlPosition="leading"
        />
      </SelectChoiceCardGroup>
    </div>
  );
}

export const ControlPositionLeading = {
  render: () => <ControlPositionLeadingStory />,
} as unknown as StoryObj<typeof meta>;

// — — — Control position: trailing — — —
function ControlPositionTrailingStory() {
  const [v, setV] = useState("");
  return (
    <div className="w-full max-w-md">
      <SelectChoiceCardGroup
        legend="Trailing control"
        hint="Control renders after the title — useful when pairing non-hero cards with hero cards above."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          value="trail-a"
          controlId="trail-a"
          title="PROCERTUS attest"
          description="Control sits at the end of the row."
          controlPosition="trailing"
        />
        <SelectChoiceCard
          value="trail-b"
          controlId="trail-b"
          title="EPD"
          description="Control sits at the end of the row."
          controlPosition="trailing"
        />
      </SelectChoiceCardGroup>
    </div>
  );
}

export const ControlPositionTrailing = {
  render: () => <ControlPositionTrailingStory />,
} as unknown as StoryObj<typeof meta>;

// — — — Control type: radio (single) — — —
function ControlRadioStory() {
  const [v, setV] = useState("radio-a");
  return (
    <div className="w-full max-w-md">
      <SelectChoiceCardGroup
        legend="Radio control (single mode)"
        hint="selectionMode=single — pick exactly one. RadioGroupItem under the hood."
        value={v}
        onValueChange={setV}
        selectionMode="single"
      >
        <SelectChoiceCard
          value="radio-a"
          controlId="radio-a"
          title="Option A"
          description="Only one can be active."
        />
        <SelectChoiceCard
          value="radio-b"
          controlId="radio-b"
          title="Option B"
          description="Only one can be active."
        />
        <SelectChoiceCard
          value="radio-c"
          controlId="radio-c"
          title="Option C"
          description="Only one can be active."
        />
      </SelectChoiceCardGroup>
    </div>
  );
}

export const ControlRadio = {
  render: () => <ControlRadioStory />,
} as unknown as StoryObj<typeof meta>;

// — — — Control type: checkbox (multiple) — — —
function ControlCheckboxStory() {
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
        legend="Checkbox control (multiple mode)"
        hint="selectionMode=multiple — pick any. Checkbox under the hood; pair with useChoiceSelection."
      >
        {options.map((option) => (
          <SelectChoiceCard
            key={option.id}
            selectionMode="multiple"
            value={option.id}
            controlId={`check-${option.id}`}
            name="check"
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

export const ControlCheckbox = {
  render: () => <ControlCheckboxStory />,
} as unknown as StoryObj<typeof meta>;
