import { CameraFacingMode, CameraStatus } from "@/types";

export interface CameraConfig {
  facingMode: CameraFacingMode;
  deviceId?: string;
  idealWidth?: number;
  idealHeight?: number;
}

export class CameraService {
  private currentStream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  public isSupported(): boolean {
    return typeof window !== "undefined" &&
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  public async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    if (!this.isSupported()) return [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((d) => d.kind === "videoinput");
    } catch (err) {
      console.warn("Failed to enumerate video devices:", err);
      return [];
    }
  }

  public async startCamera(
    videoElement: HTMLVideoElement,
    config: CameraConfig
  ): Promise<{ stream: MediaStream; status: CameraStatus; error?: string }> {
    if (!this.isSupported()) {
      return {
        stream: null as any,
        status: "unsupported",
        error: "Camera API is not supported in this browser."
      };
    }

    this.stopCamera();
    this.videoElement = videoElement;

    const constraints: MediaStreamConstraints = {
      audio: false,
      video: config.deviceId
        ? {
            deviceId: { exact: config.deviceId },
            width: { ideal: config.idealWidth || 1280 },
            height: { ideal: config.idealHeight || 720 },
          }
        : {
            facingMode: { ideal: config.facingMode },
            width: { ideal: config.idealWidth || 1280 },
            height: { ideal: config.idealHeight || 720 },
          },
    };

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        // Fallback with basic constraints if ideal resolution failed on mobile
        console.warn("Ideal resolution camera request failed, retrying with flexible constraints:", err);
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: config.facingMode },
        });
      }

      this.currentStream = stream;
      videoElement.srcObject = stream;
      videoElement.setAttribute("playsinline", "true");
      videoElement.muted = true;

      await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          videoElement
            .play()
            .then(() => resolve())
            .catch(reject);
        };
        videoElement.onerror = (err) => reject(err);
      });

      return { stream, status: "active" };
    } catch (err: any) {
      console.error("Camera access error:", err);
      let status: CameraStatus = "error";
      let error = "Failed to access camera.";

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        status = "denied";
        error = "Camera permission was denied. Please allow camera access in browser settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        status = "not-found";
        error = "No camera was detected on this device.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        status = "busy";
        error = "Camera is already in use by another application or tab.";
      }

      return { stream: null as any, status, error };
    }
  }

  public stopCamera(): void {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
      this.currentStream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  public getActiveStream(): MediaStream | null {
    return this.currentStream;
  }
}

export const cameraService = new CameraService();
