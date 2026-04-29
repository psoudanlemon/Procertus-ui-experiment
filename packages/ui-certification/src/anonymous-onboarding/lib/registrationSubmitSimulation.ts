/** Labels for the mock registration processing steps (modal). */
export function registrationSimulationStepLabels(includedInquiryCount: number) {
  const n = includedInquiryCount;
  return [
    { id: "record", label: "Registratiegegevens en organisatie worden vastgelegd…" },
    { id: "persist", label: "Uw profiel en bedrijfsadres worden veilig opgeslagen…" },
    {
      id: "inquiries",
      label:
        n <= 0
          ? "Aanvragen worden aan het dossier gekoppeld…"
          : n === 1
            ? "Uw geselecteerde aanvraag wordt aan het dossier gekoppeld…"
            : `Uw ${n} geselecteerde aanvragen worden aan het dossier gekoppeld…`,
    },
    { id: "account", label: "Uw account wordt voorbereid en aan de organisatie gekoppeld…" },
  ];
}

/** Delay after progress hits 100% before navigating to the completion page. */
export const REGISTRATION_SUBMIT_REDIRECT_DELAY_MS = 450;
