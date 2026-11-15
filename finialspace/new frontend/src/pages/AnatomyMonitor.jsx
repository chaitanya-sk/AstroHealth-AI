import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Wind, 
  Brain, 
  Bone, 
  Activity, 
  ShieldCheck, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Layers, 
  ShieldAlert, 
  Search, 
  Sliders, 
  Maximize2,
  AlertTriangle,
  RefreshCw,
  Info,
  CheckCircle2,
  Compass,
  Scan,
  Crosshair
} from 'lucide-react';
import HolographicScanViewer from '../components/HolographicScanViewer';
import HealthInfoPanel from '../components/HealthInfoPanel';
import { getBodyStatus } from '../services/api';

export default function AnatomyMonitor() {
  const [selectedOrgan, setSelectedOrgan] = useState('heart');
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showLaserScan, setShowLaserScan] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetCount, setResetCount] = useState(0);

  // Anatomy Explorer System Toggles (Matching Reference Image)
  const [systems, setSystems] = useState({
    skeletal: true,
    muscular: true,
    nervous: true,
    cardiovascular: true,
    respiratory: true,
    digestive: true,
    lymphatic: true,
    integumentary: true
  });

  // Opacity Sliders (Matching Reference Image)
  const [opacities, setOpacities] = useState({
    integumentary: 0.15,
    muscular: 0.92,
    skeletal: 0.95
  });

  // Organ Health Statuses
  const [organStatuses, setOrganStatuses] = useState({
    leftKidney: 'HEALTHY',
    rightKidney: 'HEALTHY',
    cerebrum: 'HEALTHY',
    heart: 'HEALTHY',
    lungs: 'HEALTHY',
    liver: 'HEALTHY',
    bicepsBrachii: 'HEALTHY',
    femur: 'HEALTHY',
    lymphatic: 'HEALTHY',
    colon: 'HEALTHY',
    stomach: 'HEALTHY',
    vascular: 'HEALTHY',
    femoralNodule: 'HEALTHY'
  });

  const [bodyData, setBodyData] = useState(null);
  const [backendSource, setBackendSource] = useState('offline-telemetry');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAlertNotification, setActiveAlertNotification] = useState(null);

  // Toggle single system layer
  const handleToggleSystem = (key) => {
    setSystems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Load telemetry
  const loadData = async () => {
    setIsLoading(true);
    const result = await getBodyStatus();
    if (result && result.organs) {
      setBodyData(result.organs);
      setBackendSource(result.source || 'offline-telemetry');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectOrgan = (organId) => {
    setSelectedOrgan(organId);
  };

  const handleResetCamera = () => {
    setSelectedOrgan('heart');
    setResetCount(prev => prev + 1);
  };

  // ================= SIMULATE BACKEND ALERTS =================
  const triggerKidneyAlert = () => {
    setSelectedOrgan('leftKidney');
    setOrganStatuses(prev => ({ ...prev, leftKidney: 'WARNING' }));
    setActiveAlertNotification({
      organ: 'Left Kidney (Renal System)',
      title: 'Calcium Oxalate Supersaturation Warning',
      severity: 'WARNING',
      metric: 'Serum Calcium Excretion: 340 mg/24h',
      action: 'Increase fluid intake by 1200 mL; ingest potassium citrate countermeasure.'
    });
  };

  const triggerCardioAlert = () => {
    setSelectedOrgan('heart');
    setOrganStatuses(prev => ({ ...prev, heart: 'CRITICAL', vascular: 'CRITICAL' }));
    setActiveAlertNotification({
      organ: 'Heart & Coronary Vessels',
      title: 'Elevated Cardiovascular Afterload Detected',
      severity: 'CRITICAL',
      metric: 'Blood Pressure: 154/98 mmHg • HR: 112 BPM',
      action: 'Cease physical EVA task immediately; initiate pressurized lower body suit countermeasure.'
    });
  };

  const resetAllNominal = () => {
    const nominal = {};
    Object.keys(organStatuses).forEach(k => nominal[k] = 'HEALTHY');
    setOrganStatuses(nominal);
    setActiveAlertNotification(null);
    loadData();
    handleResetCamera();
  };

  const currentOrganData = bodyData ? bodyData[selectedOrgan] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '30px' }}>

      {/* ================= TOP NAVIGATION BAR ================= */}
      <div style={{
        background: 'rgba(17, 17, 19, 0.95)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }} className="glass-panel">
        {/* Left: Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(0, 229, 255, 0.15)',
            border: '1px solid #00E5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00E5FF'
          }}>
            <Compass size={20} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.04em'
            }}>
              Anatomy Explorer
            </h1>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
              Full-Body Holographic Biometric Scan • Sol 147 Mars Expedition
            </div>
          </div>
        </div>

        {/* Center: Search input */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search anatomical structure..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(24, 24, 27, 0.85)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '7px 12px 7px 32px',
              color: '#FFF',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-tech)',
              outline: 'none'
            }}
          />
        </div>

        {/* Right: Controls & Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Active Mode Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            borderRadius: '8px',
            padding: '6px 14px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00E5FF',
              boxShadow: '0 0 8px #00E5FF'
            }} />
            <span style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#00E5FF',
              letterSpacing: '0.05em'
            }}>
              HOLOGRAPHIC SCAN ACTIVE
            </span>
          </div>

          {/* Toggle Callout Hotspots */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="btn-secondary"
            title="Toggle Hotspot Callouts"
            style={{
              fontSize: '0.78rem',
              padding: '7px 14px',
              borderColor: showAnnotations ? 'var(--orange-accent)' : 'var(--border-color)',
              color: showAnnotations ? 'var(--orange-accent)' : 'var(--text-secondary)'
            }}
          >
            <Crosshair size={14} />
            <span>{showAnnotations ? 'HOTSPOTS ON' : 'HOTSPOTS OFF'}</span>
          </button>

          {/* Toggle Laser Scanner */}
          <button
            onClick={() => setShowLaserScan(!showLaserScan)}
            className="btn-secondary"
            title="Toggle Laser Scan Beam"
            style={{
              fontSize: '0.78rem',
              padding: '7px 14px',
              borderColor: showLaserScan ? '#00E5FF' : 'var(--border-color)',
              color: showLaserScan ? '#00E5FF' : 'var(--text-secondary)'
            }}
          >
            <Scan size={14} />
            <span>{showLaserScan ? 'SCANNER ON' : 'SCANNER OFF'}</span>
          </button>

          {/* Reset Camera View */}
          <button
            onClick={handleResetCamera}
            className="btn-secondary"
            title="Reset Scan View"
            style={{ fontSize: '0.78rem', padding: '7px 14px' }}
          >
            <RotateCcw size={14} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* ================= ACTIVE BACKEND CLINICAL ALERT BANNER ================= */}
      {activeAlertNotification && (
        <div style={{
          background: activeAlertNotification.severity === 'CRITICAL' 
            ? 'linear-gradient(90deg, rgba(255, 77, 79, 0.22), rgba(16, 42, 67, 0.95))' 
            : 'linear-gradient(90deg, rgba(255, 176, 32, 0.20), rgba(16, 42, 67, 0.95))',
          border: `1px solid ${activeAlertNotification.severity === 'CRITICAL' ? 'var(--status-critical)' : 'var(--status-warning)'}`,
          borderRadius: '16px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
        }} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: activeAlertNotification.severity === 'CRITICAL' ? 'rgba(255, 77, 79, 0.2)' : 'rgba(255, 176, 32, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activeAlertNotification.severity === 'CRITICAL' ? 'var(--status-critical)' : 'var(--status-warning)'
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-tech)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: activeAlertNotification.severity === 'CRITICAL' ? 'var(--red-emergency)' : 'var(--orange-accent)',
                  color: '#000',
                  fontWeight: 800
                }}>
                  {activeAlertNotification.severity} CLINICAL EVENT
                </span>
                <span style={{ color: '#FFF', fontWeight: 700, fontSize: '0.95rem' }}>
                  {activeAlertNotification.title}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {activeAlertNotification.metric} • Recommended Countermeasure: <strong style={{ color: '#FFF' }}>{activeAlertNotification.action}</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveAlertNotification(null)}
            className="btn-secondary"
            style={{ fontSize: '0.76rem', padding: '6px 14px' }}
          >
            DISMISS
          </button>
        </div>
      )}

      {/* 3-COLUMN ANATOMY DASHBOARD */}
      <div
        className="anatomy-3col-responsive"
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr 340px',
          gap: '16px',
          minHeight: '740px'
        }}
      >

        {/* ================= LEFT PANEL: ANATOMY EXPLORER SYSTEM CONTROLS ================= */}
        <div
          className="glass-panel cyber-corners"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: '#00E5FF' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', fontWeight: 700, color: '#FFF' }}>
                Anatomy Explorer
              </h2>
            </div>
            <Sliders size={16} style={{ color: 'var(--text-secondary)' }} />
          </div>

          {/* System Toggle Switches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { key: 'skeletal', label: 'Skeletal' },
              { key: 'muscular', label: 'Muscular' },
              { key: 'nervous', label: 'Nervous' },
              { key: 'cardiovascular', label: 'Cardiovascular' },
              { key: 'respiratory', label: 'Respiratory' },
              { key: 'digestive', label: 'Digestive' },
              { key: 'lymphatic', label: 'Lymphatic' },
              { key: 'integumentary', label: 'Integumentary' }
            ].map(sys => (
              <div
                key={sys.key}
                onClick={() => handleToggleSystem(sys.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: systems[sys.key] ? 'rgba(0, 229, 255, 0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${systems[sys.key] ? 'rgba(0, 229, 255, 0.25)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-tech)',
                  color: systems[sys.key] ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: systems[sys.key] ? 600 : 400
                }}>
                  {sys.label}
                </span>

                {/* Cyber Switch Capsule */}
                <div style={{
                  width: '36px',
                  height: '18px',
                  borderRadius: '10px',
                  background: systems[sys.key] ? '#00E5FF' : 'rgba(255,255,255,0.12)',
                  position: 'relative',
                  transition: 'background 0.2s ease'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: systems[sys.key] ? '19px' : '2px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: systems[sys.key] ? '#000000' : '#FFFFFF',
                    transition: 'left 0.2s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Opacity Sliders */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Layer Opacity Controls
            </div>

            {/* Integumentary Opacity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Skin Opacity</span>
                <span style={{ color: '#00E5FF', fontFamily: 'var(--font-tech)' }}>{Math.round(opacities.integumentary * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacities.integumentary}
                onChange={(e) => setOpacities({ ...opacities, integumentary: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#00E5FF' }}
              />
            </div>

            {/* Muscular Opacity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Muscular Opacity</span>
                <span style={{ color: 'var(--orange-accent)', fontFamily: 'var(--font-tech)' }}>{Math.round(opacities.muscular * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacities.muscular}
                onChange={(e) => setOpacities({ ...opacities, muscular: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--orange-accent)' }}
              />
            </div>

            {/* Skeletal Opacity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Skeletal Opacity</span>
                <span style={{ color: 'var(--yellow-warning)', fontFamily: 'var(--font-tech)' }}>{Math.round(opacities.skeletal * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacities.skeletal}
                onChange={(e) => setOpacities({ ...opacities, skeletal: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--yellow-warning)' }}
              />
            </div>
          </div>

          {/* Quick Simulation Trigger Buttons */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={triggerKidneyAlert}
              className="btn-secondary"
              style={{ fontSize: '0.76rem', padding: '7px 10px', borderColor: 'var(--orange-accent)', color: 'var(--orange-accent)' }}
            >
              ● KIDNEY STONE ALERT
            </button>
            <button
              onClick={triggerCardioAlert}
              className="btn-secondary"
              style={{ fontSize: '0.76rem', padding: '7px 10px', borderColor: 'var(--red-emergency)', color: 'var(--red-emergency)' }}
            >
              ● CARDIO STRESS ALERT
            </button>
            <button
              onClick={resetAllNominal}
              className="btn-secondary"
              style={{ fontSize: '0.76rem', padding: '7px 10px', borderColor: 'var(--green-safe)', color: 'var(--green-safe)' }}
            >
              ✓ RESET ALL NOMINAL
            </button>
          </div>
        </div>

        {/* ================= CENTER: HOLOGRAPHIC ANATOMY VIEWPORT ================= */}
        <div
          className="glass-panel cyber-corners"
          style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 50%, #0d1527 0%, #050811 60%, #050505 100%)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '680px'
          }}
        >
          <HolographicScanViewer
            selectedOrgan={selectedOrgan}
            onSelectOrgan={handleSelectOrgan}
            organStatuses={organStatuses}
            systems={systems}
            showLaserScan={showLaserScan}
            onToggleLaserScan={() => setShowLaserScan(!showLaserScan)}
            showHotspots={showAnnotations}
            onToggleHotspots={() => setShowAnnotations(!showAnnotations)}
            resetTrigger={resetCount}
          />
        </div>

        {/* ================= RIGHT PANEL: STRUCTURE INFORMATION (MATCHING REFERENCE IMAGE) ================= */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <HealthInfoPanel
            organData={currentOrganData}
            organStatus={organStatuses[selectedOrgan] || 'HEALTHY'}
            onFocusOrgan={() => setSelectedOrgan(selectedOrgan)}
            onRunDiagnostic={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
              }, 1200);
            }}
            isAnalyzing={isLoading}
            backendSource={backendSource}
            onRefreshData={loadData}
          />
        </div>

      </div>

      <style>{`
        @media (max-width: 1200px) {
          .anatomy-3col-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
