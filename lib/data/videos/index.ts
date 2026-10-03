import { RULES_OF_THE_ROAD_VIDEOS, type RoomVideo } from "./rules-of-the-road";

export type { RoomVideo };

/**
 * Maps a room slug to its curated video list. Add more rooms here as you build
 * out their video sources (e.g. "road-signs-regulatory": REGULATORY_VIDEOS).
 */
const VIDEOS_BY_ROOM: Record<string, RoomVideo[]> = {
  "rules-of-the-road": RULES_OF_THE_ROAD_VIDEOS,
};

export function videosForRoom(slug: string): RoomVideo[] {
  return VIDEOS_BY_ROOM[slug] ?? [];
}
