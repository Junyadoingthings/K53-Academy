import type { RoadSign, SignCategory } from "./types";

/**
 * South African road signs, numbered per the SADC Road Traffic Signs Manual
 * (SADC-RTSM, used in SA as SARTSM). Artwork in /public/signs is the
 * public-domain SADC set from Wikimedia Commons. Meanings are written in our
 * own words.
 *
 * Colour language to teach:
 *  - Red ring + red slash = something is PROHIBITED.
 *  - Red ring, no slash   = a LIMIT you may not exceed (speed, mass, height).
 *  - Blue disc            = a COMMAND you must follow.
 *  - Blue rectangle + "R" = space RESERVED for certain road users.
 *  - Red-bordered triangle (point up) = WARNING of a hazard ahead.
 *  - Yellow background    = TEMPORARY sign, usually roadworks.
 */

type S = Omit<RoadSign, "category" | "group">;
const group = (category: SignCategory, g: string, signs: S[]): RoadSign[] =>
  signs.map((s) => ({ ...s, category, group: g }));

export const SIGNS: RoadSign[] = [
  // ── Regulatory · Control ────────────────────────────────────────────
  ...group("Regulatory", "Control", [
    {
      id: "stop",
      code: "R1",
      name: "Stop",
      meaning: "You must come to a complete stop at the stop line before entering the intersection.",
      action:
        "Stop with your front wheels behind the line, check all directions, and go only when it is safe. Rolling through is an immediate fail.",
    },
    {
      id: "four-way-stop",
      code: "R1.4",
      name: "4-way stop",
      image: "R1.4.svg",
      meaning: "Every approach to this intersection has a stop sign.",
      action:
        "Stop completely. Vehicles proceed in the order they stopped — first to stop is first to go.",
    },
    {
      id: "yield",
      code: "R2",
      name: "Yield",
      meaning: "Give way to all traffic on the road you are entering or crossing.",
      action: "Slow down and be ready to stop. You only need to stop if traffic is approaching.",
    },
    {
      id: "yield-to-pedestrians",
      code: "R2.1",
      name: "Yield to pedestrians",
      meaning: "Pedestrians crossing here have right of way.",
      action: "Slow down and stop if anyone is crossing or waiting to cross.",
    },
    {
      id: "yield-at-roundabout",
      code: "R2.2",
      name: "Yield at roundabout",
      meaning: "Give way to traffic already in the roundabout.",
      action: "Traffic in the circle comes from your right — wait for a safe gap before entering.",
    },
    {
      id: "no-entry",
      code: "R3",
      name: "No entry",
      meaning: "Vehicles may not enter the road beyond this sign.",
      action: "Do not drive past it. You will usually see it at the exit end of a one-way street.",
    },
    {
      id: "one-way",
      code: "R4.1",
      name: "One-way roadway",
      meaning: "Traffic on this road may only travel in the direction of the arrow.",
    },
    {
      id: "pedestrian-priority",
      code: "R5",
      name: "Pedestrian priority zone",
      meaning: "Pedestrians have priority over vehicles throughout this zone.",
      action: "Drive at walking pace and give way to pedestrians everywhere in the zone.",
    },
    {
      id: "yield-to-oncoming",
      code: "R6",
      name: "Yield to oncoming traffic",
      meaning: "The road narrows ahead and oncoming traffic has right of way.",
      action: "Wait before the narrow section until oncoming vehicles have passed.",
    },
  ]),

  // ── Regulatory · Command (blue discs) ──────────────────────────────
  ...group("Regulatory", "Command", [
    {
      id: "minimum-speed",
      code: "R101",
      name: "Minimum speed",
      meaning: "You must drive at least the speed shown (here 50 km/h), conditions permitting.",
    },
    {
      id: "keep-left",
      code: "R103",
      name: "Keep left",
      meaning: "Pass on the left-hand side of the island or obstruction.",
    },
    {
      id: "keep-right",
      code: "R104",
      name: "Keep right",
      meaning: "Pass on the right-hand side of the island or obstruction.",
    },
    {
      id: "turn-left",
      code: "R105",
      name: "Turn left",
      meaning: "You must turn left at this point.",
    },
    {
      id: "turn-right",
      code: "R106",
      name: "Turn right",
      meaning: "You must turn right at this point.",
    },
    {
      id: "proceed-straight",
      code: "R107",
      name: "Proceed straight only",
      meaning: "You must continue straight ahead — no turning.",
    },
    {
      id: "roundabout",
      code: "R137",
      name: "Roundabout",
      meaning: "Travel around the roundabout in a clockwise direction.",
      action: "Yield to traffic already in the circle, which approaches from your right.",
    },
    {
      id: "pedestrians-only",
      code: "R110",
      name: "Pedestrians only",
      meaning: "This road or path is for pedestrians only. Vehicles may not use it.",
    },
    {
      id: "cyclists-only",
      code: "R111",
      name: "Cyclists only",
      meaning: "This road or lane is for cyclists only.",
    },
    {
      id: "buses-only",
      code: "R121",
      name: "Buses only",
      meaning: "Only buses may use this road or lane.",
    },
    {
      id: "toll-road",
      code: "R132",
      name: "Toll road",
      meaning: "You are entering a toll road and must pay a toll to use it.",
    },
    {
      id: "headlamps-on",
      code: "R133",
      name: "Switch headlamps on",
      meaning: "Switch on your headlamps — usually before a tunnel or a low-visibility section.",
    },
  ]),

  // ── Regulatory · Prohibition (red ring) ────────────────────────────
  ...group("Regulatory", "Prohibition", [
    {
      id: "speed-40",
      code: "R201-40",
      name: "Speed limit 40",
      meaning: "Maximum speed 40 km/h from this sign onwards.",
    },
    {
      id: "speed-60",
      code: "R201-60",
      name: "Speed limit 60",
      meaning: "Maximum speed 60 km/h — also the default limit in built-up areas.",
      action: "The limit applies until another speed sign changes it.",
    },
    {
      id: "speed-80",
      code: "R201-80",
      name: "Speed limit 80",
      meaning: "Maximum speed 80 km/h from this sign onwards.",
    },
    {
      id: "speed-100",
      code: "R201-100",
      name: "Speed limit 100",
      meaning: "Maximum speed 100 km/h — also the default limit on public roads outside built-up areas.",
    },
    {
      id: "speed-120",
      code: "R201-120",
      name: "Speed limit 120",
      meaning: "Maximum speed 120 km/h — the default limit on freeways.",
    },
    {
      id: "mass-limit",
      code: "R202",
      name: "Mass limit",
      meaning: "Vehicles heavier than the mass shown (here 12 tonnes) may not pass.",
    },
    {
      id: "height-limit",
      code: "R204",
      name: "Height limit",
      meaning: "Vehicles taller than the height shown (here 4.42 m) may not pass.",
    },
    {
      id: "no-hooting",
      code: "R206",
      name: "No hooting",
      meaning: "Excessive noise, including using your hooter, is prohibited — often near hospitals.",
    },
    {
      id: "no-hitchhiking",
      code: "R207",
      name: "No hitch-hiking",
      meaning: "Hitch-hiking is not allowed on this road.",
    },
    {
      id: "no-left-turn",
      code: "R211",
      name: "No left turn",
      meaning: "Turning left is prohibited here.",
    },
    {
      id: "no-right-turn",
      code: "R212",
      name: "No right turn",
      meaning: "Turning right is prohibited here.",
    },
    {
      id: "no-u-turn",
      code: "R213",
      name: "No U-turn",
      meaning: "You may not make a U-turn here.",
    },
    {
      id: "no-overtaking",
      code: "R214",
      name: "No overtaking",
      meaning: "You may not overtake other vehicles on this stretch of road.",
    },
    {
      id: "no-overtaking-goods",
      code: "R215",
      name: "No overtaking by goods vehicles",
      meaning: "Goods vehicles may not overtake other vehicles on this stretch of road.",
    },
    {
      id: "no-parking",
      code: "R216",
      name: "No parking",
      meaning: "You may not park here. Stopping briefly to pick up or drop off is allowed.",
    },
    {
      id: "no-stopping",
      code: "R217",
      name: "No stopping",
      meaning: "You may not stop here at all, not even briefly — except to avoid a collision or obey traffic control.",
    },
    {
      id: "no-pedestrians",
      code: "R218",
      name: "No pedestrians",
      meaning: "Pedestrians are not allowed beyond this sign.",
    },
    {
      id: "no-cyclists",
      code: "R219",
      name: "No cyclists",
      meaning: "Bicycles are not allowed beyond this sign.",
    },
    {
      id: "no-motorcycles",
      code: "R222",
      name: "No motorcycles",
      meaning: "Motorcycles are not allowed beyond this sign.",
    },
    {
      id: "no-goods-vehicles",
      code: "R229",
      name: "No goods vehicles over 3 500 kg",
      meaning: "Goods vehicles with a gross vehicle mass over 3 500 kg may not enter.",
    },
  ]),

  // ── Regulatory · Reservation & parking ──────────────────────────────
  ...group("Regulatory", "Reservation", [
    {
      id: "reserved-buses",
      code: "R301",
      name: "Reserved for buses",
      meaning: "This road, lane or area is reserved for buses.",
    },
    {
      id: "reserved-bicycles",
      code: "R304",
      name: "Reserved lane for bicycles",
      meaning: "This lane is reserved for cyclists.",
    },
    {
      id: "reserved-taxis",
      code: "R309",
      name: "Reserved for taxis",
      meaning: "This area is reserved for minibus taxis — for example a taxi rank or stop.",
    },
    {
      id: "reserved-disabled",
      code: "R323",
      name: "Reserved for disabled persons",
      meaning: "Reserved for vehicles carrying people with disabilities.",
    },
    {
      id: "parking",
      code: "R305-P",
      name: "Parking",
      meaning: "Parking is allowed here.",
    },
    {
      id: "parking-60-min",
      code: "R306-P",
      name: "Parking, 60-minute limit",
      meaning: "You may park here for up to 60 minutes.",
    },
  ]),

  // ── Regulatory · Comprehensive & de-restriction ─────────────────────
  ...group("Regulatory", "Comprehensive", [
    {
      id: "freeway",
      code: "R401",
      name: "Freeway begins",
      meaning: "Freeway rules apply from here.",
      action:
        "No pedestrians, cyclists, animal-drawn vehicles or slow vehicles. No stopping except in an emergency. Default limit 120 km/h.",
    },
    {
      id: "freeway-ends",
      code: "R401-600",
      name: "End of freeway",
      meaning: "Freeway rules no longer apply from this point.",
    },
    {
      id: "woonerf",
      code: "R403",
      name: "Living street (woonerf)",
      meaning: "A residential street shared with pedestrians and children at play.",
      action: "Drive at walking pace and expect people on the road.",
    },
    {
      id: "minimum-speed-ends",
      code: "R101-600",
      name: "End of minimum speed",
      meaning: "The minimum speed requirement ends here.",
    },
    {
      id: "headlamps-off",
      code: "R133-600",
      name: "Switch headlamps off",
      meaning: "You may switch your headlamps off again.",
    },
  ]),

  // ── Warning · Junctions ─────────────────────────────────────────────
  ...group("Warning", "Junctions", [
    {
      id: "crossroads-ahead",
      code: "W101",
      name: "Crossroads ahead",
      meaning: "A crossroad intersection lies ahead.",
      action: "Slow down and watch for traffic entering from either side.",
    },
    {
      id: "t-junction-ahead",
      code: "W104",
      name: "T-junction ahead",
      meaning: "The road ends ahead at a T-junction — you will have to turn left or right.",
    },
    {
      id: "side-road-ahead",
      code: "W107",
      name: "Side road junction ahead",
      meaning: "A side road joins from the side shown on the sign.",
      action: "Watch for vehicles pulling out of the side road.",
    },
    {
      id: "fork-ahead",
      code: "W115",
      name: "Fork ahead",
      meaning: "The road splits into two ahead.",
    },
    {
      id: "roundabout-ahead",
      code: "W201",
      name: "Roundabout ahead",
      meaning: "A traffic circle lies ahead.",
      action: "Slow down and prepare to yield to traffic already in the circle.",
    },
    {
      id: "traffic-signal-ahead",
      code: "W301",
      name: "Traffic signal ahead",
      meaning: "A robot (traffic light) lies ahead, possibly hidden by a bend or crest.",
      action: "Be ready to stop.",
    },
    {
      id: "stop-ahead",
      code: "W302",
      name: "Stop control ahead",
      meaning: "A stop sign lies ahead.",
    },
    {
      id: "yield-ahead",
      code: "W303",
      name: "Yield control ahead",
      meaning: "A yield sign lies ahead.",
    },
    {
      id: "railway-crossing-ahead",
      code: "W318",
      name: "Railway crossing ahead",
      meaning: "A level crossing with a railway line lies ahead.",
      action: "Slow down, look and listen. Never stop on the tracks.",
    },
    {
      id: "railway-crossing",
      code: "W403",
      name: "Railway crossing",
      meaning: "Marks the railway level crossing itself.",
      action: "Stop if a train is approaching, the lights are flashing or a boom is down.",
    },
  ]),

  // ── Warning · Curves & road layout ──────────────────────────────────
  ...group("Warning", "Curves and layout", [
    {
      id: "gentle-curve-right",
      code: "W202",
      name: "Gentle curve right",
      meaning: "The road curves gently to the right ahead.",
    },
    {
      id: "gentle-curve-left",
      code: "W203",
      name: "Gentle curve left",
      meaning: "The road curves gently to the left ahead.",
    },
    {
      id: "sharp-curve-right",
      code: "W204",
      name: "Sharp curve right",
      meaning: "A sharp bend to the right lies ahead.",
      action: "Brake before the bend, not in it.",
    },
    {
      id: "sharp-curve-left",
      code: "W205",
      name: "Sharp curve left",
      meaning: "A sharp bend to the left lies ahead.",
      action: "Brake before the bend, not in it.",
    },
    {
      id: "hairpin",
      code: "W206",
      name: "Hairpin curve",
      meaning: "A very tight, almost U-shaped bend lies ahead.",
    },
    {
      id: "winding-road",
      code: "W208",
      name: "Winding road",
      meaning: "A series of bends lies ahead.",
    },
    {
      id: "chevron",
      code: "W405",
      name: "Sharp curve marker",
      meaning: "Placed on the outside of a sharp bend. The chevron points in the direction the road turns.",
    },
    {
      id: "two-way-traffic",
      code: "W212",
      name: "Two-way traffic ahead",
      meaning: "You are leaving a one-way section — traffic ahead travels in both directions.",
    },
    {
      id: "right-lane-ends",
      code: "W214",
      name: "Right lane ends",
      meaning: "The right-hand lane ends ahead.",
      action: "If you are in the right lane, merge left safely.",
    },
    {
      id: "left-lane-ends",
      code: "W215",
      name: "Left lane ends",
      meaning: "The left-hand lane ends ahead.",
      action: "If you are in the left lane, merge right safely.",
    },
    {
      id: "dual-carriageway-ends",
      code: "W116",
      name: "Dual carriageway ends",
      meaning: "The divided road ends — oncoming traffic will no longer be separated by a median.",
    },
    {
      id: "road-narrows",
      code: "W328",
      name: "Road narrows",
      meaning: "The roadway narrows from both sides ahead.",
    },
    {
      id: "narrow-bridge",
      code: "W326",
      name: "Narrow bridge",
      meaning: "A narrow bridge lies ahead.",
    },
  ]),

  // ── Warning · Road users & animals ──────────────────────────────────
  ...group("Warning", "Road users and animals", [
    {
      id: "pedestrian-crossing-ahead",
      code: "W306",
      name: "Pedestrian crossing ahead",
      meaning: "A marked pedestrian crossing lies ahead.",
      action: "Slow down and be ready to stop for people on or about to step onto the crossing.",
    },
    {
      id: "pedestrians-ahead",
      code: "W307",
      name: "Pedestrians ahead",
      meaning: "Expect pedestrians on or near the road.",
    },
    {
      id: "children-ahead",
      code: "W308",
      name: "Children ahead",
      meaning: "Children may be crossing or playing near the road — often near a school.",
      action: "Slow down. Children can run out without looking.",
    },
    {
      id: "cyclists-ahead",
      code: "W309",
      name: "Cyclists ahead",
      meaning: "Expect cyclists on the road.",
      action: "Give cyclists at least 1 m of space when you pass.",
    },
    {
      id: "heavy-vehicles-ahead",
      code: "W324",
      name: "Slow heavy vehicles",
      meaning: "Slow-moving heavy vehicles may be on the road ahead, often on a climb.",
    },
    {
      id: "cattle-ahead",
      code: "W310",
      name: "Cattle ahead",
      meaning: "Cattle may be on or crossing the road.",
    },
    {
      id: "wild-animals-ahead",
      code: "W313",
      name: "Wild animals ahead",
      meaning: "Antelope and other wild animals may cross the road.",
      action: "Be extra careful at dawn and dusk.",
    },
    {
      id: "elephants-ahead",
      code: "W357",
      name: "Elephants ahead",
      meaning: "Elephants may be on or near the road.",
      action: "Keep your distance and never try to drive past an elephant on the road.",
    },
  ]),

  // ── Warning · Road surface & hazards ────────────────────────────────
  ...group("Warning", "Surface and hazards", [
    {
      id: "speed-hump",
      code: "W332",
      name: "Speed hump ahead",
      meaning: "A raised speed hump lies ahead.",
      action: "Slow down to cross it safely.",
    },
    {
      id: "uneven-road",
      code: "W331",
      name: "Uneven road surface",
      meaning: "The road surface ahead is bumpy or uneven.",
    },
    {
      id: "slippery-road",
      code: "W333",
      name: "Slippery road",
      meaning: "The road may be slippery, especially when wet.",
      action: "Reduce speed, increase following distance and avoid harsh braking or steering.",
    },
    {
      id: "steep-descent",
      code: "W322",
      name: "Steep descent",
      meaning: "A steep downhill section lies ahead.",
      action: "Select a lower gear so the engine helps you brake.",
    },
    {
      id: "steep-ascent",
      code: "W323",
      name: "Steep ascent",
      meaning: "A steep uphill section lies ahead.",
    },
    {
      id: "falling-rocks",
      code: "W334",
      name: "Falling rocks",
      meaning: "Rocks may fall onto or be lying on the road.",
    },
    {
      id: "drift",
      code: "W350",
      name: "Drift ahead",
      meaning: "The road crosses a dip or riverbed that may be flooded.",
      action: "Never drive into flowing water if you can't see the road surface.",
    },
    {
      id: "general-warning",
      code: "W339",
      name: "General warning",
      meaning: "Danger ahead. A plate below the sign usually explains the hazard.",
    },
  ]),

  // ── Information ─────────────────────────────────────────────────────
  ...group("Information", "Information", [
    {
      id: "pedestrian-crossing",
      code: "R360",
      name: "Pedestrian crossing",
      meaning: "Marks a pedestrian crossing. Pedestrians on the crossing have right of way.",
    },
    {
      id: "priority-road",
      code: "IN7",
      name: "Priority road",
      meaning: "You are on a road that has priority at the intersections ahead.",
    },
    {
      id: "dead-end",
      code: "IN4",
      name: "Dead end",
      meaning: "The road ahead has no through route.",
    },
    {
      id: "bus-stop-ahead",
      code: "IN16",
      name: "Bus stop ahead",
      meaning: "A bus stop lies ahead at the distance shown.",
    },
    {
      id: "information-centre",
      code: "IN12",
      name: "Information centre",
      meaning: "A tourist or traveller information centre is nearby.",
    },
  ]),

  // ── Temporary (roadworks) — yellow background ──────────────────────
  ...group("Temporary", "Roadworks", [
    {
      id: "roadworks",
      code: "TW336",
      name: "Roadworks ahead",
      meaning: "Construction or maintenance work is taking place on the road ahead.",
      action: "Slow down, watch for workers and follow any temporary signs — they override permanent ones.",
    },
    {
      id: "stop-go-ahead",
      code: "TW343",
      name: "Stop/Go control ahead",
      meaning: "A flag person with a STOP/GO board is controlling traffic ahead.",
      action: "Be ready to stop and only proceed when the board shows GO.",
    },
    {
      id: "grader-ahead",
      code: "TW337",
      name: "Grader working ahead",
      meaning: "A road grader is working on the road ahead.",
    },
    {
      id: "construction-vehicles-crossing",
      code: "TW344",
      name: "Construction vehicles crossing",
      meaning: "Construction vehicles may cross the road ahead.",
    },
    {
      id: "temporary-speed-hump",
      code: "TW332",
      name: "Temporary speed hump",
      meaning: "A temporary speed hump lies ahead.",
    },
    {
      id: "temporary-warning",
      code: "TW339",
      name: "Temporary general warning",
      meaning: "A temporary hazard lies ahead — read the plate beneath the sign.",
    },
    {
      id: "temporary-speed-60",
      code: "TR201-60",
      name: "Temporary speed limit 60",
      meaning: "A temporary 60 km/h limit applies through the works, even on a faster road.",
    },
    {
      id: "temporary-chevron",
      code: "TW405",
      name: "Temporary curve marker",
      meaning: "Marks a sharp temporary deviation. Follow the direction of the chevron.",
    },
  ]),
];

export function signById(id: string): RoadSign | undefined {
  return SIGNS.find((s) => s.id === id);
}

export const SIGN_CATEGORIES = ["Regulatory", "Warning", "Information", "Temporary"] as const;

export function signGroups(category?: string): string[] {
  const seen = new Set<string>();
  for (const s of SIGNS) if (!category || s.category === category) seen.add(s.group);
  return Array.from(seen);
}
