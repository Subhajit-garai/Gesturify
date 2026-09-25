export interface STTCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class SpeechToTextService {
  private recognition: any = null;
  private isListening = false;

  public isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    );
  }

  public startListening(callbacks: STTCallbacks, lang = "en-IN"): boolean {
    if (!this.isSupported()) {
      callbacks.onError("Speech recognition is not supported in this browser.");
      return false;
    }

    try {
      this.stopListening();

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = lang;

      this.recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        callbacks.onResult(text, !!finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        console.warn("STT error:", event.error);
        callbacks.onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      console.error("STT initiation error:", err);
      callbacks.onError(err.message || "Failed to start microphone.");
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const sttService = new SpeechToTextService();
