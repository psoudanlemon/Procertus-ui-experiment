# DetailPanels System - AI Agent Guide

Concise guide for using the DetailPanels component system.

## Purpose

- Manage a main content view alongside multiple, type-specific detail panels (sidebars).
- Enforces **singleton pattern**: Only one panel per registered `panelType` can be open.
- Handles responsive layout (docked vs. overlay), stacking, and activation.

## Core Components & Concepts

- **`DetailPanelsLayout` (Recommended)**: Simplest setup. Combines provider and presentation.
- **`DetailPanelsProvider`**: Context provider. Manages panel state (types, props, active).
- **`DetailPanels`**: Presentational component rendering the layout. Used by `DetailPanelsLayout` or directly with `DetailPanelsProvider`.
- **`useDetailPanelsContext<RegistryType>()`**: Hook to access context (state & actions).
- **Panel Registry**: A map (`{ [panelType: string]: React.ComponentType }`) defining available panel types and their components. Passed to `DetailPanelsLayout` or `DetailPanelsProvider`.
- **Panel Components**: Your custom components for each panel type. Receive `panelType` prop automatically. Props must be **JSON-serializable**.
- **Layout Recommendation:** Consider using the `CoverView` component to structure the content _within_ a panel, especially for detail views requiring a collapsing header, actions, or cover images. `CoverView` handles its own internal scrolling.
- **`PersistenceLayer` (Optional)**: Interface for saving/loading panel state (types, props, active). Hooks provided: `useLocalStoragePersistence`, `useUrlQueryPersistence`. If omitted, state is transient.

## Recommended Setup (`DetailPanelsLayout`)

1.  **Define Panel Components & Registry:**
    - Create panel components. **Props must be serializable.**
    - Use context hook (e.g., `useDetailPanelsContext`) inside panels for actions (`removePanel(panelType)`).
    - Create a registry map: `export const panelRegistry = { typeA: ComponentA, typeB: ComponentB };`
    - Define registry type: `export type AppPanelRegistry = typeof panelRegistry;`
2.  **Instantiate Persistence (Optional):**
    - `const persistenceLayer = useLocalStoragePersistence('storageKey');` (or other layer, or `undefined` for none).
3.  **Render Layout:**

    ```tsx
    import { DetailPanelsLayout, useLocalStoragePersistence } from '@workspace/ui-lib';
    import { panelRegistry } from './panelRegistry';

    function App() {
      const persistenceLayer = useLocalStoragePersistence('myPanels');
      return (
        <DetailPanelsLayout
          panelTypes={panelRegistry}
          persistenceLayer={persistenceLayer} // Optional
          // panelWidth={400} // Optional config overrides
        >
          {/* Main Content Area */}
        </DetailPanelsLayout>
      );
    }
    ```

4.  **Use Context Hook (in Children/Main Content):**
    - Create a typed wrapper hook (recommended): `function useAppPanels() { return useDetailPanelsContext<AppPanelRegistry>(); }`
    - Use the hook: `const { openPanel } = useAppPanels();`

## Key Context Actions (`useDetailPanelsContext`)

- **`openPanel<Type extends keyof Registry>(type: Type, props?: SerializableProps)`**: Opens panel of `type`. Updates props if already open. Activates it.
- **`removePanel(type: string | keyof Registry)`**: Closes panel of `type`.
- **`activateStackedPanel(type: string | keyof Registry)`**: Brings an existing (potentially stacked) panel to the front.
- **`getPanelProps(type)`**: Retrieves current props for an open panel.

## Core Behaviors

- **Singleton Enforcement**: `openPanel('myType', ...)` replaces any existing 'myType' panel's props.
- **Prop Updates**: Re-opening updates props.
- **Serializable Props**: Crucial for persistence. Use only JSON types.
- **Responsive Layout**: Auto-switches `docked`/`overlay` based on width.
- **Responsive Defaults**: `panelWidth`, `maxVisiblePanels`, `mainViewMinWidth` adjust based on container width if not set explicitly.
- **Stacking/Activation**: Handles multiple open panels (up to `maxVisiblePanels` or based on width) and bringing them forward.
- **Animation**: Uses `framer-motion` for transitions.

## Layout Configuration Props

- Passed to `DetailPanelsLayout` or `DetailPanelsProvider`.
- `panelWidth`: (number)
- `maxPanels`: (number)
- `maxVisiblePanels`: (number)
- `mainViewMinWidth`: (number)
- `breakpoint`: (number | string) - Custom breakpoint for overlay switch.
- `stackedPanelWidth`: (number)
- `persistenceLayer`: (PersistenceLayer | undefined)

---

## `PanelsLayout` (sewdn, `@procertus-ui/ui`)

This folder also implements **`PanelsLayout`** / **`Panels`** (used by PT1 extranet onboarding). Naming overlaps with the guide above, but the API is `PanelsLayout` + `panelTypes` + optional `useUrlQueryPersistence`.

### Main region height & scrolling

- The layout root is `flex … overflow-hidden`; the **main slot** (`.detail-panels-main-view`) is a **`flex h-full min-h-0 flex-col overflow-hidden`** column so children receive a bounded height.
- **Do not** force `100svh` on content inside the main slot unless the app root is only this layout. Prefer **`h-full min-h-0`** so the shell fills the measured panel width/height.
- **Scroll** should live in the app shell’s primary surface (e.g. `ManagementAppShell`’s `<main class="… min-h-0 flex-1 overflow-y-auto">`), not on `window`, so `html/body/#root { overflow: hidden }` remains valid.
