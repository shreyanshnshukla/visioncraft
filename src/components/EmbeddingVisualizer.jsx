import React, { useState } from 'react';
import { Network, Search, Compass, BarChart2, CheckCircle, Info } from 'lucide-react';
import { MOCK_VECTOR_CLUSTER } from '../data/presetDatasets';
import { cosineSimilarity } from '../utils/cvEngine';

export default function EmbeddingVisualizer() {
  const [selectedNode, setSelectedNode] = useState(MOCK_VECTOR_CLUSTER[0]);
  const [projectionType, setProjectionType] = useState('t-SNE');
  const [searchK, setSearchK] = useState(3);

  // Compute nearest neighbors to selected node
  const getNearestNeighbors = () => {
    if (!selectedNode) return [];
    return MOCK_VECTOR_CLUSTER
      .filter(n => n.id !== selectedNode.id)
      .map(node => {
        const dist = Math.sqrt(Math.pow(node.x - selectedNode.x, 2) + Math.pow(node.y - selectedNode.y, 2));
        const sim = (1 / (1 + dist / 200)).toFixed(3);
        return { ...node, sim, dist: dist.toFixed(1) };
      })
      .sort((a, b) => b.sim - a.sim)
      .slice(0, searchK);
  };

  const neighbors = getNearestNeighbors();
  const neighborIds = new Set(neighbors.map(n => n.id));

  return (
    <div className="grid-main-side">
      
      {/* Interactive Vector Scatter Canvas */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={20} color="var(--primary-cyan)" />
              High-Dimensional Embedding Space (t-SNE / UMAP)
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Interactive projection of 512D CLIP / DINOv2 image feature vectors
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn-secondary ${projectionType === 't-SNE' ? 'active' : ''}`}
              onClick={() => setProjectionType('t-SNE')}
              style={{ borderColor: projectionType === 't-SNE' ? 'var(--primary-cyan)' : undefined }}
            >
              t-SNE 2D
            </button>
            <button 
              className={`btn-secondary ${projectionType === 'UMAP' ? 'active' : ''}`}
              onClick={() => setProjectionType('UMAP')}
              style={{ borderColor: projectionType === 'UMAP' ? 'var(--primary-cyan)' : undefined }}
            >
              UMAP 3D
            </button>
          </div>
        </div>

        {/* Scatter Canvas */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          background: '#020617',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #1e293b'
        }}>
          
          {/* Grid Background */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} viewBox="0 0 700 500">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Connection Lines from Selected Node to k-NN */}
            {neighbors.map(n => (
              <line 
                key={`edge-${n.id}`}
                x1={selectedNode.x} 
                y1={selectedNode.y} 
                x2={n.x} 
                y2={n.y} 
                stroke="var(--primary-cyan)" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
                opacity="0.7"
              />
            ))}

            {/* Scatter Nodes */}
            {MOCK_VECTOR_CLUSTER.map(node => {
              const isSelected = selectedNode.id === node.id;
              const isNeighbor = neighborIds.has(node.id);

              return (
                <g key={node.id} onClick={() => setSelectedNode(node)} style={{ cursor: 'pointer' }}>
                  {/* Glow circle for selected/neighbor */}
                  {(isSelected || isNeighbor) && (
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isSelected ? 22 : 16} 
                      fill={isSelected ? 'var(--primary-cyan)' : 'var(--primary-emerald)'} 
                      opacity="0.25"
                    />
                  )}

                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r={isSelected ? 10 : isNeighbor ? 8 : 6} 
                    fill={node.color} 
                    stroke={isSelected ? '#fff' : isNeighbor ? 'var(--primary-emerald)' : 'none'} 
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  <text 
                    x={node.x + 12} 
                    y={node.y + 4} 
                    fill={isSelected ? '#fff' : 'var(--text-muted)'} 
                    fontSize={isSelected ? '12' : '10'} 
                    fontWeight={isSelected ? '700' : '400'}
                    fontFamily="Outfit, sans-serif"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(15, 23, 42, 0.85)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span> Automotive
            </span>
            <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Manufacturing
            </span>
            <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span> Retail Tech
            </span>
            <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }}></span> Healthcare AI
            </span>
          </div>

        </div>

      </div>

      {/* Right k-NN Vector Inspector Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Active Node Info */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} color="var(--primary-cyan)" />
            Selected Vector Point
          </h3>

          <div style={{ background: '#020617', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '14px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>{selectedNode.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category: <strong style={{ color: selectedNode.color }}>{selectedNode.category}</strong></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }} className="mono">
              Coords: [X: {selectedNode.x}, Y: {selectedNode.y}, Z: {selectedNode.z}]
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span>k-NN Search (Top K):</span>
              <strong style={{ color: 'var(--primary-emerald)' }}>{searchK} Neighbors</strong>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={searchK} 
              onChange={(e) => setSearchK(parseInt(e.target.value))} 
              style={{ width: '100%', accentColor: 'var(--primary-emerald)' }}
            />
          </div>
        </div>

        {/* k-NN Nearest Neighbors List */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--primary-emerald)" />
            Nearest Vector Neighbors
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {neighbors.map(n => (
              <div 
                key={n.id}
                onClick={() => setSelectedNode(n)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{n.label}</div>
                  <span className="badge-status badge-emerald">Cos Sim: {n.sim}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Euclidean Dist: {n.dist} px
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
