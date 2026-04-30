import type { ReactNode } from "react";

import type { DownloadableDocumentListItemData } from "@procertus-ui/ui";
import type { StepLayoutProps } from "@procertus-ui/ui-lib";
import type { CertificationWizardModel } from "../../certification-request/model";
import type { CertificationRequestDraft } from "../../certification-request/types";
import type { RequestPackageReviewRequesterPresentation } from "../request-package-review";

export type WizardStepperModel = {
  activeStep: number;
  steps: Array<{ id: string; title: string; description?: string; available?: boolean }>;
  onStepChange: (step: number) => void;
};

export type UseCertificationRequestWizardViewOptions = {
  onCancel?: () => void;
  onRequestCreated?: (draft: CertificationRequestDraft) => void;
  onComplete: (drafts: CertificationRequestDraft[]) => void;
  reviewRequester?: RequestPackageReviewRequesterPresentation;
};

export type CertificationRequestWizardViewProps = {
  stepLayout: Pick<
    StepLayoutProps,
    | "className"
    | "layout"
    | "flush"
    | "stepperPosition"
    | "variant"
    | "stepper"
    | "minHeight"
    | "title"
    | "description"
    | "backAction"
    | "cancelAction"
    | "secondaryAction"
    | "primaryAction"
  >;
  showIntentStep: boolean;
  intentStep: CertificationWizardModel["intentStep"];
  showDetailsStep: boolean;
  splitProductInquirySteps: boolean;
  effectiveMobileDetailsStep: "product" | "inquiries";
  detailsStep: CertificationWizardModel["detailsStep"];
  showDraftsStep: boolean;
  draftsStep: CertificationWizardModel["draftsStep"];
  sortedDrafts: CertificationRequestDraft[];
  onDraftIncludedChange: (draftId: string, checked: boolean) => void;
  showReviewStep: boolean;
  mode: CertificationWizardModel["mode"];
  reviewRequester: RequestPackageReviewRequesterPresentation | undefined;
  reviewStep: CertificationWizardModel["reviewStep"];
  rulesetDocumentsDescription: string;
  rulesetDocuments: DownloadableDocumentListItemData[];
  rulesetEmptyContent: ReactNode;
};
