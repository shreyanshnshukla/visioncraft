import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Sliders, Activity, Eye, Zap, Aperture, ImageIcon, Loader2 } from 'lucide-react';
import {
  detectObjects, loadImagePixels, captureVideoFrame, colorForLabel, nonMaxSuppression,
  SAMPLE_PHOTOS, DETECTION_MODELS,
} from '../ml/vision';
import ModelStatus from './ModelStatus';

const toSynthetic = (img) => ({ ...img, kind: 'synthetic' });
const toPhoto = (p) => ({ ...p, kind: 'photo' });

export default function PerceptionStudio({ dataset, activeModel }) {
  const [source, setSource] = useState(() => toPhoto(SAMPLE_PHOTOS[0]));
  const [confThreshold, setConfThreshold] = useState(0.5);
  const [iouThreshold, setIouThreshold] = useState(0.5);
  const [showMasks, setShowMasks] = useState(true);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [live, setLive] = useState(null);          // { boxes, ms, width, height, key }
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const runToken = useRef(0);

  const modelInfo = DETECTION_MODELS.find((m) => m.id === activeModel) || DETECTION_MODELS[0];
  const isLiveSource = source.kind !== 'synthetic';
  const sourceKey = `${source.id}::${modelInfo.id}`;

  // When the dataset changes while a synthetic scene is shown, follow it
  useEffect(() => {
    setSource((s) => (s.kind === 'synthetic' ? toSynthetic(dataset.images[0]) : s));
  }, [dataset]);

  const runDetection = useCallback(async (src) => {
    const token = ++runToken.current;
    setRunning(true);
    setError(null);
    try {
      const { pixels, naturalWidth, naturalHeight } = await loadImagePixels(src.url);
      const { output, ms } = await detectObjects(pixels, modelInfo.id, 0.1);
      if (token !== runToken.current) return;
      setLive({
        key: `${src.id}::${modelInfo.id}`,
        width: naturalWidth,
        height: naturalHeight,
        ms,
        boxes: output.map((d, i) => ({
          id: `det-${i}`,
          label: d.label,
          confidence: d.score,
          color: colorForLabel(d.label),
          // percentage box -> pixel box in the image's natural size
          bbox: [
            d.box.xmin * naturalWidth,
            d.box.ymin * naturalHeight,
            (d.box.xmax - d.box.xmin) * naturalWidth,
            (d.box.ymax - d.box.ymin) * naturalHeight,
          ],
        })),
      });
    } catch (e) {
      if (token === runToken.current) setError(e.message);
    } finally {
      if (token === runToken.current) setRunning(false);
    }
  }, [modelInfo.id]);

  // Auto-run the real model on real photos / uploads / webcam captures
  useEffect(() => {
    if (isLiveSource && !isWebcamActive) runDetection(source);
  }, [sourceKey, isLiveSource, isWebcamActive]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setIsWebcamActive(false);
      setSource({ id: `upload-${Date.now()}`, title: file.name, url: event.target.result, kind: 'upload' });
    };
    reader.readAsDataURL(file);
  };

  // Webcam stream lifecycle
  useEffect(() => {
    if (!isWebcamActive) return undefined;
    let stream = null;
    let cancelled = false;
    setWebcamError(null);
    navigator.mediaDevices?.getUserMedia({ video: { width: 960, height: 600 } })
      .then((s) => {
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        setWebcamError('Camera unavailable or permission denied.');
        setIsWebcamActive(false);
      });
    return () => {
      cancelled = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [isWebcamActive]);

  const captureAndDetect = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const url = captureVideoFrame(video);
    setIsWebcamActive(false);
    setSource({ id: `webcam-${Date.now()}`, title: 'Webcam capture', url, kind: 'webcam' });
  };

  // What to draw
  const liveReady = isLiveSource && live && live.key === sourceKey;
  const viewW = isLiveSource ? (liveReady ? live.width : 800) : 800;
  const viewH = isLiveSource ? (liveReady ? live.height : 500) : 500;
  const k = viewW / 800; // scale label sizes to the image
  const objects = isLiveSource ? (liveReady ? live.boxes : []) : (source.objects || []);
  const aboveThreshold = objects.filter((o) => o.confidence >= confThreshold);
  // Real detectors emit overlapping duplicates; synthetic labels are already clean
  const filteredObjects = isLiveSource ? nonMaxSuppression(aboveThreshold, iouThreshold) : aboveThreshold;

  const thumbs = [
    ...SAMPLE_PHOTOS.map(toPhoto),
    ...dataset.images.map(toSynthetic),
  ];

  return (
    <div className="grid-main-side">

      {/* Main Perception Viewport */}
      <div className="glass-panel" style={{ padding: '20px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} color="var(--primary-cyan)" />
              Object Detection
              <span className={`badge-status ${isLiveSource ? 'badge-emerald' : 'badge-magenta'}`}>
                {isLiveSource ? 'Live model' : 'Reference labels'}
              </span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isWebcamActive ? 'Webcam preview – capture a frame to run detection'
                : <>Input: <strong style={{ color: '#fff' }}>{source.title}</strong></>}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {isWebcamActive ? (
              <>
                <button className="btn-primary" onClick={captureAndDetect}><Aperture size={16} /> Capture & Detect</button>
                <button className="btn-secondary" onClick={() => setIsWebcamActive(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn-secondary" onClick={() => setIsWebcamActive(true)}>
                <Camera size={16} /> Webcam
              </button>
            )}
            <label className="btn-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={16} /> Upload Image
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
        {webcamError && <div className="note-banner" style={{ marginBottom: 12 }}>{webcamError}</div>}

        {/* Thumbnails */}
        {!isWebcamActive && (
          <div className="thumb-strip">
            {thumbs.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSource(img)}
                className={`thumb ${source.id === img.id ? 'active' : ''}`}
                title={img.kind === 'photo' ? 'Real photo – runs the live model' : 'Synthetic scene with reference labels'}
              >
                <img src={img.url} alt="" crossOrigin={img.kind === 'photo' ? 'anonymous' : undefined} />
                <span>{img.title}</span>
                {img.kind === 'photo' && <span className="thumb-dot" />}
              </button>
            ))}
          </div>
        )}

        {/* Canvas */}
        <div className="viewport" style={{ aspectRatio: isWebcamActive ? '16/10' : `${viewW}/${viewH}` }}>
          {isWebcamActive ? (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <img src={source.url} alt={source.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}

          {!isWebcamActive && (
            <svg className="overlay" viewBox={`0 0 ${viewW} ${viewH}`} preserveAspectRatio="xMidYMid meet">
              {filteredObjects.map((obj) => {
                const [x, y, w, h] = obj.bbox;
                const clen = Math.min(16 * k, Math.min(w, h) / 3);
                const fs = 11 * k;
                const label = `${obj.label} ${(obj.confidence * 100).toFixed(0)}%`;
                return (
                  <g key={obj.id}>
                    {showMasks && obj.mask && (
                      <polygon points={obj.mask.map((p) => p.join(',')).join(' ')} fill={obj.color} fillOpacity={0.15}
                        stroke={obj.color} strokeWidth="1.5" strokeDasharray="4,4" vectorEffect="non-scaling-stroke" />
                    )}
                    <rect x={x} y={y} width={w} height={h} fill="rgba(0,0,0,0.12)" stroke={obj.color}
                      strokeWidth="1.5" strokeOpacity="0.7" vectorEffect="non-scaling-stroke" />
                    <path d={`M${x},${y + clen} L${x},${y} L${x + clen},${y} M${x + w - clen},${y} L${x + w},${y} L${x + w},${y + clen} M${x},${y + h - clen} L${x},${y + h} L${x + clen},${y + h} M${x + w - clen},${y + h} L${x + w},${y + h} L${x + w},${y + h - clen}`}
                      stroke={obj.color} strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
                    <g transform={`translate(${x}, ${Math.max(2 * k, y - 22 * k)})`}>
                      <rect width={label.length * 6.6 * k + 14 * k} height={20 * k} fill="#0f172a" stroke={obj.color}
                        strokeWidth="1" rx={4 * k} vectorEffect="non-scaling-stroke" />
                      <text x={7 * k} y={14 * k} fill={obj.color} fontWeight="700" fontSize={fs} fontFamily="Outfit, sans-serif">{label}</text>
                    </g>
                  </g>
                );
              })}
            </svg>
          )}

          {running && !isWebcamActive && (
            <div className="viewport-status"><Loader2 size={16} className="spin" /> Running {modelInfo.name}…</div>
          )}
        </div>

        {error && <div className="note-banner" style={{ marginTop: 12 }}>Detection failed: {error}</div>}
        {!isLiveSource && (
          <div className="note-banner" style={{ marginTop: 12 }}>
            This is a synthetic illustration with hand-made reference labels.{' '}
            <button className="link-btn" onClick={() => runDetection(source)} disabled={running}>
              Run the live model on it anyway
            </button>{' '}
            or pick a real photo (green dot) / upload your own.
          </div>
        )}
        {!isLiveSource && live && live.key === sourceKey && (
          <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Live model found {live.boxes.filter((b) => b.confidence >= confThreshold).length} object(s) on this synthetic scene:{' '}
            {live.boxes.filter((b) => b.confidence >= confThreshold).map((b) => b.label).join(', ') || 'none'}.
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 className="panel-title"><Zap size={18} color="var(--primary-emerald)" /> In-Browser Model</h3>
          <ModelStatus model={modelInfo.id} name={modelInfo.name} size={modelInfo.size} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.5 }}>
            Runs fully client-side with Transformers.js + ONNX Runtime Web in a Web Worker. No server, images never leave your device.
            Switch backbone in the header.
          </p>
          {liveReady && (
            <div className="stat-row">
              <div><span>Latency</span><strong className="mono">{Math.round(live.ms)} ms</strong></div>
              <div><span>Input</span><strong className="mono">{live.width}×{live.height}</strong></div>
              <div><span>Objects</span><strong className="mono">{filteredObjects.length}</strong></div>
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 className="panel-title"><Sliders size={18} color="var(--primary-cyan)" /> Thresholds</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span>Confidence threshold</span>
            <strong style={{ color: 'var(--primary-cyan)' }}>{(confThreshold * 100).toFixed(0)}%</strong>
          </div>
          <input type="range" min="0.1" max="0.99" step="0.01" value={confThreshold}
            onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary-cyan)' }} aria-label="Confidence threshold" />
          {isLiveSource && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', margin: '14px 0 6px' }}>
                <span>NMS IoU threshold</span>
                <strong style={{ color: 'var(--primary-emerald)' }}>{(iouThreshold * 100).toFixed(0)}%</strong>
              </div>
              <input type="range" min="0.1" max="0.95" step="0.05" value={iouThreshold}
                onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-emerald)' }} aria-label="NMS IoU threshold" />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 6 }}>
                Removes same-class boxes that overlap a higher-scoring one ({aboveThreshold.length - filteredObjects.length} suppressed).
              </p>
            </>
          )}
          {!isLiveSource && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', marginTop: 12 }}>
              <input type="checkbox" checked={showMasks} onChange={(e) => setShowMasks(e.target.checked)} />
              Show segmentation masks
            </label>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
          <h3 className="panel-title"><Activity size={18} color="var(--primary-magenta)" /> Detections ({filteredObjects.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {filteredObjects.length === 0 && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', gap: 6, alignItems: 'center' }}>
                <ImageIcon size={14} /> {running ? 'Waiting for model…' : 'No objects above the threshold.'}
              </div>
            )}
            {[...filteredObjects].sort((a, b) => b.confidence - a.confidence).map((obj) => (
              <div key={obj.id} className="det-row" style={{ borderLeft: `4px solid ${obj.color}` }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{obj.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }} className="mono">
                    [{obj.bbox.map((v) => Math.round(v)).join(', ')}]
                  </div>
                </div>
                <span className="badge-status badge-cyan">{(obj.confidence * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
