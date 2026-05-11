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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@procertus-ui/ui";
import { CertificationInquiriesOverviewCard } from "../certification-inquiries-overview/CertificationInquiriesOverviewCard";
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


export type OnboardingSummaryStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingSummaryStep({ model }: OnboardingSummaryStepProps) {
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
    <div className="flex w-full min-w-0 flex-col gap-8">
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
          <CertificationInquiriesOverviewCard
            drafts={drafts}
            effectiveIncludedDraftIds={effectiveSummaryIncludedDraftIds}
            controlIdPrefix="onboarding-summary-draft"
            onDraftIncludedChange={(draftId, included) => {
              setFlowState((prev) => {
                const ids = prev.drafts.map((d) => d.id);
                const base = prev.summaryIncludedDraftIds ?? [...ids];
                const next = included
                  ? Array.from(new Set([...base, draftId]))
                  : base.filter((id) => id !== draftId);
                return { ...prev, summaryIncludedDraftIds: next };
              });
            }}
            onEditRequestsClick={() => goToOnboardingStep("request")}
          />
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
  );
}
