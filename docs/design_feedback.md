# Design feedback — todo

Checklist op basis van de design review en daaropvolgende audits. Onderverdeeld in:

1. [**Cross-cutting patronen / componenten**](#1-cross-cutting-patronen--componenten): herbruikbare componenten en token-beslissingen die op meerdere plekken landen.
2. [**Flow- en gedrags-architectuur**](#2-flow--en-gedrags-architectuur): bredere beslissingen over winkelmandje, drafts en navigatie.
3. [**Page-specifieke wijzigingen**](#3-page-specifieke-wijzigingen): per scherm (3.1 t/m 3.12), met cross-refs naar cross-cutting items.
4. [**Copy en taalregister**](#4-copy-en-taalregister): cross-cutting copy-regels en per-pagina micro-copy (4.1 t/m 4.13).
5. [**Distill audit (2026-05-21)**](#5-distill-audit-2026-05-21): app-level en primitives-findings uit de meest recente audit-ronde.

**Onderdelen in sectie 1, in alfabetische scan-volgorde:**
[Cart-status visibility](#cart-status-visibility) · [Choice card componenten](#choice-card-componenten) · [Combobox met create-new](#combobox-met-create-new) · [Copy density](#copy-density) · [Desktop-breedte van page-level componenten](#desktop-breedte-van-page-level-componenten) · [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten) · [Multi-instance entry pattern](#multi-instance-entry-pattern) · [Primitives polish — states en token-hygiëne](#primitives-polish--states-en-token-hygiëne) · [Stepper](#stepper) · [Toggle/switch accordion → checkbox](#toggleswitch-accordion--checkbox) · [Typografie-token: `leading-[1.6]` op body-copy](#typografie-token-leading-16-op-body-copy) · [Verified input field](#verified-input-field).

---

## 1. Cross-cutting patronen / componenten

### Verified input field

_Feedback origineel gezien op:_ **Registratie** (groen vinkje naast BTW-/ondernemingsnummer en naast "Gegevens wettelijke vertegenwoordiger") en **Facturatie** (groen vinkje naast e-mail voor facturatie). De huidige losse status-iconen voelen plak-er-op-een-veld en zijn niet consistent met de rest van het form-systeem.

- [x] Bouw één herbruikbare "verified" input field component met consistent succes/error pattern (inline message, eventueel een samenvattende staat per sectie). Vervangt de huidige losse status-iconen naast velden.
- [x] Toepassen op Registratie — BTW-/ondernemingsnummer en "Gegevens wettelijke vertegenwoordiger".
- [x] Toepassen op Facturatie — e-mail voor facturatie.
- [ ] Audit overige invulvelden met validatie in het traject en pas toe.

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
- Status- en bevestigingspagina's gaan via `StatusContent` met `<H1>` ([StatusContent.tsx:61](packages/ui-lib/src/status-pages/StatusContent.tsx#L61)) en `PublicOverviewSection` met `<H2>` ([PublicOverviewSection.tsx:15](apps/frontend-pt1-extranet-onboarding/src/components/PublicOverviewSection.tsx#L15)). De raw `<h2>` daar mag opgezogen worden in de `H2`-component zodra die conversie elders ook gebeurt, maar de afgeleide pages hoeven niet apart.
- `PanelSection` gebruikt `<H4>` voor zijn titel ([PanelSection.tsx](packages/ui/src/components/panel-section/PanelSection.tsx)), dus alle panels in `apps/frontend-pt1-extranet-onboarding/src/panels/` erven die hiërarchie automatisch.
- `OnboardingFlowView` zet één `<H1>` per stap als page-titel ([onboarding-flow-view.tsx:115](packages/ui-certification/src/onboarding/onboarding-flow-view.tsx#L115)). Het probleem zit niet in de step-titel, wel in de subsecties eronder.

**Beslissing nodig over het "kleine subkop"-register binnen de wizard.** Het 20+ keer gebruikte patroon `<h3 className="text-sm font-semibold tracking-tight text-foreground">` zit visueel tussen `H4` (`text-heading-sm` + uppercase) en `H3` (`text-heading-md`) in. Voor het invullen van het traject moeten we kiezen:
- Optie A: het patroon snappen naar `H4` en de `uppercase` van `H4` laten vallen (eventueel `H4` aanpassen of een variant toevoegen).
- Optie B: een nieuwe semantische sub-heading component toevoegen (bv. `SubsectionHeading` of `FormSectionTitle`) die het huidige `text-sm font-semibold tracking-tight` formaliseert, met een Guidelines-pagina voor het wanneer.
- Optie C: het patroon zonder componentwrap laten, maar wel via een utility-class of `data-slot` zodat het herkenbaar en grep-baar is.

Tot die beslissing valt, zijn de items hieronder bewust niet "vervang door `H3`" maar "wikkel onder een gedeeld component". De refactor moet één keer en bewust gebeuren.

- [ ] **Beslis welk register de subsection-kop in de wizard krijgt.** Optie A/B/C hierboven afwegen samen met Pieter en de Storybook-guidelines. Daarna in één pass toepassen op alle 20+ sites onder `packages/ui-certification/src/components/onboarding/`.
- [ ] **Audit en converteer top-level page-titels die nu raw zijn.**
  - [RequestDetailPage.tsx:63](apps/frontend-pt1-extranet-onboarding/src/pages/RequestDetailPage.tsx#L63) gebruikt `<h1 className="mt-3 text-2xl font-semibold tracking-tight">`. Zet om naar `<H1>` (de page wijkt visueel licht af van de andere detail-pages doordat hij niet via `PageHeader` loopt).
  - [RequestDetailPage.tsx:95](apps/frontend-pt1-extranet-onboarding/src/pages/RequestDetailPage.tsx#L95) "Levenscyclus" is een raw `<h2 className="text-base ...">`. Zet om naar `<H2>` (of `<H3>` als de sectie ondergeschikt aan de page-titel hoort) zodra de beslissing over het sub-register bekend is.
  - [CategorizationDemoPage.tsx:13](apps/frontend-pt1-extranet-onboarding/src/pages/CategorizationDemoPage.tsx#L13) gebruikt `<h1 className="text-2xl font-semibold tracking-tight">`. Zet om naar `<H1>` (kan eventueel via `PageHeader`).
  - [BrandGradientHero.tsx:16](apps/frontend-pt1-extranet-onboarding/src/components/BrandGradientHero.tsx#L16) gebruikt raw `<h2>`. Component staat sowieso al op de verwijderlijst in [5.1 BrandGradientHero](#brandgradienthero-is-demo-restant-met-engelse-copy), dus opvolgen via dat item.
- [ ] **Audit en converteer raw `<h2>` op publieke vlaktes naar `<H2>`** (of via de bestaande wrapper-componenten):
  - [PublicOverviewSection.tsx:15](apps/frontend-pt1-extranet-onboarding/src/components/PublicOverviewSection.tsx#L15): vervang raw `<h2>` door `<H2>`. Eén plek refactoren, alle StatusPage-children erven het.
  - [InfoRequestPlaceholderPage.tsx:115,165](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestPlaceholderPage.tsx#L115): twee raw `<h2 className="m-0 text-heading-lg ...">` voor sectie-koppen. Vervang door `<H2>`.
  - [TrajectRequestReviewFlow.tsx:91](apps/frontend-pt1-extranet-onboarding/src/features/traject/TrajectRequestReviewFlow.tsx#L91): raw `<h2 className="m-0 text-heading-lg ...">`. Vervang door `<H2>`.
  - [ProductSelectionBasket.tsx:947](packages/ui-certification/src/components/traject/ProductSelectionBasket.tsx#L947): raw `<h2 className="text-xl font-semibold tracking-tight">`. Vervang door `<H2>`.
- [ ] **Dashboard widgets missen geen H1 (die staat op de DashboardPage), maar gebruiken inconsistente sub-koppen.** [LatestInvoicesWidget.tsx:56](apps/frontend-pt1-extranet-onboarding/src/pages/dashboard-widgets/LatestInvoicesWidget.tsx#L56) en [RecentNotificationsWidget.tsx:73](apps/frontend-pt1-extranet-onboarding/src/pages/dashboard-widgets/RecentNotificationsWidget.tsx#L73) gebruiken raw `<h4 className="text-[11px] font-semibold uppercase ...">`. Dat is visueel dichter bij `H4` (uppercase, klein), maar zit naast een `CardTitle` met `text-base`. Beslis of die widgets één duidelijke hiërarchie krijgen (bv. `CardTitle` als sectiehoofd en de uppercase-rij eronder als label, niet als heading) of of het uppercase-label naar `<H4>` mag.
- [ ] **Audit de raw `<h3>` cluster in de wizard en bepaal welke écht koppen zijn versus visuele labels.** De inventaris hieronder per stap ([3.6 Registratie](#36-traject--stap-registratie), [3.7 Maatschappelijke zetel](#37-traject--stap-maatschappelijke-zetel), [3.9 Facturatie](#39-traject--stap-facturatie-inclusief-extra-contacten), [3.10 Nazicht](#310-traject--stap-nazicht)) is bewust per stap opgesplitst zodat de refactor in één ronde per stap kan gebeuren. Innovatie- en metrologie-stap zitten momenteel niet in de page-list, maar hebben hetzelfde patroon: zie [OnboardingInnovationAttestStep.tsx:298,360,496](packages/ui-certification/src/components/onboarding/innovation-attest-step/OnboardingInnovationAttestStep.tsx#L298) en [OnboardingMetrologyStep.tsx:279,314,344](packages/ui-certification/src/components/onboarding/metrology-step/OnboardingMetrologyStep.tsx#L279).
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

- [ ] Voer een copy-density pass uit op alle data-invoer pagina's: microcopy korter, herhaalde uitleg samenvoegen, "nice to know"-content verplaatsen naar info-icons + tooltip.
- [ ] Specifiek nakijken op Maatschappelijke zetel — "Aanvullen vereist"-callout, "Aanvulling vanuit uw e-mail" demo-callout, herhaalde helper text onder elk veld.
- [ ] Specifiek nakijken op Certificatie (entiteit) — uitgebreide uitleg boven de keuze.
- [ ] Specifiek nakijken op Facturatie — lange paragrafen rond elk sub-blok.

### Desktop-breedte van page-level componenten

_Feedback origineel gezien op:_ verschillende organisms zijn mobile-first opgesteld met een vaste `max-w-*` en groeien niet mee op `lg` en `xl`. Op een breed scherm zit een kleine kolom met veel witruimte ernaast. Container-query-aware componenten (CoverView, ProductInquiryMatrix, ProductSelectionBasket, Snackbar) zijn correct responsive en hoeven niet aangepast.

- [ ] **AuthLayout** [packages/ui-lib/src/user-authentication/AuthLayout.tsx:124,126,143](packages/ui-lib/src/user-authentication/AuthLayout.tsx#L124) — formulier-kolom staat op `lg:w-3/5` met `max-w-sm` binnenin: op desktop is dat een smalle island met veel ongebruikte ruimte. Voorstel: kolom naar `lg:w-1/2 xl:w-2/5` en form-breedte naar `lg:max-w-md`, zodat het brand-paneel rechts ook ademruimte krijgt.
- [ ] **DraftRequestList** [packages/ui-certification/src/components/draft-request-list/DraftRequestList.tsx:67](packages/ui-certification/src/components/draft-request-list/DraftRequestList.tsx#L67) — capped op `max-w-3xl` (768px). Voor een lijst met titel, subtitle en details kan dat op `xl` ruimer (bv. `xl:max-w-5xl`).
- [ ] **RequestPackageReview** [packages/ui-certification/src/components/request-package-review/RequestPackageReview.tsx:240](packages/ui-certification/src/components/request-package-review/RequestPackageReview.tsx#L240) — review-document met tabellen capped op `max-w-2xl` (672px). Pijnlijk smal op desktop. Voorstel: `lg:max-w-4xl xl:max-w-5xl`.
- [ ] **ProcertusCategorizationTreeView side sheet** [packages/ui-certification/src/components/procertus-categorization-tree-view/ProcertusCategorizationTreeView.tsx:670](packages/ui-certification/src/components/procertus-categorization-tree-view/ProcertusCategorizationTreeView.tsx#L670) — sheet stopt bij `sm:max-w-3xl`. Op `lg` en `xl` kan ruimer (bv. `lg:max-w-4xl xl:max-w-5xl`) zodat tree en filterlabels niet onnodig moeten scrollen.
- [ ] Audit overige page-level organisms op vaste `max-w-2xl` / `max-w-3xl` zonder `lg:` of `xl:` upgrade. Inventaris is beperkt tot ui-lib en ui-certification want primitives in `packages/ui` worden parametrisch gebruikt.

### Typografie-token: `leading-[1.6]` op body-copy

_Feedback origineel gezien op:_ off-token-check hook flagde `leading-[1.6]` bij een edit op [RequestPackageReview.tsx:240](packages/ui-certification/src/components/request-package-review/RequestPackageReview.tsx#L240). Het patroon bestaat 8 keer in ui-certification (review-/summary-/onboarding body copy) en is ook gelogd in [packages/ui/src/off-token-log.md](packages/ui/src/off-token-log.md) voor StepLayout en stepper.

- [ ] Beslis systeem-breed: ofwel snappen naar `--text-base--line-height: 1.4rem` (huidig token, ruimer ritme verdwijnt), ofwel evolueren naar een eigen `--text-base-comfortable--line-height: 1.6rem` token met een `leading-comfortable` utility plus Guidelines.mdx-uitleg, en dan alle 8+ sites refactoren.
- [ ] Wanneer het token wordt geëvolueerd: ook de bestaande exception in `packages/ui/src/off-token-log.md` opruimen.

### Cart-status visibility

_Feedback origineel gezien op:_ **Homepage** ("Start uw certificeringstraject") — een blauwe "AL IN UW PAKKET · 2 PRODUCTEN" pill bovenop de BENOR-kaart, en een count-badge "2" op de filtertab "BENOR-certificatie". Beide indicatoren herhalen info die al duidelijk is uit het winkelmandje en de header-cart-indicator.

- [ ] Cart-status alleen tonen in het winkelmandje en de cart-indicator in de header — niet dupliceren elders.
- [ ] Verwijder "AL IN UW PAKKET · X PRODUCTEN" indicator van homepage certificaatkaarten.
- [ ] Verwijder count-badges van homepage filtertabs.

### Primitives polish — states en token-hygiëne

_Feedback origineel gezien op:_ audit van [packages/ui/src/components/ui/](packages/ui/src/components/ui/) tijdens een Storybook-polishronde. Vier primitives missen een state of wijken licht af van het token-systeem. Telkens met een voorstel dat binnen de bestaande tokens valt zodat de guidelines niet hoeven uitgebreid te worden.

- [x] **EmptyIcon — vaste `bg-white` doorbreekt theming.** [packages/ui/src/components/ui/empty.tsx:23](packages/ui/src/components/ui/empty.tsx#L23) — huidige classes `bg-white text-brand-primary-700 dark:bg-white/10 dark:text-brand-primary-200`. In dark mode zakt de cirkel naar "white at 10%" en verliest hij zijn brand-feel. **Voorstel:** vervang door `bg-accent text-accent-foreground`. Light → `brand-accent-50` onder anchor-blauw; dark → `brand-accent-950` onder `brand-accent-300`. Beide al bestaande semantic-token-paren.
- [x] **Input — geen hover state.** [packages/ui/src/components/ui/input.tsx:11](packages/ui/src/components/ui/input.tsx#L11) — gaat van idle rechtstreeks naar `focus-visible`, dus de cursor geeft geen signaal dat een veld interactief is. **Voorstel:** voeg `hover:not-disabled:not-focus-visible:not-aria-invalid:border-foreground/30` toe (analoog aan `hover:border-foreground/15` op sortable cards en `/20` op de stacking-sequence story). De `not-*`-modifiers zorgen dat focus en error states blijven winnen.
- [x] **Textarea — geen hover state.** [packages/ui/src/components/ui/textarea.tsx:10](packages/ui/src/components/ui/textarea.tsx#L10) — zelfde gat als Input. **Voorstel:** identieke `hover:not-disabled:not-focus-visible:not-aria-invalid:border-foreground/30`, zodat Input en Textarea als paar consistent voelen.
- [x] **Alert — `pr-18` valt buiten de gecureerde DS-spacing-schaal.** [packages/ui/src/components/ui/alert.tsx:7](packages/ui/src/components/ui/alert.tsx#L7) — `has-data-[slot=alert-action]:pr-18`. De `--spacing-ds-*`-schaal kent 10 / 11 / 12 / 14 / 16 / 20 / 24, geen 18 — `pr-18` werkt nu enkel via Tailwind v4's default `--spacing: 0.25rem` fallback (4.5rem). In spacious-mobile density (component = 20px, action ≈ 36px) klipt die 4.5rem 4px tegen de actie. **Voorstel:** snap naar `pr-20` (5rem = `--spacing-ds-20`, in de gecureerde schaal en ruim genoeg voor alle density-combo's).

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
- [ ] Pas [Verified input field](#verified-input-field) toe.
- [ ] Vervang "Bent u de wettelijke vertegenwoordiger?" door checkbox (zie [Choice card componenten](#choice-card-componenten)).
- [ ] Ruim dubbele/driedubbele titels rond "Wettelijke vertegenwoordiger" op. Behoud één duidelijke sectiekop en geef subvragen/veldgroepen een lichter (of geen) extra label.
- [ ] Vervang "Role"-veld door combobox met create-new (zie [Combobox met create-new](#combobox-met-create-new)).
- [ ] Vier raw `<h3 className="text-sm font-semibold tracking-tight ...">` sectie-koppen converteren conform [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten): [OnboardingCustomerStep.tsx:118,168,254,297](packages/ui-certification/src/components/onboarding/customer-step/OnboardingCustomerStep.tsx#L118) ("Organisatie-identificatie", "Wettelijke vertegenwoordiger", "Uw gegevens als indiener", "Gegevens wettelijke vertegenwoordiger"). Doe dit in dezelfde ronde als het opruimen van de dubbele titels hierboven.

### 3.7 Traject — stap "Maatschappelijke zetel"

_Route:_ [`/welcome/formal-request/company`](http://localhost:5173/welcome/formal-request/company)

- [ ] Maak meerdere zetels mogelijk in dezelfde stap (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Bouw de koppeling product → zetel hier in (zodat stap "Certificatie (entiteit)" kan verdwijnen, zie 3.8).
- [ ] Voer copy-density pass uit (zie [Copy density](#copy-density)).
- [ ] Raw `<h3>` sectie-kop "Maatschappelijke zetel" op [OnboardingCompanyZetelStep.tsx:178](packages/ui-certification/src/components/onboarding/company-step/OnboardingCompanyZetelStep.tsx#L178) converteren conform [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten). Houd rekening met de toekomstige multi-instance lijst: als één kop voor de hele stap volstaat kan de raw `<h3>` ook verdwijnen.

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

- [ ] Pas [Verified input field](#verified-input-field) toe.
- [ ] Vervang switch-accordions door checkbox (zie [Toggle/switch accordion → checkbox](#toggleswitch-accordion--checkbox)).
- [ ] Verwijder blokken "Certificatie-aanvragen in dit dossier" + "Factuur rechts-persoon per aanvraag" volledig (niet verplaatsen naar Nazicht).
- [ ] Voeg cert/inspectie-contact inline toe op deze stap (overgenomen van de voormalige stap "Extra contacten").
- [ ] Maak de tweede (reserve) contactpersoon inline toevoegbaar vanuit het primaire contactblok (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Update stepper: "Extra contacten" verdwijnt als aparte stap.
- [ ] Zes raw `<h3>`/`<h4>` sectie-koppen converteren conform [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten): [OnboardingInvoicingStep.tsx:125,193,256,269,402](packages/ui-certification/src/components/onboarding/invoicing-step/OnboardingInvoicingStep.tsx#L125) en de raw `<h3>` op de over te nemen blokken in [OnboardingExtrasStep.tsx:21](packages/ui-certification/src/components/onboarding/extras-step/OnboardingExtrasStep.tsx#L21). Doe de conversie nadat de blok-verwijderingen en samenvoeging hierboven gebeurd zijn, anders refactor je koppen die toch verdwijnen.

### 3.10 Traject — stap "Nazicht"

_Route:_ [`/welcome/formal-request/summary`](http://localhost:5173/welcome/formal-request/summary)

- [ ] Kort de samenvatting sterk in, vervang zware kaarten door compacte tabellen zodat de hele pagina in één oogopslag scanbaar is.
- [ ] Verwijder knop "Aanvragen wijzigen". De gebruiker navigeert terug via "Terug" en via de klikbare [Stepper](#stepper).
- [ ] Vier raw `<h3 className="m-0 text-base font-semibold ...">` sectie-koppen converteren conform [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten): [OnboardingSummaryStep.tsx:132,183,240,509](packages/ui-certification/src/components/onboarding/summary-step/OnboardingSummaryStep.tsx#L132) (aanvrager, geregistreerde juridische entiteiten, geregistreerde personen, begeleidende toelichting). Het visueel register hier is iets groter (`text-base` in plaats van `text-sm`); dat verschil moet je meenemen in de A/B/C-beslissing in de cross-cutting sectie.

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

### Cross-cutting regels

- [ ] **Vorm "u" overal aanhouden.** Vervang resterende "je"/"jij"-vormen door "u" in alle B2B-pagina's. Geconstateerd op:
  - [SignupPage.tsx](../apps/frontend-pt1-extranet-onboarding/src/pages/SignupPage.tsx): `"Meld je aan…"`, `"Start je aanvraag hier"`.
  - [TrajectConfigureFlow.tsx](../apps/frontend-pt1-extranet-onboarding/src/features/traject/TrajectConfigureFlow.tsx): `"…die je wil certificeren"`.
  - [TrajectBundleAssembleFlow.tsx](../apps/frontend-pt1-extranet-onboarding/src/features/traject/TrajectBundleAssembleFlow.tsx): `"…zodat je meteen alle benodigdheden…"`.
  - [WegwijzerPage.tsx](../apps/frontend-pt1-extranet-onboarding/src/pages/WegwijzerPage.tsx): `"Wanneer vraag je dit het beste aan?"`.
- [ ] **Geen em dashes (—) in user-facing copy.** Vervang door komma, dubbele punt of een nieuwe zin. Geconstateerd op InfoRequestSubmittedPage en OnboardingRegistrationCompletePage (zowel in sectie-titels als in body-paragrafen).
- [ ] **Geen "Gelieve" of bureaucratische passieve constructies.** Gebruik directe, actieve zinnen. Geconstateerd op [InfoRequestPlaceholderPage.tsx](../apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestPlaceholderPage.tsx) (`"Gelieve uw gegevens achter te laten…"`).
- [ ] **Geen prototype-meta-commentaar in user-facing copy.** Verwijder verwijzingen naar "deze demo", "in deze demo beschikbaar", "alvast opgenomen in de navigatiestructuur". Geconstateerd op DashboardPage en AppPlaceholderPage.
- [ ] **Geen Engelse strings in de NL-UI.** Vertaal:
  - [footerConfig.ts](../apps/frontend-pt1-extranet-onboarding/src/layouts/footerConfig.ts): `"Privacy policy"` → `"Privacybeleid"`.
  - [OnboardingEntryPlaceholderPage.tsx](../apps/frontend-pt1-extranet-onboarding/src/pages/OnboardingEntryPlaceholderPage.tsx): volledige Engelse panel + empty state (title, subtitle, AuthLayout-description, EmptyTitle, EmptyDescription, knop-label) naar Nederlands.
- [ ] **Vakjargon vermijden waar plain Dutch volstaat.** Specifiek: `"snapshot"`, `"dossierspoor"`, `"onboarding"` als zelfstandig naamwoord in koppen. Vervang door uitleg ("eigen dossier", "uw teamleden in het Klantenportaal").

### Per-pagina copy-actie

#### 4.1 Login [`SignupPage`](../apps/frontend-pt1-extranet-onboarding/src/pages/SignupPage.tsx)

_Route:_ [`/login`](http://localhost:5173/login) (cf. [3.11](#311-klantenportaal-login-pagina))

- [ ] `description`: `"Meld u aan met het e-mailadres waarmee u bij PROCERTUS geregistreerd staat."`
- [ ] Below-card link: `"Start hier uw aanvraag"`.

#### 4.2 Triage [`TriagePage`](../apps/frontend-pt1-extranet-onboarding/src/pages/TriagePage.tsx)

_Route:_ `/welcome/triage/:serviceId` (open via "Aanvraag starten" vanuit een detail-card op `/welcome`)

- [ ] Titel verkorten: `"Wilt u meer informatie of uw traject opstarten?"` (dubbele "wilt u" weghalen).
- [ ] Beschrijving: `"Vraag eerst vrijblijvend advies en een prijsopgave, of start meteen het formele dossier zodat de ontvankelijkheidsbeoordeling kan beginnen."`
- [ ] Bullets "Aanvraag meer informatie": `"Geen verplichting om op te starten"`, `"Antwoord binnen enkele werkdagen"`, `"Live sessie met een expert mogelijk"`.
- [ ] Bullets "Traject opstarten" herordenen naar 3 voorwaarden + 3 gevolgen: `"U hebt voldoende informatie over het traject"`, `"U hebt uw bedrijfsgegevens bij de hand"`, `"U wilt nu indienen"`, `"De ontvankelijkheidsbeoordeling start meteen"`, `"PROCERTUS volgt uw dossier actief op"`, `"Uw account wordt aangemaakt bij indiening"`.
- [ ] Expert-card heading van `"Liever eerst een expert spreken?"` naar `"Wilt u eerst een expert spreken?"`.
- [ ] Expert-card copy: `"Reserveer een live online sessie van één uur en overloop de vereisten samen met een PROCERTUS-expert."`

#### 4.3 Vrijblijvende informatieaanvraag [`InfoRequestPlaceholderPage`](../apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestPlaceholderPage.tsx)

_Route:_ `/welcome/info-request/:serviceId` (vanuit triage links-kaart)

- [ ] Beschrijving: `"Laat uw gegevens hieronder achter. We bekijken uw vraag en nemen snel contact met u op."` (drop "Gelieve").
- [ ] Sectie-titel `"Overzicht informatieaanvragen"` naar `"Waarover wilt u informatie?"`.
- [ ] Placeholder note-veld: `"Beschrijf hier de context van uw vraag of een concreet aandachtspunt."`.

#### 4.4 Aanvraag verzonden [`InfoRequestSubmittedPage`](../apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx)

_Route:_ `/welcome/info-request/:serviceId/verzonden`

- [ ] Sectie-titel `"Wat maakte deel uit van uw aanvraag"` naar `"Dit stuurde u in"`. Beschrijving: `"De certificaten uit uw mandje, samen met de toelichting die u hebt toegevoegd."`.
- [ ] Lege-mandje fallback: `"Uw mandje was leeg bij verzending. PROCERTUS leest uw vraag toch door en komt op basis daarvan bij u terug."`.
- [ ] Sectie-titel `"Onboarding naar het Klantenportaal"` naar `"Uw teamleden in het Klantenportaal"`. Beschrijving inkorten tot: `"Iedereen met een e-mailadres hieronder krijgt een uitnodiging om zich aan te melden. De juiste PROCERTUS-rol wordt automatisch gekoppeld."`.
- [ ] Bullets "Uw volgende stappen op het Klantenportaal" verkorten: één onderwerp per bullet, actieve zinnen, dossier-ID kort vermelden zonder lange tussenzin.
- [ ] Fallback zonder snapshot (geen `serviceId`): em dash verwijderen, splitsen in 2 zinnen. Voorstel: `"Bedankt voor uw aanvraag. We bekijken uw gegevens en nemen snel contact met u op. Herlaadt u deze pagina, dan zijn de gekoppelde details niet meer zichtbaar. Uw aanvraag is wel ontvangen."`.
- [ ] Expertgesprek-fallback (geen `preferenceLabel`): puntkomma vervangen door punt.

#### 4.5 Lopende-aanvraag banner [`ActiveInquiryContinueAlert`](../apps/frontend-pt1-extranet-onboarding/src/layouts/ActiveInquiryContinueAlert.tsx)

_Zichtbaar op:_ publieke pagina's onder `/welcome` wanneer er een formele aanvraag in progress is.

- [ ] Titel `"Actieve certificatie aanvraag"` naar `"Lopende certificatieaanvraag"` (één woord, geen spatie).
- [ ] Body: `"U hebt een formele aanvraag met X certificatieonderzoek(en). U kunt op elk moment verder waar u gestopt was."`

#### 4.6 Productkeuze [`TrajectConfigureFlow`](../apps/frontend-pt1-extranet-onboarding/src/features/traject/TrajectConfigureFlow.tsx)

_Route:_ `/welcome/aanvraag/:serviceId/start`

- [ ] Titel: `"Selecteer de producten die u wilt certificeren"` (formele vorm).
- [ ] Beschrijving: `"Doorzoek de catalogus of blader stap voor stap door de categorieën."`

#### 4.7 Per-product certificaten [`TrajectBundleAssembleFlow`](../apps/frontend-pt1-extranet-onboarding/src/features/traject/TrajectBundleAssembleFlow.tsx)

_Route:_ `/welcome/aanvraag/:serviceId/pakket` (cf. [3.3](#33-onboarding-stap-voeg-per-product-certificaten-toe))

- [ ] Beschrijving: `"Loop uw geselecteerde producten door en voeg de certificaten toe die u nog nodig hebt. Zo dient u meteen alles samen in."` (huidige versie mengt "uw" en "je" en eindigt zonder punt).

#### 4.8 Wegwijzer [`WegwijzerPage`](../apps/frontend-pt1-extranet-onboarding/src/pages/WegwijzerPage.tsx)

_Route:_ [`/welcome`](http://localhost:5173/welcome)

- [ ] Sectie-titel `"Wanneer vraag je dit het beste aan?"` naar `"Wanneer vraagt u dit het beste aan?"`.

#### 4.9 Dashboard [`DashboardPage`](../apps/frontend-pt1-extranet-onboarding/src/pages/DashboardPage.tsx)

_Route:_ `/` (na login)

- [ ] Beschrijving: `"Overzicht van uw sessie, organisatie en certificatieaanvragen."` (drop `"zoals in deze demo beschikbaar zijn"`).

#### 4.10 Placeholder-secties [`AppPlaceholderPage`](../apps/frontend-pt1-extranet-onboarding/src/pages/AppPlaceholderPage.tsx)

_Gebruikt door:_ alle nog niet geïmplementeerde secties in de authenticated app.

- [ ] Fallback-zin korter: `"Deze sectie is binnenkort beschikbaar."` (drop `"alvast opgenomen in de navigatiestructuur"`).

#### 4.11 Onboarding-entry placeholder [`OnboardingEntryPlaceholderPage`](../apps/frontend-pt1-extranet-onboarding/src/pages/OnboardingEntryPlaceholderPage.tsx)

_Route:_ `/welcome/onboarding` (placeholder)

- [ ] Volledige pagina vertalen naar Nederlands: `PANEL.title` + `PANEL.subtitle`, `AuthLayout` title en description, `EmptyTitle`, `EmptyDescription`, knop-label (`"Back to sign in"` naar `"Terug naar aanmelden"`).

#### 4.12 Footer [`footerConfig.ts`](../apps/frontend-pt1-extranet-onboarding/src/layouts/footerConfig.ts)

- [ ] `"Privacy policy"` naar `"Privacybeleid"`.

#### 4.13 Bevestigingspagina na indiening [`OnboardingRegistrationCompletePage`](../apps/frontend-pt1-extranet-onboarding/src/pages/OnboardingRegistrationCompletePage.tsx)

_Route:_ [`/registratie-voltooid`](http://localhost:5173/registratie-voltooid) (cf. [3.12](#312-bevestigingspagina-na-indiening-uw-account-is-klaar) voor de structurele wijzigingen. Onderstaande copy-actie blijft zinvol zolang de pagina in haar huidige vorm staat.)

- [ ] Lead-paragraaf: em dash weghalen, vervangen door punt. Voorstel: `"We bevestigen het dossier van X. Uw hoofdcontact is Y. U registreerde in totaal N conceptaanvraag/-aanvragen bij PROCERTUS. Onderaan dit scherm vindt u de volledige uitsplitsing en wat er digitaal op volgt."`.
- [ ] Activatie-callout in actieve vorm: `"Activeer uw portaaltoegang via e-mail. Elk dossier krijgt een dossier-ID in uw Klantenportaal. Zonder activering hebt u daar nog geen zicht op, maar uw dossier is wel bij PROCERTUS geregistreerd."`.
- [ ] Sectie-titel `"Uw ingediende aanvragen — wat volgt eerst digitaal"` naar `"Uw ingediende aanvragen en wat eerst volgt"`.
- [ ] Cache-miss fallback: drop `"snapshot"` en `"lokale opslag"`. Voorstel: `"Het overzicht is hier niet meer beschikbaar (bijvoorbeeld na een herlading van de pagina). U diende N conceptaanvraag/-aanvragen in. Zodra u de uitnodigingsmail opent, vindt u elk traject terug onder uw aanvragen in het Klantenportaal."`.
- [ ] Tabel-voetnoot: vervang `"dossierspoor"` door `"eigen dossier"`. Voorstel: `"Elke aanvraag krijgt een eigen dossier in het portaal. PROCERTUS verwittigt u zodra er actie nodig is, bijvoorbeeld bij bewijsstukken die u moet aanleveren of bij goedkeuringsmijlpalen."`.
- [ ] Sectie-titel `"Onboarding van gebruikers naar het Klantenportaal"` naar `"Uw teamleden in het Klantenportaal"`. Beschrijving inkorten tot: `"Iedereen hieronder krijgt een uitnodiging om zich aan te melden. Bij activatie wordt automatisch de juiste rol toegekend (kwaliteit, facturatie, certificatie, enz.). Collega's die hier nog niet vermeld staan, kunt u later vanuit uw beheer uitnodigen."`.
- [ ] Sectie-titel `"Volgende digitale onboarding — direct na deze melding"` naar `"Volgende stappen, meteen na deze melding"`. Bullets korter, één actie per bullet. Let op: deze sectie wordt volgens [3.12](#312-bevestigingspagina-na-indiening-uw-account-is-klaar) mogelijk volledig verwijderd.
- [ ] Voetkop `"Stappen rechts-onder in uw mailbox nu"` naar `"Volgende stap: check uw mailbox"`. Onderliggende paragraaf herschrijven in actieve, doorlopende zinnen.
- [ ] Statuspil `"Uitnodiging onderweg"` naar `"Uitnodiging verzonden"`; `"Geen portal‑uitnodiging"` naar `"Geen uitnodiging"`.
- [ ] `digitalFollowBrief()` per case: volledige zinnen, geen puntkomma als korte-zin-vervanger, geen lower-case startwoord.

---

## 5. Distill audit (2026-05-21)

_Audit gedaan met de `/distill` skill om visuele en structurele overcomplexiteit op te sporen in de app en in de gelinkte primitives. Items die elders in dit document al worden aangepakt (kaart-verwijderingen op de bevestigingspagina, copy-density passes, choice-card vs checkbox, enz.) zijn hier overgeslagen. Als een audit-finding doorwerkt op een page- of copy-item, staat dat als kruisverwijzing onder de bevinding zodat geen van beide kanten uit zicht raakt._

### 5.1 App-level

#### Expert-call kaart staat dubbel op Triage en Wegwijzer

_Feedback origineel gezien op:_ **Triage** ("Liever eerst een expert spreken?" als derde kaart onder de twee TriageOptionCards) én **Wegwijzer / Alle certificaten** (`ExpertCallFooterCard` als laatste cel in `AllCertificatesGrid`). Beide kaarten hebben dezelfde titel, dezelfde body en dezelfde gradient. Als de gebruiker eerst via de wegwijzer komt en dan een traject opent, ziet hij de identieke CTA twee schermen na elkaar.

- [ ] Beperk de expert-call CTA tot één visuele ankerplek. Voorstel: behoud de inline kaart op [WegwijzerPage.tsx:276](apps/frontend-pt1-extranet-onboarding/src/pages/WegwijzerPage.tsx#L276) als eerste ontdekpunt, en vervang de derde kaart op [TriagePage.tsx:105](apps/frontend-pt1-extranet-onboarding/src/pages/TriagePage.tsx#L105) door een tekstlink of een inline note onder de twee TriageOptionCards.
- [ ] Of, omgekeerd: behoud de prominentie op Triage (dat is het beslismoment) en zet de `ExpertCallFooterCard` op de wegwijzer terug naar een minder dominante variant (item-row in plaats van gradient-card).

> Raakt aan de expert-card copy-actie in [4.2 Triage](#42-triage-triagepage): als de kaart op Triage vervalt, vervallen ook de geplande copy-aanpassingen daar.

#### Check-bullets op TriageOptionCard stonden op text-success

_Feedback origineel gezien op:_ **Triage** ([`/welcome/triage/:serviceId`](http://localhost:5173/welcome/triage/origin)). De zes check-bullets op `TriageOptionCard` gebruikten `text-success`, terwijl het hier niet om een succes- of validatie-status gaat. Het anchor-blauw register (`accent-foreground`) sluit beter aan bij de icon-tile in de card-header, houdt success-groen vrij voor échte status-signalen, en geeft de vinkjes op de "Traject opstarten"-kaart de visuele rust die past bij een keuzemoment.

- [x] Vervang `text-success` door `text-accent-foreground` op [TriagePage.tsx:189](apps/frontend-pt1-extranet-onboarding/src/pages/TriagePage.tsx#L189).

#### Vier gestapelde bordered cards op InfoRequestSubmittedPage beslaan dezelfde temporele fase

_Feedback origineel gezien op:_ **Aanvraag verzonden** [InfoRequestSubmittedPage.tsx:39-199](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx#L39). De pagina toont vier `PublicOverviewSection`-kaarten onder elkaar: "Wat maakte deel uit van uw aanvraag", "Organisatie en context", "Onboarding naar het Klantenportaal", "Uw volgende stappen op het Klantenportaal". Drie ervan beschrijven hetzelfde toekomstige moment (wat er na het verzenden gebeurt), en "Organisatie en context" herhaalt waardes die al in de lead-paragraaf staan.

- [ ] Vouw "Organisatie en context" [InfoRequestSubmittedPage.tsx:77](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx#L77) in de lead-beschrijving in. Kanaal en organisatie zijn al in de heading-paragraaf vermeld; alleen het tijdstip "Ontvangen" mag eventueel als compacte regel onder de lead blijven.
- [ ] Voeg "Onboarding naar het Klantenportaal" [InfoRequestSubmittedPage.tsx:125](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx#L125) en "Uw volgende stappen op het Klantenportaal" [InfoRequestSubmittedPage.tsx:173](apps/frontend-pt1-extranet-onboarding/src/pages/InfoRequestSubmittedPage.tsx#L173) samen tot één sectie "Volgende stappen". Behoud de personenlijst, plaats de twee tot drie kerninstructies eronder. De vijf bullets van "Volgende stappen" zijn portal-onboarding en horen daar inhoudelijk thuis, niet op de bevestigingspagina (cf. analoge keuze in [3.12](#312-bevestigingspagina-na-indiening-uw-account-is-klaar) voor de registratie-bevestiging).

> Raakt aan de copy-acties in [4.4 Aanvraag verzonden](#44-aanvraag-verzonden-inforequestsubmittedpage): meerdere geplande tekst-aanpassingen verhuizen mee als de secties samengevoegd of geschrapt worden.

#### Authenticated detail-pages en widget-subkoppen volgen het H-systeem niet

_Feedback origineel gezien op:_ audit naar aanleiding van de cross-cutting [Heading-hiërarchie en H1–H4 componenten](#heading-hi%C3%ABrarchie-en-h1h4-componenten). De publieke `/welcome` flow en de meeste page-shells gebruiken `<H1>` netjes via `PageHeader`, maar drie authenticated/demo-routes wijken af en de twee dashboard-widgets gebruiken een eigen uppercase-mini-kop register.

- [ ] [RequestDetailPage.tsx:63,95](apps/frontend-pt1-extranet-onboarding/src/pages/RequestDetailPage.tsx#L63): raw `<h1 className="mt-3 text-2xl font-semibold tracking-tight">` voor de page-titel en raw `<h2 className="text-base font-semibold text-foreground">` voor "Levenscyclus". Page-titel naar `<H1>` (eventueel via `PageHeader` zodat de page in lijn komt met de andere detail-pages). De "Levenscyclus"-kop is qua niveau een sub-sectie van de detail-card; pas dezelfde keuze toe als voor de wizard-subkoppen.
- [ ] [CategorizationDemoPage.tsx:13](apps/frontend-pt1-extranet-onboarding/src/pages/CategorizationDemoPage.tsx#L13): raw `<h1>` naar `<H1>`. Mag mee in dezelfde refactor-pass als RequestDetailPage.
- [ ] [LatestInvoicesWidget.tsx:56](apps/frontend-pt1-extranet-onboarding/src/pages/dashboard-widgets/LatestInvoicesWidget.tsx#L56) en [RecentNotificationsWidget.tsx:73](apps/frontend-pt1-extranet-onboarding/src/pages/dashboard-widgets/RecentNotificationsWidget.tsx#L73) gebruiken raw `<h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">` direct onder een `CardTitle`. Beslis of die rij een echte sub-heading is (dan via `H4`, waarbij `text-[11px]` op de `H4`-baseline moet worden afgepast) of een visueel label (dan een gewone `<p>` of `<small>` zonder heading-tag, om de a11y-volgorde niet te verdubbelen onder `CardTitle`).

#### BrandGradientHero is demo-restant met Engelse copy

_Feedback origineel gezien op:_ [BrandGradientHero.tsx:6-28](apps/frontend-pt1-extranet-onboarding/src/components/BrandGradientHero.tsx#L6). Component met Engelse copy ("Onboarding prototype", "This route composes …") en literale verwijzingen naar `--gradient-primary` en `@procertus-ui/ui-lib`. Wordt nu enkel gebruikt vanuit `DesignSystemPage.tsx` (showcase).

- [ ] Verplaats `BrandGradientHero` naar een Storybook-story of `packages/_certification-domain-certification/playground`, weg uit de app-source. Op die manier blijft de demo-rol expliciet en kan de component niet per ongeluk in een andere route landen.
- [ ] Indien gewenst als geldige Procertus-hero op een toekomstige publieke pagina: herschrijf de copy in Nederlands en haal de codetoken-references uit de tekst.

### 5.2 Primitives en libraries

#### TrajectStoryFooter: vier optionele callbacks, drie reële scenarios

_Feedback origineel gezien op:_ [TrajectStoryFooter.tsx:19-30](packages/ui-certification/src/components/traject/TrajectStoryFooter.tsx#L19) (props) en [TrajectStoryFooter.tsx:44-90](packages/ui-certification/src/components/traject/TrajectStoryFooter.tsx#L44) (render). De component accepteert vier onafhankelijke callbacks (`onCancel`, `onBack`, `onContinue`, `onAddMore`) plus vier label-overrides. Theoretisch geeft dat 16+ combinaties; in de praktijk zijn er drie scenarios: eerste stap (alleen "Terug"), tussenstap (cancel + back + continue) en review-stap (cancel + back + add-more + continue).

- [ ] Vervang de vier optionele callbacks door één `mode`-prop met de drie reële waardes ("first-step" / "in-flow" / "review"). De callbacks die in die mode niet bestaan, hoeven niet meer doorgegeven te worden. Voordeel: één lezing van de prop-signature volstaat om te zien welke knoppen verschijnen.
- [ ] Schrap de label-overrides. Labels horen in i18n of in een lokale `messages`-object te zitten, niet als prop-by-prop optie op de footer zelf.

#### TriageOptionCard zit lokaal in TriagePage, terwijl de shape generiek voelt

_Feedback origineel gezien op:_ [TriagePage.tsx:138-208](apps/frontend-pt1-extranet-onboarding/src/pages/TriagePage.tsx#L138). De lokaal gedefinieerde `TriageOptionCard` heeft een generiek shape (icon-tile + titel + korte beschrijving + check-bullets + tone "primary" of "muted" + CTA met arrow). Dezelfde shape duikt al op in `MasterCard`-subsecties en is een logische kandidaat voor BENOR/ATG-keuzeschermen later.

- [ ] Hef de lokale definitie op en breng een algemene "DecisionCard" (of vergelijkbare naam) in `packages/ui-lib` als generieke twee-tone keuzekaart. Naam mag niet "Triage" bevatten omdat de inhoud niet domeingebonden is (cf. memory "Name by content, not consumer"). Eerste consument: TriagePage; tweede potentiële consument: het beslismoment "formele aanvraag vs informatieve aanvraag" in andere flows.
- [ ] Alternatief, als extractie te zwaar voelt: laat de component lokaal, maar dun hem af. De zes bullets aan de primary-kant kunnen naar drie (zie ook [4.2 Triage](#42-triage-triagepage)), de `shadow-proc-md` + `ring-2 ring-primary/30` voelen samen overdone op een muted-vs-primary paar. Eén van beide volstaat als visueel signaal.

> Raakt aan [Choice card componenten](#choice-card-componenten) in sectie 1: een nieuwe `DecisionCard` is mogelijk de juiste plek om die optimalisatieslag te bundelen.

#### BrowseCard `variant="faded"` wordt in productie één keer gebruikt

_Feedback origineel gezien op:_ `grep -r 'variant="faded"'` toont één gebruik buiten Storybook: [WegwijzerPage.tsx:254](apps/frontend-pt1-extranet-onboarding/src/pages/WegwijzerPage.tsx#L254) op de externe-verwijzing tegels in `AllCertificatesGrid`. Daarnaast bestaat een tweede pad voor exact dezelfde inhoud: `ExternalReferralGrid` [WegwijzerPage.tsx:313-339](apps/frontend-pt1-extranet-onboarding/src/pages/WegwijzerPage.tsx#L313) gebruikt `<Item>` in plaats van een faded BrowseCard.

- [ ] Kies één presentatie voor externe verwijzingen. Voorstel: behoud de `<Item>`-rij (compacter, past in de "Overige" tab) en gebruik die ook in `AllCertificatesGrid`. Dat maakt `variant="faded"` overbodig en zorgt voor één lees-pattern voor "dit dossier loopt elders".
- [ ] Als de faded-variant toch waarde heeft op een andere plek, documenteer dan in `BrowseCard.stories.tsx` voor welk inhoudtype hij bedoeld is. Anders verwijderen uit de `variant`-set.

> Raakt aan de externe-verwijzing tegels op [4.8 Wegwijzer](#48-wegwijzer-wegwijzerpage).

#### `data-density="spacious"` heeft geen meetbare adoptie

_Feedback origineel gezien op:_ `grep -r 'data-density="spacious"'` levert één gebruik op tegenover tien voor `operational`. De density-laag onderscheidt impliciet "public/onboarding (spacious)" en "portal/dashboard (operational)", maar in praktijk wordt spacious bijna nergens expliciet gezet, terwijl de publieke pagina's wel ruimer ogen door hun layout.

- [ ] Audit waar de publieke pagina's hun ruime ritme vandaan halen. Als dat via padding/gap-tokens komt en niet via de density-wrapper, dan is `data-density="spacious"` dode laag en kan hij uit het primitives-systeem.
- [ ] Indien spacious wel ingezet hoort te zijn op publieke routes: zet hem expliciet op één centraal punt (bv. `PublicLayout` of de `data-public-layout`-root) zodat de density-laag overal hetzelfde gedrag heeft.
