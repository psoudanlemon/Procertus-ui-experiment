// Import the container component which is the public interface
import type React from 'react';
import { CoverView } from './CoverView';
import { IconButton } from '../IconButton'; // Use the new IconButton
import type { IconSvgElement } from '@hugeicons/core-free-icons';
import { ArrowLeft01Icon, Settings01Icon, TerminalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Example sticky content

const fn = () => () => undefined;
const icon =
  (source: IconSvgElement) =>
  ({ className }: { className?: string }) => (
    <HugeiconsIcon icon={source} className={className} />
  );
const withFullViewport = (Story: React.ComponentType) => (
  <div className="h-screen w-full">
    <Story />
  </div>
);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'sewdn/CoverView', // Adjusted title path
  component: CoverView,
  parameters: {
    layout: 'fullscreen',
  },
  // Add a decorator to enforce viewport height
  decorators: [withFullViewport],
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    className: { control: 'text' },
    cover: { control: 'text', description: 'URL for background image' },
    scrollable: { control: 'boolean' },
    colorScheme: {
      control: { type: 'select' },
      options: ['background', 'primary', 'secondary', 'accent', 'card', 'transparent'],
      description: 'Color scheme for the CoverView and Toolbar',
    },
    primaryAction: {
      control: { type: 'boolean' },
      mapping: {
        true: <IconButton icon={icon(ArrowLeft01Icon as IconSvgElement)} aria-label="Go Back" onClick={fn()} />,
        false: undefined,
      },
      description: 'Example primary action (top-left)',
    },
    secondaryAction: {
      control: { type: 'boolean' },
      mapping: {
        true: <IconButton icon={icon(Settings01Icon as IconSvgElement)} aria-label="Settings" onClick={fn()} />,
        false: undefined,
      },
      description: 'Example secondary action (top-right)',
    },
    header: {
      control: { type: 'text' },
      description: 'Example header content (text node)',
    },
    children: {
      control: { type: 'text' }, // Basic control for example content
      description: 'Content inside the scrollable area',
    },
    loading: { control: 'boolean' },
    coverMinimal: { control: 'boolean' },
    coverFullscreen: { control: 'boolean' },
    stickyContent: {
      control: { type: 'boolean' }, // Simple toggle for example sticky content
      mapping: {
        true: (
          <Alert className="rounded-none border-x-0 border-t-0">
            <HugeiconsIcon icon={TerminalIcon} className="h-4 w-4" />
            <AlertTitle>Sticky Alert!</AlertTitle>
            <AlertDescription>This content sticks below the collapsed header.</AlertDescription>
          </Alert>
        ),
        false: undefined,
      },
      description: 'Example sticky content (Alert)',
    },
    loadingProgress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      if: { arg: 'loading' }, // Only show if loading is true
      description: 'Progress value (0-100) if loading',
    },
  },
  args: {
    title: 'Default Title',
    children: `
      Scrollable Content Area...
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus lacinia odio vitae vestibulum vestibulum.
      Cras venenatis euismod malesuada.
      `.repeat(20), // Add more content to ensure scrolling
    scrollable: true,
    primaryAction: true, // Show primary action by default
    secondaryAction: true, // Show secondary action by default
    header: 'Optional Header Content',
    colorScheme: 'background', // Default scheme
    cover: '', // Default no cover
    loading: false,
    coverMinimal: false,
    coverFullscreen: false,
    stickyContent: false,
    loadingProgress: 50, // Default example progress
  },
} satisfies Meta<typeof CoverView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

/**
 * Default story showing the component with standard background.
 */
export const Default: Story = {
  args: {
    title: 'Default with Actions',
  },
};

/**
 * Story demonstrating the primary color scheme.
 */
export const PrimaryColorScheme: Story = {
  args: {
    title: 'Primary Color Scheme',
    colorScheme: 'primary',
    primaryAction: (
      <IconButton icon={icon(ArrowLeft01Icon as IconSvgElement)} aria-label="Go Back" onClick={fn()} invertColors={true} />
    ),
    secondaryAction: (
      <IconButton icon={icon(Settings01Icon as IconSvgElement)} aria-label="Settings" onClick={fn()} invertColors={true} />
    ),
  },
};

/**
 * Story demonstrating the secondary color scheme.
 */
export const SecondaryColorScheme: Story = {
  args: {
    title: 'Secondary Color Scheme',
    colorScheme: 'secondary',
  },
};

/**
 * Story demonstrating the accent color scheme.
 */
export const AccentColorScheme: Story = {
  args: {
    title: 'Accent Color Scheme',
    colorScheme: 'accent',
  },
};

/**
 * Story demonstrating the card color scheme.
 */
export const CardColorScheme: Story = {
  args: {
    title: 'Card Color Scheme',
    colorScheme: 'card',
  },
};

/**
 * Story demonstrating the transparent color scheme (content BG shows through).
 */
export const TransparentColorScheme: Story = {
  args: {
    title: 'Transparent Color Scheme',
    colorScheme: 'transparent',
    // Example: Set a background on a parent or child to see effect
    children: (
      <div className="rounded bg-muted p-4">
        Content on a muted background, visible because CoverView is transparent.
        <br />
        {`
          Scrollable Content Area...
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vivamus lacinia odio vitae vestibulum vestibulum.
          Cras venenatis euismod malesuada.
          `.repeat(20)}
      </div>
    ),
  },
};

/**
 * Story showing the component with a cover image.
 * Text color adjusts automatically for contrast.
 */
export const WithCover: Story = {
  args: {
    title: 'Cover Image Example',
    cover:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    primaryAction: (
      <IconButton icon={icon(ArrowLeft01Icon as IconSvgElement)} aria-label="Go Back" onClick={fn()} invertColors={true} />
    ),
    secondaryAction: (
      <IconButton icon={icon(Settings01Icon as IconSvgElement)} aria-label="Settings" onClick={fn()} invertColors={true} />
    ),
  },
};

/**
 * Story showing the component when not scrollable.
 */
export const NotScrollable: Story = {
  args: {
    title: 'Not Scrollable Example',
    scrollable: false,
    children: `This content area is not wrapped in a ScrollArea component. 
    If the content overflows, standard browser scroll might appear depending on parent styles.`, // Shorter content
  },
};

/**
 * Story demonstrating the loading state.
 */
export const Loading: Story = {
  args: {
    title: 'Loading State',
    loading: true,
    loadingProgress: 75, // Example progress value
  },
};

/**
 * Story demonstrating the minimal state (starts collapsed).
 */
export const Minimal: Story = {
  args: {
    title: 'Minimal State',
    coverMinimal: true,
    header: 'This header content should be hidden',
  },
};

/**
 * Story demonstrating the fullscreen state (starts full height).
 */
export const Fullscreen: Story = {
  args: {
    title: 'Fullscreen State',
    coverFullscreen: true,
  },
};

/**
 * Story demonstrating sticky content below the header.
 */
export const WithStickyContent: Story = {
  args: {
    title: 'With Sticky Content',
    stickyContent: true,
  },
};

/**
 * Story demonstrating the minimal state with sticky content.
 */
export const MinimalWithSticky: Story = {
  args: {
    title: 'Minimal with Sticky',
    coverMinimal: true,
    stickyContent: true,
    header: 'This header content should be hidden',
  },
};

/**
 * Story demonstrating the fullscreen state with sticky content.
 */
export const FullscreenWithSticky: Story = {
  args: {
    title: 'Fullscreen with Sticky',
    coverFullscreen: true,
    stickyContent: true,
  },
};

/**
 * Story demonstrating the fullscreen state with loading.
 */
export const FullscreenLoading: Story = {
  args: {
    title: 'Fullscreen Loading',
    coverFullscreen: true,
    loading: true,
    loadingProgress: 30, // Example progress value
  },
};

/**
 * Story demonstrating the minimal state with a cover image.
 */
export const MinimalWithCover: Story = {
  args: {
    title: 'Minimal with Cover',
    coverMinimal: true,
    cover:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    header: 'This header content should be hidden',
    primaryAction: (
      <IconButton icon={icon(ArrowLeft01Icon as IconSvgElement)} aria-label="Go Back" onClick={fn()} invertColors={true} />
    ),
    secondaryAction: (
      <IconButton icon={icon(Settings01Icon as IconSvgElement)} aria-label="Settings" onClick={fn()} invertColors={true} />
    ),
  },
};

/**
 * Story demonstrating multiple features combined.
 */
export const CombinedFeatures: Story = {
  args: {
    title: 'Combined: Fullscreen, Sticky, Loading, Cover',
    coverFullscreen: true,
    stickyContent: true,
    loading: true,
    loadingProgress: 90, // Example progress value
    cover:
      'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1800&q=80',
    primaryAction: (
      <IconButton icon={icon(ArrowLeft01Icon as IconSvgElement)} aria-label="Go Back" onClick={fn()} invertColors={true} />
    ),
    secondaryAction: (
      <IconButton icon={icon(Settings01Icon as IconSvgElement)} aria-label="Settings" onClick={fn()} invertColors={true} />
    ),
  },
};

/**
 * Story explicitly showing both primary and secondary actions.
 */
export const WithBothActions: Story = {
  args: {
    title: 'Both Actions Visible',
    primaryAction: true,
    secondaryAction: true,
    header: 'Header below both actions',
  },
};

/**
 * Story showing only the primary action.
 */
export const WithPrimaryActionOnly: Story = {
  args: {
    title: 'Primary Action Only',
    primaryAction: true,
    secondaryAction: false,
    header: 'Header below primary action',
  },
};

/**
 * Story showing only the secondary action.
 */
export const WithSecondaryActionOnly: Story = {
  args: {
    title: 'Secondary Action Only',
    primaryAction: false,
    secondaryAction: true,
    header: 'Header below secondary action',
  },
};

/**
 * Story showing no actions.
 */
export const WithoutActions: Story = {
  args: {
    title: 'No Actions',
    primaryAction: false,
    secondaryAction: false,
    header: 'Header with no actions above',
  },
};
