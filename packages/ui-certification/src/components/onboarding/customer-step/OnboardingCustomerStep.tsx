import {
  Autocomplete,
  ChoiceCard,
  ChoiceCardGroup,
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

export type OnboardingCustomerStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingCustomerStep({ model }: OnboardingCustomerStepProps) {
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

  // Voor BE/NL bevraagt de Autocomplete het KBO- respectievelijk KvK-mock-
  // register en vult bedrijfsnaam + zeteladres bij selectie. Voor andere
  // origins blijft de plain Input + structurele validatie het juiste pattern;
  // die registers zijn ofwel niet publiek doorzoekbaar ofwel pay-walled, dus
  // een autocomplete-belofte daar zou misleidend zijn.
  const useKboLookup = registrationIdOrigin === "be";
  const useKvkLookup = registrationIdOrigin === "nl";
  const selectedKboCompany = useKboLookup
    ? findKboCompanyByVatNumber(context.vatNumber)
    : null;
  const selectedKvkCompany = useKvkLookup
    ? findKvkCompanyByVatNumber(context.vatNumber)
    : null;

  const applyRegisterCompany = (
    company:
      | Pick<
          KboCompany,
          | "vatNumber"
          | "name"
          | "country"
          | "countryCode"
          | "street"
          | "houseNumber"
          | "postalCode"
          | "city"
        >
      | null,
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
          <H4 className="normal-case tracking-tight text-foreground">
            Organisatie-identificatie
          </H4>
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
            {useKboLookup ? (
              <Autocomplete<KboCompany>
                id="customer-registration-identifier"
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
                id="customer-registration-identifier"
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
                id="customer-registration-identifier"
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
                aria-describedby={
                  registrationIdentifierIssue
                    ? "customer-registration-identifier-error customer-registration-identifier-hint"
                    : "customer-registration-identifier-hint"
                }
              />
            )}
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
              {useKboLookup
                ? "Zoek je bedrijf in het KBO-register. We vullen automatisch je bedrijfsnaam en zeteladres in."
                : useKvkLookup
                  ? "Zoek je bedrijf in het KvK-register. We vullen automatisch je bedrijfsnaam en vestigingsadres in."
                  : registrationIdFieldMeta.description}
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
      <div className="space-y-1">
        <H4 className="normal-case tracking-tight text-foreground">
          Wettelijke vertegenwoordiger
        </H4>
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
          <div className="min-w-0 space-y-1">
            <H4
              id={`${applicantLegalRepFieldBase}-registrant-heading`}
              className="normal-case tracking-tight text-foreground"
            >
              Uw gegevens als indiener
            </H4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Deze velden gaan over uzelf — degene die het formulier nu invult. Daarna vult u de
              wettelijke vertegenwoordiger in.
            </p>
          </div>
          <IdentificatiePersonTitleRoleCapture
            idPrefix="registrant-applicant"
            branch="registrant"
            context={context}
            patchContext={patchContext}
            emphasizeInvalidRequiredMarkers={!isRegistrantCaptureValidForContext(context)}
            copy={{
              titleLabel: "Title",
              roleLabel: "Role",
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
          <div className="min-w-0 space-y-1">
            <H4
              id={`${applicantLegalRepFieldBase}-legal-rep-heading`}
              className="normal-case tracking-tight text-foreground"
            >
              Gegevens wettelijke vertegenwoordiger
            </H4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {context.applicantIsLegalRepresentative === "no"
                ? "Vul hier de persoon in die uw organisatie wettelijk mag vertegenwoordigen en de registratie mag ondertekenen."
                : context.applicantIsLegalRepresentative === "yes"
                  ? "Dit adres gebruiken we voor uw account en berichten over uw aanvraag, tenzij u straks een ander contact opgeeft."
                  : "Kies hierboven of u de wettelijke vertegenwoordiger bent; vul daarna deze gegevens in."}
            </p>
          </div>
          <IdentificatiePersonTitleRoleCapture
            idPrefix="legal-rep"
            branch="legalRepresentative"
            context={context}
            patchContext={patchContext}
            disabled={applicantLegalRepPersonFieldsLocked}
            emphasizeInvalidRequiredMarkers={
              context.applicantIsLegalRepresentative !== "" &&
              !isLegalRepresentativeCaptureComplete(context)
            }
            copy={{
              titleLabel: "Title",
              roleLabel: "Role",
            }}
          />
        </fieldset>
      </section>
    </div>
  );
}
