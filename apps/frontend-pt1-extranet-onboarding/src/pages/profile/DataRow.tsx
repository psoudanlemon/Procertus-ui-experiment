import type { ReactNode } from "react";

export function DataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,11rem)_1fr] gap-x-4 gap-y-1 border-b border-border/50 py-2.5 text-sm last:border-b-0 sm:grid-cols-[13rem_1fr]">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0 wrap-break-word text-foreground">{value ?? "—"}</dd>
    </div>
  );
}
