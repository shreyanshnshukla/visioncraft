import React, { useState, useRef } from 'react';
import { Edit3, Download, Copy, RefreshCw, Check, Layers, Sliders, FileCode } from 'lucide-react';
import { exportToYOLO, exportToCOCO, exportToPascalVOC } from '../utils/cvEngine';

export default function AnnotatorStudio({ dataset }) {
  const [currentImage, setCurrentImage] = useState(dataset.images[0]);
  const [annotations, setAnnotations] = useState(currentImage.objects);
  const [selectedClass, setSelectedClass] = useState("Vehicle / Object");
  const [exportFormat, setExportFormat] = useState("yolo");
  const [copied, setCopied] = useState(false);

  // Augmentation State
  const [augRotation, setAugRotation] = useState(15);
  const [augBrightness, setAugBrightness] = useState(120);
  const [augContrast, setAugContrast] = useState(130);
  const [augBlur, setAugBlur] = useState(0);

  // Drag-to-Draw state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [tempBox, setTempBox] = useState(null);

  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    setIsDrawing(true);
    setStartPos({ x, y });
    setTempBox([x, y, 0, 0]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(800, ((e.clientX - rect.left) / rect.width) * 800));
    const currentY = Math.max(0, Math.min(500, ((e.clientY - rect.top) / rect.height) * 500));
    
    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const w = Math.abs(currentX - startPos.x);
    const h = Math.abs(currentY - startPos.y);

    setTempBox([x, y, w, h]);
  };

  const handleMouseUp = () => {
    if (isDrawing && tempBox && tempBox[2] > 15 && tempBox[3] > 15) {
      const colors = ["#00f0ff", "#00ff87", "#ff007f", "#8a2be2", "#f59e0b"];
      const newAnn = {
        id: `custom-box-${Date.now()}`,
        label: selectedClass,
        confidence: 1.0,
        bbox: [Math.round(tempBox[0]), Math.round(tempBox[1]), Math.round(tempBox[2]), Math.round(tempBox[3])],
        color: colors[annotations.length % colors.length]
      };
      setAnnotations([...annotations, newAnn]);
    }
    setIsDrawing(false);
    setTempBox(null);
  };

  const handleClear = () => {
    setAnnotations([]);
  };

  const handleReset = () => {
    setAnnotations(currentImage.objects);
  };

  // Get exported text code
  const getExportCode = () => {
    if (exportFormat === "yolo") return exportToYOLO(annotations);
    if (exportFormat === "coco") return exportToCOCO(annotations, currentImage.title);
    return exportToPascalVOC(annotations, currentImage.title);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      
      {/* Left Canvas Annotation Studio */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={20} color="var(--primary-cyan)" />
              Interactive BBox Annotator
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Click and drag mouse over canvas to draw custom bounding boxes
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={handleReset} title="Reset to original dataset boxes">
              <RefreshCw size={14} /> Reset
            </button>
            <button className="btn-secondary" onClick={handleClear} style={{ color: '#ef4444' }}>
              Clear All
            </button>
          </div>
        </div>

        {/* Class Selection & Drawing Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Annotation Class:</span>
          <select 
            className="input-custom" 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ fontWeight: 600 }}
          >
            <option value="Vehicle / Car">Vehicle / Car</option>
            <option value="Pedestrian">Pedestrian</option>
            <option value="Microchip Defect">Microchip Defect</option>
            <option value="Retail Product">Retail Product</option>
            <option value="Medical Lesion">Medical Lesion</option>
          </select>
        </div>

        {/* Annotation Canvas Viewport */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/10',
            background: '#020617',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1.5px dashed var(--primary-cyan)',
            cursor: 'crosshair',
            userSelect: 'none'
          }}
        >
          <img 
            src={currentImage.url} 
            alt={currentImage.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} 
          />

          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 800 500">
            {/* Existing Annotations */}
            {annotations.map(ann => {
              const [x, y, w, h] = ann.bbox;
              return (
                <g key={ann.id}>
                  <rect x={x} y={y} width={w} height={h} fill="rgba(0,240,255,0.15)" stroke={ann.color} strokeWidth="2.5" rx="3" />
                  <rect x={x} y={Math.max(0, y - 20)} width={ann.label.length * 8 + 20} height="20" fill={ann.color} rx="3" />
                  <text x={x + 4} y={Math.max(14, y - 5)} fill="#07090e" fontWeight="700" fontSize="11" fontFamily="Outfit">{ann.label}</text>
                </g>
              );
            })}

            {/* Drawing Temp Box */}
            {isDrawing && tempBox && (
              <rect x={tempBox[0]} y={tempBox[1]} width={tempBox[2]} height={tempBox[3]} fill="rgba(255,0,127,0.2)" stroke="#ff007f" strokeWidth="2" strokeDasharray="6 6" />
            )}
          </svg>
        </div>

        {/* Live Data Augmentation Simulator */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} color="var(--primary-emerald)" />
            Real-Time Augmentation Engine Preview
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span>Rotation: <strong>{augRotation}°</strong></span>
              </div>
              <input type="range" min="-45" max="45" value={augRotation} onChange={(e) => setAugRotation(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span>Brightness: <strong>{augBrightness}%</strong></span>
              </div>
              <input type="range" min="50" max="180" value={augBrightness} onChange={(e) => setAugBrightness(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{
            width: '100%',
            height: '140px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#07090e'
          }}>
            <img 
              src={currentImage.url} 
              alt="Augmented Preview" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `rotate(${augRotation}deg)`,
                filter: `brightness(${augBrightness}%) contrast(${augContrast}%) blur(${augBlur}px)`
              }}
            />
          </div>
        </div>

      </div>

      {/* Right Dataset Export Generator */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={20} color="var(--primary-magenta)" />
              Dataset Export Syntax Generator
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Instant formatting for YOLO, COCO JSON, and Pascal VOC XML
            </p>
          </div>

          <button className="btn-primary" onClick={handleCopyCode} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <button 
            className={`btn-secondary ${exportFormat === 'yolo' ? 'active' : ''}`}
            onClick={() => setExportFormat('yolo')}
            style={{ borderColor: exportFormat === 'yolo' ? 'var(--primary-cyan)' : undefined }}
          >
            YOLO (.txt)
          </button>
          <button 
            className={`btn-secondary ${exportFormat === 'coco' ? 'active' : ''}`}
            onClick={() => setExportFormat('coco')}
            style={{ borderColor: exportFormat === 'coco' ? 'var(--primary-cyan)' : undefined }}
          >
            COCO (.json)
          </button>
          <button 
            className={`btn-secondary ${exportFormat === 'voc' ? 'active' : ''}`}
            onClick={() => setExportFormat('voc')}
            style={{ borderColor: exportFormat === 'voc' ? 'var(--primary-cyan)' : undefined }}
          >
            Pascal VOC (.xml)
          </button>
        </div>

        {/* Code Box Viewport */}
        <div style={{
          flex: 1,
          background: '#020617',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          padding: '14px',
          overflowY: 'auto',
          maxHeight: '480px'
        }}>
          <pre className="mono" style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', margin: 0, whiteSpace: 'pre-wrap' }}>
            {getExportCode()}
          </pre>
        </div>

      </div>

    </div>
  );
}
