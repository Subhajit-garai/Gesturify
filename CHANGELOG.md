# Changelog

All notable changes to **Gesturify AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-25

### Added

- **Core Architecture**:
  - Upgraded to latest Next.js 16 (App Router), React 19, and Tailwind CSS v4.
  - Multi-threaded WebAssembly & WebGL acceleration for browser inference.
- **Camera System**:
  - Rear-camera (`facingMode: environment`) default with front-camera toggle.
  - Device enumeration, dynamic resolution detection, and comprehensive permission error diagnostics.
- **Computer Vision Pipeline**:
  - MediaPipe Tasks Vision integration for 21-point dual hand landmarks and upper-body pose landmarks.
  - 60 FPS neon skeleton visualizer overlay with joint indicators and handedness badges.
- **Landmark Processing & ML**:
  - Scale-invariant 147-dimensional feature normalizer relative to wrist/shoulder origins.
  - 30-frame rolling sequence buffer for temporal sign dynamics.
  - Modular `SignRecognitionModel` interface supporting ONNX Runtime Web (`onnxruntime-web`) and real-time Geometric Heuristic classifiers.
  - Prediction smoothing with majority voting, temporal locking, and cooldown hysteresis.
- **Translation & Audio**:
  - ISL sentence builder translating sign sequences into natural English and Hindi.
  - Web Speech API Text-to-Speech (TTS) with Indian English accent support.
  - Reverse Communication mode (Speech-to-Text via microphone converting voice to animated visual sign avatar).
- **UI & Telemetry**:
  - Modern futuristic glassmorphism dark theme.
  - Technical Metrics HUD (FPS, inference latency, vision pipeline latency, buffer fullness).
  - Searchable ISL vocabulary drawer with gesture execution guides.
  - Hackathon Demo Bar for instant sign simulation.
- **Git & Repository**:
  - Added `.gitignore`, `.gitattributes`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE.md`, and `.env.example`.
