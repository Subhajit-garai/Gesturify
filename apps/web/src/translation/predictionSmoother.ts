import { Prediction, SmoothingConfig } from "@/types";

export class PredictionSmoother {
  private config: SmoothingConfig;
  private history: string[] = [];
  private lastAcceptedSign: string | null = null;
  private lastAcceptedTime = 0;
  private consecutiveCount = 0;
  private candidateSign: string | null = null;

  constructor(
    config: SmoothingConfig = {
      confidenceThreshold: 0.72,
      windowSize: 6,
      minAgreementCount: 3,
      cooldownMs: 1100,
    }
  ) {
    this.config = config;
  }

  public updateConfig(newConfig: Partial<SmoothingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public process(
    prediction: Prediction,
    onSignAccepted: (sign: string, confidence: number) => void
  ): { isCandidateStable: boolean; stabilityRatio: number } {
    const { label, confidence } = prediction;
    const now = Date.now();

    // Ignore non-signs or low confidence predictions
    if (
      !label ||
      label === "SEARCHING" ||
      label === "NO HANDS DETECTED" ||
      label === "ANALYZING..." ||
      confidence < this.config.confidenceThreshold
    ) {
      this.consecutiveCount = Math.max(0, this.consecutiveCount - 1);
      return { isCandidateStable: false, stabilityRatio: 0 };
    }

    // Append to rolling window
    this.history.push(label);
    if (this.history.length > this.config.windowSize) {
      this.history.shift();
    }

    // Count majority vote
    const counts: Record<string, number> = {};
    for (const item of this.history) {
      counts[item] = (counts[item] || 0) + 1;
    }

    let topSign = label;
    let maxCount = 0;
    for (const [sign, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        topSign = sign;
      }
    }

    // Track stability
    if (topSign === this.candidateSign) {
      this.consecutiveCount++;
    } else {
      this.candidateSign = topSign;
      this.consecutiveCount = 1;
    }

    const stabilityRatio = Math.min(
      1,
      maxCount / this.config.minAgreementCount
    );

    // Check acceptance criteria
    const isSufficientAgreement = maxCount >= this.config.minAgreementCount;
    const isCooldownElapsed =
      topSign !== this.lastAcceptedSign ||
      now - this.lastAcceptedTime > this.config.cooldownMs;

    if (isSufficientAgreement && isCooldownElapsed) {
      this.lastAcceptedSign = topSign;
      this.lastAcceptedTime = now;
      this.history = []; // Reset window after acceptance
      this.consecutiveCount = 0;
      onSignAccepted(topSign, confidence);
      return { isCandidateStable: true, stabilityRatio: 1 };
    }

    return { isCandidateStable: false, stabilityRatio };
  }

  public reset(): void {
    this.history = [];
    this.lastAcceptedSign = null;
    this.lastAcceptedTime = 0;
    this.consecutiveCount = 0;
    this.candidateSign = null;
  }
}
