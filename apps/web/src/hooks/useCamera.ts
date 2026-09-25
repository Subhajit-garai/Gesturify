"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CameraFacingMode, CameraStatus } from "@/types";
import { cameraService } from "@/vision/camera";

export function useCamera() {
  const [facingMode, setFacingMode] = useState<CameraFacingMode>("environment");
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(undefined);
  const [resolution, setResolution] = useState<string>("1280x720");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const refreshDevices = useCallback(async () => {
    const devs = await cameraService.getAvailableCameras();
    setDevices(devs);
  }, []);

  const startCamera = useCallback(
    async (mode?: CameraFacingMode, deviceId?: string) => {
      if (!videoRef.current) return;
      const targetMode = mode || facingMode;
      setStatus("requesting");
      setErrorMessage(null);

      const res = await cameraService.startCamera(videoRef.current, {
        facingMode: targetMode,
        deviceId: deviceId || activeDeviceId,
      });

      setStatus(res.status);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        const stream = res.stream;
        const videoTrack = stream?.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          if (settings.width && settings.height) {
            setResolution(`${settings.width}x${settings.height}`);
          }
        }
      }
    },
    [facingMode, activeDeviceId]
  );

  const toggleFacingMode = useCallback(async () => {
    const nextMode: CameraFacingMode =
      facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    setActiveDeviceId(undefined);
    await startCamera(nextMode, undefined);
  }, [facingMode, startCamera]);

  const selectDevice = useCallback(
    async (deviceId: string) => {
      setActiveDeviceId(deviceId);
      await startCamera(facingMode, deviceId);
    },
    [facingMode, startCamera]
  );

  const stopCamera = useCallback(() => {
    cameraService.stopCamera();
    setStatus("idle");
  }, []);

  useEffect(() => {
    refreshDevices();
    return () => {
      cameraService.stopCamera();
    };
  }, [refreshDevices]);

  return {
    videoRef,
    facingMode,
    status,
    errorMessage,
    devices,
    activeDeviceId,
    resolution,
    startCamera,
    stopCamera,
    toggleFacingMode,
    selectDevice,
  };
}
