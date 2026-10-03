import type { Question } from "./types";

/**
 * K53 question bank (starter set). Written from scratch to teach the same
 * concepts as the official K53 / SARTSM syllabus — no verbatim manual text.
 * Structured for expansion to 1000+; the seed script (prisma/seed.ts) and
 * admin panel append to this same shape. `codes` marks which vehicle codes
 * a question applies to (1 = motorcycle, 2 = light, 3 = heavy).
 */
export const QUESTIONS: Question[] = [
  // ── Rules of the Road ────────────────────────────────────────────────
  {
    id: "ror-001",
    category: "Rules of the Road",
    type: "mcq",
    codes: ["1", "2", "3"],
    prompt: "At a four-way stop, who has the right of way?",
    options: [
      "The largest vehicle",
      "The vehicle that stopped first",
      "The vehicle on the main road",
      "Whoever arrives fastest",
    ],
    answer: 1,
    explanation:
      "At a four-way stop, the vehicle that comes to a complete stop first proceeds first. If two stop together, the one on the left yields to the one on the right.",
    reference: "K53 Rules of the Road — Intersections",
    difficulty: "Easy",
  },
  {
    id: "ror-002",
    category: "Rules of the Road",
    type: "truefalse",
    codes: ["1", "2", "3"],
    prompt: "You may cross a solid white line to overtake if the road ahead is clear.",
    options: ["True", "False"],
    answer: 1,
    explanation:
      "A solid white centre line means no overtaking or crossing. You may only overtake where a broken line is on your side of the road.",
    reference: "K53 Road Markings — Centre lines",
    difficulty: "Easy",
  },
  {
    id: "ror-003",
    category: "Rules of the Road",
    type: "mcq",
    codes: ["2", "3"],
    prompt: "What is the general speed limit on a public road in an urban area unless otherwise shown?",
    options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
    answer: 1,
    explanation:
      "In urban areas the default limit is 60 km/h. Rural public roads default to 100 km/h and freeways to 120 km/h, unless signs say otherwise.",
    reference: "National Road Traffic Act — General speed limits",
    difficulty: "Easy",
  },
  {
    id: "ror-004",
    category: "Rules of the Road",
    type: "scenario",
    codes: ["1", "2", "3"],
    prompt:
      "You approach a pedestrian crossing and someone has already stepped onto it. What must you do?",
    options: [
      "Sound your hooter and continue",
      "Stop and allow them to cross",
      "Drive around them carefully",
      "Speed up to pass before they reach you",
    ],
    answer: 1,
    explanation:
      "Pedestrians on a crossing always have right of way. You must stop and let them finish crossing before proceeding.",
    reference: "K53 Rules of the Road — Pedestrian crossings",
    difficulty: "Easy",
  },
  {
    id: "ror-005",
    category: "Rules of the Road",
    type: "mcq",
    codes: ["1", "2", "3"],
    prompt: "The legal blood alcohol limit for an ordinary driver in South Africa is:",
    options: [
      "Less than 0.05 g per 100 ml",
      "Less than 0.10 g per 100 ml",
      "Less than 0.24 g per 100 ml",
      "There is no limit",
    ],
    answer: 0,
    explanation:
      "The limit is below 0.05 g per 100 ml of blood (0.24 mg per 1000 ml of breath). For professional drivers it is stricter, below 0.02 g.",
    reference: "National Road Traffic Act — Driving under the influence",
    difficulty: "Medium",
  },
  {
    id: "ror-006",
    category: "Rules of the Road",
    type: "mcq",
    codes: ["1", "2", "3"],
    prompt: "When may you use the emergency (hard) shoulder of a freeway?",
    options: [
      "To overtake slow traffic",
      "Only in a genuine emergency or breakdown",
      "Whenever the road is busy",
      "To let faster cars pass you",
    ],
    answer: 1,
    explanation:
      "The yellow-line shoulder is for emergencies and breakdowns only. Driving on it to overtake or beat traffic is illegal and dangerous.",
    reference: "K53 Rules of the Road — Freeways",
    difficulty: "Medium",
  },
  {
    id: "ror-007",
    category: "Rules of the Road",
    type: "scenario",
    codes: ["1", "2", "3"],
    prompt:
      "An emergency vehicle approaches from behind with lights and siren on. What is the correct action?",
    options: [
      "Stop immediately where you are",
      "Speed up to get out of the area",
      "Move safely to the left and allow it to pass",
      "Follow closely behind it through traffic",
    ],
    answer: 2,
    explanation:
      "Pull over safely to the left when it is clear to do so and give way. Never brake hard in the lane or follow the emergency vehicle through gaps.",
    reference: "K53 Rules of the Road — Emergency vehicles",
    difficulty: "Easy",
  },
  {
    id: "ror-008",
    category: "Rules of the Road",
    type: "mcq",
    codes: ["3"],
    prompt:
      "A heavy goods vehicle must not exceed which speed on a freeway (unless a lower limit is posted)?",
    options: ["80 km/h", "100 km/h", "120 km/h", "There is no limit for trucks"],
    answer: 0,
    explanation:
      "Goods vehicles over 9 000 kg GVM are limited to 80 km/h, and buses to 100 km/h, regardless of the general 120 km/h freeway limit.",
    reference: "National Road Traffic Regulations — Speed for heavy vehicles",
    difficulty: "Hard",
  },
  {
    id: "ror-009",
    category: "Rules of the Road",
    type: "truefalse",
    codes: ["1", "2", "3"],
    prompt: "Following distance should increase in wet or foggy conditions.",
    options: ["True", "False"],
    answer: 0,
    explanation:
      "Braking distance grows on wet roads and visibility drops in fog, so a larger following gap (at least three to four seconds) is essential.",
    reference: "K53 Defensive Driving — Following distance",
    difficulty: "Easy",
  },
  {
    id: "ror-010",
    category: "Rules of the Road",
    type: "mcq",
    codes: ["1", "2", "3"],
    prompt: "What does the two-second rule help you judge?",
    options: [
      "How fast you can accelerate",
      "A safe following distance from the car ahead",
      "How long to indicate before turning",
      "The time you may park in a loading zone",
    ],
    answer: 1,
    explanation:
      "Pick a fixed point; when the car ahead passes it, you should reach it no sooner than two seconds later. Increase to four seconds in poor conditions.",
    reference: "K53 Defensive Driving — Following distance",
    difficulty: "Easy",
  },

  // ── Road Signs & Markings ────────────────────────────────────────────
  {
    id: "sign-001",
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "What must you do at this sign?",
    signId: "stop",
    options: [
      "Slow down and proceed if clear",
      "Stop completely, then go when safe",
      "Yield to traffic on your left only",
      "Stop only if a vehicle is coming",
    ],
    answer: 1,
    explanation:
      "A stop sign requires a complete stop at the line every time — even if the road looks empty — before proceeding when safe.",
    reference: "SARTSM — Regulatory sign R1",
    difficulty: "Easy",
  },
  {
    id: "sign-002",
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "This sign means:",
    signId: "yield",
    options: [
      "Stop completely",
      "Give right of way to other traffic",
      "No entry",
      "Road narrows ahead",
    ],
    answer: 1,
    explanation:
      "A yield sign means give way to traffic on the road you are entering or crossing; stop only if necessary to do so safely.",
    reference: "SARTSM — Regulatory sign R2",
    difficulty: "Easy",
  },
  {
    id: "sign-003",
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "What does this sign warn of?",
    signId: "pedestrian-crossing-ahead",
    options: [
      "Children playing",
      "Pedestrian crossing ahead",
      "Bus stop ahead",
      "No pedestrians allowed",
    ],
    answer: 1,
    explanation:
      "A red-bordered warning triangle showing a person on zebra stripes warns that a pedestrian crossing lies ahead — be ready to stop.",
    reference: "SARTSM — Warning sign W306",
    difficulty: "Easy",
  },
  {
    id: "sign-004",
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "Identify this sign:",
    signId: "no-entry",
    options: ["No overtaking", "No entry", "No stopping", "One way"],
    answer: 1,
    explanation:
      "A red circle with a white horizontal bar means no entry — vehicles may not proceed past the sign.",
    reference: "SARTSM — Regulatory sign R3",
    difficulty: "Easy",
  },
  {
    id: "sign-005",
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "What is the meaning of this sign?",
    signId: "no-stopping",
    options: ["No parking", "No stopping", "No U-turn", "Clearway ends"],
    answer: 1,
    explanation:
      "A red ring with a crossed-out letter S means no stopping — you may not stop here, not even briefly, except to avoid a collision or obey a traffic signal. A crossed-out P (R216) means no parking.",
    reference: "SARTSM — Regulatory sign R217",
    difficulty: "Medium",
  },
  {
    id: "sign-006",
    category: "Road Signs & Markings",
    type: "mcq",
    codes: ["1", "2", "3"],
    prompt: "A triangular sign with a red border in South Africa is generally a:",
    options: [
      "Command sign",
      "Warning sign",
      "Information sign",
      "Prohibition sign",
    ],
    answer: 1,
    explanation:
      "Triangular signs with a red border warn of a hazard ahead. Blue discs give commands, red rings prohibit or limit, and rectangular signs give information or guidance.",
    reference: "SARTSM — Sign categories",
    difficulty: "Easy",
  },
  {
    id: "sign-007",
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "This sign tells you to:",
    signId: "keep-left",
    options: ["Keep left", "Turn left only", "No left turn", "Left lane closed"],
    answer: 0,
    explanation:
      "A blue disc with a white arrow is a command sign. Pointing down to the left, it instructs you to keep left of the island or obstruction.",
    reference: "SARTSM — Regulatory sign R103",
    difficulty: "Easy",
  },
  {
    id: "sign-008",
    category: "Road Signs & Markings",
    type: "mcq",
    codes: ["1", "2", "3"],
    prompt: "A broken white line down the centre of the road means:",
    options: [
      "No overtaking at all",
      "You may cross to overtake when it is safe",
      "The road is one-way",
      "Emergency lane only",
    ],
    answer: 1,
    explanation:
      "A broken centre line may be crossed to overtake when the way ahead is clear. A solid line on your side means you may not cross it.",
    reference: "SARTSM — Road markings",
    difficulty: "Easy",
  },
  {
    id: "sign-009",
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "What does this warning sign mean?",
    signId: "slippery-road",
    options: [
      "Slippery road ahead",
      "Loose stones ahead",
      "Steep descent",
      "Uneven road",
    ],
    answer: 0,
    explanation:
      "The skidding vehicle symbol warns that the road ahead may be slippery. Reduce speed and avoid sudden braking or steering.",
    reference: "SARTSM — Warning sign W333",
    difficulty: "Medium",
  },
  {
    id: "sign-010",
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "What does this yellow sign warn you about?",
    signId: "roadworks",
    options: [
      "A permanent hazard",
      "Temporary roadworks ahead",
      "A scenic route",
      "A weighbridge",
    ],
    answer: 1,
    explanation:
      "Signs with a yellow background are temporary. This one shows a worker with a spade: roadworks ahead. Slow down and obey flag operators and temporary limits.",
    reference: "SARTSM — Temporary sign TW336",
    difficulty: "Medium",
  },

  // ── Vehicle Controls ─────────────────────────────────────────────────
  {
    id: "veh-001",
    category: "Vehicle Controls",
    type: "mcq",
    codes: ["2", "3"],
    prompt: "What does the red temperature warning light indicate?",
    options: [
      "The engine is too cold",
      "The engine is overheating",
      "Low fuel",
      "The handbrake is on",
    ],
    answer: 1,
    explanation:
      "A red temperature light means the engine is overheating. Stop safely, switch off and let it cool before checking coolant.",
    reference: "K53 Vehicle Controls — Instruments",
    difficulty: "Easy",
  },
  {
    id: "veh-002",
    category: "Vehicle Controls",
    type: "truefalse",
    codes: ["2", "3"],
    prompt: "You should keep your foot resting on the clutch pedal while driving.",
    options: ["True", "False"],
    answer: 1,
    explanation:
      "Resting your foot on the clutch ('riding the clutch') causes premature wear. Keep it off the pedal except when changing gear or pulling away.",
    reference: "K53 Vehicle Controls — Clutch use",
    difficulty: "Easy",
  },
  {
    id: "veh-003",
    category: "Vehicle Controls",
    type: "mcq",
    codes: ["1"],
    prompt: "On a motorcycle, the front brake is normally operated by:",
    options: [
      "The left hand lever",
      "The right hand lever",
      "The left foot pedal",
      "The right foot pedal",
    ],
    answer: 1,
    explanation:
      "The right-hand lever controls the front brake; the right foot pedal controls the rear brake. Smooth combined braking is safest.",
    reference: "K53 Motorcycle Controls",
    difficulty: "Medium",
  },
  {
    id: "veh-004",
    category: "Vehicle Controls",
    type: "mcq",
    codes: ["3"],
    prompt: "In an air-brake vehicle, a drop in system air pressure should make you:",
    options: [
      "Drive faster to your destination",
      "Stop safely as soon as possible and investigate",
      "Ignore it if the brakes still work",
      "Pump the brake pedal repeatedly",
    ],
    answer: 1,
    explanation:
      "Low air pressure can lead to brake failure. Stop safely as soon as you can, and do not continue until the fault is resolved.",
    reference: "K53 Heavy Vehicle — Air brake systems",
    difficulty: "Hard",
  },
  {
    id: "veh-005",
    category: "Vehicle Controls",
    type: "mcq",
    codes: ["1", "2", "3"],
    prompt: "Before moving off, the correct final check is to:",
    options: [
      "Only look in the rear-view mirror",
      "Check mirrors, signal, then check your blind spot",
      "Just check your blind spot",
      "Sound the hooter",
    ],
    answer: 1,
    explanation:
      "The K53 sequence is mirrors, signal, then a blind-spot check over your shoulder before moving. Observation before action, every time.",
    reference: "K53 System — Observe, Signal, Manoeuvre",
    difficulty: "Easy",
  },
  {
    id: "veh-006",
    category: "Vehicle Controls",
    type: "truefalse",
    codes: ["2", "3"],
    prompt: "When parking facing uphill with a kerb, turn the front wheels away from the kerb.",
    options: ["True", "False"],
    answer: 0,
    explanation:
      "Facing uphill, turn wheels away from the kerb so that if the car rolls back, the rear of the front wheel catches the kerb. Downhill, turn towards the kerb.",
    reference: "K53 Vehicle Controls — Parking on a gradient",
    difficulty: "Medium",
  },
  {
    id: "veh-007",
    category: "Vehicle Controls",
    type: "scenario",
    codes: ["1", "2", "3"],
    prompt:
      "Your vehicle starts to skid on a wet road. The safest first response is to:",
    options: [
      "Brake hard immediately",
      "Ease off the accelerator and steer gently in the direction you want to go",
      "Turn the wheel sharply the other way",
      "Pull the handbrake",
    ],
    answer: 1,
    explanation:
      "Harsh braking worsens a skid. Ease off the accelerator, avoid sudden inputs, and steer smoothly where you want the vehicle to go.",
    reference: "K53 Emergency Situations — Skid control",
    difficulty: "Hard",
  },
  {
    id: "veh-008",
    category: "Vehicle Controls",
    type: "mcq",
    codes: ["1"],
    prompt: "The correct way to slow a motorcycle in normal conditions is to:",
    options: [
      "Use the rear brake only",
      "Use the front brake only",
      "Apply both brakes smoothly together",
      "Change down and coast without braking",
    ],
    answer: 2,
    explanation:
      "Most braking power is at the front, but using both brakes smoothly together gives the shortest, most stable stop.",
    reference: "K53 Motorcycle — Braking technique",
    difficulty: "Medium",
  },
  {
    id: "veh-009",
    category: "Vehicle Controls",
    type: "mcq",
    codes: ["3"],
    prompt: "Poor load distribution on a heavy vehicle mainly increases the risk of:",
    options: [
      "Better fuel economy",
      "Rollover and loss of control",
      "Cleaner exhaust",
      "Faster acceleration",
    ],
    answer: 1,
    explanation:
      "An uneven or top-heavy load raises the centre of gravity and shifts weight, greatly increasing rollover risk, especially in bends.",
    reference: "K53 Heavy Vehicle — Load distribution",
    difficulty: "Hard",
  },
  {
    id: "veh-010",
    category: "Vehicle Controls",
    type: "truefalse",
    codes: ["1", "2", "3"],
    prompt: "A pre-trip inspection includes checking tyres, lights, brakes, oil and water.",
    options: ["True", "False"],
    answer: 0,
    explanation:
      "A proper pre-trip check covers tyres and pressure, all lights, brakes, steering, mirrors, fluid levels and any warning lights before you drive.",
    reference: "K53 Pre-trip Inspection",
    difficulty: "Easy",
  },
];

export function questionsByCategory(cat: Question["category"]): Question[] {
  return QUESTIONS.filter((q) => q.category === cat);
}

export function questionsForCode(code: "1" | "2" | "3"): Question[] {
  return QUESTIONS.filter((q) => q.codes.includes(code));
}

export function questionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
