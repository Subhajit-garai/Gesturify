import { NextRequest, NextResponse } from "next/server";
import { getYouTubeTranscript, extractVideoId } from "@/lib/youtube/transcriptService";

/**
 * GET /api/youtube/transcript?v={videoId}&url={url}&lang={lang}
 * Fetches timestamped transcript cues for the requested YouTube video on-demand.
 * Triggered ONLY when a user expands a study module or searches a custom video.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoIdParam = searchParams.get("v") || searchParams.get("videoId");
    const urlParam = searchParams.get("url");
    const lang = searchParams.get("lang") || "en";

    const target = videoIdParam || urlParam;
    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: provide 'v' (videoId) or 'url'.",
          cues: [],
        },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(target);
    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          error: `Could not parse a valid 11-character YouTube video ID from '${target}'.`,
          cues: [],
        },
        { status: 400 }
      );
    }

    const result = await getYouTubeTranscript(videoId, lang);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    console.error("Error in /api/youtube/transcript route:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error while fetching transcript.",
        cues: [],
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/youtube/transcript
 * Allows sending { videoId, url, lang } via request body.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const target = body.videoId || body.v || body.url;
    const lang = body.lang || "en";

    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: provide 'videoId' or 'url' in body.",
          cues: [],
        },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(target);
    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid YouTube video ID or URL format.",
          cues: [],
        },
        { status: 400 }
      );
    }

    const result = await getYouTubeTranscript(videoId, lang);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (err: any) {
    console.error("Error in POST /api/youtube/transcript route:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to process transcript request.",
        cues: [],
      },
      { status: 500 }
    );
  }
}
