"use client";

import * as React from "react";

/**
 * Renders children only after mount. The persisted Zustand store reads
 * localStorage on the client, so gating store-driven UI here keeps SSR
 * and the first client render in agreement (no hydration mismatch).
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}
