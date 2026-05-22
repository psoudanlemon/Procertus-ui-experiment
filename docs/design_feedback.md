# Design feedback — todo

Checklist op basis van de design review en daaropvolgende audits.

Bovenaan staat **[Afgewerkt](#afgewerkt)**: alle items die al opgelost zijn. Daaronder de openstaande secties:

1. [**Cross-cutting patronen / componenten**](#1-cross-cutting-patronen--componenten): herbruikbare componenten en token-beslissingen die op meerdere plekken landen.
2. [**Flow- en gedrags-architectuur**](#2-flow--en-gedrags-architectuur): bredere beslissingen over winkelmandje, drafts en navigatie.
3. [**Page-specifieke wijzigingen**](#3-page-specifieke-wijzigingen): per scherm, met cross-refs naar cross-cutting items.

**Onderdelen in sectie 1, in alfabetische scan-volgorde:**
[Copy density](#copy-density), [Patronen in ontwikkeling](#patronen-in-ontwikkeling).

---

## Afgewerkt

- [x] §3.7 Maatschappelijke zetel volledig hertekend en als productiestap uitgerold. [OnboardingCompanyZetelStep](packages/ui-certification/src/components/onboarding/company-step/OnboardingCompanyZetelStep.tsx): één enkel KBO/btw-input-veld met info-icon + tooltip naast het label, leading search-icon op de `Autocomplete` primitive (nieuwe `searchIconAlign` prop), max-width 320px op het veld, inline "Zoeken"-knop ernaast (disabled tot structurele validatie groen is, met spinner + "Zoeken…" tijdens loading-fase, blijft staan in ready zodat de gebruiker een ander nummer kan invoeren). Drie fases: **idle** (lege progress balk + "Wachten op btw-nummer 0%" + greyed-out bullets), **loading** (animerende balk + "Bezig met opzoeken" + bullet-progression), **ready** (succes-Alert met `variant="success"` + check-icon óf failure-Alert met `variant="destructive"`). Bullet-labels zijn nu locale-specifiek: VIES, Kruispuntbank van Ondernemingen, bedrijfs- en adresgegevens (3 bullets ipv 5). Chrome-copy van de stap herschreven naar één enkele lead-sentence; sectie-titels en helper-text die de input herhaalden zijn weg. Alle interne gaps op `space-y-section` token. Lookup-simulatie ([use-onboarding-company-lookup-prototype-effects.ts](packages/ui-certification/src/onboarding/use-onboarding-company-lookup-prototype-effects.ts)) is mee aangepast op de nieuwe 3-bullets timing. Spinner-primitive gebruikt nu `text-current` zodat 'm in buttons automatisch primary-foreground erft. Helper-text gebruikt `text-destructive-foreground` (was per ongeluk het background-token).
- [x] §3.8 Certificatie-stap behouden maar volledig hertekend als "Bedrijfslocaties & certificatie". [OnboardingCompanyLegalEntitiesStep](packages/ui-certification/src/components/onboarding/company-step/OnboardingCompanyLegalEntitiesStep.tsx) heeft twee zones: **Locatiebeheer** (grid met de maatschappelijke zetel als locked-card uit de KBO-prefill, eventuele toegevoegde vestigingen, plus een inline composer-card "+ Extra vestiging toevoegen" met Naam + Vestigingsnummer + Adres) en **Allocatie-tabel** (één rij per draft × certificaat-type, radio-cells per locatie-kolom, zetel-kolom default checked, kolommen verschijnen dynamisch bij elke toegevoegde vestiging). Vervangt de oude select-gebaseerde mapping en de gedeelde `OnboardingVestigingenLegalEntityManager` (laatste is verwijderd).
- [x] §3.9 Facturatie + Extra contacten samengevoegd in één stap. [OnboardingInvoicingStep](packages/ui-certification/src/components/onboarding/invoicing-step/OnboardingInvoicingStep.tsx): drie Switch-accordions (afwijkend facturatieadres, andere contactpersoon facturatie, aparte cert/inspectie-contact) zijn vervangen door [OptionalCheckboxSection](packages/ui-certification/src/components/onboarding/shared/OptionalCheckboxSection.tsx) — zie cross-cutting checkbox-pattern. Blokken "Certificatie-aanvragen in dit dossier" en "Factuur rechtspersoon per aanvraag" zijn volledig verwijderd (mapping leeft nu in de Certificatie-stap). Reservecontact zit binnen het primaire cert-contactblok met inline "+ Reservecontact toevoegen"-actie (multi-instance entry pattern). De voormalige "Extra contacten"-stap is mee weggesneden.
- [x] §3.10 Nazicht herwerkt en als productiestap uitgerold. [OnboardingSummaryStep](packages/ui-certification/src/components/onboarding/summary-step/OnboardingSummaryStep.tsx): zware Card-wrappers rond product-matrix, innovation-attest en metrologie zijn vervangen door compacte `SummarySection` met thin border. De ChoiceCardGroup multi-select op te dienen drafts is een compacte Table met inline checkbox-cellen. Knop "Aanvragen wijzigen" is weg — gebruiker navigeert terug via "Terug" of de klikbare stepper.
- [x] §3.6 Identificatie (voorheen Registratie) volledig herwerkt en doorgeduwd naar productie. Stap is herframed als *"Identificatie van de wettelijke vertegenwoordiger"* via chrome-copy en stepper-label updates ([onboarding-registration-chrome-copy.ts](packages/ui-certification/src/onboarding/onboarding-registration-chrome-copy.ts), [onboarding-stepper-model.ts](packages/ui-certification/src/onboarding/onboarding-stepper-model.ts)). [OnboardingCustomerStep](packages/ui-certification/src/components/onboarding/customer-step/OnboardingCustomerStep.tsx): primair formulier vraagt nu de gegevens van de wettelijke vertegenwoordiger (bindt aan `legalRepresentative`), met daaronder een standaard-aangevinkte checkbox *"Ik (de aanvrager) ben de wettelijke vertegenwoordiger van dit bedrijf."* en een InformationCircleIcon-trigger met HoverCard die het belang ervan uitlegt. Bij uitvinken verschijnt een tweede sectie *Uw eigen contactgegevens* (bindt aan `registrant`) via een Radix Collapsible met `animate-collapsible-down` / `animate-collapsible-up` voor beide richtingen. De checkbox wordt automatisch uitgevinkt zodra de functie van de rep een rol is die geen handtekenbevoegdheid impliceert (anders dan zaakvoerder/bestuurder of wettelijk vertegenwoordiger). Dubbele/driedubbele titels rond "Wettelijke vertegenwoordiger" zijn opgeruimd: één paginakop, geen geneste H4-koppen meer. Subform [IdentificatiePersonSubform](packages/ui-certification/src/onboarding/identificatie-subforms.tsx) kreeg een `layout="twoColumn"` prop voor de 2-koloms grid (aanhef alleen op rij 1, voornaam + achternaam, e-mail + telefoon, functie + taal), waarbij `*`-markers verdwijnen en het telefoon-veld een "Optioneel" placeholder krijgt. Inter-sectie spacing zit op het `space-y-region` token.
- [x] Stepper-volgorde gewijzigd van `origin → customer → company → ...` naar `origin → company → customer → ...` zodat de organisatie-identificatie eerst gebeurt op de zetel-stap, voordat de gebruiker de wettelijke vertegenwoordiger identificeert. Sequence, availability-gating, navigatie en resume-logica aangepast in [onboarding-registration-steps.ts](packages/ui-certification/src/onboarding/onboarding-registration-steps.ts), [onboarding-stepper-model.ts](packages/ui-certification/src/onboarding/onboarding-stepper-model.ts), [use-onboarding-flow.tsx](packages/ui-certification/src/onboarding/use-onboarding-flow.tsx) en [derive-formal-onboarding-resume-step.ts](packages/ui-certification/src/onboarding/derive-formal-onboarding-resume-step.ts).
- [x] Veldtype follow-ups op de Registratie-stap en het Innovatie-attest doorgevoerd: (1) [kvkAutocomplete](packages/ui-certification/src/onboarding/lib/kvk-autocomplete.ts)-adapter met mock-dataset voor `origin = nl`, geconsumeerd door [OnboardingCustomerStep](packages/ui-certification/src/components/onboarding/customer-step/OnboardingCustomerStep.tsx) (selectie autovult naam, KvK/btw, adres en land); (2) gemeente-suggesties via `<datalist>` in [IdentificatieAddressSubform](packages/ui-certification/src/onboarding/identificatie-subforms.tsx) — mock-lijsten voor BE/NL/DE/FR via [cityAutocomplete](packages/ui-certification/src/onboarding/lib/city-autocomplete.ts), vrije tekst blijft mogelijk voor onbekende gemeenten; (3) postale-adres-suggesties op bouwheer- en projectadres in [OnboardingInnovationAttestStep](packages/ui-certification/src/components/onboarding/innovation-attest-step/OnboardingInnovationAttestStep.tsx) via een nieuwe `FormAddressInput` met [addressAutocomplete](packages/ui-certification/src/onboarding/lib/address-autocomplete.ts).
- [x] 3.3 "Voeg per product certificaten toe": "Nog certificatie toevoegen"-knop en "staan niet in de kolommen"-callout verwijderd; elke kolomheader van [BundleMatrixHeader](packages/ui-certification/src/components/traject/BundleAssemble.tsx) toont een tooltip met cert-beschrijving uit `BUNDLE_CERT_META`; niet-beschikbare certificaten tonen een disabled checkbox met hover-tooltip die uitlegt waarom ze niet beschikbaar zijn voor dat product.
- [x] Annuleren-label in [TrajectStoryFooter](packages/ui-certification/src/components/traject/TrajectStoryFooter.tsx) hernoemd naar "Naar startpagina" zodat het matcht met het feitelijke gedrag (geen draft-behoud op dit moment).
- [x] Stepper-redesign uitgerold over het volledige onboardingtraject. [OnboardingFlowView](packages/ui-certification/src/onboarding/onboarding-flow-view.tsx): layout omgedraaid (stappen-rail links, content rechts), `gap-section` ipv `gap-region`, content stretcht mee in hoogte via `md:flex md:flex-col` + `md:flex-1`. [OnboardingFloatingStepsNav](packages/ui-certification/src/components/onboarding/flow/OnboardingFloatingStepsNav.tsx): sticky gedrag verwijderd, uniforme `p-region` wrapper-padding, `allowSkipAhead` default naar `false`. [buildOnboardingStepperSteps](packages/ui-certification/src/onboarding/onboarding-stepper-model.ts): statische guidance copy per stap, plus `completed`-flag per stap afgeleid uit de validity-helpers in `deriveOnboardingPhaseValidityForFlow`. Primitive [StepLayoutStepper](packages/ui/src/components/step-layout-stepper/StepLayoutStepper.tsx) uitgebreid met `allowSkipAhead`, `completed` per step (witte indicator met blauw vinkje voor ahead-completed steps), `lineCovered`-separator die kijkt of de volgende step bereikt is, hele rij klikbaar (indicator + titel + description), gap tussen titel en description weggehaald. [stepper.tsx](packages/ui/src/components/stepper.tsx) state-ordering: `active` wint van `completed` zodat de huidige stap zijn nummer behoudt zodra zijn data valid is.
- [x] 3.12 OnboardingRegistrationCompletePage geconsolideerd: drie afzonderlijke `PublicOverviewSection`-kaarten plus mailbox-voettekst en `Reset sessie-gegevens`-knop verwijderd. Pagina hergebruikt nu `InfoRequestSubmittedPanel` met registratie-specifieke copy en een primary/secondary CTA-paar ("Ga naar Klantenportaal" + "Open mijn mailbox"). Panel uitgebreid met override-props (`heading`, `description`, `sectionTitle`, `sectionDescription`, `actions`).
- [x] Header-spacing geoptimaliseerd: consistent ritme en betere groepering tussen icon buttons en de primaire login knop. Login-knop verbergt zodra de gebruiker een guest-flow start onder `/welcome/aanvraag/*` of `/welcome/formal-request/*`.
- [x] BTW/KBO-veld op Registratie naar Autocomplete voor `origin = be`: [kboAutocomplete](packages/ui-certification/src/onboarding/lib/kbo-autocomplete.ts)-adapter met mock-dataset bouwt het Belgische scenario; selectie autovult bedrijfsnaam, zeteladres en land/landcode. Voor andere origins blijft de Input met structurele validatie het gedrag.
- [x] Autocomplete-primitive gebouwd in packages/ui (input-as-trigger, popover opent enkel bij relevante content, async fetch met abort-signal, loading/empty/results states, results-heading, input-like progressive states).
- [x] Cart-status alleen nog zichtbaar in het winkelmandje en de header-cart-indicator; pill, count-badge en selected ring op homepage kaarten en filtertabs verwijderd.
- [x] CreatableCombobox primitive gebouwd in packages/ui (searchable select met inline create-new actie, input-like states, X-clear, tooltip-on-truncate). Toegepast op: Role-veld (Registratie), Aanhef-veld (Registratie + Extra contacten). Land-veld in adressubform (Maatschappelijke zetel + Facturatie incl. afwijkend facturatieadres) op Combobox (zoekbaar). Regio/land op Metrologie-attest van Textarea naar Input (single-line); multi-select blijft follow-up.
- [x] Veldtype-audit gedaan over het volledige onboarding-traject (alle stappen, alle invulvelden).
- [x] Verified-input pattern gebouwd voor velden met validatie en toegepast op Registratie, Facturatie en de overige validatievelden in het traject.
- [x] Hover state toegevoegd aan input en textarea; Alert padding op gecureerde spacing-schaal gezet; icoon in empty component gefixt voor dark mode.
- [x] Raw `<h1>`/`<h2>`/`<h3>`/`<h4>` op publieke pagina's, detail-, demo- en wizard-/Nazicht-secties omgezet naar de H-component-set. A/B/C-beslissing: Optie A — wizard form-sectie koppen via `<H4 className="normal-case tracking-tight text-foreground">`, nazicht-sectie koppen via `<H3>`. Dashboard widget raw `<h4>` labels geconverteerd naar `<p>`; `text-[11px]` gesnapt naar `text-xs`. Heading a11y-volgorde verificatie meegenomen in page-specifieke aanpassingen.
- [x] Desktop-breedte upgrades op AuthLayout, DraftRequestList, RequestPackageReview en de categorization tree-view sheet; desktop-breedte audit (ui-lib + ui-certification) afgerond, geen resterende `max-w-2xl`/`max-w-3xl` zonder responsive upgrade.
- [x] `leading-[1.6]` gesnapt in alle resterende sites (OnboardingSummaryStep, onboarding-flow-view, RequestPackageReview).
- [x] Copy density pass: beschrijvingen ingekort op OnboardingCompanyZetelStep (zetel-sectie) en OnboardingInvoicingStep (3 sectie-omschrijvingen).
- [x] Publieke pagina's omgezet naar je-vorm; em dashes uit user-facing copy verwijderd; "Gelieve" en passieve constructies opgeschoond; prototype-meta-commentaar uit user-facing copy gehaald; Engelse strings vertaald; vakjargon vervangen door plain Dutch.
- [x] Copy-pass herschreven op: login, triage (incl. bullets), informatieaanvraag-pagina, aanvraag-verzonden-pagina + fallbacks, banner-copy voor lopende aanvraag, productkeuze, per-product certificaten, wegwijzer, dashboard, placeholder-fallback. Check-bullets op TriageOptionCard van text-success naar accent-foreground gezet.
- [x] Copy taalregister 4.11 (OnboardingEntryPlaceholderPage): volledig in het Nederlands, inclusief knoplabel "Terug naar aanmelden". 4.12 (footerConfig): "Privacy policy" → "Privacybeleid". 4.13 (OnboardingRegistrationCompletePage): alle copy-items doorgevoerd; off-token `text-[1.0625rem]` en `leading-[1.65]` gesnapt naar `text-base`.
- [x] TrajectStoryFooter callbacks samengevoegd in één mode-prop; label-overrides verwijderd.
- [x] Distill 5.1: BrandGradientHero verplaatst naar story `design tokens/Gradient/Hero` en uit app-source verwijderd; off-token `max-w-[1400px]` op `DesignSystemPage` gesnapt naar `max-w-7xl`.
- [x] Distill 5.1: expert-call dedup bewust niet doorgevoerd; de callout staat op Triage en Wegwijzer in identieke vorm voor consistente ankering.
- [x] Distill 5.1: "Organisatie en context" kaart op InfoRequestSubmittedPage opgevouwen in de lead — organisatie + ontvangen-op timestamp nu in de heading-paragraaf, aparte kaart verdwenen. Heading hernoemd naar "Bedankt voor je aanvraag".
- [x] Distill 5.1: "Onboarding naar het Klantenportaal" en "Volgende stappen op het Klantenportaal" samengevoegd tot één sectie "Volg je dossier op" met verwijzing naar My PROCERTUS en compacte tabel (e-mailadres + rol) van uitgenodigde contactpersonen. Logica gebundeld in [InfoRequestSubmittedPanel](packages/ui-certification/src/components/info-request-submitted/InfoRequestSubmittedPanel.tsx) en geconsumeerd door [InfoRequestSubmittedPage](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx).
- [x] Distill 5.2: TriageOptionCard geëxtraheerd naar `DecisionCard` + `DecisionCardCallout` in `packages/ui-lib` (variants `elevated` / `faded` aligned met de Card-primitive); TriagePage en de Wegwijzer-callout consumeren de primitives.
- [x] Distill 5.2: `data-density` regel publiek=spacious / ingelogd=operational doorgevoerd via `PublicAppShell` en de twee top-level publieke confirmation-pagina's; redundante lokale overrides opgeruimd.
- [x] Distill 5.2: BrowseCard `variant="faded"` bewust behouden in de set voor toekomstige opportuniteiten.

---

## 1. Cross-cutting patronen / componenten

### Copy density

_Feedback origineel gezien op:_ **Maatschappelijke zetel** (waar tekst ~50% van het scherm besloeg — twee callouts, herhaalde helper text onder elk veld). Vanuit die pagina werd duidelijk dat het een patroon is dat over de hele flow speelt — vandaar de bredere pass.

- [x] Info-icons + tooltips voor "nice to know"-content toegepast op de KBO/btw-input (label-icon met tooltip op de Maatschappelijke zetel-stap). Pattern beschikbaar via gedeelde `Tooltip` primitive — kan op nieuwe velden gehergebruikt worden.

### Patronen in ontwikkeling

Items die eerder als afgerond stonden, maar terug opengetrokken zijn omdat de onderliggende redesigns nog itereren (o.a. Maatschappelijke zetel uit productie teruggetrokken, Certificatie-stap in redesign-track op Accordion-variant).

- [ ] Cross-cutting checkbox-pattern: [OptionalCheckboxSection](packages/ui-certification/src/components/onboarding/shared/OptionalCheckboxSection.tsx) primitive in de gedeelde `shared/` folder, gebruikt op Facturatie voor alle drie de optionele blokken plus het cert/inspectie-contactblok.
- [ ] Multi-instance entry pattern toegepast: extra zetels via composer-card op de Certificatie-stap; reservecontact inline binnen het primaire cert-contactblok op Facturatie.
- [ ] Cancel-knop in [CustomerOnboardingFlow](apps/frontend-pt1-extranet-onboarding/src/features/customer-onboarding/CustomerOnboardingFlow.tsx) + [certification-request/model.ts](packages/ui-certification/src/certification-request/model.ts) hernoemd naar "Aanvraag annuleren" zodat het label de actie expliciet beschrijft.
- [ ] §1 Choice card componenten: cross-cutting pattern afgerond. Beide originele cases (Land/regio en Registratie) zijn opgelost via verschillende routes: Land/regio via primitive-tweaks aan [ChoiceCard.tsx](packages/ui/src/components/choice-card/ChoiceCard.tsx) (gecentreerde leading-icon zonder description, `faded` description-size aligned, `pt-micro` offset weg) — zie §3.5 entry hieronder; Registratie via overstap naar een lichtere checkbox-oplossing — zie §3.6 entry hieronder. Het cross-cutting principe (kies een checkbox wanneer de essentie "ik wil extra info opgeven" of "ik ben dit / ik ben dit niet" is) is daarmee gedemonstreerd en kan op nieuwe cases toegepast worden.

---

## 2. Flow- en gedrags-architectuur

### Draft- en cart-gedrag

- [ ] Implementeer draft-behoud bij tussentijds verlaten van de flow (annuleren-knop, klik op Procertus-logo, taalkiezer, andere globale nav).
- [ ] Zorg dat de gebruiker kan terugkomen en verdergaan exact waar hij stopte.
- [ ] "Bevestig" op de stap "Controleer je aanvraagpakket" voegt de certificaten toe aan het winkelmandje en stuurt de gebruiker terug naar de homepage.
- [ ] Toon na "Bevestig" een "verder winkelen of afrekenen"-pop-up in platform-context (bv. "Nog een certificaat aanvragen" vs "Naar het winkelmandje").
- [ ] "Bevestig" op het winkelmandje gaat door naar de triage-pagina (informatieve vs formele aanvraag) — pas-echte commitmoment.

### Winkelmandje / "Aanvragen"-panel

_Hoe openen:_ klik op de **"Aanvragen"**-knop in de header (PublicRegistryHeader) op een pagina onder [`/welcome`](http://localhost:5173/welcome). Het mandje opent als sheet/drawer aan de rechterkant.

- [ ] Vervang tabel-view door een card list (per aanvraag/product een kaart).
- [ ] Maak per-product bewerken mogelijk (één enkele aanvraag in plaats van enkel "alle aanvragen samen").
- [ ] Behoud "Alle aanvragen wissen" maar plaats minder prominent.
- [ ] Voeg een "Bevestig"-actie toe op het mandje die naar de triage-pagina leidt.

### Scope "Controleer je aanvraagpakket"

- [ ] Herdefinieer als samenvatting van de huidige flow (niet van het hele winkelmandje).
- [ ] Verwijder als gevolg de "Andere aanvragen"-sectie voor niet-productgebonden certificaten binnen één flow.

### Footer-actiebar

- [ ] Definieer een consistente aanpak voor situaties met meerdere footer-acties (bv. secundaire/tertiaire styling, "meer"-actie, of aparte zone net boven de footer).

---

## 3. Page-specifieke wijzigingen

> **Dev server:** `http://localhost:5173`. Plak het pad achter de base-URL om de pagina lokaal te openen. Routes met `:serviceId` verwachten een service-id uit de catalogus (bv. een BENOR-service uit de homepage).

### 3.4 Onboarding stap "Controleer je aanvraagpakket"

_Route:_ `/welcome/aanvraag/:serviceId/controleren`

- [ ] Verplaats "Nog certificatie toevoegen" naar onderaan / in de footer (zie [Footer-actiebar](#footer-actiebar)).
- [ ] Implementeer bevestig-gedrag naar mandje + popup (zie [Draft- en cart-gedrag](#draft--en-cart-gedrag)).

### 3.5 Traject — stap "Land of regio"

_Route:_ [`/welcome/formal-request/origin`](http://localhost:5173/welcome/formal-request/origin)

- [x] Choice cards geoptimaliseerd: één gestackte lijst met vier `ChoiceCard`s (trailing radio + vlag in `leading`), BE/NL/EU op `elevated`-variant, Wereldwijd op `faded`. Title-as-step-prompt ("Kies uw land of regio") + consequence-gerichte page-description ("Uw keuze bepaalt welke gegevens we in de volgende stappen vragen."). Option-titles ingekort naar "België / Nederland / Europa / Wereldwijd"; descriptions herschreven naar "Het bedrijf waarvoor u de certificaten wil aanvragen is gevestigd in..". Vlag in 38.85px-leading-slot, gelijk aan de gecombineerde title+description hoogte. EU-vlag in officiële 3:2 ratio, alle vier glyphs even breed. Productie: [OnboardingOriginStep](packages/ui-certification/src/components/onboarding/origin-step/OnboardingOriginStep.tsx) + [onboarding-registration-chrome-copy](packages/ui-certification/src/onboarding/onboarding-registration-chrome-copy.ts) + [onboarding-request-origin](packages/ui-certification/src/onboarding/onboarding-request-origin.ts). ChoiceCard-primitive: leading-icon centreert nu tegen de titel als er geen description is en heeft geen padding-top meer voor de description-case ([ChoiceCard.tsx](packages/ui/src/components/choice-card/ChoiceCard.tsx)).

### 3.11 Klantenportaal login pagina

_Route:_ [`/login`](http://localhost:5173/login)

- [ ] Bouw afbeelding-rotatie / pool van meerdere visuals op de klantenportaal login pagina (huidige situatie: altijd dezelfde witte bouwvakker).
- [ ] Stel de pool divers samen — o.a. vrouwen, mensen met andere huidskleur of achtergrond — passend bij de Procertus-context (bouw, productie, certificering).
