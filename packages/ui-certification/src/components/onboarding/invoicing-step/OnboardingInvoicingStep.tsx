/** Presentational onboarding step; shared import aggregate (unused bindings possible). */
/* eslint-disable eslint/no-unused-vars -- keep one import block aligned across registration steps */
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  ChoiceCard,
  ChoiceCardGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  CardList,
  cn,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@procertus-ui/ui";
import {
  DraftCardDescription,
  sortDraftsByIntentAndProduct,
} from "../../certification-request-wizard/draft-selection-presentation";
import { PrototypeCard } from "@procertus-ui/ui-pt1-prototype";
import {
  findVatPrototypePreset,
  getRegistrantContextFieldsForPrototypePreset,
  registrationIsoCodeFromDutchCountryLabel,
  VAT_LOOKUP_OUTCOME_LABELS,
  VAT_PROTOTYPE_PRESETS,
  type VatLookupMockOutcome,
} from "../../../onboarding/lib/vatPrototypePresets";
import {
  isRegistrationIdentifierValidForOrigin,
  registrationIdentifierFieldMeta,
  registrationIdentifierStructuralIssue,
} from "../../../onboarding/lib/registration-identifier-for-origin";
import { COUNTRY_SELECT_NONE } from "../../../onboarding/onboarding-constants";
import {
  canEnableCertificationSecondaryContact,
  certificationSecondaryContactDisabledHint,
  customerContextAfterPrototypePresetChange,
  emptyIdentificatiePersonState,
  emptyOnboardingVestiging,
  firmaAddressSubformValue,
  formatVestigingRegistryOptionLabel,
  formatPostalAddressDisplay,
  invoicingAddressSubformValue,
  isLegalRepresentativeCaptureComplete,
  isOnboardingVestigingCaptureComplete,
  isRegistrantCaptureValidForContext,
  legalRepresentativePersonValue,
  ONBOARDING_PERSON_NEW_ID,
  vestigingAddressSubformValue,
  newOnboardingVestigingId,
  resolveFlowContext,
  summaryDisplayNameForRegisteredPerson,
  summaryRolesForRegisteredPerson,
} from "../../../onboarding/onboarding-flow-helpers";
import type { OnboardingRequestOrigin } from "../../../onboarding/onboarding-request-origin";
import {
  ONBOARDING_REQUEST_ORIGIN_IDS,
  companyRegistrationSourceCountryLabel,
  isFirmaCountryLockedToRequestOrigin,
  ONBOARDING_REQUEST_ORIGIN_HERO_OPTIONS,
  ONBOARDING_REQUEST_ORIGIN_SECONDARY_OPTIONS,
} from "../../../onboarding/onboarding-request-origin";
import { RequestOriginFlag } from "../../../onboarding/onboarding-request-origin-flag";
import { SubformCompletionBadge } from "../../../onboarding/subform-completion-badge";
import {
  IdentificatieAddressSubform,
  IdentificatieOptionalBlock,
  IdentificatiePersonRegistrySummary,
  IdentificatiePersonSubform,
} from "../../../onboarding/identificatie-subforms";
import { IdentificatiePersonTitleRoleCapture } from "../../../onboarding/identificatie-person-title-role-capture";
import { IdentificatiePersonRegistryPicker } from "../../../onboarding/identificatie-person-registry-picker";
import {
  OnboardingCompanyPrefillSkeleton,
  OnboardingContextField,
} from "../shared/onboarding-shared-fields";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { personFormCardClassName } from "../../../onboarding/person-form-card-variants";


export type OnboardingInvoicingStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingInvoicingStep({ model }: OnboardingInvoicingStepProps) {
  const {
    step,
        certificationPhaseTitle,
        certificationPhaseDescription,
        registrationPhaseTitle,
        registrationPhaseDescription,
        onSignInClick,
        certificationWizardProps,
        registrationSubmitOpen,
        onRegistrationSubmitOpenChange,
        registrationProgress,
        registrationStepIndex,
        registrationSimulationLabels,
        context,
        updateContext,
        patchContext,
        setFlowState,
        drafts,
        effectiveSummaryIncludedDraftIds,
        rows,
        steps,
        activeStep,
        goToOnboardingStep,
        primaryAction,
        backAction,
        cancelAction,
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
        vatPrototypePresetChoices,
        requestOrigin,
        setRequestOrigin,
        countrySelectOptions,
        countrySelectValue,
        companyHints,
        summaryKlantenportaalByPersonId,
        originFieldBase,
        applicantLegalRepFieldBase,
        applicantLegalRepPersonFieldsLocked,
        invoicingFieldBase,
        legalEntityFieldBase,
        draftsSortedForCertification,
        invoicingCountryOptions,
        invoicingCountrySelectValue,
        invoicingVestigingSelectRadixValue,
        selectedInvoicingVestiging,
        registrationIdOrigin,
        registrationIdFieldMeta,
        registrationIdentifierIssue,
        registrationIdentifierStructurallyValid,
        invoicingEmailIssue,
        canAddCertificationSecondary,
        fullPackageEntityRecords,
        summaryRequesterLabel,
        summaryRequesterEmailLabel,
        summaryOrganizationLabel,
        summarySectionTitle,
        summaryRc,
        firmaCountryLocked,
        companySourceCountryLabel,
        CERT_INVOICE_VEST_UNASSIGNED,
        CERT_INVOICE_VEST_NEW,
        CERT_INQUIRY_VEST_UNASSIGNED,
  } = model;

  return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Factuuradres en rechtspersoon op de factuur
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            De maatschappelijke zetel uit de bedrijfsstap is uw standaard voor de gegevens op
            de factuur. Gebruik waar nodig de afsluitbare blokken hieronder voor een andere vestiging
            als naam/adres op de factuur (zelfde lijst als bij certificatie), een ander
            postfactuuradres en/of een andere contactpersoon dan de wettelijke vertegenwoordiger.
          </p>
        </div>
    
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Maatschappelijke zetel (facturatie)</CardTitle>
            <CardDescription>
              Standaard verschijnen deze naam en dit adres als ontvanger op de factuur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-foreground">
              {context.organizationName.trim() || "—"}
            </p>
            <p className="text-muted-foreground">{formatPostalAddressDisplay(context)}</p>
            {context.country.trim() ? (
              <p className="text-muted-foreground">{context.country.trim()}</p>
            ) : null}
          </CardContent>
        </Card>
    
        <IdentificatieOptionalBlock
          switchId={`${invoicingFieldBase}-inv-legal-entity`}
          title="Andere onderneming op de factuur (vestiging)"
          description="Schakel dit in wanneer de factuur op naam en adres van een vestiging moet staan in plaats van de maatschappelijke zetel (zonder apart btw-nummer). Nieuw toegevoegde vestigingen vindt u ook op de stap Bedrijfsgegevens."
          checked={context.invoicingDiffersFromHeadOffice}
          onCheckedChange={(on) =>
            patchContext({
              invoicingDiffersFromHeadOffice: on,
              ...(!on ? { invoicingVestigingId: "" } : {}),
            })
          }
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <Field className="min-w-0 flex-1 basis-72">
                <FieldLabel htmlFor={`${invoicingFieldBase}-invoice-vest-select`}>
                  Vestiging op de factuur
                </FieldLabel>
                <FieldDescription>
                  Zelfde registraties als op de bedrijfsstap; toegevoegde vestigingen zijn
                  daar ook beschikbaar.
                </FieldDescription>
                <FieldContent>
                  <Select
                    value={invoicingVestigingSelectRadixValue}
                    onValueChange={(next) => {
                      if (next === CERT_INVOICE_VEST_NEW) {
                        const nid = newOnboardingVestigingId();
                        patchContext({
                          onboardingVestigingen: [
                            ...context.onboardingVestigingen,
                            emptyOnboardingVestiging(nid),
                          ],
                          invoicingVestigingId: nid,
                        });
                        return;
                      }
                      if (next === CERT_INVOICE_VEST_UNASSIGNED) {
                        patchContext({ invoicingVestigingId: "" });
                        return;
                      }
                      patchContext({ invoicingVestigingId: next });
                    }}
                  >
                    <SelectTrigger
                      id={`${invoicingFieldBase}-invoice-vest-select`}
                      className="w-full"
                    >
                      <SelectValue placeholder="— Maak een keuze —" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CERT_INVOICE_VEST_UNASSIGNED}>
                        — Maak een keuze —
                      </SelectItem>
                      {context.onboardingVestigingen.map((vx) => (
                        <SelectItem key={vx.id} value={vx.id}>
                          {formatVestigingRegistryOptionLabel(vx)}
                        </SelectItem>
                      ))}
                      <SelectItem value={CERT_INVOICE_VEST_NEW}>
                        Nieuwe vestiging registreren…
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={() => {
                  const nid = newOnboardingVestigingId();
                  patchContext({
                    onboardingVestigingen: [
                      ...context.onboardingVestigingen,
                      emptyOnboardingVestiging(nid),
                    ],
                    invoicingVestigingId: nid,
                  });
                }}
              >
                Vestiging toevoegen
              </Button>
            </div>
    
            {selectedInvoicingVestiging ? (
              <section
                className={personFormCardClassName("emphasized")}
                aria-labelledby={`${invoicingFieldBase}-inv-ve-editor-title`}
              >
                <div className="space-y-1 pb-2">
                  <h4
                    id={`${invoicingFieldBase}-inv-ve-editor-title`}
                    className="text-sm font-semibold tracking-tight text-foreground"
                  >
                    Gegevens van de gekozen vestiging
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Wijzigingen gelden overal waar deze vestiging wordt gebruikt (facturatie
                    en certificatie).
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 pb-2">
                  <SubformCompletionBadge
                    complete={isOnboardingVestigingCaptureComplete(selectedInvoicingVestiging)}
                    showIncompletePlaceholder
                  />
                </div>
                <Field>
                  <FieldLabel htmlFor={`${invoicingFieldBase}-inv-ve-name`}>
                    Handels- of juridische naam van de vestiging
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id={`${invoicingFieldBase}-inv-ve-name`}
                      value={selectedInvoicingVestiging.legalName}
                      placeholder="Bv. naam van deze vestigingseenheid"
                      onChange={(e) =>
                        patchContext({
                          onboardingVestigingen: context.onboardingVestigingen.map((x) =>
                            x.id === selectedInvoicingVestiging.id
                              ? { ...x, legalName: e.target.value }
                              : x,
                          ),
                        })
                      }
                    />
                  </FieldContent>
                </Field>
                <IdentificatieAddressSubform
                  idPrefix={`inv-ves-${selectedInvoicingVestiging.id}`}
                  value={vestigingAddressSubformValue(selectedInvoicingVestiging)}
                  onChange={(v) => {
                    const iso =
                      registrationIsoCodeFromDutchCountryLabel(v.country.trim()) || "";
                    patchContext({
                      onboardingVestigingen: context.onboardingVestigingen.map((x) =>
                        x.id === selectedInvoicingVestiging.id
                          ? {
                              ...x,
                              addressStreet: v.street,
                              addressHouseNumber: v.houseNumber,
                              addressPostalCode: v.postalCode,
                              addressCity: v.locality,
                              country: v.country,
                              addressCountryCode: iso,
                            }
                          : x,
                      ),
                    });
                  }}
                  countryOptions={countrySelectOptions}
                  countrySelectValue={
                    selectedInvoicingVestiging.country.trim() &&
                    countrySelectOptions.includes(selectedInvoicingVestiging.country.trim())
                      ? selectedInvoicingVestiging.country.trim()
                      : COUNTRY_SELECT_NONE
                  }
                  onCountryChange={(cv) =>
                    patchContext({
                      onboardingVestigingen: context.onboardingVestigingen.map((x) =>
                        x.id === selectedInvoicingVestiging.id
                          ? { ...x, country: cv === COUNTRY_SELECT_NONE ? "" : cv }
                          : x,
                      ),
                    })
                  }
                  countrySelectMode="editable"
                  showCountryCodeField={false}
                />
              </section>
            ) : (
              <p className="text-sm text-muted-foreground">
                Selecteer hierboven een vestiging of voeg een nieuwe toe.
              </p>
            )}
          </div>
        </IdentificatieOptionalBlock>
    
        <Field data-invalid={invoicingEmailIssue ? true : undefined}>
          <FieldLabel htmlFor={`${invoicingFieldBase}-email`}>
            E-mail voor facturatie <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent className="w-full min-w-0">
            <div className="flex w-full min-w-0 items-center gap-1.5">
              <Input
                id={`${invoicingFieldBase}-email`}
                type="email"
                className="min-w-0 w-full flex-1"
                value={context.invoicingEmail}
                onChange={(e) => updateContext("invoicingEmail", e.target.value)}
                autoComplete="email"
                aria-required
                aria-invalid={invoicingEmailIssue != null}
                aria-describedby={
                  invoicingEmailIssue
                    ? `${invoicingFieldBase}-email-error ${invoicingFieldBase}-email-hint`
                    : `${invoicingFieldBase}-email-hint`
                }
              />
              <SubformCompletionBadge
                complete={invoicingEmailIssue == null}
                title="Facturatie-e-mail ingevuld"
              />
            </div>
            {invoicingEmailIssue ? (
              <p
                id={`${invoicingFieldBase}-email-error`}
                className="text-left text-sm font-medium text-destructive"
                role="alert"
              >
                {invoicingEmailIssue}
              </p>
            ) : null}
            <FieldDescription id={`${invoicingFieldBase}-email-hint`}>
              Dit adres ontvangt facturen en herinneringen.
            </FieldDescription>
          </FieldContent>
        </Field>
    
        <IdentificatieOptionalBlock
          switchId={`${invoicingFieldBase}-inv-alt-address`}
          title="Afwijkend facturatieadres"
          description="Postadres op de factuur dat afwijkt van het adres van de zetel of gekozen vestiging (bijv. postbus of afdeling)."
          checked={context.addInvoicingAddressOverride}
          onCheckedChange={(on) => patchContext({ addInvoicingAddressOverride: on })}
        >
          <IdentificatieAddressSubform
            idPrefix="invoicing-address"
            value={invoicingAddressSubformValue(context)}
            onChange={(v) => {
              const iso =
                registrationIsoCodeFromDutchCountryLabel(v.country.trim()) || "";
              patchContext({
                invoicingAddressStreet: v.street,
                invoicingAddressHouseNumber: v.houseNumber,
                invoicingAddressPostalCode: v.postalCode,
                invoicingAddressCity: v.locality,
                invoicingCountry: v.country,
                invoicingAddressCountryCode: iso,
              });
            }}
            countryOptions={invoicingCountryOptions}
            countrySelectValue={invoicingCountrySelectValue}
            onCountryChange={(cv) =>
              updateContext("invoicingCountry", cv === COUNTRY_SELECT_NONE ? "" : cv)
            }
            showCountryCodeField={false}
          />
        </IdentificatieOptionalBlock>
    
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              Contact voor facturatie
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Standaard is dat de{" "}
              <span className="font-medium text-foreground">
                wettelijke vertegenwoordiger
              </span>
              . Schakel hieronder alleen in wanneer iemand anders uw aanspreekpunt voor
              facturatie en financiële opvolging moet zijn.
            </p>
          </div>
          {!context.invoicingUseContactPerson ? (
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Wettelijke vertegenwoordiger — factuurcontact
              </p>
              <IdentificatiePersonRegistrySummary
                person={legalRepresentativePersonValue(context)}
              />
            </div>
          ) : null}
        </div>
    
        <IdentificatieOptionalBlock
          switchId={`${invoicingFieldBase}-inv-person`}
          title="Andere contactpersoon voor facturatie"
          description="Vul een andere persoon in of kies iemand die u al in deze flow opgegeven heeft."
          checked={context.invoicingUseContactPerson}
          onCheckedChange={(on) =>
            patchContext({
              invoicingUseContactPerson: on,
              ...(!on ? { invoicingContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID } : {}),
            })
          }
          headerTrailing={
            context.invoicingUseContactPerson ? (
              <IdentificatiePersonRegistryPicker
                cardHeader
                id={`${invoicingFieldBase}-inv-registry`}
                label="Persoon kiezen"
                hint="Kies iemand die u al in deze flow opgegeven heeft, of maak een nieuwe persoon aan."
                registeredPersons={context.onboardingRegisteredPersons}
                value={context.invoicingContactPersonRegistryId}
                onValueChange={(rid) => {
                  if (rid === ONBOARDING_PERSON_NEW_ID) {
                    patchContext({
                      invoicingContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                      invoicingContactPerson: emptyIdentificatiePersonState(),
                    });
                    return;
                  }
                  const row = context.onboardingRegisteredPersons.find((p) => p.id === rid);
                  if (!row) {
                    return;
                  }
                  patchContext({
                    invoicingContactPersonRegistryId: rid,
                    invoicingContactPerson: { ...row.person },
                  });
                }}
              />
            ) : null
          }
        >
          {context.invoicingContactPersonRegistryId === ONBOARDING_PERSON_NEW_ID ? (
            <IdentificatiePersonSubform
              idPrefix="invoicing-person"
              value={context.invoicingContactPerson}
              onChange={(v) => patchContext({ invoicingContactPerson: v })}
            />
          ) : (
            <IdentificatiePersonRegistrySummary person={context.invoicingContactPerson} />
          )}
        </IdentificatieOptionalBlock>
      </div>
  );
}
