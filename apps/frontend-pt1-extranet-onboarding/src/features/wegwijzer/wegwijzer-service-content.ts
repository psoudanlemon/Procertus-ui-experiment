/**
 * Long-form content per Wegwijzer service. The factual data is fictional but
 * plausible — meant for prototype demo only and **not** to be relied on as
 * authoritative certification information.
 */

import type { AvailableEntryKey } from "@procertus-ui/ui-certification";

export type ServiceRequirement = {
  title: string;
  content: string;
};

export type ServiceContent = {
  /** Long-form explanation. Rendered below "Wat is …" — string or multiple paragraphs. */
  what: string | readonly string[];
  /** Bullet list under "Wanneer vraag je dit het beste aan". */
  whenToApply: readonly string[];
  /** Rendered as a Table under "Vereisten". */
  requirements: readonly ServiceRequirement[];
  /** Paragraph under "Termijn". */
  timeline: string;
};

export const WEGWIJZER_SERVICE_CONTENT: Partial<Record<AvailableEntryKey, ServiceContent>> = {
  benor: {
    what: "BENOR is een Belgisch productcertificaat dat aantoont dat een bouwproduct voldoet aan de geldende normen voor samenstelling, productie en prestatie. PROCERTUS kent het toe na een uitgebreide initiële beoordeling en houdt het in stand via continue externe controles op de productielocatie en op de markt.",
    whenToApply: [
      "U wenst een gestandaardiseerd bouwproduct (beton, mortel, granulaten, hydraulische bindmiddelen) op de Belgische markt aan te bieden.",
      "Aanbestedende overheden (SPW, AWV, MOW, Infrabel) leggen BENOR op in hun lastenboeken.",
      "U wilt uw kwaliteitssysteem en productprestaties extern laten valideren.",
    ],
    requirements: [
      {
        title: "Kwaliteitshandboek",
        content: "Beschrijving van het volledige productieproces, controleplan en verantwoordelijkheden.",
      },
      {
        title: "Interne controleresultaten",
        content: "Twaalf maanden gedocumenteerde productiekenmerken en proefresultaten.",
      },
      {
        title: "Identificatie productie-eenheid",
        content: "Locatie, kapaciteit en organisatie van de productie waarop de aanvraag betrekking heeft.",
      },
      {
        title: "Akkoord BENOR-richtlijn",
        content: "Bevestiging dat de toepasselijke BENOR-richtlijn voor uw productfamilie wordt gevolgd.",
      },
    ],
    timeline:
      "Vanaf indiening van een volledig dossier verloopt het traject in 8 tot 12 weken: ontvankelijkheidsanalyse, initiële audit, analyse van de proefresultaten en finale beslissing.",
  },

  ce: {
    what: "De CE-markering bevestigt dat een bouwproduct voldoet aan de essentiële kenmerken vastgelegd in de Bouwproductenverordening (CPR 305/2011). PROCERTUS treedt op als aangemelde keuringsinstantie binnen de niveaus 1, 1+, 2+, 3 en 4, afhankelijk van het risicoprofiel van het product.",
    whenToApply: [
      "Uw product valt onder een geharmoniseerde Europese productnorm of Europees Beoordelingsdocument.",
      "U wilt uw product binnen de Europese markt commercialiseren.",
      "U wijzigt productformule, productielocatie of productiemiddelen die de prestaties beïnvloeden.",
    ],
    requirements: [
      {
        title: "Initiële typetests",
        content: "Proeven volgens de toepasselijke geharmoniseerde norm voor uw productfamilie.",
      },
      {
        title: "FPC (Fabriekseigen Productiecontrole)",
        content: "Operationeel kwaliteitscontrolesysteem op de productielocatie.",
      },
      {
        title: "Prestatieverklaring (DoP)",
        content: "Declaration of Performance per productfamilie volgens Annex III van de CPR.",
      },
      {
        title: "Niveau-aanduiding",
        content: "Identificatie van het systeem (1, 1+, 2+, 3 of 4) met bijhorende certificeringspaden.",
      },
    ],
    timeline:
      "Bij niveau 2+ duurt de initiële certificatie 6 tot 10 weken (audit, testen en dossierbeoordeling). Bij niveau 1+ kan dit oplopen tot 16 weken vanwege de bredere productverificatie.",
  },

  ssd: {
    what: "Het SSD-certificaat (Sortie du Statut de Déchets) bevestigt dat een gerecycleerd materiaal in Wallonië niet langer als afval wordt beschouwd, maar als een grondstof of product met een gevalideerde toepassing. PROCERTUS verifieert de samenstelling, de toepassingsvoorwaarden en de naleving van de Waalse milieureglementering.",
    whenToApply: [
      "U commercialiseert een gerecycleerde minerale fractie (granulaten, betonbreker, gestabiliseerde slakken) in Wallonië.",
      "Uw inputmateriaal of verwerkingsproces wijzigt.",
      "Een Waalse opdrachtgever vereist SSD als voorwaarde tot levering.",
    ],
    requirements: [
      {
        title: "Beschrijving inputmateriaal",
        content: "Herkomst, samenstelling en kenmerken van het materiaal vóór verwerking.",
      },
      {
        title: "Verwerkingsproces",
        content: "Procesbeschrijving van de fysische en eventuele chemische bewerkingen.",
      },
      {
        title: "Milieukundige analyses",
        content: "Uitloging en samenstellingstesten per outputfractie volgens de Waalse referentieprotocollen.",
      },
      {
        title: "Beoogde toepassing",
        content: "Beschrijving van de toepassing(en) en de bijhorende technische eisen.",
      },
    ],
    timeline:
      "Doorlooptijd bedraagt typisch 10 tot 14 weken, afhankelijk van de complexiteit van het ingangsmateriaal en de noodzakelijke milieukundige proeven.",
  },

  "innovation-attest": {
    what: "Een Innovatie-attest is een ad-hoc attest, uitgegeven door PROCERTUS voor een specifiek innovatief product of techniek dat (nog) niet onder een gestandaardiseerd certificatieschema valt. Het wordt steeds gezamenlijk aangevraagd door de leverancier van het product én de bouwheer van het project waar het wordt toegepast.",
    whenToApply: [
      "Een product of bouwtechniek past niet binnen een bestaande norm of certificatiekader.",
      "Een bouwheer wenst expliciete validatie voor toepassing in een specifiek project.",
      "U beschikt over projectspecifieke bewijsvoering die de prestaties onderbouwt.",
    ],
    requirements: [
      {
        title: "Technische beschrijving",
        content: "Grondstoffen, samenstelling en dimensies van het product.",
      },
      {
        title: "Argumentatienota",
        content: "Waarom het product niet onder bestaande voorschriften/normen valt.",
      },
      {
        title: "Bewijsvoering",
        content: "Overzichtstabel van proeven en bijbehorende verslagen.",
      },
      {
        title: "Projectdetails",
        content: "Beschrijving van het project inclusief formeel akkoord van de bouwheer.",
      },
    ],
    timeline:
      "PROCERTUS beoordeelt de ontvankelijkheid binnen 20 werkdagen na indiening van een volledig dossier.",
  },

  procertus: {
    what: "Het PROCERTUS-attest is een PROCERTUS-eigen attestering, beperkt tot een nauwkeurig afgebakende productenlijst waarvoor geen BENOR- of ATG-traject beschikbaar is. Het bevestigt dat het product voldoet aan de prestatie-eisen vastgelegd in een PROCERTUS-eigen technisch dossier.",
    whenToApply: [
      "Uw product valt buiten het BENOR-toepassingsgebied, maar PROCERTUS-validatie biedt meerwaarde.",
      "Een opdrachtgever neemt het PROCERTUS-attest expliciet op als alternatief voor BENOR.",
      "Een normatief traject is niet proportioneel voor de beperkte productlijn.",
    ],
    requirements: [
      {
        title: "Productspecificatie",
        content: "Volledige specificatie van het product en de gebruikscontext.",
      },
      {
        title: "Productiekwaliteit",
        content: "Bewijs van consistente productiekwaliteit (FPC of gelijkwaardig).",
      },
      {
        title: "Type-onderzoeken",
        content: "Resultaten volgens de van toepassing zijnde PROCERTUS-richtlijn.",
      },
      {
        title: "Controlemodaliteiten",
        content: "Akkoord op frequentie en scope van de continue PROCERTUS-controle.",
      },
    ],
    timeline:
      "Het volledige certificeringstraject duurt typisch 6 tot 8 weken na indiening van een volledig technisch dossier.",
  },

  atg: {
    what: "Een ATG-attest (Technische Goedkeuring) bevestigt de geschiktheid van een innovatief bouwproduct voor een welomschreven gebruikscontext. PROCERTUS treedt op als intake-partner: u dient uw aanvraag in via PROCERTUS, die het dossier doorzet naar het Belgische technische goedkeuringsbureau (BUtgb) en u door het traject begeleidt.",
    whenToApply: [
      "Uw product valt buiten de bestaande BENOR- of CE-trajecten en behoeft een Belgische technische goedkeuring.",
      "Een opdrachtgever vraagt expliciet een ATG-attest in zijn lastenboek.",
      "U wenst de Belgische geschiktheid van uw product te onderbouwen voor een specifieke toepassing.",
    ],
    requirements: [
      {
        title: "Productdossier",
        content: "Technische beschrijving van het product en zijn beoogde toepassingen.",
      },
      {
        title: "Bewijsvoering",
        content: "Proefverslagen en eventuele referentieprojecten die de geschiktheid staven.",
      },
      {
        title: "Productiebeheersing",
        content: "Beschrijving van de kwaliteits- en productiebewaking op de productielocatie.",
      },
      {
        title: "Toepassingsdomein",
        content: "Afbakening van de gebruiksomstandigheden waarvoor het attest wordt gevraagd.",
      },
    ],
    timeline:
      "Het volledige ATG-traject loopt typisch 6 tot 12 maanden, afhankelijk van de complexiteit van het product en de noodzakelijke bewijsvoering. PROCERTUS volgt het dossier op tot de finale BUtgb-beslissing.",
  },

  epd: {
    what: [
      "Een Environmental Product Declaration (EPD), in het Nederlands ook milieuproductverklaring genoemd, is een gestandaardiseerd document dat de milieueffecten van een product — veelal bouwmaterialen — over de volledige levenscyclus transparant en onder voorwaarden van derden gecontroleerd (geverifieerd) weergeeft.",
      "In tegenstelling tot een marketingclaim bundelt een EPD LCA-resultaten volgens vastgelegde regels (productcategorie-regels / PCR), een functionele eenheid en rapportagescenario’s zodat vergelijkbaarheid en traceerbaarheid mogelijk zijn in aanbestedingen en milieukeuzes.",
      "PROCERTUS begeleidt uw aanvraag voor een EPD via dit onboarding-portaal: intake, inhoudelijke clearing en afstemming met erkende verificatie en registratie — conform het gekozen programma (bv. publicatie via een erkend platform zoals EPD-Hub).",
    ],
    whenToApply: [
      "U moet een EPD aanleveren voor een tender, een overheidsopdracht of een bouwproject waarin milieuprestaties contractueel worden opgenomen.",
      "U wilt het CO₂-footprintprofiel en andere milieu-indicatoren van uw product aantonen voor BREEAM, LEED of gelijkwaardige duurzaamheidsschema’s.",
      "U brengt een nieuwe productlijn uit of wijzigt productie (locatie, energiebron, receptuur) waardoor een update van het milieuprofiel nodig is.",
      "Uw klanten vragen om gestandaardiseerde, gecontroleerde milieugegevens naast CE of BENOR-documentatie.",
    ],
    requirements: [
      {
        title: "Productcategorieregels (PCR)",
        content:
          "Het van toepassing zijnde PCR-kader voor uw productfamilie: systeemgrenzen, referentieservicelevensduur en verplichte milieu-indicatoren (conform EN 15804 en aanvullingen waar relevant).",
      },
      {
        title: "Levenscyclusanalyse (LCA)",
        content:
          "Model en datasets voor alle relevante levenscyclusfasen (grondstoffen, transport, productie, einde levensduur). Vaak uitgewerkt door een gespecialiseerde LCA-auteur.",
      },
      {
        title: "Functionele eenheid en declared unit",
        content:
          "Eenduidige declaratie-eenheid (bv. per ton product, per m², per geleverde hoeveelheid) zodat gebruikers het product eerlijk kunnen vergelijken.",
      },
      {
        title: "Productgegevens en productiestroomspecificatie",
        content:
          "Samenstelling, energie- en hulpstoffenverbruik, afvalstromen en verpakking gekoppeld aan de concrete productielocatie(s) waar het EPD op betrekking heeft.",
      },
      {
        title: "Onafhankelijke verificatie",
        content:
          "Externe kritische review door een erkende reviewer volgens de regels van het EPD-programma; dit levert een verklaring die aan het document wordt gekoppeld.",
      },
      {
        title: "Registratie en publicatie",
        content:
          "Indiening bij het gekozen programma en registratie op het bijhorende platform zodat het EPD vindbaar en citeerbaar is voor marktpartijen.",
      },
    ],
    timeline:
      "Na een volledige intake door PROCERTUS verloopt een traject typisch in 8 tot 18 weken: vastleggen PCR-scope, afronden LCA en reviewronde, gevolgd door verificatie en registratie. Complexere producten of meerdere fabrieken verlengen deze bandbreedte.",
  },

  partijkeuring: {
    what: [
      "Een partijkeuring is een controle door een onpartijdige instelling van een specifieke, afgebakende hoeveelheid product (een partij). Ze heeft als doel na te gaan of er voldoende vertrouwen bestaat dat de kenmerken van die partij aan de vastgelegde eisen voldoen.",
      "Partijkeuring betreft steeds een afgebakende hoeveelheid; de volledige partij moet bij keuring beschikbaar zijn. De controle is éénmalig en richt zich in principe op het eindproduct — ze waarborgt daarmee niet het volledige productieproces of alle grondstoffen.",
      "In dit portaal wordt partijkeuring niet als eigen aanvraagtraject aangeboden. Aanvragen voor partijkeuring lopen via COPRO; zie het officiële overzicht op copro.eu voor werkwijze, attesten en formulieren.",
    ],
    whenToApply: [
      "Uw lastenboek of technisch bestek schrijft een partijkeuring voor (bv. verwijzing naar norm of standaardbestek zoals SB250 waar dat van toepassing is).",
      "U wilt conformiteit van één levering of opslagpartij aantonen voordat ze op de werf wordt toegepast.",
      "Er bestaat geen lopend productcertificaat voor het betreffende product, of er worden bijkomende eisen gesteld die een eenmalige batchbevestiging vereisen.",
    ],
    requirements: [
      {
        title: "Keuringsdocument",
        content:
          "De eisen zijn vastgelegd in een keuringsdocument op basis van een norm, type- of standaardbestek, bijzonder bestek, technisch voorschrift (PTV) of een geschreven overeenkomst.",
      },
      {
        title: "Markering van de partij",
        content:
          "Producten worden vooraf gekenmerkt met een partijnummer (eerste stempeling). Bij gunstige resultaten volgt markering conform het programma van de keuringsinstantie.",
      },
      {
        title: "Monstername en proeven",
        content:
          "De partij wordt bemonsterd en beproefd volgens het keuringsdocument; alle materiaal moet tijdens het onderzoek beschikbaar zijn.",
      },
      {
        title: "Attest of niet-conformiteitsverslag",
        content:
          "Bij conformiteit volgt een attest van overeenkomstigheid met product, hoeveelheid, identificatie en bouwplaats; anders een verslag van niet-overeenkomstigheid met vermelding van afwijkende kenmerken.",
      },
    ],
    timeline:
      "Doorlooptijd hangt af van planning bij de keuringsinstantie en het proefpakket; informeer tijdig bij COPRO en vermeld uw gewenste lever- of werkdatum.",
  },
};
