import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Plus, Trash2, CheckCircle, Upload, Loader2, Info } from 'lucide-react';
import { classifyZeroShot, loadImagePixels, SAMPLE_PHOTOS, CLIP_MODEL } from '../ml/vision';
import ModelStatus from './ModelStatus';

const DEFAULT_PROMPTS = [
  'a photo of a busy city street with cars',
  'a photo of people playing football',
  'a photo of cats sleeping on a couch',
  'a photo of airplanes at an airport',
  'a photo of wild animals in the savanna',
];

const SUGGESTIONS = [
  'a photo of a dog',
  'a photo taken at night',
  'a circuit board with a defect',
  'a medical chest x-ray',
  'a supermarket shelf with drinks',
  'a cartoon illustration',
  'a photo of food',
];

export default function ZeroShotStudio({ dataset }) {
  const images = [
    ...SAMPLE_PHOTOS.map((p) => ({ ...p, kind: 'photo' })),
    ...dataset.images.map((i) => ({ ...i, kind: 'synthetic' })),
  ];
  const [selected, setSelected] = useState(images[0]);
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);
  const [newPromptText, setNewPromptText] = useState('');
  const [scores, setScores] = useState([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [ms, setMs] = useState(null);
  const token = useRef(0);

  // Re-run CLIP whenever the image or the prompt set changes (debounced)
  useEffect(() => {
    if (prompts.length === 0) { setScores([]); return undefined; }
    const t = ++token.current;
    const timer = setTimeout(async () => {
      setRunning(true);
      setError(null);
      try {
        const { pixels } = await loadImagePixels(selected.url, 448);
        const { output, ms: took } = await classifyZeroShot(pixels, prompts);
        if (t !== token.current) return;
        setScores(output.map((o) => ({ prompt: o.label, score: o.score })));
        setMs(Math.round(took));
      } catch (e) {
        if (t === token.current) setError(e.message);
      } finally {
        if (t === token.current) setRunning(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [selected.url, prompts]);

  const addPrompt = (text) => {
    const txt = (text ?? newPromptText).trim();
    if (txt && !prompts.includes(txt)) setPrompts([...prompts, txt]);
    if (text === undefined) setNewPromptText('');
  };
  const removePrompt = (txt) => setPrompts(prompts.filter((p) => p !== txt));

  const handleUpload = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSelected({ id: `upload-${Date.now()}`, title: file.name, url: ev.target.result, kind: 'upload' });
    reader.readAsDataURL(file);
  };

  // Prompts not yet scored (just added) are shown at the bottom without a bar
  const scored = new Set(scores.map((s) => s.prompt));
  const rows = [
    ...scores.filter((s) => prompts.includes(s.prompt)),
    ...prompts.filter((p) => !scored.has(p)).map((p) => ({ prompt: p, score: null })),
  ];

  return (
    <div className="grid-2">

      {/* Left: image + prompts */}
      <div className="glass-panel" style={{ padding: '20px', minWidth: 0 }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Sparkles size={20} color="var(--primary-magenta)" />
            CLIP Zero-Shot Classification
            <span className="badge-status badge-emerald">Live model</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Classify any image against free-text labels – no training. CLIP embeds the image and every prompt, then softmaxes their cosine similarities.
          </p>
        </div>

        <div className="thumb-strip">
          {images.map((img) => (
            <button key={img.id} type="button" className={`thumb ${selected.id === img.id ? 'active' : ''}`} onClick={() => setSelected(img)}>
              <img src={img.url} alt="" crossOrigin={img.kind === 'photo' ? 'anonymous' : undefined} />
              <span>{img.title}</span>
            </button>
          ))}
          <label className="thumb" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> <span>Upload</span>
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          </label>
        </div>

        <div className="viewport" style={{ aspectRatio: '16/10', marginBottom: 16 }}>
          <img src={selected.url} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          {running && <div className="viewport-status"><Loader2 size={16} className="spin" /> Running CLIP…</div>}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <input
            type="text"
            className="input-custom"
            placeholder="Add a label, e.g. 'a photo of a golden retriever'"
            value={newPromptText}
            onChange={(e) => setNewPromptText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPrompt()}
            style={{ flex: 1, minWidth: 0 }}
            aria-label="New label"
          />
          <button className="btn-primary" onClick={() => addPrompt()} style={{ padding: '8px 14px' }}>
            <Plus size={16} /> Add
          </button>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Suggestions:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SUGGESTIONS.filter((s) => !prompts.includes(s)).map((s) => (
            <button key={s} type="button" className="chip" onClick={() => addPrompt(s)}>+ {s}</button>
          ))}
        </div>
      </div>

      {/* Right: probabilities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <ModelStatus model={CLIP_MODEL.id} name={CLIP_MODEL.name} size={CLIP_MODEL.size} />
          {ms != null && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 8 }} className="mono">Last inference: {ms} ms · {prompts.length} labels</div>}
        </div>

        <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
          <h2 className="panel-title" style={{ fontSize: '1.1rem' }}>
            <CheckCircle size={20} color="var(--primary-emerald)" /> Softmax probabilities
          </h2>
          {error && <div className="note-banner" style={{ marginBottom: 12 }}>CLIP failed: {error}</div>}
          {prompts.length === 0 && <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Add at least one label.</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rows.map((item, idx) => {
              const isTop = idx === 0 && item.score != null;
              return (
                <div key={item.prompt} style={{ background: isTop ? 'rgba(0, 240, 255, 0.08)' : 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: isTop ? '1px solid var(--primary-cyan)' : '1px solid #334155', opacity: running ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: 8 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: isTop ? 700 : 500, color: isTop ? '#fff' : 'var(--text-muted)', minWidth: 0, overflowWrap: 'anywhere' }}>
                      "{item.prompt}"
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span className={`badge-status ${isTop ? 'badge-cyan' : 'badge-emerald'}`}>
                        {item.score == null ? '…' : `${(item.score * 100).toFixed(1)}%`}
                      </span>
                      <button onClick={() => removePrompt(item.prompt)} className="icon-btn" aria-label={`Remove ${item.prompt}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="progress-track" style={{ height: 8 }}>
                    <div style={{
                      width: `${(item.score ?? 0) * 100}%`, height: '100%', borderRadius: 4, transition: 'width 0.4s ease',
                      background: isTop ? 'linear-gradient(90deg, #00f0ff, #8a2be2)' : 'var(--primary-emerald)',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ display: 'flex', gap: 6, marginTop: 14, fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            Probabilities are relative to the labels you provide – add a "none of these" style label to see how confident CLIP really is.
          </p>
        </div>
      </div>
    </div>
  );
}
