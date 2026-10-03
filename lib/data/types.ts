import type { VehicleCode } from "../store";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type QCategory = "Rules of the Road" | "Road Signs & Markings" | "Vehicle Controls";
export type QType = "mcq" | "truefalse" | "image" | "scenario";

export interface Question {
  id: string;
  category: QCategory;
  type: QType;
  codes: VehicleCode[]; // which vehicle codes this applies to
  prompt: string;
  /** For image questions, the sign id to render (see lib/data/signs.ts). */
  signId?: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
  reference: string; // e.g. "K53 Rules of the Road §4.2"
  difficulty: Difficulty;
}

export interface Room {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: QCategory | "Practical";
  codes: VehicleCode[];
  difficulty: Difficulty;
  estMinutes: number;
  xp: number;
  icon: string; // lucide icon name
  prerequisites: string[]; // room ids
  intro: string;
  /** Learning material — rendered as sections. */
  sections: { heading: string; body: string; tip?: string }[];
  questionIds: string[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  codes: VehicleCode[];
  accent: "cyan" | "amber" | "grass" | "signal";
  icon: string;
  roomIds: string[];
  tags: string[];
}

export type SignCategory =
  | "Regulatory"
  | "Warning"
  | "Guidance"
  | "Information"
  | "Temporary";

export type SignSymbol =
  | { kind: "text"; value: string; scale?: number }
  | { kind: "arrow"; rotate?: number }
  | { kind: "bar" } // diagonal or horizontal prohibition bar
  | { kind: "ring" } // just the ring (e.g. no stopping uses X)
  | { kind: "cross" }
  | { kind: "pedestrian" }
  | { kind: "bend"; mirror?: boolean }
  | { kind: "children" }
  | { kind: "robot" } // traffic light ahead
  | { kind: "hump" }
  | { kind: "slippery" }
  | { kind: "roundabout" }
  | { kind: "digger" } // roadworks
  | { kind: "overtake" } // two cars (no-overtaking)
  | { kind: "none" };

export interface RoadSign {
  id: string;
  code: string; // SARTSM-style code, e.g. "R1" / "W301"
  name: string;
  category: SignCategory;
  meaning: string;
  shape: "circle" | "triangle" | "octagon" | "rectangle" | "diamond" | "pentagon";
  /** Rendering spec for the programmatic SVG. */
  fill: string;
  stroke: string;
  symbol: SignSymbol;
  symbolColor?: string;
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  accent: "cyan" | "amber" | "grass" | "signal";
  /** Human hint on how it's earned (evaluated in lib/achievements.ts). */
  criteria: string;
}
