/**
 * Redesign-step "Bedrijfslocaties & certificatie" (stap 4) — Accordion-variant.
 *
 * Eén `Accordion type="single" collapsible` bundelt alle locaties als gelijksoortige
 * items, met roving focus / pijltoetsen tussen triggers. Alleen één item is tegelijk
 * open, wat de visuele ruis laag houdt naarmate de lijst groeit ("opschaling-bestendig").
 *
 * Items:
 *
 * 1. Maatschappelijke zetel (locked) — default gesloten. Open: read-only adressummary
 *    uit het KBO-zetel-formulier + subtiele shortcut "Koppel alle certificaten aan
 *    maatschappelijke zetel".
 *
 * 2. Opgeslagen vestigingen — elk een AccordionItem. Open: details + interne
 *    "Koppel alle"-shortcut, plus een verwijder-actie.
 *
 * 3. Nieuwe vestiging composers — verschijnen direct geopend (controlled `value`)
 *    onder de overige items. Bevatten: Vestigingsnummer (optioneel, met KBO-mask),
 *    Naam, Straat, Huisnummer, Postcode, Plaats en een Opslaan-knop. Na opslaan
 *    sluit de Accordion en wordt de locatie toegevoegd aan de globale dropdown.
 *
 * Onderaan staat de knop "Extra vestiging toevoegen" buiten de Accordion.
 *
 * Allocatie-tabel: vaste 2-koloms tabel [Certificaat-aanvraag] | [Locatie (<Select>)].
 * De Select bevat altijd de zetel als standaardwaarde en elke opgeslagen vestiging
 * als extra option.
 */
import { useMemo, useState } from "react";

import {
  Add01Icon,
  Building03Icon,
  Cancel01Icon,
  LinkIcon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Field,
  FieldContent,
  FieldLabel,
  H4,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@procertus-ui/ui";

import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { emptyOnboardingVestiging } from "../../../onboarding/onboarding-flow-helpers";
import { DraftCardDescription } from "../../../certification-request/draft-selection-presentation";
import type {
  CustomerContext,
  OnboardingVestiging,
} from "../../../onboarding/onboarding-types";

export type OnboardingCertificatieStepRedesignProps = {
  model: OnboardingRegistrationLayoutModel;
};

type ComposerEntry = OnboardingVestiging & { vestigingsnummer: string };

const HQ_ACCORDION_VALUE = "zetel";

function freshComposerDraft(context: CustomerContext): ComposerEntry {
  return {
    ...emptyOnboardingVestiging(),
    country: context.country.trim(),
    addressCountryCode: context.addressCountryCode.trim(),
    vestigingsnummer: "",
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

function vestigingCollapsedTitle(v: OnboardingVestiging, fallbackIndex: number): string {
  const name = v.legalName.trim();
  const city = v.addressCity.trim();
  if (name && city) return `${name}, ${city}`;
  if (name) return name;
  if (city) return city;
  return `Vestiging ${fallbackIndex + 1}`;
}

/**
 * Belgisch vestigingseenheidsnummer (KBO): 10 cijfers, beginnend met 2 of hoger,
 * weergegeven als X.XXX.XXX.XXX.
 */
function formatBelgianVestigingsnummer(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  const a = digits.slice(0, 1);
  const b = digits.slice(1, 4);
  const c = digits.slice(4, 7);
  const d = digits.slice(7, 10);
  return [a, b, c, d].filter(Boolean).join(".");
}

export function OnboardingCertificatieStepRedesign({
  model,
}: OnboardingCertificatieStepRedesignProps) {
  const {
    context,
    patchContext,
    draftsInRegistrationScope,
    legalEntityFieldBase,
    CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
  } = model;

  const certificationMap = context.certificationInquiryVestigingId;
  const vestigingen = context.onboardingVestigingen;

  /** In-progress drafts die alleen lokaal leven tot ze worden opgeslagen. */
  const [composers, setComposers] = useState<ComposerEntry[]>([]);

  /**
   * Vestigingsnummers per opgeslagen vestiging. Leeft alleen in deze redesign-step
   * omdat `OnboardingVestiging` geen veld voor het KBO-vestigingseenheidsnummer heeft.
   */
  const [vestigingsnummerById, setVestigingsnummerById] = useState<
    Record<string, string>
  >({});

  /** Welk Accordion-item is open. Leeg = alles gesloten. */
  const [openValue, setOpenValue] = useState<string>("");

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
    patchContext({
      certificationInquiryVestigingId: { ...certificationMap, [draftId]: value },
    });
  }

  function assignAllDrafts(locationId: string): void {
    const next: Record<string, string> = { ...certificationMap };
    for (const d of draftsInRegistrationScope) {
      next[d.id] = locationId;
    }
    patchContext({ certificationInquiryVestigingId: next });
  }

  function addComposer(): void {
    const draft = freshComposerDraft(context);
    setComposers((prev) => [...prev, draft]);
    setOpenValue(draft.id);
  }
  function cancelComposer(composerId: string): void {
    setComposers((prev) => prev.filter((c) => c.id !== composerId));
    setOpenValue((prev) => (prev === composerId ? "" : prev));
  }
  function patchComposer(composerId: string, patch: Partial<ComposerEntry>): void {
    setComposers((prev) =>
      prev.map((c) => (c.id === composerId ? { ...c, ...patch } : c)),
    );
  }
  function canSaveComposer(c: ComposerEntry): boolean {
    if (c.legalName.trim() === "") return false;
    if (c.addressCity.trim() === "") return false;
    return true;
  }
  function saveComposer(composerId: string): void {
    const c = composers.find((x) => x.id === composerId);
    if (!c || !canSaveComposer(c)) return;
    const { vestigingsnummer: composerVestigingsnummer, ...vestigingFields } = c;
    const saved: OnboardingVestiging = {
      ...vestigingFields,
      legalName: c.legalName.trim(),
      addressStreet: c.addressStreet.trim(),
      addressHouseNumber: c.addressHouseNumber.trim(),
      addressPostalCode: c.addressPostalCode.trim(),
      addressCity: c.addressCity.trim(),
      country: context.country.trim() || c.country,
      addressCountryCode: context.addressCountryCode.trim() || c.addressCountryCode,
    };
    patchContext({ onboardingVestigingen: [...vestigingen, saved] });
    const trimmedVestigingsnummer = composerVestigingsnummer.trim();
    if (trimmedVestigingsnummer) {
      setVestigingsnummerById((prev) => ({
        ...prev,
        [saved.id]: trimmedVestigingsnummer,
      }));
    }
    setComposers((prev) => prev.filter((x) => x.id !== composerId));
    setOpenValue((prev) => (prev === composerId ? "" : prev));
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
    setVestigingsnummerById((prev) => {
      if (!(vid in prev)) return prev;
      const { [vid]: _omit, ...rest } = prev;
      return rest;
    });
    setOpenValue((prev) => (prev === vid ? "" : prev));
  }

  const locationOptions = useMemo(
    () => [
      {
        id: CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
        label: zetelTitle,
        sub: "Maatschappelijke zetel",
      },
      ...vestigingen.map((v, i) => ({
        id: v.id,
        label: vestigingCollapsedTitle(v, i),
        sub: "Vestiging",
      })),
    ],
    [CERT_INQUIRY_LEGAL_ENTITY_ZETEL, vestigingen, zetelTitle],
  );

  const fieldBase = `${legalEntityFieldBase}-locaties-accordion`;
  const hasDraftsInScope = draftsInRegistrationScope.length > 0;

  return (
    <div className="space-y-section">
      {/* ─────────────────────── 1. Locaties (Accordion) ────────────────────── */}
      <section className="space-y-3" aria-labelledby="locaties-v3-heading">
        <div className="space-y-1">
          <H4
            id="locaties-v3-heading"
            className="normal-case tracking-tight text-foreground"
          >
            Bedrijfslocaties
          </H4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            De maatschappelijke zetel komt uit uw KBO-gegevens. Voeg optioneel
            extra vestigingen toe waar de audit en certificering kan plaatsvinden.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={setOpenValue}
            className="divide-y divide-border"
          >
            {/* HQ */}
            <AccordionItem
              value={HQ_ACCORDION_VALUE}
              className="border-b-0 px-component"
            >
              <AccordionTrigger className="py-3">
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <HugeiconsIcon
                    icon={Building03Icon}
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Maatschappelijke zetel
                      </span>
                      <HugeiconsIcon
                        icon={LockIcon}
                        aria-label="Locked, komt uit het KBO-formulier"
                        className="size-3 text-muted-foreground"
                      />
                    </span>
                    <span className="block truncate text-sm font-medium text-foreground">
                      {zetelTitle}
                      {zetelAddressLine ? (
                        <span className="font-normal text-muted-foreground">
                          , {zetelAddressLine}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor={`${fieldBase}-hq-name`}>
                      Juridische naam
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={`${fieldBase}-hq-name`}
                        value={context.organizationName}
                        disabled
                        readOnly
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`${fieldBase}-hq-country`}>Land</FieldLabel>
                    <FieldContent>
                      <Input
                        id={`${fieldBase}-hq-country`}
                        value={context.country}
                        disabled
                        readOnly
                      />
                    </FieldContent>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
                  <Field>
                    <FieldLabel htmlFor={`${fieldBase}-hq-street`}>Straat</FieldLabel>
                    <FieldContent>
                      <Input
                        id={`${fieldBase}-hq-street`}
                        value={context.addressStreet}
                        disabled
                        readOnly
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`${fieldBase}-hq-housenumber`}>
                      Huisnummer
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={`${fieldBase}-hq-housenumber`}
                        value={context.addressHouseNumber}
                        disabled
                        readOnly
                      />
                    </FieldContent>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr]">
                  <Field>
                    <FieldLabel htmlFor={`${fieldBase}-hq-postalcode`}>
                      Postcode
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={`${fieldBase}-hq-postalcode`}
                        value={context.addressPostalCode}
                        disabled
                        readOnly
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`${fieldBase}-hq-city`}>Plaats</FieldLabel>
                    <FieldContent>
                      <Input
                        id={`${fieldBase}-hq-city`}
                        value={context.addressCity}
                        disabled
                        readOnly
                      />
                    </FieldContent>
                  </Field>
                </div>

                {hasDraftsInScope ? (
                  <div className="flex justify-end border-t border-border/60 pt-3">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => assignAllDrafts(CERT_INQUIRY_LEGAL_ENTITY_ZETEL)}
                      className="h-auto gap-1.5 p-0 text-xs font-medium"
                    >
                      <HugeiconsIcon
                        icon={LinkIcon}
                        aria-hidden
                        className="size-3.5"
                      />
                      Koppel alle certificaten aan maatschappelijke zetel
                    </Button>
                  </div>
                ) : null}
              </AccordionContent>
            </AccordionItem>

            {/* Saved vestigingen */}
            {vestigingen.map((ve, index) => (
              <AccordionItem
                key={ve.id}
                value={ve.id}
                className="border-b-0 px-component"
              >
                <AccordionTrigger className="py-3">
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <HugeiconsIcon
                      icon={Building03Icon}
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Vestiging {index + 1}
                      </span>
                      <span className="block truncate text-sm font-medium text-foreground">
                        {vestigingCollapsedTitle(ve, index)}
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm">
                  <dl className="grid grid-cols-1 gap-x-component gap-y-1 md:grid-cols-[10rem_1fr]">
                    {vestigingsnummerById[ve.id] ? (
                      <>
                        <dt className="text-xs text-muted-foreground">
                          Vestigingsnummer
                        </dt>
                        <dd className="font-mono text-foreground">
                          {vestigingsnummerById[ve.id]}
                        </dd>
                      </>
                    ) : null}
                    <dt className="text-xs text-muted-foreground">Naam</dt>
                    <dd className="text-foreground">{ve.legalName.trim() || "—"}</dd>
                    <dt className="text-xs text-muted-foreground">Adres</dt>
                    <dd className="text-foreground">
                      {formatAddressLine(ve) || "—"}
                    </dd>
                  </dl>
                  <div
                    className={cn(
                      "flex items-center gap-2 border-t border-border/60 pt-3",
                      hasDraftsInScope ? "justify-between" : "justify-end",
                    )}
                  >
                    {hasDraftsInScope ? (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => assignAllDrafts(ve.id)}
                        className="h-auto gap-1.5 p-0 text-xs font-medium"
                      >
                        <HugeiconsIcon
                          icon={LinkIcon}
                          aria-hidden
                          className="size-3.5"
                        />
                        Koppel alle certificaten aan deze vestiging
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVestiging(ve.id)}
                      className="gap-1.5 text-xs"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        aria-hidden
                        className="size-3.5"
                      />
                      Verwijderen
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}

            {/* In-progress draft composers */}
            {composers.map((c) => {
              const composerFieldBase = `${fieldBase}-composer-${c.id}`;
              const canSave = canSaveComposer(c);
              return (
                <AccordionItem
                  key={c.id}
                  value={c.id}
                  className="border-b-0 bg-primary/5 px-component"
                >
                  <AccordionTrigger className="py-3">
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <HugeiconsIcon
                        icon={Building03Icon}
                        aria-hidden
                        className="size-4 shrink-0 text-primary"
                      />
                      <span className="text-sm font-semibold text-foreground">
                        Nieuwe vestiging
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <Field>
                      <FieldLabel htmlFor={`${composerFieldBase}-vestigingsnummer`}>
                        Vestigingsnummer (optioneel)
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id={`${composerFieldBase}-vestigingsnummer`}
                          value={c.vestigingsnummer}
                          placeholder="Bijv. 2.123.456.789"
                          inputMode="numeric"
                          autoComplete="off"
                          onChange={(e) =>
                            patchComposer(c.id, {
                              vestigingsnummer: formatBelgianVestigingsnummer(
                                e.target.value,
                              ),
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Het 10-cijferige nummer van deze specifieke locatie zoals
                          geregistreerd in de KBO.
                        </p>
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`${composerFieldBase}-name`}>
                        Naam van de vestiging
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id={`${composerFieldBase}-name`}
                          value={c.legalName}
                          placeholder="Bv. Filiaal Antwerpen"
                          onChange={(e) =>
                            patchComposer(c.id, { legalName: e.target.value })
                          }
                        />
                      </FieldContent>
                    </Field>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
                      <Field>
                        <FieldLabel htmlFor={`${composerFieldBase}-street`}>
                          Straat
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id={`${composerFieldBase}-street`}
                            value={c.addressStreet}
                            placeholder="Straatnaam"
                            onChange={(e) =>
                              patchComposer(c.id, { addressStreet: e.target.value })
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
                            value={c.addressHouseNumber}
                            placeholder="Nr."
                            onChange={(e) =>
                              patchComposer(c.id, {
                                addressHouseNumber: e.target.value,
                              })
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
                            value={c.addressPostalCode}
                            placeholder="Bv. 2000"
                            onChange={(e) =>
                              patchComposer(c.id, {
                                addressPostalCode: e.target.value,
                              })
                            }
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`${composerFieldBase}-city`}>
                          Plaats
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id={`${composerFieldBase}-city`}
                            value={c.addressCity}
                            placeholder="Gemeente of stad"
                            onChange={(e) =>
                              patchComposer(c.id, { addressCity: e.target.value })
                            }
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-primary/20 pt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => cancelComposer(c.id)}
                      >
                        Annuleren
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveComposer(c.id)}
                        disabled={!canSave}
                      >
                        Opslaan
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Add vestiging button */}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addComposer}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={Add01Icon} aria-hidden className="size-4" />
            Extra vestiging toevoegen
          </Button>
        </div>
      </section>

      {/* ─────────────────────── 2. Certificatie per locatie ────────────────── */}
      {hasDraftsInScope ? (
        <section
          className="space-y-3"
          aria-labelledby="locaties-v3-allocation-heading"
        >
          <div className="space-y-1">
            <H4
              id="locaties-v3-allocation-heading"
              className="normal-case tracking-tight text-foreground"
            >
              Certificatie per locatie
            </H4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Selecteer per certificaat de fysieke locatie waar de audit en
              certificering zal plaatsvinden. Standaard is alles gekoppeld aan uw
              maatschappelijke zetel.
            </p>
          </div>

          <div className="w-full overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed border-collapse text-sm">
              <colgroup>
                <col />
                <col className="w-80" />
              </colgroup>
              <thead className="bg-muted/40">
                <tr>
                  <th
                    scope="col"
                    className="px-component py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Certificaat-aanvraag
                  </th>
                  <th
                    scope="col"
                    className="px-component py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Locatie
                  </th>
                </tr>
              </thead>
              <tbody>
                {draftsInRegistrationScope.map((draft, rowIdx) => {
                  const selected = selectedForDraft(draft.id);
                  return (
                    <tr
                      key={draft.id}
                      className={cn(
                        "border-t border-border align-middle",
                        rowIdx % 2 === 1 ? "bg-muted/10" : "bg-background",
                      )}
                    >
                      <td className="min-w-0 px-component py-3">
                        <p className="text-sm font-medium text-foreground">
                          {draft.shortLabel || draft.label}
                        </p>
                        <div className="mt-1 text-xs leading-relaxed text-muted-foreground [&_.font-medium]:text-foreground">
                          <DraftCardDescription draft={draft} />
                        </div>
                      </td>
                      <td className="px-component py-3 text-right">
                        <div className="flex justify-end">
                          <Select
                            value={selected}
                            defaultValue={CERT_INQUIRY_LEGAL_ENTITY_ZETEL}
                            onValueChange={(v) => setSelection(draft.id, v)}
                          >
                            <SelectTrigger
                              size="sm"
                              className="w-72"
                              aria-label={`Locatie voor ${draft.shortLabel || draft.label}`}
                            >
                              <SelectValue placeholder={zetelTitle} />
                            </SelectTrigger>
                            <SelectContent position="popper" align="end">
                              {locationOptions.map((opt) => (
                                <SelectItem key={opt.id} value={opt.id}>
                                  <span className="flex flex-col">
                                    <span className="text-sm">{opt.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {opt.sub}
                                    </span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
