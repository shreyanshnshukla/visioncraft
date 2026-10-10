// Main-thread client for the vision worker: request/response over postMessage,
// a tiny model-status store for the UI, and image -> RGB pixel helpers.
import { useSyncExternalStore } from 'react';

export const DETECTION_MODELS = [
  { id: 'Xenova/yolos-tiny', name: 'YOLOS-Tiny (ViT detector)', size: '~7 MB' },
  { id: 'Xenova/detr-resnet-50', name: 'DETR ResNet-50 (Facebook)', size: '~43 MB' },
];
export const CLIP_MODEL = { id: 'Xenova/clip-vit-base-patch32', name: 'OpenAI CLIP ViT-B/32', size: '~90 MB' };

// Real photos (CORS-enabled) that the live models can run on
const HF = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/';
export const SAMPLE_PHOTOS = [
  { id: 'photo-street', title: 'City Street', url: HF + 'city-streets.jpg' },
  { id: 'photo-football', title: 'Football Match', url: HF + 'football-match.jpg' },
  { id: 'photo-cats', title: 'Cats on a Couch', url: HF + 'cats.jpg' },
  { id: 'photo-airport', title: 'Airport Apron', url: HF + 'airport.jpg' },
  { id: 'photo-savanna', title: 'Savanna Wildlife', url: HF + 'savanna.jpg' },
  { id: 'photo-corgi', title: 'Corgi', url: HF + 'corgi.jpg' },
];

// ---------- worker plumbing ----------
let worker = null;
let nextId = 1;
const pending = new Map();

// ---------- status store ----------
// status: idle | loading | ready | error ; progress 0-100 while downloading
let modelState = {};
let lastLatency = null;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
function setModel(model, patch) {
  modelState = { ...modelState, [model]: { ...(modelState[model] || {}), ...patch } };
  emit();
}

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('./visionWorker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        const { status, file, loaded, total } = data.info || {};
        if (status === 'progress' && total) {
          const files = { ...(modelState[data.model]?.files || {}), [file]: [loaded, total] };
          const sum = Object.values(files).reduce((a, [l, t]) => [a[0] + l, a[1] + t], [0, 0]);
          setModel(data.model, { status: 'loading', files, progress: Math.round((sum[0] / sum[1]) * 100) });
        } else if (status === 'initiate' && modelState[data.model]?.status !== 'loading') {
          setModel(data.model, { status: 'loading', progress: 0 });
        }
        return;
      }
      if (data.type === 'ready') {
        setModel(data.model, { status: 'ready', progress: 100 });
        return;
      }
      const req = pending.get(data.id);
      if (!req) return;
      pending.delete(data.id);
      if (data.type === 'result') {
        lastLatency = Math.round(data.ms);
        setModel(req.model, { status: 'ready', progress: 100, lastMs: lastLatency });
        req.resolve({ output: data.output, ms: data.ms });
      } else {
        setModel(req.model, { status: 'error', error: data.message });
        req.reject(new Error(data.message));
      }
    };
  }
  return worker;
}

function run(message) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, model: message.model });
    if (!modelState[message.model] || modelState[message.model].status === 'error') {
      setModel(message.model, { status: 'loading', progress: 0, error: null });
    }
    getWorker().postMessage({ ...message, id });
  });
}

export const detectObjects = (image, model, threshold = 0.3) =>
  run({ action: 'detect', model, image, threshold });

export const classifyZeroShot = (image, labels) =>
  run({ action: 'classify', model: CLIP_MODEL.id, image, labels });

const IDLE = Object.freeze({ status: 'idle' });
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
export function useModelStatus(model) {
  return useSyncExternalStore(subscribe, () => modelState[model] || IDLE);
}
export function useLastLatency() {
  return useSyncExternalStore(subscribe, () => lastLatency);
}

// ---------- image helpers ----------
function toRGB(ctx, width, height) {
  const rgba = ctx.getImageData(0, 0, width, height).data;
  const rgb = new Uint8ClampedArray(width * height * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    rgb[j] = rgba[i]; rgb[j + 1] = rgba[i + 1]; rgb[j + 2] = rgba[i + 2];
  }
  return { data: rgb, width, height };
}

function drawScaled(source, srcW, srcH, maxSide) {
  const scale = Math.min(1, maxSide / Math.max(srcW, srcH));
  const width = Math.max(1, Math.round(srcW * scale));
  const height = Math.max(1, Math.round(srcH * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);
  return { canvas, ctx, width, height };
}

// Load any image URL (http, data:, blob:, SVG) and return RGB pixels + natural size
export function loadImagePixels(url, maxSide = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 500;
      const { ctx, width, height } = drawScaled(img, w, h, maxSide);
      resolve({ pixels: toRGB(ctx, width, height), naturalWidth: w, naturalHeight: h });
    };
    img.onerror = () => reject(new Error('Could not load image (it may block cross-origin access).'));
    img.src = url;
  });
}

// Grab the current webcam frame as a JPEG data URL
export function captureVideoFrame(video, maxSide = 960) {
  const { canvas } = drawScaled(video, video.videoWidth, video.videoHeight, maxSide);
  return canvas.toDataURL('image/jpeg', 0.92);
}

// Stable colour per class label
const PALETTE = ['#00f0ff', '#ff007f', '#00ff87', '#f59e0b', '#8a2be2', '#38bdf8', '#f43f5e', '#a3e635', '#fb923c', '#e879f9'];
export function colorForLabel(label) {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
