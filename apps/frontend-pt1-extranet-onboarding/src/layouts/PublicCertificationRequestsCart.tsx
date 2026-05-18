import { ShoppingBasket01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  cn,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetScrollFade,
  SheetScrollFadeBottom,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useConfirm,
} from "@procertus-ui/ui";
import {
  ProductInquiryMatrix,
  StandaloneInquiriesOverview,
  groupDraftsByProduct,
  isProductBoundDraft,
  standaloneInquiryDrafts,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useEffect, useMemo, useRef, useState, type AnimationEvent } from "react";
import { useNavigate } from "react-router-dom";
import { resetTrajectFlow } from "../features/traject/traject-submission-context";

const WELCOME_PATH = "/welcome";

type CartIconMode = "hidden" | "enter" | "shown" | "leave";

const ICON_ENTER_CLASSES =
  "animate-in fade-in-0 slide-in-from-right-2 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none motion-reduce:duration-0";
const ICON_LEAVE_CLASSES =
  "animate-out fade-out-0 slide-out-to-right-2 duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none motion-reduce:duration-0 fill-mode-forwards";

const BADGE_COUNT_CHANGE_CLASSES =
  "animate-in fade-in-0 zoom-in-95 duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none motion-reduce:duration-0";

export function PublicCertificationRequestsCart() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const { flowState } = useOnboardingFlowState();
  const api = useOnboardingFlowApi();
  const { drafts } = flowState;

  const count = drafts.length;

  const [mode, setMode] = useState<CartIconMode>(() => (count > 0 ? "enter" : "hidden"));
  const modeRef = useRef(mode);

  const [badgePulse, setBadgePulse] = useState(0);
  const prevCountRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    queueMicrotask(() => {
      if (drafts.length === 0) setOpen(false);
      if (drafts.length > 0) {
        setMode((m) => (m === "hidden" || m === "leave" ? "enter" : m));
      } else {
        setMode((m) => (m === "shown" || m === "enter" ? "leave" : m));
      }
    });
  }, [drafts.length]);

  useEffect(() => {
    if (prevCountRef.current === undefined) {
      prevCountRef.current = count;
      return;
    }
    if (prevCountRef.current === count) return;
    prevCountRef.current = count;
    setBadgePulse((p) => p + 1);
  }, [count]);

  useEffect(() => {
    if (mode !== "enter" && mode !== "leave") return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      setMode((m) => (m === "enter" ? "shown" : m === "leave" ? "hidden" : m));
    }, 0);
    return () => window.clearTimeout(id);
  }, [mode]);

  const productGroups = useMemo(
    () => groupDraftsByProduct(drafts.filter(isProductBoundDraft)),
    [drafts],
  );
  const standaloneInquiries = useMemo(() => standaloneInquiryDrafts(drafts), [drafts]);

  const handleTriggerAnimationEnd = (event: AnimationEvent<HTMLButtonElement>) => {
    if (event.target !== event.currentTarget) return;
    const m = modeRef.current;
    if (m === "enter") setMode("shown");
    else if (m === "leave") setMode("hidden");
  };

  /** Sluit het mandje en ga naar de welkomstpagina; flowstate en mandje blijven intact. */
  const closePanelAndGoWelcome = () => {
    setOpen(false);
    navigate(WELCOME_PATH, { replace: true });
  };

  /**
   * Sluit het paneel, volledige onboarding-flow in geheugen + localStorage gewist via
   * {@link resetTrajectFlow}, daarna `/welcome` zodat de gebruiker certificaat- en productkeuze
   * opnieuw samenstelt (formeel traject, informatieaanvraag of expert-call).
   */
  const closePanelResetGuestFlowAndGoWelcome = () => {
    setOpen(false);
    resetTrajectFlow(api);
    navigate(WELCOME_PATH, { replace: true });
  };

  const eraseAllInquiries = async () => {
    const ok =
      (await confirm?.(
        "Alle aanvragen wissen?",
        "Alle conceptaanvragen worden uit uw mandje verwijderd en alle gegevens uit de registratiewizard worden gewist. U wordt daarna naar de welkomstpagina gestuurd.",
      )) ?? false;
    if (!ok) return;
    closePanelResetGuestFlowAndGoWelcome();
  };

  const removeProductRow = async (productId: string) => {
    const nextDrafts = drafts.filter((d) => {
      if (!isProductBoundDraft(d)) return true;
      const key = d.productId?.trim() || d.productLabel?.trim() || d.id;
      return key !== productId;
    });
    const isLast = nextDrafts.length === 0;
    const ok =
      (await confirm?.(
        isLast ? "Laatste aanvraag verwijderen?" : "Product verwijderen uit mandje?",
        isLast
          ? "Uw mandje wordt leeggemaakt en alle registratiegegevens worden gewist. U wordt daarna naar de welkomstpagina gestuurd."
          : "Alle certificaataanvragen voor dit product worden uit uw mandje gehaald.",
      )) ?? false;
    if (!ok) return;
    if (isLast) {
      closePanelResetGuestFlowAndGoWelcome();
    } else {
      api.applyWizardDraftCompletion(nextDrafts);
    }
  };

  const removeStandaloneDraft = async (draftId: string) => {
    const nextDrafts = drafts.filter((d) => d.id !== draftId);
    const isLast = nextDrafts.length === 0;
    const ok =
      (await confirm?.(
        isLast ? "Laatste aanvraag verwijderen?" : "Aanvraag verwijderen uit mandje?",
        isLast
          ? "Uw mandje wordt leeggemaakt en alle registratiegegevens worden gewist. U wordt daarna naar de welkomstpagina gestuurd."
          : "Deze aanvraag (zonder gekoppeld product) wordt uit uw mandje gehaald.",
      )) ?? false;
    if (!ok) return;
    if (isLast) {
      closePanelResetGuestFlowAndGoWelcome();
    } else {
      api.applyWizardDraftCompletion(nextDrafts);
    }
  };

  const label =
    count === 0
      ? "Certificatieaanvragen — geen selectie"
      : `Certificatieaanvragen — ${count} geselecteerd`;

  if (mode === "hidden") {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className={cn(
                "relative shrink-0",
                mode === "enter" && ICON_ENTER_CLASSES,
                mode === "leave" && ICON_LEAVE_CLASSES,
              )}
              aria-label={label}
              onAnimationEnd={handleTriggerAnimationEnd}
            >
              <HugeiconsIcon icon={ShoppingBasket01Icon} className="size-5" aria-hidden />
              {count > 0 ? (
                <span
                  key={badgePulse}
                  className={cn(
                    "absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground shadow-sm",
                    badgePulse > 0 && BADGE_COUNT_CHANGE_CLASSES,
                  )}
                  aria-hidden
                >
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          Gekozen certificaten
        </TooltipContent>
      </Tooltip>
      <SheetContent
        side="right"
        className="flex flex-col [--sheet-side-width:min(42rem,calc(100vw-2rem))]"
        showCloseButton
      >
        <SheetHeader className="pr-10 text-left">
          <SheetTitle>Aanvragen</SheetTitle>
          <SheetDescription>
            Overzicht van certificaataanvragen gekoppeld aan producten waar van toepassing, plus
            overige aanvragen zonder catalogus-product. Met Aanvragen bewerken gaat u naar de
            welkomstpagina; uw selectie blijft bewaard. Verwijder rijen of wis alle aanvragen.
          </SheetDescription>
        </SheetHeader>
        <SheetScrollFade />
        <SheetBody className="min-h-0 flex-1">
          <div className="flex flex-col gap-section">
            {productGroups.length > 0 ? (
              <ProductInquiryMatrix
                groups={productGroups}
                onRemoveProductRow={(productId) => {
                  void removeProductRow(productId);
                }}
              />
            ) : null}
            <StandaloneInquiriesOverview
              drafts={standaloneInquiries}
              onRemoveDraft={(draftId) => {
                void removeStandaloneDraft(draftId);
              }}
            />
            <div className="flex flex-col gap-component sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={closePanelAndGoWelcome}
              >
                Aanvragen bewerken
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
            </div>
          </div>
        </SheetBody>
        <SheetScrollFadeBottom />
      </SheetContent>
    </Sheet>
  );
}
