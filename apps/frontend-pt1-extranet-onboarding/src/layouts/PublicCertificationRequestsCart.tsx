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
  ProductInquiryMatrix,
  groupDraftsByProduct,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetTrajectFlow } from "../features/traject/traject-submission-context";

const WELCOME_PATH = "/welcome";

export function PublicCertificationRequestsCart() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const { flowState } = useOnboardingFlowState();
  const api = useOnboardingFlowApi();
  const { drafts } = flowState;

  const count = drafts.length;

  const productGroups = useMemo(() => groupDraftsByProduct(drafts), [drafts]);

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
      <SheetContent
        side="right"
        className="flex flex-col [--sheet-side-width:min(42rem,calc(100vw-2rem))]"
        showCloseButton
      >
        <SheetHeader className="pr-10 text-left">
          <SheetTitle>Aanvragen</SheetTitle>
          <SheetDescription>
            Overzicht van uw huidige certificaataanvragen per product. Ga naar de startpagina om uw
            certificaat- en productkeuze opnieuw samen te stellen (formeel of informatief), verwijder
            een productrij, of wis het volledige mandje.
          </SheetDescription>
        </SheetHeader>
        <SheetScrollFade />
        <SheetBody className="min-h-0 flex-1">
          <div className="flex flex-col gap-section">
            <ProductInquiryMatrix
              groups={productGroups}
              onRemoveProductRow={(productId) => {
                void removeProductRow(productId);
              }}
            />
            <div className="flex flex-col gap-component sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={closePanelResetGuestFlowAndGoWelcome}
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
