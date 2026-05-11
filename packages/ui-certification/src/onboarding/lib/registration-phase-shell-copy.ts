import type { CertificationRequestDraft } from "../../CertificationRequestContext";

/**
 * Compress draft rows into a short Dutch clause for echoed shell microcopy (prototype).
 */
function draftsEchoClause(drafts: readonly CertificationRequestDraft[]): string | undefined {
  if (drafts.length === 0) {
    return;
  }

  const parts = drafts
    .map((d) => {
      const base = (d.shortLabel ?? d.label).trim();
      const product = [d.productLabel, d.productTypeStreamLabel].map((x) => x?.trim()).find(Boolean);
      if (!base) return "";
      if (product && !base.includes(product)) {
        return `${base} (${product})`;
      }
      return base;
    })
    .filter(Boolean);

  const unique = Array.from(new Set(parts));
  if (unique.length === 0) {
    return;
  }

  if (unique.length === 1) return unique[0];
  if (unique.length === 2) return unique.join(" en ");
  const head = unique.slice(0, 2).join(", ");
  return `${head} en ${unique.length - 2} andere aanvragen`;
}

/** Short headline for registration chrome: echoes service dossier · draft counts when known. */
export function buildRegistrationPhaseTitle(input: {
  registrationEntryLabel?: string;
  drafts: readonly CertificationRequestDraft[];
  fallbackTitle: string;
}): string {
  const label = input.registrationEntryLabel?.trim() ?? "";
  const n = input.drafts.length;
  const bits: string[] = [];
  if (label) bits.push(label);
  if (n > 0) {
    bits.push(n === 1 ? "1 aanvraag in dossier" : `${n} aanvragen in dossier`);
  }
  if (bits.length === 0) return input.fallbackTitle;
  return `${input.fallbackTitle} · ${bits.join(" · ")}`;
}

export function buildRegistrationPhaseDescription(input: {
  registrationEntryLabel?: string;
  drafts: readonly CertificationRequestDraft[];
  /** When no echoed context is available yet (fixtures / stray sessions). */
  fallbackDescription: string;
}): string {
  const label = input.registrationEntryLabel?.trim() ?? "";
  const draftsLine = draftsEchoClause(input.drafts);

  if (!label && !draftsLine) {
    return input.fallbackDescription;
  }

  const parts: string[] = [
    "U bevindt zich in de formele registratiefase na uw eerder gekozen aanvraagoptie voor een dossier‑aanvraag.",
  ];

  if (label) {
    parts.push(`Dit dossier heeft te maken met: ${label}.`);
  }

  if (draftsLine) {
    parts.push(`Uw opgebouwde aanvragen: ${draftsLine}.`);
  }

  parts.push(
    "Hier onderaan vullen we samen uw organisatie‑ en contactgegevens zo af dat uw dossier ontvankelijk kan worden beoordeeld.",
  );

  return parts.join(" ");
}
