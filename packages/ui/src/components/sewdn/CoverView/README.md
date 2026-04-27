# CoverView Component

A versatile layout component that creates a cover or hero section effect with a collapsing header. As the user scrolls down, the header section (which can contain a title, background image, and actions) collapses into a fixed app bar (on mobile) or shrinks, while the content scrolls underneath.

## Features

- **Collapsing Header:** Smoothly transitions header content based on scroll position.
- **Cover Image:** Supports an optional background image with a scrim overlay.
- **Actions:** Supports primary (top-left) and secondary (top-right) action buttons that reposition during collapse.
- **Color Schemes:** Integrates with `Toolbar` color schemes for consistent theming.
- **Sticky Content:** Allows content (like alerts or tabs) to stick below the collapsed header.
- **Loading State:** Displays a progress indicator.
- **Responsive:** Adapts behavior for mobile (fixed app bar) and desktop.
- **Fullscreen/Minimal Modes:** Options to start fully expanded or fully collapsed.

## Props

| Prop              | Type                                       | Default        | Description                                                                            |
| :---------------- | :----------------------------------------- | :------------- | :------------------------------------------------------------------------------------- |
| `title`           | `string`                                   |                | The main title displayed in the header.                                                |
| `children`        | `React.ReactNode`                          |                | Content to display below the header, within the scrollable area.                       |
| `primaryAction`   | `React.ReactNode`                          |                | Optional action node (e.g., `<IconButton>`) placed top-left.                           |
| `secondaryAction` | `React.ReactNode`                          |                | Optional action node(s) (e.g., `<IconButton>`) placed top-right.                       |
| `header`          | `React.ReactNode`                          |                | Optional content displayed below the title but above the main `children`.              |
| `cover`           | `string`                                   | `''`           | Optional URL for the cover background image.                                           |
| `colorScheme`     | `ToolbarColorScheme`                       | `'background'` | Sets the background/text color scheme for the header and fixed toolbar.                |
| `scrollable`      | `boolean`                                  | `true`         | Whether the main content area should be scrollable using `ScrollArea`.                 |
| `loading`         | `boolean`                                  | `false`        | If true, shows a progress indicator.                                                   |
| `loadingProgress` | `number`                                   |                | Optional progress value (0-100) for the loading indicator.                             |
| `stickyContent`   | `React.ReactNode`                          |                | Content to display sticky below the collapsed header area.                             |
| `coverMinimal`    | `boolean`                                  | `false`        | If true, starts the view in the minimal (collapsed) state and disables scroll effects. |
| `coverFullscreen` | `boolean`                                  | `false`        | If true, starts the view with the cover taking the full viewport height.               |
| `titleProps`      | `React.HTMLAttributes<HTMLHeadingElement>` |                | Additional props to pass directly to the `<h1>` title element.                         |
| `className`       | `string`                                   |                | Additional CSS classes to apply to the root `div` element.                             |
| `ref`             | `React.ForwardedRef<HTMLDivElement>`       |                | Forwarded ref to the root `div` element.                                               |

_(Refer to `CoverView.tsx` for the full `CoverViewProps` interface)_

## Usage

```tsx
import { CoverView } from '@workspace/ui-lib/components/CoverView';
import { IconButton } from '@workspace/ui-lib/components/IconButton';
import { CircleArrowLeft, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert';
import { Terminal } from 'lucide-react';

function MyPageComponent() {
  return (
    <CoverView
      title="My Page Title"
      cover="https://example.com/cover.jpg"
      primaryAction={<IconButton icon={CircleArrowLeft} aria-label="Back" invertColors />}
      secondaryAction={<IconButton icon={Settings} aria-label="Settings" invertColors />}
      header={<div>Optional Header Content Below Title</div>}
      stickyContent={
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>This alert sticks below the header.</AlertDescription>
        </Alert>
      }
    >
      {/* Scrollable page content goes here */}
      <p>Lorem ipsum dolor sit amet...</p>
      {/* ... more content ... */}
    </CoverView>
  );
}
```

## Implementation Details

- Uses `framer-motion` for smooth animations during the header collapse.
- Scroll calculations and motion value generation are handled by the `useCoverViewScroll` hook.
- Integrates with `ScrollArea` for the main content scrolling.
- Uses `Scrim` for the overlay on the cover image.
- Relies on `Toolbar` for the fixed app bar on mobile.
- Uses `Progress` for the loading indicator.
- Action buttons should typically be instances of the `IconButton` component, potentially with `invertColors={true}` depending on the `colorScheme` or `cover` image.

## Related Components

- [`IconButton`](../IconButton/README.md)
- [`Toolbar`](../Toolbar/README.md)
- [`Scrim`](../Scrim/README.md)
