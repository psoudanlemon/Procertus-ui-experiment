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
  ChoiceCard,
  ChoiceCardGroup,
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

export type OnboardingCustomerStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingCustomerStep({ model }: OnboardingCustomerStepProps) {
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
  } = model;

  return (
    <div className="space-y-6">
      <PrototypeCard
        title="Voorbeeldmodus"
        description={
          <>
            Kies een voorbeeld om het identificatieveld hieronder automatisch in te vullen en de
            flow te doorlopen. U kunt het nummer altijd zelf aanpassen. Bij een andere keuze worden
            naam, aanhef, functie en e-mail bijgewerkt en worden bedrijfsgegevens leeggemaakt tot de
            opzoeking klaar is.
          </>
        }
        notice={
          activeVatPreset?.demoSupplementsOrgAddressFromEmailDomain ? (
            <>
              <span className="font-medium text-foreground">Let op bij dit voorbeeld:</span> uw
              nummer levert hier geen bedrijfsnaam en volledig adres op. Waar mogelijk vullen we die
              aan op basis van uw professionele e-mailadres. Controleer de velden. Gebruikt u een
              gratis of algemeen e-mailadres, vult u naam en adres zelf in.
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
            Het formaat hangt af van uw eerder gekozen land of regio. Zodra het nummer klopt, kunt u
            verder naar bedrijfsgegevens.
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
          We registreren de persoon die uw organisatie wettelijk mag vertegenwoordigen. Het is deze
          persoon die handtekenbevoegdheid heeft.
        </p>
      </div>
      <ChoiceCardGroup
        className="p-0"
        layout="grid"
        legend="Bent u de wettelijke vertegenwoordiger?"
        hint="Maak eerst deze keuze; daarna verschijnen de juiste invoervelden voor uzelf en/of de vertegenwoordiger."
        name={`${applicantLegalRepFieldBase}-legal-rep`}
        value={
          context.applicantIsLegalRepresentative === ""
            ? undefined
            : context.applicantIsLegalRepresentative
        }
        onValueChange={(v: string) => {
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
        <ChoiceCard
          value="yes"
          controlId={`${applicantLegalRepFieldBase}-yes`}
          title="Ja, ik ben de wettelijke vertegenwoordiger"
          description="U vult hierna uw eigen bereikbaarheid in als vertegenwoordiger; die gegevens gebruiken we ook voor uw account."
          variant="elevated"
          appearance="hero"
          className="h-full min-h-[8rem]"
        />
        <ChoiceCard
          value="no"
          controlId={`${applicantLegalRepFieldBase}-no`}
          title="Nee, ik vul namens de wettelijke vertegenwoordiger in"
          description="U geeft eerst uzelf door als indiener, daarna de persoon met wettelijke vertegenwoordigingsbevoegdheid."
          variant="default"
          appearance="hero"
          className="h-full min-h-[8rem]"
        />
      </ChoiceCardGroup>
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
                Deze velden gaan over uzelf — degene die het formulier nu invult. Daarna vult u de
                wettelijke vertegenwoordiger in.
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
  );
}
