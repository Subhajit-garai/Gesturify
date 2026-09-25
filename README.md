# SignBridge AI — Turborepo Monorepo

Real-Time Indian Sign Language (ISL) Interpreter, Technical Documentation Portal, and Telemetry Admin Intelligence Dashboard powered by **Next.js 16**, **React 19**, **Turborepo**, **pnpm workspaces**, **Tailwind CSS v4**, **shadcn/ui**, and **Lenis**.

---

## 📦 Workspace Applications

| Package | Directory | Default Port | Description |
| :--- | :--- | :--- | :--- |
| **`@signbridge/web`** | [`apps/web`](file:///p:/TempProject/HackNext/apps/web) | `http://localhost:3000` | Real-time Indian Sign Language (ISL) browser interpreter using rear camera, MediaPipe Tasks Vision, ONNX Runtime Web, and Web Speech API. |
| **`@signbridge/docs`** | [`apps/docs`](file:///p:/TempProject/HackNext/apps/docs) | `http://localhost:3001` | Technical documentation portal explaining the 8-stage execution flow, architecture, and function API catalog for every file. |
| **`@signbridge/admin`** | [`apps/admin`](file:///p:/TempProject/HackNext/apps/admin) | `http://localhost:3002` | Admin intelligence dashboard with log file summaries, component usage telemetry, and camera/model error diagnostic resolutions. |

---

## 🚀 Quick Start

### 1. Installation

Ensure Node.js 18+ and pnpm are installed.

```bash
# Install all dependencies across the monorepo
pnpm install
```

### 2. Development

Run any application individually or all concurrently via Turborepo:

```bash
# Run web interpreter (Port 3000)
pnpm run dev:web

# Run documentation portal (Port 3001)
pnpm run dev:docs

# Run admin dashboard (Port 3002)
pnpm run dev:admin

# Run all applications concurrently via Turborepo
pnpm run dev
```

### 3. Production Build Verification

```bash
# Build all workspaces with Turborepo caching
pnpm run build

# Or build individually
pnpm run build:web
pnpm run build:docs
pnpm run build:admin
```

---

## 🏛️ Monorepo Structure

```text
HackNext/
├── pnpm-workspace.yaml          # pnpm workspace configuration
├── turbo.json                   # Turborepo task pipeline configuration
├── package.json                 # Monorepo root package
├── tasks.json                   # Project task tracking log
├── .gitignore                   # Git ignore patterns
├── .gitattributes               # Line ending & binary attributes
├── apps/
│   ├── web/                     # Next.js 16 ISL Real-Time Interpreter
│   │   ├── src/
│   │   │   ├── vision/          # Camera & MediaPipe landmark extraction
│   │   │   ├── models/          # Modular ONNX & Geometric heuristic models
│   │   │   ├── translation/     # Prediction smoother & sentence builder
│   │   │   ├── speech/          # Web Speech TTS & STT
│   │   │   ├── components/      # UI components & shadcn primitives
│   │   │   │   └── ui/          # Button, Card, Badge, Progress
│   │   │   └── app/             # App Router layout & page with Lenis
│   │   └── package.json
│   ├── docs/                    # Next.js 16 Technical Documentation Portal
│   │   ├── src/
│   │   │   ├── data/            # Full execution flow & function API metadata
│   │   │   └── app/             # Interactive docs viewer
│   │   └── package.json
│   └── admin/                   # Next.js 16 Admin Log Intelligence Dashboard
│       ├── src/
│       │   └── app/             # KPI scorecard, log summaries & live explorer
│       └── package.json
```

---

## 📄 License

MIT License. Built for accessibility and inclusive communication.
"# HackNextS2" 
