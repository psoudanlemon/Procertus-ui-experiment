/**
 * Presentational comment thread — stacked bubbles (incoming vs outgoing layout).
 */
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@procertus-ui/ui";

export type WorkflowCommentThreadItem = {
  id: string;
  authorName: string;
  body: string;
  timestampLabel: string;
  avatarFallback?: string;
  /** Outgoing aligns right (e.g. current user) */
  variant?: "incoming" | "outgoing";
};

export type WorkflowCommentThreadProps = {
  className?: string;
  title: string;
  description?: string;
  comments: readonly WorkflowCommentThreadItem[];
  emptyLabel?: string;
};

export function WorkflowCommentThread({
  className,
  title,
  description,
  comments,
  emptyLabel = "No comments yet.",
}: WorkflowCommentThreadProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-lg overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          comments.map((c) => {
            const outgoing = c.variant === "outgoing";
            const initials = c.avatarFallback ?? c.authorName.slice(0, 2).toUpperCase();

            return (
              <div
                key={c.id}
                className={cn("flex gap-2", outgoing ? "flex-row-reverse" : "flex-row")}
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "flex max-w-[85%] flex-col gap-1 rounded-2xl border px-3 py-2 text-sm shadow-sm",
                    outgoing
                      ? "rounded-tr-sm border-primary/25 bg-primary/10 text-foreground"
                      : "rounded-tl-sm border-border bg-muted/60",
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-wrap items-baseline gap-x-2 gap-y-0 text-xs",
                      outgoing ? "justify-end" : "justify-start",
                    )}
                  >
                    <span className="font-medium">{c.authorName}</span>
                    <span className="text-muted-foreground">{c.timestampLabel}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{c.body}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
