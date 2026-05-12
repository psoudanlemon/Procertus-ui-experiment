"use client";

import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardList,
  ChoiceCard,
  ChoiceCardGroup,
  cn,
} from "@procertus-ui/ui";
import type { ReactNode } from "react";
import type { CertificationRequestDraft } from "../../../CertificationRequestContext";
import {
  DraftCardDescription,
  sortDraftsByIntentAndProduct,
} from "../../../certification-request/draft-selection-presentation";

export type CertificationInquiriesOverviewCardProps = {
  drafts: CertificationRequestDraft[];
  /** Draft IDs currently included in the registration package selection. */
  effectiveIncludedDraftIds: readonly string[];
  onDraftIncludedChange: (draftId: string, included: boolean) => void;
  onEditRequestsClick: () => void;
  /** Used for ChoiceCard `controlId`: `${controlIdPrefix}-${draft.id}`. */
  controlIdPrefix?: string;
  className?: string;
  cardClassName?: string;
  /** When false, only renders the inner body (for use inside a Sheet with its own title). */
  showHeader?: boolean;
  title?: string;
  description?: string;
  editButtonLabel?: string;
  emptyStateMessage?: string;
  editHint?: string;
  /** Toolbar above the inquiry list (e.g. bulk actions in the shell cart). */
  listToolbar?: ReactNode;
  /**
   * When set, each row shows a control to remove that inquiry from the draft list
   * (not the same as clearing its summary checkbox).
   */
  onRemoveDraft?: (draftId: string) => void;
  removeDraftAriaLabel?: string;
};

export function CertificationInquiriesOverviewCard({
  drafts,
  effectiveIncludedDraftIds,
  onDraftIncludedChange,
  onEditRequestsClick,
  controlIdPrefix = "certification-inquiries-draft",
  className,
  cardClassName,
  showHeader = true,
  title = "Aanvragen",
  description = "Pas uw selectie van certificatieaanvragen nog aan.",
  editButtonLabel = "Aanvraag wijzigen",
  emptyStateMessage = "Geen conceptaanvragen.",
  editHint = "Ga terug naar de wizard om aanvragen toe te voegen, te verwijderen of opnieuw samen te stellen.",
  listToolbar,
  onRemoveDraft,
  removeDraftAriaLabel = "Aanvraag verwijderen uit mandje",
}: CertificationInquiriesOverviewCardProps) {
  const body = (
    <CardContent className={cn("space-y-4", !showHeader && "pt-0", className)}>
      {drafts.length === 0 ? (
        <>
          <p className="m-0 text-sm text-muted-foreground" role="status">
            {emptyStateMessage}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onEditRequestsClick}
          >
            {editButtonLabel}
          </Button>
        </>
      ) : (
        <>
          {listToolbar ? <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{listToolbar}</div> : null}
          <ChoiceCardGroup selectionMode="multiple">
            <CardList
              items={sortDraftsByIntentAndProduct(drafts)}
              widthClass="@min-[40rem]:grid-cols-1"
            >
              {(draft) => (
                <div key={draft.id} className="flex gap-2 @min-[40rem]:items-start">
                  <div className="min-w-0 flex-1">
                    <ChoiceCard
                      selectionMode="multiple"
                      value={draft.id}
                      controlId={`${controlIdPrefix}-${draft.id}`}
                      title={draft.label}
                      description={<DraftCardDescription draft={draft} />}
                      checked={effectiveIncludedDraftIds.includes(draft.id)}
                      onCheckedChange={(checked) => onDraftIncludedChange(draft.id, checked === true)}
                      variant="elevated"
                    />
                  </div>
                  {onRemoveDraft ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-1 size-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`${removeDraftAriaLabel}: ${draft.label}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveDraft(draft.id);
                      }}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden />
                    </Button>
                  ) : null}
                </div>
              )}
            </CardList>
          </ChoiceCardGroup>
          <div>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onEditRequestsClick}
            >
              {editButtonLabel}
            </Button>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{editHint}</p>
          </div>
        </>
      )}
    </CardContent>
  );

  if (!showHeader) {
    return body;
  }

  return (
    <Card
      className={cn("w-full min-w-0 overflow-hidden lg:max-w-none", cardClassName)}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {body}
    </Card>
  );
}
