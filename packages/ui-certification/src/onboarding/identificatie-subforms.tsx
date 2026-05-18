import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  cn,
} from "@procertus-ui/ui";
import {
  coercePersonPreferredLanguage,
  personSubformEmailStructuralIssue,
  type IdentificatiePersonSubformValue,
} from "@procertus-ui/domain-certification";
import type { ReactNode } from "react";
import { COUNTRY_SELECT_NONE } from "./onboarding-constants";
import {
  ONBOARDING_PERSON_LANGUAGE_OPTIONS,
  onboardingPersonLanguageLabel,
} from "./lib/onboardingPersonLanguage";

/** Required field marker: muted until the field is invalid / incomplete (then accent). */
export function RequiredFieldSuffix({ erroneous }: { erroneous: boolean }) {
  return (
    <span
      aria-hidden
      className={erroneous ? "text-destructive-foreground" : "text-muted-foreground"}
    >
      *
    </span>
  );
}

export type IdentificatieAddressSubformValue = {
  street: string;
  houseNumber: string;
  postalCode: string;
  locality: string;
  country: string;
  countryCode: string;
};

/**
 * Reusable person and address field groups for onboarding forms.
 */
export function IdentificatieOptionalBlock({
  switchId,
  title,
  description,
  checked,
  onCheckedChange,
  /** Renders before the switch on the top-right (e.g. person registry select). */
  headerTrailing,
  children,
  /** When true, the switch is off and the block cannot be turned on (e.g. unmet prerequisites). */
  disabled = false,
  /** Explains why the block is disabled; shown when {@link disabled} is true. */
  disabledHint,
}: {
  switchId: string;
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  headerTrailing?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  disabledHint?: string;
}) {
  return (
    <section
      className="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
      aria-labelledby={`${switchId}-label`}
      aria-disabled={disabled ? true : undefined}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p id={`${switchId}-label`} className="text-sm leading-snug font-medium text-foreground">
            {title}
          </p>
          {description ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
          {disabled && disabledHint ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{disabledHint}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-start justify-end gap-2 sm:pt-0.5">
          {headerTrailing}
          <span className="text-xs text-muted-foreground sm:sr-only">
            {disabled ? "Niet beschikbaar" : checked ? "Ingeschakeld" : "Uit"}
          </span>
          <Switch
            id={switchId}
            checked={checked}
            disabled={disabled}
            onCheckedChange={(v) => {
              if (disabled) return;
              onCheckedChange(v === true);
            }}
            aria-labelledby={`${switchId}-label`}
          />
        </div>
      </div>
      {checked && !disabled ? <div className="mt-4 space-y-4">{children}</div> : null}
    </section>
  );
}

export function IdentificatiePersonSubform({
  idPrefix,
  value,
  onChange,
  description,
  requireEmail = true,
  titleDisabled = false,
  startExtra,
  contactRowExtra,
  disabled = false,
  emphasizeInvalidRequiredMarkers = false,
}: {
  idPrefix: string;
  value: IdentificatiePersonSubformValue;
  onChange: (next: IdentificatiePersonSubformValue) => void;
  description?: string;
  requireEmail?: boolean;
  /**
   * When true, aanhef/title comes from a separate control (e.g. preset “Aanhef”); omit the
   * title row here so it is not repeated as a read-only field.
   */
  titleDisabled?: boolean;
  /** Renders before voornaam (e.g. aanhef select) in the same grid row on md+. */
  startExtra?: ReactNode;
  /** Renders after naamrij; on md+ same row as taal, telefoon en e-mail (e.g. rol vóór taal). */
  contactRowExtra?: ReactNode;
  /** When true, all inputs in this subform are non-interactive. */
  disabled?: boolean;
  /**
   * When true, required markers use the error accent for fields that are empty or structurally
   * invalid (e.g. bad e-mail) while this slice is still incomplete relative to onboarding rules.
   */
  emphasizeInvalidRequiredMarkers?: boolean;
}) {
  const patch = (partial: Partial<IdentificatiePersonSubformValue>) =>
    onChange({ ...value, ...partial });

  const emphasize = emphasizeInvalidRequiredMarkers;

  const baseMdColCount = startExtra ? (titleDisabled ? 3 : 4) : titleDisabled ? 2 : 3;
  const narrowNameRowWithContactExtra = Boolean(contactRowExtra) && baseMdColCount === 2;
  const mdColCount = narrowNameRowWithContactExtra ? 3 : baseMdColCount;
  const hasNarrowLeadingColumn = Boolean(startExtra);
  /** Role row is rol · taal · telefoon · e-mail; expand to four columns and let achternaam span two. */
  const secondRowNeedsFourCols =
    Boolean(contactRowExtra) && Boolean(hasNarrowLeadingColumn) && mdColCount === 3;
  const lastNameMdSpanTwo =
    narrowNameRowWithContactExtra ||
    (Boolean(contactRowExtra) && Boolean(hasNarrowLeadingColumn) && mdColCount === 3);
  const gridColsClass = (() => {
    if (secondRowNeedsFourCols) {
      return "md:grid-cols-[0.62fr_1fr_1fr_1fr]";
    }
    if (hasNarrowLeadingColumn && mdColCount === 4) {
      return "md:grid-cols-[0.62fr_1fr_1fr_1fr]";
    }
    if (hasNarrowLeadingColumn && mdColCount === 3) {
      return "md:grid-cols-[0.62fr_1fr_1fr]";
    }
    if (mdColCount === 4) {
      return "md:grid-cols-4";
    }
    if (mdColCount === 3) {
      return "md:grid-cols-3";
    }
    return "md:grid-cols-2";
  })();
  const emailSpanClass = contactRowExtra
    ? "md:col-span-1"
    : mdColCount === 4
      ? "md:col-span-2"
      : mdColCount === 3
        ? "md:col-span-3"
        : "md:col-span-1";
  const descriptionSpanClass =
    mdColCount === 4 ? "md:col-span-4" : mdColCount === 3 ? "md:col-span-3" : "md:col-span-2";

  const emailStructuralError = personSubformEmailStructuralIssue(value.email);
  const languageSelectValue = coercePersonPreferredLanguage(value.language);
  const emailStructuralErrorId = `${idPrefix}-email-structural-error`;
  const emailDescribedBy = emailStructuralError != null ? emailStructuralErrorId : undefined;

  const fn = value.firstName?.trim() ?? "";
  const ln = value.lastName?.trim() ?? "";
  const titleTrim = value.title?.trim() ?? "";
  const emailTrim = value.email?.trim() ?? "";
  const requireEmailEffective = requireEmail !== false;

  const firstNameErroneousMarker = emphasize && !fn.length;
  const lastNameErroneousMarker = emphasize && !ln.length;
  const titleErroneousMarker = !titleDisabled && emphasize && !titleTrim.length;
  const languageErroneousMarker = emphasize && !(value.language ?? "").trim();
  const emailErroneousMarker =
    emailStructuralError != null || (emphasize && requireEmailEffective && emailTrim.length === 0);

  return (
    <div className={cn("grid gap-4", gridColsClass)}>
      {startExtra}
      <Field className="md:col-span-1">
        <FieldLabel htmlFor={`${idPrefix}-firstName`}>
          Voornaam <RequiredFieldSuffix erroneous={firstNameErroneousMarker} />
        </FieldLabel>
        <FieldContent>
          <Input
            id={`${idPrefix}-firstName`}
            value={value.firstName}
            disabled={disabled}
            onChange={(e) => patch({ firstName: e.target.value })}
            autoComplete="given-name"
          />
        </FieldContent>
      </Field>
      <Field className={cn("md:col-span-1", lastNameMdSpanTwo && "md:col-span-2")}>
        <FieldLabel htmlFor={`${idPrefix}-lastName`}>
          Achternaam <RequiredFieldSuffix erroneous={lastNameErroneousMarker} />
        </FieldLabel>
        <FieldContent>
          <Input
            id={`${idPrefix}-lastName`}
            value={value.lastName}
            disabled={disabled}
            onChange={(e) => patch({ lastName: e.target.value })}
            autoComplete="family-name"
          />
        </FieldContent>
      </Field>
      {titleDisabled ? null : (
        <Field className="md:col-span-1">
          <FieldLabel htmlFor={`${idPrefix}-title`}>
            Titel <RequiredFieldSuffix erroneous={titleErroneousMarker} />
          </FieldLabel>
          <FieldContent>
            <Input
              id={`${idPrefix}-title`}
              value={value.title}
              disabled={disabled}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Bv. Zaakvoerder, hoofd financiën"
            />
          </FieldContent>
        </Field>
      )}
      {contactRowExtra}
      <Field className="min-w-0 md:col-span-1">
        <FieldLabel htmlFor={`${idPrefix}-language`}>
          Taal correspondentie <RequiredFieldSuffix erroneous={languageErroneousMarker} />
        </FieldLabel>
        <FieldContent>
          <Select
            disabled={disabled}
            value={languageSelectValue}
            onValueChange={(code) => patch({ language: coercePersonPreferredLanguage(code) })}
          >
            <SelectTrigger id={`${idPrefix}-language`} className="h-8 w-full min-w-0" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ONBOARDING_PERSON_LANGUAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.code} value={opt.code}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
      <Field className="md:col-span-1">
        <FieldLabel htmlFor={`${idPrefix}-telephone`}>Telefoon / GSM</FieldLabel>
        <FieldContent>
          <Input
            id={`${idPrefix}-telephone`}
            type="tel"
            value={value.telephone}
            disabled={disabled}
            onChange={(e) => patch({ telephone: e.target.value })}
            autoComplete="tel"
          />
        </FieldContent>
      </Field>
      <Field className={emailSpanClass} data-invalid={emailStructuralError ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-email`}>
          E-mail{" "}
          {requireEmailEffective ? <RequiredFieldSuffix erroneous={emailErroneousMarker} /> : null}
        </FieldLabel>
        <FieldContent>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            value={value.email}
            disabled={disabled}
            onChange={(e) => patch({ email: e.target.value })}
            autoComplete="email"
            aria-invalid={emailStructuralError != null}
            aria-describedby={emailDescribedBy}
          />
          {emailStructuralError ? (
            <p
              id={emailStructuralErrorId}
              className="text-left text-sm font-medium text-destructive"
              role="alert"
            >
              {emailStructuralError}
            </p>
          ) : null}
        </FieldContent>
      </Field>
      {description ? (
        <p className={cn("text-xs text-muted-foreground", descriptionSpanClass)}>{description}</p>
      ) : null}
    </div>
  );
}

export function IdentificatieAddressSubform({
  idPrefix,
  value,
  onChange,
  countryOptions,
  countrySelectValue,
  onCountryChange,
  fieldHints,
  countrySelectMode = "editable",
  countryLockedAdornment,
  showCountryCodeField = false,
}: {
  idPrefix: string;
  value: IdentificatieAddressSubformValue;
  onChange: (next: IdentificatieAddressSubformValue) => void;
  countryOptions: readonly string[];
  countrySelectValue: string;
  onCountryChange: (country: string) => void;
  fieldHints?: Partial<Record<"street" | "locality" | "country", string>>;
  /** When `locked`, country is read-only (e.g. vast aan BE/NL/US in stap 1). */
  countrySelectMode?: "editable" | "locked";
  /** Shown before the country label when locked (e.g. origin flag). */
  countryLockedAdornment?: ReactNode;
  /** ISO landcode is afgeleid; standaard verborgen in onboarding. */
  showCountryCodeField?: boolean;
}) {
  const patch = (partial: Partial<IdentificatieAddressSubformValue>) =>
    onChange({ ...value, ...partial });

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-street`}>Straat</FieldLabel>
        <FieldContent>
          <Input
            id={`${idPrefix}-street`}
            value={value.street}
            onChange={(e) => patch({ street: e.target.value })}
            placeholder="Straatnaam"
          />
          {fieldHints?.street ? <FieldDescription>{fieldHints.street}</FieldDescription> : null}
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-house`}>Huisnummer</FieldLabel>
        <FieldContent>
          <Input
            id={`${idPrefix}-house`}
            value={value.houseNumber}
            onChange={(e) => patch({ houseNumber: e.target.value })}
            placeholder="Bv. 12 of 12B"
          />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-postal`}>Postcode</FieldLabel>
        <FieldContent>
          <Input
            id={`${idPrefix}-postal`}
            value={value.postalCode}
            onChange={(e) => patch({ postalCode: e.target.value })}
          />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-locality`}>Plaats</FieldLabel>
        <FieldContent>
          <Input
            id={`${idPrefix}-locality`}
            value={value.locality}
            onChange={(e) => patch({ locality: e.target.value })}
            placeholder="Gemeente of stad"
          />
          {fieldHints?.locality ? <FieldDescription>{fieldHints.locality}</FieldDescription> : null}
        </FieldContent>
      </Field>
      <Field className="sm:col-span-2">
        <FieldLabel
          htmlFor={
            countrySelectMode === "locked" ? `${idPrefix}-country-readonly` : `${idPrefix}-country`
          }
        >
          Land
        </FieldLabel>
        <FieldContent>
          {countrySelectMode === "locked" ? (
            <div
              id={`${idPrefix}-country-readonly`}
              role="group"
              aria-label="Land"
              className="flex min-h-9 items-center gap-2 rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-foreground"
            >
              {countryLockedAdornment ? (
                <span className="flex shrink-0 items-center">{countryLockedAdornment}</span>
              ) : null}
              <span className="min-w-0 break-words">{value.country.trim() || "—"}</span>
            </div>
          ) : (
            <Select value={countrySelectValue} onValueChange={onCountryChange}>
              <SelectTrigger id={`${idPrefix}-country`} className="w-full">
                <SelectValue placeholder="Kies een land" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={COUNTRY_SELECT_NONE}>Kies een land</SelectItem>
                {countryOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {fieldHints?.country ? <FieldDescription>{fieldHints.country}</FieldDescription> : null}
        </FieldContent>
      </Field>
      {showCountryCodeField ? (
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor={`${idPrefix}-cc`}>Landcode (optioneel)</FieldLabel>
          <FieldContent>
            <Input
              id={`${idPrefix}-cc`}
              value={value.countryCode}
              onChange={(e) => patch({ countryCode: e.target.value.toUpperCase().slice(0, 2) })}
              placeholder="Bv. BE"
              maxLength={2}
              className="max-w-[8rem] font-mono uppercase"
            />
            <FieldDescription>
              Twee letters, bv. BE. Alleen invullen als u de code kent.
            </FieldDescription>
          </FieldContent>
        </Field>
      ) : null}
    </div>
  );
}

/** Read-only identity line for a person chosen from the onboarding registry (role assigned separately). */
export function IdentificatiePersonRegistrySummary({
  person,
  className,
}: {
  person: IdentificatiePersonSubformValue;
  className?: string;
}) {
  const honorific = person.title?.trim() ?? "";
  const first = person.firstName?.trim() ?? "";
  const last = person.lastName?.trim() ?? "";
  const nameCore = [first, last].filter(Boolean).join(" ");
  const displayName = [honorific, nameCore].filter(Boolean).join(" ").trim() || "—";
  const email = person.email?.trim() || "—";
  const tel = person.telephone?.trim();
  const lang = onboardingPersonLanguageLabel(coercePersonPreferredLanguage(person.language));

  return (
    <div className={cn("text-sm", className)}>
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        <div className="min-w-0 sm:col-span-2">
          <dt className="sr-only">Naam</dt>
          <dd className="font-medium text-foreground">{displayName}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">E-mail</dt>
          <dd className="break-all text-foreground">{email}</dd>
        </div>
        {tel ? (
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Telefoon</dt>
            <dd className="text-foreground">{tel}</dd>
          </div>
        ) : null}
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Taal correspondentie</dt>
          <dd className="text-foreground">{lang}</dd>
        </div>
      </dl>
    </div>
  );
}
