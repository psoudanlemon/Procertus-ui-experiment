import { OnboardingStepper } from "@procertus-ui/ui-lib";
import { useConfirm, useIsMobile } from "@procertus-ui/ui";
import { useMemo, useState } from "react";

import { CERTIFICATION_REQUEST_STEP_IDS } from "../../certification-request/types";
import { useCertificationRequestWizardModel } from "../../certification-request/model";
import { CompactWizardTimeline } from "./CompactWizardTimeline";
import { sortDraftsByIntentAndProduct } from "./draft-selection-presentation";
import { buildRulesetDocumentsForInquiries } from "./build-ruleset-documents-for-inquiries";
import type {
  CertificationRequestWizardViewProps,
  UseCertificationRequestWizardViewOptions,
} from "./certification-request-wizard-types";

const certStepReview = CERTIFICATION_REQUEST_STEP_IDS.indexOf("review");

export function useCertificationRequestWizardView(
  options: UseCertificationRequestWizardViewOptions,
): CertificationRequestWizardViewProps {
  const { onCancel, onRequestCreated, onComplete, reviewRequester } = options;
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
    model.activeStep === certStepReview
      ? {
          ...layout.primaryAction,
          onClick: async () => {
            const confirmed = confirm
              ? await confirm(
                  "Aanvraagpakket versturen?",
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

  const sortedDrafts = useMemo(
    () => sortDraftsByIntentAndProduct(model.draftsStep.drafts),
    [model.draftsStep.drafts],
  );

  const onDraftIncludedChange = (draftId: string, checked: boolean) => {
    const current = model.draftsStep.includedDraftIds;
    model.draftsStep.onIncludedDraftIdsChange(
      checked
        ? Array.from(new Set([...current, draftId]))
        : current.filter((id) => id !== draftId),
    );
  };

  const rulesetDocumentsDescription =
    includedReviewInquiries.length > 0
      ? `Documenten op basis van je ${includedReviewInquiries.length} geselecteerde ${includedReviewInquiries.length === 1 ? "aanvraag" : "aanvragen"} (prototype — downloadlinks zijn gemockt).`
      : "Selecteer eerst aanvragen in de vorige stap om relevante documenten te zien (prototype).";

  const stepperNode = authenticated ? (
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
  );

  return {
    stepLayout: {
      className: authenticated ? "max-w-none" : "w-full",
      layout: authenticated ? "fill-parent" : "default",
      flush: authenticated,
      stepperPosition: authenticated ? "start" : "top",
      variant: "wizard",
      stepper: stepperNode,
      title: layout.title,
      description: layout.description,
      stepLabel: layout.stepLabel,
      backAction: layout.backAction,
      secondaryAction: layout.secondaryAction,
      primaryAction,
    },
    showIntentStep: model.activeStep === 0,
    intentStep: model.intentStep,
    showDetailsStep: model.activeStep === 1,
    splitProductInquirySteps,
    effectiveMobileDetailsStep,
    detailsStep: model.detailsStep,
    showDraftsStep: model.activeStep === 2,
    draftsStep: model.draftsStep,
    sortedDrafts,
    onDraftIncludedChange,
    showReviewStep: model.activeStep === certStepReview,
    mode: model.mode,
    reviewRequester,
    reviewStep: model.reviewStep,
    rulesetDocumentsDescription,
    rulesetDocuments,
    rulesetEmptyContent: (
      <p className="text-sm text-muted-foreground">
        Geen geselecteerde aanvragen — vink in de vorige stap minstens één aanvraag aan om
        documentatie te tonen.
      </p>
    ),
  };
}
