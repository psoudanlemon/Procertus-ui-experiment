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
  firmaAddressSubformValue,
  invoicingAddressSubformValue,
  isLegalRepresentativeCaptureComplete,
  isRegistrantCaptureValidForContext,
  onboardingReviewRequesterFromContext,
  buildFullOnboardingPackageEntityRecords,
  resolveFlowContext,
  summaryDisplayNameForRegisteredPerson,
  summaryRolesForRegisteredPerson,
  ONBOARDING_PERSON_NEW_ID,
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
  const invoicingFieldBase = useId();

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
                  ? "Uw organisatie"
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
                  ? "Naam, adres en telefoon van uw bedrijf. Vul een geldig facturatie-e-mailadres in. Optioneel kunt u hier ook een afwijkend facturatieadres toevoegen."
                  : step === "extras"
                    ? "Optioneel: een contact voor facturatie, een apart contact voor certificatie en inspectie, en eventueel een tweede (reserve)contact. Elk blok staat los van de andere. U kunt deze stap overslaan."
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
                  copy={{
                    titleLabel: "Title",
                    roleLabel: "Role",
                    emailHint:
                      context.applicantIsLegalRepresentative === "no"
                        ? "Het professionele e-mailadres van de wettelijke vertegenwoordiger is verplicht; aanhef en functie zijn optioneel."
                        : "Dit e-mailadres is verplicht voor uw account; aanhef en functie zijn optioneel. Wij gebruiken het voor berichten over uw aanvraag, tenzij u straks een ander contact opgeeft.",
                  }}
                />
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
                      Organisatie
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Gegevens van uw bedrijf zoals we ze nodig hebben voor uw traject. Controleer
                      ze vooral als er automatisch iets werd ingevuld.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AnonymousOnboardingContextField
                      id="organizationName"
                      label="Bedrijfsnaam"
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
                  <Field data-invalid={invoicingEmailIssue ? true : undefined}>
                    <FieldLabel htmlFor={`${invoicingFieldBase}-email`}>
                      E-mail voor facturatie <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Input
                          id={`${invoicingFieldBase}-email`}
                          type="email"
                          className="min-w-0 flex-1 max-w-xl"
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
                  <IdentificatieOptionalBlock
                    switchId={`${invoicingFieldBase}-inv-alt-address`}
                    title="Afwijkend facturatieadres"
                    description="Facturen naar een ander adres dan het bedrijfsadres."
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
                </>
              ) : null}
            </div>
          ) : null}

          {step === "extras" ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Facturatie en contacten
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Optioneel: schakel in wat nodig is. Alle opties gebruiken hetzelfde patroon
                  (schakelaar rechtsboven). U kunt doorgaan zonder iets in te schakelen.
                </p>
              </div>
              <IdentificatieOptionalBlock
                switchId={`${invoicingFieldBase}-inv-person`}
                title="Contactpersoon voor facturatie"
                description="Facturatie en gerelateerde financiële opvolging lopen via deze persoon. Kies iemand uit uw contactenlijst of voer een nieuwe persoon in."
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
