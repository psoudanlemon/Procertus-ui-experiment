/**
 * Redesign-variant van "Nazicht" step (3.10):
 *
 * - Zware kaarten (Card/CardHeader/CardContent) rond product-matrix,
 *   innovation-attest en metrologie worden vervangen door compacte secties met
 *   thin border, zodat de hele pagina in één oogopslag scanbaar blijft.
 * - De ChoiceCardGroup (multi-select drafts om mee in te dienen) wordt een
 *   compacte tabel met inline checkbox-cellen.
 * - Knop "Aanvragen wijzigen" is verwijderd — gebruiker navigeert terug via
 *   "Terug" of via de klikbare stepper.
 *
 * Niet gebruikt in productie — leeft alleen in redesign-stories.
 */
import {
  Badge,
  Checkbox,
  DownloadableItemGrid,
  H3,
  Label,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@procertus-ui/ui";
import { useMemo } from "react";

import {
  PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG,
  ProductRequestNoteField,
} from "../../traject/ProductRequestNoteField";
import { ProductInquiryMatrix } from "../../traject/ProductInquiryMatrix";
import {
  groupDraftsByProduct,
  productBoundDrafts,
  standaloneInquiryDrafts,
} from "../../traject/build-validation-documents";
import {
  DraftCardDescription,
  sortDraftsByIntentAndProduct,
} from "../../../certification-request/draft-selection-presentation";
import {
  formatOnboardingVestigingPostalLine,
  formatPostalAddressDisplay,
  summaryDisplayNameForRegisteredPerson,
  summaryRolesForRegisteredPerson,
} from "../../../onboarding/onboarding-flow-helpers";
import {
  innovationAttestAttachmentsAsDownloadableItems,
  innovationAttestCaptureSummaryRows,
} from "../../../onboarding/onboarding-innovation-attest";
import {
  metrologyAttachmentsAsDownloadableItems,
  metrologyCaptureSummaryRows,
} from "../../../onboarding/onboarding-metrology";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

export type OnboardingSummaryStepRedesignProps = {
  model: OnboardingRegistrationLayoutModel;
};

function SummarySection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2" aria-labelledby={id}>
      <div className="space-y-1">
        <H3 id={id} className="m-0">
          {title}
        </H3>
        {description ? (
          <p className="m-0 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="w-full min-w-0 rounded-lg border border-border/50">{children}</div>
    </section>
  );
}

export function OnboardingSummaryStepRedesign({
  model,
}: OnboardingSummaryStepRedesignProps) {
  const {
    context,
    setFlowState,
    drafts,
    effectiveSummaryIncludedDraftIds,
    summaryKlantenportaalByPersonId,
    summaryRequesterLabel,
    summaryRequesterEmailLabel,
    summaryOrganizationLabel,
    summarySectionTitle,
    summaryRc,
    submissionNote,
    submissionNoteUnlocked,
    innovationAttestInquiry,
    metrologyInquiry,
  } = model;

  const submissionNoteDraft = submissionNote ?? "";

  const productGroups = useMemo(() => groupDraftsByProduct(productBoundDrafts(drafts)), [drafts]);
  const productBoundDraftList = useMemo(() => productBoundDrafts(drafts), [drafts]);
  const standaloneDraftList = useMemo(() => standaloneInquiryDrafts(drafts), [drafts]);
  const allDraftsForChecklist = useMemo(
    () => [
      ...sortDraftsByIntentAndProduct(standaloneDraftList),
      ...sortDraftsByIntentAndProduct(productBoundDraftList),
    ],
    [standaloneDraftList, productBoundDraftList],
  );

  const onDraftIncludedChange = (draftId: string, included: boolean) => {
    setFlowState((prev) => {
      const ids = prev.drafts.map((d) => d.id);
      const base = prev.summaryIncludedDraftIds ?? [...ids];
      const next = included
        ? Array.from(new Set([...base, draftId]))
        : base.filter((id) => id !== draftId);
      return { ...prev, summaryIncludedDraftIds: next };
    });
  };

  const showInnovationAttestSummary = useMemo(
    () =>
      drafts.some(
        (d) =>
          d.entryId === "innovation-attest" && effectiveSummaryIncludedDraftIds.includes(d.id),
      ),
    [drafts, effectiveSummaryIncludedDraftIds],
  );
  const innovationSummaryRows = useMemo(
    () => innovationAttestCaptureSummaryRows(innovationAttestInquiry.capture),
    [innovationAttestInquiry.capture],
  );
  const innovationAttachmentItems = useMemo(
    () => innovationAttestAttachmentsAsDownloadableItems(innovationAttestInquiry.capture.attachments),
    [innovationAttestInquiry.capture.attachments],
  );

  const showMetrologySummary = useMemo(
    () =>
      drafts.some(
        (d) => d.entryId === "metrology" && effectiveSummaryIncludedDraftIds.includes(d.id),
      ),
    [drafts, effectiveSummaryIncludedDraftIds],
  );
  const metrologySummaryRows = useMemo(
    () => metrologyCaptureSummaryRows(metrologyInquiry.capture),
    [metrologyInquiry.capture],
  );
  const metrologyAttachmentItems = useMemo(
    () => metrologyAttachmentsAsDownloadableItems(metrologyInquiry.capture.attachments),
    [metrologyInquiry.capture.attachments],
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      {/* Aanvrager + organisatie — compact two-column instead of huge section */}
      <section className="space-y-3" aria-labelledby="summary-aanvrager-heading">
        <H3 id="summary-aanvrager-heading" className="m-0">
          {summarySectionTitle}
        </H3>
        <div className="grid gap-component sm:grid-cols-2 rounded-lg border border-border/50 p-section">
          <div className="flex min-w-0 flex-col gap-micro">
            <p className="m-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {summaryRequesterLabel}
            </p>
            <p className="m-0 text-sm font-medium leading-snug text-foreground">
              {summaryRc.requesterName}
            </p>
            {summaryRc.requesterEmail ? (
              <a
                href={`mailto:${summaryRc.requesterEmail}`}
                className="m-0 text-xs text-muted-foreground hover:text-primary"
              >
                {summaryRc.requesterEmail}
              </a>
            ) : null}
            <p className="sr-only">{summaryRequesterEmailLabel}</p>
          </div>
          <div className="flex min-w-0 flex-col gap-micro">
            <p className="m-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {summaryOrganizationLabel}
            </p>
            <p className="m-0 text-sm font-medium leading-snug text-foreground">
              {summaryRc.organizationName}
            </p>
            {summaryRc.organizationDetails ? (
              <div className="text-xs text-muted-foreground [&_p]:m-0 [&_p+p]:mt-micro">
                {summaryRc.organizationDetails}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <SummarySection
        id="summary-legal-entities-heading"
        title="Juridische entiteiten"
        description="Maatschappelijke zetel en eventuele extra vestigingen."
      >
        <Table
          containerClassName="min-w-0 overflow-x-hidden"
          className="w-full text-xs leading-snug"
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="whitespace-normal font-semibold">Soort</TableHead>
              <TableHead className="min-w-0 whitespace-normal font-semibold">Naam</TableHead>
              <TableHead className="min-w-0 whitespace-normal font-semibold">Adres</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="align-top">
              <TableCell className="whitespace-normal wrap-break-word text-muted-foreground">
                Maatschappelijke zetel
              </TableCell>
              <TableCell className="min-w-0 whitespace-normal wrap-break-word font-medium text-foreground">
                {context.organizationName.trim() || "—"}
              </TableCell>
              <TableCell className="min-w-0 whitespace-normal wrap-break-word text-muted-foreground">
                {[formatPostalAddressDisplay(context), context.country?.trim()]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </TableCell>
            </TableRow>
            {context.onboardingVestigingen.map((ve) => (
              <TableRow key={ve.id} className="align-top">
                <TableCell className="whitespace-normal wrap-break-word text-muted-foreground">
                  Vestiging
                </TableCell>
                <TableCell className="min-w-0 whitespace-normal wrap-break-word font-medium text-foreground">
                  {ve.legalName.trim() || "—"}
                </TableCell>
                <TableCell className="min-w-0 whitespace-normal wrap-break-word text-muted-foreground">
                  {formatOnboardingVestigingPostalLine(ve)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SummarySection>

      <SummarySection
        id="summary-persons-heading"
        title="Geregistreerde personen"
        description="Kies wie we onboarden op het Klantenportaal."
      >
        {context.onboardingRegisteredPersons.length === 0 ? (
          <p className="m-0 px-section py-component text-sm text-muted-foreground" role="status">
            Nog geen personen in het register voor deze sessie.
          </p>
        ) : (
          <Table
            containerClassName="min-w-0 overflow-x-hidden"
            className="w-full text-xs leading-snug"
          >
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-0 whitespace-normal font-semibold">Naam</TableHead>
                <TableHead className="min-w-0 whitespace-normal font-semibold">Rollen</TableHead>
                <TableHead className="min-w-0 whitespace-normal text-right font-semibold">
                  Klantenportaal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {context.onboardingRegisteredPersons.map((p) => {
                const roles = summaryRolesForRegisteredPerson(context, p);
                const klantenportaalOn = summaryKlantenportaalByPersonId[p.id] !== false;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word align-top font-medium text-foreground">
                      {summaryDisplayNameForRegisteredPerson(p)}
                    </TableCell>
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word align-top text-muted-foreground">
                      {roles.length > 0 ? (
                        <ul className="m-0 list-outside space-y-0.5 ps-4 text-xs leading-relaxed">
                          {roles.map((roleLabel) => (
                            <li key={roleLabel} className="wrap-break-word">
                              {roleLabel}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-0 align-top whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Label htmlFor={`klantenportaal-redesign-${p.id}`} className="sr-only">
                          Klantenportaal voor {summaryDisplayNameForRegisteredPerson(p)}
                        </Label>
                        <Switch
                          id={`klantenportaal-redesign-${p.id}`}
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
        )}
      </SummarySection>

      {productGroups.length > 0 ? (
        <SummarySection
          id="summary-products-heading"
          title="Productcertificaties"
          description="Gekozen producten en bijbehorende certificaattypes."
        >
          <div className="p-section">
            <ProductInquiryMatrix groups={productGroups} />
          </div>
        </SummarySection>
      ) : null}

      {showInnovationAttestSummary &&
      (innovationSummaryRows.length > 0 || innovationAttachmentItems.length > 0) ? (
        <SummarySection
          id="summary-innovation-attest-heading"
          title="Innovatie-attest"
          description="Ingevulde velden en geüploade documenten."
        >
          {innovationSummaryRows.length > 0 ? (
            <Table
              containerClassName="min-w-0 overflow-x-hidden"
              className="w-full text-xs leading-snug"
            >
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-0 whitespace-normal font-semibold">Veld</TableHead>
                  <TableHead className="min-w-0 whitespace-normal font-semibold">Inhoud</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {innovationSummaryRows.map((row) => (
                  <TableRow key={row.id} className="align-top">
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word font-medium text-foreground">
                      {row.label}
                    </TableCell>
                    <TableCell className="min-w-0 whitespace-pre-line wrap-break-word text-muted-foreground">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
          {innovationAttachmentItems.length > 0 ? (
            <div className="space-y-2 border-t border-border/50 p-section">
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Geüploade documenten
              </p>
              <DownloadableItemGrid items={innovationAttachmentItems} />
            </div>
          ) : null}
        </SummarySection>
      ) : null}

      {showMetrologySummary &&
      (metrologySummaryRows.length > 0 || metrologyAttachmentItems.length > 0) ? (
        <SummarySection
          id="summary-metrology-heading"
          title="Metrologie"
          description="Ingevulde velden en tijdelijk toegevoegde documenten."
        >
          {metrologySummaryRows.length > 0 ? (
            <Table
              containerClassName="min-w-0 overflow-x-hidden"
              className="w-full text-xs leading-snug"
            >
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-0 whitespace-normal font-semibold">Veld</TableHead>
                  <TableHead className="min-w-0 whitespace-normal font-semibold">Inhoud</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrologySummaryRows.map((row) => (
                  <TableRow key={row.id} className="align-top">
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word font-medium text-foreground">
                      {row.label}
                    </TableCell>
                    <TableCell className="min-w-0 whitespace-pre-line wrap-break-word text-muted-foreground">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
          {metrologyAttachmentItems.length > 0 ? (
            <div className="space-y-2 border-t border-border/50 p-section">
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Bijlagen tijdens deze sessie
              </p>
              <DownloadableItemGrid items={metrologyAttachmentItems} />
            </div>
          ) : null}
        </SummarySection>
      ) : null}

      {drafts.length > 0 ? (
        <SummarySection
          id="summary-included-drafts-heading"
          title="In te dienen aanvragen"
          description="Vink uit wat u nog niet wilt indienen. U kunt de aanvraag later aanvullen."
        >
          <div className="flex flex-wrap items-center gap-2 px-section pt-section">
            {effectiveSummaryIncludedDraftIds.length < drafts.length ? (
              <Badge variant="secondary">
                {effectiveSummaryIncludedDraftIds.length} van {drafts.length} in aanvraag
              </Badge>
            ) : (
              <Badge variant="secondary">{drafts.length} certificatievragen in aanvraag</Badge>
            )}
          </div>
          <Table
            containerClassName="min-w-0 overflow-x-hidden"
            className="w-full text-xs leading-snug"
          >
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-0 whitespace-normal font-semibold">
                  <span className="sr-only">Selecteer</span>
                </TableHead>
                <TableHead className="min-w-0 whitespace-normal font-semibold">Aanvraag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDraftsForChecklist.map((draft) => {
                const checked = effectiveSummaryIncludedDraftIds.includes(draft.id);
                const id = `summary-include-redesign-${draft.id}`;
                return (
                  <TableRow key={draft.id} className="align-top">
                    <TableCell className="min-w-0">
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={(v) => onDraftIncludedChange(draft.id, v === true)}
                      />
                    </TableCell>
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word">
                      <Label htmlFor={id} className="cursor-pointer">
                        <span
                          className={cn(
                            "block font-medium text-foreground",
                            !checked && "text-muted-foreground line-through",
                          )}
                        >
                          {draft.label}
                        </span>
                        <span className="block text-xs text-muted-foreground [&_.font-medium]:text-foreground">
                          <DraftCardDescription draft={draft} />
                        </span>
                      </Label>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </SummarySection>
      ) : (
        <p className="m-0 text-sm text-muted-foreground" role="status">
          Geen certificatieconcepten in dit dossier.
        </p>
      )}

      {submissionNoteUnlocked ? (
        <section
          className={cn(
            "flex w-full min-w-0 flex-col gap-component rounded-lg border bg-card p-section",
            "focus-within:ring-3 focus-within:ring-ring/50",
            submissionNoteDraft.trim().length > 0 ? "border-primary/50" : "border-border/60",
          )}
          aria-labelledby="summary-submission-note-heading-redesign"
        >
          <H3 id="summary-submission-note-heading-redesign" className="m-0">
            Begeleidende toelichting
          </H3>
          <ProductRequestNoteField
            value={submissionNoteDraft}
            onChange={(v) => setFlowState((prev) => ({ ...prev, submissionNote: v }))}
            required={false}
            maxLength={PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG}
            rows={6}
            bordered={false}
            autoFocus={false}
            placeholder="Geef hier aanvullende informatie over de aanvraag."
            aria-labelledby="summary-submission-note-heading-redesign"
          />
        </section>
      ) : null}
    </div>
  );
}
