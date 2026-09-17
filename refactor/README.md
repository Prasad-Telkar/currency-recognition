# CurrencyAI — P0/P1 Refactor

Implements the first five items from the architecture report's "Immediate
Next Steps," in order, against the actual existing project:

1. **Split `App.jsx` into components/hooks/services** (P0)
2. **Backward-compatible `/predict` response schema** with a legacy shim (P0)
3. **Real image quality checks** — blur + lighting, OpenCV-based (P0)
4. **Confidence-level system + low-confidence guidance UI** (P1)
5. **i18n scaffolding** — English + Hindi via `react-i18next` (P1)

Everything below was actually run and tested, not just written — see
"What was tested" at the bottom for the real request/response pairs.

---

## What changed and why

### 1. Frontend split (`frontend/src/`)

The old single ~40KB `App.jsx` is now:

```
src/
├── App.jsx                          # composition only — ~70 lines
├── App.css                          # unchanged visually, some new rules appended
├── components/
│   ├── Navbar.jsx / UserMenu.jsx / Footer.jsx
│   ├── Hero.jsx / Globe.jsx
│   ├── UploadBox.jsx / ResultCard.jsx / ConverterCard.jsx
│   ├── ConfidenceGuidance.jsx        # NEW
│   ├── HistoryList.jsx / CurrencyGrid.jsx / FeaturesSection.jsx
│   ├── AuthScreen.jsx
│   └── icons/SocialIcons.jsx
├── features/
│   ├── recognition/useRecognition.js # upload/predict state + logic
│   ├── conversion/useConversion.js   # target currency + rate state
│   └── history/useHistory.js         # NEW: search/sort/export/clear
├── hooks/
│   ├── useVoice.js                   # play/pause/resume/stop
│   └── useAuth.js
├── services/
│   └── api.js                        # the ONE place that calls fetch()
├── utils/
│   └── confidence.js                 # NEW: level bucketing + guidance tips
├── data/
│   └── currencies.js                 # moved out of App.jsx
└── i18n/
    ├── en.json / hi.json             # NEW
    └── index.js
```

**Nothing in the UI/behavior changed except what's called out below** —
this is a like-for-like extraction, not a redesign. Same class names, same
CSS, same visual result.

### 2. Backward-compatible `/predict` schema (`backend/`)

The backend now returns:

```json
{
  "success": true,
  "prediction": { "country": "India", "currency_code": "INR", ..., "confidence_level": "Moderate" },
  "image_analysis": { "quality_score": 100, "blur_detected": false, "lighting_quality": "Good" },
  "metadata": { "processing_time_ms": 447, "model_version": "v1.0-mock" },
  "legacy": { "label": "India_100", "confidence": 78.2 }
}
```

`frontend/src/services/api.js` → `normalizePrediction()` reads
`prediction.*` when present and falls back to `legacy`/`label` parsing
when it isn't — **verified against both shapes** (see test output below),
so this backend and the old one are both safe to point the frontend at.

### 3. Real image quality checks (`backend/services/quality_service.py`)

Two OpenCV techniques, genuinely running (not mocked):

- **Blur**: variance of the Laplacian. Below threshold → hard failure.
- **Lighting**: mean grayscale brightness. Too dark/bright → soft penalty.
- **Resolution**: shorter side < 200px → hard failure.

**A real bug was caught and fixed during testing**: the first version of
the scoring formula capped each defect's penalty, so a genuinely blurry
image still scored 60/100 and passed the quality gate. Fixed by treating
blur and undersized images as hard failures (scored 5–30) instead of a
capped deduction — see the comment block at the top of
`quality_service.py` for the full explanation.

`/predict` now rejects low-quality images with `422 LOW_QUALITY_IMAGE`
**before** even calling the (currently mocked) recognition model.

### 4. Confidence-level system + guidance (P1)

- Backend: `schemas/prediction_schema.py` buckets confidence into
  Very High / High / Moderate / Low using the thresholds from the
  architecture report.
- Frontend: `utils/confidence.js` does the same bucketing client-side (as
  a fallback for legacy-schema backends), and
  `components/ConfidenceGuidance.jsx` shows concrete tips — better
  lighting, full framing, steady hands, etc. — whenever confidence comes
  back Moderate or Low. Renders nothing for High/Very High.
- `ResultCard.jsx` also now shows the quality-analysis strip (quality
  score, blur, lighting) since the backend sends it.

### 5. i18n scaffolding (P1)

`react-i18next` + `i18next`, two languages (`en.json`, `hi.json`) covering
nav, hero, upload box, result card, converter, features, currency guide,
history, and auth. Adding a third language is one JSON file + one line in
`i18n/index.js` — no component changes.

**Also included, since it was already promised in the plan**: history
now has search, sort (newest/oldest/highest-confidence), CSV export, and
per-entry delete — implemented in `useHistory.js` / `HistoryList.jsx`.

---

## Installation

```bash
# Frontend — two new packages beyond what's already installed (three, lucide-react)
npm install react-i18next i18next

# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
```

## Running it

```bash
# Backend
cd backend
python app.py            # http://localhost:5000

# Frontend (from your existing project root, with the new src/ files dropped in)
npm run dev
```

---

## What was tested (actually run, not hypothetical)

The Flask app was started for real and hit with `curl` using generated
test images (a sharp image, a Gaussian-blurred version of the same image,
and a 40×20 tiny crop):

| Test | Expected | Actual |
|---|---|---|
| Sharp, well-lit, full-size image | 200, quality_score high | ✅ 200, quality_score: 100 |
| Heavily blurred version of the same image | 422 LOW_QUALITY_IMAGE | ✅ 422, quality_score: 5 *(after the scoring bug fix — first pass wrongly returned 200/score 60)* |
| 40×20 tiny image | 422 LOW_QUALITY_IMAGE | ✅ 422, quality_score: 15 |
| No image field in the request | 400 NO_IMAGE | ✅ 400 |
| `GET /currencies` | full list, 200 | ✅ 200 |
| `GET /currencies/INR` | India's entry, 200 | ✅ 200 |
| `GET /currencies/ZZZ` | 404 NOT_FOUND | ✅ 404 |

Also statically verified across all 33 frontend files:
- Every relative import resolves to a real file (no typo'd paths)
- Every named import matches an actual export in its target file
- Every `.jsx`/`.js` file has balanced braces/parens (no truncated code)
- Both JSON translation files parse as valid JSON
- The frontend's response-normalization function was run against the
  *actual* captured backend response (not a hand-written fixture) and
  against a legacy-only stub — both produced correct output

All Python files compile (`py_compile`) and the Flask app itself was
imported and instantiated successfully, with all five expected routes
registered (`/predict`, `/currencies`, `/currencies/<code>`, `/health`,
plus Flask's static route).

---

## What's next

Per the roadmap, the next P1/P2 items are: DB-backed history (schema
already designed to match `useHistory.js`'s entry shape 1:1), real finance
news integration, and wiring a real trained model into
`inference_service.py` (the function signature and return shape are
already the contract — only the body needs to change).
