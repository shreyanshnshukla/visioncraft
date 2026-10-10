# VisionCraft AI — In-Browser Computer Vision Workbench

**Live demo:** https://shreyanshnshukla.github.io/visioncraft/

VisionCraft runs real computer-vision models **entirely in your browser**: no server, no API keys, and your images never leave your device. Pick a photo, upload your own or use your webcam, and watch a Vision Transformer detect objects. You can also classify any image against your own text labels with OpenAI's CLIP.

## Features

| | What it does | Model |
|---|---|---|
| **Object Detection** (live) | Detects 80 COCO classes on sample photos, uploads or webcam captures, with confidence and NMS IoU thresholds and per-run latency | `Xenova/yolos-tiny` (default) or `Xenova/detr-resnet-50` |
| **CLIP Zero-Shot** (live) | Scores an image against any free-text labels you type; no training needed | `Xenova/clip-vit-base-patch32` |
| **BBox Annotator** | Draw boxes with mouse or touch and export them as **YOLO**, **COCO JSON** or **Pascal VOC XML** | — |
| Embedding Projection, Feature Maps & Grad-CAM, MLOps Dashboard | UI demos of ML tooling built on synthetic data (labelled *Demo* in the app) | — |

## How it works

```
React UI ──postMessage──▶ Web Worker ──▶ Transformers.js ──▶ ONNX Runtime Web (WebGPU / WASM)
   ▲                         │                     │
   └──── boxes / scores ◀────┘          quantized ONNX weights from the Hugging Face Hub
                                        (downloaded once, then cached by the browser)
```

- **Off the main thread:** models load and run inside a module Web Worker (`src/ml/visionWorker.js`), so the UI never freezes during the download or during inference.
- **One pixel pipeline:** every input (remote photo, uploaded file, webcam frame, or SVG scene) is drawn to a canvas, downscaled, converted to RGB and sent to the worker as a typed array (`src/ml/vision.js`).
- **GPU when available:** YOLOS-Tiny runs on WebGPU (fp32) when the browser supports it, and falls back to quantized q8 weights on WASM otherwise.
- **Non-maximum suppression:** a greedy per-class NMS pass (`nonMaxSuppression` in `src/ml/vision.js`) removes the overlapping duplicate boxes that DETR-style detectors produce.
- **Live model status:** a small external store tracks download progress per model, ready/error state and real inference latency, and React reads it with `useSyncExternalStore`.
- **Overlays:** detections come back as normalized boxes and are drawn on an SVG overlay in the image's own pixel space, so they line up at any screen size.

## Tech stack

React 19 · Vite · Transformers.js 3 · ONNX Runtime Web (WebGPU + WASM) · Web Workers · Canvas API · lucide-react · GitHub Actions → GitHub Pages

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Each model is downloaded the first time you run it (YOLOS-Tiny ≈ 7 MB, DETR ≈ 43 MB, CLIP ≈ 90 MB) and cached by the browser after that.

## Deployment

Every push to `main` builds and deploys to GitHub Pages through `.github/workflows/deploy.yml`.

---

Built by [Shreyansh Nandan Shukla](https://github.com/shreyanshnshukla).
