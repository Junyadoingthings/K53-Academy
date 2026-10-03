import {
  Award,
  BadgeCheck,
  Bike,
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  Car,
  Circle,
  CircleUser,
  ClipboardCheck,
  Crown,
  Flame,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Minus,
  Moon,
  OctagonAlert,
  Power,
  Route,
  ShieldCheck,
  Siren,
  SquareParking,
  Target,
  TriangleAlert,
  Trophy,
  Truck,
  Wine,
  type LucideIcon,
} from "lucide-react";

/**
 * Named icons referenced from data files (rooms, paths, badges, nav).
 * Importing them explicitly keeps the rest of lucide out of the bundle.
 */
const ICONS: Record<string, LucideIcon> = {
  Award,
  BadgeCheck,
  Bike,
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  Car,
  CircleUser,
  ClipboardCheck,
  Crown,
  Flame,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Minus,
  Moon,
  OctagonAlert,
  ParkingSquare: SquareParking,
  Power,
  Route,
  ShieldCheck,
  Siren,
  Target,
  TriangleAlert,
  Trophy,
  Truck,
  Wine,
};

export function iconFor(name: string, fallback: LucideIcon = Circle): LucideIcon {
  return ICONS[name] ?? fallback;
}
