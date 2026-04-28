# DetailPanels Component

A flexible component for managing a main content view alongside multiple detail panels that can dock to the side or overlay the content. This component enforces a **singleton pattern for panel types**: only one panel of a specific registered type (e.g., 'userSettings', 'notifications') can be open at a time. Opening a panel type that is already open will update its props and bring it to the front.

## Key Features

- **Singleton Panel Types:** Ensures only one instance per registered panel type is open.
- **Prop Updates:** Re-opening an existing panel type updates its props.
- **Responsive Layout:** Automatically switches between `docked` and `overlay` modes.
- **Panel Stacking & Activation:** Handles panel stacking and bringing stacked panels forward.
- **Injectable State Persistence:** Uses a configurable `PersistenceLayer` for state management (panel types, props map, active type). The layer is optional; defaults to no persistence.
- **Configurable Layout:** Options for panel widths, max panels, breakpoints, etc.
- **Responsive Defaults:** Automatically applies sensible defaults for `panelWidth`, `maxVisiblePanels`, and `mainViewMinWidth` based on container width if not explicitly provided.
- **Animation:** Uses `framer-motion` for smooth panel transitions.
- **Convenience Layout Component:** Provides `DetailPanelsLayout` for simpler setup.
- **Context-Driven:** Can be used via `DetailPanelsProvider` and `useDetailPanelsContext` for advanced control.
- **Internal Width Measurement:** Automatically measures its container width.
- **Serializable Props:** Panel components registered and props passed via `openPanel` should use only JSON-serializable types (strings, numbers, booleans, plain objects, arrays) to ensure compatibility with persistence layers like `localStorage`.

## Recommended Usage (`DetailPanelsLayout`)

The easiest way to use the component is via the `DetailPanelsLayout` wrapper, which combines the provider and presentation logic.

### 1. Define Panel Components and Registry

Create your panel components ensuring their props consist **only of serializable types**. The `panelType: string` prop is injected automatically.

**IMPORTANT:** Panel components should use the context hook (`useDetailPanelsContext` or a custom wrapper) internally to trigger actions like close or activate, using the `panelType` prop they receive.

```tsx
// panelRegistry.ts
import React, { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Label } from "@workspace/ui";
// Import the custom hook if you created one, otherwise import useDetailPanelsContext
import { useAppDetailPanels } from "../hooks/useAppDetailPanels"; // Assuming custom hook exists
// Import SerializableProps if needed for strict typing
import type { SerializableProps } from "@workspace/ui-lib";

// Base type describing the prop injected by the component
interface InjectedPanelProps {
  panelType: string;
}

// User Settings Panel Props (Serializable only)
interface UserSettingsPanelProps {
  userId: string;
  initialAdminFlag?: boolean;
}
export const UserSettingsPanel: React.FC<UserSettingsPanelProps & InjectedPanelProps> = (
  {
    /* ... */
  },
) => {
  // Use context hook for actions
  const { removePanel, activateStackedPanel } = useAppDetailPanels();
  const [isAdmin, setIsAdmin] = useState(initialAdminFlag);
  // ... render Card with Button actions using removePanel(panelType) etc.
  return (
    <Card className="h-full flex flex-col rounded-none">
      {/* ... Card Header/Content ... */}
      <div className="p-4 border-t flex gap-2">
        <Button onClick={() => activateStackedPanel(panelType)} variant="outline" size="sm">
          Activate
        </Button>
        <Button onClick={() => removePanel(panelType)} variant="destructive" size="sm">
          Close
        </Button>
      </div>
    </Card>
  );
};

// Notifications Panel Props (Serializable only)
interface NotificationsPanelProps {}
export const NotificationsPanel: React.FC<NotificationsPanelProps & InjectedPanelProps> = ({
  panelType,
}) => {
  // Use context hook for actions
  const { removePanel, activateStackedPanel } = useAppDetailPanels();
  // ... render Card with Button actions using removePanel(panelType) etc.
  return (
    <Card className="h-full flex flex-col rounded-none">
      {/* ... Card Header/Content ... */}
      <div className="p-4 border-t flex gap-2">
        <Button onClick={() => activateStackedPanel(panelType)} variant="outline" size="sm">
          Activate
        </Button>
        <Button onClick={() => removePanel(panelType)} variant="destructive" size="sm">
          Close
        </Button>
      </div>
    </Card>
  );
};

// --- Registry Map ---
export const panelRegistry = {
  userSettings: UserSettingsPanel,
  notifications: NotificationsPanel,
};
// --- Registry Type ---
export type AppPanelRegistry = typeof panelRegistry;
```

### 2. Instantiate a Persistence Layer (Optional)

You can optionally choose and instantiate a persistence layer using the provided hooks (`useLocalStoragePersistence`, `useUrlQueryPersistence`). If you omit the `persistenceLayer` prop, the panel state will **not** be saved across page reloads or sessions.

```tsx
// To enable persistence (e.g., using localStorage):
const persistenceLayer = useLocalStoragePersistence("myAppDetailPanels");

// To disable persistence (or if you omit the prop):
// const persistenceLayer = useNoPersistence(); // Or simply don't pass the prop
```

### 3. Render `<DetailPanelsLayout>`

Import and use `DetailPanelsLayout`. Pass the `panelTypes` registry, your main view content as `children`, and optionally the `persistenceLayer` and other layout config props.

```tsx
// Example: App setup (with optional persistence)
// ... imports ...

const App: React.FC = () => {
  // Decide whether to persist state
  const shouldPersist = true; // Or false, or based on some condition
  const persistenceLayer = shouldPersist
    ? useLocalStoragePersistence("myAppDetailPanels")
    : undefined; // Pass undefined or omit the prop entirely for no persistence

  return (
    <DetailPanelsLayout
      panelTypes={panelRegistry}
      // Only pass the layer if you want persistence
      {...(persistenceLayer && { persistenceLayer })}
      // Optional: Override defaults if needed
      // panelWidth={450}
      // ... other props ...
      className="border rounded-lg shadow-sm h-[600px]"
    >
      {/* Main View Content */}
      <div className="bg-muted/40 h-full">
        <h1 className="p-4 text-xl font-semibold">Main Content Area</h1>
        <PanelOpener />
        {/* ... other main view components ... */}
      </div>
    </DetailPanelsLayout>
  );
};
```

### 4. Use Typed Context Hook within Children

Components rendered as `children` of `DetailPanelsLayout` can use `useDetailPanelsContext<AppPanelRegistry>()` (or your custom `useAppDetailPanels()` hook) to access context values like `openPanel`, `removePanel`, etc.

### 5. Optional: Create a Custom App-Specific Hook (Recommended)

As shown in the example above, creating a simple wrapper hook avoids repeating the `<AppPanelRegistry>` generic argument:

```tsx
// hooks/useAppDetailPanels.ts
import { useDetailPanelsContext, DetailPanelsContextType } from "@workspace/ui-lib";
import type { AppPanelRegistry } from "../panelRegistry"; // Import your registry type

export function useAppDetailPanels(): DetailPanelsContextType<AppPanelRegistry> {
  return useDetailPanelsContext<AppPanelRegistry>();
}
```

## Responsive Defaults

If you do not explicitly provide `panelWidth`, `maxVisiblePanels`, or `mainViewMinWidth` props to `DetailPanelsLayout` (or `DetailPanelsProvider`), the component will use the following defaults based on the available container width:

| Breakpoint | Min Width | Default `panelWidth` | Default `maxVisiblePanels` | Default `mainViewMinWidth` |
| :--------- | :-------- | :------------------- | :------------------------- | :------------------------- |
| base       | 0px       | 300                  | 1                          | 300                        |
| sm         | 640px     | 320                  | 1                          | 320                        |
| md         | 768px     | 350                  | 1                          | 400                        |
| lg         | 1024px    | 380                  | 2                          | 450                        |
| xl         | 1280px    | 400                  | 3                          | 500                        |
| 2xl        | 1536px    | 420                  | 3                          | 550                        |

You can customize these by passing the specific prop(s) you want to change.

## Advanced Usage (Context Provider)

For more complex scenarios or direct access to the presentational component, you can still use the `DetailPanelsProvider` and `DetailPanels` component separately.

### 1. Define Panel Components and Registry (Same as above)

### 2. Instantiate a Persistence Layer (Optional)

(Same as in Recommended Usage section: Optional, defaults to no persistence if omitted.)

### 3. Wrap with `<DetailPanelsProvider>`

Import and use `DetailPanelsProvider`. Pass the `panelTypes` registry, and optionally the `persistenceLayer` and other layout config props.

```tsx
// Example: App setup using Provider (with optional persistence)
// ... imports ...

const AppWithProvider: React.FC = () => {
  const persistenceLayer = useLocalStoragePersistence("myAppDetailPanelsProvider"); // Or undefined

  return (
    <DetailPanelsProvider
      panelTypes={panelRegistry}
      {...(persistenceLayer && { persistenceLayer })} // Optionally pass layer
      // Optional: Override defaults
      // panelWidth={450}
      // ...
    >
      {/* Render your main layout which uses the context */}
      <MyMainLayout />
    </DetailPanelsProvider>
  );
};
```

### 4. Use Typed Context Hook & Render `<DetailPanels>`

Within children of the provider (e.g., in `MyMainLayout`), use `useDetailPanelsContext<AppPanelRegistry>()` to get the context data and actions. Render the presentational `DetailPanels` component, passing the required props from the context.

```tsx
// Example: MyMainLayout.tsx (for Provider usage)
import React from "react";
import { useAppDetailPanels } from "../hooks/useAppDetailPanels"; // Use custom hook
import { DetailPanels } from "@workspace/ui-lib"; // Presentational component
import { Button } from "@workspace/ui";

// Component to open panels (same as before)
const PanelOpener: React.FC = () => {
  /* ... */
};

// Component that renders the DetailPanels UI using context
export const MyMainLayout: React.FC = () => {
  const context = useAppDetailPanels(); // Use the custom hook
  const {
    calculatedPanels,
    displayMode,
    totalVisibleWidth,
    removePanel,
    activateStackedPanel,
    mainViewMinWidth,
    containerWidth,
  } = context;

  return (
    <DetailPanels
      calculatedPanels={calculatedPanels}
      displayMode={displayMode}
      totalVisibleWidth={totalVisibleWidth}
      removePanel={removePanel}
      activateStackedPanel={activateStackedPanel}
      mainViewMinWidth={mainViewMinWidth ?? 300}
      containerWidth={containerWidth ?? 0}
      className="border rounded-lg shadow-sm h-[600px]"
    >
      {/* Main View Content - also uses context hook */}
      <div className="bg-muted/40 h-full">
        <h1 className="p-4 text-xl font-semibold">Main Content Area</h1>
        <PanelOpener />
        {/* ... other main view components ... */}
      </div>
    </DetailPanels>
  );
};
```

## Context Hook (`useDetailPanelsContext`) Return Value

The hook (`useDetailPanelsContext<YourRegistryType>()` or your custom wrapper) provides a fully typed context value:

- Layout State: `calculatedPanels`, `displayMode`, `totalVisibleWidth`, `containerWidth`.
- Active State: `activePanelType: string | null`.
- Panel Props Access: `getPanelProps(type): SerializableProps`.
- Actions:
  - `openPanel<Type extends keyof YourRegistry>(type: Type, props?: SerializableProps): void`
  - `removePanel(type: string | keyof YourRegistry): void`
  - `activateStackedPanel(type: string | keyof YourRegistry): void`
- Config Echo: `panelWidth`, `maxPanels`, `maxVisiblePanels`, `mainViewMinWidth`, `breakpoint`, `stackedPanelWidth`. (Reflects the final values used, considering user overrides and responsive defaults).

## Persistence Layer Interface (`PersistenceLayer`)

Implement this interface for custom persistence strategies:

```typescript
export interface PersistenceLayer {
  getOpenPanelTypes: () => string[];
  getPanelPropsMap: () => Record<string, SerializableProps>;
  getActivePanelType: () => string | null;
  setOpenPanelTypes: (types: string[]) => void;
  setPanelPropsMap: (propsMap: Record<string, SerializableProps>) => void;
  setActivePanelType: (type: string | null) => void;
  subscribe: (callback: () => void) => () => void;
}
```

**Provided Hooks:**

- `useNoPersistence(): PersistenceLayer` (Used internally as default if no layer is provided)
- `useLocalStoragePersistence(key: string): PersistenceLayer`
- `useUrlQueryPersistence(): PersistenceLayer`

## Advanced Scenarios

- **Overlay Mode / Stacking:** Handled automatically based on `containerWidth`, `breakpoint`, and `maxVisiblePanels`.
- **Activation:** Calling `activateStackedPanel(type)` or `openPanel(type, ...)` brings the panel of that type to the front (makes it the most recent in the layout order) and sets it as the `activePanelType`.
- **Updating Props:** Calling `openPanel('myType', newProps)` for an already open panel type `'myType'` will update the props stored for that type and re-render the corresponding panel component with the `newProps`.
