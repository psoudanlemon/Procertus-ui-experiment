# Design feedback — todo

Checklist op basis van de design review en daaropvolgende audits.

Bovenaan staat **[Afgewerkt](#afgewerkt)**: alle items die al opgelost zijn. Daaronder de openstaande secties:

1. [**Cross-cutting patronen / componenten**](#1-cross-cutting-patronen--componenten): herbruikbare componenten en token-beslissingen die op meerdere plekken landen.
2. [**Flow- en gedrags-architectuur**](#2-flow--en-gedrags-architectuur): bredere beslissingen over winkelmandje, drafts en navigatie.
3. [**Page-specifieke wijzigingen**](#3-page-specifieke-wijzigingen): per scherm, met cross-refs naar cross-cutting items.

**Onderdelen in sectie 1, in alfabetische scan-volgorde:**
[Choice card componenten](#choice-card-componenten) · [Copy density](#copy-density) · [Multi-instance entry pattern](#multi-instance-entry-pattern) · [Toggle/switch accordion → checkbox](#toggleswitch-accordion--checkbox) · [Veldtype per invulveld](#veldtype-per-invulveld).

---

## Afgewerkt

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

### Choice card componenten

_Feedback origineel gezien op:_ **Land of regio** (vier kaarten België / Nederland / Een ander Europees land / Buiten Europa, met vlag rechtsboven) en **Registratie** (twee kaarten "Ja, ik ben de wettelijke vertegenwoordiger" / "Nee, ik vul namens de wettelijke vertegenwoordiger in"). Vanuit die twee cases moeten we begrijpen welke bestaande varianten herwerkt moeten worden en welke we mogelijk extra moeten aanmaken (bv. een variant met grotere illustratie/vlag, of een minimaal "yes/no"-pattern dat eigenlijk een checkbox is).

- [ ] Bekijk de bestaande choice card-varianten met deze twee cases in de hand en optimaliseer voor verschillende inhouden.
- [ ] Pas optimalisatie toe op Land/regio — vlag of layout anders gebruiken om de keuzes visueel beter te onderscheiden (de huidige vlag rechtsboven is te subtiel en de twee niet-vlag opties wijken visueel af).
- [ ] Vervang choice cards door een lichtere oplossing (checkbox) wanneer de keuze in essentie "ik wil extra info opgeven" of "ik ben dit / ik ben dit niet" is.
- [ ] Concreet: vervang "Bent u de wettelijke vertegenwoordiger?" op Registratie door een checkbox die de extra velden toont/verbergt.

### Toggle/switch accordion → checkbox

_Feedback origineel gezien op:_ **Facturatie** (drie toggles: "Afwijkende facturatiedrukker per certificaat-aanvraag", "Afwijkend facturatieadres", "Andere contactpersoon voor facturatie") en **Extra contacten** (twee toggles voor primaire en reserve cert/inspectie-contact). De toggles staan steeds vóór een verborgen sectie en suggereren een aan/uit-systeeminstelling, terwijl het feitelijk een "ik wil extra info opgeven"-keuze is.

- [ ] Vervang switches die een sectie open/dicht klappen door een checkbox (of inline action) die bij aanvinken de extra invoervelden toont.
- [ ] Toepassen op Facturatie — drie toggles hierboven vermeld.
- [ ] Toepassen binnen het samengevoegde cert/inspectie-contactblok op Facturatie (zie [3.9](#39-traject--facturatie-inclusief-extra-contacten)).

### Multi-instance entry pattern

_Feedback origineel gezien op:_ **Maatschappelijke zetel** (nu één zetel mogelijk, terwijl een gebruiker meerdere zetels in één traject moet kunnen ingeven) en **Extra contacten** (de tweede/reserve contactpersoon zit nu achter een aparte switch-sectie, maar zou inline vanuit de eerste contactpersoon moeten kunnen worden toegevoegd).

- [ ] Definieer één pattern voor het toevoegen van meerdere instanties binnen één stap (bv. lijst van kaarten + "+ Item toevoegen"-actie).
- [ ] Toepassen op Maatschappelijke zetel — meerdere zetels in dezelfde stap.
- [ ] Toepassen op tweede (reserve) contactpersoon — inline toevoegbaar vanuit het primaire contactblok op Facturatie.


### Copy density

_Feedback origineel gezien op:_ **Maatschappelijke zetel** (waar tekst ~50% van het scherm besloeg — twee callouts, herhaalde helper text onder elk veld). Vanuit die pagina werd duidelijk dat het een patroon is dat over de hele flow speelt — vandaar de bredere pass.

- [ ] Verdere copy-density pas (info-icons + tooltips voor "nice to know"-content) uitgesteld tot de keuze-card en multi-instance pattern afgerond zijn.
- [ ] Certificatie (entiteit) — vervalt zodra de stap verwijderd is (zie 3.8).

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

### 3.6 Traject — stap "Registratie"

_Route:_ [`/welcome/formal-request/customer`](http://localhost:5173/welcome/formal-request/customer)

- [ ] Vervang "Bent u de wettelijke vertegenwoordiger?" door checkbox (zie [Choice card componenten](#choice-card-componenten)).
- [ ] Ruim dubbele/driedubbele titels rond "Wettelijke vertegenwoordiger" op. Behoud één duidelijke sectiekop en geef subvragen/veldgroepen een lichter (of geen) extra label.

### 3.7 Traject — stap "Maatschappelijke zetel"

_Route:_ [`/welcome/formal-request/company`](http://localhost:5173/welcome/formal-request/company)

- [ ] Maak meerdere zetels mogelijk in dezelfde stap (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Bouw de koppeling product → zetel hier in (zodat stap "Certificatie (entiteit)" kan verdwijnen, zie 3.8).
- [ ] Voer copy-density pass uit (zie [Copy density](#copy-density)).

### 3.8 Traject — stap "Certificatie (entiteit)" verwijderen

_Route (huidige stap, te verwijderen):_ [`/welcome/formal-request/companyLegalEntities`](http://localhost:5173/welcome/formal-request/companyLegalEntities)

_Tussenstand:_ stap staat voorlopig altijd in de registratie-reeks (drafts-afhankelijke conditie vervangen) zodat we hem niet uit het oog verliezen tot de definitieve verwijdering rond is. Zie commit `8d0107e`.

- [ ] Verwijder de stap volledig uit het traject.
- [ ] Verplaats de koppeling product → zetel naar stap "Maatschappelijke zetel" (zie 3.7).
- [ ] Update stepper-volgorde en navigatie zodat deze stap niet meer verschijnt.
- [ ] Bij verplaatsing naar 3.7: hergebruik géén raw `<h3>`/`<h4>` uit [OnboardingCompanyLegalEntitiesStep.tsx:85,148,243](packages/ui-certification/src/components/onboarding/company-step/OnboardingCompanyLegalEntitiesStep.tsx#L85) of uit [OnboardingVestigingenLegalEntityManager.tsx:181](packages/ui-certification/src/components/onboarding/legal-entity-step/OnboardingVestigingenLegalEntityManager.tsx#L181). Gebruik het `<H4>`/`<H3>` heading-register.

### 3.9 Traject — stap "Facturatie" (inclusief Extra contacten)

_Route:_ [`/welcome/formal-request/invoicing`](http://localhost:5173/welcome/formal-request/invoicing)
_Route (huidige stap "Extra contacten", samen te voegen):_ [`/welcome/formal-request/extras`](http://localhost:5173/welcome/formal-request/extras)

De voormalige stap "Extra contacten" wordt samengevoegd met "Facturatie".

- [ ] Vervang switch-accordions door checkbox (zie [Toggle/switch accordion → checkbox](#toggleswitch-accordion--checkbox)).
- [ ] Verwijder blokken "Certificatie-aanvragen in dit dossier" + "Factuur rechts-persoon per aanvraag" volledig (niet verplaatsen naar Nazicht).
- [ ] Voeg cert/inspectie-contact inline toe op deze stap (overgenomen van de voormalige stap "Extra contacten").
- [ ] Maak de tweede (reserve) contactpersoon inline toevoegbaar vanuit het primaire contactblok (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Update stepper: "Extra contacten" verdwijnt als aparte stap.
- [ ] Raw `<h3>` op de over te nemen blokken in [OnboardingExtrasStep.tsx:21](packages/ui-certification/src/components/onboarding/extras-step/OnboardingExtrasStep.tsx#L21) nog converteren na samenvoeging met Facturatie-stap.

### 3.10 Traject — stap "Nazicht"

_Route:_ [`/welcome/formal-request/summary`](http://localhost:5173/welcome/formal-request/summary)

- [ ] Kort de samenvatting sterk in, vervang zware kaarten door compacte tabellen zodat de hele pagina in één oogopslag scanbaar is.
- [ ] Verwijder knop "Aanvragen wijzigen". De gebruiker navigeert terug via "Terug" en via de klikbare stepper.

### 3.11 Klantenportaal login pagina

_Route:_ [`/login`](http://localhost:5173/login)

- [ ] Bouw afbeelding-rotatie / pool van meerdere visuals op de klantenportaal login pagina (huidige situatie: altijd dezelfde witte bouwvakker).
- [ ] Stel de pool divers samen — o.a. vrouwen, mensen met andere huidskleur of achtergrond — passend bij de Procertus-context (bouw, productie, certificering).
