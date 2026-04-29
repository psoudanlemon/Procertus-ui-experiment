import { StepLayout } from "@procertus-ui/ui-lib";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardList,
  CardTitle,
  DownloadableDocumentsList,
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  SelectChoiceCard,
  SelectChoiceCardGroup,
  Switch,
  Textarea,
} from "@procertus-ui/ui";
import { HierarchySquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  CertificationIntentPicker,
  defaultCertificationIntentOptionsEn,
} from "../certification-intent-picker";
import type { CertificationIntentId } from "../certification-intent-picker";
import { ProductMultiSelect } from "../product-multi-select";
import { ProductTreePanel } from "../product-tree-panel";
import type { ProductTreeProductNode } from "../product-tree-panel";
import { RequestPackageReview } from "../request-package-review";
import type { CertificationRequestDraft } from "../../certification-request/types";
import { DraftCardDescription } from "./draft-selection-presentation";
import type { CertificationRequestWizardViewProps } from "./certification-request-wizard-types";

/** Pure presentational wizard shell — wire state via {@link useCertificationRequestWizardView}. */
export function CertificationRequestWizardView(props: CertificationRequestWizardViewProps) {
  const {
    stepLayout,
    showIntentStep,
    intentStep,
    showDetailsStep,
    splitProductInquirySteps,
    effectiveMobileDetailsStep,
    detailsStep,
    showDraftsStep,
    draftsStep,
    sortedDrafts,
    onDraftIncludedChange,
    showReviewStep,
    mode,
    reviewRequester,
    reviewStep,
    rulesetDocumentsDescription,
    rulesetDocuments,
    rulesetEmptyContent,
  } = props;

  return (
    <StepLayout {...stepLayout}>
      {showIntentStep ? (
        <CertificationIntentPicker
          value={intentStep.value as CertificationIntentId | undefined}
          onValueChange={(intent) => intentStep.onValueChange(intent)}
          options={defaultCertificationIntentOptionsEn}
        />
      ) : null}

      {showDetailsStep ? (
        <div className="space-y-4">
          {detailsStep.canUseFreeform ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="request-context">Aanvraagcontext</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="request-context"
                      value={detailsStep.requestText}
                      onChange={(event) => detailsStep.onRequestTextChange(event.target.value)}
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
                    Voor {detailsStep.selectedIntentLabel} volstaat in dit prototype een korte maar
                    concrete context.
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

          {detailsStep.detailsUseProductTree ? (
            <div
              className={
                splitProductInquirySteps
                  ? "grid gap-4"
                  : "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]"
              }
            >
              {!splitProductInquirySteps || effectiveMobileDetailsStep === "product" ? (
                <ProductTreePanel
                  className="max-w-none"
                  title="Product zoeken"
                  description="Drill down in de Procertus-beslissingsboom of filter op productnaam."
                  searchValue={detailsStep.productTree.searchValue}
                  onSearchChange={detailsStep.productTree.onSearchChange}
                  searchPlaceholder="Zoek product of categorie..."
                  actions={
                    <label className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm">
                      <Switch
                        checked={detailsStep.productTree.hideUnavailableProducts}
                        onCheckedChange={detailsStep.productTree.onHideUnavailableProductsChange}
                        aria-label="Toon alleen beschikbare producttypes"
                      />
                      Alleen beschikbaar
                    </label>
                  }
                  nodes={detailsStep.productTree.nodes}
                  expandedIds={detailsStep.productTree.expandedIds}
                  onCollapseAll={detailsStep.productTree.collapseAll}
                  onExpandAll={detailsStep.productTree.expandAll}
                  onToggle={detailsStep.productTree.onToggle}
                  onSelectProduct={(product: ProductTreeProductNode) =>
                    detailsStep.productTree.onSelectProduct(product)
                  }
                  showSearch
                />
              ) : null}
              {(!splitProductInquirySteps || effectiveMobileDetailsStep === "inquiries") &&
              detailsStep.selectedProduct ? (
                <Card className="h-fit lg:sticky lg:top-component lg:max-h-[calc(100svh-12rem)]">
                  <CardHeader>
                    <CardTitle>Certificatie- en attesteringsopties</CardTitle>
                    <CardDescription>
                      Bekijk alle mogelijke aanvragen voor dit product. Alleen mogelijke opties
                      kunnen worden geselecteerd.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-0 space-y-4 lg:overflow-y-auto">
                    <div className="rounded-md border border-border/60 bg-muted/20 p-3">
                      <p className="font-medium">{detailsStep.selectedProduct.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {detailsStep.selectedProduct.path}
                      </p>
                    </div>
                    <ProductMultiSelect
                      selectedIds={detailsStep.selectedEntryIds}
                      onChange={detailsStep.onSelectedEntryIdsChange}
                      options={detailsStep.productOptions}
                      legend="Toe te voegen aanvragen"
                      description="Niet-beschikbare types blijven zichtbaar zodat duidelijk is waarom ze niet kunnen worden aangevraagd."
                      emptyMessage="Selecteer eerst een producttype om de opties te zien."
                    />
                  </CardContent>
                </Card>
              ) : !splitProductInquirySteps ? (
                <Card className="h-fit lg:sticky lg:top-component">
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

      {showDraftsStep ? (
        <div className="space-y-section">
          <Card className="gap-section p-section">
            <CardHeader className="gap-micro px-0">
              <CardTitle>Meerdere certificatie- en attestvragen in één aanvraag</CardTitle>
              <CardDescription>
                Dit pakket kan meerdere certificatie- en attestvragen bundelen. Voeg extra vragen toe
                wanneer hetzelfde dossier meerdere producten of aanvraagtypes moet bevatten.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-component px-0 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Je keert terug naar de intentiestap en behoudt de aanvragen die hieronder
                geselecteerd blijven.
              </p>
              <Button type="button" variant="outline" onClick={draftsStep.onAddAnother}>
                Nog een aanvraag toevoegen
              </Button>
            </CardContent>
          </Card>
          <SelectChoiceCardGroup
            selectionMode="multiple"
            hint="Vink kaarten uit om ze niet mee te nemen in het aanvraagpakket."
          >
            <CardList
              items={sortedDrafts}
              widthClass="@min-[40rem]:grid-cols-1 @min-[60rem]:grid-cols-2 @min-[100rem]:grid-cols-3 @min-[150rem]:grid-cols-3"
            >
              {(draft: CertificationRequestDraft) => (
                <SelectChoiceCard
                  key={draft.id}
                  selectionMode="multiple"
                  value={draft.id}
                  controlId={`selected-draft-${draft.id}`}
                  title={draft.label}
                  description={<DraftCardDescription draft={draft} />}
                  checked={draftsStep.includedDraftIds.includes(draft.id)}
                  onCheckedChange={(checked) => onDraftIncludedChange(draft.id, checked)}
                  variant="elevated"
                />
              )}
            </CardList>
          </SelectChoiceCardGroup>
        </div>
      ) : null}

      {showReviewStep ? (
        <div className="space-y-4">
          <RequestPackageReview
            className="max-w-5xl"
            title={
              mode === "onboarding" ? "Samenvatting van het aanvraagpakket" : "Aanvraagdetails"
            }
            description={
              mode === "onboarding"
                ? "Alleen de inhoudelijke aanvragen staan hieronder. Vertegenwoordiger en organisatie registreer je in de volgende stap."
                : "Deze gegevens worden samen met de onboarding-intake of de gekende organisatiecontext ingediend."
            }
            requester={mode === "authenticated" ? reviewRequester : undefined}
            rows={reviewStep.rows}
            notice={
              reviewStep.draftCount > 1 ? (
                <span>
                  <Badge variant="secondary">{reviewStep.draftCount} vragen</Badge> worden samen
                  gebundeld in deze aanvraag.
                </span>
              ) : undefined
            }
          />
          <DownloadableDocumentsList
            className="max-w-5xl"
            title="Regels en documentatie"
            description={rulesetDocumentsDescription}
            items={rulesetDocuments}
            emptyContent={rulesetEmptyContent}
          />
        </div>
      ) : null}
    </StepLayout>
  );
}
