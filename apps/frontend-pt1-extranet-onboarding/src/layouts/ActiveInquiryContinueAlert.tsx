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
      <AlertTitle>Actieve certificatie aanvraag</AlertTitle>
      <AlertDescription className="flex flex-col gap-component sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm leading-normal">
          U hebt een lopende formele aanvraag met{" "}
          {includedCount === 1
            ? "één geselecteerd certificatieonderzoek"
            : `${includedCount} geselecteerde certificatieonderzoeken`}
          . U kunt de aanvraag voor de opstart van dit traject op elk moment verderzetten.
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
