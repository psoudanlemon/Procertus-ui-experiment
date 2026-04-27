// Core components
export * from './AppShell';
// export * from './main-content'; // Removed temporarily - file doesn't exist

// Providers
export * from './AppProvider';
// export * from './toast-provider'; // Removed temporarily - file doesn't exist
export * from './providers/dialog-provider';
export * from './providers/alert-provider';
export * from './providers/confirm-provider';

// New layout component
export * from './AppLayout'; // Add export for the new layout component

// Export Snackbar hook
export { useSnackbar } from '../Snackbar/SnackbarProvider';
