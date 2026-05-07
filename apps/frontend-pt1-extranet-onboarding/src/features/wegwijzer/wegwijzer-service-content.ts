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
  /** Long-form explanation. Rendered as a paragraph below "Wat is …" heading. */
  what: string;
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
    what: "Een Environmental Product Declaration (EPD) documenteert de milieuprestaties van een bouwproduct over zijn volledige levenscyclus. PROCERTUS treedt op als intake-partner; de finale publicatie verloopt via EPD-Hub of een gelijkwaardig erkend programma.",
    whenToApply: [
      "U wilt de milieu-impact van uw product transparant communiceren in tenders of duurzaamheidsdossiers.",
      "Een opdrachtgever vereist een EPD voor BREEAM, LEED of een gelijkaardig duurzaamheidsschema.",
      "U beschikt over een gevalideerde levenscyclusanalyse (LCA) of bent klaar om er één te laten uitvoeren.",
    ],
    requirements: [
      {
        title: "Levenscyclusanalyse",
        content: "Volledige LCA-studie volgens EN 15804+A2, opgemaakt door een onafhankelijke verificateur.",
      },
      {
        title: "Productspecificatie",
        content: "Samenstelling, productieproces en functionele eenheid van het product.",
      },
      {
        title: "Productieplaats",
        content: "Identificatie van de productielocatie(s) waarop het EPD betrekking heeft.",
      },
      {
        title: "Verificatierapport",
        content: "Onafhankelijk verificatieverslag conform de eisen van het gekozen EPD-programma.",
      },
    ],
    timeline:
      "Vanaf indiening tot publicatie bedraagt de doorlooptijd typisch 8 tot 16 weken, afhankelijk van de volledigheid van de LCA en de verificatieronde.",
  },

  partijkeuring: {
    what: "Een partijkeuring is een ad-hoc keuring waarbij PROCERTUS één afgebakende batch of partij van een bouwproduct controleert op conformiteit met de gevraagde specificaties. Het is een eenmalig traject zonder doorlopende certificatie.",
    whenToApply: [
      "U wilt een specifieke partij valideren zonder lopende BENOR- of CE-certificatie.",
      "Er is twijfel over de conformiteit van een levering of voorraadpartij.",
      "Een bouwheer vraagt een onafhankelijke keuring als voorwaarde tot acceptatie.",
    ],
    requirements: [
      {
        title: "Identificatie van de partij",
        content: "Volume, productiedatum, lotnummer en opslag- of leveringslocatie.",
      },
      {
        title: "Productdocumentatie",
        content: "Beschikbare technische documentatie en interne kwaliteitsanalyses.",
      },
      {
        title: "Toegang voor staalname",
        content: "Mogelijkheid voor PROCERTUS om representatieve stalen te nemen op locatie.",
      },
      {
        title: "Te verifiëren parameters",
        content: "Specificatie van de prestatiekenmerken die binnen de keuring worden onderzocht.",
      },
    ],
    timeline:
      "Vanaf staalname tot eindrapport duurt een typische partijkeuring 2 tot 4 weken, afhankelijk van het type proeven en de productfamilie.",
  },
};
