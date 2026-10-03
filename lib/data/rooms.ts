import type { Room } from "./types";

/**
 * Rooms = TryHackMe-style modules. Each has intro context, learning
 * sections, and a quiz built from linked question IDs. Content is original
 * teaching material based on the K53 / SARTSM syllabus framework.
 */
export const ROOMS: Room[] = [
  {
    id: "rules-basics",
    slug: "rules-of-the-road",
    title: "Rules of the Road",
    tagline: "Right of way, speed, following distance — the foundation of every test.",
    category: "Rules of the Road",
    codes: ["1", "2", "3"],
    difficulty: "Easy",
    estMinutes: 15,
    xp: 120,
    icon: "Route",
    prerequisites: [],
    intro:
      "Every K53 test — learner's or driver's — starts here. The rules of the road decide who goes first, how fast you may travel, and how much space keeps you alive. Get these into muscle memory and half the test is already won.",
    sections: [
      {
        heading: "Right of way at intersections",
        body: "At a four-way stop, first to stop is first to go. If two arrive together, the driver on the left yields to the driver on the right. At a yield sign you give way without necessarily stopping; at a stop sign you always stop completely, every time.",
        tip: "Think 'first come, first served — otherwise, right hand wins'.",
      },
      {
        heading: "Speed limits",
        body: "Unless a sign says otherwise: 60 km/h in urban areas, 100 km/h on rural public roads, and 120 km/h on freeways. Heavy goods vehicles and buses have lower limits. A posted sign always overrides the default.",
        tip: "Speed is the single biggest factor in crash severity — the limit is a maximum, not a target.",
      },
      {
        heading: "Following distance",
        body: "Use the two-second rule: when the vehicle ahead passes a fixed point, you should reach it no sooner than two seconds later. Double it to four seconds in rain, fog, or at night. Heavy vehicles need even more.",
        tip: "Tailgating gives you no time to react — space is safety.",
      },
    ],
    questionIds: ["ror-001", "ror-002", "ror-003", "ror-009", "ror-010"],
  },
  {
    id: "signs-regulatory",
    slug: "road-signs-regulatory",
    title: "Road Signs: Regulatory",
    tagline: "Stop, yield, speed, no-entry — the signs you must obey.",
    category: "Road Signs & Markings",
    codes: ["1", "2", "3"],
    difficulty: "Easy",
    estMinutes: 12,
    xp: 120,
    icon: "OctagonAlert",
    prerequisites: ["rules-basics"],
    intro:
      "Regulatory signs give orders. Ignore one and you break the law — and lose marks instantly. Learn to read them by shape and colour so you recognise them in a split second, even at speed.",
    sections: [
      {
        heading: "Shape tells you the type",
        body: "Octagon = stop. Inverted triangle = yield. Round signs either command or prohibit. A blue disc commands you to do something; a red ring with a diagonal slash forbids something; a red ring without a slash sets a limit you may not exceed, such as speed, mass or height.",
        tip: "Red = don't. Blue = do.",
      },
      {
        heading: "Speed and prohibition signs",
        body: "A red ring around a number is the speed limit. A red ring with a red diagonal slash across a symbol forbids that action — two cars slashed means no overtaking, a slashed U-turn arrow means no U-turn. A slashed P means no parking (you may still stop briefly to load or drop off); a slashed S means no stopping at all.",
      },
    ],
    questionIds: ["sign-001", "sign-002", "sign-004", "sign-005", "sign-007"],
  },
  {
    id: "signs-warning",
    slug: "road-signs-warning",
    title: "Road Signs: Warning",
    tagline: "Triangles that tell you what's coming — bends, crossings, hazards.",
    category: "Road Signs & Markings",
    codes: ["1", "2", "3"],
    difficulty: "Easy",
    estMinutes: 12,
    xp: 120,
    icon: "TriangleAlert",
    prerequisites: ["signs-regulatory"],
    intro:
      "Warning signs are your early-warning system. Triangular, red-bordered, they tell you a hazard is ahead so you can slow down and prepare before you reach it.",
    sections: [
      {
        heading: "Reading the symbol",
        body: "The picture inside the triangle shows the hazard: a bend, a crossroads, pedestrians, children, a slippery road, a speed hump, or a traffic signal ahead. React by easing off and covering the brake.",
        tip: "A warning sign is an instruction to think, not just to look.",
      },
      {
        heading: "Temporary (roadworks) warnings",
        body: "Signs with a yellow background are temporary — they mark roadworks and short-lived hazards, and they override the permanent signs around them. Obey the reduced limits and any STOP/GO flag operators; conditions can change from day to day.",
      },
    ],
    questionIds: ["sign-003", "sign-006", "sign-009", "sign-010"],
  },
  {
    id: "road-markings",
    slug: "road-markings",
    title: "Road Markings",
    tagline: "Lines, arrows and the language painted on the tar.",
    category: "Road Signs & Markings",
    codes: ["1", "2", "3"],
    difficulty: "Easy",
    estMinutes: 10,
    xp: 110,
    icon: "Minus",
    prerequisites: ["signs-warning"],
    intro:
      "Markings guide you where signs cannot. Knowing when you may cross a line — and when you may not — keeps you legal and safe when overtaking.",
    sections: [
      {
        heading: "Centre lines",
        body: "A broken white line may be crossed to overtake when clear. A solid white line on your side means no crossing. Two solid lines mean neither direction may cross.",
        tip: "If the line on your side is solid, stay put.",
      },
      {
        heading: "Other markings",
        body: "Yellow lines mark the edge of the roadway and the emergency shoulder. Arrows show compulsory lane directions. A painted island must be treated like a physical one.",
      },
    ],
    questionIds: ["sign-008", "ror-002"],
  },
  {
    id: "defensive-driving",
    slug: "defensive-driving",
    title: "Defensive Driving (The K53 System)",
    tagline: "Observe · Signal · Manoeuvre — the heartbeat of the driving test.",
    category: "Rules of the Road",
    codes: ["1", "2", "3"],
    difficulty: "Medium",
    estMinutes: 18,
    xp: 150,
    icon: "ShieldCheck",
    prerequisites: ["rules-basics"],
    intro:
      "The K53 defensive driving system is what examiners actually score. Every manoeuvre follows the same rhythm: observe, decide, act — with observation before every single action.",
    sections: [
      {
        heading: "Observe",
        body: "Check your mirrors constantly and do a blind-spot check over your shoulder before any change of direction or speed. The examiner is watching your eyes and your head movement, not just the car.",
        tip: "Exaggerate your observation slightly so the examiner clearly sees you doing it.",
      },
      {
        heading: "Signal",
        body: "Indicate in good time to tell others your intention — but a signal is not permission. You still must yield and check it is safe before you move.",
      },
      {
        heading: "Manoeuvre",
        body: "Only once it is observed and safe do you act: brake, steer or change lane smoothly and progressively. Then observe again to confirm the situation hasn't changed.",
      },
    ],
    questionIds: ["ror-004", "ror-007", "veh-005", "ror-010"],
  },
  {
    id: "alcohol-fatigue",
    slug: "alcohol-fatigue-distraction",
    title: "Alcohol, Fatigue & Distraction",
    tagline: "The three biggest killers behind the wheel.",
    category: "Rules of the Road",
    codes: ["1", "2", "3"],
    difficulty: "Easy",
    estMinutes: 10,
    xp: 110,
    icon: "Wine",
    prerequisites: ["rules-basics"],
    intro:
      "You can know every rule and still crash if your judgement is impaired. Alcohol, tiredness and distraction each rob you of the reaction time the road demands.",
    sections: [
      {
        heading: "Alcohol limits",
        body: "The legal limit is below 0.05 g per 100 ml of blood, and stricter (below 0.02 g) for professional drivers. Even one drink slows reaction time — the only safe amount before driving is none.",
        tip: "There is no food, coffee or shower that speeds up sobering — only time does.",
      },
      {
        heading: "Fatigue and distraction",
        body: "Drowsiness impairs you much like alcohol. Take breaks on long trips. Never use a hand-held phone while driving; even hands-free calls split your attention.",
      },
    ],
    questionIds: ["ror-005", "ror-006"],
  },
  {
    id: "emergencies",
    slug: "emergency-situations",
    title: "Emergency Situations",
    tagline: "Skids, brake failure and tyre bursts — react right.",
    category: "Vehicle Controls",
    codes: ["1", "2", "3"],
    difficulty: "Hard",
    estMinutes: 14,
    xp: 150,
    icon: "Siren",
    prerequisites: ["defensive-driving"],
    intro:
      "Emergencies are rare but decisive. The instinctive reaction is often the wrong one — training the correct response now could save your life later.",
    sections: [
      {
        heading: "Skids",
        body: "Ease off the accelerator, keep both hands on the wheel, and steer smoothly toward where you want to go. Avoid harsh braking or sudden steering, which make a skid worse.",
      },
      {
        heading: "Brake failure & tyre burst",
        body: "For brake failure, pump the pedal, change down through the gears and use the handbrake gently. For a tyre burst, grip the wheel firmly, ease off the accelerator and let the vehicle slow before steering off the road.",
        tip: "Never stamp the brakes in a tyre burst — it can spin the vehicle.",
      },
    ],
    questionIds: ["veh-007", "veh-001"],
  },
  {
    id: "controls-light",
    slug: "vehicle-controls-code-2",
    title: "Vehicle Controls & Instruments (Code 2)",
    tagline: "Clutch, gears, dash lights — know your light motor vehicle.",
    category: "Vehicle Controls",
    codes: ["2"],
    difficulty: "Easy",
    estMinutes: 12,
    xp: 120,
    icon: "Gauge",
    prerequisites: [],
    intro:
      "You cannot control what you don't understand. This room covers the controls and warning lights of a light motor vehicle so nothing on the dashboard surprises you on test day.",
    sections: [
      {
        heading: "Primary controls",
        body: "Accelerator, brake and clutch are operated with your feet; steering, indicators, lights and gears with your hands. Keep your foot off the clutch except when changing gear to avoid wear.",
      },
      {
        heading: "Warning lights",
        body: "A red light demands action now — stop for a red temperature or oil light. Amber lights are cautions to check soon. Know the handbrake, ABS, and battery symbols before your test.",
        tip: "Red = stop and check. Amber = attend to it soon.",
      },
    ],
    questionIds: ["veh-001", "veh-002", "veh-006", "veh-010"],
  },
  {
    id: "controls-moto",
    slug: "motorcycle-balance-control",
    title: "Motorcycle: Balance & Slow Riding",
    tagline: "Code 1 core skills — balance, counter-steering, the emergency swerve.",
    category: "Vehicle Controls",
    codes: ["1"],
    difficulty: "Medium",
    estMinutes: 16,
    xp: 140,
    icon: "Bike",
    prerequisites: [],
    intro:
      "A motorcycle demands skills a car never will: balance at walking pace, combined braking, and the reflexes to swerve around a hazard. This room builds the theory behind the Code 1 yard test.",
    sections: [
      {
        heading: "Balance and slow riding",
        body: "At low speed, control balance with gentle throttle, light rear brake, and the clutch friction zone. Look where you want to go — never at the front wheel. Smooth inputs keep the bike upright.",
        tip: "Eyes up and far ahead — the bike follows your gaze.",
      },
      {
        heading: "Braking and swerving",
        body: "Use both brakes smoothly together; most stopping power is at the front. For an emergency swerve, brake first, then release and steer, then straighten — never brake mid-swerve.",
      },
    ],
    questionIds: ["veh-003", "veh-008", "veh-005"],
  },
  {
    id: "heavy-airbrakes",
    slug: "heavy-air-brakes-load",
    title: "Heavy Vehicle: Air Brakes & Load",
    tagline: "Code 3 essentials — air-brake safety and load distribution.",
    category: "Vehicle Controls",
    codes: ["3"],
    difficulty: "Hard",
    estMinutes: 18,
    xp: 160,
    icon: "Truck",
    prerequisites: [],
    intro:
      "Heavy vehicles bring systems light cars never have: air brakes, articulated trailers, and loads that shift the whole vehicle's behaviour. Mastering these is the heart of the Code 3 test.",
    sections: [
      {
        heading: "Air brake systems",
        body: "Air brakes build pressure in a reservoir. Watch the pressure gauge — a drop means a leak and possible brake failure. Stop safely as soon as you can and never continue with low pressure.",
        tip: "Do a full air-brake pressure check as part of every pre-trip inspection.",
      },
      {
        heading: "Load distribution",
        body: "Loads must be evenly spread and secured. A high or uneven load raises the centre of gravity and greatly increases rollover risk, especially in bends and on off-camber turns.",
      },
    ],
    questionIds: ["veh-004", "veh-009", "ror-008"],
  },
  {
    id: "pretrip",
    slug: "pre-trip-inspection",
    title: "Pre-trip Inspection",
    tagline: "The walk-around that keeps you legal and alive.",
    category: "Practical",
    codes: ["1", "2", "3"],
    difficulty: "Easy",
    estMinutes: 10,
    xp: 110,
    icon: "ClipboardCheck",
    prerequisites: [],
    intro:
      "Before every yard and road test you must show you can inspect the vehicle. The examiner wants a methodical walk-around, not a glance. Learn a fixed routine so you never miss a point.",
    sections: [
      {
        heading: "The walk-around",
        body: "Check tyres and pressure, all lights and indicators, mirrors, windscreen and wipers, and under the bonnet for oil, water and brake fluid. Confirm the handbrake holds and the seatbelts work.",
        tip: "Do it in the same order every time so nothing is forgotten under pressure.",
      },
    ],
    questionIds: ["veh-010", "veh-001"],
  },
  {
    id: "yard-test",
    slug: "yard-test-manoeuvres",
    title: "Yard Test Manoeuvres",
    tagline: "Parallel park, alley dock, incline start — earn 'Perfect Parker'.",
    category: "Practical",
    codes: ["1", "2", "3"],
    difficulty: "Medium",
    estMinutes: 20,
    xp: 150,
    icon: "ParkingSquare",
    prerequisites: ["pretrip"],
    intro:
      "The yard test is where many candidates lose marks — but it is also the most learnable part. Every manoeuvre is a repeatable sequence of observation and control. Practise the steps until they're automatic.",
    sections: [
      {
        heading: "Parallel parking",
        body: "Pull alongside the front vehicle, observe all around, reverse while turning toward the kerb, then straighten as the vehicle settles into the bay. Observation before and during every movement is scored.",
        tip: "Rolling back over the line or touching a pole is an immediate fail — go slow and observe.",
      },
      {
        heading: "Alley docking & incline start",
        body: "For alley docking, use reference points and reverse in a smooth arc with all-round observation. For an incline start, hold on the clutch and handbrake, then pull away without rolling back more than the allowed distance.",
      },
    ],
    questionIds: ["veh-006", "veh-005", "veh-010"],
  },
];

export function roomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}

export function roomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
