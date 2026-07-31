import React, { useState } from 'react';
import Header from './components/Header';
import PerceptionStudio from './components/PerceptionStudio';
import AnnotatorStudio from './components/AnnotatorStudio';
import EmbeddingVisualizer from './components/EmbeddingVisualizer';
import ZeroShotStudio from './components/ZeroShotStudio';
import FeatureMapInspector from './components/FeatureMapInspector';
import MlopsDashboard from './components/MlopsDashboard';

import { Eye, Edit3, Network, Sparkles, Layers, BarChart2 } from 'lucide-react';
import { PRESET_DATASETS } from './data/presetDatasets';

export default function App() {
  const [selectedDataset, setSelectedDataset] = useState(PRESET_DATASETS[0]);
  const [activeModel, setActiveModel] = useState("YOLOv8x-ViT");
  const [activeTab, setActiveTab] = useState("perception");

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <Header 
        selectedDataset={selectedDataset}
        onSelectDataset={setSelectedDataset}
        activeModel={activeModel}
        onSelectModel={setActiveModel}
      />

      {/* Main Container */}
      <main style={{ flex: 1, padding: '0 24px 32px 24px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        
        {/* Navigation Tabs Bar */}
        <div className="glass-panel" style={{ padding: '6px 12px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button 
            className={`tab-btn ${activeTab === 'perception' ? 'active' : ''}`}
            onClick={() => setActiveTab('perception')}
          >
            <Eye size={18} /> Vision Perception Engine
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'annotator' ? 'active' : ''}`}
            onClick={() => setActiveTab('annotator')}
          >
            <Edit3 size={18} /> BBox Annotator & Augmentation
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'embedding' ? 'active' : ''}`}
            onClick={() => setActiveTab('embedding')}
          >
            <Network size={18} /> Embedding Projection (t-SNE/UMAP)
          </button>

          <button 
            className={`tab-btn ${activeTab === 'zeroshot' ? 'active' : ''}`}
            onClick={() => setActiveTab('zeroshot')}
          >
            <Sparkles size={18} /> CLIP Zero-Shot & VQA
          </button>

          <button 
            className={`tab-btn ${activeTab === 'featuremaps' ? 'active' : ''}`}
            onClick={() => setActiveTab('featuremaps')}
          >
            <Layers size={18} /> Neural Feature Maps & Grad-CAM
          </button>

          <button 
            className={`tab-btn ${activeTab === 'mlops' ? 'active' : ''}`}
            onClick={() => setActiveTab('mlops')}
          >
            <BarChart2 size={18} /> MLOps Benchmarks & Audit
          </button>
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'perception' && (
            <PerceptionStudio dataset={selectedDataset} activeModel={activeModel} />
          )}

          {activeTab === 'annotator' && (
            <AnnotatorStudio dataset={selectedDataset} />
          )}

          {activeTab === 'embedding' && (
            <EmbeddingVisualizer />
          )}

          {activeTab === 'zeroshot' && (
            <ZeroShotStudio dataset={selectedDataset} />
          )}

          {activeTab === 'featuremaps' && (
            <FeatureMapInspector dataset={selectedDataset} />
          )}

          {activeTab === 'mlops' && (
            <MlopsDashboard dataset={selectedDataset} />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '16px 24px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
        VisionCraft AI — Built for AI/ML Engineering Portfolio & Resume Showcase • Powered by React & Vision Transformers
      </footer>

    </div>
  );
}
