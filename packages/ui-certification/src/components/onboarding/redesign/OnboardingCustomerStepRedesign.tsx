/**
 * Redesign-variant van "Registratie / Customer" step (3.6):
 *
 * - "Bent u de wettelijke vertegenwoordiger?" (twee hero choice cards) wordt
 *   één checkbox: *"Ik vul namens iemand anders in"*. Default = uncheckt =
 *   indiener is de wettelijke vertegenwoordiger (meest voorkomende geval).
 * - Drievoudige titelstapel rond "Wettelijke vertegenwoordiger" wordt één
 *   sectiekop. Het indiener-blok krijgt een lichter sub-label (geen H4), de
 *   vertegenwoordiger-velden volgen direct onder de hoofdkop zonder eigen H4.
 *
 * Niet gebruikt in productie — leeft alleen in redesign-stories.
 */
import {
  Autocomplete,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  H4,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
  highlightMatch,
} from "@procertus-ui/ui";
import { PrototypeCard } from "@procertus-ui/ui-pt1-prototype";

import {
  findVatPrototypePreset,
  getRegistrantContextFieldsForPrototypePreset,
  VAT_PROTOTYPE_PRESETS,
} from "../../../onboarding/lib/vatPrototypePresets";
import {
  findKboCompanyByVatNumber,
  kboAutocomplete,
  type KboCompany,
} from "../../../onboarding/lib/kbo-autocomplete";
import {
  findKvkCompanyByVatNumber,
  kvkAutocomplete,
  type KvkCompany,
} from "../../../onboarding/lib/kvk-autocomplete";
import {
  customerContextAfterPrototypePresetChange,
  emptyIdentificatiePersonState,
  isLegalRepresentativeCaptureComplete,
  isRegistrantCaptureValidForContext,
  resolveFlowContext,
} from "../../../onboarding/onboarding-flow-helpers";
import { IdentificatiePersonTitleRoleCapture } from "../../../onboarding/identificatie-person-title-role-capture";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { personFormCardClassName } from "../../../onboarding/person-form-card-variants";

import { OptionalCheckboxSection } from "./primitives/OptionalCheckboxSection";

export type OnboardingCustomerStepRedesignProps = {
  model: OnboardingRegistrationLayoutModel;
};

export function OnboardingCustomerStepRedesign({ model }: OnboardingCustomerStepRedesignProps) {
  const {
    context,
    updateContext,
    patchContext,
    setFlowState,
    prototypeVatPresetId,
    vatPrototypePresetChoices,
    activeVatPreset,
    registrationIdOrigin,
    registrationIdFieldMeta,
    registrationIdentifierIssue,
    registrationIdentifierStructurallyValid,
    applicantLegalRepFieldBase,
    applicantLegalRepPersonFieldsLocked,
  } = model;

  const useKboLookup = registrationIdOrigin === "be";
  const useKvkLookup = registrationIdOrigin === "nl";
  const selectedKboCompany = useKboLookup
    ? findKboCompanyByVatNumber(context.vatNumber)
    : null;
  const selectedKvkCompany = useKvkLookup
    ? findKvkCompanyByVatNumber(context.vatNumber)
    : null;

  const applyRegisterCompany = (
    company: Pick<
      KboCompany,
      | "vatNumber"
      | "name"
      | "country"
      | "countryCode"
      | "street"
      | "houseNumber"
      | "postalCode"
      | "city"
    > | null,
  ) => {
    if (company) {
      patchContext({
        vatNumber: company.vatNumber,
        organizationName: company.name,
        country: company.country,
        addressCountryCode: company.countryCode,
        addressStreet: company.street,
        addressHouseNumber: company.houseNumber,
        addressPostalCode: company.postalCode,
        addressCity: company.city,
      });
    } else {
      patchContext({
        vatNumber: "",
        organizationName: "",
        country: "",
        addressCountryCode: "",
        addressStreet: "",
        addressHouseNumber: "",
        addressPostalCode: "",
        addressCity: "",
      });
    }
  };

  /**
   * Checkbox-semantiek: aangevinkt = "Ik vul namens iemand anders in", dus
   * `applicantIsLegalRepresentative === "no"`. Leeg of "yes" = uncheckt.
   */
  const filingOnBehalf = context.applicantIsLegalRepresentative === "no";

  function setFilingOnBehalf(on: boolean): void {
    if (on) {
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
    } else {
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
    }
  }

  return (
    <div className="space-y-6">
      <PrototypeCard
        collapsible
        title="Voorbeeldmodus"
        description={
          <>
            Kies een voorbeeld om het identificatieveld hieronder automatisch in te vullen en de
            flow te doorlopen. U kunt het nummer altijd zelf aanpassen.
          </>
        }
      >
        <Field>
          <FieldLabel htmlFor="prototype-vat-preset-redesign">
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
                id="prototype-vat-preset-redesign"
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

      <section className="space-y-3">
        <div className="space-y-1">
          <H4 className="normal-case tracking-tight text-foreground">Organisatie-identificatie</H4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Het formaat hangt af van uw eerder gekozen land of regio.
          </p>
        </div>
        <Field data-invalid={registrationIdentifierIssue ? true : undefined}>
          <FieldLabel htmlFor="customer-registration-identifier-redesign">
            {registrationIdFieldMeta.label}
          </FieldLabel>
          <FieldContent>
            {useKboLookup ? (
              <Autocomplete<KboCompany>
                id="customer-registration-identifier-redesign"
                className="min-w-0"
                value={selectedKboCompany}
                onChange={applyRegisterCompany}
                fetchSuggestions={kboAutocomplete}
                itemKey={(c) => c.vatNumber}
                itemLabel={(c) => `${c.name} (${c.vatNumber})`}
                renderItem={(c, q) => (
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-foreground">
                      {highlightMatch(c.name, q)}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {highlightMatch(c.vatNumber, q)} &middot; {highlightMatch(c.city, q)}
                    </span>
                  </span>
                )}
                resultsHeading={() => "Zoekresultaten"}
                emptyMessage={(q) => (
                  <>
                    Geen bedrijf gevonden voor &quot;
                    <span className="font-medium text-foreground">{q}</span>&quot;.
                  </>
                )}
                loadingMessage="KBO-register raadplegen…"
                placeholder="Zoek bedrijf op naam, btw of stad"
                clearAriaLabel="Wis bedrijfskeuze"
                state={
                  registrationIdentifierIssue != null
                    ? "invalid"
                    : selectedKboCompany != null
                      ? "valid"
                      : undefined
                }
                aria-invalid={registrationIdentifierIssue != null}
              />
            ) : useKvkLookup ? (
              <Autocomplete<KvkCompany>
                id="customer-registration-identifier-redesign"
                className="min-w-0"
                value={selectedKvkCompany}
                onChange={applyRegisterCompany}
                fetchSuggestions={kvkAutocomplete}
                itemKey={(c) => c.vatNumber}
                itemLabel={(c) => `${c.name} (KvK ${c.kvkNumber})`}
                renderItem={(c, q) => (
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-foreground">
                      {highlightMatch(c.name, q)}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      KvK {highlightMatch(c.kvkNumber, q)} &middot;{" "}
                      {highlightMatch(c.vatNumber, q)} &middot; {highlightMatch(c.city, q)}
                    </span>
                  </span>
                )}
                resultsHeading={() => "Zoekresultaten"}
                emptyMessage={(q) => (
                  <>
                    Geen bedrijf gevonden voor &quot;
                    <span className="font-medium text-foreground">{q}</span>&quot;.
                  </>
                )}
                loadingMessage="KvK-register raadplegen…"
                placeholder="Zoek bedrijf op naam, KvK, btw of stad"
                clearAriaLabel="Wis bedrijfskeuze"
                state={
                  registrationIdentifierIssue != null
                    ? "invalid"
                    : selectedKvkCompany != null
                      ? "valid"
                      : undefined
                }
                aria-invalid={registrationIdentifierIssue != null}
              />
            ) : (
              <Input
                id="customer-registration-identifier-redesign"
                className="min-w-0"
                value={context.vatNumber}
                placeholder={registrationIdFieldMeta.placeholder}
                onChange={(event) => updateContext("vatNumber", event.target.value)}
                autoComplete="off"
                spellCheck={false}
                state={
                  registrationIdentifierIssue != null
                    ? "invalid"
                    : registrationIdentifierStructurallyValid
                      ? "valid"
                      : undefined
                }
              />
            )}
            {registrationIdentifierIssue ? (
              <p className="text-left text-sm font-medium text-destructive" role="alert">
                {registrationIdentifierIssue}
              </p>
            ) : null}
            <FieldDescription>
              {useKboLookup
                ? "We vullen automatisch je bedrijfsnaam en zeteladres in."
                : useKvkLookup
                  ? "We vullen automatisch je bedrijfsnaam en vestigingsadres in."
                  : registrationIdFieldMeta.description}
            </FieldDescription>
          </FieldContent>
        </Field>
      </section>

      <section className="space-y-4" aria-labelledby="legal-rep-section-heading">
        <div className="space-y-1">
          <H4
            id="legal-rep-section-heading"
            className="normal-case tracking-tight text-foreground"
          >
            Wettelijke vertegenwoordiger
          </H4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            We registreren de persoon die uw organisatie wettelijk mag vertegenwoordigen en
            handtekenbevoegdheid heeft.
          </p>
        </div>

        <OptionalCheckboxSection
          checkboxId={`${applicantLegalRepFieldBase}-filing-on-behalf`}
          title="Ik vul namens iemand anders in"
          description="Vink aan als u zelf niet de wettelijke vertegenwoordiger bent. We vragen dan apart uw eigen contactgegevens als indiener."
          checked={filingOnBehalf}
          onCheckedChange={setFilingOnBehalf}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Uw gegevens als indiener</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Deze velden gaan over uzelf, degene die het formulier nu invult.
            </p>
          </div>
          <IdentificatiePersonTitleRoleCapture
            idPrefix="registrant-applicant-redesign"
            branch="registrant"
            context={context}
            patchContext={patchContext}
            emphasizeInvalidRequiredMarkers={!isRegistrantCaptureValidForContext(context)}
            copy={{ titleLabel: "Title", roleLabel: "Role" }}
          />
        </OptionalCheckboxSection>

        <fieldset
          disabled={applicantLegalRepPersonFieldsLocked}
          className={cn(
            personFormCardClassName("chromeless"),
            "min-w-0 space-y-4 border-0 p-0",
            applicantLegalRepPersonFieldsLocked && "opacity-55",
          )}
        >
          {filingOnBehalf ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Gegevens van de wettelijke vertegenwoordiger
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                De persoon die uw organisatie wettelijk mag vertegenwoordigen.
              </p>
            </div>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Dit adres gebruiken we voor uw account en berichten over uw aanvraag, tenzij u
              straks een ander contact opgeeft.
            </p>
          )}
          <IdentificatiePersonTitleRoleCapture
            idPrefix="legal-rep-redesign"
            branch="legalRepresentative"
            context={context}
            patchContext={patchContext}
            disabled={applicantLegalRepPersonFieldsLocked}
            emphasizeInvalidRequiredMarkers={
              context.applicantIsLegalRepresentative !== "" &&
              !isLegalRepresentativeCaptureComplete(context)
            }
            copy={{ titleLabel: "Title", roleLabel: "Role" }}
          />
        </fieldset>
      </section>
    </div>
  );
}
