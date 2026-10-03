/** Signature grid + animated road-line backdrops. */

export function GridBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 grid-backdrop opacity-70"
    />
  );
}

export function RoadLine({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative h-1 w-full overflow-hidden rounded-full bg-navy-700 ${className}`}>
      <div className="road-line absolute inset-0 animate-road-dash opacity-80" />
    </div>
  );
}
