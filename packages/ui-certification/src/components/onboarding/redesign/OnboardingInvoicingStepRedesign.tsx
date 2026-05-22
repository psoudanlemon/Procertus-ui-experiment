/**
 * Redesign-variant van "Facturatie" step (3.9 — incl. samenvoeging met
 * voormalige "Extra contacten" stap):
 *
 * - Switches die een sectie open/dicht klappen worden checkboxes
 *   ({@link OptionalCheckboxSection}). Het zijn keuzes ("ik wil extra info
 *   opgeven"), geen systeeminstellingen.
 * - Blokken "Certificatie-aanvragen in dit dossier" en "Factuur rechtspersoon
 *   per aanvraag" worden volledig verwijderd. De koppeling product → zetel zit
 *   nu in de Company-step (3.7) en wordt niet meer per factuur herhaald.
 * - Cert/inspectie-contact (uit voormalige stap "Extra contacten") wordt
 *   inline toegevoegd op deze stap als één extra checkbox-sectie.
 * - Reserve contactpersoon staat *binnen* het primaire cert-contactblok en
 *   wordt toegevoegd met een inline "+ Reservecontact toevoegen"-actie — geen
 *   aparte checkbox/switch meer (multi-instance entry pattern).
 *
 * Niet gebruikt in productie — leeft alleen in redesign-stories.
 */
import { Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
  H4,
  Input,
} from "@procertus-ui/ui";

import {
  certificationSecondaryContactDisabledHint,
  emphasizeInvalidMarkersCertificationPrimaryPerson,
  emphasizeInvalidMarkersCertificationSecondaryPerson,
  emphasizeInvalidMarkersInvoicingContactPerson,
  emptyIdentificatiePersonState,
  formatPostalAddressDisplay,
  invoicingAddressSubformValue,
  legalRepresentativePersonValue,
  ONBOARDING_PERSON_NEW_ID,
} from "../../../onboarding/onboarding-flow-helpers";
import { registrationIsoCodeFromDutchCountryLabel } from "../../../onboarding/lib/vatPrototypePresets";
import { COUNTRY_SELECT_NONE } from "../../../onboarding/onboarding-constants";
import {
  IdentificatieAddressSubform,
  IdentificatiePersonRegistrySummary,
  IdentificatiePersonSubform,
  RequiredFieldSuffix,
} from "../../../onboarding/identificatie-subforms";
import { IdentificatiePersonTitleRoleCapture } from "../../../onboarding/identificatie-person-title-role-capture";
import { IdentificatiePersonRegistryPicker } from "../../../onboarding/identificatie-person-registry-picker";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

import { OptionalCheckboxSection } from "./primitives/OptionalCheckboxSection";

export type OnboardingInvoicingStepRedesignProps = {
  model: OnboardingRegistrationLayoutModel;
};

export function OnboardingInvoicingStepRedesign({
  model,
}: OnboardingInvoicingStepRedesignProps) {
  const {
    context,
    updateContext,
    patchContext,
    invoicingFieldBase,
    invoicingCountryOptions,
    invoicingCountrySelectValue,
    invoicingEmailIssue,
    canAddCertificationSecondary,
  } = model;

  return (
    <div className="space-y-6">
      <section className="space-y-3" aria-labelledby="invoicing-email-heading">
        <div className="space-y-1">
          <H4
            id="invoicing-email-heading"
            className="normal-case tracking-tight text-foreground"
          >
            Facturatie
          </H4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Standaard sturen we facturen naar het hieronder opgegeven adres. De rechtspersoon op
            de factuur volgt de koppeling die u in de zetel-stap hebt gemaakt.
          </p>
        </div>
        <Field data-invalid={invoicingEmailIssue ? true : undefined}>
          <FieldLabel htmlFor={`${invoicingFieldBase}-email-redesign`}>
            E-mail voor facturatie{" "}
            <RequiredFieldSuffix erroneous={invoicingEmailIssue != null} />
          </FieldLabel>
          <FieldContent className="w-full min-w-0">
            <Input
              id={`${invoicingFieldBase}-email-redesign`}
              type="email"
              className="w-full min-w-0"
              value={context.invoicingEmail}
              onChange={(e) => updateContext("invoicingEmail", e.target.value)}
              autoComplete="email"
              aria-required
              state={
                invoicingEmailIssue != null
                  ? "invalid"
                  : context.invoicingEmail.trim().length > 0
                    ? "valid"
                    : undefined
              }
            />
            {invoicingEmailIssue ? (
              <p className="text-left text-sm font-medium text-destructive" role="alert">
                {invoicingEmailIssue}
              </p>
            ) : null}
            <FieldDescription>
              Dit adres ontvangt facturen en herinneringen.
            </FieldDescription>
          </FieldContent>
        </Field>
      </section>

      <Card variant="outlined">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Standaardadres (referentie)</CardTitle>
          <CardDescription className="text-xs">
            Maatschappelijke zetel zoals eerder vastgelegd.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-xs">
          <p className="font-medium text-foreground">
            {context.organizationName.trim() || "—"}
          </p>
          <p className="text-muted-foreground">{formatPostalAddressDisplay(context)}</p>
          {context.country.trim() ? (
            <p className="text-muted-foreground">{context.country.trim()}</p>
          ) : null}
        </CardContent>
      </Card>

      <OptionalCheckboxSection
        checkboxId={`${invoicingFieldBase}-alt-address-redesign`}
        title="Afwijkend facturatieadres"
        description="Postadres op de factuur dat afwijkt van het adres van de zetel (bv. postbus of afdeling)."
        checked={context.addInvoicingAddressOverride}
        onCheckedChange={(on) => patchContext({ addInvoicingAddressOverride: on })}
      >
        <IdentificatieAddressSubform
          idPrefix="invoicing-address-redesign"
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
      </OptionalCheckboxSection>

      <OptionalCheckboxSection
        checkboxId={`${invoicingFieldBase}-alt-person-redesign`}
        title="Andere contactpersoon voor facturatie"
        description="Standaard de wettelijke vertegenwoordiger. Schakel in voor een andere contactpersoon."
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
              id={`${invoicingFieldBase}-inv-registry-redesign`}
              label="Persoon kiezen"
              hint="Kies iemand die je al in deze flow opgegeven hebt, of maak een nieuwe persoon aan."
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
                if (!row) return;
                patchContext({
                  invoicingContactPersonRegistryId: rid,
                  invoicingContactPerson: { ...row.person },
                });
              }}
            />
          ) : null
        }
      >
        {!context.invoicingUseContactPerson ? (
          <IdentificatiePersonRegistrySummary person={legalRepresentativePersonValue(context)} />
        ) : context.invoicingContactPersonRegistryId === ONBOARDING_PERSON_NEW_ID ? (
          <IdentificatiePersonSubform
            idPrefix="invoicing-person-redesign"
            value={context.invoicingContactPerson}
            onChange={(v) => patchContext({ invoicingContactPerson: v })}
            emphasizeInvalidRequiredMarkers={emphasizeInvalidMarkersInvoicingContactPerson(
              context,
            )}
          />
        ) : (
          <IdentificatiePersonRegistrySummary person={context.invoicingContactPerson} />
        )}
      </OptionalCheckboxSection>

      {/* Inline merge: cert/inspectie-contact uit voormalige Extras-stap */}
      <section className="space-y-3 pt-2" aria-labelledby="cert-contact-heading">
        <div className="space-y-1">
          <H4
            id="cert-contact-heading"
            className="normal-case tracking-tight text-foreground"
          >
            Contact voor certificatie en inspectie
          </H4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Optioneel: een eigen aanspreekpunt voor alles rond certificatie en inspectie.
          </p>
        </div>
        <OptionalCheckboxSection
          checkboxId="cert-primary-redesign"
          title="Aparte contactpersoon voor certificatie en inspectie"
          description="Los van facturatie. Kies een bestaande persoon of voer een nieuwe in."
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
                id={`${invoicingFieldBase}-cert-primary-registry-redesign`}
                label="Persoon kiezen"
                hint="Kies bestaand of nieuw."
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
                  if (!row) return;
                  const p = row.person;
                  const certAanhef = p.title?.trim() ?? "";
                  patchContext({
                    certificationContactPersonRegistryId: rid,
                    certificationContact: { ...p },
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
          <IdentificatiePersonTitleRoleCapture
            registryPersonSelected={
              context.certificationContactPersonRegistryId !== ONBOARDING_PERSON_NEW_ID
            }
            idPrefix="cert-primary-redesign"
            branch="certificationContact"
            context={context}
            patchContext={patchContext}
            emphasizeInvalidRequiredMarkers={emphasizeInvalidMarkersCertificationPrimaryPerson(
              context,
            )}
            copy={{ titleLabel: "Title", roleLabel: "Role" }}
          />

          {/* Multi-instance entry: reserve contact inline, niet meer achter eigen switch */}
          {context.addCertificationSecondaryContact && canAddCertificationSecondary ? (
            <div className="space-y-3 rounded-md border border-dashed border-border bg-muted/20 p-3">
              <div className="flex items-start justify-between gap-component">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">
                    Reservecontact (optioneel)
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Extra geadresseerde naast het hoofdcontact hierboven.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    patchContext({
                      addCertificationSecondaryContact: false,
                      certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                    })
                  }
                  aria-label="Reservecontact verwijderen"
                >
                  <HugeiconsIcon icon={Cancel01Icon} aria-hidden className="size-4" />
                  <span className="sr-only sm:not-sr-only sm:ms-1">Verwijderen</span>
                </Button>
              </div>
              <IdentificatiePersonTitleRoleCapture
                registryPersonSelected={
                  context.certificationSecondaryPersonRegistryId !== ONBOARDING_PERSON_NEW_ID
                }
                idPrefix="cert-secondary-redesign"
                branch="certificationSecondary"
                context={context}
                patchContext={patchContext}
                emphasizeInvalidRequiredMarkers={emphasizeInvalidMarkersCertificationSecondaryPerson(
                  context,
                )}
                copy={{ titleLabel: "Title", roleLabel: "Role" }}
              />
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canAddCertificationSecondary}
              onClick={() =>
                patchContext({
                  addCertificationSecondaryContact: true,
                  certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                  certificationSecondary: emptyIdentificatiePersonState(),
                  certificationSecondaryTitlePreset: "none",
                  certificationSecondaryTitle: "",
                  certificationSecondaryRolePreset: "none",
                  certificationSecondaryRole: "",
                })
              }
              className="w-fit"
            >
              <HugeiconsIcon icon={PlusSignIcon} aria-hidden className="size-4" />
              <span className="ms-1">Reservecontact toevoegen</span>
            </Button>
          )}
          {!canAddCertificationSecondary ? (
            <p className="text-xs text-muted-foreground">
              {certificationSecondaryContactDisabledHint(context)}
            </p>
          ) : null}
        </OptionalCheckboxSection>
      </section>
    </div>
  );
}
