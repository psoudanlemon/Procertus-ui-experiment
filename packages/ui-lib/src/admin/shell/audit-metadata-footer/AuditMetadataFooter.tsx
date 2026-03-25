/**
 * Presentational AuditMetadataFooter — muted audit line under a form or panel (minimal template).
 */
import { cn } from "@/lib/utils";

export type AuditMetadataPart = {
  label: string;
  value: string;
};

export type AuditMetadataFooterProps = {
  className?: string;
  parts: AuditMetadataPart[];
};

export function AuditMetadataFooter({ className, parts }: AuditMetadataFooterProps) {
  if (parts.length === 0) {
    return null;
  }

  return (
    <footer
      className={cn("border-t bg-muted/15 px-4 py-2 text-xs text-muted-foreground", className)}
    >
      <p className="flex flex-wrap items-baseline gap-x-1 gap-y-1">
        {parts.map((p, i) => (
          <span key={`${p.label}-${i}`} className="inline-flex flex-wrap items-baseline gap-1">
            {i > 0 ? (
              <span aria-hidden className="select-none text-border">
                ·
              </span>
            ) : null}
            <span className="font-medium text-foreground/80">{p.label}</span>
            <span>{p.value}</span>
          </span>
        ))}
      </p>
    </footer>
  );
}
