/**
 * First step of the certification request wizard: **clarify intent** — product-oriented
 * certification vs **non-product** routes (ATG, innovation / SSD) without forcing product
 * selection first (Stavaza #4, certification request flow analysis).
 */
import { useId } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { SelectChoiceCard } from "../select-choice-card/SelectChoiceCard";
import { SelectChoiceCardGroup } from "../select-choice-card/SelectChoiceCardGroup";
import type { SelectChoiceEmphasis } from "../select-choice-card/SelectChoiceCard";

/** Aligned with `meta.wizard.entryPoints` in the decision-tree JSON. */
export const CERTIFICATION_INTENT_IDS = [
  "regulated-certificate",
  "atg-attest",
  "innovation-attest-ssd",
] as const;

export type CertificationIntentId = (typeof CERTIFICATION_INTENT_IDS)[number];

export type CertificationIntentOption = {
  id: CertificationIntentId;
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  /** Match {@link SelectChoiceEmphasis} — use **primary** for the main product path. */
  emphasis: SelectChoiceEmphasis;
  disabled?: boolean;
};

export type CertificationIntentPickerProps = {
  className?: string;
  /** Current selection, or `undefined` when nothing is selected yet. */
  value: CertificationIntentId | undefined;
  onValueChange: (id: CertificationIntentId) => void;
  options: CertificationIntentOption[];
  legend?: string;
  hint?: string;
  layout?: "stack" | "grid";
  /** Optional name for the radio group (forms). */
  name?: string;
};

/**
 * English copy for the three default entry points; swap for i18n in the app.
 */
export const defaultCertificationIntentOptionsEn: CertificationIntentOption[] = [
  {
    id: "regulated-certificate",
    title: "Regulated product certification",
    description: "CE, BENOR, DOP, and related routes through the Procertus product tree.",
    emphasis: "primary",
  },
  {
    id: "atg-attest",
    title: "ATG (attest)",
    description:
      "A non-product attest route when your case is not framed as a standard product type under the product tree.",
    emphasis: "secondary",
  },
  {
    id: "innovation-attest-ssd",
    title: "Innovation attest (SSD)",
    description: "Sustainability / innovation-related attestation (SSD) according to the current portfolio labelling.",
    emphasis: "tertiary",
  },
];

export function CertificationIntentPicker({
  className,
  value,
  onValueChange,
  options,
  legend = "What would you like to do?",
  hint = "Choose a starting point. You can use product-based certification and non-product attest routes without picking product details first.",
  layout = "stack",
  name,
}: CertificationIntentPickerProps) {
  const base = useId();

  return (
    <div className={cn("w-full min-w-0", className)}>
      <SelectChoiceCardGroup
        className="p-0"
        legend={legend}
        hint={hint}
        layout={layout}
        name={name}
        value={value ?? ""}
        onValueChange={(v) => {
          if (CERTIFICATION_INTENT_IDS.includes(v as CertificationIntentId)) {
            onValueChange(v as CertificationIntentId);
          }
        }}
      >
        {options.map((opt) => (
          <SelectChoiceCard
            key={opt.id}
            value={opt.id}
            controlId={`${base}-${opt.id}`}
            title={opt.title}
            description={opt.description}
            leading={opt.leading}
            emphasis={opt.emphasis}
            disabled={opt.disabled}
          />
        ))}
      </SelectChoiceCardGroup>
    </div>
  );
}
