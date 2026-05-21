# Design feedback — todo

Checklist op basis van de design review. Onderverdeeld in:

1. **Cross-cutting patronen / componenten** — één keer bouwen, op meerdere plekken toepassen.
2. **Flow- en gedrags-architectuur** — bredere beslissingen over winkelmandje, drafts en navigatie.
3. **Page-specifieke wijzigingen** — per scherm, met verwijzing naar cross-cutting items waar van toepassing.

---

## 1. Cross-cutting patronen / componenten

### Verified input field

- [ ] Bouw één herbruikbare "verified" input field component met consistent succes/error pattern (inline message, eventueel een samenvattende staat per sectie). Vervangt de huidige losse status-iconen naast velden.
- [ ] Toepassen op Registratie — BTW-/ondernemingsnummer en "Gegevens wettelijke vertegenwoordiger".
- [ ] Toepassen op Facturatie — e-mail voor facturatie.
- [ ] Audit overige invulvelden met validatie in het traject en pas toe.

### Choice card componenten

- [ ] Bekijk de bestaande choice card-varianten en optimaliseer voor verschillende inhouden.
- [ ] Pas optimalisatie toe op Land/regio (vlag of layout anders gebruiken om de keuzes visueel beter te onderscheiden).
- [ ] Vervang choice cards door een lichtere oplossing (checkbox) wanneer de keuze in essentie "ik wil extra info opgeven" of "ik ben dit / ik ben dit niet" is.
- [ ] Concreet: vervang "Bent u de wettelijke vertegenwoordiger?" op Registratie door een checkbox die de extra velden toont/verbergt.

### Toggle/switch accordion → checkbox

- [ ] Vervang switches die een sectie open/dicht klappen door een checkbox (of inline action) die bij aanvinken de extra invoervelden toont.
- [ ] Toepassen op Facturatie — "Afwijkende facturatiedrukker per certificaat-aanvraag", "Afwijkend facturatieadres", "Andere contactpersoon voor facturatie".
- [ ] Toepassen binnen het samengevoegde cert/inspectie-contactblok op Facturatie (zie [3.9](#39-traject--facturatie-inclusief-extra-contacten)).

### Stepper

- [ ] Layout omdraaien: stappen aan de linkerkant, content aan de rechterkant — op alle stappen van het traject.
- [ ] Niet sticky op lange formulieren.
- [ ] Reeds bezochte stappen klikbaar maken voor directe navigatie.
- [ ] Vervang dynamische subtitle (samenvatting van ingevoerde waarden) door statische guidance copy die beschrijft wat in die stap gebeurt.

### Multi-instance entry pattern

- [ ] Definieer één pattern voor het toevoegen van meerdere instanties binnen één stap (bv. lijst van kaarten + "+ Item toevoegen"-actie).
- [ ] Toepassen op Maatschappelijke zetel — meerdere zetels in dezelfde stap.
- [ ] Toepassen op tweede (reserve) contactpersoon — inline toevoegbaar vanuit het primaire contactblok op Facturatie.

### Combobox met create-new

- [ ] Vervang het pattern "select + Anders + extra losstaand input field" door een combobox (searchable select) met een actie om de getypte waarde toe te voegen (bv. "+ Voeg rol toe: <getypte tekst>").
- [ ] Toepassen op Registratie — "Role"-veld.
- [ ] Audit alle invulvelden in het traject en kies het juiste veldtype per geval (select / combobox / autocomplete / vrije tekst).

### Copy density

- [ ] Voer een copy-density pass uit op alle data-invoer pagina's: microcopy korter, herhaalde uitleg samenvoegen, "nice to know"-content verplaatsen naar info-icons + tooltip.
- [ ] Specifiek nakijken op Maatschappelijke zetel — "Aanvullen vereist"-callout, "Aanvulling vanuit uw e-mail" demo-callout, herhaalde helper text onder elk veld.
- [ ] Specifiek nakijken op Certificatie (entiteit) — uitgebreide uitleg boven de keuze.
- [ ] Specifiek nakijken op Facturatie — lange paragrafen rond elk sub-blok.

### Cart-status visibility

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

### 3.1 Header / top navigation

- [ ] Optimaliseer spacing tussen header-knoppen (theme toggle, draft/inbox icon, login, taalkiezer) — consistent ritme, betere groepering tussen icon buttons en de primaire login knop.

### 3.2 Homepage ("Start uw certificeringstraject")

- [ ] Verwijder cart-status van kaarten en filtertabs (zie [Cart-status visibility](#cart-status-visibility)).

### 3.3 Onboarding stap "Voeg per product certificaten toe"

- [ ] Verwijder knop "Nog certificatie toevoegen".
- [ ] Verwijder callout "Deze certificatietypes staan niet in de kolommen …".
- [ ] Voeg tooltips toe in elke kolomheader met de beschrijving van dat certificaat.
- [ ] Toon niet-beschikbare certificaten als disabled checkbox in de matrix, met hover-tooltip die uitlegt waarom ze niet beschikbaar zijn voor dat product.

### 3.4 Onboarding stap "Controleer je aanvraagpakket"

- [ ] Verplaats "Nog certificatie toevoegen" naar onderaan / in de footer (zie [Footer-actiebar](#footer-actiebar)).
- [ ] Implementeer bevestig-gedrag naar mandje + popup (zie [Draft- en cart-gedrag](#draft--en-cart-gedrag)).

### 3.5 Traject — stap "Land of regio"

- [ ] Pas [Stepper](#stepper) toe.
- [ ] Optimaliseer choice cards (zie [Choice card componenten](#choice-card-componenten)).

### 3.6 Traject — stap "Registratie"

- [ ] Pas [Stepper](#stepper) toe (inclusief niet-sticky).
- [ ] Pas [Verified input field](#verified-input-field) toe.
- [ ] Vervang "Bent u de wettelijke vertegenwoordiger?" door checkbox (zie [Choice card componenten](#choice-card-componenten)).
- [ ] Ruim dubbele/driedubbele titels rond "Wettelijke vertegenwoordiger" op. Behoud één duidelijke sectiekop en geef subvragen/veldgroepen een lichter (of geen) extra label.
- [ ] Vervang "Role"-veld door combobox met create-new (zie [Combobox met create-new](#combobox-met-create-new)).

### 3.7 Traject — stap "Maatschappelijke zetel"

- [ ] Maak meerdere zetels mogelijk in dezelfde stap (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Bouw de koppeling product → zetel hier in (zodat stap "Certificatie (entiteit)" kan verdwijnen, zie 3.8).
- [ ] Voer copy-density pass uit (zie [Copy density](#copy-density)).

### 3.8 Traject — stap "Certificatie (entiteit)" verwijderen

- [ ] Verwijder de stap volledig uit het traject.
- [ ] Verplaats de koppeling product → zetel naar stap "Maatschappelijke zetel" (zie 3.7).
- [ ] Update stepper-volgorde en navigatie zodat deze stap niet meer verschijnt.

### 3.9 Traject — stap "Facturatie" (inclusief Extra contacten)

De voormalige stap "Extra contacten" wordt samengevoegd met "Facturatie".

- [ ] Pas [Verified input field](#verified-input-field) toe.
- [ ] Vervang switch-accordions door checkbox (zie [Toggle/switch accordion → checkbox](#toggleswitch-accordion--checkbox)).
- [ ] Verwijder blokken "Certificatie-aanvragen in dit dossier" + "Factuur rechts-persoon per aanvraag" volledig (niet verplaatsen naar Nazicht).
- [ ] Voeg cert/inspectie-contact inline toe op deze stap (overgenomen van de voormalige stap "Extra contacten").
- [ ] Maak de tweede (reserve) contactpersoon inline toevoegbaar vanuit het primaire contactblok (zie [Multi-instance entry pattern](#multi-instance-entry-pattern)).
- [ ] Update stepper: "Extra contacten" verdwijnt als aparte stap.

### 3.10 Traject — stap "Nazicht"

- [ ] Kort de samenvatting sterk in, vervang zware kaarten door compacte tabellen zodat de hele pagina in één oogopslag scanbaar is.
- [ ] Verwijder knop "Aanvragen wijzigen". De gebruiker navigeert terug via "Terug" en via de klikbare [Stepper](#stepper).

### 3.11 Klantenportaal login pagina

- [ ] Bouw afbeelding-rotatie / pool van meerdere visuals op de klantenportaal login pagina (huidige situatie: altijd dezelfde witte bouwvakker).
- [ ] Stel de pool divers samen — o.a. vrouwen, mensen met andere huidskleur of achtergrond — passend bij de Procertus-context (bouw, productie, certificering).

### 3.12 Bevestigingspagina na indiening ("Uw account is klaar")

Doel van deze pagina is enkel (1) bevestigen dat de indiening gelukt is, en (2) de gebruiker aansporen om in te loggen in het portaal.

- [ ] Verwijder kaart "Uw ingediende aanvragen — wat volgt eerst digitaal" (redundant met Nazicht).
- [ ] Kort kaart "Onboarding van gebruikers naar het Klantenportaal" in tot één regel, bv. "De vermelde personen ontvangen een uitnodiging voor het portaal en kunnen daarna inloggen en de status van de aanvragen opvolgen."
- [ ] Verwijder kaart "Volgende digitale onboarding — direct na deze melding" (deze instructies horen ín het portaal als first-run hints na login).
- [ ] Verwijder of integreer voettekst "Stappen rechts-onder in uw mailbox nu" als één korte zin.
- [ ] Consolideer alle behouden info in één bevestigingskaart met succesmelding, dossiernummer/contact-e-mail en de korte onboarding-zin.
- [ ] Toon twee gewogen CTA's: "Ga naar Klantenportaal" (primary) en "Open mijn mailbox" (secondary).
