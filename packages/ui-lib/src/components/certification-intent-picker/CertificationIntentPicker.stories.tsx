import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  CertificationIntentPicker,
  defaultCertificationIntentOptionsEn,
  type CertificationIntentId,
} from "./CertificationIntentPicker";

const meta = {
  title: "Request Management/CertificationIntentPicker",
  component: CertificationIntentPicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Wizard **intent** step: product certification, ATG, and innovation are prominent cards; PROCERTUS attest, EPD, and partijkeuring are quieter secondary request types. Props-only: parent controls `value` and `onValueChange` (Task D / Stavaza #4).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CertificationIntentPicker>;

export default meta;

function DefaultStory() {
  const [v, setV] = useState<CertificationIntentId | undefined>(undefined);
  return (
    <div className="max-w-5xl space-y-4">
      <CertificationIntentPicker
        value={v}
        onValueChange={setV}
        options={defaultCertificationIntentOptionsEn}
      />
      <p className="text-sm text-muted-foreground" data-testid="selection-readout" role="status">
        {v ? `Selected intent: ${v}` : "No selection yet — choose a card to continue (story)."}
      </p>
    </div>
  );
}

export const Default = {
  render: () => <DefaultStory />,
} as unknown as StoryObj<typeof meta>;

function PreselectedStory() {
  const [v, setV] = useState<CertificationIntentId | undefined>("atg");
  return (
    <div className="max-w-4xl">
      <CertificationIntentPicker
        value={v}
        onValueChange={setV}
        options={defaultCertificationIntentOptionsEn}
        layout="grid"
      />
    </div>
  );
}

export const WithGridAndSelection = {
  render: () => <PreselectedStory />,
} as unknown as StoryObj<typeof meta>;
