import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { CertificationInquiriesOverviewCard } from "../certification-inquiries-overview/CertificationInquiriesOverviewCard";
import {
  summaryDisplayNameForRegisteredPerson,
  summaryRolesForRegisteredPerson,
} from "../../../onboarding/onboarding-flow-helpers";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

export type OnboardingSummaryStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingSummaryStep({ model }: OnboardingSummaryStepProps) {
  const {
    context,
    setFlowState,
    drafts,
    effectiveSummaryIncludedDraftIds,
    rows,
    summaryKlantenportaalByPersonId,
    summaryRequesterLabel,
    summaryRequesterEmailLabel,
    summaryOrganizationLabel,
    summarySectionTitle,
    summaryRc,
    fullPackageEntityRecords,
  } = model;

  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <div className="grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          <section className="space-y-4" aria-labelledby="summary-aanvrager-heading">
            <h3
              id="summary-aanvrager-heading"
              className="m-0 text-base font-semibold leading-snug tracking-tight text-foreground"
            >
              {summarySectionTitle}
            </h3>
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
            <div className="flex flex-wrap items-center gap-2">
              {drafts.length > 0 && effectiveSummaryIncludedDraftIds.length < drafts.length ? (
                <Badge variant="secondary">
                  {effectiveSummaryIncludedDraftIds.length} van {drafts.length} in aanvraag
                </Badge>
              ) : (
                <Badge variant="secondary">{drafts.length} certificatievragen in aanvraag</Badge>
              )}
            </div>
            {rows.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <Table className="text-xs leading-snug tabular-nums">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-2/5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Item
                      </TableHead>
                      <TableHead className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Waarde
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell
                          className={cn(
                            "align-top font-mono text-[11px] leading-relaxed text-muted-foreground",
                          )}
                        >
                          {r.label}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "min-w-0 wrap-break-word align-top font-mono text-[11px] font-normal leading-relaxed text-foreground",
                          )}
                        >
                          {r.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </section>

          <section className="space-y-3" aria-labelledby="summary-persons-heading">
            <h3
              id="summary-persons-heading"
              className="m-0 text-base font-semibold leading-snug tracking-tight text-foreground"
            >
              Geregistreerde personen
            </h3>
            <p className="m-0 text-sm text-muted-foreground">
              Kies wie we onboarden op het Klantenportaal.
            </p>
            {context.onboardingRegisteredPersons.length === 0 ? (
              <p className="m-0 text-sm text-muted-foreground" role="status">
                Nog geen personen in het register voor deze sessie.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <Table className="text-xs leading-snug">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[8rem] font-semibold">Naam</TableHead>
                      <TableHead className="min-w-0 font-semibold">Rollen</TableHead>
                      <TableHead className="w-36 text-right font-semibold">
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
                          <TableCell className="align-top font-medium text-foreground">
                            {summaryDisplayNameForRegisteredPerson(p)}
                          </TableCell>
                          <TableCell className="min-w-0 align-top text-muted-foreground">
                            {roles.length > 0 ? (
                              <ul className="m-0 list-inside list-disc space-y-0.5 p-0">
                                {roles.map((roleLabel) => (
                                  <li key={roleLabel} className="text-xs leading-relaxed">
                                    {roleLabel}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="flex items-center justify-end gap-2">
                              <Label htmlFor={`klantenportaal-${p.id}`} className="sr-only">
                                Klantenportaal voor {summaryDisplayNameForRegisteredPerson(p)}
                              </Label>
                              <span className="text-[10px] text-muted-foreground sm:text-xs">
                                Onboarding
                              </span>
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
        </div>
        <CertificationInquiriesOverviewCard
          drafts={drafts}
          effectiveIncludedDraftIds={effectiveSummaryIncludedDraftIds}
          controlIdPrefix="onboarding-summary-draft"
          onDraftIncludedChange={(draftId, included) => {
            setFlowState((prev) => {
              const ids = prev.drafts.map((d) => d.id);
              const base = prev.summaryIncludedDraftIds ?? [...ids];
              const next = included
                ? Array.from(new Set([...base, draftId]))
                : base.filter((id) => id !== draftId);
              return { ...prev, summaryIncludedDraftIds: next };
            });
          }}
          onEditRequestsClick={() => {}}
        />
      </div>

      <Card className="w-full max-w-none overflow-hidden">
        <CardHeader>
          <CardTitle>Volledig pakketoverzicht</CardTitle>
          <CardDescription>
            Per record één samenvatting van alle bijbehorende gegevens (zoals die worden verstuurd).
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0 sm:px-6">
          <Table className="text-xs leading-snug">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[10rem] font-semibold">Record</TableHead>
                <TableHead className="min-w-0 font-semibold">Gegevens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fullPackageEntityRecords.map((rec) => (
                <TableRow key={rec.id} className="align-top">
                  <TableCell className="font-medium text-foreground">{rec.title}</TableCell>
                  <TableCell className="min-w-0 whitespace-pre-line wrap-break-word text-muted-foreground">
                    {rec.summary.trim() || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
