/** Keuze zetel vs vestigingen, één consolidatietabel per product met productdetails en gekozen rechts‑persoon. */
import {
  ChoiceCard,
  ChoiceCardGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@procertus-ui/ui";
import { DraftCardDescription } from "../../../certification-request/draft-selection-presentation";
import {
  formatVestigingRegistryOptionLabel,
  legalEntityAssignmentDisplayParts,
} from "../../../onboarding/onboarding-flow-helpers";
import { productBoundLegalEntityOverviewRows } from "../../../onboarding/lib/product-bound-certification-inquiry";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { OnboardingVestigingenLegalEntityManager } from "../legal-entity-step/OnboardingVestigingenLegalEntityManager";
import { OnboardingLegalEntityLinkSummaryText } from "../shared/OnboardingInquiryLegalEntityLinkCard";

export type OnboardingCompanyLegalEntitiesStepProps = {
  model: OnboardingRegistrationLayoutModel;
};

export function OnboardingCompanyLegalEntitiesStep({
  model,
}: OnboardingCompanyLegalEntitiesStepProps) {
  const {
    companyLookupPhase,
    context,
    patchContext,
    legalEntityFieldBase,
    draftsInRegistrationScope,
    countrySelectOptions,
    activeVatPreset,
    CERT_INQUIRY_VEST_UNASSIGNED,
    CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
  } = model;

  if (companyLookupPhase !== "ready" || !activeVatPreset) {
    return (
      <p className="text-sm text-muted-foreground">
        Dit scherm wordt actief nadat het opzoeken van uw bedrijfsgegevens is afgerond op de vorige
        stap.
      </p>
    );
  }

  const map = context.certificationInquiryVestigingId;
  const rel = context.headOfficeIsCertificationLegalEntity;

  const productRows = productBoundLegalEntityOverviewRows(draftsInRegistrationScope);

  function setProductGroupAssignment(draftIds: readonly string[], value: string) {
    const next = { ...map };
    const trimmed = value.trim();
    if (!trimmed) {
      for (const id of draftIds) {
        delete next[id];
      }
    } else {
      for (const id of draftIds) {
        next[id] = trimmed;
      }
    }
    patchContext({ certificationInquiryVestigingId: next });
  }

  function assignmentSelectValue(draftIds: readonly string[]): string {
    const primaryId = draftIds[0];
    if (!primaryId) return CERT_INQUIRY_VEST_UNASSIGNED;
    const raw = (map[primaryId] ?? "").trim();
    return raw === "" ? CERT_INQUIRY_VEST_UNASSIGNED : raw;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Productgebonden certificatie-aanvragen in dit dossier
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Kies eerst hoe u juridisch optreedt. Daarna kunt u — waar nodig — in de tabel per product de
          rechts‑persoon voor certificatie vastleggen. Meerdere certificatielijnen op hetzelfde product
          (bv. CE én BENOR) delen één entiteit. U kunt de maatschappelijke zetel gebruiken en/of aparte
          vestigingen registreren — zonder apart btw-nummer.
        </p>
      </div>

      {productRows.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          Er zijn geen productgebonden aanvragen in dit dossier om hier te koppelen.
        </p>
      ) : null}

      <ChoiceCardGroup
        className="p-0"
        layout="grid"
        legend="Hoe wilt u juridisch optreden voor deze productgebonden certificaties?"
        hint="Maak eerst een keuze. Voor aparte vestigingen selecteert u daarna per product in de tabel."
        name={`${legalEntityFieldBase}-legal-entity-mode`}
        value={rel === "" ? undefined : rel}
        onValueChange={(v: string) => {
          if (v !== "yes" && v !== "no") return;
          if (v === "yes") {
            patchContext({
              headOfficeIsCertificationLegalEntity: "yes",
              onboardingVestigingen: [],
              certificationInquiryVestigingId: {},
            });
          } else {
            patchContext({
              headOfficeIsCertificationLegalEntity: "no",
              onboardingVestigingen: [],
              certificationInquiryVestigingId: { ...context.certificationInquiryVestigingId },
            });
          }
        }}
      >
        <ChoiceCard
          value="yes"
          controlId={`${legalEntityFieldBase}-mode-yes`}
          title="Ja, ik gebruik mijn Maatschappelijke Zetel voor alle producten"
          description="Alle productgebonden certificatie-aanvragen in dit dossier lopen juridisch via de officiële zetel zoals op de vorige stap vastgelegd."
          variant="elevated"
          appearance="hero"
          className="h-full min-h-[8rem]"
        />
        <ChoiceCard
          value="no"
          controlId={`${legalEntityFieldBase}-mode-no`}
          title="Nee, ik wil verschillende juridische entiteiten registreren"
          description="U voegt één of meer vestigingen toe en wijs vervolgens in de tabel hieronder per product toe: de zetel of een gekozen vestiging."
          variant="default"
          appearance="hero"
          className="h-full min-h-[8rem]"
        />
      </ChoiceCardGroup>

      {productRows.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Producten en rechts‑persoon
          </h4>
          <Table containerClassName="rounded-lg border border-border">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[14rem] max-w-md">Product</TableHead>
                <TableHead className="min-w-[9rem]">Certificatielijnen</TableHead>
                <TableHead className="min-w-[12rem]">Juridische entiteit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productRows.map((row) => {
                const representativeDraft = row.drafts[0];
                const certLines = row.drafts
                  .map((d) => (d.shortLabel || d.label).trim())
                  .filter(Boolean);
                const certSummary =
                  certLines.length > 0 ? Array.from(new Set(certLines)).join(" · ") : null;
                const zetelParts = legalEntityAssignmentDisplayParts(
                  context,
                  CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
                );
                const draftIds = row.drafts.map((d) => d.id);
                return (
                  <TableRow key={row.productKey}>
                    <TableCell className="align-top whitespace-normal">
                      {representativeDraft ? (
                        <div className="max-w-xl text-sm [&_.font-medium]:text-foreground">
                          <DraftCardDescription draft={representativeDraft} />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-sm leading-snug text-foreground">
                      {certSummary ?? "—"}
                    </TableCell>
                    <TableCell className="align-top whitespace-normal">
                      {rel === "" ? (
                        <OnboardingLegalEntityLinkSummaryText primary="—" />
                      ) : rel === "yes" ? (
                        <OnboardingLegalEntityLinkSummaryText
                          primary={zetelParts.primary}
                          secondary={zetelParts.secondary}
                        />
                      ) : (
                        <Select
                          value={assignmentSelectValue(draftIds)}
                          onValueChange={(v) => {
                            if (v === CERT_INQUIRY_VEST_UNASSIGNED) {
                              setProductGroupAssignment(draftIds, "");
                            } else {
                              setProductGroupAssignment(draftIds, v);
                            }
                          }}
                        >
                          <SelectTrigger size="sm" className="h-auto min-h-9 w-full max-w-md py-2">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value={CERT_INQUIRY_VEST_UNASSIGNED}>
                              <span aria-hidden>—</span>
                              <span className="sr-only">Nog niet gekozen</span>
                            </SelectItem>
                            <SelectItem value={CERT_INQUIRY_LEGAL_ENTITY_ZETEL}>
                              Maatschappelijke zetel
                            </SelectItem>
                            {context.onboardingVestigingen.map((ve) => (
                              <SelectItem key={ve.id} value={ve.id}>
                                {formatVestigingRegistryOptionLabel(ve)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}

      {rel === "no" ? (
        <div className="border-t border-border pt-8">
          <OnboardingVestigingenLegalEntityManager
            fieldBaseId={legalEntityFieldBase}
            context={context}
            patchContext={patchContext}
            countrySelectOptions={countrySelectOptions}
            vestigingBlockAssignmentMaps={[map]}
            heading={
              <div className="space-y-1 pb-6">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Juridische entiteiten registreren (vestigingen)
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Vul hieronder een juridische entiteit in en klik Add. Het land wordt automatisch
                  gelijkgezet met uw maatschappelijke zetel. Na toevoegen verschijnen ze in de
                  lijst; gebruik Bewerken en Save voor wijzigingen. Daarna wijst u toe in de
                  tabel hierboven — één keuze geldt voor alle certificatielijnen op hetzelfde
                  product.
                </p>
              </div>
            }
          />
        </div>
      ) : null}
    </div>
  );
}
