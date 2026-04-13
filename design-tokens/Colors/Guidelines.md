# Procertus Color Charter

> The rulebook for translating the Procertus brand into a cohesive software design system. This is not a suggestion, it is the operational standard. Deviations require explicit sign-off.

---

## 01. Brand Origins (Navy & Teal)

**The Blueprint:** We didn't build the brand; we are operationalizing it. The Procertus identity is born from a duality: Navy (Authority) and Teal (Trust).

**The Logic:** Navy is our anchor; Teal is our signature. In every interface, Navy provides the structure, while Teal provides the verification, mirroring the checkmark in the logo.

**The Transformation:** A logo is a signature, but software is an environment. To ensure cohesion across all current and future applications, we have expanded our 2 brand anchors into a functional 50-950 scale.

**Why we do this:** Software requires 'states.' We need Navy 800 for hovers and Navy 50 for backgrounds. This allows for depth and interaction without ever leaving the brand family.

---

## 02. Engineered Neutrals (Atmosphere)

**The Tint:** We avoid generic grays. Our neutrals are 'Atmosphere' tones, infused with a drop of brand Navy (Hue ~230).

**The Result:** This ensures that even the empty spaces in the app feel bespoke to Procertus, creating a premium, integrated atmosphere.

```
Standard Gray        Atmosphere Neutral
+--------------+     +--------------+
|              |     |         .... |  <- A drop of Navy
|  Flat.       |     |  Cohesive.   |     infused into
|  Generic.    |     |  Bespoke.    |     every shade.
|              |     |              |
+--------------+     +--------------+
```

[ View Neutral Colors ](../?path=/story/design-tokens-color--neutral)

---

## 03. Harmonic System Colors (Functional Palette)

**System Harmony:** Our functional colors (Red, Green, Amber) are intentionally Low Chroma. By subduing their vibrancy, we achieve a 'European Aesthetic': professional, calm, and deferential to the brand. They provide feedback without shouting.

**The Goal:** System colors exist to communicate state, not to compete with the brand. They are harmonized to the same tonal family so that success, warning, and error states feel native to the Procertus environment rather than grafted on from a generic toolkit.

---

## 04. The Functional Blueprint (The Theme)

**The Engine:** The Functional Blueprint is the bridge where our raw brand DNA meets the actual user interface. It is the logic engine that translates color into Roles: Structure, Interaction, and Surfaces.

Where the preceding sections define *what* our colors are, this section defines *what they do*. Every token in the system is assigned a functional role, and that role governs where and how it may appear. This is not decoration; it is engineering.

**Unified Governance:** Procertus utilizes a single, unified semantic theme for all current and future tools. By rejecting a multi-layered theming approach, we ensure that brand integrity is maintained across the entire ecosystem, from the Registry to automated Phase 4 documentation. Any future adjustment is managed through one single source of truth, ensuring 100% consistency with zero maintenance overhead.

**The Three Pillars of Mapping:**

- **Structure (The Frame):** Our Navys and Neutrals defining the skeleton and boundaries. Headers, sidebars, dividers, borders: the architectural elements that give the interface its shape and hierarchy. These tokens are stable and deliberate.

- **Interaction (The Action):** Our Teals and Accents reserved for user intent. Buttons, links, focus rings, active states: anything the user can act upon. These tokens carry energy and invite engagement. They must never be confused with structural or decorative elements.

- **Surfaces (The Content):** Our Whites and Midnights defining the depth and focus of the data. Backgrounds, cards, input fields, overlays: the planes on which information lives. Surface tokens create the spatial hierarchy that directs the user's attention to what matters.

[ View the Unified Theme Mapping ](../?path=/docs/design-tokens-theme--docs)

---

## 05. The Contrast Contract (Theme + Accessibility)

**The Validation:** The Blueprint above defines *what goes where*. This section defines the safety inspection that ensures every mapping meets its accessibility obligation. A role assignment is only valid if it passes the Contrast Contract.

**Balanced Trust (AA):** We govern our colors through a deliberate AA (4.5:1) contrast standard across all tools. This is not a compromise; it is a strategic decision.

**Why not AAA?** AAA (7.0:1) is a noble goal, but enforcing it universally creates practical problems. It restricts palette choices to a narrow band that conflicts with our brand tones, and it introduces a visual harshness that causes eye strain over long operational shifts. Our staff spend hours in these tools. Legibility is paramount, but so is comfort.

**The Standard:** AA compliance gives us the room to honor both the brand and the user. It guarantees legibility for the broadest audience while preserving the calm, professional atmosphere that Procertus demands. Every token pairing in the system is validated against this contract before it ships.

With the functional roles defined and their accessibility validated, we can now address the final environmental variable: how this system adapts when the lights go out.

---

## 06. The Beacon Principle (Applied Identity)

**Dark Mode Logic:** In a dark environment, the eye hunts for light.

**The Shift:** We promote Teal to the Primary Action color in Dark Mode.

**The Goal:** A Navy button disappears in the dark. The Teal acts as a Beacon, ensuring the most important action is always found instantly.

```
LIGHT MODE                    DARK MODE
+------------------+          +------------------+
|                  |          | ................ |
|   +----------+   |          |   +----------+   |
|   |  NAVY    |   |          |   |  TEAL    |   |
|   |  BUTTON  |   |          |   |  BUTTON  |   |
|   +----------+   |          |   +----------+   |
|                  |          | ................ |
|   Authority.     |          |   Beacon.        |
+------------------+          +------------------+
```

