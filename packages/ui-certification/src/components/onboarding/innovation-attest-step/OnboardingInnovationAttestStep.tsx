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
import type {
  InnovationAttestCapture,
  InnovationAttestMockAttachment,
} from "../../../onboarding/onboarding-types";
import {
  innovationAttestPrototypeRequiredFieldPreset,
  isInnovationAttestCaptureComplete,
} from "../../../onboarding/onboarding-innovation-attest";

/** Fictieve bestanden voor de prototypeknop (los van echte drag/drop-upload). */
const INNOVATION_ATTEST_PROTOTYPE_DEMO_BLUEPRINT: ReadonlyArray<{
  name: string;
  sizeLabel: string;
}> = [
  { name: "Overzichtstabel_proeven_innovatieproduct.pdf", sizeLabel: "142 KB · voorbeeld" },
  { name: "Proefverslag_labonderzoek.pdf", sizeLabel: "2,1 MB · voorbeeld" },
  { name: "Pilootproject_notities.docx", sizeLabel: "88 KB · voorbeeld" },
];

function innovationAttestPrototypeDemoAttachments(seed: string): InnovationAttestMockAttachment[] {
  return INNOVATION_ATTEST_PROTOTYPE_DEMO_BLUEPRINT.map((row, index) => ({
    id: `prototype-demo-${seed}-${index}`,
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

export function OnboardingInnovationAttestStep() {
  const baseId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const uploadRequirementsId = `${baseId}-upload-requirements`;
  const dropzoneId = `${baseId}-dropzone`;
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const { flowState, setFlowState } = useOnboardingFlowContext();
  const capture = flowState.innovationAttestInquiry.capture;

  const patchCapture = useCallback(
    (patch: Partial<InnovationAttestCapture>) => {
      setFlowState((prev) => ({
        ...prev,
        innovationAttestInquiry: {
          ...prev.innovationAttestInquiry,
          capture: { ...prev.innovationAttestInquiry.capture, ...patch },
        },
      }));
    },
    [setFlowState],
  );

  const appendAttachments = useCallback(
    (entries: InnovationAttestMockAttachment[]) => {
      setFlowState((prev) => ({
        ...prev,
        innovationAttestInquiry: {
          ...prev.innovationAttestInquiry,
          capture: {
            ...prev.innovationAttestInquiry.capture,
            attachments: [...prev.innovationAttestInquiry.capture.attachments, ...entries],
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
        id: `upload-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
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
        innovationAttestInquiry: {
          ...prev.innovationAttestInquiry,
          capture: {
            ...prev.innovationAttestInquiry.capture,
            attachments: prev.innovationAttestInquiry.capture.attachments.filter(
              (a) => a.id !== id,
            ),
          },
        },
      }));
    },
    [setFlowState],
  );

  const addPrototypeDemoAttachments = useCallback(() => {
    const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    appendAttachments(innovationAttestPrototypeDemoAttachments(seed));
  }, [appendAttachments]);

  const applyPrototypeRequiredPreset = useCallback(() => {
    patchCapture(innovationAttestPrototypeRequiredFieldPreset());
  }, [patchCapture]);

  const requiredFieldsComplete = isInnovationAttestCaptureComplete(capture);

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
            Zet demo-gegevens in de verplichte tekstvelden (gemarkeerd met *) en vink Akkoord
            bouwheer aan zodat u de knop Verder kunt testen zonder alles handmatig in te vullen.
          </>
        }
        notice={
          <>
            Dit zijn fictieve teksten en adressen. Voor een echte aanvraag vervangt u ze door uw
            eigen inhoud.
          </>
        }
        demoBadgeTitle="Prototype: automatisch ingevulde demo-tekst voor validatie-test."
        demoBadgeLabel="Prototype"
      >
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={applyPrototypeRequiredPreset}
        >
          Vul verplichte velden (demo)
        </Button>
      </PrototypeCard>

      <div className="space-y-4">
        <div className="space-y-1">
          <H4 className="normal-case tracking-tight text-foreground">
            Innovatief product
          </H4>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormTextarea
            id={pid("prod-desc")}
            label="Productbeschrijving"
            description="Beschrijf het innovatieve product zoals u het voor het attest wilt onderbouwen."
            value={capture.productDescription}
            onChange={(v) => patchCapture({ productDescription: v })}
            required
          />
          <FormTextarea
            id={pid("applications")}
            label="Toepassingen"
            description="Waar en waarvoor wordt het product gebruikt (context, bouwtypes, omstandigheden)?"
            value={capture.applications}
            onChange={(v) => patchCapture({ applications: v })}
            required
          />
          <FormTextarea
            id={pid("gap")}
            label="Motivering buiten bestaande voorschriften"
            description="Leg uit waarom het product niet onder de bestaande voorschriften past (normen, PTV, standaardbestekken enz.)."
            value={capture.regulatoryGapArgumentation}
            onChange={(v) => patchCapture({ regulatoryGapArgumentation: v })}
            required
          />
          <FormTextarea
            id={pid("group")}
            label="Gereglementeerde productgroep"
            description="Welke gereglementeerde productgroep sluit het best aan bij dit product voor het gekozen project?"
            value={capture.regulatedProductGroup}
            onChange={(v) => patchCapture({ regulatedProductGroup: v })}
          />
          <FormTextarea
            id={pid("tech")}
            label="Technische beschrijving"
            description="Grondstoffen, samenstelling, afmetingen en andere technische kenmerken die de prestaties verklaren."
            value={capture.technicalDescription}
            onChange={(v) => patchCapture({ technicalDescription: v })}
          />
          <FormTextarea
            id={pid("deviate")}
            label="Afwijkende kenmerken"
            description="Alleen invullen als het product afwijkt van de gekozen productgroep: wat wijkt af en hoe?"
            value={capture.deviatingCharacteristics}
            onChange={(v) => patchCapture({ deviatingCharacteristics: v })}
          />
          <FormTextarea
            id={pid("exec")}
            label="Uitvoering en nabehandeling"
            description="Alleen invullen als er bijzondere uitvoerings- of nabehandelingseisen gelden voor het gebruik van het product."
            value={capture.executionRequirements}
            onChange={(v) => patchCapture({ executionRequirements: v })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <H4 className="normal-case tracking-tight text-foreground">Bewijsvoering</H4>
          <p id={uploadRequirementsId} className="text-xs leading-relaxed text-muted-foreground">
            Voeg bestaande bewijsvoering toe: een samenvattende overzichtstabel van (lopende)
            proeven met uitvoerder, methode en resultaten die de technische beschrijving
            ondersteunen; proefverslagen van onderzoeksinstellingen; en beschrijvingen van eerdere
            pilootprojecten.
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
              <span className="text-xs text-muted-foreground">
                Meerdere bestanden mogelijk · tijdelijk in deze sessie
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-fit gap-2"
              onClick={openFilePicker}
            >
              <HugeiconsIcon icon={Upload01Icon} className="size-4" strokeWidth={1.5} />
              Bestanden kiezen…
            </Button>

            <FieldDescription>
              Sleep dossiers naar het vlak hierboven of gebruik de knop Bestanden kiezen. Dit
              vervangt geen officiële upload; niets wordt naar Procerts gestuurd.
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
            <>
              Gebruik onderstaande knop om fictieve dossierbestanden toe te voegen aan de lijst
              hierboven — hetzelfde patroon als bij echte uploads, maar met vaste voorbeelden.
            </>
          }
          notice={
            <>
              Alle bijlagen op deze stap zijn tijdelijk en worden niet opgeslagen bij Procerts. De
              voorbeeldnamen zijn schijn; voor een echte aanvraag lever u uw eigen bewijsstukken
              aan. U kunt elk bestand, ook de voorbeelden, verwijderen via Verwijder naast de naam.
            </>
          }
          demoBadgeTitle="Prototype: voorbeeldbestanden zijn fictief en niet-verzendbaar."
          demoBadgeLabel="Prototype"
        >
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={addPrototypeDemoAttachments}
          >
            <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={1.5} />
            Voeg voorbeeldbestanden toe
          </Button>
        </PrototypeCard>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <H4 className="normal-case tracking-tight text-foreground">
            Project en bouwheer
          </H4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Gegevens over het project waarin het innovatieve product wordt toegepast.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            id={pid("client")}
            label="Bouwheer"
            description="Naam van de bouwheer (natuurlijke persoon of rechtspersoon)."
            value={capture.clientName}
            onChange={(v) => patchCapture({ clientName: v })}
            required
          />
          <FormInput
            id={pid("client-addr")}
            label="Adres bouwheer"
            description="Volledig adres van de bouwheer."
            value={capture.clientAddress}
            onChange={(v) => patchCapture({ clientAddress: v })}
          />
          <FormInput
            id={pid("proj-name")}
            label="Projectnaam"
            description="De naam waaronder het bouwproject bekendstaat."
            value={capture.projectName}
            onChange={(v) => patchCapture({ projectName: v })}
            required
          />
          <FormInput
            id={pid("proj-addr")}
            label="Projectadres"
            description="Locatie van de werf of het gebouw waar het product wordt toegepast."
            value={capture.projectAddress}
            onChange={(v) => patchCapture({ projectAddress: v })}
          />
          <FormInput
            id={pid("contact")}
            label="Contactpersoon bouwheer"
            description="Aanspreekpunt van de bouwheer voor dit project."
            value={capture.clientContactName}
            onChange={(v) => patchCapture({ clientContactName: v })}
          />
          <FormInput
            id={pid("phone")}
            label="Telefoon"
            description="Telefoonnummer van de contactpersoon."
            value={capture.clientContactPhone}
            onChange={(v) => patchCapture({ clientContactPhone: v })}
          />
          <div className="md:col-span-2">
            <FormInput
              id={pid("email")}
              label="E-mail"
              description="E-mailadres van de contactpersoon."
              value={capture.clientContactEmail}
              onChange={(v) => patchCapture({ clientContactEmail: v })}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormTextarea
            id={pid("proj-desc")}
            label="Projectbeschrijving"
            description="Toepassing, volumes, afmetingen, uitvoeringsperiode, gewenste levensduur en andere relevante projectelementen."
            value={capture.projectDescription}
            onChange={(v) => patchCapture({ projectDescription: v })}
            minRows={5}
          />
          <FormTextarea
            id={pid("performance")}
            label="Gevraagde prestaties"
            description="Welke prestaties moet het product leveren, of verwijs naar een vergelijkbaar gereglementeerd product voor dezelfde toepassing."
            value={capture.requestedPerformance}
            onChange={(v) => patchCapture({ requestedPerformance: v })}
          />
          <FormTextarea
            id={pid("risks")}
            label="Ontoelaatbare risico's"
            description="Risico's die de bouwheer voor dit project niet aanvaardt (bv. instorting, buiging, lekkage)."
            value={capture.unacceptableRisks}
            onChange={(v) => patchCapture({ unacceptableRisks: v })}
          />
          <div className="md:col-span-2">
            <Field data-required="" className="gap-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={pid("consent")}
                  checked={capture.clientConsentAccepted}
                  onCheckedChange={(checked) =>
                    patchCapture({ clientConsentAccepted: checked === true })
                  }
                  aria-required
                  aria-describedby={`${pid("consent")}-desc`}
                  className="mt-1 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <FieldLabel htmlFor={pid("consent")} className="leading-snug">
                    <span className="inline-flex flex-wrap items-baseline gap-x-1">
                      <span>Akkoord bouwheer</span>
                      <span className="font-semibold text-foreground" aria-hidden="true">
                        *
                      </span>
                    </span>
                    <span className="sr-only"> Verplicht veld.</span>
                  </FieldLabel>
                  <FieldDescription id={`${pid("consent")}-desc`}>
                    Ik bevestig namens de bouwheer dat relevante projectgegevens in het dossier
                    mogen worden opgenomen en gebruikt voor de verdere uitbouw van het attest.
                  </FieldDescription>
                </div>
              </div>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
