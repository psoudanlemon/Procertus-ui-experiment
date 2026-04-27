# CertificationIntentPicker

Maps `meta.wizard.entryPoints` to **`SelectChoiceCard`** options. Product certification, ATG, and innovation attest render as prominent main choices; PROCERTUS attest, EPD, and partijkeuring render as quieter additional request types. SSD is treated as a separate certification mark, not as the innovation attest. `defaultCertificationIntentOptionsEn` is stub copy for Storybook; apps should supply translated options.

- Pair with a container step (e.g. `StepLayout`) and parent state for the wizard. No `fetch` or `react-router` here (Task D).
