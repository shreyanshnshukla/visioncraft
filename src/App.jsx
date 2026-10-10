import React, { useState } from 'react';
import Header from './components/Header';
import PerceptionStudio from './components/PerceptionStudio';
import AnnotatorStudio from './components/AnnotatorStudio';
import EmbeddingVisualizer from './components/EmbeddingVisualizer';
import ZeroShotStudio from './components/ZeroShotStudio';
import FeatureMapInspector from './components/FeatureMapInspector';
import MlopsDashboard from './components/MlopsDashboard';

import { Eye, Edit3, Network, Sparkles, Layers, BarChart2, Info } from 'lucide-react';
import { PRESET_DATASETS } from './data/presetDatasets';
import { DETECTION_MODELS } from './ml/vision';

const TABS = [
  { id: 'perception', label: 'Object Detection', icon: Eye, live: true },
  { id: 'zeroshot', label: 'CLIP Zero-Shot', icon: Sparkles, live: true },
  { id: 'annotator', label: 'BBox Annotator & Export', icon: Edit3 },
  { id: 'embedding', label: 'Embedding Projection', icon: Network, demo: true },
  { id: 'featuremaps', label: 'Feature Maps & Grad-CAM', icon: Layers, demo: true },
  { id: 'mlops', label: 'MLOps Dashboard', icon: BarChart2, demo: true },
];

export default function App() {
  const [selectedDataset, setSelectedDataset] = useState(PRESET_DATASETS[0]);
  const [activeModel, setActiveModel] = useState(DETECTION_MODELS[0].id);
  const [activeTab, setActiveTab] = useState('perception');
  const tab = TABS.find((t) => t.id === activeTab);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        selectedDataset={selectedDataset}
        onSelectDataset={setSelectedDataset}
        activeModel={activeModel}
        onSelectModel={setActiveModel}
      />

      <main className="app-main">
        <nav className="glass-panel tab-bar" aria-label="Workbench sections">
          {TABS.map(({ id, label, icon: Icon, live, demo }) => (
            <button
              key={id}
              className={`tab-btn ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <Icon size={17} /> {label}
              {live && <span className="tab-tag tab-tag-live">Live</span>}
              {demo && <span className="tab-tag">Demo</span>}
            </button>
          ))}
        </nav>

        {tab?.demo && (
          <div className="note-banner" style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Illustrative demo: this view uses synthetic data to show the tooling UI.
              The <strong>Object Detection</strong> and <strong>CLIP Zero-Shot</strong> tabs run real models in your browser.
            </span>
          </div>
        )}

        <div>
          {activeTab === 'perception' && <PerceptionStudio dataset={selectedDataset} activeModel={activeModel} />}
          {activeTab === 'zeroshot' && <ZeroShotStudio dataset={selectedDataset} />}
          {activeTab === 'annotator' && <AnnotatorStudio dataset={selectedDataset} />}
          {activeTab === 'embedding' && <EmbeddingVisualizer />}
          {activeTab === 'featuremaps' && <FeatureMapInspector dataset={selectedDataset} />}
          {activeTab === 'mlops' && <MlopsDashboard dataset={selectedDataset} />}
        </div>
      </main>

      <footer className="app-footer">
        VisionCraft AI · Built by{' '}
        <a href="https://github.com/shreyanshnshukla" target="_blank" rel="noreferrer">Shreyansh Nandan Shukla</a>
        {' '}· React, Vite, Transformers.js & ONNX Runtime Web ·{' '}
        <a href="https://github.com/shreyanshnshukla/visioncraft" target="_blank" rel="noreferrer">Source</a>
      </footer>
    </div>
  );
}
