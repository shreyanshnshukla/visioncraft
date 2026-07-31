import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { CLIP_PROMPT_TEMPLATES } from '../data/presetDatasets';
import { computeZeroShotScores } from '../utils/cvEngine';

export default function ZeroShotStudio({ dataset }) {
  const [prompts, setPrompts] = useState([
    "a photo of a sedan car on city road",
    "a microchip on a green circuit board with defects",
    "supermarket shelf with colorful beverage cans",
    "medical chest radiograph showing lung tissue"
  ]);
  const [newPromptText, setNewPromptText] = useState("");
  const [vqaQuestion, setVqaQuestion] = useState("Is there any safety hazard or defect detected?");

  const selectedImg = dataset.images[0];
  const scores = computeZeroShotScores(prompts, dataset.domain);

  const handleAddPrompt = (textToAdd) => {
    const txt = textToAdd || newPromptText;
    if (txt && !prompts.includes(txt)) {
      setPrompts([...prompts, txt]);
      setNewPromptText("");
    }
  };

  const handleRemovePrompt = (idx) => {
    setPrompts(prompts.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      
      {/* Left Input Prompt Manager */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary-magenta)" />
            OpenAI CLIP Multimodal Zero-Shot Playground
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Classify images without fine-tuning using natural language text prompts
          </p>
        </div>

        {/* Selected Image Thumbnail Preview */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #1e293b',
          marginBottom: '16px'
        }}>
          <img src={selectedImg.url} alt={selectedImg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(2,6,23,0.9))', padding: '10px 14px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedImg.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Domain Context: {dataset.domain}</div>
          </div>
        </div>

        {/* Add Prompt Controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <input 
            type="text"
            className="input-custom"
            placeholder="Type custom prompt e.g. 'a golden retriever'..."
            value={newPromptText}
            onChange={(e) => setNewPromptText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPrompt()}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={() => handleAddPrompt()} style={{ padding: '8px 14px' }}>
            <Plus size={16} /> Add Prompt
          </button>
        </div>

        {/* Preset Prompt Recommendations */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Suggested Prompts:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {CLIP_PROMPT_TEMPLATES.map((tmpl, idx) => (
              <span 
                key={idx}
                onClick={() => handleAddPrompt(tmpl)}
                style={{
                  fontSize: '0.75rem',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid #334155',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                + {tmpl}
              </span>
            ))}
          </div>
        </div>

        {/* Visual Question Answering (VQA) Sandbox */}
        <div style={{ paddingTop: '14px', borderTop: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={16} color="var(--primary-cyan)" /> Visual Question Answering (VQA)
          </h3>
          <input 
            type="text" 
            className="input-custom" 
            value={vqaQuestion} 
            onChange={(e) => setVqaQuestion(e.target.value)} 
            style={{ width: '100%', marginBottom: '10px' }} 
          />
          <div style={{ background: '#020617', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.82rem' }}>
            <strong style={{ color: 'var(--primary-emerald)' }}>Visual Reasoning Answer:</strong>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
              "Yes. High-confidence detection ({selectedImg.objects[0]?.label}) verified at coordinates [{selectedImg.objects[0]?.bbox.join(', ')}]."
            </p>
          </div>
        </div>

      </div>

      {/* Right Similarity Probability Softmax Bars */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={20} color="var(--primary-emerald)" />
          Zero-Shot Softmax Probability Distribution
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {scores.map((item, idx) => {
            const isTop = idx === 0;
            return (
              <div key={idx} style={{ background: isTop ? 'rgba(0, 240, 255, 0.08)' : 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: isTop ? '1px solid var(--primary-cyan)' : '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: isTop ? 700 : 500, color: isTop ? '#fff' : 'var(--text-muted)' }}>
                    "{item.prompt}"
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge-status ${isTop ? 'badge-cyan' : 'badge-emerald'}`}>
                      {(item.score * 100).toFixed(1)}%
                    </span>
                    <button onClick={() => handleRemovePrompt(idx)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: '#020617', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.score * 100}%`,
                    height: '100%',
                    background: isTop ? 'linear-gradient(90deg, #00f0ff, #8a2be2)' : 'var(--primary-emerald)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
