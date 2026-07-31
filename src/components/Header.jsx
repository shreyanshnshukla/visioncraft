import React from 'react';
import { Eye, Cpu, Zap, Layers, Sparkles, Sliders } from 'lucide-react';
import { PRESET_DATASETS } from '../data/presetDatasets';

export default function Header({ selectedDataset, onSelectDataset, activeModel, onSelectModel }) {
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
              <span className="badge-status badge-cyan">v2.4 Multimodal Engine</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Multimodal Computer Vision & Embedding Projection Workbench
            </p>
          </div>
        </div>

        {/* Global Dataset & Model Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          
          {/* Dataset Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="var(--primary-cyan)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dataset:</span>
            <select 
              className="input-custom"
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
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Backbone:</span>
            <select 
              className="input-custom"
              value={activeModel}
              onChange={(e) => onSelectModel(e.target.value)}
              style={{ fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="YOLOv8x-ViT">YOLOv8-X + ViT-L/14 (Dual Engine)</option>
              <option value="DINOv2-Large">Meta DINOv2 Large Vision Transformer</option>
              <option value="CLIP-ViT-B32">OpenAI CLIP ViT-B/32 Multimodal</option>
              <option value="EfficientDet-D7">Google EfficientDet-D7 (Edge AI)</option>
            </select>
          </div>

          {/* Real-time Telemetry Pill */}
          <div className="badge-status badge-emerald" style={{ padding: '6px 12px' }}>
            <span className="pulse-dot"></span>
            <span>FPS: 60</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>{selectedDataset.latencyMs} ms</span>
          </div>

        </div>

      </div>
    </header>
  );
}
