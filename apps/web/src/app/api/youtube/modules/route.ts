import { NextResponse } from "next/server";
import { STUDY_MODULES } from "@/config/studyModules";

/**
 * GET /api/youtube/modules
 * Returns the catalog of curated ISL study modules.
 * Only returns lightweight metadata (titles, descriptions, thumbnails, sign lists)
 * so that NO YouTube video or transcript is pre-loaded until the user explicitly expands a module.
 */
export async function GET() {
  const lightweightModules = STUDY_MODULES.map((mod) => ({
    id: mod.id,
    title: mod.title,
    subtitle: mod.subtitle,
    description: mod.description,
    category: mod.category,
    difficulty: mod.difficulty,
    videoId: mod.videoId,
    videoTitle: mod.videoTitle,
    videoDuration: mod.videoDuration,
    thumbnailUrl: mod.thumbnailUrl,
    curatedSignIds: mod.curatedSignIds,
    hasTranscript: true,
  }));

  return NextResponse.json({
    success: true,
    modules: lightweightModules,
    total: lightweightModules.length,
  });
}
