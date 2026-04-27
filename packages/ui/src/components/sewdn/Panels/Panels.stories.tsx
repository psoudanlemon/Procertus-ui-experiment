import React, { useState } from 'react';
import type { Meta, StoryObj, Args } from '@storybook/react-vite';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  usePanelsContext,
  PanelsLayout,
  PanelsContextType,
} from './index';
import type { UsePanelsArgs } from './types';

const FullViewportDecorator = (Story: React.ComponentType) => (
  <div className="h-screen w-full">
    <Story />
  </div>
);
const AppLayoutDecorator = (Story: React.ComponentType) => <Story />;
const DemoComponent = () => (
  <div className="mt-4 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
    Demo app-shell content placeholder.
  </div>
);

// --- Panel Type Definitions & Components ---

// panelType is injected by provider, make it optional here
interface BasePanelProps {
  panelType?: string;
}

// --- Detail Panel ---
// Accept panelType, NO action props
interface DetailPanelProps extends BasePanelProps {
  panelId: string; // User-defined serializable prop
}
const DetailPanelComponent: React.FC<DetailPanelProps> = ({ panelId, panelType }) => {
  // Use context hook for actions
  const { removePanel, activateStackedPanel } = useAppPanels();
  const typeToUse = panelType ?? 'unknown'; // Fallback if somehow not passed
  return (
    <>
      <div className="flex items-center justify-between p-2 border-b border-border shrink-0">
        <span className="text-xs text-muted-foreground">panelInfo</span>
        {/* Linter error on Button might persist - requires separate investigation */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removePanel(typeToUse)}
          aria-label="Close panel"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
        </Button>
      </div>
      <Card className="h-full flex flex-col border-l rounded-none">
        <CardHeader>
          <CardTitle className="text-lg">Detail: {panelId}</CardTitle>
        </CardHeader>
        <CardContent className="grow overflow-auto">
          <p className="mb-1 text-sm">Content area for panel type '{typeToUse}'.</p>
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          {/* Use panelType with actions from context */}
          <Button
            onClick={() => activateStackedPanel(typeToUse)}
            variant="outline"
            size="sm"
            className="grow"
          >
            Activate Self
          </Button>
          <Button
            onClick={() => removePanel(typeToUse)}
            variant="destructive"
            size="sm"
            className="grow"
          >
            Close
          </Button>
        </div>
      </Card>
    </>
  );
};

// --- User Settings Panel ---
// Accept panelType, NO action props
interface UserSettingsPanelProps extends BasePanelProps {
  userId: string; // Serializable prop
  initialAdminFlag?: boolean; // Serializable prop
}
const UserSettingsPanel: React.FC<UserSettingsPanelProps> = ({
  userId,
  initialAdminFlag = false,
  panelType,
}) => {
  // Use context hook for actions
  const { removePanel, activateStackedPanel } = useAppPanels();
  const [isAdmin, setIsAdmin] = useState(initialAdminFlag);
  const typeToUse = panelType ?? 'unknown';
  return (
    <Card className="h-full flex flex-col border-l rounded-none">
      <CardHeader>
        <CardTitle className="text-lg">User Settings: {userId}</CardTitle>
      </CardHeader>
      <CardContent className="grow overflow-auto">
        <p className="mb-4 text-sm">Configure settings for user ID: {userId}.</p>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`admin-${typeToUse}-${userId}`}
            checked={isAdmin}
            onCheckedChange={checked => setIsAdmin(!!checked)}
          />
          <Label htmlFor={`admin-${typeToUse}-${userId}`}>Is Admin</Label>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Panel Type: {typeToUse}</p>
      </CardContent>
      <div className="p-4 border-t flex gap-2">
        {/* Use panelType with actions from context */}
        <Button
          onClick={() => activateStackedPanel(typeToUse)}
          variant="outline"
          size="sm"
          className="grow"
        >
          Activate Self
        </Button>
        <Button
          onClick={() => removePanel(typeToUse)}
          variant="destructive"
          size="sm"
          className="grow"
        >
          Close
        </Button>
      </div>
    </Card>
  );
};

// --- Notification Panel ---
// Accept panelType, NO action props
interface NotificationListPanelProps extends BasePanelProps {}
const NotificationListPanel: React.FC<NotificationListPanelProps> = ({ panelType }) => {
  // Use context hook for actions
  const { removePanel, activateStackedPanel } = useAppPanels();
  const notifications = [
    { id: 1, text: 'New comment on your post' },
    { id: 2, text: 'User X started following you' },
    { id: 3, text: 'Your subscription is ending soon' },
  ];
  const typeToUse = panelType ?? 'unknown';
  return (
    <Card className="h-full flex flex-col border-l rounded-none">
      <CardHeader>
        <CardTitle className="text-lg">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="grow overflow-auto text-sm">
        <ul className="space-y-2">
          {notifications.map(n => (
            <li key={n.id} className="border-b pb-1">
              {n.text}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-4">Panel Type: {typeToUse}</p>
      </CardContent>
      <div className="p-4 border-t flex gap-2">
        {/* Use panelType with actions from context */}
        <Button
          onClick={() => activateStackedPanel(typeToUse)}
          variant="outline"
          size="sm"
          className="grow"
        >
          Activate Self
        </Button>
        <Button
          onClick={() => removePanel(typeToUse)}
          variant="destructive"
          size="sm"
          className="grow"
        >
          Close
        </Button>
      </div>
    </Card>
  );
};

// --- Registry ---
const panelRegistry = {
  detail: DetailPanelComponent,
  userSettings: UserSettingsPanel,
  notifications: NotificationListPanel,
};

// Infer the Registry type for use in the context hook
type PanelRegistryType = typeof panelRegistry;

// --- Custom Hook for Typed Context Access ---
/**
 * Custom hook to consume the Detail Panels context with the specific
 * PanelRegistryType for this application/story setup, providing type safety
 * for openPanel without needing to specify the generic each time.
 */
function useAppPanels(): PanelsContextType<PanelRegistryType> {
  // Call the generic context hook, providing the specific registry type
  return usePanelsContext<PanelRegistryType>();
}

// --- Simplified Main Content ---
// No longer receives config props, remove Configurator
const MainContent: React.FC = () => {
  const {
    openPanel,
    calculatedPanels,
    activePanelType,
    containerWidth,
    // Get config values directly from context for display/logic
    maxPanels,
    panelWidth,
    maxVisiblePanels,
    mainViewMinWidth,
    breakpoint,
    stackedPanelWidth,
  } = useAppPanels();

  // Default maxPanels if not provided by context (though Layout should provide it)
  const currentMaxPanels = typeof maxPanels === 'number' ? maxPanels : 5;

  const [nextIdNum, setNextIdNum] = useState(1);
  const [customId, setCustomId] = useState('');
  const [userId, setUserId] = useState('user123');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAddDetailPanel = (idToAdd?: string) => {
    const panelId = idToAdd || `p${nextIdNum}`;
    if (!idToAdd) setNextIdNum(prev => prev + 1);
    openPanel('detail', { panelId });
  };

  const handleAddUserPanel = () => {
    if (!userId) return;
    openPanel('userSettings', { userId, initialAdminFlag: isAdmin });
  };

  const handleAddNotificationPanel = () => {
    openPanel('notifications');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Optional: Display context config for debugging */}
      <div className="p-1 px-2 border-b text-xs bg-background text-muted-foreground flex flex-wrap gap-x-3 shrink-0">
        <span>Context:</span>
        <span>PW: {panelWidth}</span>
        <span>MaxP: {maxPanels}</span>
        <span>MaxV: {maxVisiblePanels}</span>
        <span>MinW: {mainViewMinWidth}</span>
        <span>BP: {breakpoint}</span>
        <span>StackW: {stackedPanelWidth}</span>
        <span>CW: {containerWidth}px</span>
      </div>

      <div className="p-6 grow min-h-0 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>

        {/* Keep Panel Opening UI */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Open Detail Panel</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap items-end">
            <Button
              onClick={() => handleAddDetailPanel()}
              size="sm"
              disabled={calculatedPanels.length >= currentMaxPanels}
            >
              Add Detail Panel (p{nextIdNum})
            </Button>
            <div className="flex items-end gap-1">
              <Label htmlFor="custom-id" className="text-xs mb-1">
                Custom ID:
              </Label>
              <Input
                id="custom-id"
                type="text"
                value={customId}
                onChange={e => setCustomId(e.target.value)}
                placeholder="e.g., item-abc"
                className="h-8 text-sm w-28"
              />
              <Button
                onClick={() => handleAddDetailPanel(customId)}
                size="sm"
                variant="outline"
                disabled={!customId || calculatedPanels.length >= currentMaxPanels}
              >
                Add by ID
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Open User Settings Panel</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap items-end">
            <div className="flex items-end gap-1">
              <Label htmlFor="user-id" className="text-xs mb-1">
                User ID:
              </Label>
              <Input
                id="user-id"
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                className="h-8 text-sm w-28"
              />
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="is-admin"
                checked={isAdmin}
                onCheckedChange={checked => setIsAdmin(!!checked)}
              />
              <Label htmlFor="is-admin" className="text-sm">
                Is Admin
              </Label>
            </div>
            <Button
              onClick={handleAddUserPanel}
              size="sm"
              disabled={!userId || calculatedPanels.length >= currentMaxPanels}
            >
              Open Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Open Notification Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleAddNotificationPanel}
              size="sm"
              disabled={calculatedPanels.length >= currentMaxPanels}
            >
              Show Notifications
            </Button>
          </CardContent>
        </Card>

        <DemoComponent />

        <p className="text-xs text-muted-foreground">
          Open Panel Types: {calculatedPanels.map(p => p.id).join(', ') || 'None'}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Active Panel Type: {activePanelType || 'None'}
        </p>
      </div>
    </div>
  );
};

// --- Simplified Story Template Component ---
// Remove persistence and config props
interface StoryTemplateProps extends Args {
  // Add back specific config props needed ONLY for story variations
  maxVisiblePanels?: number;
  breakpoint?: UsePanelsArgs['breakpoint'];
}

const StoryTemplate: React.FC<StoryTemplateProps> = ({
  // Destructure only the needed props for story variations
  maxVisiblePanels,
  breakpoint,
}) => {
  // --- Render PanelsLayout ---
  return (
    <PanelsLayout
      panelTypes={panelRegistry}
      // PersistenceLayer is not passed (defaults to NoPersistence)
      // Pass specific layout props for story variations, otherwise rely on defaults
      maxVisiblePanels={maxVisiblePanels} // Pass prop for Stacking story
      breakpoint={breakpoint} // Pass prop for Overlay story
      // Other config props (panelWidth, maxPanels, etc.) use component defaults
      className="border rounded-lg shadow-sm h-full"
    >
      {/* MainContent is the direct child */}
      <MainContent />
    </PanelsLayout>
  );
};

// --- Storybook Meta ---
const meta: Meta<typeof StoryTemplate> = {
  title: 'sewdn/Panels',
  component: StoryTemplate,
  parameters: {
    layout: 'fullscreen',
    decorators: [FullViewportDecorator, AppLayoutDecorator],
    docs: {
      story: { inline: false, height: '80vh' },
      description: {
        component:
          'Demonstrates the `<PanelsLayout>` convenience component showing default, stacking, and overlay behaviors. Persistence and configuration controls are removed for simplicity.',
      },
    },
  },
  // Remove argTypes for persistence and most config props
  argTypes: {
    // Keep argTypes ONLY for props varied in stories (maxVisiblePanels, breakpoint)
    // These won't appear as controls unless explicitly added to a story's args.
    maxVisiblePanels: {
      control: undefined, // Use undefined instead of null
      table: { disable: true }, // Hide from table
    },
    breakpoint: {
      control: undefined, // Use undefined instead of null
      table: { disable: true }, // Hide from table
    },
  },
  // Remove default args, rely on component defaults or story-specific args
  args: {},
  decorators: [FullViewportDecorator, AppLayoutDecorator],
};

export default meta;

// --- Simplified Stories ---
type Story = StoryObj<typeof meta>;

// Story 1: Default Layout
export const DefaultLayout: Story = {
  name: '1. Default Layout',
  // No specific args needed, uses component defaults
  args: {},
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};

// Story 2: Mobile Layout
export const MobileLayout: Story = {
  name: '2. Mobile Layout',
  // No specific args needed, uses component defaults and responsive behavior
  args: {},
  parameters: {
    // Set the initial viewport for this story using parameters.viewport.defaultViewport
    viewport: { defaultViewport: 'mobile2' },
    docs: {
      description: {
        story:
          'Demonstrates the default layout responsiveness on a small mobile viewport (using `parameters.viewport.defaultViewport`). Panels should switch to overlay mode based on the container width.',
      },
    },
  },
};
