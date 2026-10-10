import React, { useState } from 'react';
import { Layers, Eye, Zap, Flame, Sliders } from 'lucide-react';

export default function FeatureMapInspector({ dataset }) {
  const [activeLayer, setActiveLayer] = useState('attention');
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.65);
  const [layerDepth, setLayerDepth] = useState(12);

  const currentImg = dataset.images[0];

  return (
    <div className="grid-2">
      
      {/* Left Feature Layer Viewport */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--primary-cyan)" />
            Neural Network Layer Feature Map Inspector
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Visualize internal tensor activations across network depth (Conv1 → Conv3 → Vision Transformer Attention)
          </p>
        </div>

        {/* Layer Depth Slider */}
        <div style={{ marginBottom: '16px', background: '#020617', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span>Network Depth Layer Block:</span>
            <strong style={{ color: 'var(--primary-cyan)' }}>Layer {layerDepth} / 24</strong>
          </div>
          <input 
            type="range" 
            min="1" 
            max="24" 
            value={layerDepth} 
            onChange={(e) => setLayerDepth(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--primary-cyan)' }}
          />
        </div>

        {/* Layer Selection Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            className={`btn-secondary ${activeLayer === 'conv1' ? 'active' : ''}`}
            onClick={() => setActiveLayer('conv1')}
            style={{ borderColor: activeLayer === 'conv1' ? 'var(--primary-cyan)' : undefined }}
          >
            Conv1 (Edges & Contours)
          </button>
          <button 
            className={`btn-secondary ${activeLayer === 'conv3' ? 'active' : ''}`}
            onClick={() => setActiveLayer('conv3')}
            style={{ borderColor: activeLayer === 'conv3' ? 'var(--primary-cyan)' : undefined }}
          >
            Conv3 (Textures & Parts)
          </button>
          <button 
            className={`btn-secondary ${activeLayer === 'attention' ? 'active' : ''}`}
            onClick={() => setActiveLayer('attention')}
            style={{ borderColor: activeLayer === 'attention' ? 'var(--primary-cyan)' : undefined }}
          >
            Self-Attention (Semantic)
          </button>
        </div>

        {/* Layer Activation Feature Tiles */}
        <div className="grid-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} style={{ background: '#020617', padding: '6px', borderRadius: '6px', border: '1px solid #1e293b', textAlign: 'center' }}>
              <img 
                src={currentImg.layerActivations[activeLayer]} 
                alt={`Channel ${idx}`} 
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }} className="mono">Channel #{idx * 4}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Right Grad-CAM Saliency Overlay Viewport */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="var(--primary-magenta)" />
            Grad-CAM Saliency Heatmap Visualizer
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Gradients highlighting input pixels influencing the final model prediction
          </p>
        </div>

        {/* Heatmap Opacity Controls */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span>Grad-CAM Overlay Opacity:</span>
            <strong style={{ color: 'var(--primary-magenta)' }}>{(heatmapOpacity * 100).toFixed(0)}%</strong>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="1.0" 
            step="0.05" 
            value={heatmapOpacity} 
            onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--primary-magenta)' }}
          />
        </div>

        {/* Grad-CAM Canvas Display Viewport */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          background: '#020617',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #1e293b'
        }}>
          {/* Base Image */}
          <img src={currentImg.url} alt={currentImg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

          {/* Saliency Heatmap Overlay */}
          <img 
            src={currentImg.layerActivations.attention} 
            alt="Heatmap Overlay" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: heatmapOpacity,
              mixBlendMode: 'screen',
              pointerEvents: 'none'
            }} 
          />
        </div>

        {/* Explanatory Note */}
        <div style={{ marginTop: '14px', background: '#020617', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: '#fff' }}>Grad-CAM Interpretation:</strong> Red/amber glowing regions represent maximum gradient activation where the model's self-attention heads focus to output the highest confidence prediction.
        </div>

      </div>

    </div>
  );
}
