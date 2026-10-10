// Web Worker that runs real vision models in the browser with Transformers.js
// (ONNX Runtime Web). Running here keeps the UI thread responsive while
// models download and inference runs.

const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';

let libPromise = null;
const pipelines = new Map();

function getLib() {
  if (!libPromise) {
    libPromise = import(/* @vite-ignore */ TRANSFORMERS_URL).then((lib) => {
      lib.env.allowLocalModels = false;
      return lib;
    });
  }
  return libPromise;
}

// Models that run on the GPU via WebGPU when the browser supports it
// (fp32 weights), falling back to quantized (q8) WASM on the CPU.
const GPU_MODELS = new Set(['Xenova/yolos-tiny']);

async function createPipeline(task, model) {
  const { pipeline } = await getLib();
  const progress_callback = (info) => self.postMessage({ type: 'progress', model, info });
  if (GPU_MODELS.has(model) && self.navigator?.gpu) {
    try {
      const adapter = await self.navigator.gpu.requestAdapter();
      if (adapter) {
        const pipe = await pipeline(task, model, { device: 'webgpu', dtype: 'fp32', progress_callback });
        return { pipe, backend: 'WebGPU' };
      }
    } catch (err) {
      console.warn('WebGPU unavailable, falling back to WASM:', err);
    }
  }
  const pipe = await pipeline(task, model, { device: 'wasm', dtype: 'q8', progress_callback });
  return { pipe, backend: 'WASM' };
}

function getPipeline(task, model) {
  const key = `${task}::${model}`;
  if (!pipelines.has(key)) {
    const p = createPipeline(task, model).then(({ pipe, backend }) => {
      self.postMessage({ type: 'ready', model, backend });
      return pipe;
    });
    // Allow a retry if loading fails (e.g. flaky network)
    p.catch(() => pipelines.delete(key));
    pipelines.set(key, p);
  }
  return pipelines.get(key);
}

self.onmessage = async ({ data }) => {
  const { id, action, model, image } = data;
  try {
    const { RawImage } = await getLib();
    const raw = new RawImage(new Uint8ClampedArray(image.data), image.width, image.height, 3);

    if (action === 'detect') {
      const detector = await getPipeline('object-detection', model);
      const t0 = performance.now();
      const output = await detector(raw, { threshold: data.threshold ?? 0.5, percentage: true });
      self.postMessage({ type: 'result', id, output, ms: performance.now() - t0 });
      return;
    }

    if (action === 'classify') {
      const classifier = await getPipeline('zero-shot-image-classification', model);
      const t0 = performance.now();
      const output = await classifier(raw, data.labels, { hypothesis_template: '{}' });
      self.postMessage({ type: 'result', id, output, ms: performance.now() - t0 });
      return;
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (err) {
    self.postMessage({ type: 'error', id, message: err?.message || String(err) });
  }
};
