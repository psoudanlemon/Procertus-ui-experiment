import { defaultProcertusCategorizationDoc } from "../../categorization-data";
import type { AvailableEntry } from "../../types";

const ENTRIES_BY_ID = new Map<string, AvailableEntry>(
  (defaultProcertusCategorizationDoc.meta.availableEntries ?? []).map((entry) => [entry.id, entry]),
);

/** Fallback voor wizard-entry-points die niet als `availableEntry` staan (bv. product-certification). */
const FALLBACK_COLUMN_LABEL: Record<string, string> = {
  "product-certification": "Productcertificatie",
};

/**
 * Zelfde certificaat-kolomtitels als {@link ProductInquiryMatrix}.
 */
export function inquiryMatrixColumnLabelFor(entryId: string): string {
  return (
    ENTRIES_BY_ID.get(entryId)?.label ?? FALLBACK_COLUMN_LABEL[entryId] ?? entryId.toUpperCase()
  );
}
