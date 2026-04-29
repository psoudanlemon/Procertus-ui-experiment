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
  Progress,
  Select,
  SelectChoiceCard,
  SelectChoiceCardGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  CardList,
  cn,
} from "@procertus-ui/ui";
import { CertificationRequestWizard } from "../components/certification-request-wizard/CertificationRequestWizard";
import {
  DraftCardDescription,
  sortDraftsByIntentAndProduct,
} from "../components/certification-request-wizard/draft-selection-presentation";
import { RegistrationProcessingDialog } from "../components/registration-processing-dialog";
import { RequestPackageReview } from "../components/request-package-review";
import { PrototypeCard } from "@procertus-ui/ui-pt1-prototype";
import { PrefillFieldSkeleton } from "@procertus-ui/ui";
import {
  OnboardingStepper,
  StepLayout,
} from "@procertus-ui/ui-lib";
import {
  REPRESENTATIVE_ROLE_PRESETS,
  REPRESENTATIVE_TITLE_PRESETS,
  roleLabelForPresetId,
  titleLabelForPresetId,
} from "./lib/registrationPersonOptions";
import {
  findVatPrototypePreset,
  getPersonContextFieldsForPrototypePreset,
  VAT_LOOKUP_OUTCOME_LABELS,
  VAT_PROTOTYPE_PRESETS,
  type CompanyFormFieldKey,
  type VatLookupMockOutcome,
} from "./lib/vatPrototypePresets";
import { COUNTRY_SELECT_NONE } from "./anonymous-onboarding-constants";
import {
  onboardingReviewRequesterFromContext,
  resolveFlowContext,
} from "./anonymous-onboarding-flow-helpers";
import type { CustomerContext } from "./anonymous-onboarding-types";
import { ONBOARDING_STEPS } from "./anonymous-onboarding-types";
import type { AnonymousOnboardingFlowViewProps } from "./anonymous-onboarding-flow-view-props";
import { AnonymousOnboardingShell } from "./anonymous-onboarding-shell";

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
    setFlowState,
    drafts,
    effectiveSummaryIncludedDraftIds,
    rows,
    steps,
    activeStep,
    goToOnboardingStep,
    primaryAction,
    backAction,
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
    countrySelectOptions,
    countrySelectValue,
    companyHints,
  } = props;

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
            step === "customer"
              ? "Uw gegevens"
              : step === "company"
                ? "Bedrijf en adres"
                : "Samenvatting"
          }
          description={
            step === "customer"
              ? "Wie registreert en het btw- of ondernemingsnummer van uw organisatie."
              : step === "company"
                ? "We combineren uw nummer met openbare registers en, waar dat onvoldoende is, met gegevens over de onderneming achter uw e-maildomein (serverside)."
                : "Controleer uw gegevens en de aanvragen voordat u indient."
          }
          stepLabel={`Onboarding · stap ${activeStep + 1} van ${steps.length}`}
          backAction={backAction}
          primaryAction={primaryAction}
        >
          {step === "customer" ? (
            <div className="space-y-6">
              <PrototypeCard
                title="Prototype"
                description={
                  <>
                    In deze demo kiest u een voorbeeldnummer uit de lijst. In de echte toepassing
                    typt u uw eigen nummer in; we controleren of het geldig is opgebouwd vóór we
                    gegevens ophalen. Bij een ander voorbeeld worden naam, titel, rol en het
                    demo-e-mailadres automatisch aangepast; bedrijfsgegevens worden leeggemaakt tot
                    na de mock-lookup.
                  </>
                }
                notice={
                  activeVatPreset?.demoSupplementsOrgAddressFromEmailDomain ? (
                    <>
                      <span className="font-medium text-foreground">
                        Dit voorbeeld (FR / DE / VS):
                      </span>{" "}
                      het register levert geen bedrijfsnaam noch vestigingsadres uit het nummer. In
                      de demo worden die gegevens — als uw e-maildomein in de mock voorkomt —
                      serverside ingevuld op basis van het{" "}
                      <span className="font-medium text-foreground">registratiedomein</span> van uw
                      e-mail (niet enkel het land uit de TLD).
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
                        const preset = findVatPrototypePreset(id) ?? VAT_PROTOTYPE_PRESETS[0];
                        if (!preset) return;
                        setFlowState((prev) => ({
                          ...prev,
                          prototypeVatPresetId: id,
                          companyFieldHints: {},
                          context: resolveFlowContext({
                            ...prev.context,
                            ...getPersonContextFieldsForPrototypePreset(preset),
                            vatNumber: preset.vatNumber,
                            organizationName: "",
                            country: "",
                            addressStreet: "",
                            addressHouseNumber: "",
                            addressPostalCode: "",
                            addressCity: "",
                          }),
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
                        {VAT_PROTOTYPE_PRESETS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </PrototypeCard>
              <AnonymousOnboardingContextField
                id="vatNumber"
                label="Btw- of ondernemingsnummer"
                value={context.vatNumber}
                onChange={updateContext}
                readOnly
              />
              <div className="grid gap-4 md:grid-cols-2">
                <AnonymousOnboardingContextField
                  id="representativeFirstName"
                  label="Voornaam"
                  value={context.representativeFirstName}
                  onChange={updateContext}
                />
                <AnonymousOnboardingContextField
                  id="representativeLastName"
                  label="Achternaam"
                  value={context.representativeLastName}
                  onChange={updateContext}
                />
              </div>
              <Field>
                <FieldLabel htmlFor="representativeEmail">E-mail</FieldLabel>
                <FieldContent>
                  <Input
                    id="representativeEmail"
                    type="email"
                    autoComplete="email"
                    value={context.representativeEmail}
                    onChange={(event) => updateContext("representativeEmail", event.target.value)}
                  />
                </FieldContent>
              </Field>
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="representativeTitlePreset">Titel</FieldLabel>
                  <FieldContent>
                    <Select
                      value={
                        REPRESENTATIVE_TITLE_PRESETS.some(
                          (p) => p.id === context.representativeTitlePreset,
                        )
                          ? context.representativeTitlePreset
                          : "none"
                      }
                      onValueChange={(id) => {
                        if (id === "other") {
                          setFlowState((prev) => ({
                            ...prev,
                            context: resolveFlowContext({
                              ...prev.context,
                              representativeTitlePreset: id,
                            }),
                          }));
                          return;
                        }
                        if (id === "none") {
                          setFlowState((prev) => ({
                            ...prev,
                            context: resolveFlowContext({
                              ...prev.context,
                              representativeTitlePreset: id,
                              representativeTitle: "",
                            }),
                          }));
                          return;
                        }
                        const label = titleLabelForPresetId(id);
                        setFlowState((prev) => ({
                          ...prev,
                          context: resolveFlowContext({
                            ...prev.context,
                            representativeTitlePreset: id,
                            representativeTitle: label,
                          }),
                        }));
                      }}
                    >
                      <SelectTrigger id="representativeTitlePreset" className="w-full">
                        <SelectValue placeholder="Kies" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPRESENTATIVE_TITLE_PRESETS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
                {context.representativeTitlePreset === "other" ? (
                  <Field>
                    <FieldLabel htmlFor="representativeTitle">Titel (vrij)</FieldLabel>
                    <FieldContent>
                      <Input
                        id="representativeTitle"
                        value={context.representativeTitle}
                        onChange={(event) =>
                          updateContext("representativeTitle", event.target.value)
                        }
                        placeholder="Bv. lic., doctor honoris causa"
                      />
                      <FieldDescription>Vul uw titel.</FieldDescription>
                    </FieldContent>
                  </Field>
                ) : null}
              </div>
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="representativeRolePreset">
                    Rol binnen de organisatie
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      value={
                        REPRESENTATIVE_ROLE_PRESETS.some(
                          (p) => p.id === context.representativeRolePreset,
                        )
                          ? context.representativeRolePreset
                          : "managing_director"
                      }
                      onValueChange={(id) => {
                        if (id === "other") {
                          setFlowState((prev) => ({
                            ...prev,
                            context: resolveFlowContext({
                              ...prev.context,
                              representativeRolePreset: id,
                              representativeRole: "",
                            }),
                          }));
                          return;
                        }
                        const label = roleLabelForPresetId(id);
                        setFlowState((prev) => ({
                          ...prev,
                          context: resolveFlowContext({
                            ...prev.context,
                            representativeRolePreset: id,
                            representativeRole: label,
                          }),
                        }));
                      }}
                    >
                      <SelectTrigger id="representativeRolePreset" className="w-full">
                        <SelectValue placeholder="Kies" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPRESENTATIVE_ROLE_PRESETS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
                {context.representativeRolePreset === "other" ? (
                  <Field>
                    <FieldLabel htmlFor="representativeRole">Functieomschrijving</FieldLabel>
                    <FieldContent>
                      <Input
                        id="representativeRole"
                        value={context.representativeRole}
                        onChange={(event) =>
                          updateContext("representativeRole", event.target.value)
                        }
                        placeholder="Bv. projectleider extern"
                      />
                      <FieldDescription>Verplicht: beschrijf uw rol.</FieldDescription>
                    </FieldContent>
                  </Field>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "company" ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
              </div>

              {companyLookupPhase === "loading" ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-foreground">Bezig met ophalen</span>
                      <span className="tabular-nums text-muted-foreground">
                        {Math.round(lookupProgress)}%
                      </span>
                    </div>
                    <Progress
                      value={lookupProgress}
                      className="h-2"
                      aria-label="Voortgang gegevensophaling"
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
                            "flex gap-3 text-sm transition-colors",
                            done || active ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 size-2 shrink-0 rounded-full",
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
                      title="Aanvulling via e-maildomein"
                      description={
                        <>
                          Voor dit scenario komt de{" "}
                          <span className="font-medium text-foreground">bedrijfsnaam</span> en het{" "}
                          <span className="font-medium text-foreground">volledige adres</span> niet
                          uit het btw-/ondernemingsregister in de demo. Ze worden hier ingevuld via
                          het <span className="font-medium text-foreground">registratiedomein</span>{" "}
                          van het e-mailadres dat u eerder opgaf (serverside mock). Controleer de
                          velden; bij een generiek mailboxdomein blijven ze leeg tot u ze zelf
                          invult.
                        </>
                      }
                      cardContentClassName="hidden"
                    >
                      {null}
                    </PrototypeCard>
                  ) : null}
                  <div className="grid gap-4 md:grid-cols-2">
                    <AnonymousOnboardingContextField
                      id="organizationName"
                      label="Bedrijfsnaam"
                      value={context.organizationName}
                      onChange={updateContext}
                      placeholder="Zoals geregistreerd"
                      description={companyHints.organizationName}
                    />
                    <Field>
                      <FieldLabel htmlFor="country">Land</FieldLabel>
                      <FieldContent>
                        <Select
                          value={countrySelectValue}
                          onValueChange={(v) =>
                            updateContext("country", v === COUNTRY_SELECT_NONE ? "" : v)
                          }
                        >
                          <SelectTrigger id="country" className="w-full">
                            <SelectValue placeholder="Kies een land" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={COUNTRY_SELECT_NONE}>Kies een land</SelectItem>
                            {countrySelectOptions.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {companyHints.country ? (
                          <FieldDescription>{companyHints.country}</FieldDescription>
                        ) : null}
                      </FieldContent>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
                      <AnonymousOnboardingContextField
                        id="addressStreet"
                        label="Straat"
                        value={context.addressStreet}
                        onChange={updateContext}
                        placeholder="Straatnaam"
                        description={companyHints.addressStreet}
                      />
                      <AnonymousOnboardingContextField
                        id="addressHouseNumber"
                        label="Huisnummer"
                        value={context.addressHouseNumber}
                        onChange={updateContext}
                        placeholder="Bv. 12 of 12B"
                      />
                      <AnonymousOnboardingContextField
                        id="addressPostalCode"
                        label="Postcode"
                        value={context.addressPostalCode}
                        onChange={updateContext}
                        placeholder="Post- of postcode"
                      />
                      <AnonymousOnboardingContextField
                        id="addressCity"
                        label="Plaats"
                        value={context.addressCity}
                        onChange={updateContext}
                        placeholder="Gemeente of stad"
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {step === "summary" ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)]">
              <RequestPackageReview
                title="Coordinated intake"
                description="Klantcontext, validatiecontext en aanvraagset worden samen ingediend."
                requester={onboardingReviewRequesterFromContext(context)}
                rows={rows}
                notice={
                  drafts.length > 0 && effectiveSummaryIncludedDraftIds.length < drafts.length ? (
                    <Badge variant="secondary">
                      {effectiveSummaryIncludedDraftIds.length} van {drafts.length} in aanvraag
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {drafts.length} certificatievragen in aanvraag
                    </Badge>
                  )
                }
              />
              <Card className="w-full max-w-3xl overflow-hidden lg:max-w-none">
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
                      <div className="border-t border-border/60 pt-4">
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
