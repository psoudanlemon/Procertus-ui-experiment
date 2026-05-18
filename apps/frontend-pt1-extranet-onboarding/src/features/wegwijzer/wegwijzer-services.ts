import {
  CheckmarkCircle02Icon,
  Compass01Icon,
  File01Icon,
  FilePlusIcon,
  Search01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import {
  defaultProcertusCategorizationDoc,
  type AvailableEntry,
  type AvailableEntryKey,
} from "@procertus-ui/ui-certification";

/**
 * Visual hierarchy:
 *  - 1 = focus (BENOR, CE) — prominent 2-koloms grid
 *  - 2 = bijkomende PROCERTUS-diensten (SSD, Innovation, Metrology, PROCERTUS-attest, EPD)
 *  - 3 = externe verwijzing (ATG → BUtgb, Partijkeuring → COPRO) — gebundeld onder de
 *        "Andere"-pill (ghost variant) en getoond als 2-koloms verwijspaneel.
 */
export type WegwijzerTier = 1 | 2 | 3;

export type WegwijzerService = {
  entry: AvailableEntry;
  tier: WegwijzerTier;
  icon: IconSvgElement;
  externalReferral?: { name: string; description: string; url: string };
  /**
   * Tier-3 routes waar aanvragen niet via dit onboarding-portaal lopen — alleen doorverwijzen.
   * (Bv. partijkeuring bij COPRO.) ATG blijft via PROCERTUS-intake beschikbaar in de wizard.
   */
  externalRequestOnly?: boolean;
  /**
   * Override label used in the choice-card pill on the Wegwijzer page.
   * Defaults to `entry.label` (same as the master-card title) — set this
   * only when the master-card title is too long for a pill, e.g. SSD's
   * "Sortie du Statut de Déchets".
   */
  pillLabel?: string;
};

const ENTRIES_BY_ID = new Map<AvailableEntryKey, AvailableEntry>(
  (defaultProcertusCategorizationDoc.meta.availableEntries ?? []).map((availableEntry) => [
    availableEntry.id,
    availableEntry,
  ]),
);

function entry(id: AvailableEntryKey): AvailableEntry {
  const found = ENTRIES_BY_ID.get(id);
  if (!found) throw new Error(`Categorization entry "${id}" missing from procertus-categorization.json`);
  return found;
}

export const WEGWIJZER_SERVICES: readonly WegwijzerService[] = [
  { entry: entry("benor"), tier: 1, icon: CheckmarkCircle02Icon },
  { entry: entry("ce"), tier: 1, icon: CheckmarkCircle02Icon },
  { entry: entry("ssd"), tier: 2, icon: CheckmarkCircle02Icon, pillLabel: "SSD" },
  { entry: entry("innovation-attest"), tier: 2, icon: FilePlusIcon },
  { entry: entry("metrology"), tier: 2, icon: Compass01Icon },
  { entry: entry("procertus"), tier: 2, icon: File01Icon },
  { entry: entry("epd"), tier: 2, icon: Search01Icon, pillLabel: "EPD" },
  {
    entry: entry("atg"),
    tier: 3,
    icon: Share01Icon,
    externalReferral: {
      name: "BUtgb",
      description:
        "ATG-aanvragen worden door PROCERTUS doorgezet naar het Belgische technische goedkeuringsbureau (BUtgb).",
      url: "https://www.butgb.be/",
    },
  },
  {
    entry: entry("partijkeuring"),
    tier: 3,
    icon: Share01Icon,
    externalReferral: {
      name: "COPRO",
      description:
        "Partijkeuring wordt niet via dit portaal aangevraagd. COPRO voert partijkeuringen uit volgens het COPRO-partijkeuringsreglement (PKRL); gebruik het aanvraagkanaal van COPRO.",
      url: "https://www.copro.eu/nl/keuring/partijkeuring",
    },
    externalRequestOnly: true,
  },
];

export const TIER_1_SERVICES = WEGWIJZER_SERVICES.filter((s) => s.tier === 1);
export const TIER_2_SERVICES = WEGWIJZER_SERVICES.filter((s) => s.tier === 2);
export const TIER_3_SERVICES = WEGWIJZER_SERVICES.filter((s) => s.tier === 3);

export function findWegwijzerService(id: string | undefined): WegwijzerService | undefined {
  if (!id) return undefined;
  return WEGWIJZER_SERVICES.find((s) => s.entry.id === id);
}
