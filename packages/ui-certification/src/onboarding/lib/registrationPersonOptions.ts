export const REPRESENTATIVE_TITLE_PRESETS = [
  { id: "none", label: "Geen aanhef of titel" },
  { id: "mr", label: "Dhr." },
  { id: "mrs", label: "Mevr." },
  { id: "mx", label: "Mx" },
  { id: "dr", label: "Dr." },
  { id: "ir", label: "Ir." },
  { id: "ing", label: "Ing." },
  { id: "prof", label: "Prof." },
  { id: "other", label: "Anders…" },
] as const;

export const REPRESENTATIVE_ROLE_PRESETS = [
  { id: "none", label: "Geen functie gekozen" },
  { id: "managing_director", label: "Zaakvoerder / bestuurder" },
  { id: "legal_representative", label: "Wettelijk vertegenwoordiger" },
  { id: "quality", label: "Kwaliteit / compliance" },
  { id: "technical", label: "Technisch / R&D" },
  { id: "procurement", label: "Inkoop / aanbesteding" },
  { id: "sales", label: "Sales / accountmanagement" },
  { id: "administration", label: "Administratie / finance" },
  { id: "other", label: "Anders…" },
] as const;

export function titleLabelForPresetId(id: string): string {
  return REPRESENTATIVE_TITLE_PRESETS.find((p) => p.id === id)?.label ?? "";
}

export function roleLabelForPresetId(id: string): string {
  return REPRESENTATIVE_ROLE_PRESETS.find((p) => p.id === id)?.label ?? "";
}

/** Title/role presets: neither `none` nor empty “other…” free text allowed. */
export function representativePresetSelectionComplete(
  presetIdRaw: string,
  freeText: string,
  presets: readonly { readonly id: string }[],
): boolean {
  const presetIdTrim = presetIdRaw?.trim() ?? "";
  const presetId = presets.some((p) => p.id === presetIdTrim) ? presetIdTrim : "none";
  if (presetId === "none") return false;
  if (presetId === "other") return Boolean(freeText.trim());
  return true;
}
