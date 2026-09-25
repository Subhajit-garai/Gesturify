import { SIGN_VOCABULARY } from "@/config/signVocabulary";
import { MatchedSignToken } from "@/types/youtube";

/**
 * Searches a transcript text snippet for recognized Indian Sign Language (ISL)
 * keywords from Gesturify's core dictionary.
 */
export function matchSignsInText(text: string): MatchedSignToken[] {
  if (!text || typeof text !== "string") return [];

  const normalizedText = text.toLowerCase();
  const matchedTokens: MatchedSignToken[] = [];
  const seenIds = new Set<string>();

  for (const sign of SIGN_VOCABULARY) {
    if (seenIds.has(sign.id)) continue;

    // Check main label first
    const labelMatch = new RegExp(`\\b${escapeRegExp(sign.label.toLowerCase())}\\b`, "i").test(normalizedText);

    // Check keywords list
    const keywordMatch = sign.keywords.some((kw) => {
      const escaped = escapeRegExp(kw.toLowerCase().trim());
      if (!escaped) return false;
      return new RegExp(`\\b${escaped}\\b`, "i").test(normalizedText);
    });

    if (labelMatch || keywordMatch) {
      seenIds.add(sign.id);
      matchedTokens.push({
        id: sign.id,
        label: sign.label,
        hindiLabel: sign.hindiLabel,
        category: sign.category,
      });
    }
  }

  return matchedTokens;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
