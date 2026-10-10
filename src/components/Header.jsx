import React from 'react';
import { Eye, Cpu, Layers, ExternalLink } from 'lucide-react';
import { PRESET_DATASETS } from '../data/presetDatasets';
import { DETECTION_MODELS, useLastLatency } from '../ml/vision';

export default function Header({ selectedDataset, onSelectDataset, activeModel, onSelectModel }) {
  const latency = useLastLatency();
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', borderRadius: '0 0 16px 16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        
        {/* Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #8a2be2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
          }}>
            <Eye size={26} color="#07090e" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }} className="gradient-text-cyan">
                VisionCraft AI
              </h1>
              <span className="badge-status badge-cyan">In-browser AI</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-time object detection & CLIP zero-shot classification, running entirely in your browser
            </p>
          </div>
        </div>

        {/* Global Dataset & Model Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          
          {/* Dataset Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="var(--primary-cyan)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scenes:</span>
            <select 
              className="input-custom header-select"
              value={selectedDataset.id}
              onChange={(e) => onSelectDataset(PRESET_DATASETS.find(d => d.id === e.target.value))}
              style={{ fontWeight: 600, cursor: 'pointer' }}
            >
              {PRESET_DATASETS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Model Backbone Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="var(--primary-emerald)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Detector:</span>
            <select 
              className="input-custom header-select"
              value={activeModel}
              onChange={(e) => onSelectModel(e.target.value)}
              style={{ fontWeight: 600, cursor: 'pointer' }}
            >
              {DETECTION_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Real inference telemetry */}
          <div className="badge-status badge-emerald" style={{ padding: '6px 12px' }}>
            <span className="pulse-dot"></span>
            <span>{latency != null ? `Last inference ${latency} ms` : 'WASM · Web Worker'}</span>
          </div>

          <a className="btn-secondary" href="https://github.com/shreyanshnshukla/visioncraft" target="_blank" rel="noreferrer" style={{ padding: '6px 12px', textDecoration: 'none', fontSize: '0.85rem' }}>
            <ExternalLink size={14} /> Source
          </a>
        </div>

      </div>
    </header>
  );
}
