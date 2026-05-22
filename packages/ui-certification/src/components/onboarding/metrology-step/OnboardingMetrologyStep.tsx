import { Add01Icon, Cancel01Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Checkbox,
  cn,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  H4,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  Textarea,
} from "@procertus-ui/ui";
import { PrototypeCard } from "@procertus-ui/ui-pt1-prototype";
import { useCallback, useId, useRef, useState, type DragEvent } from "react";

import { useOnboardingFlowContext } from "../../../onboarding/onboarding-flow-provider";
import type { InnovationAttestMockAttachment, MetrologyCapture } from "../../../onboarding/onboarding-types";
import {
  isMetrologyCaptureComplete,
  metrologyPrototypeRequiredFieldPreset,
} from "../../../onboarding/onboarding-metrology";

const METROLOGY_PROTOTYPE_DEMO_BLUEPRINT: ReadonlyArray<{ name: string; sizeLabel: string }> = [
  { name: "Kalibratielijst_lab_voorbeeld.pdf", sizeLabel: "96 KB · voorbeeld" },
  { name: "Overzicht_meetmiddelen_demo.xlsx", sizeLabel: "44 KB · voorbeeld" },
];

function prototypeDemoAttachments(seed: string): InnovationAttestMockAttachment[] {
  return METROLOGY_PROTOTYPE_DEMO_BLUEPRINT.map((row, index) => ({
    id: `prototype-metrology-${seed}-${index}`,
    name: row.name,
    sizeLabel: row.sizeLabel,
  }));
}

function FormTextarea({
  id,
  label,
  description,
  value,
  onChange,
  minRows = 4,
  required = false,
}: {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (next: string) => void;
  minRows?: number;
  required?: boolean;
}) {
  return (
    <Field data-required={required ? "" : undefined} className="min-w-0">
      <FieldLabel htmlFor={id}>
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>{label}</span>
          {required ? (
            <span className="font-semibold text-foreground" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
        {required ? <span className="sr-only"> Verplicht veld.</span> : null}
      </FieldLabel>
      <FieldContent>
        <Textarea
          id={id}
          value={value}
          rows={minRows}
          required={required}
          aria-required={required}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-22 resize-y"
          aria-describedby={`${id}-desc`}
        />
        <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>
      </FieldContent>
    </Field>
  );
}

function FormInput({
  id,
  label,
  description,
  value,
  onChange,
  required = false,
}: {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
}) {
  return (
    <Field data-required={required ? "" : undefined} className="min-w-0">
      <FieldLabel htmlFor={id}>
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>{label}</span>
          {required ? (
            <span className="font-semibold text-foreground" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
        {required ? <span className="sr-only"> Verplicht veld.</span> : null}
      </FieldLabel>
      <FieldContent>
        <Input
          id={id}
          type="text"
          value={value}
          required={required}
          aria-required={required}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={`${id}-desc`}
        />
        <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>
      </FieldContent>
    </Field>
  );
}

export function OnboardingMetrologyStep() {
  const baseId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const uploadRequirementsId = `${baseId}-upload-requirements`;
  const dropzoneId = `${baseId}-dropzone`;
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const { flowState, setFlowState } = useOnboardingFlowContext();
  const capture = flowState.metrologyInquiry.capture;

  const patchCapture = useCallback(
    (patch: Partial<MetrologyCapture>) => {
      setFlowState((prev) => ({
        ...prev,
        metrologyInquiry: {
          ...prev.metrologyInquiry,
          capture: { ...prev.metrologyInquiry.capture, ...patch },
        },
      }));
    },
    [setFlowState],
  );

  const appendAttachments = useCallback(
    (entries: InnovationAttestMockAttachment[]) => {
      setFlowState((prev) => ({
        ...prev,
        metrologyInquiry: {
          ...prev.metrologyInquiry,
          capture: {
            ...prev.metrologyInquiry.capture,
            attachments: [...prev.metrologyInquiry.capture.attachments, ...entries],
          },
        },
      }));
    },
    [setFlowState],
  );

  const handleMockFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      const added = Array.from(list).map((file, index) => ({
        id: `upload-metrology-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      }));
      appendAttachments(added);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [appendAttachments],
  );

  const removeAttachment = useCallback(
    (id: string) => {
      setFlowState((prev) => ({
        ...prev,
        metrologyInquiry: {
          ...prev.metrologyInquiry,
          capture: {
            ...prev.metrologyInquiry.capture,
            attachments: prev.metrologyInquiry.capture.attachments.filter((a) => a.id !== id),
          },
        },
      }));
    },
    [setFlowState],
  );

  const addPrototypeDemoAttachments = useCallback(() => {
    const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    appendAttachments(prototypeDemoAttachments(seed));
  }, [appendAttachments]);

  const applyPrototypeRequiredPreset = useCallback(() => {
    patchCapture(metrologyPrototypeRequiredFieldPreset());
  }, [patchCapture]);

  const requiredFieldsComplete = isMetrologyCaptureComplete(capture);

  const endDropzoneDrag = useCallback(() => {
    dragDepthRef.current = 0;
    setDropzoneActive(false);
  }, []);

  const handleDropzoneDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current += 1;
    setDropzoneActive(true);
  }, []);

  const handleDropzoneDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setDropzoneActive(false);
    }
  }, []);

  const handleDropzoneDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDropzoneDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      endDropzoneDrag();
      handleMockFiles(e.dataTransfer.files);
    },
    [endDropzoneDrag, handleMockFiles],
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const pid = (suffix: string) => `${baseId}-${suffix}`;

  return (
    <div className="space-y-6">
      <PrototypeCard
        title="Prototype — verplichte velden invullen"
        description={
          <>
            Vul demo-gegevens in de gemarkeerde velden (*) en vink Akkoord aan om snel naar Verder te testen zonder alle optionele blokken af te werken.
          </>
        }
        notice={
          <>Dit zijn fictieve gegevens voor het prototype-portaal — vervang ze door echte inhoud bij een dossier bij PROCERTUS.</>
        }
        demoBadgeTitle="Prototype: automatisch ingevulde demo voor validatie-test."
        demoBadgeLabel="Prototype"
      >
        <Button type="button" variant="outline" className="gap-2" onClick={applyPrototypeRequiredPreset}>
          Vul verplichte velden (demo)
        </Button>
      </PrototypeCard>

      <div className="space-y-4">
        <div className="space-y-1">
          <H4 className="normal-case tracking-tight text-foreground">Laboratorium en opdracht</H4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Gebaseerd op de publieke beschrijving van de metrologie-dienst PROCERTUS: controle en kalibratie van
            meetuitrusting, rapportage over nauwkeurigheid en precisie, en tussenkomsten ter plaatse in België of het
            buitenland (<a href="https://www.procertus.be/nl/diensten/metrologie/">procertus.be/nl/diensten/metrologie</a>).
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormTextarea
            id={pid("lab-ctx")}
            label="Laboratorium / organisatie"
            description="Korte context waar de apparatuur hoort en welke hoofdactiviteit relevant is voor het traject."
            value={capture.laboratoryContext}
            onChange={(v) => patchCapture({ laboratoryContext: v })}
          />
          <FormTextarea
            id={pid("equip")}
            label="Meetuitrusting en gevraagde kalibratie of verificatie"
            description="Welke apparatusen betrokken zijn (bv. proefmachines krachtketen, weegschalen, zeven, droogovens) en wat PROCERTUS precies voor u uitvoert."
            value={capture.equipmentAndCalibrationNeeds}
            onChange={(v) => patchCapture({ equipmentAndCalibrationNeeds: v })}
            required
          />
          <FormTextarea
            id={pid("norms")}
            label="Referentienormen of certificaat-scope (optioneel)"
            description="U kunt verwijzen naar relevante pagina-scope (bv. 510‑CAL‑certificaat, NBN- of ISO-lijnen)."
            value={capture.standardsReferenced}
            onChange={(v) => patchCapture({ standardsReferenced: v })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <H4 className="normal-case tracking-tight text-foreground">Planning en tussenkomsten</H4>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormTextarea
            id={pid("site")}
            label="Adres tussenkomsten ter plaatse"
            description="Locatie waar de technici van PROCERTUS moeten ingrijpen voor inspectie/kalibratie."
            value={capture.interventionSiteAddress}
            onChange={(v) => patchCapture({ interventionSiteAddress: v })}
            required
          />
          <FormInput
            id={pid("region")}
            label="Regio of land"
            description="Bv. Belgische site, Nederlandse depot of buitenlands labo. Verkort de aanvraagplanning voor interventies ver buiten je zetel."
            value={capture.interventionRegionNotes}
            onChange={(v) => patchCapture({ interventionRegionNotes: v })}
          />
          <FormTextarea
            id={pid("visit")}
            label="Planning en frequentie"
            description="Eenmalige interventie, periodiek schema of gewenst tijdvak."
            value={capture.visitPreferenceNotes}
            onChange={(v) => patchCapture({ visitPreferenceNotes: v })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <H4 className="normal-case tracking-tight text-foreground">Technisch aanspreekpunt</H4>
          <p id={uploadRequirementsId} className="text-xs leading-relaxed text-muted-foreground">
            Voeg overzichtslijsten, kalibratiehistoriek of foto’s bij — deze stap blijft mock; echte dossierupload kan later worden gekoppeld.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => handleMockFiles(e.target.files)}
        />
        <Field className="gap-2">
          <FieldLabel htmlFor={dropzoneId}>Tijdelijke bijlagen</FieldLabel>
          <FieldContent className="gap-3">
            <div
              id={dropzoneId}
              role="button"
              tabIndex={0}
              aria-describedby={uploadRequirementsId}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors outline-none",
                "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
                dropzoneActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/35 bg-muted/20 hover:border-muted-foreground/55 hover:bg-muted/35",
              )}
              onClick={openFilePicker}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFilePicker();
                }
              }}
              onDragEnter={handleDropzoneDragEnter}
              onDragLeave={handleDropzoneDragLeave}
              onDragOver={handleDropzoneDragOver}
              onDrop={handleDropzoneDrop}
            >
              <HugeiconsIcon
                icon={Upload01Icon}
                className={cn(
                  "size-9 transition-colors",
                  dropzoneActive ? "text-primary" : "text-muted-foreground",
                )}
                strokeWidth={1.5}
              />
              <span className="text-sm font-medium text-foreground">
                Sleep bestanden hier of klik om te bladeren
              </span>
              <span className="text-xs text-muted-foreground">Meerdere bestanden mogelijk · tijdelijk in deze sessie</span>
            </div>

            <Button type="button" variant="outline" className="w-fit gap-2" onClick={openFilePicker}>
              <HugeiconsIcon icon={Upload01Icon} className="size-4" strokeWidth={1.5} />
              Bestanden kiezen…
            </Button>

            <FieldDescription>
              Deze uploads zijn placeholders in het prototype-portaal — er wordt nog niets verstuurd naar PROCERTUS.
            </FieldDescription>
          </FieldContent>
        </Field>

        {capture.attachments.length > 0 ? (
          <ItemGroup className="gap-2">
            <p className="text-xs font-medium text-muted-foreground">Toegevoegd in deze sessie</p>
            {capture.attachments.map((file) => (
              <Item key={file.id} variant="outline" className="bg-card py-2">
                <ItemContent>
                  <ItemTitle className="text-sm">{file.name}</ItemTitle>
                  <ItemDescription>{file.sizeLabel}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Verwijder ${file.name}`}
                    onClick={() => removeAttachment(file.id)}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-4" strokeWidth={1.5} />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        ) : null}

        <PrototypeCard
          title="Snel voorbeeldbijlagen (prototype)"
          description={
            <>Voeg vaste fictieve dossierlijsten toe zoals echte uploads, zonder echte inhoud naar externe opslag.</>
          }
          notice={<></>}
          demoBadgeTitle="Demo"
          demoBadgeLabel="Demo"
        >
          <Button type="button" variant="outline" className="gap-2" onClick={addPrototypeDemoAttachments}>
            <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={1.5} />
            Voeg voorbeeldbestanden toe
          </Button>
        </PrototypeCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          id={pid("tech-name")}
          label="Technisch contactpersoon"
          description="Aanspreekpunt voor inhoudelijke opvolging tijdens tussenkomsten."
          value={capture.technicalContactName}
          onChange={(v) => patchCapture({ technicalContactName: v })}
        />
        <FormInput
          id={pid("tech-phone")}
          label="Telefoon"
          description="Mobiel of vaste lijn waar technici terechtkunnen tijdens voorbereiding van interventie."
          value={capture.technicalContactPhone}
          onChange={(v) => patchCapture({ technicalContactPhone: v })}
        />
        <div className="md:col-span-2">
          <FormInput
            id={pid("tech-mail")}
            label="E-mail"
            description="Mailbox voor correspondentie van de planning- en dossiergroep bij PROCERTUS."
            value={capture.technicalContactEmail}
            onChange={(v) => patchCapture({ technicalContactEmail: v })}
            required
          />
        </div>
        <FormTextarea
          id={pid("notes")}
          label="Extra informatie (optioneel)"
          description="Bijzondere veiligheidseisen, toegang tot locatie of referentienummers bij derden."
          value={capture.supplementaryNotes}
          onChange={(v) => patchCapture({ supplementaryNotes: v })}
          minRows={4}
        />
        <Field data-required="" className="gap-3 md:col-span-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id={pid("consent")}
              checked={capture.requesterConsentAccepted}
              onCheckedChange={(checked) => patchCapture({ requesterConsentAccepted: checked === true })}
              aria-required
              aria-describedby={`${pid("consent")}-desc`}
              className="mt-1 shrink-0"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <FieldLabel htmlFor={pid("consent")} className="leading-snug">
                <span className="inline-flex flex-wrap items-baseline gap-x-1">
                  <span>Akkoord gegevens in dossier</span>
                  <span className="font-semibold text-foreground" aria-hidden="true">
                    *
                  </span>
                </span>
                <span className="sr-only"> Verplicht veld.</span>
              </FieldLabel>
              <FieldDescription id={`${pid("consent")}-desc`}>
                Ik mag de technische en locatiegegevens opnemen in het PROCERTUS-dossier zodat de metrologische diensten op basis hiervan kunnen worden opgestart en verder opgevolgd worden.
              </FieldDescription>
            </div>
          </div>
        </Field>
      </div>

      {requiredFieldsComplete ? null : (
        <p role="status" className="text-xs text-muted-foreground">
          Vervul de gemarkeerde verplichte velden en het akkoord vóór Verder naar de volgende stap.
        </p>
      )}
    </div>
  );
}
