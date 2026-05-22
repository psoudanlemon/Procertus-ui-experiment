import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Field,
  FieldContent,
  FieldLabel,
  H4,
  Input,
  Progress,
  cn,
} from "@procertus-ui/ui";
import { PrototypeCard } from "@procertus-ui/ui-pt1-prototype";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { COUNTRY_SELECT_NONE } from "../../../onboarding/onboarding-constants";
import { firmaAddressSubformValue } from "../../../onboarding/onboarding-flow-helpers";
import type { OnboardingRequestOrigin } from "../../../onboarding/onboarding-request-origin";
import {
  ONBOARDING_REQUEST_ORIGIN_IDS,
} from "../../../onboarding/onboarding-request-origin";
import { RequestOriginFlag } from "../../../onboarding/onboarding-request-origin-flag";
import {
  VAT_LOOKUP_OUTCOME_LABELS,
  VAT_PROTOTYPE_PRESETS,
  registrationIsoCodeFromDutchCountryLabel,
  type VatLookupMockOutcome,
} from "../../../onboarding/lib/vatPrototypePresets";
import {
  IdentificatieAddressSubform,
} from "../../../onboarding/identificatie-subforms";
import {
  OnboardingCompanyPrefillSkeleton,
  OnboardingContextField,
} from "../shared/onboarding-shared-fields";

export type OnboardingCompanyZetelStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingCompanyZetelStep({ model }: OnboardingCompanyZetelStepProps) {
  const {
    context,
    updateContext,
    patchContext,
    companyLookupPhase,
    lookupProgress,
    lookupStepIndex,
    vatLookupStepLabels,
    companyPrefillFieldKeys,
    companyFieldsResolvedInSimulation,
    vatNumberForDisplay,
    emailForDisplay,
    activeVatPreset,
    prototypeVatPresetId,
    requestOrigin,
    countrySelectOptions,
    countrySelectValue,
    companyHints,
    companySourceCountryLabel,
    firmaCountryLocked,
  } = model;

  const activePreset =
    activeVatPreset ??
    (prototypeVatPresetId ? VAT_PROTOTYPE_PRESETS.find((p) => p.id === prototypeVatPresetId) : undefined);

  return (
    <>
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Btw-nummer
            </p>
            <p className="mt-1 font-mono text-sm text-foreground">{vatNumberForDisplay || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              E-mail
            </p>
            <p className="mt-1 break-all text-sm text-foreground">{emailForDisplay || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Land
            </p>
            <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-foreground">
              {requestOrigin !== "" &&
              ONBOARDING_REQUEST_ORIGIN_IDS.includes(requestOrigin as OnboardingRequestOrigin) ? (
                <RequestOriginFlag
                  origin={requestOrigin as OnboardingRequestOrigin}
                  compact
                  className="shrink-0"
                />
              ) : null}
              <span className="min-w-0 break-words">{companySourceCountryLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {companyLookupPhase === "loading" ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-foreground">Bezig met opzoeken</span>
              <span className="tabular-nums text-muted-foreground">{Math.round(lookupProgress)}%</span>
            </div>
            <Progress
              value={lookupProgress}
              className="h-2"
              aria-label="Voortgang opzoeken bedrijfsgegevens"
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
          <OnboardingCompanyPrefillSkeleton
            prefilledKeys={companyPrefillFieldKeys}
            resolvedKeys={companyFieldsResolvedInSimulation}
          />
        </div>
      ) : null}

      {companyLookupPhase === "ready" && activePreset ? (
        <>
          <Alert variant="warning">
            <HugeiconsIcon icon={Alert01Icon} aria-hidden className="size-4 shrink-0" />
            <AlertTitle className="flex flex-wrap items-center gap-2">
              <span>{activePreset.outcomeLabel}</span>
              <Badge variant="warning">
                {VAT_LOOKUP_OUTCOME_LABELS[activePreset.mock.outcome as VatLookupMockOutcome]}
              </Badge>
            </AlertTitle>
            <AlertDescription>{activePreset.outcomeMessage}</AlertDescription>
          </Alert>
          {activePreset.demoSupplementsOrgAddressFromEmailDomain ? (
            <PrototypeCard
              title="Aanvulling vanuit uw e-mail"
              description={
                <>
                  Voor dit voorbeeld ontvangen we geen bedrijfsnaam en volledig adres bij alleen uw
                  nummer. Waar mogelijk vullen we ze aan met het e-mailadres dat u opgaf. Controleer
                  alles; bij een algemeen mailboxadres vult u zelf aan.
                </>
              }
              cardContentClassName="hidden"
            >
              {null}
            </PrototypeCard>
          ) : null}
          <div className="space-y-1">
            <H4 className="normal-case tracking-tight text-foreground">
              Maatschappelijke zetel
            </H4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Dit zijn de officiële gegevens van uw hoofdrechtspersoon, zoals die aan uw
              identificatienummer gekoppeld zijn. Ze kunnen afwijkend zijn van waar productie of
              certificatie fysiek plaatsvindt.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <OnboardingContextField
              id="organizationName"
              label="Juridische naam van de onderneming (zetel)"
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
                  placeholder="Hoofdnummer organisatie"
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
            onCountryChange={(v) => updateContext("country", v === COUNTRY_SELECT_NONE ? "" : v)}
            countrySelectMode={firmaCountryLocked ? "locked" : "editable"}
            showCountryCodeField={false}
            fieldHints={{
              street: companyHints.addressStreet,
              country: companyHints.country,
            }}
          />
        </>
      ) : null}
    </>
  );
}
