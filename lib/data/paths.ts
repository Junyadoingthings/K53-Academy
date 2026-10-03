import type { LearningPath } from "./types";

/**
 * Learning Paths = guided journeys (TryHackMe "Paths"). Each strings
 * together rooms in a sensible teaching order for a specific goal.
 */
export const PATHS: LearningPath[] = [
  {
    id: "rookie",
    slug: "the-rookie-path",
    title: "The Rookie Path",
    subtitle: "Learner's Licence — full prep",
    description:
      "Everything you need to pass the learner's test: rules of the road, all four road-sign families, and vehicle controls. Start here if you're new to the road.",
    codes: ["1", "2", "3"],
    accent: "cyan",
    icon: "GraduationCap",
    roomIds: [
      "rules-basics",
      "signs-regulatory",
      "signs-warning",
      "road-markings",
      "controls-light",
    ],
    tags: ["Learner's", "Beginner", "Theory"],
  },
  {
    id: "code2",
    slug: "the-code-2-path",
    title: "The Code 2 Path",
    subtitle: "Light Motor Vehicle — driver's prep",
    description:
      "Full drivers preparation for cars and bakkies under 3 500 kg: defensive driving, controls, emergencies, pre-trip and the yard test.",
    codes: ["2"],
    accent: "grass",
    icon: "Car",
    roomIds: [
      "rules-basics",
      "defensive-driving",
      "controls-light",
      "emergencies",
      "pretrip",
      "yard-test",
    ],
    tags: ["Driver's", "Code 2", "Car"],
  },
  {
    id: "code1",
    slug: "the-code-1-path",
    title: "The Code 1 Path",
    subtitle: "Motorcycle — balance & yard test",
    description:
      "Motorcycle-specific prep: balance, slow riding, the emergency swerve, pre-trip and defensive riding for the Code 1 licence.",
    codes: ["1"],
    accent: "amber",
    icon: "Bike",
    roomIds: [
      "rules-basics",
      "controls-moto",
      "defensive-driving",
      "pretrip",
      "emergencies",
    ],
    tags: ["Driver's", "Code 1", "Motorcycle"],
  },
  {
    id: "heavy",
    slug: "the-heavy-hauler-path",
    title: "The Heavy Hauler Path",
    subtitle: "Code 3 — trucks & buses",
    description:
      "Heavy-vehicle mastery: air brakes, load distribution, articulated vehicles, pre-trip inspection and defensive driving for Code 3.",
    codes: ["3"],
    accent: "signal",
    icon: "Truck",
    roomIds: [
      "rules-basics",
      "heavy-airbrakes",
      "defensive-driving",
      "pretrip",
      "emergencies",
    ],
    tags: ["Driver's", "Code 3", "Heavy"],
  },
  {
    id: "yard-master",
    slug: "yard-test-master",
    title: "Yard Test Master",
    subtitle: "Parallel park · alley dock · incline start",
    description:
      "An interactive walkthrough of every yard manoeuvre with step-by-step observation checklists. Chase the 'Perfect Parker' badge.",
    codes: ["1", "2", "3"],
    accent: "cyan",
    icon: "ParkingSquare",
    roomIds: ["pretrip", "yard-test"],
    tags: ["Practical", "Yard", "Manoeuvres"],
  },
  {
    id: "road-ready",
    slug: "road-test-ready",
    title: "Road Test Ready",
    subtitle: "Observations · blind spots · K53 system",
    description:
      "The final polish before your road test: the K53 observe-signal-manoeuvre system, blind-spot discipline and handling emergencies.",
    codes: ["1", "2", "3"],
    accent: "grass",
    icon: "ShieldCheck",
    roomIds: ["defensive-driving", "emergencies", "alcohol-fatigue"],
    tags: ["Driver's", "Advanced", "Road"],
  },
];

export function pathBySlug(slug: string): LearningPath | undefined {
  return PATHS.find((p) => p.slug === slug);
}
