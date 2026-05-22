# Design feedback — todo

Checklist op basis van de design review en daaropvolgende audits.

Bovenaan staat **[Afgewerkt](#afgewerkt)**: alle items die al opgelost zijn. Daaronder de openstaande secties:

1. [**Cross-cutting patronen / componenten**](#1-cross-cutting-patronen--componenten): herbruikbare componenten en token-beslissingen die op meerdere plekken landen.
2. [**Flow- en gedrags-architectuur**](#2-flow--en-gedrags-architectuur): bredere beslissingen over winkelmandje, drafts en navigatie.
3. [**Page-specifieke wijzigingen**](#3-page-specifieke-wijzigingen): per scherm (3.1 t/m 3.12), met cross-refs naar cross-cutting items.
4. [**Copy en taalregister**](#4-copy-en-taalregister): afgewerkt (4.11 en 4.13 doorgevoerd).
5. [**Distill audit (2026-05-21)**](#5-distill-audit-2026-05-21): openstaande app-level en primitives-findings.

**Onderdelen in sectie 1, in alfabetische scan-volgorde:**
[Cart-status visibility](#cart-status-visibility) · [Choice card componenten](#choice-card-componenten) · [Combobox met create-new](#combobox-met-create-new) · [Copy density](#copy-density) · [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten) · [Multi-instance entry pattern](#multi-instance-entry-pattern) · [Stepper](#stepper) · [Toggle/switch accordion → checkbox](#toggleswitch-accordion--checkbox).

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
- [x] Copy taalregister 4.13 (OnboardingRegistrationCompletePage): alle copy-items doorgevoerd (je-vorm, titels, statuspillen, digitalFollowBrief, voetnoten, callouts); off-token `text-[1.0625rem]` en `leading-[1.65]` gesnapt naar `text-base`.

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

### Heading-hiërarchie en H1–H4 componenten

_Feedback origineel gezien op:_ de homepage en de detail-cards op `/welcome` gebruiken de [H1–H4 componenten](packages/ui/src/components/ui/heading.tsx) consistent. Daarbuiten is het beeld gemengd: het 7-stappen aanvraag-traject zet wel een `H1` als pagetitel via [OnboardingFlowView](packages/ui-certification/src/onboarding/onboarding-flow-view.tsx#L115), maar binnen de stappen worden sectie-koppen telkens als raw `<h3 className="text-sm font-semibold tracking-tight text-foreground">` geschreven. Op andere pagina's staan raw `<h1>` en `<h2>` met inline classes. De bedoeling is niet dat elk blok een `H1`–`H4` krijgt, maar wel dat de hiërarchie per pagina expliciet en consistent is, en dat herhalende koppen door één component lopen.

**Wat al goed gebeurt (canonische voorbeelden, niet aanpassen):**
- Authenticated pages zetten `<H1>` via `PageHeader.title`: [DashboardPage.tsx:30](apps/frontend-pt1-extranet-onboarding/src/pages/DashboardPage.tsx#L30), [RequestsOverviewPage.tsx:26](apps/frontend-pt1-extranet-onboarding/src/pages/RequestsOverviewPage.tsx#L26), [ProfileChangeRequestsPage.tsx:42](apps/frontend-pt1-extranet-onboarding/src/pages/ProfileChangeRequestsPage.tsx#L42), [UserProfilePage.tsx:313](apps/frontend-pt1-extranet-onboarding/src/pages/UserProfilePage.tsx#L313), [OrganizationProfilePage.tsx:263](apps/frontend-pt1-extranet-onboarding/src/pages/OrganizationProfilePage.tsx#L263), [DesignSystemPage.tsx:11](apps/frontend-pt1-extranet-onboarding/src/pages/DesignSystemPage.tsx#L11).
- Triage gebruikt `<H2>` en `<H3>` voor sectie- en card-titel: [TriagePage.tsx:110,179](apps/frontend-pt1-extranet-onboarding/src/pages/TriagePage.tsx#L110).
- Status- en bevestigingspagina's gaan via `StatusContent` met `<H1>` ([StatusContent.tsx:61](packages/ui-lib/src/status-pages/StatusContent.tsx#L61)) en `PublicOverviewSection` met `<H2>` ([PublicOverviewSection.tsx:15](apps/frontend-pt1-extranet-onboarding/src/components/PublicOverviewSection.tsx#L15)).
- `PanelSection` gebruikt `<H4>` voor zijn titel ([PanelSection.tsx](packages/ui/src/components/panel-section/PanelSection.tsx)), dus alle panels in `apps/frontend-pt1-extranet-onboarding/src/panels/` erven die hiërarchie automatisch.
- `OnboardingFlowView` zet één `<H1>` per stap als page-titel ([onboarding-flow-view.tsx:115](packages/ui-certification/src/onboarding/onboarding-flow-view.tsx#L115)). Het probleem zit niet in de step-titel, wel in de subsecties eronder.

- [x] **Beslissing genomen (Optie A):** wizard form-sectie koppen via `<H4 className="normal-case tracking-tight text-foreground">`, Nazicht-sectie koppen via `<H3>`.
- [x] **Audit en converteer top-level page-titels die nu raw zijn.**
  - [x] [RequestDetailPage.tsx](apps/frontend-pt1-extranet-onboarding/src/pages/RequestDetailPage.tsx) "Levenscyclus" geconverteerd naar `<H3>`.
  - [ ] [BrandGradientHero.tsx:16](apps/frontend-pt1-extranet-onboarding/src/components/BrandGradientHero.tsx#L16) gebruikt raw `<h2>`. Component staat sowieso al op de verwijderlijst in [5.1 BrandGradientHero](#brandgradienthero-is-demo-restant-met-engelse-copy), dus opvolgen via dat item (niet apart converteren).
- [x] **Dashboard widgets inconsistente sub-koppen opgelost.** LatestInvoicesWidget en RecentNotificationsWidget: raw `<h4>` verwijderd, vervangen door `<p>` (visueel label, geen heading semantiek onder `CardTitle`); `text-[11px]` gesnapt naar `text-xs`.
- [x] **Raw `<h3>` cluster in de wizard geconverteerd.** Alle form-sectie koppen in OnboardingCustomerStep, OnboardingCompanyZetelStep, OnboardingInvoicingStep, OnboardingInnovationAttestStep en OnboardingMetrologyStep lopen nu via `<H4 className="normal-case tracking-tight text-foreground">`. Nazicht-sectie koppen via `<H3>`.
- [ ] **Verifieer de a11y-volgorde na de pass.** Het doel is per pagina één `h1`, en daaronder een logische `h2 → h3` reeks zonder gaten. Niet elk blok hoeft een heading te zijn (knoppenrijen, helper-tekstblokken, choice-cards met legend zijn al geen koppen). Wel: als een sectie visueel als kop wordt gepresenteerd, hoort hij ook een heading-tag te krijgen.

### Multi-instance entry pattern

_Feedback origineel gezien op:_ **Maatschappelijke zetel** (nu één zetel mogelijk, terwijl een gebruiker meerdere zetels in één traject moet kunnen ingeven) en **Extra contacten** (de tweede/reserve contactpersoon zit nu achter een aparte switch-sectie, maar zou inline vanuit de eerste contactpersoon moeten kunnen worden toegevoegd).

- [ ] Definieer één pattern voor het toevoegen van meerdere instanties binnen één stap (bv. lijst van kaarten + "+ Item toevoegen"-actie).
- [ ] Toepassen op Maatschappelijke zetel — meerdere zetels in dezelfde stap.
- [ ] Toepassen op tweede (reserve) contactpersoon — inline toevoegbaar vanuit het primaire contactblok op Facturatie.

### Combobox met create-new

_Feedback origineel gezien op:_ **Registratie** ("Role"-veld is een gewone select met een "Anders"-optie die een extra input field opent). Dat pattern komt vermoedelijk vaker terug — vandaar de audit-actie hieronder.

- [ ] Vervang het pattern "select + Anders + extra losstaand input field" door een combobox (searchable select) met een actie om de getypte waarde toe te voegen (bv. "+ Voeg rol toe: <getypte tekst>").
- [ ] Toepassen op Registratie — "Role"-veld.
- [ ] Audit alle invulvelden in het traject en kies het juiste veldtype per geval (select / combobox / autocomplete / vrije tekst).

### Copy density

_Feedback origineel gezien op:_ **Maatschappelijke zetel** (waar tekst ~50% van het scherm besloeg — twee callouts, herhaalde helper text onder elk veld). Vanuit die pagina werd duidelijk dat het een patroon is dat over de hele flow speelt — vandaar de bredere pass.

- [x] Copy-density pass uitgevoerd op Maatschappelijke zetel (zetel-sectie beschrijving ingekort) en Facturatie (3 sectie-omschrijvingen ingekort).
- [ ] Verdere copy-density pas (info-icons + tooltips voor "nice to know"-content) uitgesteld tot de keuze-card en multi-instance pattern afgerond zijn.
- [ ] Certificatie (entiteit) — vervalt zodra de stap verwijderd is (zie 3.8).

### Desktop-breedte van page-level componenten

_Feedback origineel gezien op:_ verschillende organisms zijn mobile-first opgesteld met een vaste `max-w-*` en groeien niet mee op `lg` en `xl`. Op een breed scherm zit een kleine kolom met veel witruimte ernaast. Container-query-aware componenten (CoverView, ProductInquiryMatrix, ProductSelectionBasket, Snackbar) zijn correct responsive en hoeven niet aangepast.

- [x] Audit overige page-level organisms: geen resterende `max-w-2xl`/`max-w-3xl` zonder `lg:`/`xl:` upgrade gevonden in ui-lib en ui-certification.

### Typografie-token: `leading-[1.6]` op body-copy

_Feedback origineel gezien op:_ off-token-check hook flagde `leading-[1.6]` bij een edit op RequestPackageReview. Het patroon bestaat nog 7 keer in ui-certification (review-/summary-/onboarding body copy) en is ook gelogd in [packages/ui/src/off-token-log.md](packages/ui/src/off-token-log.md) voor StepLayout en stepper. De RequestPackageReview-site is intussen weggesnapt naar de standaard body line-height (zie [Afgewerkt](#afgewerkt)).

- [x] Beslissing: gesnapt naar standaard (`--text-base--line-height`). Alle `leading-[1.6]` in ui-certification en onboarding-flow-view verwijderd. StepLayout-exception in off-token-log.md blijft geldig (gedocumenteerde component-level keuze).

### Cart-status visibility

_Feedback origineel gezien op:_ **Homepage** ("Start uw certificeringstraject") — een blauwe "AL IN UW PAKKET · 2 PRODUCTEN" pill bovenop de BENOR-kaart, en een count-badge "2" op de filtertab "BENOR-certificatie". Beide indicatoren herhalen info die al duidelijk is uit het winkelmandje en de header-cart-indicator.

- [ ] Cart-status alleen tonen in het winkelmandje en de cart-indicator in de header — niet dupliceren elders.
- [ ] Verwijder "AL IN UW PAKKET · X PRODUCTEN" indicator van homepage certificaatkaarten.
- [ ] Verwijder count-badges van homepage filtertabs.

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

### 3.1 Header / top navigation

_Route:_ zichtbaar op alle publieke pagina's onder `/welcome/*`.

- [ ] Optimaliseer spacing tussen header-knoppen (theme toggle, draft/inbox icon, login, taalkiezer) — consistent ritme, betere groepering tussen icon buttons en de primaire login knop.

### 3.2 Homepage ("Start uw certificeringstraject")

_Route:_ [`/welcome`](http://localhost:5173/welcome)

- [ ] Verwijder cart-status van kaarten en filtertabs (zie [Cart-status visibility](#cart-status-visibility)).

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
- [ ] Vervang "Role"-veld door combobox met create-new (zie [Combobox met create-new](#combobox-met-create-new)).
- [x] Vier raw `<h3>` sectie-koppen geconverteerd naar `<H4 className="normal-case tracking-tight text-foreground">`: [OnboardingCustomerStep.tsx](packages/ui-certification/src/components/onboarding/customer-step/OnboardingCustomerStep.tsx) ("Organisatie-identificatie", "Wettelijke vertegenwoordiger", "Uw gegevens als indiener", "Gegevens wettelijke vertegenwoordiger").

### 3.7 Traject — stap "Maatschappelijke zetel"

_Route:_ [`/welcome/formal-request/company`](http://localhost:5173/welcome/formal-request/company)

- [ ] Maak meerdere zetels mogelijk in dezelfde stap (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Bouw de koppeling product → zetel hier in (zodat stap "Certificatie (entiteit)" kan verdwijnen, zie 3.8).
- [ ] Voer copy-density pass uit (zie [Copy density](#copy-density)).
- [x] Raw `<h3>` sectie-kop "Maatschappelijke zetel" geconverteerd naar `<H4 className="normal-case tracking-tight text-foreground">` in [OnboardingCompanyZetelStep.tsx](packages/ui-certification/src/components/onboarding/company-step/OnboardingCompanyZetelStep.tsx). Bij multi-instance refactor opnieuw evalueren of de kop nodig blijft.

### 3.8 Traject — stap "Certificatie (entiteit)" verwijderen

_Route (huidige stap, te verwijderen):_ [`/welcome/formal-request/companyLegalEntities`](http://localhost:5173/welcome/formal-request/companyLegalEntities)

- [ ] Verwijder de stap volledig uit het traject.
- [ ] Verplaats de koppeling product → zetel naar stap "Maatschappelijke zetel" (zie 3.7).
- [ ] Update stepper-volgorde en navigatie zodat deze stap niet meer verschijnt.
- [ ] Bij verplaatsing naar 3.7: hergebruik géén raw `<h3>`/`<h4>` uit [OnboardingCompanyLegalEntitiesStep.tsx:85,148,243](packages/ui-certification/src/components/onboarding/company-step/OnboardingCompanyLegalEntitiesStep.tsx#L85) of uit [OnboardingVestigingenLegalEntityManager.tsx:181](packages/ui-certification/src/components/onboarding/legal-entity-step/OnboardingVestigingenLegalEntityManager.tsx#L181). De koppeling moet meereizen onder het register uit [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten).

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
- [x] Vijf raw `<h3>`/`<h4>` sectie-koppen in [OnboardingInvoicingStep.tsx](packages/ui-certification/src/components/onboarding/invoicing-step/OnboardingInvoicingStep.tsx) geconverteerd naar `<H4 className="normal-case tracking-tight text-foreground">`.
- [ ] Raw `<h3>` op de over te nemen blokken in [OnboardingExtrasStep.tsx:21](packages/ui-certification/src/components/onboarding/extras-step/OnboardingExtrasStep.tsx#L21) nog converteren na samenvoeging met Facturatie-stap.

### 3.10 Traject — stap "Nazicht"

_Route:_ [`/welcome/formal-request/summary`](http://localhost:5173/welcome/formal-request/summary)

- [ ] Kort de samenvatting sterk in, vervang zware kaarten door compacte tabellen zodat de hele pagina in één oogopslag scanbaar is.
- [ ] Verwijder knop "Aanvragen wijzigen". De gebruiker navigeert terug via "Terug" en via de klikbare [Stepper](#stepper).
- [x] Vier raw `<h3>` sectie-koppen geconverteerd naar `<H3>` in [OnboardingSummaryStep.tsx](packages/ui-certification/src/components/onboarding/summary-step/OnboardingSummaryStep.tsx): aanvrager, geregistreerde juridische entiteiten, geregistreerde personen, begeleidende toelichting.

### 3.11 Klantenportaal login pagina

_Route:_ [`/login`](http://localhost:5173/login)

- [ ] Bouw afbeelding-rotatie / pool van meerdere visuals op de klantenportaal login pagina (huidige situatie: altijd dezelfde witte bouwvakker).
- [ ] Stel de pool divers samen — o.a. vrouwen, mensen met andere huidskleur of achtergrond — passend bij de Procertus-context (bouw, productie, certificering).

### 3.12 Bevestigingspagina na indiening ("Uw account is klaar")

_Route:_ [`/registratie-voltooid`](http://localhost:5173/registratie-voltooid)

Doel van deze pagina is enkel (1) bevestigen dat de indiening gelukt is, en (2) de gebruiker aansporen om in te loggen in het portaal.

- [ ] Verwijder kaart "Uw ingediende aanvragen — wat volgt eerst digitaal" (redundant met Nazicht).
- [ ] Kort kaart "Onboarding van gebruikers naar het Klantenportaal" in tot één regel, bv. "De vermelde personen ontvangen een uitnodiging voor het portaal en kunnen daarna inloggen en de status van de aanvragen opvolgen."
- [ ] Verwijder kaart "Volgende digitale onboarding — direct na deze melding" (deze instructies horen ín het portaal als first-run hints na login).
- [ ] Verwijder of integreer voettekst "Stappen rechts-onder in uw mailbox nu" als één korte zin.
- [ ] Consolideer alle behouden info in één bevestigingskaart met succesmelding, dossiernummer/contact-e-mail en de korte onboarding-zin.
- [ ] Toon twee gewogen CTA's: "Ga naar Klantenportaal" (primary) en "Open mijn mailbox" (secondary).

---

## 4. Copy en taalregister

_Origineel gezien tijdens een copy-clarity pass over de publieke pagina's van [`apps/frontend-pt1-extranet-onboarding`](../apps/frontend-pt1-extranet-onboarding/). De wijzigingen zijn gerevert; deze sectie houdt de afspraken vast zodat ze in één gerichte ronde uitgevoerd kunnen worden. De voorgestelde teksten zijn concreet bedoeld als startpunt, niet als verplichte eindtekst._

> **Registerbeslissing (2026-05-21):** we draaien de oorspronkelijke "u"-keuze om en hanteren overal **"je/jouw"**. Reden: persoonlijker, vriendelijker, service-driven, terwijl de toon professioneel en betrouwbaar blijft.

### 4.11 Onboarding-entry placeholder [`OnboardingEntryPlaceholderPage`](../apps/frontend-pt1-extranet-onboarding/src/pages/OnboardingEntryPlaceholderPage.tsx)

_Route:_ `/welcome/onboarding` (placeholder)

- [x] Volledige pagina al in het Nederlands: `PANEL.title`, `PANEL.subtitle`, `AuthLayout` title en description, `EmptyTitle`, `EmptyDescription`, knop-label "Terug naar aanmelden" — reeds aanwezig.

### 4.13 Bevestigingspagina na indiening [`OnboardingRegistrationCompletePage`](../apps/frontend-pt1-extranet-onboarding/src/pages/OnboardingRegistrationCompletePage.tsx)

_Route:_ [`/registratie-voltooid`](http://localhost:5173/registratie-voltooid) (cf. [3.12](#312-bevestigingspagina-na-indiening-uw-account-is-klaar) voor de structurele wijzigingen. Onderstaande copy-actie blijft zinvol zolang de pagina in haar huidige vorm staat.)

- [x] Alle copy-items doorgevoerd: je-vorm, sectie-titels, statuspillen ("Uitnodiging verzonden" / "Geen uitnodiging"), voetkop, cache-miss fallback, tabel-voetnoot, digitalFollowBrief() in complete zinnen.
- [x] Off-token `text-[1.0625rem]` en `leading-[1.65]` in lead-paragraaf gesnapt naar `text-base`.

---

## 5. Distill audit (2026-05-21)

_Audit gedaan met de `/distill` skill om visuele en structurele overcomplexiteit op te sporen in de app en in de gelinkte primitives. Items die elders in dit document al worden aangepakt (kaart-verwijderingen op de bevestigingspagina, copy-density passes, choice-card vs checkbox, enz.) zijn hier overgeslagen. Als een audit-finding doorwerkt op een page- of copy-item, staat dat als kruisverwijzing onder de bevinding zodat geen van beide kanten uit zicht raakt._

### 5.1 App-level

#### Expert-call kaart staat dubbel op Triage en Wegwijzer

_Feedback origineel gezien op:_ **Triage** ("Liever eerst een expert spreken?" als derde kaart onder de twee TriageOptionCards) én **Wegwijzer / Alle certificaten** (`ExpertCallFooterCard` als laatste cel in `AllCertificatesGrid`). Beide kaarten hebben dezelfde titel, dezelfde body en dezelfde gradient. Als de gebruiker eerst via de wegwijzer komt en dan een traject opent, ziet hij de identieke CTA twee schermen na elkaar.

- [ ] Beperk de expert-call CTA tot één visuele ankerplek. Voorstel: behoud de inline kaart op [WegwijzerPage.tsx:276](apps/frontend-pt1-extranet-onboarding/src/pages/WegwijzerPage.tsx#L276) als eerste ontdekpunt, en vervang de derde kaart op [TriagePage.tsx:105](apps/frontend-pt1-extranet-onboarding/src/pages/TriagePage.tsx#L105) door een tekstlink of een inline note onder de twee TriageOptionCards.
- [ ] Of, omgekeerd: behoud de prominentie op Triage (dat is het beslismoment) en zet de `ExpertCallFooterCard` op de wegwijzer terug naar een minder dominante variant (item-row in plaats van gradient-card).

> De expert-card copy op Triage is al herwerkt (zie [Afgewerkt](#afgewerkt)). Als de kaart op Triage vervalt, vervalt dat copy-werk achteraf alsnog.

#### Vier gestapelde bordered cards op InfoRequestSubmittedPage beslaan dezelfde temporele fase

_Feedback origineel gezien op:_ **Aanvraag verzonden** [InfoRequestSubmittedPage.tsx:39-199](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx#L39). De pagina toont vier `PublicOverviewSection`-kaarten onder elkaar: "Wat maakte deel uit van uw aanvraag", "Organisatie en context", "Onboarding naar het Klantenportaal", "Uw volgende stappen op het Klantenportaal". Drie ervan beschrijven hetzelfde toekomstige moment (wat er na het verzenden gebeurt), en "Organisatie en context" herhaalt waardes die al in de lead-paragraaf staan.

- [ ] Vouw "Organisatie en context" [InfoRequestSubmittedPage.tsx:77](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx#L77) in de lead-beschrijving in. Kanaal en organisatie zijn al in de heading-paragraaf vermeld; alleen het tijdstip "Ontvangen" mag eventueel als compacte regel onder de lead blijven.
- [ ] Voeg "Onboarding naar het Klantenportaal" [InfoRequestSubmittedPage.tsx:125](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx#L125) en "Uw volgende stappen op het Klantenportaal" [InfoRequestSubmittedPage.tsx:173](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx#L173) samen tot één sectie "Volgende stappen". Behoud de personenlijst, plaats de twee tot drie kerninstructies eronder. De vijf bullets van "Volgende stappen" zijn portal-onboarding en horen daar inhoudelijk thuis, niet op de bevestigingspagina (cf. analoge keuze in [3.12](#312-bevestigingspagina-na-indiening-uw-account-is-klaar) voor de registratie-bevestiging).

> De copy-acties voor deze pagina zijn al doorgevoerd (zie [Afgewerkt](#afgewerkt)). Een deel van die tekst-aanpassingen verhuist of vervalt als de secties samengevoegd of geschrapt worden.

#### Authenticated detail-pages en widget-subkoppen volgen het H-systeem niet

_Feedback origineel gezien op:_ audit naar aanleiding van de cross-cutting [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten). De publieke `/welcome` flow en de meeste page-shells gebruiken `<H1>` netjes via `PageHeader`, maar drie authenticated/demo-routes wijken af en de twee dashboard-widgets gebruiken een eigen uppercase-mini-kop register.

- [x] [RequestDetailPage.tsx](apps/frontend-pt1-extranet-onboarding/src/pages/RequestDetailPage.tsx): page-titel was al `<H1>`; raw `<h2>` "Levenscyclus" geconverteerd naar `<H3>`.
- [x] [CategorizationDemoPage.tsx](apps/frontend-pt1-extranet-onboarding/src/pages/CategorizationDemoPage.tsx): reeds `<H1>`, geen aanpassing nodig.
- [x] [LatestInvoicesWidget.tsx](apps/frontend-pt1-extranet-onboarding/src/pages/dashboard-widgets/LatestInvoicesWidget.tsx) en [RecentNotificationsWidget.tsx](apps/frontend-pt1-extranet-onboarding/src/pages/dashboard-widgets/RecentNotificationsWidget.tsx): raw `<h4>` vervangen door `<p>` (visueel label, geen heading-semantiek onder `CardTitle`); `text-[11px]` gesnapt naar `text-xs`.

#### BrandGradientHero is demo-restant met Engelse copy

_Feedback origineel gezien op:_ [BrandGradientHero.tsx:6-28](apps/frontend-pt1-extranet-onboarding/src/components/BrandGradientHero.tsx#L6). Component met Engelse copy ("Onboarding prototype", "This route composes …") en literale verwijzingen naar `--gradient-primary` en `@procertus-ui/ui-lib`. Wordt nu enkel gebruikt vanuit `DesignSystemPage.tsx` (showcase).

- [ ] Verplaats `BrandGradientHero` naar een Storybook-story of `packages/_certification-domain-certification/playground`, weg uit de app-source. Op die manier blijft de demo-rol expliciet en kan de component niet per ongeluk in een andere route landen.
- [ ] Indien gewenst als geldige Procertus-hero op een toekomstige publieke pagina: herschrijf de copy in Nederlands en haal de codetoken-references uit de tekst.

### 5.2 Primitives en libraries

#### TriageOptionCard zit lokaal in TriagePage, terwijl de shape generiek voelt

_Feedback origineel gezien op:_ [TriagePage.tsx:138-208](apps/frontend-pt1-extranet-onboarding/src/pages/TriagePage.tsx#L138). De lokaal gedefinieerde `TriageOptionCard` heeft een generiek shape (icon-tile + titel + korte beschrijving + check-bullets + tone "primary" of "muted" + CTA met arrow). Dezelfde shape duikt al op in `MasterCard`-subsecties en is een logische kandidaat voor BENOR/ATG-keuzeschermen later.

- [ ] Hef de lokale definitie op en breng een algemene "DecisionCard" (of vergelijkbare naam) in `packages/ui-lib` als generieke twee-tone keuzekaart. Naam mag niet "Triage" bevatten omdat de inhoud niet domeingebonden is (cf. memory "Name by content, not consumer"). Eerste consument: TriagePage; tweede potentiële consument: het beslismoment "formele aanvraag vs informatieve aanvraag" in andere flows.
- [ ] Alternatief, als extractie te zwaar voelt: laat de component lokaal, maar dun hem af. De zes bullets aan de primary-kant kunnen naar drie (de bullet-pass voor Triage is al gebeurd, zie [Afgewerkt](#afgewerkt)), de `shadow-proc-md` + `ring-2 ring-primary/30` voelen samen overdone op een muted-vs-primary paar. Eén van beide volstaat als visueel signaal.

> Raakt aan [Choice card componenten](#choice-card-componenten) in sectie 1: een nieuwe `DecisionCard` is mogelijk de juiste plek om die optimalisatieslag te bundelen.

#### BrowseCard `variant="faded"` wordt in productie één keer gebruikt

_Feedback origineel gezien op:_ `grep -r 'variant="faded"'` toont één gebruik buiten Storybook: [WegwijzerPage.tsx:254](apps/frontend-pt1-extranet-onboarding/src/pages/WegwijzerPage.tsx#L254) op de externe-verwijzing tegels in `AllCertificatesGrid`. Daarnaast bestaat een tweede pad voor exact dezelfde inhoud: `ExternalReferralGrid` [WegwijzerPage.tsx:313-339](apps/frontend-pt1-extranet-onboarding/src/pages/WegwijzerPage.tsx#L313) gebruikt `<Item>` in plaats van een faded BrowseCard.

- [ ] Kies één presentatie voor externe verwijzingen. Voorstel: behoud de `<Item>`-rij (compacter, past in de "Overige" tab) en gebruik die ook in `AllCertificatesGrid`. Dat maakt `variant="faded"` overbodig en zorgt voor één lees-pattern voor "dit dossier loopt elders".
- [ ] Als de faded-variant toch waarde heeft op een andere plek, documenteer dan in `BrowseCard.stories.tsx` voor welk inhoudtype hij bedoeld is. Anders verwijderen uit de `variant`-set.

#### `data-density="spacious"` heeft geen meetbare adoptie

_Feedback origineel gezien op:_ `grep -r 'data-density="spacious"'` levert één gebruik op tegenover tien voor `operational`. De density-laag onderscheidt impliciet "public/onboarding (spacious)" en "portal/dashboard (operational)", maar in praktijk wordt spacious bijna nergens expliciet gezet, terwijl de publieke pagina's wel ruimer ogen door hun layout.

- [ ] Audit waar de publieke pagina's hun ruime ritme vandaan halen. Als dat via padding/gap-tokens komt en niet via de density-wrapper, dan is `data-density="spacious"` dode laag en kan hij uit het primitives-systeem.
- [ ] Indien spacious wel ingezet hoort te zijn op publieke routes: zet hem expliciet op één centraal punt (bv. `PublicLayout` of de `data-public-layout`-root) zodat de density-laag overal hetzelfde gedrag heeft.
