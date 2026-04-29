import { Badge } from "@procertus-ui/ui";
import type { CertificationRequestDraft } from "@procertus-ui/ui-certification";

export function sortDraftsByIntentAndProduct(drafts: CertificationRequestDraft[]) {
  return [...drafts].sort((a, b) => {
    const intent = (a.shortLabel ?? a.label).localeCompare(b.shortLabel ?? b.label);
    if (intent !== 0) return intent;

    const product = (a.productLabel ?? "").localeCompare(b.productLabel ?? "");
    if (product !== 0) return product;

    return (a.productTypeStreamLabel ?? "").localeCompare(b.productTypeStreamLabel ?? "");
  });
}

export function DraftCardDescription({ draft }: { draft: CertificationRequestDraft }) {
  return (
    <span className="flex flex-col gap-micro">
      {draft.productLabel ? (
        <span className="font-medium text-foreground">
          {draft.productTypeStreamLabel ? (
            <Badge variant="default" className="mr-1">
              {draft.productTypeStreamLabel}
            </Badge>
          ) : null}
          {draft.entryId === "ce" && draft.value ? (
            <Badge variant="outline" className="mr-1">
              {draft.value}
            </Badge>
          ) : null}
          {draft.productLabel}
        </span>
      ) : null}
      {draft.productPath ? <span className="text-muted-foreground">{draft.productPath}</span> : null}
      {draft.context ? (
        <span className="mt-micro rounded-md border border-border/60 bg-muted/30 p-component text-foreground">
          <span className="mb-micro block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Aanvraagcontext
          </span>
          {draft.context}
        </span>
      ) : null}
    </span>
  );
}
