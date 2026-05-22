# Design feedback — todo

Checklist op basis van de design review en daaropvolgende audits.

Bovenaan staat **[Afgewerkt](#afgewerkt)**: alle items die al opgelost zijn. Daaronder de openstaande secties:

1. [**Cross-cutting patronen / componenten**](#1-cross-cutting-patronen--componenten): herbruikbare componenten en token-beslissingen die op meerdere plekken landen.
2. [**Flow- en gedrags-architectuur**](#2-flow--en-gedrags-architectuur): bredere beslissingen over winkelmandje, drafts en navigatie.
3. [**Page-specifieke wijzigingen**](#3-page-specifieke-wijzigingen): per scherm (3.3 t/m 3.11), met cross-refs naar cross-cutting items.
4. [**Copy en taalregister**](#4-copy-en-taalregister): afgewerkt (4.11 en 4.13 doorgevoerd).

De Distill audit (2026-05-21) is volledig afgewerkt; alle findings staan in [Afgewerkt](#afgewerkt).

**Onderdelen in sectie 1, in alfabetische scan-volgorde:**
[Choice card componenten](#choice-card-componenten) · [Copy density](#copy-density) · [Multi-instance entry pattern](#multi-instance-entry-pattern) · [Stepper](#stepper) · [Toggle/switch accordion → checkbox](#toggleswitch-accordion--checkbox) · [Veldtype per invulveld](#veldtype-per-invulveld).

---

## Afgewerkt

- [x] Verified-input pattern gebouwd voor velden met validatie.
- [x] Verified-input toegepast op Registratie.
- [x] Verified-input toegepast op Facturatie.
- [x] Overige validatievelden in het traject geauditeerd.
- [x] Raw h2's op publieke pagina's omgezet naar de H2 component.
- [x] Raw h1's op detail- en demo-pagina's omgezet naar de H1 component.
- [x] Icoon in empty component gefixt voor dark mode.
- [x] Hover state toegevoegd aan input.
- [x] Hover state toegevoegd aan textarea.
- [x] Alert padding op gecureerde spacing-schaal gezet.
- [x] Publieke pagina's omgezet naar je-vorm.
- [x] Em dashes uit user-facing copy verwijderd.
- [x] "Gelieve" en passieve constructies opgeschoond.
- [x] Prototype-meta-commentaar uit user-facing copy gehaald.
- [x] Engelse strings in de NL-UI vertaald.
- [x] Vakjargon vervangen door plain Dutch.
- [x] Login-copy herschreven in je-vorm.
- [x] Triage-copy en bullets herschreven.
- [x] Copy op de informatieaanvraag-pagina herschreven.
- [x] Copy op de aanvraag-verzonden-pagina en fallbacks herschreven.
- [x] Banner-copy voor lopende aanvraag gefixt.
- [x] Productkeuze-copy herschreven.
- [x] Per-product certificaten-copy herschreven.
- [x] Wegwijzer-copy herschreven.
- [x] Dashboard-copy herschreven.
- [x] Placeholder-fallback ingekort.
- [x] Check-bullets op TriageOptionCard van text-success naar accent-foreground gezet.
- [x] TrajectStoryFooter callbacks samengevoegd in één mode-prop.
- [x] TrajectStoryFooter label-overrides verwijderd.
- [x] A/B/C-beslissing genomen: Optie A — wizard form-sectie koppen via `<H4 className="normal-case tracking-tight text-foreground">`, nazicht-sectie koppen via `<H3>`.
- [x] Raw `<h3>`/`<h4>` sectie-koppen in wizard geconverteerd: OnboardingCustomerStep (4×), OnboardingCompanyZetelStep (1×), OnboardingInvoicingStep (5×), OnboardingInnovationAttestStep (3×), OnboardingMetrologyStep (3×).
- [x] Raw `<h3>` sectie-koppen in Nazicht geconverteerd naar `<H3>`: OnboardingSummaryStep (4×).
- [x] Raw `<h2>` "Levenscyclus" op RequestDetailPage geconverteerd naar `<H3>`.
- [x] Dashboard widget raw `<h4>` labels geconverteerd naar `<p>` (LatestInvoicesWidget, RecentNotificationsWidget); `text-[11px]` gesnapt naar `text-xs`.
- [x] Desktop-breedte upgrades op AuthLayout, DraftRequestList, RequestPackageReview en de categorization tree-view sheet.
- [x] leading-[1.6] gesnapt in alle resterende sites: OnboardingSummaryStep, onboarding-flow-view, en alle RequestPackageReview-plaatsen.
- [x] Desktop-breedte audit (ui-lib + ui-certification): geen resterende max-w-2xl/max-w-3xl zonder responsive upgrade gevonden.
- [x] Copy density pass: beschrijvingen ingekort op OnboardingCompanyZetelStep (zetel-sectie) en OnboardingInvoicingStep (3 sectie-omschrijvingen).
- [x] Copy taalregister 4.11 (OnboardingEntryPlaceholderPage): volledig in het Nederlands, inclusief knoplabel "Terug naar aanmelden".
- [x] Copy taalregister 4.12 (footerConfig): "Privacy policy" → "Privacybeleid" — reeds gedaan.
- [x] CreatableCombobox primitive gebouwd in packages/ui (searchable select met inline create-new actie, input-like states, X-clear, tooltip-on-truncate).
- [x] Role-veld op Registratie van "select + Anders + losstaand input field"-pattern naar CreatableCombobox.
- [x] Veldtype-audit gedaan over het volledige onboarding-traject (alle stappen, alle invulvelden).
- [x] Aanhef-veld op Registratie en Extra contacten van Select+"Anders" naar CreatableCombobox.
- [x] Land-veld in adressubform (Maatschappelijke zetel + Facturatie incl. afwijkend facturatieadres) van Select naar Combobox (zoekbaar); Combobox-primitive opgewerkt naar w-full default en popover-width-matches-trigger.
- [x] Regio/land-veld op Metrologie-attest van Textarea naar Input (single-line). Multi-select Combobox blijft een follow-up wanneer een dedicated multi-country-picker primitive er is.
- [x] Copy taalregister 4.13 (OnboardingRegistrationCompletePage): alle copy-items doorgevoerd (je-vorm, titels, statuspillen, digitalFollowBrief, voetnoten, callouts); off-token `text-[1.0625rem]` en `leading-[1.65]` gesnapt naar `text-base`.
- [x] Heading a11y-volgorde verificatie (één `h1` per pagina, logische `h2 → h3`-keten): wordt meegenomen in de page-specifieke aanpassingen — apart validatiepunt vervalt.
- [x] Distill 5.1: BrandGradientHero verplaatst naar story `design tokens/Gradient/Hero` en uit app-source verwijderd; off-token `max-w-[1400px]` op `DesignSystemPage` gesnapt naar `max-w-7xl`.
- [x] Distill 5.1: expert-call dedup bewust niet doorgevoerd; de callout staat op Triage en Wegwijzer in identieke vorm voor consistente ankering.
- [x] Distill 5.1: "Organisatie en context" kaart op InfoRequestSubmittedPage opgevouwen in de lead — organisatie + ontvangen-op timestamp nu in de heading-paragraaf, aparte kaart verdwenen. Heading hernoemd naar "Bedankt voor je aanvraag".
- [x] Distill 5.1: "Onboarding naar het Klantenportaal" en "Volgende stappen op het Klantenportaal" samengevoegd tot één sectie "Volg je dossier op" met verwijzing naar My PROCERTUS en compacte tabel (e-mailadres + rol) van uitgenodigde contactpersonen. Logica gebundeld in [`InfoRequestSubmittedPanel`](packages/ui-certification/src/components/info-request-submitted/InfoRequestSubmittedPanel.tsx) (`ui-certification`) en geconsumeerd door [InfoRequestSubmittedPage.tsx](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx). De vijf portal-onboarding bullets verhuizen naar de portal-context.
- [x] Distill 5.2: TriageOptionCard geëxtraheerd naar `DecisionCard` + `DecisionCardCallout` in `packages/ui-lib`; TriagePage en de Wegwijzer-callout consumeren de primitives.
- [x] Distill 5.2: `data-density` regel publiek=spacious / ingelogd=operational doorgevoerd via `PublicAppShell` en de twee top-level publieke confirmation-pagina's; redundante lokale overrides opgeruimd.
- [x] Distill 5.2: BrowseCard `variant="faded"` bewust behouden in de set voor toekomstige opportuniteiten.
- [x] Cart-status alleen nog zichtbaar in het winkelmandje en de header-cart-indicator; pill, count-badge en selected ring op homepage kaarten en filtertabs verwijderd.
- [x] Autocomplete-primitive gebouwd in packages/ui (input-as-trigger, popover opent enkel bij relevante content, async fetch met abort-signal, loading/empty/results states, results-heading, input-like progressive states).
- [x] BTW/KBO-veld op Registratie naar Autocomplete voor `origin = be`: kboAutocomplete-adapter met mock-dataset bouwt het Belgische scenario; selectie autovult bedrijfsnaam, zeteladres en land/landcode. Voor andere origins blijft de Input met structurele validatie het gedrag.
- [x] Header-spacing geoptimaliseerd: consistent ritme en betere groepering tussen icon buttons en de primaire login knop.
- [x] 3.12 OnboardingRegistrationCompletePage geconsolideerd: drie afzonderlijke `PublicOverviewSection`-kaarten ("Je ingediende aanvragen en wat eerst volgt", "Je teamleden in het Klantenportaal", "Volgende stappen, meteen na deze melding") plus de mailbox-voettekst en `Reset sessie-gegevens`-knop verwijderd. Pagina hergebruikt nu `InfoRequestSubmittedPanel` met registratie-specifieke copy en een primary/secondary CTA-paar ("Ga naar Klantenportaal" + "Open mijn mailbox"). Panel uitgebreid met override-props (`heading`, `description`, `sectionTitle`, `sectionDescription`, `actions`) zodat één compositie zowel de informatieaanvraag- als registratie-bevestiging dekt.

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

### Stepper

_Feedback origineel gezien op:_ **Land of regio** (eerste keer dat layout opviel — stepper staat rechts, content links), **Registratie** (sticky stepper-sidebar valt op bij een lang scrollend formulier), en **Nazicht** (gevoel dat je vanuit een samenvattingsstap snel naar elke eerdere stap moet kunnen springen — vandaar klikbaarheid, en de subtitle die altijd dynamische waarden toonde i.p.v. duidelijke stap-context).

- [ ] Layout omdraaien: stappen aan de linkerkant, content aan de rechterkant — op alle stappen van het traject.
- [ ] Niet sticky op lange formulieren (eerst gezien op Registratie).
- [ ] Reeds bezochte stappen klikbaar maken voor directe navigatie.
- [ ] Vervang dynamische subtitle (samenvatting van ingevoerde waarden, bv. "Camille Bernard" / "PackLine Industry SARL" / "facturatie@…") door statische guidance copy die beschrijft wat in die stap gebeurt.

### Multi-instance entry pattern

_Feedback origineel gezien op:_ **Maatschappelijke zetel** (nu één zetel mogelijk, terwijl een gebruiker meerdere zetels in één traject moet kunnen ingeven) en **Extra contacten** (de tweede/reserve contactpersoon zit nu achter een aparte switch-sectie, maar zou inline vanuit de eerste contactpersoon moeten kunnen worden toegevoegd).

- [ ] Definieer één pattern voor het toevoegen van meerdere instanties binnen één stap (bv. lijst van kaarten + "+ Item toevoegen"-actie).
- [ ] Toepassen op Maatschappelijke zetel — meerdere zetels in dezelfde stap.
- [ ] Toepassen op tweede (reserve) contactpersoon — inline toevoegbaar vanuit het primaire contactblok op Facturatie.

### Veldtype per invulveld

_Pattern uitgewerkt als [CreatableCombobox](packages/ui/src/components/ui/creatable-combobox.tsx) primitive en toegepast op het Registratie role-veld (zie [Afgewerkt](#afgewerkt))._

_Veldtype-audit (2026-05-22) over alle stappen van het onboarding-traject is afgerond (zie [Afgewerkt](#afgewerkt)). De concrete wijzigingen die eruit volgen staan hieronder; ze worden in de page-specifieke secties niet apart herhaald._

**Snelle wins (bestaande primitives, alleen swap): allemaal afgewerkt (zie [Afgewerkt](#afgewerkt)).**

**Vereisen nieuwe primitive of externe integratie:**

- [ ] Organisatie-ID op Registratie voor `origin = nl`: bouw een `kvkAutocomplete`-adapter (analoog aan [`kboAutocomplete`](packages/ui-certification/src/onboarding/lib/kbo-autocomplete.ts)) en breidt de conditionele swap in [OnboardingCustomerStep.tsx](packages/ui-certification/src/components/onboarding/customer-step/OnboardingCustomerStep.tsx) uit naar Nederland. KvK is publiek doorzoekbaar; integratie is parallel.
- [ ] Organisatie-ID op Registratie voor andere origins (FR, DE, overig EU): registers zijn ofwel niet publiek doorzoekbaar ofwel pay-walled. Voorlopig blijft de plain `Input` met structurele validatie het juiste pattern. Heroverwegen als Procertus een commerciële register-API integreert.
- [ ] Stad in adresvelden (Maatschappelijke zetel, facturatieadres, bouwheeradres, projectadres): kan profiteren van een `Autocomplete` met gemeentelijst per land. Lagere prioriteit dan de origin-uitbreidingen hierboven.
- [ ] Bouwheer- en projectadres op Innovatie-attest: nu losse `Input`-velden, kandidaat voor een geïntegreerd adres-autocomplete (postale lookup).

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
- [ ] Heroverweeg het "Annuleren"-label (bv. "Bewaren en sluiten") zodat het matcht met het feitelijke gedrag.

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

### 3.3 Onboarding stap "Voeg per product certificaten toe"

_Route:_ `/welcome/aanvraag/:serviceId/pakket` (open eerst een service vanuit `/welcome`)

- [ ] Verwijder knop "Nog certificatie toevoegen".
- [ ] Verwijder callout "Deze certificatietypes staan niet in de kolommen …".
- [ ] Voeg tooltips toe in elke kolomheader met de beschrijving van dat certificaat.
- [ ] Toon niet-beschikbare certificaten als disabled checkbox in de matrix, met hover-tooltip die uitlegt waarom ze niet beschikbaar zijn voor dat product.

### 3.4 Onboarding stap "Controleer je aanvraagpakket"

_Route:_ `/welcome/aanvraag/:serviceId/controleren`

- [ ] Verplaats "Nog certificatie toevoegen" naar onderaan / in de footer (zie [Footer-actiebar](#footer-actiebar)).
- [ ] Implementeer bevestig-gedrag naar mandje + popup (zie [Draft- en cart-gedrag](#draft--en-cart-gedrag)).

### 3.5 Traject — stap "Land of regio"

_Route:_ [`/welcome/formal-request/origin`](http://localhost:5173/welcome/formal-request/origin)

- [ ] Pas [Stepper](#stepper) toe.
- [ ] Optimaliseer choice cards (zie [Choice card componenten](#choice-card-componenten)).

### 3.6 Traject — stap "Registratie"

_Route:_ [`/welcome/formal-request/customer`](http://localhost:5173/welcome/formal-request/customer)

- [ ] Pas [Stepper](#stepper) toe (inclusief niet-sticky).
- [ ] Pas het verified input field pattern toe (zie [Afgewerkt](#afgewerkt)).
- [ ] Vervang "Bent u de wettelijke vertegenwoordiger?" door checkbox (zie [Choice card componenten](#choice-card-componenten)).
- [ ] Ruim dubbele/driedubbele titels rond "Wettelijke vertegenwoordiger" op. Behoud één duidelijke sectiekop en geef subvragen/veldgroepen een lichter (of geen) extra label.

### 3.7 Traject — stap "Maatschappelijke zetel"

_Route:_ [`/welcome/formal-request/company`](http://localhost:5173/welcome/formal-request/company)

- [ ] Maak meerdere zetels mogelijk in dezelfde stap (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Bouw de koppeling product → zetel hier in (zodat stap "Certificatie (entiteit)" kan verdwijnen, zie 3.8).
- [ ] Voer copy-density pass uit (zie [Copy density](#copy-density)).

### 3.8 Traject — stap "Certificatie (entiteit)" verwijderen

_Route (huidige stap, te verwijderen):_ [`/welcome/formal-request/companyLegalEntities`](http://localhost:5173/welcome/formal-request/companyLegalEntities)

- [ ] Verwijder de stap volledig uit het traject.
- [ ] Verplaats de koppeling product → zetel naar stap "Maatschappelijke zetel" (zie 3.7).
- [ ] Update stepper-volgorde en navigatie zodat deze stap niet meer verschijnt.
- [ ] Bij verplaatsing naar 3.7: hergebruik géén raw `<h3>`/`<h4>` uit [OnboardingCompanyLegalEntitiesStep.tsx:85,148,243](packages/ui-certification/src/components/onboarding/company-step/OnboardingCompanyLegalEntitiesStep.tsx#L85) of uit [OnboardingVestigingenLegalEntityManager.tsx:181](packages/ui-certification/src/components/onboarding/legal-entity-step/OnboardingVestigingenLegalEntityManager.tsx#L181). Gebruik het `<H4>`/`<H3>` heading-register (zie [Afgewerkt](#afgewerkt)).

### 3.9 Traject — stap "Facturatie" (inclusief Extra contacten)

_Route:_ [`/welcome/formal-request/invoicing`](http://localhost:5173/welcome/formal-request/invoicing)
_Route (huidige stap "Extra contacten", samen te voegen):_ [`/welcome/formal-request/extras`](http://localhost:5173/welcome/formal-request/extras)

De voormalige stap "Extra contacten" wordt samengevoegd met "Facturatie".

- [ ] Pas het verified input field pattern toe (zie [Afgewerkt](#afgewerkt)).
- [ ] Vervang switch-accordions door checkbox (zie [Toggle/switch accordion → checkbox](#toggleswitch-accordion--checkbox)).
- [ ] Verwijder blokken "Certificatie-aanvragen in dit dossier" + "Factuur rechts-persoon per aanvraag" volledig (niet verplaatsen naar Nazicht).
- [ ] Voeg cert/inspectie-contact inline toe op deze stap (overgenomen van de voormalige stap "Extra contacten").
- [ ] Maak de tweede (reserve) contactpersoon inline toevoegbaar vanuit het primaire contactblok (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Update stepper: "Extra contacten" verdwijnt als aparte stap.
- [ ] Raw `<h3>` op de over te nemen blokken in [OnboardingExtrasStep.tsx:21](packages/ui-certification/src/components/onboarding/extras-step/OnboardingExtrasStep.tsx#L21) nog converteren na samenvoeging met Facturatie-stap.

### 3.10 Traject — stap "Nazicht"

_Route:_ [`/welcome/formal-request/summary`](http://localhost:5173/welcome/formal-request/summary)

- [ ] Kort de samenvatting sterk in, vervang zware kaarten door compacte tabellen zodat de hele pagina in één oogopslag scanbaar is.
- [ ] Verwijder knop "Aanvragen wijzigen". De gebruiker navigeert terug via "Terug" en via de klikbare [Stepper](#stepper).

### 3.11 Klantenportaal login pagina

_Route:_ [`/login`](http://localhost:5173/login)

- [ ] Bouw afbeelding-rotatie / pool van meerdere visuals op de klantenportaal login pagina (huidige situatie: altijd dezelfde witte bouwvakker).
- [ ] Stel de pool divers samen — o.a. vrouwen, mensen met andere huidskleur of achtergrond — passend bij de Procertus-context (bouw, productie, certificering).

