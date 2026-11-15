import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, 
  Settings, 
  Key, 
  RotateCcw, 
  Play, 
  Pause, 
  Layers, 
  Info, 
  Check, 
  Sparkles,
  Maximize2,
  RefreshCw,
  Box
} from 'lucide-react';

const BIODIGITAL_MODELS = [
  {
    id: 'production/maleAdult/male_complete_anatomy_01',
    name: 'Complete Male Anatomy (Full Body)',
    category: 'Whole Body System',
    description: 'Full-body realistic 3D human anatomy including skeletal, muscular, visceral, and vascular layers.'
  },
  {
    id: 'production/maleAdult/beating_heart_02',
    name: 'Beating Heart & Coronary Circulation',
    category: 'Cardiovascular System',
    description: 'Photorealistic animated beating heart with cardiac chambers, aortic arch, and coronary blood flow.'
  },
  {
    id: 'production/maleAdult/respiratory_system_01',
    name: 'Respiratory System & Lungs',
    category: 'Pulmonary System',
    description: 'Detailed lung lobes, bronchial arborization, trachea, and diaphragm gas exchange mechanisms.'
  },
  {
    id: 'production/maleAdult/urinary_system_01',
    name: 'Kidneys & Renal Excretory System',
    category: 'Urinary System',
    description: 'Renal cortex, medullary pyramids, nephron micro-architecture, and adrenal glands.'
  },
  {
    id: 'production/maleAdult/skeletal_system_01',
    name: 'Skeletal System & Bone Matrix',
    category: 'Skeletal System',
    description: 'Complete osteological structure with trabecular bone density and joint articulations.'
  },
  {
    id: 'production/maleAdult/muscular_system_01',
    name: 'Full Body Muscular Framework',
    category: 'Muscular System',
    description: 'Detailed superficial and deep muscular compartments, fascial planes, and tendon insertions.'
  },
  {
    id: 'production/maleAdult/brain_cortex_01',
    name: 'Brain, Cerebrum & Neural Cortex',
    category: 'Nervous System',
    description: 'Cerebral hemispheres, cerebellar folia, brainstem, and cranial nerve pathways.'
  }
];

export default function BioDigitalViewer({
  selectedModelId,
  onSelectModel,
  onSwitchToCyberMode
}) {
  const [modelId, setModelId] = useState(
    selectedModelId || import.meta.env.VITE_BIODIGITAL_MODEL_ID || BIODIGITAL_MODELS[0].id
  );
  const [devKey, setDevKey] = useState(import.meta.env.VITE_BIODIGITAL_KEY || '');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const humanApiInstance = useRef(null);

  useEffect(() => {
    if (selectedModelId) {
      setModelId(selectedModelId);
    }
  }, [selectedModelId]);

  // Construct the BioDigital Human Viewer embed URL
  const getEmbedUrl = () => {
    const keyParam = devKey ? `&dk=${encodeURIComponent(devKey)}` : '';
    // Parameters configure dark space theme and interactive 3D navigation tools
    return `https://human.biodigital.com/viewer/?id=${modelId}${keyParam}&ui-tools=true&ui-panel=true&ui-nav=true&ui-info=true&ui-zoom=true&ui-rotate=true&bg-color=050505`;
  };

  // Initialize BioDigital Human API if available
  useEffect(() => {
    if (window.HumanAPI && iframeLoaded) {
      try {
        const human = new window.HumanAPI('biodigital-iframe');
        humanApiInstance.current = human;
        human.on('ready', () => {
          setIsApiReady(true);
          // Set dark background via API
          human.send('ui.setBackground', {
            colors: ['#050505', '#0b1120'],
            gradientType: 'radial'
          });
        });
      } catch (err) {
        console.warn('[BioDigital API] Instantiation note:', err);
      }
    }
  }, [iframeLoaded, modelId]);

  const handleTogglePlay = () => {
    if (humanApiInstance.current && isApiReady) {
      if (isPlaying) {
        humanApiInstance.current.send('timeline.pause');
      } else {
        humanApiInstance.current.send('timeline.play');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleResetView = () => {
    if (humanApiInstance.current && isApiReady) {
      humanApiInstance.current.send('camera.reset');
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: '#050505',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      {/* Top BioDigital Control Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        {/* Model Selector Dropdown */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={modelId}
            onChange={(e) => {
              setModelId(e.target.value);
              if (onSelectModel) onSelectModel(e.target.value);
            }}
            style={{
              background: 'rgba(5, 8, 17, 0.9)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-tech)',
              fontSize: '0.84rem',
              fontWeight: 600,
              outline: 'none',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer'
            }}
          >
            {BIODIGITAL_MODELS.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Tools: Timeline, Reset, Settings, Switch Engine */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isApiReady && (
            <button
              onClick={handleTogglePlay}
              className="btn-secondary"
              title="Play/Pause 3D Timeline Animation"
              style={{ fontSize: '0.76rem', padding: '6px 12px' }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>
          )}

          {isApiReady && (
            <button
              onClick={handleResetView}
              className="btn-secondary"
              title="Reset 3D Perspective"
              style={{ fontSize: '0.76rem', padding: '6px 10px' }}
            >
              <RotateCcw size={13} />
            </button>
          )}

          {/* BioDigital Key Configuration Button */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="btn-secondary"
            title="Configure BioDigital Developer Key"
            style={{
              fontSize: '0.76rem',
              padding: '6px 12px',
              borderColor: devKey ? 'var(--green-safe)' : 'var(--orange-accent)',
              color: devKey ? 'var(--green-safe)' : 'var(--orange-accent)'
            }}
          >
            <Key size={13} />
            <span>{devKey ? 'KEY ACTIVE' : 'ADD KEY'}</span>
          </button>

          {/* Switch to Cyber 3D Three.js Engine */}
          <button
            onClick={onSwitchToCyberMode}
            className="btn-primary"
            title="Switch to Holographic Cyber 3D Engine"
            style={{ fontSize: '0.76rem', padding: '6px 14px' }}
          >
            <Box size={13} />
            <span>CYBER 3D</span>
          </button>
        </div>
      </div>

      {/* Embedded BioDigital Human Viewer Iframe */}
      <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
        <iframe
          id="biodigital-iframe"
          src={getEmbedUrl()}
          title="BioDigital Human 3D Anatomy Model"
          width="100%"
          height="100%"
          style={{
            border: 'none',
            display: 'block',
            background: '#050505'
          }}
          allow="fullscreen; accelerometer; gyroscope; magnetometer; vr"
          allowFullScreen
          onLoad={() => setIframeLoaded(true)}
        />

        {!devKey && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            background: 'rgba(17, 17, 19, 0.94)',
            border: '1px solid var(--orange-accent)',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            zIndex: 15
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} style={{ color: 'var(--orange-accent)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.8rem', color: '#FFF', fontFamily: 'var(--font-tech)' }}>
                <strong>BioDigital API Key Required:</strong> To load proprietary BioDigital Human models without origin restrictions, add your Developer Key via <strong>"ADD KEY"</strong>, or switch to the <strong>Native 3D Anatomy</strong> engine.
              </div>
            </div>
            <button
              onClick={onSwitchToCyberMode}
              className="btn-primary"
              style={{
                fontSize: '0.76rem',
                padding: '6px 14px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              ★ USE NATIVE 3D BODY
            </button>
          </div>
        )}
      </div>

      {/* Bottom Info Status Bar */}
      <div style={{
        padding: '8px 16px',
        background: 'rgba(5, 8, 17, 0.95)',
        borderTop: '1px solid rgba(0, 229, 255, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.74rem',
        fontFamily: 'var(--font-tech)',
        color: 'var(--text-secondary)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: devKey ? 'var(--green-safe)' : 'var(--orange-accent)',
            boxShadow: devKey ? '0 0 6px var(--green-safe)' : '0 0 6px var(--orange-accent)'
          }} />
          <span>
            ENGINE: <strong style={{ color: '#00E5FF' }}>BIODIGITAL HUMAN 3D VIEWER</strong> • FULL 360° ROTATION & DISSECTION ACTIVE
          </span>
        </div>

        <a
          href="https://developer.biodigital.com/docs/widget/getting-started/embed-content"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--orange-accent)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>BioDigital Docs</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* BioDigital Developer Key Configuration Modal */}
      {showConfigModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel cyber-corners" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '26px',
            background: 'rgba(17, 17, 19, 0.98)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} color="#00E5FF" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#FFF' }}>
                  BioDigital Developer Key Setup
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '16px' }}>
              To embed unrestricted, photorealistic 3D models from the BioDigital Human library on your domain or localhost, enter your developer key from{' '}
              <a href="https://developer.biodigital.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange-accent)' }}>
                developer.biodigital.com
              </a>.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-tech)', color: '#FFF', marginBottom: '6px' }}>
                DEVELOPER KEY (dk)
              </label>
              <input
                type="text"
                value={devKey}
                onChange={(e) => setDevKey(e.target.value)}
                placeholder="e.g. your_biodigital_developer_key"
                style={{
                  width: '100%',
                  background: 'rgba(24, 24, 27, 0.9)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Or configure <code>VITE_BIODIGITAL_KEY</code> in your <code>.env</code> file.
              </span>
            </div>

            <div style={{
              background: 'rgba(24, 24, 27, 0.7)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '18px',
              fontSize: '0.76rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Localhost Notice:</strong> In your BioDigital Developer Console under <em>Manage Apps</em>, ensure <code>127.0.0.1</code> or <code>localhost:3000</code> is added to your authorized app domains.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowConfigModal(false)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '8px 18px' }}
              >
                <Check size={14} /> SAVE & APPLY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
