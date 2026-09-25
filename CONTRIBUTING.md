# Contributing to SignBridge AI

Thank you for your interest in contributing to **SignBridge AI**! We welcome contributions to make sign language interpretation more accessible, accurate, and widespread.

---

## 🛠️ Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd HackNext
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Verify production build before submitting:**
   ```bash
   npm run build
   ```

---

## 🖐️ Adding New Indian Sign Language (ISL) Signs

To add a new sign to the interpreter vocabulary:

1. **Update Vocabulary Configuration:**
   - Open [`src/config/signVocabulary.ts`](file:///p:/TempProject/HackNext/src/config/signVocabulary.ts).
   - Add a new `SignItem` entry specifying:
     - `label` (e.g. `"FAMILY"`)
     - `hindiLabel` (e.g. `"परिवार"`)
     - `category` (`GREETING`, `EMERGENCY`, `ESSENTIALS`, `COMMON`, etc.)
     - `movementType` (`STATIC`, `DYNAMIC_WAVE`, `DYNAMIC_SWIPE`, `DYNAMIC_TAP`, `TWO_HANDED`)
     - `gestureGuide`

2. **Implement Geometric Rule (or Train ONNX Model):**
   - In [`src/models/GeometricSignClassifier.ts`](file:///p:/TempProject/HackNext/src/models/GeometricSignClassifier.ts), add the geometric conditions for finger extension, hand position, and motion dynamics.

3. **Update Sentence Grammar:**
   - In [`src/translation/sentenceBuilder.ts`](file:///p:/TempProject/HackNext/src/translation/sentenceBuilder.ts), add any idiomatic multi-token combinations.

---

## 🔀 Pull Request Process

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/new-isl-gesture
   ```
2. Commit your changes following conventional commit syntax (`feat:`, `fix:`, `docs:`, `perf:`).
3. Test camera input, landmark overlay, and speech synthesis.
4. Ensure `npm run build` runs cleanly with zero TypeScript errors.
5. Submit your Pull Request for review!
