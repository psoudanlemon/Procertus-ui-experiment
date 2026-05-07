import { useConfirm } from "@procertus-ui/ui";
import { useEffect, useMemo } from "react";

import { useCertificationRequest } from "../../certification-request/context";
import { CERTIFICATION_REQUEST_STEP_IDS } from "../../certification-request/types";
import { useCertificationRequestWizardModel } from "../../certification-request/model";
import { sortDraftsByIntentAndProduct } from "./draft-selection-presentation";
import { buildRulesetDocumentsForInquiries } from "./build-ruleset-documents-for-inquiries";
import type {
  CertificationRequestWizardViewProps,
  UseCertificationRequestWizardViewOptions,
} from "./certification-request-wizard-types";

/**
 * Stable card height for the anonymous wizard / step pages so they don't shrink to
 * content height between steps.
 */
export const STABLE_STEP_MIN_HEIGHT = "min-h-[calc(100svh-12rem)]";

const DETAILS_IDX = CERTIFICATION_REQUEST_STEP_IDS.indexOf("details");
const DRAFTS_IDX = CERTIFICATION_REQUEST_STEP_IDS.indexOf("drafts");
const REVIEW_IDX = CERTIFICATION_REQUEST_STEP_IDS.indexOf("review");

export function useCertificationRequestWizardView(
  options: UseCertificationRequestWizardViewOptions,
): CertificationRequestWizardViewProps {
  const { onCancel, onRequestCreated, onComplete, reviewRequester } = options;
  const model = useCertificationRequestWizardModel({ onCancel, onRequestCreated, onComplete });
  const confirm = useConfirm();
  const { intent, setIntent, setActiveStep, replaceDraftsFromDetails } = useCertificationRequest();

  // Trim the wizard to Product → Review only: seed the intent so the details
  // step renders the product picker, and bounce past intent/drafts if the
  // session lands there (initial mount or persisted state).
  useEffect(() => {
    if (!intent) setIntent("product-certification");
    if (model.activeStep === 0) setActiveStep(DETAILS_IDX);
    else if (model.activeStep === DRAFTS_IDX) setActiveStep(REVIEW_IDX);
  }, [intent, model.activeStep, setActiveStep, setIntent]);

  const layout = model.layout;

  const primaryAction =
    model.activeStep === DETAILS_IDX
      ? {
          ...layout.primaryAction,
          onClick: () => {
            replaceDraftsFromDetails();
            setActiveStep(REVIEW_IDX);
          },
        }
      : model.activeStep === REVIEW_IDX
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

  const backAction =
    model.activeStep === REVIEW_IDX
      ? { label: "Terug", onClick: () => setActiveStep(DETAILS_IDX) }
      : undefined;

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

  return {
    stepLayout: {
      className: "w-full",
      layout: "default",
      variant: "onboarding",
      stepLabel: "Productinformatie",
      minHeight: STABLE_STEP_MIN_HEIGHT,
      title: layout.title,
      description: layout.description,
      backAction,
      cancelAction: layout.cancelAction,
      secondaryAction: undefined,
      primaryAction,
    },
    showIntentStep: false,
    intentStep: model.intentStep,
    showDetailsStep: model.activeStep === DETAILS_IDX,
    splitProductInquirySteps: false,
    effectiveMobileDetailsStep: "product",
    detailsStep: model.detailsStep,
    showDraftsStep: false,
    draftsStep: model.draftsStep,
    sortedDrafts,
    onDraftIncludedChange,
    showReviewStep: model.activeStep === REVIEW_IDX,
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
