import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@procertus-ui/ui";
import type { OnboardingRegisteredPerson } from "./anonymous-onboarding-types";
import {
  formatOnboardingPersonRegistryOptionLabel,
  ONBOARDING_PERSON_NEW_ID,
} from "./anonymous-onboarding-flow-helpers";

export function IdentificatiePersonRegistryPicker({
  id,
  label,
  hint,
  registeredPersons,
  value,
  onValueChange,
  /** When true, only the select (no stacked label/hint); for top-right of a card header beside the title. */
  cardHeader = false,
}: {
  id: string;
  label: string;
  hint?: string;
  registeredPersons: OnboardingRegisteredPerson[];
  value: string;
  onValueChange: (registryId: string) => void;
  cardHeader?: boolean;
}) {
  const select = (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        size="sm"
        className={
          cardHeader ? "h-8 w-full min-w-[11rem] max-w-[min(100vw-2rem,18rem)]" : "h-9 w-full"
        }
      >
        <SelectValue placeholder="Kies een persoon" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ONBOARDING_PERSON_NEW_ID}>Nieuwe persoon invoeren</SelectItem>
        {registeredPersons.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {formatOnboardingPersonRegistryOptionLabel(p)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (cardHeader) {
    return (
      <div className="shrink-0 pt-0.5">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        {hint ? <span className="sr-only">{hint}</span> : null}
        {select}
      </div>
    );
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {hint ? <FieldDescription>{hint}</FieldDescription> : null}
      <FieldContent>{select}</FieldContent>
    </Field>
  );
}
