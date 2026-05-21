/**
 * Gedeeld beheer van vestigingen (Add/Save‑composer + lijst) voor certificatie‑ en facturatiestappen.
 * Land van vestigingen volgt de maatschappelijke zetel.
 */
import { useEffect, useState } from "react";
import {
  Button,
  Field,
  FieldContent,
  FieldLabel,
  Input,
} from "@procertus-ui/ui";
import type { CustomerContext } from "../../../onboarding/onboarding-types";
import type { OnboardingVestiging } from "../../../onboarding/onboarding-types";
import { registrationIsoCodeFromDutchCountryLabel } from "../../../onboarding/lib/vatPrototypePresets";
import {
  emptyOnboardingVestiging,
  formatVestigingRegistryOptionLabel,
  vestigingAddressSubformValue,
} from "../../../onboarding/onboarding-flow-helpers";
import { COUNTRY_SELECT_NONE } from "../../../onboarding/onboarding-constants";
import { IdentificatieAddressSubform } from "../../../onboarding/identificatie-subforms";
import { personFormCardClassName } from "../../../onboarding/person-form-card-variants";

type ComposerState =
  | { mode: "new"; draft: OnboardingVestiging }
  | { mode: "edit"; draft: OnboardingVestiging };

export type OnboardingVestigingenLegalEntityManagerProps = {
  /** Stabiele basis voor formulier‑ids (`useId()` of string uit layoutmodel). */
  fieldBaseId: string;
  context: Pick<
    CustomerContext,
    "onboardingVestigingen" | "country" | "addressCountryCode"
  >;
  patchContext: (patch: Partial<CustomerContext>) => void;
  countrySelectOptions: readonly string[];
  /**
   * Voor elk record: ontbrekende toewijzing telt niet; waarde gelijk aan een vestigings‑id blokkeert
   * verwijderen als die nog ergens gekoppeld is (certificatie, factuur, …).
   */
  vestigingBlockAssignmentMaps: readonly Readonly<Record<string, string>>[];
  heading?: React.ReactNode;
};

function vestigingIdAssignments(maps: readonly Readonly<Record<string, string>>[]): Set<string> {
  const s = new Set<string>();
  for (const map of maps) {
    for (const v of Object.values(map)) {
      const id = typeof v === "string" ? v.trim() : "";
      if (!id || id.includes("__")) continue;
      s.add(id);
    }
  }
  return s;
}

export function OnboardingVestigingenLegalEntityManager({
  fieldBaseId,
  context,
  patchContext,
  countrySelectOptions,
  vestigingBlockAssignmentMaps,
  heading,
}: OnboardingVestigingenLegalEntityManagerProps) {
  const blockedVestigingIds = vestigingIdAssignments(vestigingBlockAssignmentMaps);

  const zetelCountryLabel = context.country.trim();
  const zetelCountryCode = context.addressCountryCode.trim();

  function zetelCountryFieldsForVestiging(): Pick<
    OnboardingVestiging,
    "country" | "addressCountryCode"
  > {
    const code =
      zetelCountryCode ||
      (zetelCountryLabel ? registrationIsoCodeFromDutchCountryLabel(zetelCountryLabel) || "" : "");
    return { country: zetelCountryLabel, addressCountryCode: code };
  }

  const [legalEntityComposer, setLegalEntityComposer] = useState<ComposerState>(() => ({
    mode: "new",
    draft:
      context.country.trim() ?
        {
          ...emptyOnboardingVestiging(),
          ...zetelCountryFieldsForVestiging(),
        }
      : emptyOnboardingVestiging(),
  }));

  useEffect(() => {
    if (!zetelCountryLabel) return;
    const target = zetelCountryFieldsForVestiging();
    const nextList = context.onboardingVestigingen.map((v) =>
      v.country.trim() === target.country.trim() &&
      v.addressCountryCode.trim() === target.addressCountryCode.trim()
        ? v
        : { ...v, ...target },
    );
    const listChanged = nextList.some((v, i) => v !== context.onboardingVestigingen[i]);
    if (listChanged) {
      patchContext({ onboardingVestigingen: nextList });
    }
    setLegalEntityComposer((prev) => {
      const d = prev.draft;
      if (
        d.country.trim() === target.country.trim() &&
        d.addressCountryCode.trim() === target.addressCountryCode.trim()
      ) {
        return prev;
      }
      return { ...prev, draft: { ...d, ...target } };
    });
  }, [zetelCountryLabel, zetelCountryCode, context.onboardingVestigingen, patchContext]);

  function removeVestiging(vid: string) {
    const inUse = blockedVestigingIds.has(vid);
    if (inUse) return;
    const next = context.onboardingVestigingen.filter((x) => x.id !== vid);
    patchContext({
      onboardingVestigingen: next,
    });
    setLegalEntityComposer((prev) =>
      prev.mode === "edit" && prev.draft.id === vid
        ? {
            mode: "new",
            draft: zetelCountryLabel.trim()
              ? { ...emptyOnboardingVestiging(), ...zetelCountryFieldsForVestiging() }
              : emptyOnboardingVestiging(),
          }
        : prev,
    );
  }

  function patchComposerDraft(patch: Partial<OnboardingVestiging>): void {
    setLegalEntityComposer((prev) => {
      const merged: OnboardingVestiging = { ...prev.draft, ...patch };
      if (zetelCountryLabel.trim()) {
        Object.assign(merged, zetelCountryFieldsForVestiging());
      }
      return { ...prev, draft: merged };
    });
  }

  function commitLegalEntityComposer(): void {
    const target = zetelCountryLabel.trim() ? zetelCountryFieldsForVestiging() : {};
    if (legalEntityComposer.mode === "new") {
      patchContext({
        onboardingVestigingen: [
          ...context.onboardingVestigingen,
          { ...legalEntityComposer.draft, ...target },
        ],
      });
    } else {
      const draft = { ...legalEntityComposer.draft, ...target };
      patchContext({
        onboardingVestigingen: context.onboardingVestigingen.map((x) => (x.id === draft.id ? draft : x)),
      });
    }
    const fresh = emptyOnboardingVestiging();
    setLegalEntityComposer({
      mode: "new",
      draft: zetelCountryLabel.trim() ? { ...fresh, ...zetelCountryFieldsForVestiging() } : fresh,
    });
  }

  const composerDraft = legalEntityComposer.draft;
  const composerIsEdit = legalEntityComposer.mode === "edit";

  return (
    <div className="space-y-6">
      {heading}
      <section
        className={personFormCardClassName("emphasized")}
        aria-labelledby={`${fieldBaseId}-legal-entity-composer-title`}
      >
        <div className="border-b border-border pb-4">
          <h4
            id={`${fieldBaseId}-legal-entity-composer-title`}
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            {composerIsEdit ? "Juridische entiteit bewerken" : "Nieuwe juridische entiteit"}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {composerIsEdit ?
              "Pas gegevens aan en klik Save om op te slaan."
            : "Vul gegevens in en klik Add om toe te voegen."}
          </p>
        </div>
        <div className="space-y-4 pt-4">
          <Field>
            <FieldLabel htmlFor={`${fieldBaseId}-composer-legal-name`}>
              Handels- of juridische naam van de vestiging
            </FieldLabel>
            <FieldContent>
              <Input
                id={`${fieldBaseId}-composer-legal-name`}
                value={composerDraft.legalName}
                placeholder="Bv. naam van deze vestigingseenheid"
                onChange={(e) => patchComposerDraft({ legalName: e.target.value })}
              />
            </FieldContent>
          </Field>
          <IdentificatieAddressSubform
            idPrefix={`${fieldBaseId}-composer-addr`}
            value={vestigingAddressSubformValue(composerDraft)}
            onChange={(v) => {
              patchComposerDraft({
                addressStreet: v.street,
                addressHouseNumber: v.houseNumber,
                addressPostalCode: v.postalCode,
                addressCity: v.locality,
                ...(zetelCountryLabel.trim()
                  ? {}
                  : {
                      country: v.country,
                      addressCountryCode:
                        registrationIsoCodeFromDutchCountryLabel(v.country.trim()) || "",
                    }),
              });
            }}
            countryOptions={countrySelectOptions}
            countrySelectValue={
              zetelCountryLabel && countrySelectOptions.includes(zetelCountryLabel) ?
                zetelCountryLabel
              : composerDraft.country.trim() &&
                  countrySelectOptions.includes(composerDraft.country.trim())
                ? composerDraft.country.trim()
              : COUNTRY_SELECT_NONE
            }
            onCountryChange={(cv) => {
              if (zetelCountryLabel.trim()) return;
              patchComposerDraft({
                country: cv === COUNTRY_SELECT_NONE ? "" : cv,
                addressCountryCode:
                  registrationIsoCodeFromDutchCountryLabel(
                    cv === COUNTRY_SELECT_NONE ? "" : cv,
                  ) || "",
              });
            }}
            countrySelectMode={zetelCountryLabel.trim() ? "locked" : "editable"}
            fieldHints={
              zetelCountryLabel.trim() ?
                {
                  country: "Land komt overeen met het land van uw maatschappelijke zetel.",
                }
              : undefined
            }
            showCountryCodeField={false}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
          {composerIsEdit ?
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setLegalEntityComposer({
                  mode: "new",
                  draft: zetelCountryLabel.trim()
                    ? { ...emptyOnboardingVestiging(), ...zetelCountryFieldsForVestiging() }
                    : emptyOnboardingVestiging(),
                })
              }
            >
              Annuleren
            </Button>
          : null}
          <Button type="button" variant="secondary" onClick={commitLegalEntityComposer}>
            {composerIsEdit ? "Save" : "Add"}
          </Button>
        </div>
      </section>

      {context.onboardingVestigingen.length > 0 ?
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Juridische entiteiten (vestigingen)
          </p>
          <ul className="space-y-2">
            {context.onboardingVestigingen.map((ve, index) => {
              const inUse = blockedVestigingIds.has(ve.id);
              const isRowBeingEdited =
                composerIsEdit && legalEntityComposer.draft.id === ve.id;
              return (
                <li
                  key={ve.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
                    isRowBeingEdited ? "border-primary bg-primary/5" : "border-border bg-muted/10"
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">Vestiging {index + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatVestigingRegistryOptionLabel(ve)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={composerIsEdit && legalEntityComposer.draft.id !== ve.id}
                      onClick={() => setLegalEntityComposer({ mode: "edit", draft: { ...ve } })}
                    >
                      Bewerken
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={inUse}
                      onClick={() => removeVestiging(ve.id)}
                      aria-label={`Vestiging ${index + 1} verwijderen`}
                    >
                      Verwijderen
                    </Button>
                  </div>
                  {inUse ?
                    <p className="w-full text-xs text-muted-foreground">
                      Deze vestiging is gekoppeld aan een aanvraag; ontbind eerst de koppeling in het
                      overzicht hierboven.
                    </p>
                  : null}
                </li>
              );
            })}
          </ul>
        </div>
      : null}
    </div>
  );
}
