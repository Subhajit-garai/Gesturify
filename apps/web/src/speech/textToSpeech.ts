export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voiceName?: string;
}

export class TextToSpeechService {
  private isSpeaking = false;

  public isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return [];
    return window.speechSynthesis.getVoices();
  }

  public speak(
    text: string,
    options: TTSOptions = {},
    onEnd?: () => void
  ): boolean {
    if (!this.isSupported() || !text.trim()) return false;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.lang = options.lang ?? "en-IN"; // Default to Indian English

      const voices = this.getVoices();
      if (options.voiceName) {
        const found = voices.find((v) => v.name === options.voiceName);
        if (found) utterance.voice = found;
      } else {
        // Prefer Indian English or local English voice
        const inVoice = voices.find(
          (v) => v.lang.includes("en-IN") || v.lang.includes("hi-IN")
        );
        if (inVoice) utterance.voice = inVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn("TTS error:", e);
        this.isSpeaking = false;
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error("Text-to-Speech failed:", err);
      return false;
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const ttsService = new TextToSpeechService();
