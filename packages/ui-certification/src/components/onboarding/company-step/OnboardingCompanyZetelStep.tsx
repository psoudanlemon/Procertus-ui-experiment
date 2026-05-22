import {
  Alert01Icon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert,
  AlertTitle,
  Button,
  Field,
  FieldContent,
  FieldLabel,
  Input,
  Progress,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@procertus-ui/ui";

import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { COUNTRY_SELECT_NONE } from "../../../onboarding/onboarding-constants";
import { firmaAddressSubformValue } from "../../../onboarding/onboarding-flow-helpers";
import {
  VAT_PROTOTYPE_PRESETS,
  registrationIsoCodeFromDutchCountryLabel,
} from "../../../onboarding/lib/vatPrototypePresets";
import { IdentificatieAddressSubform } from "../../../onboarding/identificatie-subforms";
import { OnboardingContextField } from "../shared/onboarding-shared-fields";

export type OnboardingCompanyZetelStepProps = {
  model: OnboardingRegistrationLayoutModel;
  /** Triggered when the user confirms the registration number to start the lookup. */
  onStartLookup?: () => void;
};

export function OnboardingCompanyZetelStep({
  model,
  onStartLookup,
}: OnboardingCompanyZetelStepProps) {
  const {
    context,
    updateContext,
    patchContext,
    companyLookupPhase,
    lookupProgress,
    lookupStepIndex,
    vatLookupStepLabels,
    activeVatPreset,
    prototypeVatPresetId,
    countrySelectOptions,
    countrySelectValue,
    companyHints,
    firmaCountryLocked,
    registrationIdFieldMeta,
    registrationIdentifierIssue,
    registrationIdentifierStructurallyValid,
  } = model;

  const activePreset =
    activeVatPreset ??
    (prototypeVatPresetId
      ? VAT_PROTOTYPE_PRESETS.find((p) => p.id === prototypeVatPresetId)
      : undefined);

  return (
    <div className="space-y-section">
      <section className="space-y-4">
        <Field data-invalid={registrationIdentifierIssue ? true : undefined}>
          <FieldLabel
            htmlFor="zetel-registration-identifier"
            className="inline-flex items-center gap-1.5"
          >
            <span>{registrationIdFieldMeta.label}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Meer informatie over dit veld"
                    className="inline-flex shrink-0 cursor-help text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      className="size-4"
                      aria-hidden
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {registrationIdFieldMeta.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FieldLabel>
          <FieldContent>
            <div className="flex items-start gap-2">
              <div className="w-full max-w-80 min-w-0">
                <Input
                  id="zetel-registration-identifier"
                  className="min-w-0"
                  value={context.vatNumber}
                  placeholder={registrationIdFieldMeta.placeholder}
                  onChange={(event) => updateContext("vatNumber", event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  state={
                    registrationIdentifierIssue != null
                      ? "invalid"
                      : registrationIdentifierStructurallyValid
                        ? "valid"
                        : undefined
                  }
                />
              </div>
              {onStartLookup ? (
                <Button
                  type="button"
                  onClick={onStartLookup}
                  disabled={
                    companyLookupPhase === "loading" ||
                    !registrationIdentifierStructurallyValid
                  }
                  aria-busy={companyLookupPhase === "loading"}
                >
                  {companyLookupPhase === "loading" ? (
                    <>
                      <Spinner size="sm" />
                      <span>Zoeken…</span>
                    </>
                  ) : (
                    "Zoeken"
                  )}
                </Button>
              ) : null}
            </div>
            {registrationIdentifierIssue ? (
              <p
                className="text-left text-sm font-medium text-destructive-foreground"
                role="alert"
              >
                {registrationIdentifierIssue}
              </p>
            ) : null}
          </FieldContent>
        </Field>
      </section>

      {companyLookupPhase !== "ready" ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-foreground">
                {companyLookupPhase === "loading" ? "Bezig met opzoeken" : "Wachten op btw-nummer"}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {companyLookupPhase === "loading" ? Math.round(lookupProgress) : 0}%
              </span>
            </div>
            <Progress
              value={companyLookupPhase === "loading" ? lookupProgress : 0}
              className="h-2"
              aria-label="Voortgang opzoeken"
            />
          </div>
          <ul className="space-y-2.5" aria-live="polite">
            {vatLookupStepLabels.map((item, index) => {
              const done = lookupStepIndex > index;
              const active = lookupStepIndex === index;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 text-sm transition-colors",
                    done || active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      done
                        ? "bg-primary"
                        : active
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground/30",
                    )}
                    aria-hidden
                  />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {companyLookupPhase === "ready" && activePreset ? (
        activePreset.mock.outcome === "manual" ? (
          <Alert variant="destructive">
            <HugeiconsIcon icon={Alert01Icon} aria-hidden className="size-4 shrink-0" />
            <AlertTitle>
              Geen gegevens gevonden, vul de velden handmatig in of probeer opnieuw.
            </AlertTitle>
          </Alert>
        ) : (
          <Alert variant="success">
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              aria-hidden
              className="size-4 shrink-0"
            />
            <AlertTitle>Gegevens gevonden, controleer of alle gegevens actueel zijn.</AlertTitle>
          </Alert>
        )
      ) : null}

      {companyLookupPhase === "ready" && activePreset ? (
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <OnboardingContextField
              id="organizationName"
              label="Juridische naam (zetel)"
              value={context.organizationName}
              onChange={updateContext}
              placeholder="Officiële bedrijfsnaam"
              description={companyHints.organizationName}
            />
            <Field>
              <FieldLabel htmlFor="firmaPhone">Telefoon firma</FieldLabel>
              <FieldContent>
                <Input
                  id="firmaPhone"
                  type="tel"
                  value={context.firmaPhone}
                  onChange={(e) => updateContext("firmaPhone", e.target.value)}
                  placeholder="Hoofdnummer"
                />
              </FieldContent>
            </Field>
          </div>
          <IdentificatieAddressSubform
            idPrefix="firma-address"
            value={firmaAddressSubformValue(context)}
            onChange={(v) => {
              const iso = registrationIsoCodeFromDutchCountryLabel(v.country.trim()) || "";
              patchContext({
                addressStreet: v.street,
                addressHouseNumber: v.houseNumber,
                addressPostalCode: v.postalCode,
                addressCity: v.locality,
                country: v.country,
                addressCountryCode: iso,
              });
            }}
            countryOptions={countrySelectOptions}
            countrySelectValue={countrySelectValue}
            onCountryChange={(v) =>
              updateContext("country", v === COUNTRY_SELECT_NONE ? "" : v)
            }
            countrySelectMode={firmaCountryLocked ? "locked" : "editable"}
            showCountryCodeField={false}
            fieldHints={{
              street: companyHints.addressStreet,
              country: companyHints.country,
            }}
          />
        </section>
      ) : null}
    </div>
  );
}
