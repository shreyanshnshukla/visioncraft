import React from 'react';
import { Download, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { useModelStatus } from '../ml/vision';

// Shows download progress / ready state for an in-browser model
export default function ModelStatus({ model, name, size }) {
  const st = useModelStatus(model);
  const color = st.status === 'ready' ? 'var(--primary-emerald)'
    : st.status === 'error' ? 'var(--primary-magenta)' : 'var(--primary-cyan)';

  return (
    <div className="model-status">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600 }}>
          <Cpu size={14} color={color} /> {name}
        </span>
        <span style={{ fontSize: '0.72rem', color, display: 'flex', alignItems: 'center', gap: 4 }} className="mono">
          {st.status === 'idle' && <>{size} · loads on first run</>}
          {st.status === 'loading' && <><Download size={12} /> {st.progress ?? 0}%</>}
          {st.status === 'ready' && <><CheckCircle2 size={12} /> ready{st.backend ? ` · ${st.backend}` : ''}{st.lastMs != null ? ` · ${st.lastMs} ms` : ''}</>}
          {st.status === 'error' && <><AlertTriangle size={12} /> failed</>}
        </span>
      </div>
      {st.status === 'loading' && (
        <div className="progress-track"><div className="progress-fill" style={{ width: `${st.progress ?? 0}%` }} /></div>
      )}
      {st.status === 'error' && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{st.error}</div>
      )}
    </div>
  );
}
