/**
 * First step of the certification request wizard: **clarify intent** — product-oriented
 * certification vs ad hoc attest/document routes without forcing product selection first
 * (Stavaza #4, certification request flow analysis).
 */
import { useId } from "react";
import type { ReactNode } from "react";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@procertus-ui/ui";
import { SelectChoiceCard, SelectChoiceCardGroup } from "@procertus-ui/ui-lib";
import type { SelectChoiceEmphasis } from "@procertus-ui/ui-lib";

/** Aligned with `meta.wizard.entryPoints` in the decision-tree JSON. */
export const CERTIFICATION_INTENT_IDS = [
  "product-certification",
  "atg",
  "innovation-attest",
  "procertus",
  "epd",
  "partijkeuring",
] as const;

export type CertificationIntentId = (typeof CERTIFICATION_INTENT_IDS)[number];

export type CertificationIntentOption = {
  id: CertificationIntentId;
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  /** Match {@link SelectChoiceEmphasis} — use **primary** for the main product path. */
  emphasis: SelectChoiceEmphasis;
  prominence?: "main" | "additional";
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
 * English copy for the default entry points; swap for i18n in the app.
 */
export const defaultCertificationIntentOptionsEn: CertificationIntentOption[] = [
  {
    id: "product-certification",
    title: "Product certification",
    description:
      "Voor een product of producttype waarvoor je een gangbaar certificatiemerk zoals CE, BENOR of SSD wilt aanvragen.",
    emphasis: "primary",
    prominence: "main",
  },
  {
    id: "atg",
    title: "ATG",
    description:
      "Voor een technische goedkeuring of attestering via ATG/BUTG, wanneer je product of oplossing buiten een standaard CE- of BENOR-traject valt.",
    emphasis: "primary",
    prominence: "main",
  },
  {
    id: "innovation-attest",
    title: "Innovation attest",
    description:
      "Voor een innovatief project, werf of toepassing waarvoor je een apart innovatie-attest nodig hebt.",
    emphasis: "primary",
    prominence: "main",
  },
  {
    id: "procertus",
    title: "PROCERTUS attest",
    description:
      "Voor een apart attest dat PROCERTUS zelf uitreikt voor een beperkt aantal specifieke producttypes.",
    emphasis: "tertiary",
    prominence: "additional",
  },
  {
    id: "epd",
    title: "EPD",
    description:
      "Voor een milieuproductverklaring met informatie over de milieu-impact van je product of toepassing.",
    emphasis: "tertiary",
    prominence: "additional",
  },
  {
    id: "partijkeuring",
    title: "Partijkeuring",
    description:
      "Voor een bijkomende keuring van een concrete partij of batch materialen, los van een volledig certificeringstraject.",
    emphasis: "tertiary",
    prominence: "additional",
  },
];

const MAIN_INTENT_IDS = new Set<CertificationIntentId>([
  "product-certification",
  "atg",
  "innovation-attest",
]);

const getOptionProminence = (option: CertificationIntentOption): "main" | "additional" =>
  option.prominence ?? (MAIN_INTENT_IDS.has(option.id) ? "main" : "additional");

function HeroIntentIcon({ selected }: { selected: boolean }) {
  if (selected) {
    return <HugeiconsIcon icon={Tick01Icon} aria-hidden className="size-8" strokeWidth={1.5} />;
  }

  return (
    <span aria-hidden className="block size-8 rounded-full border-2 border-current opacity-70" />
  );
}

export function CertificationIntentPicker({
  className,
  value,
  onValueChange,
  options,
  legend,
  hint,
  layout = "grid",
  name,
}: CertificationIntentPickerProps) {
  const base = useId();
  const mainOptions = options.filter((option) => getOptionProminence(option) === "main");
  const additionalOptions = options.filter(
    (option) => getOptionProminence(option) === "additional",
  );

  return (
    <div className={cn("w-full min-w-0", className)}>
      <SelectChoiceCardGroup
        className="p-0"
        legend={legend}
        hint={hint}
        layout="stack"
        name={name}
        value={value ?? ""}
        onValueChange={(v) => {
          if (CERTIFICATION_INTENT_IDS.includes(v as CertificationIntentId)) {
            onValueChange(v as CertificationIntentId);
          }
        }}
      >
        <div className={cn("grid w-full grid-cols-1 gap-section", layout === "grid" && "md:grid-cols-3")}>
          {mainOptions.map((opt) => {
            const selected = value === opt.id;
            return (
              <SelectChoiceCard
                key={opt.id}
                value={opt.id}
                controlId={`${base}-${opt.id}`}
                title={opt.title}
                description={opt.description}
                leading={opt.leading}
                icon={<HeroIntentIcon selected={selected} />}
                iconSelected={selected}
                emphasis="primary"
                appearance="hero"
                disabled={opt.disabled}
              />
            );
          })}
        </div>
        {additionalOptions.length > 0 ? (
          <div className="mt-region flex w-full flex-col gap-component border-t border-border/60 pt-region">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Other request types
            </p>
            <div className="grid w-full grid-cols-1 gap-component md:grid-cols-3">
              {additionalOptions.map((opt) => (
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
            </div>
          </div>
        ) : null}
      </SelectChoiceCardGroup>
    </div>
  );
}
