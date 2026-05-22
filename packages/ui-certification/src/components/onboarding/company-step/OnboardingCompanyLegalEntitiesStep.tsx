/**
 * Step "Bedrijfslocaties & certificatie" (stap 4):
 *
 * Zone 1 — Locatiebeheer (top): grid met de maatschappelijke zetel (locked,
 *   opgehaald uit het KBO-zetel-formulier) als eerste item, gevolgd door de
 *   toegevoegde vestigingen en een inline composer-card "+ Extra vestiging
 *   toevoegen" (Naam + Adres + optioneel Vestigingsnummer).
 *
 * Zone 2 — Allocatie-tabel (bottom): één rij per [productnaam] · [certificaat-type]
 *   uit `draftsInRegistrationScope`. Kolom 1 is altijd de maatschappelijke
 *   zetel; voor elke extra vestiging uit Zone 1 verschijnt dynamisch een
 *   kolom aan de rechterkant. Per rij is er één radio-groep
 *   (`name="allocation-[request-id]"`) — bij het laden of na het toevoegen
 *   van een nieuwe vestiging staat de zetel-kolom standaard `checked`.
 */
import { useMemo, useState } from "react";

import {
  Add01Icon,
  Building03Icon,
  Cancel01Icon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Field,
  FieldContent,
  FieldLabel,
  H4,
  Input,
  cn,
} from "@procertus-ui/ui";

import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { emptyOnboardingVestiging } from "../../../onboarding/onboarding-flow-helpers";
import { DraftCardDescription } from "../../../certification-request/draft-selection-presentation";
import type {
  CustomerContext,
  OnboardingVestiging,
} from "../../../onboarding/onboarding-types";

export type OnboardingCompanyLegalEntitiesStepProps = {
  model: OnboardingRegistrationLayoutModel;
};

type ComposerState =
  | { open: false }
  | { open: true; draft: OnboardingVestiging; vestigingsnummer: string };

function freshComposerDraft(context: CustomerContext): OnboardingVestiging {
  return {
    ...emptyOnboardingVestiging(),
    country: context.country.trim(),
    addressCountryCode: context.addressCountryCode.trim(),
  };
}

function formatAddressLine(input: {
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
}): string {
  const street = [input.addressStreet.trim(), input.addressHouseNumber.trim()]
    .filter(Boolean)
    .join(" ");
  const locality = [input.addressPostalCode.trim(), input.addressCity.trim()]
    .filter(Boolean)
    .join(" ");
  return [street, locality].filter(Boolean).join(", ");
}

export function OnboardingCompanyLegalEntitiesStep({
  model,
}: OnboardingCompanyLegalEntitiesStepProps) {
  const {
    context,
    patchContext,
    draftsInRegistrationScope,
    legalEntityFieldBase,
    CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
  } = model;

  const certificationMap = context.certificationInquiryVestigingId;
  const vestigingen = context.onboardingVestigingen;

  const [composer, setComposer] = useState<ComposerState>({ open: false });

  const zetelTitle = context.organizationName.trim() || "Maatschappelijke zetel";
  const zetelAddressLine = formatAddressLine(context);

  function selectedForDraft(draftId: string): string {
    const raw = (certificationMap[draftId] ?? "").trim();
    if (!raw) return CERT_INQUIRY_LEGAL_ENTITY_ZETEL;
    if (raw === CERT_INQUIRY_LEGAL_ENTITY_ZETEL) return raw;
    if (vestigingen.some((v) => v.id === raw)) return raw;
    return CERT_INQUIRY_LEGAL_ENTITY_ZETEL;
  }

  function setSelection(draftId: string, value: string): void {
    const next = { ...certificationMap, [draftId]: value };
    patchContext({ certificationInquiryVestigingId: next });
  }

  function openComposer(): void {
    setComposer({
      open: true,
      draft: freshComposerDraft(context),
      vestigingsnummer: "",
    });
  }
  function cancelComposer(): void {
    setComposer({ open: false });
  }
  function patchComposer(patch: Partial<OnboardingVestiging>): void {
    setComposer((prev) =>
      prev.open ? { ...prev, draft: { ...prev.draft, ...patch } } : prev,
    );
  }
  function setComposerVestigingsnummer(v: string): void {
    setComposer((prev) => (prev.open ? { ...prev, vestigingsnummer: v } : prev));
  }
  function canCommitComposer(): boolean {
    if (!composer.open) return false;
    const d = composer.draft;
    if (d.legalName.trim() === "") return false;
    if (d.addressStreet.trim() === "" && d.addressCity.trim() === "") return false;
    return true;
  }
  function commitComposer(): void {
    if (!composer.open) return;
    const d = composer.draft;
    if (!canCommitComposer()) return;
    const vestigingsnummer = composer.vestigingsnummer.trim();
    const composedLegalName = vestigingsnummer
      ? `${d.legalName.trim()} (Vest. ${vestigingsnummer})`
      : d.legalName.trim();
    const newVestiging: OnboardingVestiging = {
      ...d,
      legalName: composedLegalName,
      country: context.country.trim() || d.country,
      addressCountryCode: context.addressCountryCode.trim() || d.addressCountryCode,
    };
    patchContext({ onboardingVestigingen: [...vestigingen, newVestiging] });
    setComposer({ open: false });
  }
  function removeVestiging(vid: string): void {
    const nextMap: Record<string, string> = {};
    for (const [k, v] of Object.entries(certificationMap)) {
      nextMap[k] = v === vid ? CERT_INQUIRY_LEGAL_ENTITY_ZETEL : v;
    }
    patchContext({
      onboardingVestigingen: vestigingen.filter((v) => v.id !== vid),
      certificationInquiryVestigingId: nextMap,
    });
  }

  const locationColumns = useMemo(
    () =>
      [
        {
          id: CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
          title: zetelTitle,
          subtitle: "Maatschappelijke zetel",
          locked: true,
        },
        ...vestigingen.map((v, i) => ({
          id: v.id,
          title: v.legalName.trim() || `Vestiging ${i + 1}`,
          subtitle: `Vestiging ${i + 1}`,
          locked: false,
        })),
      ],
    [CERT_INQUIRY_LEGAL_ENTITY_ZETEL, vestigingen, zetelTitle],
  );

  const allocationGridTemplate = {
    gridTemplateColumns: `minmax(0, 2fr) repeat(${locationColumns.length}, minmax(0, 1fr))`,
  };

  const composerFieldBase = `${legalEntityFieldBase}-locaties-composer`;

  return (
    <div className="space-y-section">
      {/* ────────────────────────────── Zone 1: Locatiebeheer ───────────────── */}
      <section className="space-y-4" aria-labelledby="locaties-zone1-heading">
        <div className="space-y-1">
          <H4
            id="locaties-zone1-heading"
            className="normal-case tracking-tight text-foreground"
          >
            Bedrijfslocaties
          </H4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            De maatschappelijke zetel komt rechtstreeks uit uw KBO-gegevens. Voeg
            optioneel extra vestigingen toe waar audits of certificering kunnen
            plaatsvinden.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Maatschappelijke zetel — locked */}
          <article
            className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-component"
            aria-label="Maatschappelijke zetel (locked)"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <HugeiconsIcon
                  icon={Building03Icon}
                  aria-hidden
                  className="size-3.5"
                />
                Maatschappelijke zetel
              </span>
              <HugeiconsIcon
                icon={LockIcon}
                aria-label="Locked, komt uit het KBO-formulier"
                className="size-3.5 text-muted-foreground"
              />
            </div>
            <p className="text-sm font-medium text-foreground">{zetelTitle}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {zetelAddressLine || "Adresgegevens nog niet ingevuld."}
            </p>
          </article>

          {/* Extra vestigingen */}
          {vestigingen.map((ve, index) => (
            <article
              key={ve.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-background p-component"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Vestiging {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVestiging(ve.id)}
                  aria-label={`Vestiging ${index + 1} verwijderen`}
                  className="size-7 p-0"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    aria-hidden
                    className="size-3.5"
                  />
                </Button>
              </div>
              <p className="text-sm font-medium text-foreground">
                {ve.legalName.trim() || `Vestiging ${index + 1}`}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {formatAddressLine(ve) || "Adres nog niet ingevuld"}
              </p>
            </article>
          ))}

          {/* Add-card */}
          {composer.open ? (
            <article
              className="col-span-full flex flex-col gap-3 rounded-lg border border-primary/40 bg-primary/5 p-component"
              aria-labelledby={`${composerFieldBase}-title`}
            >
              <div className="flex items-center justify-between">
                <p
                  id={`${composerFieldBase}-title`}
                  className="text-sm font-semibold text-foreground"
                >
                  Extra vestiging toevoegen
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={cancelComposer}
                  aria-label="Toevoegen annuleren"
                  className="size-7 p-0"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    aria-hidden
                    className="size-3.5"
                  />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={`${composerFieldBase}-name`}>
                    Naam vestiging
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id={`${composerFieldBase}-name`}
                      value={composer.draft.legalName}
                      placeholder="Bv. Filiaal Antwerpen"
                      onChange={(e) =>
                        patchComposer({ legalName: e.target.value })
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${composerFieldBase}-vestigingsnummer`}>
                    Vestigingsnummer (optioneel)
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id={`${composerFieldBase}-vestigingsnummer`}
                      value={composer.vestigingsnummer}
                      placeholder="10 cijfers"
                      inputMode="numeric"
                      onChange={(e) =>
                        setComposerVestigingsnummer(e.target.value)
                      }
                    />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
                <Field>
                  <FieldLabel htmlFor={`${composerFieldBase}-street`}>
                    Straat
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id={`${composerFieldBase}-street`}
                      value={composer.draft.addressStreet}
                      placeholder="Straatnaam"
                      onChange={(e) =>
                        patchComposer({ addressStreet: e.target.value })
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${composerFieldBase}-housenumber`}>
                    Huisnummer
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id={`${composerFieldBase}-housenumber`}
                      value={composer.draft.addressHouseNumber}
                      placeholder="Nr."
                      onChange={(e) =>
                        patchComposer({ addressHouseNumber: e.target.value })
                      }
                    />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr]">
                <Field>
                  <FieldLabel htmlFor={`${composerFieldBase}-postalcode`}>
                    Postcode
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id={`${composerFieldBase}-postalcode`}
                      value={composer.draft.addressPostalCode}
                      placeholder="Bv. 2000"
                      onChange={(e) =>
                        patchComposer({ addressPostalCode: e.target.value })
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${composerFieldBase}-city`}>
                    Gemeente
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id={`${composerFieldBase}-city`}
                      value={composer.draft.addressCity}
                      placeholder="Gemeente of stad"
                      onChange={(e) =>
                        patchComposer({ addressCity: e.target.value })
                      }
                    />
                  </FieldContent>
                </Field>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={cancelComposer}
                >
                  Annuleren
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={commitComposer}
                  disabled={!canCommitComposer()}
                >
                  Vestiging toevoegen
                </Button>
              </div>
            </article>
          ) : (
            <button
              type="button"
              onClick={openComposer}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-background/60 p-component text-sm font-medium text-muted-foreground transition-colors",
                "hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Extra vestiging toevoegen"
            >
              <HugeiconsIcon icon={Add01Icon} aria-hidden className="size-4" />
              <span>Extra vestiging toevoegen</span>
            </button>
          )}
        </div>
      </section>

      {/* ────────────────────────────── Zone 2: Allocatie-tabel ─────────────── */}
      {draftsInRegistrationScope.length > 0 ? (
        <section
          className="space-y-4"
          aria-labelledby="locaties-zone2-heading"
        >
          <div className="space-y-1">
            <H4
              id="locaties-zone2-heading"
              className="normal-case tracking-tight text-foreground"
            >
              Certificatie per locatie
            </H4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Selecteer per certificaat de fysieke locatie waar de audit en
              certificering zal plaatsvinden. Standaard is alles gekoppeld aan
              uw maatschappelijke zetel.
            </p>
          </div>

          <div
            className="overflow-x-auto rounded-lg border border-border"
            role="region"
            aria-label="Toewijzing per certificaat-aanvraag"
          >
            <div className="min-w-full">
              {/* Header row */}
              <div
                className="grid items-stretch border-b border-border bg-muted/40"
                style={allocationGridTemplate}
              >
                <div className="px-component py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Certificaat-aanvraag
                </div>
                {locationColumns.map((col) => (
                  <div
                    key={col.id}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 border-l border-border px-component py-2.5 text-center",
                    )}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {col.subtitle}
                    </span>
                    <span className="line-clamp-2 text-xs font-medium text-foreground">
                      {col.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Body rows */}
              {draftsInRegistrationScope.map((draft, rowIdx) => {
                const groupName = `allocation-${draft.id}`;
                const selected = selectedForDraft(draft.id);
                return (
                  <div
                    key={draft.id}
                    className={cn(
                      "grid items-stretch border-b border-border last:border-b-0",
                      rowIdx % 2 === 1 ? "bg-muted/10" : "bg-background",
                    )}
                    style={allocationGridTemplate}
                  >
                    <div className="min-w-0 px-component py-3">
                      <p className="text-sm font-medium text-foreground">
                        {draft.shortLabel || draft.label}
                      </p>
                      <div className="mt-1 text-xs leading-relaxed text-muted-foreground [&_.font-medium]:text-foreground">
                        <DraftCardDescription draft={draft} />
                      </div>
                    </div>

                    {locationColumns.map((col) => {
                      const checked = selected === col.id;
                      const inputId = `${groupName}-${col.id}`;
                      return (
                        <label
                          key={col.id}
                          htmlFor={inputId}
                          className={cn(
                            "flex cursor-pointer items-center justify-center border-l border-border px-component py-3 transition-colors",
                            checked ? "bg-primary/5" : "hover:bg-muted/40",
                          )}
                        >
                          <input
                            id={inputId}
                            type="radio"
                            name={groupName}
                            value={col.id}
                            checked={checked}
                            onChange={() => setSelection(draft.id, col.id)}
                            className="size-4 cursor-pointer accent-primary"
                            aria-label={`${draft.shortLabel || draft.label} — ${col.title}`}
                          />
                        </label>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
