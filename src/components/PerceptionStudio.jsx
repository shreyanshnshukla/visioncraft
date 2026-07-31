import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sliders, ShieldCheck, Activity, Eye, Zap, RefreshCw } from 'lucide-react';

export default function PerceptionStudio({ dataset, activeModel }) {
  const [selectedImage, setSelectedImage] = useState(dataset.images[0]);
  const [confThreshold, setConfThreshold] = useState(0.80);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [showMasks, setShowMasks] = useState(true);
  const [showKeypoints, setShowKeypoints] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);

  // Sync selected image when dataset changes
  useEffect(() => {
    setSelectedImage(dataset.images[0]);
  }, [dataset]);

  // Handle local image file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImg = {
          id: `custom-${Date.now()}`,
          title: file.name,
          url: event.target.result,
          objects: [
            { id: "cust-1", label: "Primary Detected Object", confidence: 0.94, bbox: [120, 80, 320, 240], color: "#00f0ff" },
            { id: "cust-2", label: "Secondary Defect/Target", confidence: 0.87, bbox: [460, 180, 180, 160], color: "#ff007f" }
          ],
          embedding: [0.3, -0.4, 0.8, -0.2, 0.6, 0.1],
          proj2D: [250, 250],
          proj3D: [250, 250, 250]
        };
        setSelectedImage(newImg);
        setIsWebcamActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // WebCam Stream Handler
  useEffect(() => {
    let stream = null;
    if (isWebcamActive) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 800, height: 500 } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn("Webcam access unavailable, switching to simulated vision stream.", err);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [isWebcamActive]);

  const filteredObjects = selectedImage.objects.filter(obj => obj.confidence >= confThreshold);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
      
      {/* Main Perception Viewport */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} color="var(--primary-cyan)" />
              Real-Time Vision Perception Canvas
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Active Stream: <strong style={{ color: '#fff' }}>{selectedImage.title}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className={`btn-secondary ${isWebcamActive ? 'active' : ''}`}
              onClick={() => setIsWebcamActive(!isWebcamActive)}
              style={{ borderColor: isWebcamActive ? 'var(--primary-emerald)' : undefined }}
            >
              <Camera size={16} color={isWebcamActive ? 'var(--primary-emerald)' : '#fff'} />
              {isWebcamActive ? 'Stop Webcam' : 'Live Webcam'}
            </button>

            <label className="btn-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={16} />
              Upload Image
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Sample Image Thumbnails Bar */}
        {!isWebcamActive && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '6px' }}>
            {dataset.images.map(img => (
              <div 
                key={img.id}
                onClick={() => setSelectedImage(img)}
                style={{
                  padding: '4px',
                  borderRadius: '8px',
                  border: selectedImage.id === img.id ? '2px solid var(--primary-cyan)' : '1px solid #334155',
                  background: '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={img.url} alt={img.title} style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{img.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Canvas Display Viewport */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          background: '#020617',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {isWebcamActive ? (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <img src={selectedImage.url} alt={selectedImage.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}

          {/* High-Tech Bounding Box & Reticle Overlay */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 800 500">
            <defs>
              <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
              </pattern>
            </defs>

            {filteredObjects.map(obj => {
              const [x, y, w, h] = obj.bbox;
              const clen = Math.min(16, Math.min(w, h) / 3);

              return (
                <g key={obj.id}>
                  {/* Segmentation Mask Fill */}
                  {showMasks && obj.mask && (
                    <polygon 
                      points={obj.mask.map(p => p.join(',')).join(' ')} 
                      fill={obj.color} 
                      fillOpacity={0.15} 
                      stroke={obj.color}
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />
                  )}

                  {/* Translucent Bounding Box */}
                  <rect 
                    x={x} 
                    y={y} 
                    width={w} 
                    height={h} 
                    fill="rgba(0, 0, 0, 0.15)" 
                    stroke={obj.color} 
                    strokeWidth="1.5" 
                    strokeOpacity="0.6"
                    rx="2"
                  />

                  {/* Corner Reticles L-Brackets */}
                  {/* Top-Left */}
                  <path d={`M${x},${y + clen} L${x},${y} L${x + clen},${y}`} stroke={obj.color} strokeWidth="3" fill="none" />
                  {/* Top-Right */}
                  <path d={`M${x + w - clen},${y} L${x + w},${y} L${x + w},${y + clen}`} stroke={obj.color} strokeWidth="3" fill="none" />
                  {/* Bottom-Left */}
                  <path d={`M${x},${y + h - clen} L${x},${y + h} L${x + clen},${y + h}`} stroke={obj.color} strokeWidth="3" fill="none" />
                  {/* Bottom-Right */}
                  <path d={`M${x + w - clen},${y + h} L${x + w},${y + h} L${x + w},${y + h - clen}`} stroke={obj.color} strokeWidth="3" fill="none" />

                  {/* Target Center Crosshair */}
                  <circle cx={x + w / 2} cy={y + h / 2} r="3" fill={obj.color} opacity="0.8" />

                  {/* Label Tag Header */}
                  <g transform={`translate(${x}, ${Math.max(4, y - 24)})`}>
                    <rect 
                      x="0" 
                      y="0" 
                      width={Math.max(110, obj.label.length * 8 + 44)} 
                      height="22" 
                      fill="#0f172a" 
                      stroke={obj.color}
                      strokeWidth="1"
                      rx="4"
                    />
                    <text 
                      x="8" 
                      y="15" 
                      fill={obj.color} 
                      fontWeight="700" 
                      fontSize="11" 
                      fontFamily="Outfit, sans-serif"
                    >
                      {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

      </div>

      {/* Control Panel & Inference Telemetry Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Sliders & Thresholds */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--primary-cyan)" />
            Inference Thresholds
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span>Confidence Threshold</span>
              <strong style={{ color: 'var(--primary-cyan)' }}>{(confThreshold * 100).toFixed(0)}%</strong>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="0.99" 
              step="0.01" 
              value={confThreshold}
              onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-cyan)' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span>NMS IoU Threshold</span>
              <strong style={{ color: 'var(--primary-emerald)' }}>{(iouThreshold * 100).toFixed(0)}%</strong>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="0.9" 
              step="0.05" 
              value={iouThreshold}
              onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-emerald)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={showMasks} onChange={(e) => setShowMasks(e.target.checked)} />
              Render Instance Masks
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={showKeypoints} onChange={(e) => setShowKeypoints(e.target.checked)} />
              Render Skeleton Keypoints
            </label>
          </div>
        </div>

        {/* Detections Summary */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--primary-magenta)" />
            Detected Entities ({filteredObjects.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
            {filteredObjects.map(obj => (
              <div 
                key={obj.id} 
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderLeft: `4px solid ${obj.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{obj.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }} className="mono">
                    BBox: [{obj.bbox.join(', ')}]
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge-status badge-cyan">{(obj.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
