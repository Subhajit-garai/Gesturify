# SignBridge AI — Documentation Portal (`@signbridge/docs`)

This package is the technical documentation portal for the **SignBridge AI** monorepo.

## 🚀 Running the Docs Portal

```bash
# From repository root:
pnpm run dev:docs

# Or with Turbo:
turbo dev --filter=@signbridge/docs
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📚 What's Documented Here

1. **System Execution Flow**:
   - Camera Capture -> MediaPipe Vision -> Normalization -> Sequence Buffer -> Temporal ML Model -> Prediction Smoothing -> Sentence Builder -> Text-to-Speech.
2. **Files & Function APIs**:
   - Comprehensive catalog of all modules in `apps/web/src/` (`vision`, `models`, `translation`, `speech`, `hooks`, `components`).
   - Function signatures, parameter types, return values, and implementation descriptions.
3. **Data Contracts**:
   - Format of the 147-dimensional normalized feature vectors.
   - Format of the 30-frame sequence buffer (`[30, 147]`).
   - Format of the prediction objects and confidence metrics.
