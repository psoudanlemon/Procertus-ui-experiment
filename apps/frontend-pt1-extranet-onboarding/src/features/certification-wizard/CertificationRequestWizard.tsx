import {
  CertificationRequestProvider,
  useCertificationRequestWizardModel,
} from "@procertus-ui/ui-certification";
import type {
  CertificationRequestBackend,
  CertificationRequestDraft,
  CertificationRequestProviderProps,
  CertificationRequestStepId,
} from "@procertus-ui/ui-certification";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldLabel,
  Input,
  Switch,
  Textarea,
} from "@procertus-ui/ui";
import {
  CertificationIntentPicker,
  DraftRequestList,
  ProductMultiSelect,
  ProductTreePanel,
  RequestPackageReview,
  defaultCertificationIntentOptionsEn,
} from "@procertus-ui/ui-certification";
import type { CertificationIntentId, ProductTreeProductNode } from "@procertus-ui/ui-certification";
import { OnboardingStepper, StepLayout } from "@procertus-ui/ui-lib";

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
};

function CertificationRequestWizardView({
  onCancel,
  onRequestCreated,
  onComplete,
}: Pick<CertificationRequestWizardProps, "onCancel" | "onRequestCreated" | "onComplete">) {
  const model = useCertificationRequestWizardModel({ onCancel, onRequestCreated, onComplete });
  const authenticated = model.mode === "authenticated";

  return (
    <StepLayout
      className={authenticated ? "max-w-none" : "max-w-6xl"}
      layout={authenticated ? "fill-parent" : "default"}
      flush={authenticated}
      stepperPosition={authenticated ? "start" : "top"}
      variant="wizard"
      stepper={
        <OnboardingStepper
          {...model.stepper}
          className={authenticated ? "max-w-none" : undefined}
          orientation={authenticated ? "vertical" : "horizontal"}
          interactive
        />
      }
      title={model.layout.title}
      description={model.layout.description}
      stepLabel={model.layout.stepLabel}
      backAction={model.layout.backAction}
      secondaryAction={model.layout.secondaryAction}
      primaryAction={model.layout.primaryAction}
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
            <Card>
              <CardHeader>
                <CardTitle>Aanvraagcontext</CardTitle>
                <CardDescription>
                  Voor {model.detailsStep.selectedIntentLabel} volstaat in dit prototype een korte beschrijving. Een
                  productselectie is optioneel waar het Procertus-model productinformatie bevat.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Field>
                  <FieldLabel htmlFor="request-context">Beschrijf de aanvraag</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="request-context"
                      value={model.detailsStep.requestText}
                      onChange={(event) => model.detailsStep.onRequestTextChange(event.target.value)}
                      placeholder="Bijvoorbeeld: technisch attest voor een innovatieve toepassing op een concrete werf..."
                      className="min-h-28"
                    />
                  </FieldContent>
                </Field>
              </CardContent>
            </Card>
          ) : null}

          {model.detailsStep.detailsUseProductTree ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
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
                      onCheckedChange={model.detailsStep.productTree.onHideUnavailableProductsChange}
                      aria-label="Toon alleen beschikbare producttypes"
                    />
                    Alleen beschikbaar
                  </label>
                }
                nodes={model.detailsStep.productTree.nodes}
                expandedIds={model.detailsStep.productTree.expandedIds}
                onToggle={model.detailsStep.productTree.onToggle}
                onSelectProduct={(product: ProductTreeProductNode) =>
                  model.detailsStep.productTree.onSelectProduct(product)
                }
                showSearch
              />
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Certificatie-opties</CardTitle>
                  <CardDescription>
                    {model.detailsStep.selectedProduct
                      ? "Bekijk alle aanvraagtypes voor dit product. Alleen mogelijke opties kunnen worden geselecteerd."
                      : "Selecteer eerst een producttype."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {model.detailsStep.selectedProduct ? (
                    <>
                      <div className="rounded-md border border-border/60 bg-muted/20 p-3">
                        <p className="font-medium">{model.detailsStep.selectedProduct.label}</p>
                        <p className="text-sm text-muted-foreground">{model.detailsStep.selectedProduct.path}</p>
                      </div>
                      <ProductMultiSelect
                        selectedIds={model.detailsStep.selectedEntryIds}
                        onChange={model.detailsStep.onSelectedEntryIdsChange}
                        options={model.detailsStep.productOptions}
                        legend="Toe te voegen aanvragen"
                        description="Niet-beschikbare types blijven zichtbaar zodat duidelijk is waarom ze niet kunnen worden aangevraagd."
                        emptyMessage="Selecteer eerst een producttype om de opties te zien."
                      />
                    </>
                  ) : (
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Selecteer een producttype om rechts alle certificatie- en attestopties te zien. Gebruik de
                        filter boven de boom om niet-beschikbare producttypes tijdelijk te verbergen.
                      </p>
                      <Input
                        value={model.detailsStep.productTree.searchValue}
                        onChange={(event) => model.detailsStep.productTree.onSearchChange(event.target.value)}
                        placeholder="Snel zoeken..."
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      ) : null}

      {model.activeStep === 2 ? (
        <DraftRequestList
          title="Concepten in deze aanvraag"
          description="Controleer de aangemaakte concepten. In deze prototypefase opent bewerken opnieuw de detailstap."
          drafts={model.draftsStep.drafts}
          onEdit={model.draftsStep.onEdit}
          onRemove={model.draftsStep.onRemove}
        />
      ) : null}

      {model.activeStep === 3 ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <RequestPackageReview
            title="Aanvraagpakket"
            description="Deze gegevens worden samen met de onboarding-intake of de gekende organisatiecontext ingediend."
            rows={model.reviewStep.rows}
            notice={
              model.reviewStep.draftCount > 1 ? (
                <span>
                  <Badge variant="secondary">{model.reviewStep.draftCount} concepten</Badge> worden samen gebundeld
                  in dit pakket.
                </span>
              ) : undefined
            }
          />
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Prototypegedrag</CardTitle>
              <CardDescription>
                Er is nog geen API. De volgende stap bewaart de concepten in de app-state en simuleert indien nodig
                accountactivatie.
              </CardDescription>
            </CardHeader>
          </Card>
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
      />
    </CertificationRequestProvider>
  );
}
