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


export type OnboardingExtrasStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingExtrasStep({ model }: OnboardingExtrasStepProps) {
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
    <div className="space-y-6">
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
  );
}
