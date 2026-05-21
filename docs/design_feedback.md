# Design feedback — todo

Checklist op basis van de design review. Onderverdeeld in:

1. **Cross-cutting patronen / componenten** — één keer bouwen, op meerdere plekken toepassen.
2. **Flow- en gedrags-architectuur** — bredere beslissingen over winkelmandje, drafts en navigatie.
3. **Page-specifieke wijzigingen** — per scherm, met verwijzing naar cross-cutting items waar van toepassing.

---

## 1. Cross-cutting patronen / componenten

### Verified input field

_Feedback origineel gezien op:_ **Registratie** (groen vinkje naast BTW-/ondernemingsnummer en naast "Gegevens wettelijke vertegenwoordiger") en **Facturatie** (groen vinkje naast e-mail voor facturatie). De huidige losse status-iconen voelen plak-er-op-een-veld en zijn niet consistent met de rest van het form-systeem.

- [ ] Bouw één herbruikbare "verified" input field component met consistent succes/error pattern (inline message, eventueel een samenvattende staat per sectie). Vervangt de huidige losse status-iconen naast velden.
- [ ] Toepassen op Registratie — BTW-/ondernemingsnummer en "Gegevens wettelijke vertegenwoordiger".
- [ ] Toepassen op Facturatie — e-mail voor facturatie.
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
- [ ] Pas [Verified input field](#verified-input-field) toe.
- [ ] Vervang "Bent u de wettelijke vertegenwoordiger?" door checkbox (zie [Choice card componenten](#choice-card-componenten)).
- [ ] Ruim dubbele/driedubbele titels rond "Wettelijke vertegenwoordiger" op. Behoud één duidelijke sectiekop en geef subvragen/veldgroepen een lichter (of geen) extra label.
- [ ] Vervang "Role"-veld door combobox met create-new (zie [Combobox met create-new](#combobox-met-create-new)).

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

### 3.10 Traject — stap "Nazicht"

_Route:_ [`/welcome/formal-request/summary`](http://localhost:5173/welcome/formal-request/summary)

- [ ] Kort de samenvatting sterk in, vervang zware kaarten door compacte tabellen zodat de hele pagina in één oogopslag scanbaar is.
- [ ] Verwijder knop "Aanvragen wijzigen". De gebruiker navigeert terug via "Terug" en via de klikbare [Stepper](#stepper).

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
