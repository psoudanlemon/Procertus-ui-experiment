import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert, AlertDescription, AlertTitle, Button } from "@procertus-ui/ui";
import { useNavigate } from "react-router-dom";

export type ActiveInquiryContinueAlertProps = {
  includedCount: number;
  continuePath: string;
};

/**
 * Presentational banner — visibility is decided by the shell via `useActiveFormalInquiryContinueBanner`.
 */
export function ActiveInquiryContinueAlert({
  includedCount,
  continuePath,
}: ActiveInquiryContinueAlertProps) {
  const navigate = useNavigate();

  return (
    <Alert className="border-primary/25 bg-primary/5">
      <AlertTitle>Lopende certificatieaanvraag</AlertTitle>
      <AlertDescription className="flex flex-col gap-component sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm leading-normal">
          Je hebt een formele aanvraag met{" "}
          {includedCount === 1
            ? "één certificatieonderzoek"
            : `${includedCount} certificatieonderzoeken`}
          . Je kan op elk moment verder waar je gestopt was.
        </span>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="shrink-0 gap-micro"
          onClick={() => navigate(continuePath)}
        >
          Ga verder
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" aria-hidden />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
