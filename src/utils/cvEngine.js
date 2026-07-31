// Computer Vision Engine Helper Utilities

/**
 * Calculates Cosine Similarity between two numerical vector arrays
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculates Euclidean Distance between 2D or 3D points
 */
export function euclideanDistance(p1, p2) {
  let sum = 0;
  for (let i = 0; i < Math.min(p1.length, p2.length); i++) {
    sum += Math.pow(p1[i] - p2[i], 2);
  }
  return Math.sqrt(sum);
}

/**
 * Generates YOLO Format Text
 */
export function exportToYOLO(objects, imgWidth = 800, imgHeight = 500) {
  const classMap = { "Car": 0, "Truck": 1, "Pedestrian": 2, "Traffic Light": 3, "IC Chip": 4, "Short Circuit Scratch": 5, "Capacitor": 6, "Soda Can Red": 7, "Water Bottle Blue": 8, "Green Tea Can": 9, "Out of Stock Gap": 10, "Right Lung Field": 11, "Left Lung Field": 12, "Nodule Anomaly": 13 };
  
  return objects.map(obj => {
    const classId = classMap[obj.label] ?? 0;
    const [x, y, w, h] = obj.bbox;
    const xCenter = ((x + w / 2) / imgWidth).toFixed(6);
    const yCenter = ((y + h / 2) / imgHeight).toFixed(6);
    const normW = (w / imgWidth).toFixed(6);
    const normH = (h / imgHeight).toFixed(6);
    return `${classId} ${xCenter} ${yCenter} ${normW} ${normH}`;
  }).join('\n');
}

/**
 * Generates COCO Format JSON
 */
export function exportToCOCO(objects, imageTitle = "sample.jpg", imgWidth = 800, imgHeight = 500) {
  const categories = Array.from(new Set(objects.map(o => o.label))).map((name, idx) => ({
    id: idx + 1,
    name: name,
    supercategory: "object"
  }));

  const annotations = objects.map((obj, idx) => {
    const cat = categories.find(c => c.name === obj.label);
    const [x, y, w, h] = obj.bbox;
    return {
      id: idx + 101,
      image_id: 1,
      category_id: cat ? cat.id : 1,
      bbox: [x, y, w, h],
      area: w * h,
      segmentation: [obj.mask ? obj.mask.flat() : [x,y, x+w,y, x+w,y+h, x,y+h]],
      iscrowd: 0,
      score: obj.confidence
    };
  });

  return JSON.stringify({
    info: { description: "VisionCraft AI Dataset Export", year: 2026, version: "1.0" },
    images: [{ id: 1, file_name: imageTitle, width: imgWidth, height: imgHeight }],
    annotations: annotations,
    categories: categories
  }, null, 2);
}

/**
 * Generates Pascal VOC Format XML
 */
export function exportToPascalVOC(objects, imageTitle = "sample.jpg", imgWidth = 800, imgHeight = 500) {
  const objXml = objects.map(obj => {
    const [x, y, w, h] = obj.bbox;
    return `  <object>
    <name>${obj.label}</name>
    <pose>Unspecified</pose>
    <truncated>0</truncated>
    <difficult>0</difficult>
    <bndbox>
      <xmin>${x}</xmin>
      <ymin>${y}</ymin>
      <xmax>${x + w}</xmax>
      <ymax>${y + h}</ymax>
    </bndbox>
  </object>`;
  }).join('\n');

  return `<annotation>
  <folder>visioncraft_exports</folder>
  <filename>${imageTitle}</filename>
  <size>
    <width>${imgWidth}</width>
    <height>${imgHeight}</height>
    <depth>3</depth>
  </size>
${objXml}
</annotation>`;
}

/**
 * Simulated CLIP Zero-Shot Softmax Score Calculator
 */
export function computeZeroShotScores(prompts, imageDomain) {
  if (!prompts || prompts.length === 0) return [];

  // Relevance heuristic for mock image domain
  const rawScores = prompts.map(prompt => {
    const p = prompt.toLowerCase();
    let score = 0.05 + Math.random() * 0.1;
    if (imageDomain.includes("Automotive") && (p.includes("car") || p.includes("road") || p.includes("traffic") || p.includes("pedestrian"))) {
      score += 0.75 + Math.random() * 0.15;
    } else if (imageDomain.includes("Manufacturing") && (p.includes("chip") || p.includes("circuit") || p.includes("defect") || p.includes("micro"))) {
      score += 0.80 + Math.random() * 0.15;
    } else if (imageDomain.includes("Retail") && (p.includes("shelf") || p.includes("beverage") || p.includes("can") || p.includes("gap") || p.includes("supermarket"))) {
      score += 0.78 + Math.random() * 0.15;
    } else if (imageDomain.includes("Healthcare") && (p.includes("x-ray") || p.includes("radiograph") || p.includes("chest") || p.includes("lung") || p.includes("medical"))) {
      score += 0.85 + Math.random() * 0.12;
    }
    return score;
  });

  // Softmax normalization
  const expScores = rawScores.map(s => Math.exp(s * 3));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  return prompts.map((prompt, idx) => ({
    prompt,
    score: (expScores[idx] / sumExp)
  })).sort((a, b) => b.score - a.score);
}
