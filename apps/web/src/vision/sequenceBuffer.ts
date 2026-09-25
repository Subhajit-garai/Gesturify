import { FEATURES_PER_FRAME } from "./landmarkProcessor";

export class SequenceBuffer {
  private buffer: Float32Array[] = [];
  private readonly targetLength: number;

  constructor(targetLength = 30) {
    this.targetLength = targetLength;
  }

  public push(frameFeatures: Float32Array): void {
    if (this.buffer.length >= this.targetLength) {
      this.buffer.shift();
    }
    this.buffer.push(new Float32Array(frameFeatures));
  }

  public isReady(): boolean {
    return this.buffer.length >= this.targetLength;
  }

  public getLength(): number {
    return this.buffer.length;
  }

  public getTargetLength(): number {
    return this.targetLength;
  }

  public getFillRatio(): number {
    return Math.min(1, this.buffer.length / this.targetLength);
  }

  /**
   * Returns a flattened Float32Array of shape [targetLength * FEATURES_PER_FRAME]
   * If buffer has fewer than targetLength, pads with first frame or zero
   */
  public getFlattenedSequence(): Float32Array {
    const totalElements = this.targetLength * FEATURES_PER_FRAME;
    const result = new Float32Array(totalElements);

    if (this.buffer.length === 0) {
      return result;
    }

    const currentLen = this.buffer.length;
    const paddingCount = this.targetLength - currentLen;

    // Pad beginning with first available frame to enable early recognition
    for (let i = 0; i < paddingCount; i++) {
      result.set(this.buffer[0], i * FEATURES_PER_FRAME);
    }

    for (let i = 0; i < currentLen; i++) {
      result.set(this.buffer[i], (paddingCount + i) * FEATURES_PER_FRAME);
    }

    return result;
  }

  public getFrames(): Float32Array[] {
    return [...this.buffer];
  }

  public clear(): void {
    this.buffer = [];
  }
}
