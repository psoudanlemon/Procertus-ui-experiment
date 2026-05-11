/** Overzicht aanvragen, keuzekaarten zetel vs vestigingen, en per-aanvraag toewijzing. */
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
import { DraftCardDescription } from "../../certification-request-wizard/draft-selection-presentation";
import {
  formatPostalAddressDisplay,
  formatVestigingRegistryOptionLabel,
} from "../../../onboarding/onboarding-flow-helpers";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { OnboardingVestigingenLegalEntityManager } from "../legal-entity-step/OnboardingVestigingenLegalEntityManager";

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
  const headOfficeLegalEntityName = context.organizationName.trim();
  const headOfficeLegalEntityAddress = formatPostalAddressDisplay(context);

  function setDraftAssignment(draftId: string, value: string) {
    const next = value.trim()
      ? { ...map, [draftId]: value }
      : (() => {
          const clone = { ...map };
          delete clone[draftId];
          return clone;
        })();
    patchContext({ certificationInquiryVestigingId: next });
  }

  function assignmentSelectValue(draftId: string): string {
    const raw = (map[draftId] ?? "").trim();
    return raw === "" ? CERT_INQUIRY_VEST_UNASSIGNED : raw;
  }

  function assignmentSummaryLabel(draftId: string): string {
    const raw = (map[draftId] ?? "").trim();
    if (!raw) return "—";
    if (raw === CERT_INQUIRY_LEGAL_ENTITY_ZETEL) {
      return headOfficeLegalEntityName
        ? `Maatschappelijke zetel · ${headOfficeLegalEntityName}`
        : "Maatschappelijke zetel";
    }
    const ve = context.onboardingVestigingen.find((x) => x.id === raw);
    return ve ? formatVestigingRegistryOptionLabel(ve) : "—";
  }

  const overviewRows = draftsInRegistrationScope;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Certificatie-aanvragen in dit dossier
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Koppel elke gekozen aanvraag aan de juridische entiteit die voor certificatie optreedt. U
          kunt de maatschappelijke zetel gebruiken en/of aparte vestigingen registreren — zonder
          apart btw-nummer.
        </p>
      </div>

      {overviewRows.length === 0 ?
        <p className="rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          Er zijn in dit dossier geen gekozen certificatieaanvragen om te tonen.
        </p>
      : <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Certificatie / product</TableHead>
                <TableHead className="min-w-[240px]">Juridische entiteit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overviewRows.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell className="align-top">
                    <p className="text-sm font-medium text-foreground">
                      {draft.shortLabel || draft.label}
                    </p>
                    <div className="mt-1 text-xs text-muted-foreground [&_.font-medium]:text-foreground">
                      <DraftCardDescription draft={draft} />
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    {rel === "" ?
                      <span className="text-sm text-muted-foreground">
                        Maak hieronder eerst uw keuze.
                      </span>
                    : rel === "yes" ?
                      <div className="text-sm text-foreground">
                        <span className="font-medium">
                          {headOfficeLegalEntityName || "Maatschappelijke zetel"}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          Maatschappelijke zetel — {headOfficeLegalEntityAddress}
                        </span>
                      </div>
                    : <Select
                        value={assignmentSelectValue(draft.id)}
                        onValueChange={(v) => {
                          if (v === CERT_INQUIRY_VEST_UNASSIGNED) {
                            setDraftAssignment(draft.id, "");
                          } else {
                            setDraftAssignment(draft.id, v);
                          }
                        }}
                      >
                        <SelectTrigger size="sm" className="h-auto min-h-9 w-full max-w-md py-2">
                          <SelectValue placeholder="Kies juridische entiteit" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value={CERT_INQUIRY_VEST_UNASSIGNED}>
                            — Nog niet gekozen —
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
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }

      {overviewRows.length > 0 ?
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Samenvatting toewijzing:</span>{" "}
          {overviewRows.map((d) => (
            <span key={d.id} className="me-4 inline-block last:me-0">
              <span className="text-muted-foreground">{(d.shortLabel || d.label).trim()} → </span>
              <span className="font-medium text-foreground">{assignmentSummaryLabel(d.id)}</span>
            </span>
          ))}
        </p>
      : null}

      <ChoiceCardGroup
        className="p-0"
        layout="grid"
        legend="Hoe wilt u juridisch optreden voor deze certificaties?"
        hint="Maak eerst een keuze. U past daarna per aanvraag toe wanneer u aparte entiteiten gebruikt."
        name={`${legalEntityFieldBase}-legal-entity-mode`}
        value={rel === "" ? undefined : rel}
        onValueChange={(v) => {
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
          title="Ja, ik gebruik mijn Maatschappelijke Zetel voor alle aanvragen"
          description="Alle certificatie-aanvragen in dit dossier lopen juridisch via de officiële zetel zoals op de vorige stap vastgelegd."
          variant="elevated"
          appearance="hero"
          className="h-full min-h-[8rem]"
        />
        <ChoiceCard
          value="no"
          controlId={`${legalEntityFieldBase}-mode-no`}
          title="Nee, ik wil verschillende juridische entiteiten registreren"
          description="U voegt één of meer vestigingen toe en wijs vervolgens in het overzicht hierboven per aanvraag toe: de zetel of een gekozen vestiging."
          variant="default"
          appearance="hero"
          className="h-full min-h-[8rem]"
        />
      </ChoiceCardGroup>

      {overviewRows.length > 0 && rel === "yes" ?
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bevestiging
          </p>
          <p className="mt-2 text-sm text-foreground">
            Voor elke aanvraag in dit dossier geldt uw maatschappelijke zetel als juridische
            tegenpartij voor certificatie.
          </p>
        </div>
      : null}

      {rel === "no" ?
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
                  gelijkgezet met uw maatschappelijke zetel. Na toevoegen verschijnen ze in de lijst;
                  gebruik Bewerken en Save voor wijzigingen. Daarna wijst u toe in het overzicht
                  bovenaan.
                </p>
              </div>
            }
          />
        </div>
      : null}
    </div>
  );
}
