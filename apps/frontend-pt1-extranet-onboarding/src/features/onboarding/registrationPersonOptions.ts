export const REPRESENTATIVE_TITLE_PRESETS = [
  { id: "none", label: "Geen titel" },
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
