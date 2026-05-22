/**
 * Redesign-variant van "Maatschappelijke zetel" step (3.7):
 *
 * - Behoudt het hoofdkantoor-formulier (de maatschappelijke zetel zelf).
 * - Voegt direct in deze stap een *multi-instance composer* toe voor extra
 *   zetels/vestigingen — herbruikt het bestaande
 *   {@link OnboardingVestigingenLegalEntityManager}-patroon.
 * - Voegt direct hier het product → zetel mappings-blok in, zodat de aparte
 *   stap "Certificatie (entiteit)" kan vervallen (zie 3.8).
 * - Copy-density: één korte sectiekop per blok, geen dubbele helpers.
 *
 * Niet gebruikt in productie — leeft alleen in redesign-stories.
 */
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@procertus-ui/ui";

import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { COUNTRY_SELECT_NONE } from "../../../onboarding/onboarding-constants";
import {
  certificationLegalEntityAssignmentRaw,
  firmaAddressSubformValue,
  formatVestigingRegistryOptionLabel,
  legalEntityAssignmentDisplayParts,
} from "../../../onboarding/onboarding-flow-helpers";
import type { OnboardingRequestOrigin } from "../../../onboarding/onboarding-request-origin";
import { ONBOARDING_REQUEST_ORIGIN_IDS } from "../../../onboarding/onboarding-request-origin";
import { RequestOriginFlag } from "../../../onboarding/onboarding-request-origin-flag";
import {
  VAT_LOOKUP_OUTCOME_LABELS,
  VAT_PROTOTYPE_PRESETS,
  registrationIsoCodeFromDutchCountryLabel,
  type VatLookupMockOutcome,
} from "../../../onboarding/lib/vatPrototypePresets";
import { IdentificatieAddressSubform } from "../../../onboarding/identificatie-subforms";
import {
  OnboardingCompanyPrefillSkeleton,
  OnboardingContextField,
} from "../shared/onboarding-shared-fields";
import { OnboardingVestigingenLegalEntityManager } from "../legal-entity-step/OnboardingVestigingenLegalEntityManager";
import { DraftCardDescription } from "../../../certification-request/draft-selection-presentation";
import { OnboardingInquiryLegalEntityLinkCard } from "../shared/OnboardingInquiryLegalEntityLinkCard";

export type OnboardingCompanyZetelStepRedesignProps = {
  model: OnboardingRegistrationLayoutModel;
};

export function OnboardingCompanyZetelStepRedesign({
  model,
}: OnboardingCompanyZetelStepRedesignProps) {
  const {
    context,
    updateContext,
    patchContext,
    drafts,
    draftsInRegistrationScope,
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
    legalEntityFieldBase,
    CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
    CERT_INQUIRY_VEST_UNASSIGNED,
  } = model;

  const activePreset =
    activeVatPreset ??
    (prototypeVatPresetId
      ? VAT_PROTOTYPE_PRESETS.find((p) => p.id === prototypeVatPresetId)
      : undefined);

  const certificationMap = context.certificationInquiryVestigingId;

  function certDraftSelectRadix(draftId: string): string {
    const raw = (certificationMap[draftId] ?? "").trim();
    return raw === "" ? CERT_INQUIRY_VEST_UNASSIGNED : raw;
  }

  function setCertDraftAssignment(draftId: string, value: string): void {
    const next = value.trim()
      ? { ...certificationMap, [draftId]: value }
      : (() => {
          const clone = { ...certificationMap };
          delete clone[draftId];
          return clone;
        })();
    patchContext({ certificationInquiryVestigingId: next });
  }

  const overviewRows = draftsInRegistrationScope;

  return (
    <div className="space-y-8">
      {/* Compact source-context strip — unchanged across original/redesign */}
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
              <span className="tabular-nums text-muted-foreground">
                {Math.round(lookupProgress)}%
              </span>
            </div>
            <Progress value={lookupProgress} className="h-2" aria-label="Voortgang opzoeken" />
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

          {/* Primary head office */}
          <section className="space-y-4" aria-labelledby="zetel-primary-heading">
            <div className="space-y-1">
              <H4
                id="zetel-primary-heading"
                className="normal-case tracking-tight text-foreground"
              >
                Maatschappelijke zetel
              </H4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Officiële gegevens gekoppeld aan uw btw-nummer.
              </p>
            </div>
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
                <FieldLabel htmlFor="firmaPhone-redesign">Telefoon firma</FieldLabel>
                <FieldContent>
                  <Input
                    id="firmaPhone-redesign"
                    type="tel"
                    value={context.firmaPhone}
                    onChange={(e) => updateContext("firmaPhone", e.target.value)}
                    placeholder="Hoofdnummer"
                  />
                </FieldContent>
              </Field>
            </div>
            <IdentificatieAddressSubform
              idPrefix="firma-address-redesign"
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

          {/* Extra zetels — multi-instance composer */}
          <section className="space-y-4" aria-labelledby="zetel-extra-heading">
            <div className="space-y-1">
              <H4
                id="zetel-extra-heading"
                className="normal-case tracking-tight text-foreground"
              >
                Extra zetels (optioneel)
              </H4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Voeg vestigingen of bijkomende juridische entiteiten toe die u nodig heeft voor
                deze certificatie-aanvragen.
              </p>
            </div>
            <OnboardingVestigingenLegalEntityManager
              fieldBaseId={`${legalEntityFieldBase}-redesign-zetel`}
              context={context}
              patchContext={patchContext}
              countrySelectOptions={countrySelectOptions}
              vestigingBlockAssignmentMaps={[context.certificationInquiryVestigingId]}
            />
          </section>

          {/* Product → zetel mapping (replaces stap 3.8) */}
          {overviewRows.length > 0 ? (
            <section className="space-y-4" aria-labelledby="zetel-mapping-heading">
              <div className="space-y-1">
                <H4
                  id="zetel-mapping-heading"
                  className="normal-case tracking-tight text-foreground"
                >
                  Koppeling certificatie → zetel
                </H4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Kies per certificatie-aanvraag welke zetel of vestiging optreedt als rechtspersoon.
                </p>
              </div>
              <ul className="space-y-2">
                {overviewRows.map((draft) => {
                  const certRaw = certificationLegalEntityAssignmentRaw(
                    context,
                    draft.id,
                    draft,
                  );
                  const parts = legalEntityAssignmentDisplayParts(context, certRaw);
                  const fallbackLabel = parts.primary;
                  return (
                    <OnboardingInquiryLegalEntityLinkCard
                      key={draft.id}
                      leftColumnLabel="Certificatie / product"
                      rightColumnLabel="Rechtspersoon"
                      left={
                        <>
                          <p className="text-sm font-medium text-foreground">
                            {draft.shortLabel || draft.label}
                          </p>
                          <div className="mt-1 text-xs text-muted-foreground [&_.font-medium]:text-foreground">
                            <DraftCardDescription draft={draft} />
                          </div>
                        </>
                      }
                      right={
                        <Select
                          value={certDraftSelectRadix(draft.id)}
                          onValueChange={(v) => {
                            if (v === CERT_INQUIRY_VEST_UNASSIGNED) {
                              setCertDraftAssignment(draft.id, "");
                            } else {
                              setCertDraftAssignment(draft.id, v);
                            }
                          }}
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-auto min-h-9 w-full max-w-lg py-2"
                          >
                            <SelectValue placeholder={fallbackLabel || "Kies rechtspersoon"} />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value={CERT_INQUIRY_VEST_UNASSIGNED}>
                              — Nog niet gekozen —
                            </SelectItem>
                            <SelectItem value={CERT_INQUIRY_LEGAL_ENTITY_ZETEL}>
                              Maatschappelijke zetel
                            </SelectItem>
                            {context.onboardingVestigingen.map((ve) => (
                              <SelectItem key={ve.id} value={ve.id}>
                                {formatVestigingRegistryOptionLabel(ve)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      }
                    />
                  );
                })}
              </ul>
              <p className="text-xs text-muted-foreground">
                Niet gekozen? Dan gebruiken we standaard de maatschappelijke zetel.
              </p>
            </section>
          ) : null}

          {/* Suppress unused warnings for fields we read but don't render directly */}
          <span hidden>{drafts.length}</span>
        </>
      ) : null}
    </div>
  );
}
