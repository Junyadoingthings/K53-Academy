/** Decorative backdrops. The page grid was retired for a calmer look. */

export function GridBackdrop() {
  return null;
}

export function RoadLine({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative h-1 w-full overflow-hidden rounded-full bg-navy-700 ${className}`}>
      <div className="road-line absolute inset-0 opacity-90" />
    </div>
  );
}
