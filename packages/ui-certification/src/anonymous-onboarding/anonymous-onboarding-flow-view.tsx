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
  SelectChoiceCard,
  SelectChoiceCardGroup,
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
import { CertificationRequestWizard } from "../components/certification-request-wizard/CertificationRequestWizard";
import { STABLE_STEP_MIN_HEIGHT } from "../components/certification-request-wizard/use-certification-request-wizard-view";
import {
  DraftCardDescription,
  sortDraftsByIntentAndProduct,
} from "../components/certification-request-wizard/draft-selection-presentation";
import { RegistrationProcessingDialog } from "../components/registration-processing-dialog";
import { PrototypeCard } from "@procertus-ui/ui-pt1-prototype";
import { PrefillFieldSkeleton } from "@procertus-ui/ui";
import { OnboardingStepper, StepLayout } from "@procertus-ui/ui-lib";
import { personSubformEmailStructuralIssue } from "@procertus-ui/domain-certification";
import { useMemo, useId } from "react";
import {
  findVatPrototypePreset,
  getRegistrantContextFieldsForPrototypePreset,
  registrationIsoCodeFromDutchCountryLabel,
  VAT_LOOKUP_OUTCOME_LABELS,
  VAT_PROTOTYPE_PRESETS,
  type CompanyFormFieldKey,
  type VatLookupMockOutcome,
} from "./lib/vatPrototypePresets";
import {
  isRegistrationIdentifierValidForOrigin,
  registrationIdentifierFieldMeta,
  registrationIdentifierStructuralIssue,
} from "./lib/registration-identifier-for-origin";
import { COUNTRY_SELECT_NONE } from "./anonymous-onboarding-constants";
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
  onboardingReviewRequesterFromContext,
  buildFullOnboardingPackageEntityRecords,
  resolveFlowContext,
  summaryDisplayNameForRegisteredPerson,
  summaryRolesForRegisteredPerson,
  ONBOARDING_PERSON_NEW_ID,
  vestigingAddressSubformValue,
  newOnboardingVestigingId,
} from "./anonymous-onboarding-flow-helpers";
import {
  companyRegistrationSourceCountryLabel,
  isFirmaCountryLockedToRequestOrigin,
  ONBOARDING_REQUEST_ORIGIN_HERO_OPTIONS,
  ONBOARDING_REQUEST_ORIGIN_IDS,
  ONBOARDING_REQUEST_ORIGIN_SECONDARY_OPTIONS,
  type OnboardingRequestOrigin,
} from "./onboarding-request-origin";
import { RequestOriginFlag } from "./onboarding-request-origin-flag";
import { SubformCompletionBadge } from "./subform-completion-badge";
import {
  IdentificatieAddressSubform,
  IdentificatieOptionalBlock,
  IdentificatiePersonRegistrySummary,
  IdentificatiePersonSubform,
} from "./identificatie-subforms";
import { IdentificatiePersonTitleRoleCapture } from "./identificatie-person-title-role-capture";
import { IdentificatiePersonRegistryPicker } from "./identificatie-person-registry-picker";
import type { CustomerContext } from "./anonymous-onboarding-types";
import { ONBOARDING_STEPS } from "./anonymous-onboarding-types";
import type { AnonymousOnboardingFlowViewProps } from "./anonymous-onboarding-flow-view-props";
import { AnonymousOnboardingShell } from "./anonymous-onboarding-shell";
import { personFormCardClassName } from "./person-form-card-variants";

/** Select sentinel for facturatievestiging picker. */
const CERT_INVOICE_VEST_UNASSIGNED = "__unset_invoice_vest__";
const CERT_INVOICE_VEST_NEW = "__new_invoice_vest__";

/** Select sentinel: Radix Select must not use an empty-string item value. */
const CERT_INQUIRY_VEST_UNASSIGNED = "__unset_inquiry_vest__";

/** Single labeled input used across customer and company steps (Storybook documents this export). */
export function AnonymousOnboardingContextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  description,
}: {
  id: keyof CustomerContext;
  label: string;
  value: string;
  onChange: (id: keyof CustomerContext, value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  description?: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={String(id)}>{label}</FieldLabel>
      <FieldContent>
        <Input
          id={String(id)}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(event) => onChange(id, event.target.value)}
        />
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
    </Field>
  );
}

const COMPANY_FORM_FIELD_LABELS: Record<CompanyFormFieldKey, string> = {
  organizationName: "Bedrijfsnaam",
  country: "Land",
  addressStreet: "Straat",
  addressHouseNumber: "Huisnummer",
  addressPostalCode: "Postcode",
  addressCity: "Plaats",
};

/** Skeleton grid shown during mock company lookup (Storybook documents this export). */
export function AnonymousOnboardingCompanyPrefillSkeleton({
  prefilledKeys,
  resolvedKeys,
}: {
  prefilledKeys: ReadonlySet<CompanyFormFieldKey>;
  resolvedKeys: ReadonlySet<CompanyFormFieldKey>;
}) {
  return (
    <div
      className="grid gap-4 md:grid-cols-2"
      aria-busy="true"
      aria-label="Velden die automatisch worden ingevuld"
    >
      <PrefillFieldSkeleton
        label={COMPANY_FORM_FIELD_LABELS.organizationName}
        prefilled={prefilledKeys.has("organizationName")}
        resolved={resolvedKeys.has("organizationName")}
      />
      <PrefillFieldSkeleton
        label={COMPANY_FORM_FIELD_LABELS.country}
        prefilled={prefilledKeys.has("country")}
        resolved={resolvedKeys.has("country")}
      />
      <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
        <PrefillFieldSkeleton
          label={COMPANY_FORM_FIELD_LABELS.addressStreet}
          prefilled={prefilledKeys.has("addressStreet")}
          resolved={resolvedKeys.has("addressStreet")}
        />
        <PrefillFieldSkeleton
          label={COMPANY_FORM_FIELD_LABELS.addressHouseNumber}
          prefilled={prefilledKeys.has("addressHouseNumber")}
          resolved={resolvedKeys.has("addressHouseNumber")}
        />
        <PrefillFieldSkeleton
          label={COMPANY_FORM_FIELD_LABELS.addressPostalCode}
          prefilled={prefilledKeys.has("addressPostalCode")}
          resolved={resolvedKeys.has("addressPostalCode")}
        />
        <PrefillFieldSkeleton
          label={COMPANY_FORM_FIELD_LABELS.addressCity}
          prefilled={prefilledKeys.has("addressCity")}
          resolved={resolvedKeys.has("addressCity")}
        />
      </div>
    </div>
  );
}

export function AnonymousOnboardingFlowView(props: AnonymousOnboardingFlowViewProps) {
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
  } = props;

  const originFieldBase = useId();
  const applicantLegalRepFieldBase = useId();
  /** Personal fields for legal representative (and registrant block) stay locked until Ja/Nee above. */
  const applicantLegalRepPersonFieldsLocked = context.applicantIsLegalRepresentative === "";
  const invoicingFieldBase = useId();
  const legalEntityFieldBase = useId();

  const draftsSortedForCertification = useMemo(
    () => sortDraftsByIntentAndProduct(drafts),
    [drafts],
  );

  const invoicingCountryOptions = useMemo(() => {
    const c = context.invoicingCountry?.trim();
    if (c && !countrySelectOptions.includes(c)) {
      return [...countrySelectOptions, c].sort((a, b) => a.localeCompare(b, "nl"));
    }
    return countrySelectOptions;
  }, [context.invoicingCountry, countrySelectOptions]);

  const invoicingCountrySelectValue = useMemo(() => {
    const t = context.invoicingCountry?.trim() ?? "";
    return t && invoicingCountryOptions.includes(t) ? t : COUNTRY_SELECT_NONE;
  }, [context.invoicingCountry, invoicingCountryOptions]);

  const invoicingVestigingSelectRadixValue = useMemo(
    () => (context.invoicingVestigingId ?? "").trim() || CERT_INVOICE_VEST_UNASSIGNED,
    [context.invoicingVestigingId],
  );

  const selectedInvoicingVestiging = useMemo(() => {
    const id = (context.invoicingVestigingId ?? "").trim();
    if (!id || !context.invoicingDiffersFromHeadOffice) {
      return undefined;
    }
    return context.onboardingVestigingen.find((x) => x.id === id);
  }, [context.invoicingVestigingId, context.invoicingDiffersFromHeadOffice, context.onboardingVestigingen]);

  const registrationIdOrigin = requestOrigin !== "" ? requestOrigin : "other";

  const registrationIdFieldMeta = useMemo(
    () => registrationIdentifierFieldMeta(registrationIdOrigin),
    [registrationIdOrigin],
  );

  const registrationIdentifierIssue = useMemo(
    () => registrationIdentifierStructuralIssue(context.vatNumber, registrationIdOrigin),
    [context.vatNumber, registrationIdOrigin],
  );
  const registrationIdentifierStructurallyValid = useMemo(() => {
    const raw = context.vatNumber?.trim() ?? "";
    if (!raw) return false;
    return isRegistrationIdentifierValidForOrigin(context.vatNumber, registrationIdOrigin);
  }, [context.vatNumber, registrationIdOrigin]);

  const invoicingEmailIssue = useMemo(() => {
    const t = context.invoicingEmail?.trim() ?? "";
    if (t.length === 0) return "Voer een e-mailadres voor facturatie in.";
    return personSubformEmailStructuralIssue(context.invoicingEmail ?? "");
  }, [context.invoicingEmail]);

  const canAddCertificationSecondary = useMemo(
    () => canEnableCertificationSecondaryContact(context),
    [context],
  );

  const fullPackageEntityRecords = useMemo(
    () =>
      buildFullOnboardingPackageEntityRecords(
        context,
        drafts,
        effectiveSummaryIncludedDraftIds,
        requestOrigin,
        summaryKlantenportaalByPersonId,
      ),
    [
      context,
      drafts,
      effectiveSummaryIncludedDraftIds,
      requestOrigin,
      summaryKlantenportaalByPersonId,
    ],
  );

  const summaryRequesterPresentation = useMemo(
    () => onboardingReviewRequesterFromContext(context),
    [context],
  );

  const summaryReq = summaryRequesterPresentation;
  const summaryRc = summaryReq.context;
  const summaryRequesterLabel = summaryReq.requesterLabel ?? "Ingediend door";
  const summaryRequesterEmailLabel = summaryReq.requesterEmailLabel ?? "E-mail";
  const summaryOrganizationLabel = summaryReq.organizationLabel ?? "Organisatie";
  const summarySectionTitle = summaryReq.sectionTitle ?? "Aanvrager en organisatie";

  const firmaCountryLocked = isFirmaCountryLockedToRequestOrigin(requestOrigin);
  const companySourceCountryLabel = companyRegistrationSourceCountryLabel(
    requestOrigin,
    context.country,
  );

  if (step === "request") {
    return (
      <AnonymousOnboardingShell
        pageTitle={certificationPhaseTitle}
        pageDescription={certificationPhaseDescription}
        onSignInClick={onSignInClick}
      >
        <CertificationRequestWizard {...certificationWizardProps} />
      </AnonymousOnboardingShell>
    );
  }

  return (
    <>
      <AnonymousOnboardingShell
        pageTitle={registrationPhaseTitle}
        pageDescription={registrationPhaseDescription}
        onSignInClick={onSignInClick}
      >
        <StepLayout
          className="w-full"
          minHeight={STABLE_STEP_MIN_HEIGHT}
          variant="onboarding"
          stepper={
            <OnboardingStepper
              steps={steps}
              activeStep={activeStep}
              onStepChange={(index) => {
                const nextStep = ONBOARDING_STEPS[index];
                if (nextStep) {
                  goToOnboardingStep(nextStep);
                }
              }}
              interactive
            />
          }
          title={
            step === "origin"
              ? "Land of regio"
              : step === "customer"
                ? "Registratie"
                : step === "company"
                  ? "Maatschappelijke zetel en certificatie"
                  : step === "invoicing"
                    ? "Facturatie"
                    : step === "extras"
                      ? "Extra contacten"
                      : "Nazicht"
          }
          description={
            step === "origin"
              ? "Kies waar uw organisatie gevestigd is. De volgende schermen sluiten daarop aan."
              : step === "customer"
                ? "Vul eerst het identificatienummer van uw organisatie in (afhankelijk van het gekozen land). Daarna vult u de wettelijke vertegenwoordiger en een geldig e-mailadres in."
                : step === "company"
                  ? "Hier registreert u de maatschappelijke zetel zoals gekoppeld aan uw organisatienummer. Daarna geeft u aan of die zetel juridisch optreedt voor de geselecteerde certificaties — zo niet, wijst u per certificatie een vestiging toe (naam en adres, zonder apart btw-nummer)."
                  : step === "invoicing"
                    ? "Facturatie-e-mail is verplicht. Standaard gelden de maatschappelijke zetel en de wettelijke vertegenwoordiger als factuurcontact; gebruik de blokken voor een vestiging op de factuur, een afwijkend postadres of een andere contactpersoon waar nodig."
                    : step === "extras"
                      ? "Optioneel: een contact voor certificatie en inspectie, en eventueel een tweede (reserve)contact. U kunt deze stap overslaan."
                      : "Controleer uw gegevens en aanvragen. Daarna kunt u uw registratie indienen."
          }
          backAction={backAction}
          primaryAction={primaryAction}
          cancelAction={cancelAction}
        >
          {step === "origin" ? (
            <div className="space-y-4">
              <SelectChoiceCardGroup
                className="p-0"
                legend="Waar is uw organisatie gevestigd?"
                hint="Uw keuze bepaalt welke gegevens we in de volgende stappen vragen en tonen."
                layout="stack"
                name="onboarding-request-origin"
                value={requestOrigin}
                onValueChange={(v: string) => {
                  if (ONBOARDING_REQUEST_ORIGIN_IDS.includes(v as OnboardingRequestOrigin)) {
                    setRequestOrigin(v as OnboardingRequestOrigin);
                  }
                }}
              >
                <div className="flex w-full min-w-0 flex-col gap-section">
                  <div className="flex w-full min-w-0 flex-row flex-nowrap items-stretch gap-3 md:gap-4">
                    {ONBOARDING_REQUEST_ORIGIN_HERO_OPTIONS.map((opt) => (
                      <div key={opt.id} className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col">
                        <SelectChoiceCard
                          value={opt.id}
                          controlId={`${originFieldBase}-${opt.id}`}
                          title={
                            <span className="flex min-w-0 items-center gap-2">
                              <RequestOriginFlag origin={opt.id} />
                              <span>{opt.title}</span>
                            </span>
                          }
                          description={opt.description}
                          variant="elevated"
                          appearance="hero"
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex w-full min-w-0 flex-row flex-nowrap items-stretch gap-3 md:gap-4">
                    {ONBOARDING_REQUEST_ORIGIN_SECONDARY_OPTIONS.map((opt) => (
                      <div
                        key={opt.id}
                        className="relative flex min-h-0 min-w-0 flex-1 basis-0 flex-col"
                      >
                        <div
                          className="pointer-events-none absolute top-3 right-3 z-10"
                          aria-hidden
                        >
                          <RequestOriginFlag origin={opt.id} compact />
                        </div>
                        <SelectChoiceCard
                          value={opt.id}
                          controlId={`${originFieldBase}-${opt.id}`}
                          title={opt.title}
                          description={opt.description}
                          variant="default"
                          appearance="default"
                          className="h-full pr-12"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </SelectChoiceCardGroup>
            </div>
          ) : null}
          {step === "customer" ? (
            <div className="space-y-6">
              <PrototypeCard
                title="Voorbeeldmodus"
                description={
                  <>
                    Kies een voorbeeld om het identificatieveld hieronder automatisch in te vullen
                    en de flow te doorlopen. U kunt het nummer altijd zelf aanpassen. Bij een andere
                    keuze worden naam, aanhef, functie en e-mail bijgewerkt en worden
                    bedrijfsgegevens leeggemaakt tot de opzoeking klaar is.
                  </>
                }
                notice={
                  activeVatPreset?.demoSupplementsOrgAddressFromEmailDomain ? (
                    <>
                      <span className="font-medium text-foreground">Let op bij dit voorbeeld:</span>{" "}
                      uw nummer levert hier geen bedrijfsnaam en volledig adres op. Waar mogelijk
                      vullen we die aan op basis van uw professionele e-mailadres. Controleer de
                      velden. Gebruikt u een gratis of algemeen e-mailadres, vult u naam en adres
                      zelf in.
                    </>
                  ) : undefined
                }
              >
                <Field>
                  <FieldLabel htmlFor="prototype-vat-preset">
                    Voorbeeld btw- / ondernemingsnummer
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      value={prototypeVatPresetId}
                      onValueChange={(id) => {
                        const preset =
                          findVatPrototypePreset(id) ??
                          vatPrototypePresetChoices[0] ??
                          VAT_PROTOTYPE_PRESETS[0];
                        if (!preset) return;
                        setFlowState((prev) => ({
                          ...prev,
                          prototypeVatPresetId: id,
                          companyFieldHints: {},
                          context: customerContextAfterPrototypePresetChange(
                            resolveFlowContext(prev.context),
                            preset,
                          ),
                        }));
                      }}
                    >
                      <SelectTrigger
                        id="prototype-vat-preset"
                        className="h-auto min-h-9 w-full py-2 whitespace-normal"
                      >
                        <SelectValue placeholder="Kies" />
                      </SelectTrigger>
                      <SelectContent>
                        {vatPrototypePresetChoices.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </PrototypeCard>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Organisatie-identificatie
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Het formaat hangt af van uw eerder gekozen land of regio. Zodra het nummer
                    klopt, kunt u verder naar bedrijfsgegevens.
                  </p>
                </div>
                <Field data-invalid={registrationIdentifierIssue ? true : undefined}>
                  <FieldLabel htmlFor="customer-registration-identifier">
                    {registrationIdFieldMeta.label}
                  </FieldLabel>
                  <FieldContent>
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Input
                        id="customer-registration-identifier"
                        className="min-w-0 flex-1"
                        value={context.vatNumber}
                        placeholder={registrationIdFieldMeta.placeholder}
                        onChange={(event) => updateContext("vatNumber", event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        aria-invalid={registrationIdentifierIssue != null}
                        aria-describedby={
                          registrationIdentifierIssue
                            ? "customer-registration-identifier-error customer-registration-identifier-hint"
                            : "customer-registration-identifier-hint"
                        }
                      />
                      <SubformCompletionBadge
                        complete={registrationIdentifierStructurallyValid}
                        title="Geldig formaat"
                      />
                    </div>
                    {registrationIdentifierIssue ? (
                      <p
                        id="customer-registration-identifier-error"
                        className="text-left text-sm font-medium text-destructive"
                        role="alert"
                      >
                        {registrationIdentifierIssue}
                      </p>
                    ) : null}
                    <FieldDescription id="customer-registration-identifier-hint">
                      {registrationIdFieldMeta.description}
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Wettelijke vertegenwoordiger
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  We registreren de persoon die uw organisatie wettelijk mag vertegenwoordigen. Geef
                  eerst aan of u die persoon zelf bent; zo niet, vullen we eerst uw eigen gegevens
                  in.
                </p>
              </div>
              <Field>
                <FieldLabel id={`${applicantLegalRepFieldBase}-legend`}>
                  Bent u zelf degene die u hieronder als wettelijke vertegenwoordiger invult?
                </FieldLabel>
                <FieldContent>
                  <RadioGroup
                    className="gap-3"
                    aria-labelledby={`${applicantLegalRepFieldBase}-legend`}
                    value={
                      context.applicantIsLegalRepresentative === ""
                        ? undefined
                        : context.applicantIsLegalRepresentative
                    }
                    onValueChange={(v) => {
                      if (v === "yes") {
                        setFlowState((prev) => ({
                          ...prev,
                          context: resolveFlowContext({
                            ...prev.context,
                            applicantIsLegalRepresentative: "yes",
                            registrantPerson: emptyIdentificatiePersonState(),
                            registrantTitlePreset: "none",
                            registrantTitle: "",
                            registrantRolePreset: "none",
                            registrantRole: "",
                          }),
                        }));
                      } else if (v === "no") {
                        setFlowState((prev) => {
                          const preset =
                            activeVatPreset ??
                            findVatPrototypePreset(prototypeVatPresetId) ??
                            VAT_PROTOTYPE_PRESETS[0];
                          const registrantMock = preset
                            ? getRegistrantContextFieldsForPrototypePreset(preset)
                            : undefined;
                          return {
                            ...prev,
                            context: resolveFlowContext({
                              ...prev.context,
                              applicantIsLegalRepresentative: "no",
                              ...(registrantMock ?? {
                                registrantPerson: emptyIdentificatiePersonState(),
                                registrantTitlePreset: "none",
                                registrantTitle: "",
                                registrantRolePreset: "none",
                                registrantRole: "",
                              }),
                            }),
                          };
                        });
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id={`${applicantLegalRepFieldBase}-yes`} />
                      <Label
                        htmlFor={`${applicantLegalRepFieldBase}-yes`}
                        className="cursor-pointer font-normal"
                      >
                        Ja, ik ben de wettelijke vertegenwoordiger
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id={`${applicantLegalRepFieldBase}-no`} />
                      <Label
                        htmlFor={`${applicantLegalRepFieldBase}-no`}
                        className="cursor-pointer font-normal"
                      >
                        Nee, ik vul namens de wettelijke vertegenwoordiger in
                      </Label>
                    </div>
                  </RadioGroup>
                  <FieldDescription>
                    Kies eerst wat voor u klopt. Zo nodig vullen we daarna uw eigen gegevens én de
                    gegevens van de wettelijke vertegenwoordiger in.
                  </FieldDescription>
                </FieldContent>
              </Field>
              {context.applicantIsLegalRepresentative === "no" ? (
                <section
                  className={personFormCardClassName("emphasized")}
                  aria-labelledby={`${applicantLegalRepFieldBase}-registrant-heading`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3
                        id={`${applicantLegalRepFieldBase}-registrant-heading`}
                        className="text-sm font-semibold tracking-tight text-foreground"
                      >
                        Uw gegevens als indiener
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Deze velden gaan over uzelf — degene die het formulier nu invult. Daarna
                        vult u de wettelijke vertegenwoordiger in.
                      </p>
                    </div>
                    <SubformCompletionBadge
                      complete={isRegistrantCaptureValidForContext(context)}
                      showIncompletePlaceholder
                      className="shrink-0"
                    />
                  </div>
                  <IdentificatiePersonTitleRoleCapture
                    idPrefix="registrant-applicant"
                    branch="registrant"
                    context={context}
                    patchContext={patchContext}
                    copy={{
                      titleLabel: "Title",
                      roleLabel: "Role",
                      emailHint:
                        "Uw werk-e-mail is verplicht. Aanhef en functie zijn optioneel. Wij gebruiken uw e-mail om u te bereiken over deze registratie en uw account.",
                    }}
                  />
                </section>
              ) : null}
              <section
                className={personFormCardClassName("chromeless")}
                aria-labelledby={`${applicantLegalRepFieldBase}-legal-rep-heading`}
              >
                <fieldset
                  disabled={applicantLegalRepPersonFieldsLocked}
                  className={cn(
                    "min-w-0 space-y-4 border-0 p-0",
                    applicantLegalRepPersonFieldsLocked && "opacity-55",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3
                        id={`${applicantLegalRepFieldBase}-legal-rep-heading`}
                        className="text-sm font-semibold tracking-tight text-foreground"
                      >
                        Gegevens wettelijke vertegenwoordiger
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {context.applicantIsLegalRepresentative === "no"
                          ? "Vul hier de persoon in die uw organisatie wettelijk mag vertegenwoordigen en de registratie mag ondertekenen."
                          : context.applicantIsLegalRepresentative === "yes"
                            ? "Dit adres gebruiken we voor uw account en berichten over uw aanvraag, tenzij u straks een ander contact opgeeft."
                            : "Kies hierboven of u de wettelijke vertegenwoordiger bent; vul daarna deze gegevens in."}
                      </p>
                    </div>
                    <SubformCompletionBadge
                      complete={isLegalRepresentativeCaptureComplete(context)}
                      showIncompletePlaceholder
                      className="shrink-0"
                    />
                  </div>
                  <IdentificatiePersonTitleRoleCapture
                    idPrefix="legal-rep"
                    branch="legalRepresentative"
                    context={context}
                    patchContext={patchContext}
                    disabled={applicantLegalRepPersonFieldsLocked}
                    copy={{
                      titleLabel: "Title",
                      roleLabel: "Role",
                      emailHint:
                        context.applicantIsLegalRepresentative === "no"
                          ? "Het professionele e-mailadres van de wettelijke vertegenwoordiger is verplicht; aanhef en functie zijn optioneel."
                          : context.applicantIsLegalRepresentative === "yes"
                            ? "Dit e-mailadres is verplicht voor uw account; aanhef en functie zijn optioneel. Wij gebruiken het voor berichten over uw aanvraag, tenzij u straks een ander contact opgeeft."
                            : "Maak hierboven eerst een keuze; daarna worden deze velden actief.",
                    }}
                  />
                </fieldset>
              </section>
            </div>
          ) : null}

          {step === "company" ? (
            <div className="space-y-6">
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
                  <AnonymousOnboardingCompanyPrefillSkeleton
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
                    <AnonymousOnboardingContextField
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
            </div>
          ) : null}

          {step === "invoicing" ? (
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
          ) : null}

          {step === "extras" ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Certificatie en inspectie
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Optioneel: schakel in wat nodig is. Alle blokken gebruiken hetzelfde patroon
                  (schakelaar rechtsboven). U kunt deze stap overslaan.
                </p>
              </div>
              <IdentificatieOptionalBlock
                switchId="cert-primary"
                title="Contactpersoon voor certificatie en inspectie"
                description="Los van facturatie: dit is het aanspreekpunt voor alles rond certificatie en inspectie. Kies een bestaande persoon of een nieuwe."
                checked={context.addCertificationContactOverride}
                onCheckedChange={(on) =>
                  patchContext({
                    addCertificationContactOverride: on,
                    ...(!on
                      ? {
                          certificationContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                          addCertificationSecondaryContact: false,
                          certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                        }
                      : {}),
                  })
                }
                headerTrailing={
                  context.addCertificationContactOverride ? (
                    <IdentificatiePersonRegistryPicker
                      cardHeader
                      id={`${invoicingFieldBase}-cert-primary-registry`}
                      label="Persoon kiezen"
                      hint="Kies een bestaande persoon of een nieuwe persoon invoeren. Alleen bij een nieuwe persoon vult u hieronder aanhef en functie in."
                      registeredPersons={context.onboardingRegisteredPersons}
                      value={context.certificationContactPersonRegistryId}
                      onValueChange={(rid) => {
                        if (rid === ONBOARDING_PERSON_NEW_ID) {
                          patchContext({
                            certificationContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                            certificationContact: emptyIdentificatiePersonState(),
                            certificationContactTitlePreset: "none",
                            certificationContactTitle: "",
                            certificationContactRolePreset: "none",
                            certificationContactRole: "",
                          });
                          return;
                        }
                        const row = context.onboardingRegisteredPersons.find((p) => p.id === rid);
                        if (!row) {
                          return;
                        }
                        const p = row.person;
                        const certAanhef = p.title?.trim() ?? "";
                        patchContext({
                          certificationContactPersonRegistryId: rid,
                          certificationContact: {
                            firstName: p.firstName,
                            lastName: p.lastName,
                            title: p.title,
                            telephone: p.telephone,
                            email: p.email,
                          },
                          certificationContactTitlePreset: certAanhef ? "other" : "none",
                          certificationContactTitle: certAanhef,
                          certificationContactRolePreset: "none",
                          certificationContactRole: "",
                        });
                      }}
                    />
                  ) : null
                }
              >
                {context.addCertificationContactOverride ? (
                  <IdentificatiePersonTitleRoleCapture
                    registryPersonSelected={
                      context.certificationContactPersonRegistryId !== ONBOARDING_PERSON_NEW_ID
                    }
                    idPrefix="cert-primary"
                    branch="certificationContact"
                    context={context}
                    patchContext={patchContext}
                    copy={{
                      titleLabel: "Title",
                      roleLabel: "Role",
                      emailHint: "Naam en e-mail zijn verplicht; aanhef en functie zijn optioneel.",
                    }}
                  />
                ) : null}
              </IdentificatieOptionalBlock>
              <IdentificatieOptionalBlock
                switchId="cert-secondary"
                title="Tweede contactpersoon (reserve certificatie en inspectie)"
                description="Optioneel: een extra geadresseerde als reserve, naast het hoofdcontact voor certificatie en inspectie hierboven."
                checked={context.addCertificationSecondaryContact}
                onCheckedChange={(on) =>
                  patchContext({
                    addCertificationSecondaryContact: on,
                    ...(!on
                      ? { certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID }
                      : {
                          certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                          certificationSecondary: emptyIdentificatiePersonState(),
                          certificationSecondaryTitlePreset: "none",
                          certificationSecondaryTitle: "",
                          certificationSecondaryRolePreset: "none",
                          certificationSecondaryRole: "",
                        }),
                  })
                }
                disabled={!canAddCertificationSecondary}
                disabledHint={certificationSecondaryContactDisabledHint(context)}
                headerTrailing={
                  context.addCertificationSecondaryContact && canAddCertificationSecondary ? (
                    <IdentificatiePersonRegistryPicker
                      cardHeader
                      id={`${invoicingFieldBase}-cert-secondary-registry`}
                      label="Persoon kiezen"
                      hint="Kies een bestaande persoon of een nieuwe persoon invoeren. Alleen bij een nieuwe persoon vult u hieronder aanhef en functie in."
                      registeredPersons={context.onboardingRegisteredPersons}
                      value={context.certificationSecondaryPersonRegistryId}
                      onValueChange={(rid) => {
                        if (rid === ONBOARDING_PERSON_NEW_ID) {
                          patchContext({
                            certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                            certificationSecondary: emptyIdentificatiePersonState(),
                            certificationSecondaryTitlePreset: "none",
                            certificationSecondaryTitle: "",
                            certificationSecondaryRolePreset: "none",
                            certificationSecondaryRole: "",
                          });
                          return;
                        }
                        const row = context.onboardingRegisteredPersons.find((p) => p.id === rid);
                        if (!row) {
                          return;
                        }
                        const p = row.person;
                        const cert2Aanhef = p.title?.trim() ?? "";
                        patchContext({
                          certificationSecondaryPersonRegistryId: rid,
                          certificationSecondary: {
                            firstName: p.firstName,
                            lastName: p.lastName,
                            title: p.title,
                            telephone: p.telephone,
                            email: p.email,
                          },
                          certificationSecondaryTitlePreset: cert2Aanhef ? "other" : "none",
                          certificationSecondaryTitle: cert2Aanhef,
                          certificationSecondaryRolePreset: "none",
                          certificationSecondaryRole: "",
                        });
                      }}
                    />
                  ) : null
                }
              >
                {context.addCertificationSecondaryContact && canAddCertificationSecondary ? (
                  <IdentificatiePersonTitleRoleCapture
                    registryPersonSelected={
                      context.certificationSecondaryPersonRegistryId !== ONBOARDING_PERSON_NEW_ID
                    }
                    idPrefix="cert-secondary"
                    branch="certificationSecondary"
                    context={context}
                    patchContext={patchContext}
                    copy={{
                      titleLabel: "Title",
                      roleLabel: "Role",
                      emailHint: "Naam en e-mail zijn verplicht; aanhef en functie zijn optioneel.",
                    }}
                  />
                ) : null}
              </IdentificatieOptionalBlock>
            </div>
          ) : null}

          {step === "summary" ? (
            <div className="flex w-full min-w-0 max-w-none flex-col gap-6">
              <div className="grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:items-start">
                <div className="flex min-w-0 flex-col gap-8">
                  <section className="space-y-4" aria-labelledby="summary-aanvrager-heading">
                    <h3
                      id="summary-aanvrager-heading"
                      className="m-0 text-base font-semibold leading-snug tracking-tight text-foreground"
                    >
                      {summarySectionTitle}
                    </h3>
                    <div className="grid gap-section sm:grid-cols-2">
                      <div className="flex min-w-0 flex-col gap-section">
                        <div className="flex flex-col gap-micro">
                          <p className="m-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            {summaryRequesterLabel}
                          </p>
                          <p className="m-0 text-base font-semibold leading-snug text-foreground">
                            {summaryRc.requesterName}
                          </p>
                        </div>
                        {summaryRc.requesterEmail ? (
                          <div className="flex flex-col gap-micro">
                            <p className="m-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                              {summaryRequesterEmailLabel}
                            </p>
                            <p className="m-0 min-w-0 wrap-break-word">
                              <a
                                href={`mailto:${summaryRc.requesterEmail}`}
                                className="text-base font-normal text-primary underline-offset-2 hover:underline"
                              >
                                {summaryRc.requesterEmail}
                              </a>
                            </p>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-col gap-section">
                        <div className="flex flex-col gap-micro">
                          <p className="m-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            {summaryOrganizationLabel}
                          </p>
                          <p className="m-0 text-base font-semibold leading-snug text-foreground">
                            {summaryRc.organizationName}
                          </p>
                        </div>
                        {summaryRc.organizationDetails ? (
                          <div className="text-base font-normal leading-[1.6] text-muted-foreground [&_p]:m-0 [&_p+p]:mt-micro">
                            {summaryRc.organizationDetails}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {drafts.length > 0 &&
                      effectiveSummaryIncludedDraftIds.length < drafts.length ? (
                        <Badge variant="secondary">
                          {effectiveSummaryIncludedDraftIds.length} van {drafts.length} in aanvraag
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {drafts.length} certificatievragen in aanvraag
                        </Badge>
                      )}
                    </div>
                    {rows.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-border/50">
                        <Table className="text-xs leading-snug tabular-nums">
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="w-2/5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                Item
                              </TableHead>
                              <TableHead className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                Waarde
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {rows.map((r) => (
                              <TableRow key={r.id}>
                                <TableCell
                                  className={cn(
                                    "align-top font-mono text-[11px] leading-relaxed text-muted-foreground",
                                  )}
                                >
                                  {r.label}
                                </TableCell>
                                <TableCell
                                  className={cn(
                                    "min-w-0 wrap-break-word align-top font-mono text-[11px] font-normal leading-relaxed text-foreground",
                                  )}
                                >
                                  {r.value}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : null}
                  </section>

                  <section className="space-y-3" aria-labelledby="summary-persons-heading">
                    <h3
                      id="summary-persons-heading"
                      className="m-0 text-base font-semibold leading-snug tracking-tight text-foreground"
                    >
                      Geregistreerde personen
                    </h3>
                    <p className="m-0 text-sm text-muted-foreground">
                      Kies wie we onboarden op het Klantenportaal.
                    </p>
                    {context.onboardingRegisteredPersons.length === 0 ? (
                      <p className="m-0 text-sm text-muted-foreground" role="status">
                        Nog geen personen in het register voor deze sessie.
                      </p>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-border/50">
                        <Table className="text-xs leading-snug">
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="min-w-[8rem] font-semibold">Naam</TableHead>
                              <TableHead className="min-w-0 font-semibold">Rollen</TableHead>
                              <TableHead className="w-36 text-right font-semibold">
                                Klantenportaal
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {context.onboardingRegisteredPersons.map((p) => {
                              const roles = summaryRolesForRegisteredPerson(context, p);
                              const klantenportaalOn =
                                summaryKlantenportaalByPersonId[p.id] !== false;
                              return (
                                <TableRow key={p.id}>
                                  <TableCell className="align-top font-medium text-foreground">
                                    {summaryDisplayNameForRegisteredPerson(p)}
                                  </TableCell>
                                  <TableCell className="min-w-0 align-top text-muted-foreground">
                                    {roles.length > 0 ? (
                                      <ul className="m-0 list-inside list-disc space-y-0.5 p-0">
                                        {roles.map((roleLabel) => (
                                          <li key={roleLabel} className="text-xs leading-relaxed">
                                            {roleLabel}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    <div className="flex items-center justify-end gap-2">
                                      <Label htmlFor={`klantenportaal-${p.id}`} className="sr-only">
                                        Klantenportaal voor{" "}
                                        {summaryDisplayNameForRegisteredPerson(p)}
                                      </Label>
                                      <span className="text-[10px] text-muted-foreground sm:text-xs">
                                        Onboarding
                                      </span>
                                      <Switch
                                        id={`klantenportaal-${p.id}`}
                                        checked={klantenportaalOn}
                                        onCheckedChange={(v) =>
                                          setFlowState((prev) => ({
                                            ...prev,
                                            summaryKlantenportaalByPersonId: {
                                              ...prev.summaryKlantenportaalByPersonId,
                                              [p.id]: v === true,
                                            },
                                          }))
                                        }
                                      />
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </section>
                </div>
                <Card className="w-full min-w-0 overflow-hidden lg:max-w-none">
                  <CardHeader>
                    <CardTitle>Aanvragen</CardTitle>
                    <CardDescription>
                      Pas uw selectie van certificatieaanvragen nog aan.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {drafts.length === 0 ? (
                      <>
                        <p className="m-0 text-sm text-muted-foreground" role="status">
                          Geen conceptaanvragen.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => goToOnboardingStep("request")}
                        >
                          Aanvraag wijzigen
                        </Button>
                      </>
                    ) : (
                      <>
                        <SelectChoiceCardGroup selectionMode="multiple">
                          <CardList
                            items={sortDraftsByIntentAndProduct(drafts)}
                            widthClass="@min-[40rem]:grid-cols-1"
                          >
                            {(draft) => (
                              <SelectChoiceCard
                                key={draft.id}
                                selectionMode="multiple"
                                value={draft.id}
                                controlId={`onboarding-summary-draft-${draft.id}`}
                                title={draft.label}
                                description={<DraftCardDescription draft={draft} />}
                                checked={effectiveSummaryIncludedDraftIds.includes(draft.id)}
                                onCheckedChange={(checked) => {
                                  setFlowState((prev) => {
                                    const ids = prev.drafts.map((d) => d.id);
                                    const base = prev.summaryIncludedDraftIds ?? [...ids];
                                    const next = checked
                                      ? Array.from(new Set([...base, draft.id]))
                                      : base.filter((id) => id !== draft.id);
                                    return { ...prev, summaryIncludedDraftIds: next };
                                  });
                                }}
                                variant="elevated"
                              />
                            )}
                          </CardList>
                        </SelectChoiceCardGroup>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => goToOnboardingStep("request")}
                          >
                            Aanvraag wijzigen
                          </Button>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            Ga terug naar de wizard om aanvragen toe te voegen, te verwijderen of
                            opnieuw samen te stellen.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="w-full max-w-none overflow-hidden">
                <CardHeader>
                  <CardTitle>Volledig pakketoverzicht</CardTitle>
                  <CardDescription>
                    Per record één samenvatting van alle bijbehorende gegevens (zoals die worden
                    verstuurd).
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto px-0 sm:px-6">
                  <Table className="text-xs leading-snug">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[10rem] font-semibold">Record</TableHead>
                        <TableHead className="min-w-0 font-semibold">Gegevens</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fullPackageEntityRecords.map((rec) => (
                        <TableRow key={rec.id} className="align-top">
                          <TableCell className="font-medium text-foreground">{rec.title}</TableCell>
                          <TableCell className="min-w-0 whitespace-pre-line wrap-break-word text-muted-foreground">
                            {rec.summary.trim() || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </StepLayout>
      </AnonymousOnboardingShell>

      <RegistrationProcessingDialog
        open={registrationSubmitOpen}
        onOpenChange={onRegistrationSubmitOpenChange}
        progress={registrationProgress}
        activeStepIndex={registrationStepIndex}
        steps={registrationSimulationLabels}
      />
    </>
  );
}
