import { TranscriptCue, YouTubeCaptionTrack, YouTubeTranscriptResponse } from "@/types/youtube";
import { matchSignsInText } from "./signMatcher";
import { STUDY_MODULES } from "@/config/studyModules";

// In-memory transcript cache with 1-hour TTL
interface CacheEntry {
  data: YouTubeTranscriptResponse;
  expiresAt: number;
}
const transcriptCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Extracts a standard 11-character YouTube video ID from various URL formats
 * (e.g. watch?v=, youtu.be, embed, shorts, or raw ID).
 */
export function extractVideoId(input: string): string | null {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();
  // If already an 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex covering standard watch, embed, short, and youtu.be links
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetches and parses synchronized captions from YouTube for a given video ID.
 * Automatically falls back to curated study module transcripts if YouTube timedtext is unavailable.
 */
export async function getYouTubeTranscript(
  videoId: string,
  preferredLang: string = "en"
): Promise<YouTubeTranscriptResponse> {
  const cleanId = extractVideoId(videoId);
  if (!cleanId) {
    return {
      success: false,
      videoId,
      cues: [],
      error: "Invalid YouTube Video ID or URL provided.",
    };
  }

  // 1. Check in-memory cache
  const cacheKey = `${cleanId}_${preferredLang}`;
  const cached = transcriptCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.data, cached: true };
  }

  // 2. Check if this is a curated study module
  const curatedModule = STUDY_MODULES.find((m) => m.videoId === cleanId);

  try {
    // 3. Attempt to fetch captions from YouTube
    const liveCues = await fetchFromYouTubeTimedText(cleanId, preferredLang);

    if (liveCues && liveCues.cues.length > 0) {
      const response: YouTubeTranscriptResponse = {
        success: true,
        videoId: cleanId,
        videoTitle: liveCues.title || curatedModule?.videoTitle,
        language: liveCues.language,
        availableLanguages: liveCues.availableLanguages,
        cues: liveCues.cues,
        cached: false,
        source: "youtube-timedtext",
      };

      transcriptCache.set(cacheKey, {
        data: response,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      return response;
    }
  } catch (err) {
    console.warn(`Live YouTube transcript fetch failed for ${cleanId}, falling back to curated data:`, err);
  }

  // 4. Fallback: Use curated module fallback cues if available
  if (curatedModule && curatedModule.fallbackCues && curatedModule.fallbackCues.length > 0) {
    const enrichedCues: TranscriptCue[] = curatedModule.fallbackCues.map((cue) => ({
      ...cue,
      matchedSigns: matchSignsInText(cue.text),
    }));

    const response: YouTubeTranscriptResponse = {
      success: true,
      videoId: cleanId,
      videoTitle: curatedModule.videoTitle,
      language: "en",
      cues: enrichedCues,
      cached: false,
      source: "curated-lesson",
    };

    transcriptCache.set(cacheKey, {
      data: response,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return response;
  }

  // 5. If no captions and no curated lesson
  return {
    success: false,
    videoId: cleanId,
    cues: [],
    error: "No captions or transcript track available for this YouTube video. The creator may have disabled subtitles.",
  };
}

/**
 * Internal helper to scrape captionTracks from YouTube's player response
 * and download the timedtext track.
 */
async function fetchFromYouTubeTimedText(
  videoId: string,
  preferredLang: string
): Promise<{
  title?: string;
  language: string;
  availableLanguages: { code: string; name: string; isAuto?: boolean }[];
  cues: TranscriptCue[];
} | null> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const res = await fetch(watchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`YouTube watch page returned status ${res.status}`);
  }

  const html = await res.text();

  // Extract video title if present
  let title: string | undefined;
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    title = decodeHtmlEntities(titleMatch[1].replace(/ - YouTube$/, ""));
  }

  // Extract ytInitialPlayerResponse JSON blob
  const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({[\s\S]+?});(?:\s*var\s+|\s*<\/script>)/);
  if (!playerResponseMatch || !playerResponseMatch[1]) {
    return null;
  }

  let playerResponse: any;
  try {
    playerResponse = JSON.parse(playerResponseMatch[1]);
  } catch (err) {
    return null;
  }

  const captionsRenderer = playerResponse?.captions?.playerCaptionsTracklistRenderer;
  const captionTracks = captionsRenderer?.captionTracks;

  if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
    return null;
  }

  const availableLanguages = captionTracks.map((t: any) => ({
    code: t.languageCode,
    name: t.name?.simpleText || t.languageCode,
    isAuto: t.kind === "asr",
  }));

  // Find preferred language track (e.g. "en", "hi") or fallback to first
  let selectedTrack =
    captionTracks.find((t: any) => t.languageCode?.toLowerCase().startsWith(preferredLang.toLowerCase())) ||
    captionTracks.find((t: any) => t.languageCode?.toLowerCase().startsWith("en")) ||
    captionTracks[0];

  if (!selectedTrack?.baseUrl) {
    return null;
  }

  // Fetch timedtext cues. Try JSON3 format first
  let cues: TranscriptCue[] = [];
  try {
    const json3Url = `${selectedTrack.baseUrl}&fmt=json3`;
    const timedTextRes = await fetch(json3Url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    if (timedTextRes.ok) {
      const data = await timedTextRes.json();
      if (Array.isArray(data.events)) {
        cues = parseJson3Cues(data.events);
      }
    }
  } catch (jsonErr) {
    // If json3 format fails, try standard XML
    try {
      const xmlRes = await fetch(selectedTrack.baseUrl);
      if (xmlRes.ok) {
        const xmlText = await xmlRes.text();
        cues = parseXmlCues(xmlText);
      }
    } catch (xmlErr) {
      console.warn("Failed to parse XML timedtext:", xmlErr);
    }
  }

  if (cues.length === 0) {
    return null;
  }

  return {
    title,
    language: selectedTrack.languageCode || preferredLang,
    availableLanguages,
    cues,
  };
}

/**
 * Parses YouTube JSON3 timed text format into TranscriptCue objects.
 */
function parseJson3Cues(events: any[]): TranscriptCue[] {
  const cues: TranscriptCue[] = [];

  events.forEach((event, index) => {
    if (!event.segs || !event.tStartMs) return;

    const rawText = event.segs.map((s: any) => s.utf8 || "").join("");
    const cleanText = decodeHtmlEntities(rawText).trim();

    if (!cleanText || cleanText === "\n") return;

    const startSeconds = Number((event.tStartMs / 1000).toFixed(2));
    const durationSeconds = Number(((event.dDurationMs || 2500) / 1000).toFixed(2));
    const endSeconds = Number((startSeconds + durationSeconds).toFixed(2));

    cues.push({
      id: `cue-${index + 1}-${event.tStartMs}`,
      start: startSeconds,
      duration: durationSeconds,
      end: endSeconds,
      text: cleanText,
      matchedSigns: matchSignsInText(cleanText),
    });
  });

  return cues;
}

/**
 * Fallback parser for standard YouTube timedtext XML format.
 */
function parseXmlCues(xmlText: string): TranscriptCue[] {
  const cues: TranscriptCue[] = [];
  const textTagRegex = /<text\s+start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>(.*?)<\/text>/g;

  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = textTagRegex.exec(xmlText)) !== null) {
    idx++;
    const startSeconds = parseFloat(match[1]) || 0;
    const durationSeconds = match[2] ? parseFloat(match[2]) : 2.5;
    const endSeconds = Number((startSeconds + durationSeconds).toFixed(2));
    const cleanText = decodeHtmlEntities(match[3]).trim();

    if (!cleanText) continue;

    cues.push({
      id: `cue-xml-${idx}`,
      start: Number(startSeconds.toFixed(2)),
      duration: Number(durationSeconds.toFixed(2)),
      end: endSeconds,
      text: cleanText,
      matchedSigns: matchSignsInText(cleanText),
    });
  }

  return cues;
}

/**
 * Decodes standard HTML entities commonly found in subtitle streams.
 */
function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}
