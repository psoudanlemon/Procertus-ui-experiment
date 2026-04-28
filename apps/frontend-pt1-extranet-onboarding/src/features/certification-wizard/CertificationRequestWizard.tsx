import {
  CertificationRequestProvider,
  useCertificationRequestWizardModel,
} from "@procertus-ui/ui-certification";
import { HierarchySquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type {
  CertificationRequestBackend,
  CertificationRequestDraft,
  CertificationRequestProviderProps,
  CertificationRequestStepId,
} from "@procertus-ui/ui-certification";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardList,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  Switch,
  Textarea,
  Timeline,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineDate,
  TimelineTitle,
  cn,
  useIsMobile,
  useConfirm,
} from "@procertus-ui/ui";
import {
  CertificationIntentPicker,
  ProductMultiSelect,
  ProductTreePanel,
  RequestPackageReview,
  defaultCertificationIntentOptionsEn,
} from "@procertus-ui/ui-certification";
import type {
  CertificationIntentId,
  ProductTreeProductNode,
  RequestPackageReviewRequesterPresentation,
} from "@procertus-ui/ui-certification";
import type { DownloadableDocumentListItemData } from "@procertus-ui/ui-lib";
import {
  DownloadableDocumentsList,
  OnboardingStepper,
  SelectChoiceCard,
  SelectChoiceCardGroup,
  StepLayout,
} from "@procertus-ui/ui-lib";
import { useMemo, useState } from "react";

export type CertificationWizardDraft = CertificationRequestDraft;

export type CertificationRequestWizardProps = {
  mode: "onboarding" | "authenticated";
  initialDrafts?: CertificationWizardDraft[];
  initialStep?: CertificationRequestStepId | number;
  backend?: CertificationRequestBackend;
  backendKind?: CertificationRequestProviderProps["backendKind"];
  sessionId?: string;
  storageKey?: string;
  onCancel?: () => void;
  onRequestCreated?: (draft: CertificationWizardDraft) => void;
  onComplete: (drafts: CertificationWizardDraft[]) => void;
  /** Shown on the final review step: current user + company (prototype or real). */
  reviewRequester?: RequestPackageReviewRequesterPresentation;
};

type WizardStepperModel = {
  activeStep: number;
  steps: Array<{ id: string; title: string; description?: string; available?: boolean }>;
  onStepChange: (step: number) => void;
};

function CompactWizardTimeline({ model }: { model: WizardStepperModel }) {
  return (
    <Timeline
      value={model.activeStep + 1}
      orientation="horizontal"
      className="w-full"
      aria-label="Aanvraagstappen"
    >
      {model.steps.map((step, index) => {
        const completedOrActive = index <= model.activeStep;
        const current = index === model.activeStep;
        const available = step.available !== false;
        return (
          <TimelineItem
            key={step.id}
            step={index + 1}
            className={cn("gap-1 pe-2 not-last:pe-4", !completedOrActive && "opacity-50")}
          >
            <TimelineIndicator
              className={cn(
                "bg-card",
                completedOrActive && "border-primary bg-primary/10",
                current && "bg-primary",
              )}
            />
            <TimelineSeparator className={completedOrActive ? "bg-primary" : undefined} />
            <TimelineHeader>
              <button
                type="button"
                className={cn(
                  "text-left text-xs font-medium leading-tight text-muted-foreground",
                  current && "text-foreground",
                  available && "hover:text-foreground",
                  !available && "cursor-default opacity-60",
                )}
                disabled={!available}
                onClick={() => model.onStepChange(index)}
              >
                <TimelineTitle className="text-inherit">{step.title}</TimelineTitle>
                {step.description ? (
                  <TimelineDate className="mb-0 mt-0.5 text-[10px] font-normal leading-tight text-muted-foreground/70">
                    {step.description}
                  </TimelineDate>
                ) : null}
              </button>
            </TimelineHeader>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}

function slugForDocumentHref(raw: string): string {
  const s = raw
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return s.length > 0 ? s.slice(0, 48) : "item";
}

function isProductScopedInquiry(draft: CertificationWizardDraft): boolean {
  return Boolean(
    (draft.productId && draft.productId.trim().length > 0) ||
    (draft.productLabel && draft.productLabel.trim().length > 0),
  );
}

function productDedupKey(draft: CertificationWizardDraft): string | null {
  if (!isProductScopedInquiry(draft)) return null;
  const id = draft.productId?.trim();
  if (id && id.length > 0) return id;
  return draft.productLabel?.trim() ?? null;
}

/**
 * Mock downloadable ruleset / PTV / programme documents for the review step.
 * PTV rows are emitted once per distinct product among product-scoped inquiries;
 * ATG and EPD programme overviews appear only when those intents are in the package.
 */
function buildRulesetDocumentsForInquiries(
  inquiries: readonly CertificationWizardDraft[],
): DownloadableDocumentListItemData[] {
  if (inquiries.length === 0) return [];

  const docs: DownloadableDocumentListItemData[] = [];

  const seenProductKeys = new Set<string>();
  for (const d of inquiries) {
    const key = productDedupKey(d);
    if (!key || seenProductKeys.has(key)) continue;
    seenProductKeys.add(key);
    const label = d.productLabel?.trim() || "Product";
    const stream = d.productTypeStreamLabel?.trim();
    docs.push({
      id: `ptv-${slugForDocumentHref(key)}`,
      title: `Producttechnische fiche (PTV) — ${label}`,
      description: stream
        ? `Technische specificaties en toepasselijke normsegmenten voor ${stream} (${label}) voor de productgebonden aanvragen in dit pakket (prototype).`
        : `Technische specificaties en profieldelen voor ${label} voor de productgebonden aanvragen in dit pakket (prototype).`,
      formatHint: "PDF · mock",
      href: `#procertus-ptv-${slugForDocumentHref(key)}`,
    });
  }

  if (inquiries.some((d) => d.entryId === "atg")) {
    docs.push({
      id: "atg-algemeen",
      title: "ATG — algemene informatie en werkprocedure",
      description:
        "Programma-overzicht voor technische goedkeuring (ATG/BUTG) omdat dit pakket minstens één ATG-aanvraag bevat (prototype).",
      formatHint: "PDF · mock",
      href: "#procertus-atg-algemeen",
    });
  }

  if (inquiries.some((d) => d.entryId === "epd")) {
    docs.push({
      id: "epd-algemeen",
      title: "EPD — milieuprofiel en databanken",
      description:
        "Algemene EPD-werkwijze en referenties naar databanken omdat dit pakket minstens één EPD-aanvraag bevat (prototype).",
      formatHint: "PDF · mock",
      href: "#procertus-epd-algemeen",
    });
  }

  const inquiryLabels = Array.from(new Set(inquiries.map((d) => d.shortLabel ?? d.label)));
  docs.push({
    id: "ruleset-matrix",
    title: "Ruleset matrix — geselecteerde certificeringen en attesten",
    description: `Normenkader en regelpaden voor: ${inquiryLabels.join(" · ")}.`,
    formatHint: "PDF · mock",
    href: "#procertus-doc-ruleset-matrix",
  });

  docs.push({
    id: "submission-checklist",
    title: "Indien-checklist aanvraagpakket",
    description:
      "Controlelijst afgestemd op de samenstelling van dit pakket vóór indiening (prototype).",
    formatHint: "PDF · mock",
    href: "#procertus-doc-submission-checklist",
  });

  return docs;
}

function sortDraftsByIntentAndProduct(
  drafts: Array<CertificationWizardDraft & { title: string; subtitle?: string }>,
) {
  return [...drafts].sort((a, b) => {
    const intent = (a.shortLabel ?? a.label).localeCompare(b.shortLabel ?? b.label);
    if (intent !== 0) return intent;

    const product = (a.productLabel ?? "").localeCompare(b.productLabel ?? "");
    if (product !== 0) return product;

    return (a.productTypeStreamLabel ?? "").localeCompare(b.productTypeStreamLabel ?? "");
  });
}

function DraftCardDescription({
  draft,
}: {
  draft: CertificationWizardDraft & { title: string; subtitle?: string };
}) {
  return (
    <span className="flex flex-col gap-micro">
      {draft.productLabel ? (
        <span className="font-medium text-foreground">
          {draft.productTypeStreamLabel ? (
            <Badge variant="default" className="mr-1">
              {draft.productTypeStreamLabel}
            </Badge>
          ) : null}
          {draft.entryId === "ce" && draft.value ? (
            <Badge variant="outline" className="mr-1">
              {draft.value}
            </Badge>
          ) : null}
          {draft.productLabel}
        </span>
      ) : null}
      {draft.subtitle ? <span className="text-muted-foreground">{draft.subtitle}</span> : null}
      {draft.context ? (
        <span className="mt-micro rounded-md border border-border/60 bg-muted/30 p-component text-foreground">
          <span className="mb-micro block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Aanvraagcontext
          </span>
          {draft.context}
        </span>
      ) : null}
    </span>
  );
}

function CertificationRequestWizardView({
  onCancel,
  onRequestCreated,
  onComplete,
  reviewRequester,
}: Pick<
  CertificationRequestWizardProps,
  "onCancel" | "onRequestCreated" | "onComplete" | "reviewRequester"
>) {
  const model = useCertificationRequestWizardModel({ onCancel, onRequestCreated, onComplete });
  const confirm = useConfirm();
  const authenticated = model.mode === "authenticated";
  const isMobile = useIsMobile();
  const splitProductInquirySteps =
    authenticated && isMobile && model.detailsStep.detailsUseProductTree;
  const [mobileDetailsStep, setMobileDetailsStep] = useState<"product" | "inquiries">("product");
  const effectiveMobileDetailsStep =
    splitProductInquirySteps && model.activeStep === 1 ? mobileDetailsStep : "product";

  const mobileStepper = useMemo(() => {
    if (!splitProductInquirySteps) return model.stepper;

    const [intentStep, productStep, draftsStep, reviewStep] = model.stepper.steps;
    return {
      activeStep:
        model.activeStep < 1
          ? model.activeStep
          : model.activeStep === 1
            ? effectiveMobileDetailsStep === "product"
              ? 1
              : 2
            : model.activeStep + 1,
      steps: [
        intentStep,
        productStep,
        {
          id: "inquiries",
          title: "Aanvragen",
          description: model.detailsStep.selectedProduct
            ? "Kies certificaten en attesten"
            : "Selecteer eerst een product",
          available: Boolean(model.detailsStep.selectedProduct),
        },
        draftsStep,
        reviewStep,
      ].filter((step): step is NonNullable<typeof step> => step != null),
      onStepChange: (step: number) => {
        if (step <= 1) {
          setMobileDetailsStep("product");
          model.stepper.onStepChange(Math.min(step, 1));
          return;
        }
        if (step === 2) {
          if (model.detailsStep.selectedProduct) {
            model.stepper.onStepChange(1);
            setMobileDetailsStep("inquiries");
          }
          return;
        }
        setMobileDetailsStep("product");
        model.stepper.onStepChange(step - 1);
      },
    };
  }, [
    effectiveMobileDetailsStep,
    model.detailsStep.selectedProduct,
    model.stepper,
    model.activeStep,
    splitProductInquirySteps,
  ]);

  const layout =
    splitProductInquirySteps && model.activeStep === 1
      ? {
          ...model.layout,
          title:
            effectiveMobileDetailsStep === "product"
              ? "Selecteer het producttype"
              : "Kies de aanvragen",
          description:
            effectiveMobileDetailsStep === "product"
              ? "Kies eerst een product in de beslissingsboom. Daarna selecteer je de beschikbare certificaten en attesten."
              : "Selecteer welke certificaten en attesten je voor dit product wilt toevoegen.",
          stepLabel: `Stap ${mobileStepper.activeStep + 1} van ${mobileStepper.steps.length}`,
          backAction:
            effectiveMobileDetailsStep === "inquiries"
              ? { label: "Terug", onClick: () => setMobileDetailsStep("product") }
              : model.layout.backAction,
          primaryAction:
            effectiveMobileDetailsStep === "product"
              ? {
                  label: "Verder",
                  onClick: () => setMobileDetailsStep("inquiries"),
                  disabled: !model.detailsStep.selectedProduct,
                }
              : model.layout.primaryAction,
        }
      : model.layout;
  const primaryAction =
    model.activeStep === model.stepper.steps.length - 1
      ? {
          ...layout.primaryAction,
          onClick: async () => {
            const confirmed = confirm
              ? await confirm(
                  "Aanvraagpakket indienen?",
                  "Na indiening wordt dit pakket met alle onderliggende certificatie- en attestvragen doorgestuurd naar PROCERTUS voor behandeling.",
                )
              : true;
            if (confirmed) {
              layout.primaryAction.onClick();
            }
          },
        }
      : layout.primaryAction;

  const includedReviewInquiries = useMemo(() => {
    const selected = new Set(model.draftsStep.includedDraftIds);
    return model.draftsStep.drafts.filter((d) => selected.has(d.id));
  }, [model.draftsStep.drafts, model.draftsStep.includedDraftIds]);

  const rulesetDocuments = useMemo(
    () => buildRulesetDocumentsForInquiries(includedReviewInquiries),
    [includedReviewInquiries],
  );

  return (
    <StepLayout
      className={authenticated ? "max-w-none" : "max-w-6xl"}
      layout={authenticated ? "fill-parent" : "default"}
      flush={authenticated}
      stepperPosition={authenticated ? "start" : "top"}
      variant="wizard"
      stepper={
        authenticated ? (
          <>
            <div className="pt-region md:hidden">
              <CompactWizardTimeline model={mobileStepper} />
            </div>
            <OnboardingStepper
              {...model.stepper}
              className="hidden max-w-none md:block"
              orientation="vertical"
              interactive
            />
          </>
        ) : (
          <OnboardingStepper {...model.stepper} orientation="horizontal" interactive />
        )
      }
      title={layout.title}
      description={layout.description}
      stepLabel={layout.stepLabel}
      backAction={layout.backAction}
      secondaryAction={layout.secondaryAction}
      primaryAction={primaryAction}
    >
      {model.activeStep === 0 ? (
        <CertificationIntentPicker
          value={model.intentStep.value as CertificationIntentId | undefined}
          onValueChange={(intent) => model.intentStep.onValueChange(intent)}
          options={defaultCertificationIntentOptionsEn}
        />
      ) : null}

      {model.activeStep === 1 ? (
        <div className="space-y-4">
          {model.detailsStep.canUseFreeform ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="request-context">Aanvraagcontext</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="request-context"
                      value={model.detailsStep.requestText}
                      onChange={(event) =>
                        model.detailsStep.onRequestTextChange(event.target.value)
                      }
                      placeholder="Bijvoorbeeld: technisch attest voor een innovatieve toepassing op een concrete werf..."
                      className="min-h-56"
                    />
                  </FieldContent>
                </Field>
              </FieldGroup>
              <Card className="h-fit gap-section p-section">
                <CardHeader className="gap-micro px-0">
                  <CardTitle>Wat moet je beschrijven?</CardTitle>
                  <CardDescription>
                    Voor {model.detailsStep.selectedIntentLabel} volstaat in dit prototype een korte
                    maar concrete context.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <ul className="list-disc space-y-component pl-component text-sm leading-normal text-muted-foreground">
                    <li>Waarvoor je het attest of de certificatie nodig hebt.</li>
                    <li>Welke toepassing, werf of situatie relevant is.</li>
                    <li>Eventuele productinformatie als die helpt bij de beoordeling.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {model.detailsStep.detailsUseProductTree ? (
            <div
              className={
                splitProductInquirySteps
                  ? "grid gap-4"
                  : "grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]"
              }
            >
              {!splitProductInquirySteps || effectiveMobileDetailsStep === "product" ? (
                <ProductTreePanel
                  className="max-w-none"
                  title="Product zoeken"
                  description="Drill down in de Procertus-beslissingsboom of filter op productnaam."
                  searchValue={model.detailsStep.productTree.searchValue}
                  onSearchChange={model.detailsStep.productTree.onSearchChange}
                  searchPlaceholder="Zoek product of categorie..."
                  actions={
                    <label className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm">
                      <Switch
                        checked={model.detailsStep.productTree.hideUnavailableProducts}
                        onCheckedChange={
                          model.detailsStep.productTree.onHideUnavailableProductsChange
                        }
                        aria-label="Toon alleen beschikbare producttypes"
                      />
                      Alleen beschikbaar
                    </label>
                  }
                  nodes={model.detailsStep.productTree.nodes}
                  expandedIds={model.detailsStep.productTree.expandedIds}
                  onCollapseAll={model.detailsStep.productTree.collapseAll}
                  onExpandAll={model.detailsStep.productTree.expandAll}
                  onToggle={model.detailsStep.productTree.onToggle}
                  onSelectProduct={(product: ProductTreeProductNode) =>
                    model.detailsStep.productTree.onSelectProduct(product)
                  }
                  showSearch
                />
              ) : null}
              {(!splitProductInquirySteps || effectiveMobileDetailsStep === "inquiries") &&
              model.detailsStep.selectedProduct ? (
                <Card className="h-fit xl:sticky xl:top-component xl:max-h-[calc(100svh-12rem)]">
                  <CardHeader>
                    <CardTitle>Certificatie- en attesteringsopties</CardTitle>
                    <CardDescription>
                      Bekijk alle mogelijke aanvragen voor dit product. Alleen mogelijke opties
                      kunnen worden geselecteerd.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-0 space-y-4 xl:overflow-y-auto">
                    <div className="rounded-md border border-border/60 bg-muted/20 p-3">
                      <p className="font-medium">{model.detailsStep.selectedProduct.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {model.detailsStep.selectedProduct.path}
                      </p>
                    </div>
                    <ProductMultiSelect
                      selectedIds={model.detailsStep.selectedEntryIds}
                      onChange={model.detailsStep.onSelectedEntryIdsChange}
                      options={model.detailsStep.productOptions}
                      legend="Toe te voegen aanvragen"
                      description="Niet-beschikbare types blijven zichtbaar zodat duidelijk is waarom ze niet kunnen worden aangevraagd."
                      emptyMessage="Selecteer eerst een producttype om de opties te zien."
                    />
                  </CardContent>
                </Card>
              ) : !splitProductInquirySteps ? (
                <Card className="h-fit xl:sticky xl:top-component">
                  <CardContent className="p-section">
                    <Empty>
                      <EmptyIcon>
                        <HugeiconsIcon icon={HierarchySquare02Icon} strokeWidth={1.5} />
                      </EmptyIcon>
                      <EmptyTitle>Selecteer eerst een producttype</EmptyTitle>
                      <EmptyDescription>
                        Kies links een product in de catalogus. Daarna tonen we hier de beschikbare
                        certificaten en attesten die je aan deze aanvraag kunt toevoegen.
                      </EmptyDescription>
                    </Empty>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {model.activeStep === 2 ? (
        <div className="space-y-section">
          <Card className="gap-section p-section">
            <CardHeader className="gap-micro px-0">
              <CardTitle>Meerdere certificatie- en attestvragen in één aanvraag</CardTitle>
              <CardDescription>
                Dit pakket kan meerdere certificatie- en attestvragen bundelen. Voeg extra vragen
                toe wanneer hetzelfde dossier meerdere producten of aanvraagtypes moet bevatten.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-component px-0 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Je keert terug naar de intentiestap en behoudt de aanvragen die hieronder
                geselecteerd blijven.
              </p>
              <Button type="button" variant="outline" onClick={model.draftsStep.onAddAnother}>
                Nog een aanvraag toevoegen
              </Button>
            </CardContent>
          </Card>
          <SelectChoiceCardGroup
            selectionMode="multiple"
            hint="Vink kaarten uit om ze niet mee te nemen in het aanvraagpakket."
          >
            <CardList
              items={sortDraftsByIntentAndProduct(model.draftsStep.drafts)}
              widthClass="@min-[40rem]:grid-cols-1 @min-[60rem]:grid-cols-2 @min-[100rem]:grid-cols-3 @min-[150rem]:grid-cols-3"
            >
              {(draft) => (
                <SelectChoiceCard
                  key={draft.id}
                  selectionMode="multiple"
                  value={draft.id}
                  controlId={`selected-draft-${draft.id}`}
                  title={draft.label}
                  description={<DraftCardDescription draft={draft} />}
                  checked={model.draftsStep.includedDraftIds.includes(draft.id)}
                  onCheckedChange={(checked) => {
                    const current = model.draftsStep.includedDraftIds;
                    model.draftsStep.onIncludedDraftIdsChange(
                      checked
                        ? Array.from(new Set([...current, draft.id]))
                        : current.filter((id) => id !== draft.id),
                    );
                  }}
                  emphasis="primary"
                />
              )}
            </CardList>
          </SelectChoiceCardGroup>
        </div>
      ) : null}

      {model.activeStep === 3 ? (
        <div className="space-y-4">
          <RequestPackageReview
            className="max-w-5xl"
            title="Aanvraagdetails"
            description="Deze gegevens worden samen met de onboarding-intake of de gekende organisatiecontext ingediend."
            requester={reviewRequester}
            rows={model.reviewStep.rows}
            notice={
              model.reviewStep.draftCount > 1 ? (
                <span>
                  <Badge variant="secondary">{model.reviewStep.draftCount} vragen</Badge> worden
                  samen gebundeld in deze aanvraag.
                </span>
              ) : undefined
            }
          />
          <DownloadableDocumentsList
            className="max-w-5xl"
            title="Regels en documentatie"
            description={
              includedReviewInquiries.length > 0
                ? `Documenten op basis van je ${includedReviewInquiries.length} geselecteerde ${includedReviewInquiries.length === 1 ? "aanvraag" : "aanvragen"} (prototype — downloadlinks zijn gemockt).`
                : "Selecteer eerst aanvragen in de vorige stap om relevante documenten te zien (prototype)."
            }
            items={rulesetDocuments}
            emptyContent={
              <p className="text-sm text-muted-foreground">
                Geen geselecteerde aanvragen — vink in de vorige stap minstens één aanvraag aan om
                documentatie te tonen.
              </p>
            }
          />
        </div>
      ) : null}
    </StepLayout>
  );
}

export function CertificationRequestWizard({
  mode,
  initialDrafts = [],
  initialStep,
  backend,
  backendKind,
  sessionId,
  storageKey,
  onCancel,
  onRequestCreated,
  onComplete,
  reviewRequester,
}: CertificationRequestWizardProps) {
  return (
    <CertificationRequestProvider
      mode={mode}
      initialDrafts={initialDrafts}
      initialStep={initialStep}
      backend={backend}
      backendKind={backendKind}
      sessionId={sessionId}
      storageKey={storageKey}
    >
      <CertificationRequestWizardView
        onCancel={onCancel}
        onRequestCreated={onRequestCreated}
        onComplete={onComplete}
        reviewRequester={reviewRequester}
      />
    </CertificationRequestProvider>
  );
}
