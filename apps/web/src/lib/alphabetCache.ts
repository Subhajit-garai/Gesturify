import { ALPHABET_POSES, HandPose21 } from "@/data/alphabetPoses";

const STORAGE_PREFIX = "gesturify_alphabet_pose_";

/**
 * Multi-Tier Alphabet Hand Pose Cache
 * Tier 1: In-Memory Map (0ms instantaneous lookup)
 * Tier 2: Browser sessionStorage (persists across page reloads in active tab)
 */
export class AlphabetPoseCache {
  private static memoryCache = new Map<string, HandPose21>();
  private static isPreloaded = false;

  /**
   * Retrieves the 21-joint landmark handpose for a given alphabet character
   */
  public static getPose(char: string): HandPose21 {
    const key = (char || "A").toUpperCase().trim().charAt(0) || "A";

    // 1. Tier 1: Fast Memory Map Cache
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)!;
    }

    // 2. Tier 2: Browser Session Storage
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
        if (stored) {
          const parsed: HandPose21 = JSON.parse(stored);
          this.memoryCache.set(key, parsed);
          return parsed;
        }
      } catch (err) {
        console.warn(`[AlphabetPoseCache] Error reading sessionStorage for '${key}':`, err);
      }
    }

    // 3. Fallback to Static Base Dictionary
    const basePose = ALPHABET_POSES[key] || ALPHABET_POSES["A"];
    this.setPose(key, basePose);
    return basePose;
  }

  /**
   * Stores a pose in memory cache and session storage
   */
  public static setPose(char: string, pose: HandPose21): void {
    const key = char.toUpperCase().trim();
    this.memoryCache.set(key, pose);

    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(pose));
      } catch (err) {
        console.warn(`[AlphabetPoseCache] Error storing into sessionStorage for '${key}':`, err);
      }
    }
  }

  /**
   * Checks if a character is already cached
   */
  public static hasPose(char: string): boolean {
    const key = char.toUpperCase().trim();
    return this.memoryCache.has(key);
  }

  /**
   * Preloads all 26 alphabets into memory cache in a single background micro-task
   */
  public static preloadAll(): void {
    if (this.isPreloaded) return;
    this.isPreloaded = true;

    for (const [char, pose] of Object.entries(ALPHABET_POSES)) {
      if (!this.memoryCache.has(char)) {
        this.memoryCache.set(char, pose);
      }
    }
  }

  /**
   * Clears the session cache (useful for dev testing)
   */
  public static clearCache(): void {
    this.memoryCache.clear();
    this.isPreloaded = false;

    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        Object.keys(ALPHABET_POSES).forEach((char) => {
          sessionStorage.removeItem(`${STORAGE_PREFIX}${char}`);
        });
      } catch (err) {
        console.warn("[AlphabetPoseCache] Error clearing sessionStorage:", err);
      }
    }
  }
}
