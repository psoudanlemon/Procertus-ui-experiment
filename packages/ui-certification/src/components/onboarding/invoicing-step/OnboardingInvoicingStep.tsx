/** Facturatiestap — eerst factuur‑e‑mail; overzicht certificatie‑entiteiten; optioneel andere facturatiedrukker per aanvraag. */
import {
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@procertus-ui/ui";
import { DraftCardDescription } from "../../../certification-request/draft-selection-presentation";
import { registrationIsoCodeFromDutchCountryLabel } from "../../../onboarding/lib/vatPrototypePresets";
import {
  certificationLegalEntityAssignmentRaw,
  emptyIdentificatiePersonState,
  formatPostalAddressDisplay,
  formatVestigingRegistryOptionLabel,
  invoicingAddressSubformValue,
  legalRepresentativePersonValue,
  legalEntityAssignmentDisplayParts,
  ONBOARDING_PERSON_NEW_ID,
  seedInvoicingInquiryMapFromCertification,
} from "../../../onboarding/onboarding-flow-helpers";
import { COUNTRY_SELECT_NONE } from "../../../onboarding/onboarding-constants";
import { SubformCompletionBadge } from "../../../onboarding/subform-completion-badge";
import {
  IdentificatieAddressSubform,
  IdentificatieOptionalBlock,
  IdentificatiePersonRegistrySummary,
  IdentificatiePersonSubform,
} from "../../../onboarding/identificatie-subforms";
import { IdentificatiePersonRegistryPicker } from "../../../onboarding/identificatie-person-registry-picker";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { OnboardingVestigingenLegalEntityManager } from "../legal-entity-step/OnboardingVestigingenLegalEntityManager";
import {
  OnboardingInquiryLegalEntityLinkCard,
  OnboardingLegalEntityLinkSummaryText,
} from "../shared/OnboardingInquiryLegalEntityLinkCard";

export type OnboardingInvoicingStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingInvoicingStep({ model }: OnboardingInvoicingStepProps) {
  const {
    context,
    updateContext,
    patchContext,
    draftsInRegistrationScope,
    countrySelectOptions,
    invoicingFieldBase,
    legalEntityFieldBase,
    invoicingCountryOptions,
    invoicingCountrySelectValue,
    invoicingEmailIssue,
    CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
    CERT_INQUIRY_VEST_UNASSIGNED,
  } = model;

  const invoicingMap = context.invoicingInquiryVestigingId;
  const mirror = context.invoicingMirrorCertificationLegalEntities;
  const overviewRows = draftsInRegistrationScope;

  const assignmentMapsBlockingDelete = mirror
    ? [context.certificationInquiryVestigingId]
    : [context.certificationInquiryVestigingId, context.invoicingInquiryVestigingId];

  function invoicingDraftSelectRadix(draftId: string): string {
    const raw = (invoicingMap[draftId] ?? "").trim();
    return raw === "" ? CERT_INQUIRY_VEST_UNASSIGNED : raw;
  }

  function setInvoicingDraftAssignment(draftId: string, value: string): void {
    const next =
      value.trim() ?
        { ...invoicingMap, [draftId]: value }
      : (() => {
          const clone = { ...invoicingMap };
          delete clone[draftId];
          return clone;
        })();
    patchContext({ invoicingInquiryVestigingId: next });
  }

  function applyInvoicingToAllVestigung(vestigingIdOrZetel: string): void {
    const base = vestigingIdOrZetel.trim();
    const next = { ...invoicingMap };
    for (const d of overviewRows) {
      if (base) next[d.id] = base;
      else delete next[d.id];
    }
    patchContext({ invoicingInquiryVestigingId: next });
  }

  function setAlternativeInvoicingPerInquiry(enabled: boolean): void {
    if (!enabled) {
      patchContext({
        invoicingMirrorCertificationLegalEntities: true,
        invoicingInquiryVestigingId: {},
      });
      return;
    }
    patchContext({
      invoicingMirrorCertificationLegalEntities: false,
      invoicingInquiryVestigingId: seedInvoicingInquiryMapFromCertification(
        context,
        overviewRows.map((d) => d.id),
      ),
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Factuur‑gegevens en rechts‑persoon op de factuur
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Begin met het verplichte factuur‑e‑mailadres. Daarna ziet u per aanvraag welke
          rechts‑persoon bij certificatie hoort. Schakel onderaan alleen in wanneer u voor
          facturatie per aanvraag iets anders wilt dan bij certificatie.
        </p>
      </div>

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
          {invoicingEmailIssue ?
            <p
              id={`${invoicingFieldBase}-email-error`}
              className="text-left text-sm font-medium text-destructive"
              role="alert"
            >
              {invoicingEmailIssue}
            </p>
          : null}
          <FieldDescription id={`${invoicingFieldBase}-email-hint`}>
            Dit adres ontvangt facturen en herinneringen — vul dit als eerste in.
          </FieldDescription>
        </FieldContent>
      </Field>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Maatschappelijke zetel (referentie)</CardTitle>
          <CardDescription>Naam en adres van uw hoofdkantoor zoals eerder vastgelegd.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-medium text-foreground">{context.organizationName.trim() || "—"}</p>
          <p className="text-muted-foreground">{formatPostalAddressDisplay(context)}</p>
          {context.country.trim() ?
            <p className="text-muted-foreground">{context.country.trim()}</p>
          : null}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold tracking-tight text-foreground">
          Certificatie-aanvragen in dit dossier
        </h4>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Per aanvraag de rechts‑persoon die u in de stap <span className="font-medium text-foreground">Certificatie (entiteit)</span>{" "}
          gekoppeld heeft. Zolang u hieronder geen afwijkende facturatie inschakelt, gebruiken we
          deze ook op de factuur.
        </p>
      </div>

      {overviewRows.length === 0 ?
        <p className="rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          Geen gekozen aanvragen in dit dossier.
        </p>
      : <ul className="space-y-2">
          {overviewRows.map((draft) => {
            const certRaw = certificationLegalEntityAssignmentRaw(context, draft.id);
            const parts = legalEntityAssignmentDisplayParts(context, certRaw);
            return (
              <OnboardingInquiryLegalEntityLinkCard
                key={draft.id}
                leftColumnLabel="Certificatie / product"
                rightColumnLabel="Rechts‑persoon bij certificatie"
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
                  <OnboardingLegalEntityLinkSummaryText
                    primary={parts.primary}
                    secondary={parts.secondary}
                  />
                }
              />
            );
          })}
        </ul>
      }

      <IdentificatieOptionalBlock
        switchId={`${invoicingFieldBase}-alt-invoice-per-inquiry`}
        title="Afwijkende facturatiedrukker per certificatie-aanvraag"
        description="Standaard komt op elke factuur dezelfde rechts‑persoon als hierboven bij certificatie. Schakel dit in als u óók andere vestigingen wilt beheren én per aanvraag een andere rechts‑persoon op de factuur wilt zetten."
        checked={!mirror}
        onCheckedChange={setAlternativeInvoicingPerInquiry}
      >
        <div className="space-y-8 pt-2">
          <OnboardingVestigingenLegalEntityManager
            fieldBaseId={`${legalEntityFieldBase}-inv-vest`}
            context={context}
            patchContext={patchContext}
            countrySelectOptions={countrySelectOptions}
            vestigingBlockAssignmentMaps={assignmentMapsBlockingDelete}
            heading={
              <div className="space-y-1 pb-6">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Vestigingen en juridische entiteiten voor facturatie
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Voeg desgewenst entiteiten toe en wijs hieronder toe welke op welke factuur komt —
                  gelijk aan de werking bij certificatie (Add / Save).
                </p>
              </div>
            }
          />

          {overviewRows.length === 0 ? null : (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-tight text-foreground">
                Factuur rechts‑persoon per aanvraag
              </h4>
              <ul className="space-y-2">
                {overviewRows.map((draft) => (
                  <OnboardingInquiryLegalEntityLinkCard
                    key={`inv-${draft.id}`}
                    leftColumnLabel="Certificatie / product"
                    rightColumnLabel="Rechts‑persoon op factuur"
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
                        value={invoicingDraftSelectRadix(draft.id)}
                        onValueChange={(v: string) => {
                          if (v === CERT_INQUIRY_VEST_UNASSIGNED) {
                            setInvoicingDraftAssignment(draft.id, "");
                          } else {
                            setInvoicingDraftAssignment(draft.id, v);
                          }
                        }}
                      >
                        <SelectTrigger
                          size="sm"
                          className="h-auto min-h-9 w-full max-w-lg py-2"
                        >
                          <SelectValue placeholder="Kies rechts‑persoon voor factuur" />
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
                ))}
              </ul>

              {overviewRows.length > 0 ?
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Snel invoeren voor alle aanvragen
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      patchContext({
                        invoicingInquiryVestigingId: seedInvoicingInquiryMapFromCertification(
                          context,
                          overviewRows.map((d) => d.id),
                        ),
                      })
                    }
                  >
                    Alle aanvragen · zoals bij certificatie
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyInvoicingToAllVestigung(CERT_INQUIRY_LEGAL_ENTITY_ZETEL)}
                  >
                    Alle aanvragen · maatschappelijke zetel
                  </Button>
                  {context.onboardingVestigingen.map((vx) => (
                    <Button
                      key={`bulk-${vx.id}`}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="max-w-xs truncate"
                      title={formatVestigingRegistryOptionLabel(vx)}
                      onClick={() => applyInvoicingToAllVestigung(vx.id)}
                    >
                      Alle aanvragen · {vx.legalName.trim() || "Vestiging"}
                    </Button>
                  ))}
                </div>
              : null}
            </div>
          )}
        </div>
      </IdentificatieOptionalBlock>

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
            const iso = registrationIsoCodeFromDutchCountryLabel(v.country.trim()) || "";
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
            <span className="font-medium text-foreground">wettelijke vertegenwoordiger</span>. Schakel
            hieronder alleen in wanneer iemand anders uw aanspreekpunt voor facturatie en financiële
            opvolging moet zijn.
          </p>
        </div>
        {!context.invoicingUseContactPerson ?
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Wettelijke vertegenwoordiger — factuurcontact
            </p>
            <IdentificatiePersonRegistrySummary person={legalRepresentativePersonValue(context)} />
          </div>
        : null}
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
          context.invoicingUseContactPerson ?
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
          : null
        }
      >
        {context.invoicingContactPersonRegistryId === ONBOARDING_PERSON_NEW_ID ?
          <IdentificatiePersonSubform
            idPrefix="invoicing-person"
            value={context.invoicingContactPerson}
            onChange={(v) => patchContext({ invoicingContactPerson: v })}
          />
        : <IdentificatiePersonRegistrySummary person={context.invoicingContactPerson} />}
      </IdentificatieOptionalBlock>
    </div>
  );
}
