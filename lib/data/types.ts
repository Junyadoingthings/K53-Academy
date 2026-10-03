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
  | "Information"
  | "Temporary";

/** SADC-RTSM sub-class, e.g. "Control", "Prohibition", "Curves". */
export type SignGroup = string;

export interface RoadSign {
  id: string;
  /** Official SADC-RTSM / SARTSM sign number, e.g. "R1", "W332". */
  code: string;
  name: string;
  category: SignCategory;
  group: SignGroup;
  /** What the sign means, in plain language. */
  meaning: string;
  /** What a driver should actually do — the bit examiners care about. */
  action?: string;
  /** Artwork file in /public/signs (defaults to `${code}.svg`). */
  image?: string;
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
