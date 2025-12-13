import { Loader } from './ui';

/**
 * Global loader component used for Suspense boundaries and other app-wide loading states.
 * Uses fixed positioning to ensure it's always visible in the viewport.
 */
export function GlobalLoader() {

  return (
    <Loader
      isLoading
      text="Loading..."
      minHeight="min-h-screen"
      variant="fixed"
    />
  );
}
