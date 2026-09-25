# Gesturify AI — Admin Intelligence Dashboard (`@gesturify/admin`)

This package is the telemetry, monitoring, and log intelligence dashboard for **Gesturify AI**.

## 🚀 Running the Admin Dashboard

```bash
# From repository root:
pnpm run dev:admin

# Or with Turbo:
turbo dev --filter=@gesturify/admin
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## 📊 Features & Intelligence

1. **Executive Component Log Summaries**:
   - Status categorization (`HEALTHY`, `ATTENTION`, `DEGRADED`).
   - Log summaries for Camera API, MediaPipe Vision, ONNX Temporal Model, and Web Speech API.
   - Identified root causes (e.g. `Camera NotAllowedError`, `GPU context fallback to CPU`, `ONNX model 404 fallback`).
   - Prescribed resolutions and mitigations.
2. **Live Telemetry Stream**:
   - Filterable by level (`ERROR`, `WARN`, `INFO`, `SUCCESS`).
   - Filterable by component (`CAMERA`, `VISION`, `MODEL`, `SPEECH`).
   - Detailed stack trace and client user-agent inspection.
3. **Report Export**:
   - Export structured JSON / Markdown diagnostic telemetry report for engineering audits.
