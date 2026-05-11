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
} from "../../../certification-request/draft-selection-presentation";
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


export type OnboardingCompanyStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingCompanyStep({ model }: OnboardingCompanyStepProps) {
  const {
    step,
        registrationPhaseTitle,
        registrationPhaseDescription,
        onSignInClick,
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
    <>
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Btw-nummer
              </p>
              <p className="mt-1 font-mono text-sm text-foreground">
                {vatNumberForDisplay || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                E-mail
              </p>
              <p className="mt-1 break-all text-sm text-foreground">
                {emailForDisplay || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Land
              </p>
              <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-foreground">
                {requestOrigin !== "" &&
                ONBOARDING_REQUEST_ORIGIN_IDS.includes(
                  requestOrigin as OnboardingRequestOrigin,
                ) ? (
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
    
        {companyLookupPhase === "ready" && activeVatPreset ? (
          <>
            <Alert variant="warning">
              <HugeiconsIcon icon={Alert01Icon} aria-hidden className="size-4 shrink-0" />
              <AlertTitle className="flex flex-wrap items-center gap-2">
                <span>{activeVatPreset.outcomeLabel}</span>
                <Badge variant="warning">
                  {
                    VAT_LOOKUP_OUTCOME_LABELS[
                      activeVatPreset.mock.outcome as VatLookupMockOutcome
                    ]
                  }
                </Badge>
              </AlertTitle>
              <AlertDescription>{activeVatPreset.outcomeMessage}</AlertDescription>
            </Alert>
            {activeVatPreset.demoSupplementsOrgAddressFromEmailDomain ? (
              <PrototypeCard
                title="Aanvulling vanuit uw e-mail"
                description={
                  <>
                    Voor dit voorbeeld ontvangen we geen bedrijfsnaam en volledig adres bij
                    alleen uw nummer. Waar mogelijk vullen we ze aan met het e-mailadres dat u
                    opgaf. Controleer alles; bij een algemeen mailboxadres vult u zelf aan.
                  </>
                }
                cardContentClassName="hidden"
              >
                {null}
              </PrototypeCard>
            ) : null}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Maatschappelijke zetel
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Dit zijn de officiële gegevens van uw hoofdrechtspersoon, zoals die aan uw
                identificatienummer gekoppeld zijn. Ze kunnen afwijkend zijn van waar productie
                of certificatie fysiek plaatsvindt.
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
            {draftsSortedForCertification.length > 0 ? (
              <div className="space-y-6 border-t border-border pt-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Certificatie en juridische entiteit
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Zoals eerder uw relatie tot de <span className="font-medium text-foreground">wettelijke vertegenwoordiger</span>{" "}
                    werd bevestigd, moet hier duidelijk zijn of de hierboven geregistreerde{" "}
                    <span className="font-medium text-foreground">maatschappelijke zetel</span> juridisch
                    optreedt voor elke gekozen certificatie. Zo niet: u registreert{" "}
                    <span className="font-medium text-foreground">vestigingen</span> — extra
                    rechtseenheden binnen uw organisatie <span className="font-medium text-foreground">zonder een apart btw-nummer</span>.
                    Daarna koppelt u per certificatie-een zo’n vestiging; u mag dezelfde vestiging
                    hergebruiken voor verschillende certificatievragen.
                  </p>
                </div>
                <Field>
                  <FieldLabel id={`${legalEntityFieldBase}-legend`}>
                    Kan de hierboven geregistreerde maatschappelijke zetel optreden als
                    juridisch aanspreekpunt (rechtspersoon) voor al uw gekozen certificatievragen
                    uit dit dossier?
                  </FieldLabel>
                  <FieldContent>
                    <RadioGroup
                      className="gap-3"
                      aria-labelledby={`${legalEntityFieldBase}-legend`}
                      value={
                        context.headOfficeIsCertificationLegalEntity === ""
                          ? undefined
                          : context.headOfficeIsCertificationLegalEntity
                      }
                      onValueChange={(v) => {
                        if (v === "yes") {
                          patchContext({
                            headOfficeIsCertificationLegalEntity: "yes",
                            onboardingVestigingen: [],
                            certificationInquiryVestigingId: {},
                          });
                        } else if (v === "no") {
                          patchContext({ headOfficeIsCertificationLegalEntity: "no" });
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id={`${legalEntityFieldBase}-yes`} />
                        <Label
                          htmlFor={`${legalEntityFieldBase}-yes`}
                          className="cursor-pointer font-normal"
                        >
                          Ja, voor alle geselecteerde certificaties volstaat deze zetel
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id={`${legalEntityFieldBase}-no`} />
                        <Label
                          htmlFor={`${legalEntityFieldBase}-no`}
                          className="cursor-pointer font-normal"
                        >
                          Nee, voor minstens één certificaat gaat het juridisch via een andere
                          vestiging dan de zetel
                        </Label>
                      </div>
                    </RadioGroup>
                    <FieldDescription>
                      Kiest u &quot;nee&quot;: voeg zoveel vestigingen toe als nodig zijn (naam +
                      adres, geen extra btw-nummer) en koppel elk van uw certificatievragen aan
                      de juiste vestiging — dezelfde vestiging mag u meermaals gebruiken.
                    </FieldDescription>
                  </FieldContent>
                </Field>
                {context.headOfficeIsCertificationLegalEntity === "no" ? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Registreer hier uw vestigingen. Per certificatie (zoals gekozen in uw
                        pakket) wijst u daarna onderaan een vestiging toe.
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        onClick={() =>
                          patchContext({
                            onboardingVestigingen: [
                              ...context.onboardingVestigingen,
                              emptyOnboardingVestiging(),
                            ],
                          })
                        }
                      >
                        Vestiging toevoegen
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {context.onboardingVestigingen.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nog geen vestiging geregistreerd — gebruik de knop{' '}
                          <span className="font-medium text-foreground">&quot;Vestiging
                          toevoegen&quot;</span>.
                        </p>
                      ) : null}
                      {context.onboardingVestigingen.map((ve, veIndex) => {
                        const usedByDraft = draftsSortedForCertification.some(
                          (d) =>
                            (context.certificationInquiryVestigingId[d.id] ?? "").trim() ===
                            ve.id,
                        );
                        const usedForInvoicing =
                          context.invoicingDiffersFromHeadOffice &&
                          (context.invoicingVestigingId ?? "").trim() === ve.id;
                        const vestigingInUse = usedByDraft || usedForInvoicing;
                        return (
                          <section
                            key={ve.id}
                            className={personFormCardClassName("emphasized")}
                            aria-labelledby={`${legalEntityFieldBase}-ve-${ve.id}-title`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0 space-y-1">
                                <h4
                                  id={`${legalEntityFieldBase}-ve-${ve.id}-title`}
                                  className="text-sm font-semibold tracking-tight text-foreground"
                                >
                                  Vestiging {veIndex + 1}
                                </h4>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                  Juridische naam en adres voor certificatie. Geen afzonderlijk btw-nummer.
                                </p>
                              </div>
                              <div className="flex shrink-0 flex-wrap items-center gap-2">
                                <SubformCompletionBadge
                                  complete={isOnboardingVestigingCaptureComplete(ve)}
                                  showIncompletePlaceholder
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  disabled={vestigingInUse}
                                  title={
                                    vestigingInUse
                                      ? usedForInvoicing
                                        ? "Kies eerst een andere vestiging voor facturatie (stap Facturatie)."
                                        : "Ontkoppel eerst deze vestiging van alle certificatievragen."
                                      : "Vestiging verwijderen"
                                  }
                                  className="text-destructive hover:text-destructive"
                                  onClick={() =>
                                    patchContext({
                                      onboardingVestigingen: context.onboardingVestigingen.filter(
                                        (x) => x.id !== ve.id,
                                      ),
                                      certificationInquiryVestigingId: Object.fromEntries(
                                        Object.entries(
                                          context.certificationInquiryVestigingId,
                                        ).filter(([, vid]) => (vid ?? "").trim() !== ve.id),
                                      ),
                                      ...((context.invoicingVestigingId ?? "").trim() === ve.id
                                        ? { invoicingVestigingId: "" }
                                        : {}),
                                    })
                                  }
                                >
                                  Verwijderen
                                </Button>
                              </div>
                            </div>
                            <Field>
                              <FieldLabel htmlFor={`${legalEntityFieldBase}-ve-name-${ve.id}`}>
                                Handels- of juridische naam van de vestiging
                              </FieldLabel>
                              <FieldContent>
                                <Input
                                  id={`${legalEntityFieldBase}-ve-name-${ve.id}`}
                                  value={ve.legalName}
                                  placeholder="Bv. naam van deze vestigingseenheid"
                                  onChange={(e) =>
                                    patchContext({
                                      onboardingVestigingen: context.onboardingVestigingen.map((x) =>
                                        x.id === ve.id ? { ...x, legalName: e.target.value } : x,
                                      ),
                                    })
                                  }
                                />
                              </FieldContent>
                            </Field>
                            <IdentificatieAddressSubform
                              idPrefix={`ves-${ve.id}`}
                              value={vestigingAddressSubformValue(ve)}
                              onChange={(v) => {
                                const iso =
                                  registrationIsoCodeFromDutchCountryLabel(v.country.trim()) ||
                                  "";
                                patchContext({
                                  onboardingVestigingen: context.onboardingVestigingen.map((x) =>
                                    x.id === ve.id
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
                                ve.country.trim() &&
                                countrySelectOptions.includes(ve.country.trim())
                                  ? ve.country.trim()
                                  : COUNTRY_SELECT_NONE
                              }
                              onCountryChange={(cv) =>
                                patchContext({
                                  onboardingVestigingen: context.onboardingVestigingen.map((x) =>
                                    x.id === ve.id ? { ...x, country: cv === COUNTRY_SELECT_NONE ? "" : cv } : x,
                                  ),
                                })
                              }
                              countrySelectMode="editable"
                              showCountryCodeField={false}
                            />
                          </section>
                        );
                      })}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold tracking-tight text-foreground">
                          Koppel vestigingen aan uw certificatievragen
                        </h4>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          Voor elke gekozen aanvraag geeft u aan welke vestiging daar juridisch
                          voor staat — u mag bestaande gegevens hergebruiken.
                        </p>
                      </div>
                      <div className="space-y-4">
                        {draftsSortedForCertification.map((draft) => (
                          <Field key={draft.id}>
                            <FieldLabel htmlFor={`${legalEntityFieldBase}-ves-${draft.id}`}>
                              {draft.shortLabel || draft.label}
                            </FieldLabel>
                            <FieldDescription>
                              {draft.productLabel
                                ? `${draft.label} · ${draft.productLabel}`
                                : draft.label}
                            </FieldDescription>
                            <FieldContent>
                              <Select
                                value={(context.certificationInquiryVestigingId[draft.id] ??
                                  ""
                                ).trim() || CERT_INQUIRY_VEST_UNASSIGNED}
                                onValueChange={(next) =>
                                  patchContext({
                                    certificationInquiryVestigingId: {
                                      ...context.certificationInquiryVestigingId,
                                      [draft.id]:
                                        next === CERT_INQUIRY_VEST_UNASSIGNED ? "" : next,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger
                                  id={`${legalEntityFieldBase}-ves-${draft.id}`}
                                  className="w-full max-w-xl"
                                >
                                  <SelectValue placeholder="— Kies een vestiging —" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={CERT_INQUIRY_VEST_UNASSIGNED}>
                                    — Maak nog een keuze —
                                  </SelectItem>
                                  {context.onboardingVestigingen.map((vx) => (
                                    <SelectItem key={vx.id} value={vx.id}>
                                      {formatVestigingRegistryOptionLabel(vx)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FieldContent>
                          </Field>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
    </>
  );
}
