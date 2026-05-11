import { ShoppingBasket01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetScrollFade,
  SheetScrollFadeBottom,
  SheetTitle,
  SheetTrigger,
  useConfirm,
} from "@procertus-ui/ui";
import {
  CertificationInquiriesOverviewCard,
  effectiveIncludedCertificationDraftIds,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formalOnboardingStepPath } from "../routes/formal-request-routing";

const WELCOME_PATH = "/welcome";

export function PublicCertificationRequestsCart() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const { flowState, setFlowState } = useOnboardingFlowState();
  const api = useOnboardingFlowApi();
  const { drafts, summaryIncludedDraftIds } = flowState;

  const effectiveIncludedDraftIds = useMemo(
    () => effectiveIncludedCertificationDraftIds(drafts, summaryIncludedDraftIds),
    [drafts, summaryIncludedDraftIds],
  );

  const count = effectiveIncludedDraftIds.length;

  const closePanelAndClearDrafts = () => {
    setOpen(false);
    api.applyWizardDraftCompletion([]);
    navigate(WELCOME_PATH, { replace: true });
  };

  const resetSummarySelection = () => {
    setFlowState((prev) => ({ ...prev, summaryIncludedDraftIds: undefined }));
  };

  const eraseAllInquiries = async () => {
    const ok =
      (await confirm?.(
        "Alle aanvragen wissen?",
        "Alle conceptaanvragen worden uit uw mandje verwijderd. U wordt daarna naar de welkomstpagina gestuurd.",
      )) ?? false;
    if (!ok) return;
    closePanelAndClearDrafts();
  };

  const removeDraftFromList = async (draftId: string) => {
    const isLast = drafts.length === 1;
    const ok =
      (await confirm?.(
        isLast ? "Laatste aanvraag verwijderen?" : "Aanvraag verwijderen uit mandje?",
        isLast
          ? "Uw mandje wordt leeggemaakt. U wordt daarna naar de welkomstpagina gestuurd."
          : "Deze aanvraag wordt definitief uit uw mandje gehaald.",
      )) ?? false;
    if (!ok) return;
    if (isLast) {
      closePanelAndClearDrafts();
    } else {
      api.applyWizardDraftCompletion(drafts.filter((d) => d.id !== draftId));
    }
  };

  const openRequestWizard = () => {
    setOpen(false);
    setFlowState((prev) => ({
      ...prev,
      wizardInitialStep: prev.drafts.length > 0 ? "drafts" : "intent",
    }));
    navigate(formalOnboardingStepPath("request"));
  };

  const label =
    count === 0
      ? "Certificatieaanvragen — geen selectie"
      : `Certificatieaanvragen — ${count} geselecteerd`;

  if (drafts.length === 0) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative shrink-0 bg-background/80 shadow-sm backdrop-blur-sm"
          aria-label={label}
        >
          <HugeiconsIcon icon={ShoppingBasket01Icon} className="size-5" aria-hidden />
          {count > 0 ? (
            <span
              className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground shadow-sm"
              aria-hidden
            >
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-lg flex-col sm:max-w-lg" showCloseButton>
        <SheetHeader className="pr-10 text-left">
          <SheetTitle>Aanvragen</SheetTitle>
          <SheetDescription>
            Uw huidige certificatieaanvragen en onderzoeken voor dit traject. Pas de selectie aan of
            ga terug naar de wizard.
          </SheetDescription>
        </SheetHeader>
        <SheetScrollFade />
        <SheetBody className="min-h-0 flex-1">
          <CertificationInquiriesOverviewCard
            showHeader={false}
            drafts={drafts}
            effectiveIncludedDraftIds={effectiveIncludedDraftIds}
            controlIdPrefix="public-shell-draft"
            listToolbar={
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={drafts.length === 0 || summaryIncludedDraftIds === undefined}
                  onClick={resetSummarySelection}
                >
                  Selectie herstellen
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={drafts.length === 0}
                  onClick={() => {
                    void eraseAllInquiries();
                  }}
                >
                  Alle aanvragen wissen
                </Button>
              </>
            }
            onRemoveDraft={(id) => {
              void removeDraftFromList(id);
            }}
            onDraftIncludedChange={(draftId, included) => {
              setFlowState((prev) => {
                const ids = prev.drafts.map((d) => d.id);
                const base = prev.summaryIncludedDraftIds ?? [...ids];
                const next = included
                  ? Array.from(new Set([...base, draftId]))
                  : base.filter((id) => id !== draftId);
                return { ...prev, summaryIncludedDraftIds: next };
              });
            }}
            onEditRequestsClick={openRequestWizard}
          />
        </SheetBody>
        <SheetScrollFadeBottom />
      </SheetContent>
    </Sheet>
  );
}
