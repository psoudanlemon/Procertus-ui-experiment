/**
 * Step "Identificatie van de wettelijke vertegenwoordiger" (3.6, voorheen "Registratie").
 *
 * Patroon: bevoegde persoon eerst.
 * - De paginakop framet de stap als het identificeren van de wettelijke vertegenwoordiger.
 *   Daaronder direct het invulformulier voor die persoon (bindt altijd aan
 *   `legalRepresentative`).
 * - Aan het eind van het formulier een Checkbox (standaard aangevinkt):
 *   *"Ik (de aanvrager) ben de wettelijke vertegenwoordiger van dit bedrijf."*
 *   met een HoverCard-info-icoon dat het belang ervan uitlegt.
 * - Vinkt de gebruiker hem uit, dan verschijnt een tweede sectie *Uw eigen
 *   contactgegevens* zodat we de indiener apart kunnen registreren
 *   (bindt aan `registrant`).
 *
 * Datamodel: elk slot heeft zijn eigen formulier, dus geen veld-migratie nodig.
 * De lege state (`""`) wordt behandeld als "aangevinkt" (`"yes"`); uitvinken zet
 * expliciet `"no"`. Wanneer de gebruiker in de functie-dropdown een rol kiest die
 * geen handtekenbevoegdheid impliceert, wordt de checkbox automatisch uitgevinkt.
 */
import {
  Checkbox,
  Collapsible,
  CollapsibleContent,
  Field,
  FieldContent,
  FieldLabel,
  H3,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@procertus-ui/ui";
import { PrototypeCard } from "@procertus-ui/ui-pt1-prototype";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { useEffect } from "react";

import {
  findVatPrototypePreset,
  VAT_PROTOTYPE_PRESETS,
} from "../../../onboarding/lib/vatPrototypePresets";
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

export type OnboardingCustomerStepProps = {
  model: OnboardingRegistrationLayoutModel;
};

export function OnboardingCustomerStep({ model }: OnboardingCustomerStepProps) {
  const {
    context,
    patchContext,
    setFlowState,
    prototypeVatPresetId,
    vatPrototypePresetChoices,
    applicantLegalRepFieldBase,
  } = model;

  const choice = context.applicantIsLegalRepresentative; // "" | "yes" | "no"
  // Default-checked semantics: lege state ("") wordt behandeld als "ja, ik ben de rep".
  // Uitvinken zet expliciet "no".
  const filingOnBehalf = choice === "no";
  const applicantIsRepChecked = !filingOnBehalf;

  /**
   * Wisselen van antwoord raakt de typed-in legal-rep gegevens niet aan: die staan in
   * hun eigen slot. Wel maken we het registrant-slot leeg wanneer iemand terug naar
   * "Ja" gaat, zodat we geen verweesde indiener-data behouden.
   */
  function setLegalRepChoice(next: "yes" | "no"): void {
    setFlowState((prev) => {
      const c = prev.context;
      if (next === c.applicantIsLegalRepresentative) return prev;

      if (next === "yes") {
        return {
          ...prev,
          context: resolveFlowContext({
            ...c,
            applicantIsLegalRepresentative: "yes",
            registrantPerson: emptyIdentificatiePersonState(),
            registrantTitlePreset: "none",
            registrantTitle: "",
            registrantRolePreset: "none",
            registrantRole: "",
          }),
        };
      }
      return {
        ...prev,
        context: resolveFlowContext({
          ...c,
          applicantIsLegalRepresentative: "no",
        }),
      };
    });
  }

  /**
   * Auto-uncheck: zodra de functie van de legal rep een definitieve niet-bevoegde rol is
   * (alles behalve zaakvoerder/bestuurder of wettelijk vertegenwoordiger, en niet de
   * neutrale "none"/"" placeholder), zet de checkbox uit. De gebruiker kan hem daarna
   * weer handmatig aanvinken als de rol toch handtekenbevoegdheid heeft.
   */
  const rolePreset = context.representativeRolePreset;
  useEffect(() => {
    const isRepImplying =
      rolePreset === "managing_director" || rolePreset === "legal_representative";
    const isNeutral = rolePreset === "" || rolePreset === "none";
    if (!isRepImplying && !isNeutral && applicantIsRepChecked) {
      setLegalRepChoice("no");
    }
    // setLegalRepChoice closes over `setFlowState` (stable), dus geen dep nodig.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolePreset, applicantIsRepChecked]);

  return (
    <div className="space-y-region">
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

      <section className="space-y-4">
        <fieldset
          className={cn(personFormCardClassName("chromeless"), "min-w-0 space-y-4 border-0 p-0")}
        >
          <IdentificatiePersonTitleRoleCapture
            idPrefix="legal-rep"
            branch="legalRepresentative"
            context={context}
            patchContext={patchContext}
            emphasizeInvalidRequiredMarkers={!isLegalRepresentativeCaptureComplete(context)}
            copy={{ titleLabel: "Aanhef", roleLabel: "Functie" }}
            layout="twoColumn"
          />
        </fieldset>

        <HoverCard openDelay={500} closeDelay={150}>
          <HoverCardTrigger asChild>
            <div className="flex items-start gap-3">
              <Checkbox
                id={`${applicantLegalRepFieldBase}-applicant-is-rep`}
                checked={applicantIsRepChecked}
                onCheckedChange={(v) => setLegalRepChoice(v === true ? "yes" : "no")}
                className="mt-0.5 shrink-0"
                aria-labelledby={`${applicantLegalRepFieldBase}-applicant-is-rep-label`}
                aria-describedby={`${applicantLegalRepFieldBase}-applicant-is-rep-info`}
              />
              <label
                htmlFor={`${applicantLegalRepFieldBase}-applicant-is-rep`}
                className="min-w-0 flex-1 cursor-pointer text-sm leading-snug font-medium text-foreground"
              >
                <span id={`${applicantLegalRepFieldBase}-applicant-is-rep-label`}>
                  Ik (de aanvrager) ben de wettelijke vertegenwoordiger van dit bedrijf.
                </span>{" "}
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  className="inline size-4 -translate-y-px align-middle text-info-foreground"
                  aria-hidden
                />
              </label>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            id={`${applicantLegalRepFieldBase}-applicant-is-rep-info`}
            className="w-96 space-y-2 text-xs leading-relaxed"
          >
            <p className="text-sm font-medium text-foreground">Waarom dit van belang is</p>
            <p className="text-muted-foreground">
              De wettelijke vertegenwoordiger is de persoon met handtekenbevoegdheid voor uw
              organisatie. Alleen deze persoon kan deze aanvraag rechtsgeldig indienen.
            </p>
            <p className="text-muted-foreground">
              Vul de juiste persoon in om vertragingen in de behandeling van uw dossier te
              vermijden. Vink uit als u namens iemand anders invult.
            </p>
          </HoverCardContent>
        </HoverCard>
      </section>

      <Collapsible open={filingOnBehalf}>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <section className="space-y-4" aria-labelledby="registrant-section-heading">
            <div className="space-y-1">
              <H3 id="registrant-section-heading">Uw eigen contactgegevens</H3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Deze velden gaan over uzelf, degene die deze aanvraag invult. We gebruiken
                ze voor uw account en voor communicatie over de aanvraag.
              </p>
            </div>
            <IdentificatiePersonTitleRoleCapture
              idPrefix="registrant-applicant"
              branch="registrant"
              context={context}
              patchContext={patchContext}
              emphasizeInvalidRequiredMarkers={!isRegistrantCaptureValidForContext(context)}
              copy={{ titleLabel: "Aanhef", roleLabel: "Functie" }}
              layout="twoColumn"
            />
          </section>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
