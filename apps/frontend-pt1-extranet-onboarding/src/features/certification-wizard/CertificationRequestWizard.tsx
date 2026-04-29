import {
  CertificationRequestProvider,
  CertificationRequestWizardView,
  type CertificationRequestBackend,
  type CertificationRequestDraft,
  type CertificationRequestProviderProps,
  type CertificationRequestStepId,
  type RequestPackageReviewRequesterPresentation,
  useCertificationRequestWizardView,
} from "@procertus-ui/ui-certification";

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
  /** Shown on the final review step when `mode` is `authenticated`: current user + company. Omit on anonymous onboarding — registration follows in the next wizard step. */
  reviewRequester?: RequestPackageReviewRequesterPresentation;
};

function CertificationRequestWizardSession(
  props: Pick<
    CertificationRequestWizardProps,
    "onCancel" | "onRequestCreated" | "onComplete" | "reviewRequester"
  >,
) {
  const viewProps = useCertificationRequestWizardView(props);
  return <CertificationRequestWizardView {...viewProps} />;
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
      <CertificationRequestWizardSession
        onCancel={onCancel}
        onRequestCreated={onRequestCreated}
        onComplete={onComplete}
        reviewRequester={reviewRequester}
      />
    </CertificationRequestProvider>
  );
}
