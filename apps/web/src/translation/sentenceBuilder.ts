import { SignSentenceItem } from "@/types";

export interface ConstructedSentence {
  english: string;
  hindi: string;
  tokens: string[];
}

export class SentenceBuilder {
  /**
   * Constructs natural English & Hindi sentences from ordered sign tokens
   * ISL grammar often uses Subject-Object-Verb (SOV) or topic-comment structures
   */
  public static buildSentence(tokens: SignSentenceItem[]): ConstructedSentence {
    if (!tokens || tokens.length === 0) {
      return {
        english: "",
        hindi: "",
        tokens: [],
      };
    }

    const labels = tokens.map((t) => t.token.toUpperCase());
    const textJoined = labels.join(" ");

    // Common ISL idiomatic phrase patterns
    if (textJoined.includes("I WATER") || textJoined === "WATER") {
      return {
        english: "I need drinking water.",
        hindi: "मुझे पीने का पानी चाहिए।",
        tokens: labels,
      };
    }

    if (textJoined.includes("HELP HOSPITAL") || textJoined.includes("HOSPITAL HELP")) {
      return {
        english: "Emergency! Please help take me to the hospital.",
        hindi: "आपातकालीन! कृपया मुझे अस्पताल ले जाने में मदद करें।",
        tokens: labels,
      };
    }

    if (textJoined.includes("I FOOD") || textJoined === "FOOD") {
      return {
        english: "I am hungry and need food.",
        hindi: "मुझे भूख लगी है और खाना चाहिए।",
        tokens: labels,
      };
    }

    if (textJoined.includes("YOU WHERE") || textJoined.includes("WHERE YOU")) {
      return {
        english: "Where are you going?",
        hindi: "आप कहाँ जा रहे हैं?",
        tokens: labels,
      };
    }

    if (textJoined.includes("HELLO THANK YOU")) {
      return {
        english: "Hello, thank you very much!",
        hindi: "नमस्ते, आपका बहुत-बहुत धन्यवाद!",
        tokens: labels,
      };
    }

    if (textJoined === "HELLO") {
      return {
        english: "Hello! Greetings.",
        hindi: "नमस्ते!",
        tokens: labels,
      };
    }

    if (textJoined === "HELP") {
      return {
        english: "Please help me!",
        hindi: "कृपया मेरी मदद करें!",
        tokens: labels,
      };
    }

    if (textJoined.includes("SORRY PLEASE")) {
      return {
        english: "I am sorry, please excuse me.",
        hindi: "मुझे खेद है, कृपया मुझे क्षमा करें।",
        tokens: labels,
      };
    }

    // Deterministic fallback: capitalize and punctuate
    const formatted = labels
      .map((w, idx) => {
        const lower = w.toLowerCase();
        if (idx === 0) return lower.charAt(0).toUpperCase() + lower.slice(1);
        return lower;
      })
      .join(" ");

    return {
      english: formatted.endsWith(".") || formatted.endsWith("!") ? formatted : `${formatted}.`,
      hindi: `चिन्ह अनुक्रम: ${labels.join(" + ")}`,
      tokens: labels,
    };
  }
}
