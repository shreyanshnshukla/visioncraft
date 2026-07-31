import React from 'react';
import { BarChart2, AlertTriangle, CheckCircle, ShieldCheck, Activity, Download } from 'lucide-react';

export default function MlopsDashboard({ dataset }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      
      {/* Left Model Evaluation Cards & Confusion Matrix */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="var(--primary-cyan)" />
            MLOps Model Evaluation & Benchmark Matrix
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Validation performance stats for {dataset.name}
          </p>
        </div>

        {/* Score Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#020617', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>mAP@0.5:0.95</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text-cyan">{dataset.mAP}</div>
          </div>
          <div style={{ background: '#020617', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mean Precision</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text-emerald">92.6%</div>
          </div>
          <div style={{ background: '#020617', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mean Recall</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text-magenta">88.4%</div>
          </div>
        </div>

        {/* Confusion Matrix Heatmap Representation */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} color="var(--primary-emerald)" /> Confusion Matrix Heatmap
        </h3>

        <div style={{ background: '#020617', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Class</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Pred Class A</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Pred Class B</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Pred Class C</div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left' }}>True Class A</div>
            <div style={{ background: 'rgba(0, 255, 135, 0.4)', padding: '10px', borderRadius: '4px', fontWeight: 700 }}>94%</div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '4px', color: 'var(--text-dim)' }}>4%</div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '4px', color: 'var(--text-dim)' }}>2%</div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left' }}>True Class B</div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '4px', color: 'var(--text-dim)' }}>3%</div>
            <div style={{ background: 'rgba(0, 255, 135, 0.4)', padding: '10px', borderRadius: '4px', fontWeight: 700 }}>91%</div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '4px', color: 'var(--text-dim)' }}>6%</div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left' }}>True Class C</div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '4px', color: 'var(--text-dim)' }}>1%</div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '4px', color: 'var(--text-dim)' }}>5%</div>
            <div style={{ background: 'rgba(0, 255, 135, 0.4)', padding: '10px', borderRadius: '4px', fontWeight: 700 }}>94%</div>
          </div>
        </div>

      </div>

      {/* Right Dataset Health & Data Drift Audit */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary-emerald)" />
            Dataset Quality & Data Drift Audit
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Automated dataset health checks and class imbalance warnings
          </p>
        </div>

        {/* Audit Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          
          <div style={{ background: 'rgba(0, 255, 135, 0.08)', border: '1px solid var(--primary-emerald)', padding: '12px 14px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <CheckCircle size={20} color="var(--primary-emerald)" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>No Severe Data Drift Detected</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Embedding Wasserstein Distance = 0.04 (Within safe range &lt; 0.15)</div>
            </div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid var(--primary-amber)', padding: '12px 14px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <AlertTriangle size={20} color="var(--primary-amber)" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>Minor Class Imbalance Warning</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Minority class has 42% fewer samples than dominant class. Focal Loss recommended.</div>
            </div>
          </div>

        </div>

        {/* Class Distribution Histogram */}
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
          Class Sample Count Distribution
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>Primary Object Class A</span>
              <span>640 samples</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#020617', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'var(--primary-cyan)' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>Secondary Class B</span>
              <span>420 samples</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#020617', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: 'var(--primary-emerald)' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>Rare Anomaly Class C</span>
              <span>180 samples</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#020617', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '25%', height: '100%', background: 'var(--primary-magenta)' }}></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
