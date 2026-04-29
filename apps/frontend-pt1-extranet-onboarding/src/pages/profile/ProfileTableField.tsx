import { Badge } from "@procertus-ui/ui";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { diffStringRecords } from "../../features/profile-change-requests/flatten";
import type { ProfileChangeRequest } from "../../features/profile-change-requests/types";
import { isPendingProfileChangeStatus } from "../../features/profile-change-requests/types";

import { DataRow } from "./DataRow";

export type ProfileTableFieldProps = {
  label: string;
  /** Flatten key used in profile change requests; omit when this row is not part of the change payload. */
  fieldKey?: string;
  value: ReactNode;
  pendingChange?: ProfileChangeRequest;
  /** Appended to the proposed string when this field is pending (e.g. `" (${orgId})"` for org names). */
  proposedSuffix?: string;
};

export function ProfileTableField({
  label,
  fieldKey,
  value,
  pendingChange,
  proposedSuffix = "",
}: ProfileTableFieldProps) {
  const pendingDisplay = useMemo(() => {
    if (!fieldKey || !pendingChange || !isPendingProfileChangeStatus(pendingChange.status))
      return null;
    const baseline = pendingChange.baseline as Record<string, string>;
    const proposed = pendingChange.proposed as Record<string, string>;
    const rows = diffStringRecords(baseline, proposed);
    const hit = rows.find((r) => r.key === fieldKey);
    if (!hit) return null;
    const text = `${proposed[fieldKey] ?? hit.after}${proposedSuffix}`;
    return { proposed: text.trim() === "" ? "—" : text, before: hit.before };
  }, [fieldKey, pendingChange, proposedSuffix]);

  if (pendingDisplay) {
    return (
      <DataRow
        label={label}
        value={
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">{pendingDisplay.proposed}</span>
              <Badge
                variant="outline"
                className="border-amber-500/60 bg-amber-500/10 text-xs font-normal text-foreground"
              >
                Wacht op PROCERTUS
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Goedgekeurde waarde: {pendingDisplay.before === "" ? "—" : pendingDisplay.before}
            </p>
          </div>
        }
      />
    );
  }

  return <DataRow label={label} value={value} />;
}
