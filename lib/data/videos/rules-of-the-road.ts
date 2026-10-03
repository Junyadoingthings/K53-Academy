/**
 * Curated K53 "Rules of the Road" video sources for the room of the same slug.
 *
 * These are real, public YouTube videos from South African K53 educators,
 * embedded via the standard YouTube player and credited by channel (`source`).
 * `youtubeId` is the 11-character ID from a watch URL (youtube.com/watch?v=ID).
 * Durations are approximate — edit any entry, add your own, or remove ones that
 * go offline. Thumbnails are pulled automatically from img.youtube.com.
 */

export interface RoomVideo {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  duration: string;
  source: string;
}

export const RULES_OF_THE_ROAD_VIDEOS: RoomVideo[] = [
  {
    id: "rotr-full-lesson",
    title: "K53 Rules of the Road — Full Lesson",
    youtubeId: "-kikHjwvWc4",
    description:
      "A complete walkthrough of the rules every learner needs before writing the learner's licence test.",
    duration: "24:10",
    source: "Lungelo Kunene",
  },
  {
    id: "rotr-part-1",
    title: "Rules of the Road — Part 1",
    youtubeId: "zUIQekgpiy8",
    description:
      "Part 1 of a step-by-step series: right of way, intersections and the basics of sharing the road.",
    duration: "12:40",
    source: "K53 Learners Classroom",
  },
  {
    id: "rotr-part-2",
    title: "Rules of the Road — Part 2",
    youtubeId: "gfCAIiqZSy4",
    description:
      "Part 2: speed limits, following distance and overtaking rules explained in plain language.",
    duration: "11:20",
    source: "K53 Learners Classroom",
  },
  {
    id: "rotr-part-3",
    title: "Rules of the Road — Part 3",
    youtubeId: "wg63tgsGl3M",
    description:
      "Part 3: pedestrians, emergency vehicles and the trickier right-of-way scenarios.",
    duration: "10:05",
    source: "K53 Learners Classroom",
  },
  {
    id: "rotr-lesson-1",
    title: "Learner's Test Prep — Rules of the Road, Lesson 1",
    youtubeId: "pusoClChirE",
    description:
      "An exam-focused lesson covering the rules most likely to appear in the learner's test.",
    duration: "14:30",
    source: "Lungelo Kunene",
  },
  {
    id: "rotr-full-course",
    title: "Complete Course — Notes, Signs, Rules & Markings",
    youtubeId: "vbu2h8wpvBA",
    description:
      "A full learner's-licence course that ties the rules of the road together with signs and road markings.",
    duration: "48:00",
    source: "Lungelo Kunene",
  },
];
