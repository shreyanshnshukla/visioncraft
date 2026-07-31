// VisionCraft AI Preset Datasets with Rich High-Tech Visual Illustrations

export const PRESET_DATASETS = [
  {
    id: "autonomous-driving",
    name: "Autonomous Driving & Urban Perception",
    description: "Multi-class urban traffic perception: Vehicles, Pedestrians, Cyclists, Traffic Signals, and Road Signs.",
    domain: "Automotive AI",
    sampleCount: 1420,
    mAP: "89.4%",
    latencyMs: 14.2,
    images: [
      {
        id: "auto-1",
        title: "Downtown Intersection Rush Hour",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><defs><linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'><stop offset='0%25' stop-color='%230b0f19'/><stop offset='100%25' stop-color='%231e2640'/></linearGradient><linearGradient id='road' x1='0' y1='0' x2='0' y2='1'><stop offset='0%25' stop-color='%23151c2e'/><stop offset='100%25' stop-color='%230a0d14'/></linearGradient></defs><rect width='800' height='260' fill='url(%23sky)'/><rect y='260' width='800' height='240' fill='url(%23road)'/><path d='M0,260 L800,260' stroke='%23334155' stroke-width='2'/><path d='M300,260 L500,260 L780,500 L20,500 Z' fill='%23111827'/><line x1='400' y1='260' x2='400' y2='500' stroke='%23f59e0b' stroke-width='4' stroke-dasharray='16,12'/><rect x='80' y='140' width='60' height='120' fill='%230f172a' stroke='%231e293b'/><rect x='180' y='110' width='90' height='150' fill='%230f172a' stroke='%231e293b'/><g transform='translate(150, 280)'><path d='M10,25 Q30,5 70,5 L110,10 Q130,20 135,35 L140,45 Q140,55 125,55 L15,55 Q0,55 0,40 Z' fill='%232563eb'/><circle cx='30' cy='55' r='14' fill='%230f172a' stroke='%2394a3b8' stroke-width='3'/><circle cx='110' cy='55' r='14' fill='%230f172a' stroke='%2394a3b8' stroke-width='3'/><path d='M35,15 L65,15 L65,30 L25,30 Z' fill='%2393c5fd' opacity='0.7'/></g><g transform='translate(480, 290)'><rect x='0' y='0' width='160' height='60' rx='6' fill='%23dc2626'/><circle cx='35' cy='60' r='15' fill='%230f172a' stroke='%2394a3b8' stroke-width='4'/><circle cx='125' cy='60' r='15' fill='%230f172a' stroke='%2394a3b8' stroke-width='4'/><rect x='10' y='10' width='50' height='30' fill='%23fca5a5' opacity='0.7'/></g><g transform='translate(340, 270)'><circle cx='9' cy='8' r='7' fill='%23c084fc'/><rect x='6' y='15' width='6' height='18' fill='%237e22ce'/><line x1='9' y1='33' x2='4' y2='45' stroke='%237e22ce' stroke-width='3'/><line x1='9' y1='33' x2='14' y2='45' stroke='%237e22ce' stroke-width='3'/></g><g transform='translate(680, 200)'><rect x='0' y='0' width='24' height='60' rx='4' fill='%231e293b' stroke='%23475569'/><circle cx='12' cy='12' r='7' fill='%23ef4444'/><circle cx='12' cy='30' r='7' fill='%23334155'/><circle cx='12' cy='48' r='7' fill='%23334155'/></g></svg>",
        objects: [
          { id: "obj-1", label: "Car", confidence: 0.96, bbox: [150, 280, 140, 70], color: "#00f0ff", mask: [[150,295],[180,285],[220,285],[260,290],[290,310],[290,340],[150,340]] },
          { id: "obj-2", label: "Truck", confidence: 0.92, bbox: [480, 290, 160, 75], color: "#ff007f", mask: [[480,290],[640,290],[640,360],[480,360]] },
          { id: "obj-3", label: "Pedestrian", confidence: 0.88, bbox: [340, 270, 18, 48], color: "#8a2be2", mask: [[340,270],[358,270],[358,318],[340,318]] },
          { id: "obj-4", label: "Traffic Light", confidence: 0.94, bbox: [680, 200, 24, 60], color: "#f59e0b", mask: [[680,200],[704,200],[704,260],[680,260]] }
        ],
        embedding: [-0.42, 0.85, 0.12, 0.91, -0.18, 0.63],
        proj2D: [120, 240],
        proj3D: [120, 240, 85],
        layerActivations: {
          conv1: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%230284c7'/><circle cx='30' cy='40' r='20' fill='%2338bdf8'/><path d='M10,80 L90,80' stroke='%23fff' stroke-width='4'/></svg>",
          conv3: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%234338ca'/><rect x='20' y='30' width='60' height='40' fill='%23818cf8'/></svg>",
          attention: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><radialGradient id='g1'><stop offset='0%25' stop-color='%23ef4444'/><stop offset='100%25' stop-color='transparent'/></radialGradient><rect width='100' height='100' fill='%230f172a'/><circle cx='40' cy='60' r='35' fill='url(%23g1)'/></svg>"
        }
      }
    ]
  },
  {
    id: "industrial-defect",
    name: "Industrial Surface & PCB Defect Inspection",
    description: "High-precision anomaly detection for micro-cracks, missing solder components, scratch defects, and corrosion.",
    domain: "Smart Manufacturing",
    sampleCount: 890,
    mAP: "94.8%",
    latencyMs: 8.5,
    images: [
      {
        id: "ind-1",
        title: "Micro PCB Microcontroller Inspection",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='800' height='500' fill='%23022c22'/><rect x='120' y='60' width='560' height='380' rx='16' fill='%23065f46' stroke='%23059669' stroke-width='4'/><path d='M160,100 L300,100 L300,180' stroke='%23f59e0b' stroke-width='3' fill='none'/><path d='M640,100 L500,100 L500,180' stroke='%23f59e0b' stroke-width='3' fill='none'/><rect x='330' y='180' width='140' height='140' rx='8' fill='%230f172a' stroke='%23334155' stroke-width='2'/><text x='355' y='255' font-family='monospace' font-size='18' font-weight='bold' fill='%2338bdf8'>ARM Cortex</text><g transform='translate(245, 135)'><rect x='0' y='0' width='30' height='30' rx='4' fill='%23d97706'/><text x='5' y='20' font-size='10' font-family='monospace' fill='%23fff'>C12</text></g><path d='M295,115 L315,165' stroke='%23ef4444' stroke-width='4' stroke-dasharray='4,2'/></svg>",
        objects: [
          { id: "obj-6", label: "IC Chip", confidence: 0.99, bbox: [330, 180, 140, 140], color: "#00ff87", mask: [[330,180],[470,180],[470,320],[330,320]] },
          { id: "obj-7", label: "Short Circuit Scratch", confidence: 0.93, bbox: [290, 110, 30, 60], color: "#ff007f", mask: [[290,110],[320,110],[320,170],[290,170]] },
          { id: "obj-8", label: "Capacitor", confidence: 0.95, bbox: [245, 135, 30, 30], color: "#f59e0b", mask: [[245,135],[275,135],[275,165],[245,165]] }
        ],
        embedding: [0.82, -0.45, 0.67, -0.12, 0.94, -0.31],
        proj2D: [450, 120],
        proj3D: [450, 120, 210],
        layerActivations: {
          conv1: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23065f46'/><line x1='10' y1='10' x2='90' y2='90' stroke='%23ef4444' stroke-width='6'/></svg>",
          conv3: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23064e3b'/><rect x='30' y='30' width='40' height='40' fill='%2334d399'/></svg>",
          attention: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><radialGradient id='g3'><stop offset='0%25' stop-color='%23ef4444'/><stop offset='100%25' stop-color='transparent'/></radialGradient><rect width='100' height='100' fill='%23047857'/><circle cx='35' cy='30' r='25' fill='url(%23g3)'/></svg>"
        }
      }
    ]
  },
  {
    id: "retail-inventory",
    name: "Retail Shelf Analytics & Inventory Tracking",
    description: "Automatic product recognition, empty shelf gap detection, stock counting, and planogram compliance.",
    domain: "Retail Tech",
    sampleCount: 2150,
    mAP: "91.2%",
    latencyMs: 11.0,
    images: [
      {
        id: "ret-1",
        title: "Supermarket Beverage Aisle",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='800' height='500' fill='%230f172a'/><rect x='40' y='120' width='720' height='16' fill='%23475569'/><rect x='40' y='280' width='720' height='16' fill='%23475569'/><g transform='translate(100, 30)'><rect width='50' height='85' rx='8' fill='%23ef4444'/><ellipse cx='25' cy='12' rx='20' ry='6' fill='%23fca5a5'/></g><g transform='translate(400, 30)'><rect width='50' height='85' rx='8' fill='%233b82f6'/><ellipse cx='25' cy='12' rx='20' ry='6' fill='%2393c5fd'/></g><g transform='translate(100, 180)'><rect width='50' height='95' rx='8' fill='%2310b981'/><ellipse cx='25' cy='12' rx='20' ry='6' fill='%236ee7b7'/></g><g transform='translate(580, 180)'><rect width='120' height='95' rx='8' fill='none' stroke='%23f59e0b' stroke-width='3' stroke-dasharray='6,6'/><text x='15' y='55' fill='%23f59e0b' font-family='sans-serif' font-weight='bold' font-size='14'>OUT OF STOCK</text></g></svg>",
        objects: [
          { id: "obj-9", label: "Soda Can Red", confidence: 0.97, bbox: [100, 30, 50, 85], color: "#ff007f", mask: [[100,30],[150,30],[150,115],[100,115]] },
          { id: "obj-10", label: "Water Bottle Blue", confidence: 0.95, bbox: [400, 30, 50, 85], color: "#00f0ff", mask: [[400,30],[450,30],[450,115],[400,115]] },
          { id: "obj-11", label: "Green Tea Can", confidence: 0.93, bbox: [100, 180, 50, 95], color: "#00ff87", mask: [[100,180],[150,180],[150,275],[100,275]] },
          { id: "obj-12", label: "Out of Stock Gap", confidence: 0.89, bbox: [580, 180, 120, 95], color: "#f59e0b", mask: [[580,180],[700,180],[700,275],[580,275]] }
        ],
        embedding: [-0.15, -0.62, 0.45, 0.77, -0.80, 0.11],
        proj2D: [310, 380],
        proj3D: [310, 380, 310],
        layerActivations: {
          conv1: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%2327272a'/><rect x='10' y='20' width='20' height='60' fill='%23ef4444'/><rect x='40' y='20' width='20' height='60' fill='%233b82f6'/></svg>",
          conv3: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%2318181b'/><circle cx='50' cy='50' r='30' fill='%2310b981'/></svg>",
          attention: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><radialGradient id='g4'><stop offset='0%25' stop-color='%233b82f6'/><stop offset='100%25' stop-color='transparent'/></radialGradient><rect width='100' height='100' fill='%23000'/><circle cx='70' cy='40' r='30' fill='url(%23g4)'/></svg>"
        }
      }
    ]
  },
  {
    id: "medical-imaging",
    name: "Medical Diagnostic X-Ray & MRI Cell Segmentation",
    description: "Lesion segmentation, bone fracture identification, cell organelle tracking, and radiomic feature analysis.",
    domain: "Healthcare AI",
    sampleCount: 640,
    mAP: "96.1%",
    latencyMs: 22.4,
    images: [
      {
        id: "med-1",
        title: "Chest X-Ray Radiograph View",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='800' height='500' fill='%23020617'/><path d='M220,100 Q150,250 260,420 Q350,420 360,250 Z' fill='%23334155' opacity='0.8'/><path d='M580,100 Q650,250 540,420 Q450,420 440,250 Z' fill='%23334155' opacity='0.8'/><rect x='385' y='60' width='30' height='380' rx='4' fill='%2364748b' opacity='0.9'/><ellipse cx='260' cy='280' rx='35' ry='25' fill='%23f43f5e' opacity='0.9'/></svg>",
        objects: [
          { id: "obj-13", label: "Right Lung Field", confidence: 0.98, bbox: [180, 100, 180, 320], color: "#00f0ff", mask: [[180,100],[360,100],[360,420],[180,420]] },
          { id: "obj-14", label: "Left Lung Field", confidence: 0.97, bbox: [440, 100, 180, 320], color: "#00f0ff", mask: [[440,100],[620,100],[620,420],[440,420]] },
          { id: "obj-15", label: "Nodule Anomaly", confidence: 0.94, bbox: [225, 255, 70, 50], color: "#ff007f", mask: [[225,255],[295,255],[295,305],[225,305]] }
        ],
        embedding: [0.12, 0.91, -0.84, 0.33, 0.72, -0.66],
        proj2D: [520, 410],
        proj3D: [520, 410, 430],
        layerActivations: {
          conv1: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%2318181b'/><ellipse cx='50' cy='50' rx='30' ry='40' fill='%2371717a'/></svg>",
          conv3: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%2309090b'/><circle cx='40' cy='60' r='20' fill='%23f43f5e'/></svg>",
          attention: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><radialGradient id='g5'><stop offset='0%25' stop-color='%23f43f5e'/><stop offset='100%25' stop-color='transparent'/></radialGradient><rect width='100' height='100' fill='%23000'/><circle cx='40' cy='60' r='35' fill='url(%23g5)'/></svg>"
        }
      }
    ]
  }
];

export const MOCK_VECTOR_CLUSTER = [
  { id: "vec-1", x: 120, y: 240, z: 85, label: "Downtown Intersection Rush Hour", category: "Automotive AI", color: "#00f0ff", sim: 0.94 },
  { id: "vec-2", x: 145, y: 260, z: 110, label: "Highway Night Driving Stream", category: "Automotive AI", color: "#00f0ff", sim: 0.89 },
  { id: "vec-3", x: 160, y: 220, z: 95, label: "Suburban Road Intersection", category: "Automotive AI", color: "#00f0ff", sim: 0.87 },
  { id: "vec-4", x: 450, y: 120, z: 210, label: "Micro PCB Microcontroller Inspection", category: "Smart Manufacturing", color: "#00ff87", sim: 0.98 },
  { id: "vec-5", x: 470, y: 135, z: 225, label: "Solar Cell Solder Fracture", category: "Smart Manufacturing", color: "#00ff87", sim: 0.91 },
  { id: "vec-6", x: 430, y: 110, z: 195, label: "Wafer Edge Defect Mapping", category: "Smart Manufacturing", color: "#00ff87", sim: 0.93 },
  { id: "vec-7", x: 310, y: 380, z: 310, label: "Supermarket Beverage Aisle", category: "Retail Tech", color: "#f59e0b", sim: 0.95 },
  { id: "vec-8", x: 325, y: 395, z: 325, label: "Cereal Box Planogram Audit", category: "Retail Tech", color: "#f59e0b", sim: 0.88 },
  { id: "vec-9", x: 520, y: 410, z: 430, label: "Chest X-Ray Radiograph View", category: "Healthcare AI", color: "#ff007f", sim: 0.97 },
  { id: "vec-10", x: 540, y: 425, z: 445, label: "Brain MRI Glaucoma Tissue Scan", category: "Healthcare AI", color: "#ff007f", sim: 0.92 }
];

export const CLIP_PROMPT_TEMPLATES = [
  "a photo of a sedan car on city road",
  "a microchip on a green circuit board with defects",
  "supermarket shelf with colorful beverage cans",
  "medical chest radiograph showing lung tissue",
  "a pedestrian walking across a crosswalk",
  "empty retail store gap on shelf"
];
