# CoverView Component - AI Usage Guide

## Purpose

Use the `CoverView` component to create layouts with a prominent header section (often with a background image or distinct color) that collapses as the user scrolls down the main content area. It's ideal for profile pages, detail views, or landing sections.

## Key Props for AI

- **`title` (string, required):** The main text title displayed prominently in the header.
- **`children` (React.ReactNode, required):** The main content of the page that will scroll beneath the collapsing header.
- **`primaryAction` (React.ReactNode, optional):** An element, typically an `<IconButton>`, placed at the top-left of the header.
- **`secondaryAction` (React.ReactNode, optional):** An element or elements, typically `<IconButton>`, placed at the top-right of the header.
- **`cover` (string, optional):** URL for a background image for the header section. Causes text and action colors to adapt.
- **`colorScheme` ('background' | 'primary' | 'secondary' | 'accent' | 'card' | 'transparent', optional):** Sets the background and foreground color scheme for the header area (when no `cover` image is used). Affects default text/icon colors. Defaults to `'background'`.
- **`stickyContent` (React.ReactNode, optional):** Content (like tabs or alerts) that should remain visible just below the header when it's collapsed.
- **`loading` (boolean, optional):** Set to `true` to display a progress bar indicator.
- **`scrollable` (boolean, optional):** When `true` (default), `children` are wrapped in a `ScrollArea`. Set to `false` for fill-height layouts where a nested component owns scrolling (see **Fill-height / docked content** below).

## Usage Pattern

```tsx
import { CoverView } from '@workspace/ui-lib/components/CoverView';
import { IconButton } from '@workspace/ui-lib/components/IconButton';
import { ArrowLeft, MoreVertical } from 'lucide-react';

// ...

<CoverView
  title="Page Title Here"
  primaryAction={
    <IconButton
      icon={ArrowLeft}
      aria-label="Back"
      // Add invertColors={true} if cover or dark colorScheme is used
      invertColors={true} // Example: Assume dark context
    />
  }
  secondaryAction={
    <IconButton
      icon={MoreVertical}
      aria-label="More Options"
      // Add invertColors={true} if cover or dark colorScheme is used
      invertColors={true} // Example: Assume dark context
    />
  }
  // cover="url/to/image.jpg" // Optional cover image
  // colorScheme="primary" // Optional color scheme
  // stickyContent={<YourStickyComponent />} // Optional sticky content
>
  {/* Main scrollable content goes here */}
  <div>
    <p>Page content starts here...</p>
  </div>
</CoverView>;
```

## Important Considerations for AI

1.  **Actions:** Use the `IconButton` component for `primaryAction` and `secondaryAction`.
2.  **Inverted Colors:** Set `invertColors={true}` on the `IconButton`s used in `primaryAction` and `secondaryAction` **if** you are using a `cover` image OR if the `colorScheme` is set to `'primary'` or another dark scheme. This ensures the icons are visible against the darker background. For `'background'`, `'card'`, or `'transparent'` color schemes without a cover image, `invertColors` is usually not needed (`false`).
3.  **Content Placement:** Place the main page content directly as `children`. Place secondary header information or controls in the `header` prop. Place elements that should stick below the collapsed header (like tabs) in the `stickyContent` prop.
4.  **Scrolling:** The `children` content is automatically wrapped in a `ScrollArea` by default (`scrollable={true}`).

## Fill-height / docked content (inner scroll)

When the main region should **stretch to the space below the cover header** and **only a nested component** (for example a chat message list) should scroll:

1. Set **`scrollable={false}`** on `CoverView` so the outer layout does not wrap children in `ScrollArea`.
2. In non-scrollable mode, the content slot is a **`flex flex-1 min-h-0 flex-col overflow-hidden`** region below the header spacer — design your `children` as a **column flex chain** (`flex min-h-0 flex-1 flex-col` on wrappers) down to the element that should scroll (`min-h-0 flex-1 overflow-y-auto` or a component like `ChatList` that already uses that pattern).
3. Keep **`className="h-full"`** on `CoverView` when it sits inside a flex parent (e.g. a slide-over panel) so `flex-1` + `min-h-0` heights resolve correctly.
