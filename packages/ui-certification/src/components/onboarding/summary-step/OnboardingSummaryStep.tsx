import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardList,
  ChoiceCard,
  ChoiceCardGroup,
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

export type OnboardingSummaryStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingSummaryStep({ model }: OnboardingSummaryStepProps) {
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
    onSummaryEditInquiriesClick,
  } = model;

  const submissionNoteDraft = submissionNote ?? "";

  const productGroups = useMemo(() => groupDraftsByProduct(productBoundDrafts(drafts)), [drafts]);
  const productBoundDraftList = useMemo(() => productBoundDrafts(drafts), [drafts]);
  const standaloneDraftList = useMemo(() => standaloneInquiryDrafts(drafts), [drafts]);
  const choiceItems = useMemo(
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
        (d) => d.entryId === "innovation-attest" && effectiveSummaryIncludedDraftIds.includes(d.id),
      ),
    [drafts, effectiveSummaryIncludedDraftIds],
  );
  const innovationSummaryRows = useMemo(
    () => innovationAttestCaptureSummaryRows(innovationAttestInquiry.capture),
    [innovationAttestInquiry.capture],
  );
  const innovationAttachmentItems = useMemo(
    () =>
      innovationAttestAttachmentsAsDownloadableItems(innovationAttestInquiry.capture.attachments),
    [innovationAttestInquiry.capture.attachments],
  );

  const showMetrologySummary = useMemo(
    () =>
      drafts.some((d) => d.entryId === "metrology" && effectiveSummaryIncludedDraftIds.includes(d.id)),
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
    <div className="flex w-full min-w-0 flex-col gap-8">
      <section className="space-y-4" aria-labelledby="summary-aanvrager-heading">
        <H3
          id="summary-aanvrager-heading"
          className="m-0"
        >
          {summarySectionTitle}
        </H3>
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
      </section>

      <section className="space-y-3" aria-labelledby="summary-legal-entities-heading">
        <H3
          id="summary-legal-entities-heading"
          className="m-0"
        >
          Geregistreerde juridische entiteiten
        </H3>
        <p className="m-0 text-sm text-muted-foreground">
          De maatschappelijke zetel en eventuele vestigingen die u tijdens registratie heeft
          vastgelegd.
        </p>
        <div className="w-full min-w-0 rounded-lg border border-border/50  mt-2">
          <Table
            containerClassName="min-w-0 overflow-x-hidden"
            className="w-full table-fixed text-xs leading-snug"
          >
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[22%] whitespace-normal font-semibold">Soort</TableHead>
                <TableHead className="w-[28%] min-w-0 whitespace-normal font-semibold">
                  Naam
                </TableHead>
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
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="summary-persons-heading">
        <H3
          id="summary-persons-heading"
          className="m-0"
        >
          Geregistreerde personen
        </H3>
        <p className="m-0 text-sm text-muted-foreground">
          Kies wie we onboarden op het Klantenportaal.
        </p>
        {context.onboardingRegisteredPersons.length === 0 ? (
          <p className="m-0 text-sm text-muted-foreground" role="status">
            Nog geen personen in het register voor deze sessie.
          </p>
        ) : (
          <div className="w-full min-w-0 rounded-lg border border-border/50 mt-2">
            <Table
              containerClassName="min-w-0 overflow-x-hidden"
              className="w-full table-fixed text-xs leading-snug"
            >
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[26%] min-w-0 whitespace-normal font-semibold">
                    Naam
                  </TableHead>
                  <TableHead className="w-[54%] min-w-0 whitespace-normal font-semibold">
                    Rollen
                  </TableHead>
                  <TableHead className="w-[20%] min-w-0 whitespace-normal text-right font-semibold">
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
                          <Label htmlFor={`klantenportaal-${p.id}`} className="sr-only">
                            Klantenportaal voor {summaryDisplayNameForRegisteredPerson(p)}
                          </Label>
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

      <div className="flex w-full min-w-0 flex-col gap-6">
        {productGroups.length > 0 ? (
          <Card className="w-full min-w-0 overflow-hidden">
            <CardHeader>
              <CardTitle>Productcertificaties</CardTitle>
              <CardDescription>
                Overzicht van gekozen producten en bijbehorende certificaattypes in dit dossier.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductInquiryMatrix groups={productGroups} />
            </CardContent>
          </Card>
        ) : null}

        {showInnovationAttestSummary ? (
          <Card className="w-full min-w-0 overflow-hidden">
            <CardHeader>
              <CardTitle>In innovatie-attest ingevulde gegevens</CardTitle>
              <CardDescription>
                Alleen ingevulde velden en geüploade documenten uit de stap Innovatie-attest (voor
                zover opgenomen in deze indiening).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-component px-0 sm:px-6">
              {innovationSummaryRows.length > 0 ? (
                <div className="w-full min-w-0 px-0 sm:px-0">
                  <Table
                    containerClassName="min-w-0 overflow-x-hidden"
                    className="w-full table-fixed text-xs leading-snug"
                  >
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[32%] min-w-0 whitespace-normal font-semibold">
                          Veld
                        </TableHead>
                        <TableHead className="min-w-0 whitespace-normal font-semibold">
                          Inhoud
                        </TableHead>
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
                </div>
              ) : null}
              {innovationAttachmentItems.length > 0 ? (
                <div className="flex w-full min-w-0 flex-col gap-2">
                  <p className="m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Geüploade documenten
                  </p>
                  <DownloadableItemGrid items={innovationAttachmentItems} />
                </div>
              ) : null}
              {innovationSummaryRows.length === 0 && innovationAttachmentItems.length === 0 ? (
                <p className="m-0 text-sm text-muted-foreground" role="status">
                  Geen ingevulde velden of bijlagen voor het innovatie-attest.
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {showMetrologySummary ? (
          <Card className="w-full min-w-0 overflow-hidden">
            <CardHeader>
              <CardTitle>In metrologie ingevulde gegevens</CardTitle>
              <CardDescription>
                Alleen ingevulde velden en tijdelijk toegevoegde documenten uit de stap Metrologie (voor
                zover opgenomen in deze indiening).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-component px-0 sm:px-6">
              {metrologySummaryRows.length > 0 ? (
                <div className="w-full min-w-0 px-0 sm:px-0">
                  <Table
                    containerClassName="min-w-0 overflow-x-hidden"
                    className="w-full table-fixed text-xs leading-snug"
                  >
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[32%] min-w-0 whitespace-normal font-semibold">
                          Veld
                        </TableHead>
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
                </div>
              ) : null}
              {metrologyAttachmentItems.length > 0 ? (
                <div className="flex w-full min-w-0 flex-col gap-2">
                  <p className="m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Bijlagen tijdens deze sessie
                  </p>
                  <DownloadableItemGrid items={metrologyAttachmentItems} />
                </div>
              ) : null}
              {metrologySummaryRows.length === 0 && metrologyAttachmentItems.length === 0 ? (
                <p className="m-0 text-sm text-muted-foreground" role="status">
                  Geen ingevulde velden of bijlagen voor metrologie.
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {drafts.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {effectiveSummaryIncludedDraftIds.length < drafts.length ? (
                <Badge variant="secondary">
                  {effectiveSummaryIncludedDraftIds.length} van {drafts.length} in aanvraag
                </Badge>
              ) : (
                <Badge variant="secondary">{drafts.length} certificatievragen in aanvraag</Badge>
              )}
            </div>
            <ChoiceCardGroup selectionMode="multiple">
              <CardList items={choiceItems} widthClass="@min-[40rem]:grid-cols-1">
                {(draft) => (
                  <ChoiceCard
                    key={draft.id}
                    selectionMode="multiple"
                    value={draft.id}
                    controlId={`onboarding-summary-draft-${draft.id}`}
                    title={draft.label}
                    description={<DraftCardDescription draft={draft} />}
                    checked={effectiveSummaryIncludedDraftIds.includes(draft.id)}
                    onCheckedChange={(checked) => onDraftIncludedChange(draft.id, checked === true)}
                    variant="elevated"
                  />
                )}
              </CardList>
            </ChoiceCardGroup>
            {onSummaryEditInquiriesClick ? (
              <Button type="button" variant="outline" onClick={onSummaryEditInquiriesClick}>
                Aanvragen wijzigen
              </Button>
            ) : null}
          </>
        ) : (
          <>
            <p className="m-0 text-sm text-muted-foreground" role="status">
              Geen certificatieconcepten in dit dossier.
            </p>
            {onSummaryEditInquiriesClick ? (
              <Button type="button" variant="outline" onClick={onSummaryEditInquiriesClick}>
                Aanvragen wijzigen
              </Button>
            ) : null}
          </>
        )}
      </div>

      {submissionNoteUnlocked ? (
        <section
          className={cn(
            "flex w-full min-w-0 flex-col gap-component rounded-xl border bg-card p-section text-card-foreground transition-colors",
            "focus-within:ring-3 focus-within:ring-ring/50",
            submissionNoteDraft.trim().length > 0 ? "border-primary/50" : "border-border",
          )}
          aria-labelledby="summary-submission-note-heading"
        >
          <H3
            id="summary-submission-note-heading"
            className="m-0"
          >
            Begeleidende toelichting
          </H3>
          <ProductRequestNoteField
            value={submissionNoteDraft}
            onChange={(v) =>
              setFlowState((prev) => ({
                ...prev,
                submissionNote: v,
              }))
            }
            required={false}
            maxLength={PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG}
            rows={6}
            bordered={false}
            autoFocus={false}
            placeholder="Geef hier aanvullende informatie over de aanvraag, die relevant is voor de beoordeling."
            aria-labelledby="summary-submission-note-heading"
          />
        </section>
      ) : null}
    </div>
  );
}
