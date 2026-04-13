# Procertus radius doctrine

> The geometry of trust is not arbitrary. Every curve in the PROCERTUS system is extracted from the brand, encoded into tokens, and governed by strict functional rules. This is the operational standard for border radius across all current and future tools. Deviations require explicit sign-off.

---

## 01. The blueprint radius

**The anchor:** `8px` (`0.5rem`) is the resting state of every interactive and structural surface in the PROCERTUS system: cards, inputs, dialogs, dropdowns, table containers. This is not a suggestion, it is the non-negotiable foundation.

**The logic:** The blueprint radius represents industrial precision. It is the visual equivalent of a machined edge: clean, deliberate, and unmistakably engineered. Where the brand demands authority, the `8px` radius delivers it by refusing to call attention to itself. It lets the content do the work.

**Why this number?** It sits at the exact threshold where a rectangle communicates structure without feeling sharp or hostile. Below `8px`, surfaces begin to feel brittle and technical. Above it, they drift toward playfulness. `8px` is the equilibrium point where PROCERTUS lives: professional, approachable, precise.

**The continuity rule:** This radius remains constant across all density modes. When the system compresses spacing and type to fit denser layouts, the blueprint radius holds. Reducing it would erode brand recognition at the moment it matters most, when the interface is at its most functional and utilitarian. The `8px` anchor is what keeps a compact PROCERTUS screen looking like PROCERTUS, not like a generic data table.

---

## 02. The signature curve

**The extraction:** The PROCERTUS logotype contains two interlocking checkmarks. Their geometry is not a circle and not a square; it is a compound curve with one deep sweep and one sharp return. We extracted this DNA and encoded it as an asymmetric radius that can be applied to any interactive component.

**The spec:** On hover, buttons transition from the blueprint `8px` to the signature geometry: `16px` on the deep corners and `4px` on the sharp corners. This creates a shape that echoes the checkmark without literally drawing one. The brand is felt, not seen.

```
DEFAULT STATE (Idle)          SIGNATURE STATE (Hover)
+------------------+          +----..............--+
|                  |          .                    |
|   8px uniform    |    →     |   16px / 4px       |
|                  |          |   asymmetric        .
+------------------+          +--..............----+
```

**Optical scaling:** The signature must remain legible at every component size. On a default button (`h-9`), the `16px` deep curve reads clearly. But on a small button (`h-7` or `h-8`), that same `16px` would consume too much of the surface and distort the shape.

We solve this with the **rule of proportion**: the deep-corner value scales down with component size, while the sharp corner remains fixed at `4px`. This preserves the asymmetric character without overwhelming small targets.

```
SIZE        DEEP CORNER     SHARP CORNER
default     16px            4px
sm          12px            4px
xs          10px            4px
```

**The transition:** The morph from blueprint to signature uses a `300ms ease-out` curve. This is slow enough to feel intentional and physical, fast enough to never feel sluggish. The radius is included in the transition property alongside color and background, so the shape breathes with the rest of the state change.

[ View radius tokens ](../?path=/story/design-tokens-radius--core)

---

## 03. Kinetic pairing

**The concept:** Not all actions move in the same direction. Some push the user forward (Submit, Confirm, Save). Others pull them back or offer an exit (Cancel, Back, Dismiss). In the PROCERTUS system, the signature curve encodes this distinction through its orientation.

**Forward curve (commitment):** The deep corners sit at **top-left and bottom-right**. This diagonal creates a shape that leans forward, like a checkmark in motion. It is the default for Primary and Destructive actions: buttons that represent progression, commitment, and irreversible intent.

**Reciprocal curve (retreat):** The deep corners sit at **top-right and bottom-left**, the exact mirror. This signals a supporting or backward-moving action. Outline, Secondary, and Ghost variants use this geometry. Cancel buttons, navigation-back, and dismissals all carry the reciprocal curve.

```
FORWARD (Primary / Destructive)        RECIPROCAL (Outline / Secondary / Ghost)

+----..............--+                  +--..............----+
.                    |                  |                    .
|   TL: 16px         |                  |         TR: 16px   |
|            BR: 16px .                  .  BL: 16px          |
+--..............----+                  +----..............--+

    → Lean forward.                         ← Lean back.
    Commitment.                             Support. Exit.
```

**The symmetrical bracket:** When a forward and reciprocal button sit side by side, as they do in every confirmation dialog, their curves form a symmetrical bracket that echoes the mirrored checkmarks in the PROCERTUS logotype. The paired geometry creates a visual container around the decision point, drawing the eye inward toward the choice.

```
KINETIC BRACKET (Dialog Footer)

+--..........----+  +----..........--+
|                .  .                |
|    CANCEL       |  |    CONFIRM     |
.                |  |                .
+----..........--+  +--..........----+

  ← Reciprocal        Forward →

Together: a bracket that mirrors the brand.
```

**The goal:** Shapes create intent before the user reads a single word. A forward curve says "proceed" through geometry alone. A reciprocal curve says "this is your way out." Together they form kinetic brackets that hug the interface and mirror the brand's core symmetry, the two interlocking checkmarks that define PROCERTUS.

---

## 04. The pulse of verification

**The physics of a click:** A PROCERTUS button does not simply change color on press. It travels. On `active`, the button translates `1px` downward with zero duration (instant, mechanical) and simultaneously fires a beacon pulse: a ring of the focus color that expands outward from the button's edge over `800ms` before fading to nothing.

This is the command confirm interaction model. The mechanical travel provides tactile certainty ("I pressed it"). The beacon pulse provides semantic confirmation ("The system received it").

```
IDLE                    ACTIVE (instant)              PULSE (800ms ease-out)

+------------------+    +------------------+          +------------------+
|                  |    |                  | ↓ 1px    |    ░░░░░░░░░░    |
|     CONFIRM      |    |     CONFIRM      |          |  ░ CONFIRM  ░    |
|                  |    |                  |          |    ░░░░░░░░░░    |
+------------------+    +------------------+          +------------------+

    At rest.              Mechanical travel.            Beacon radiates.
```

**Semantic pulses:** The beacon pulse is not one color. It carries meaning:

- **Teal pulse (verified):** The default. Fires on Primary action buttons. The pulse uses the focus ring color (`--ring`) at full strength, expanding to `6px` before fading. This is the checkmark made kinetic: the system is telling the user "verified, proceeding." The ring color adapts automatically to light and dark mode.

- **Red pulse (critical):** Fires on Destructive action buttons. The pulse uses `sys-destructive-400`, signaling that the action is irreversible and the system has acknowledged that gravity. The user pressed a dangerous button, and the interface responds with appropriate weight.

**Critical detail:** The button retains its signature curve throughout the active state and pulse. The shape does not snap back to `8px` during the interaction. This ensures visual continuity: the user hovered to reveal the brand geometry, clicked to confirm, and the geometry held steady through the entire sequence. Trust is built through consistency.

---

## Implementation reference

Every rule on this page is **already encoded in the component library**. The `button.tsx` component implements the blueprint radius, signature curve, kinetic pairing, and command confirm interaction model through CSS custom properties and Tailwind utility classes. The `--cmd-deep` token governs the deep corner, and per-size overrides handle optical scaling automatically.

Do not manually set border-radius values on buttons. The component handles the geometry. If you need to adjust the deep-corner depth for a new component size, override `--cmd-deep` on that size variant, not the radius utilities directly.

| Concept | Token / Property | Value | Applied by |
|---|---|---|---|
| Blueprint radius | `rounded-[8px]` | `8px` | Base button class |
| Deep corner (default) | `--cmd-deep` | `16px` | Base button class |
| Deep corner (sm) | `--cmd-deep` | `12px` | `size="sm"` variant |
| Deep corner (xs) | `--cmd-deep` | `10px` | `size="xs"` variant |
| Sharp corner | Hardcoded | `4px` | Hover variant classes |
| Mechanical travel | `translate-y-[1px]` | `1px` | Active state |
| Beacon pulse | `command-pulse` | `800ms ease-out` | Active state keyframe |
| Transition | `duration-300 ease-out` | `300ms` | Base button class |

[ View kinetic pairing in action ](../?path=/story/applied-guidelines-radius--default)
