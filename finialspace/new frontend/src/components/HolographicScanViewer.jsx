import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Crosshair
} from 'lucide-react';

// Precision hotspot coordinates mapped to the reference anatomical scan image
export const SCAN_HOTSPOTS = [
  {
    id: 'brain',
    name: 'Brain',
    fullName: 'Cerebrum & Cranial Cortex',
    category: 'Central Nervous System',
    system: 'nervous',
    x: 50.0,
    y: 5.2,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.9)'
  },
  {
    id: 'heart',
    name: 'Heart',
    fullName: 'Heart & Cardiovascular System',
    category: 'Cardiovascular System',
    system: 'cardiovascular',
    x: 51.5,
    y: 24.2,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.9)'
  },
  {
    id: 'lungs',
    name: 'Lungs',
    fullName: 'Respiratory System / Pulmonary Field',
    category: 'Pulmonary System',
    system: 'respiratory',
    x: 44.5,
    y: 21.5,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'liver',
    name: 'Liver',
    fullName: 'Hepatic System / Liver',
    category: 'Digestive & Metabolic',
    system: 'digestive',
    x: 45.8,
    y: 30.2,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'stomach',
    name: 'Stomach',
    fullName: 'Gastric Stomach',
    category: 'Digestive System',
    system: 'digestive',
    x: 53.5,
    y: 31.8,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'colon',
    name: 'Digestive System',
    fullName: 'Intestines & Colon GI Tract',
    category: 'Digestive System',
    system: 'digestive',
    x: 50.2,
    y: 41.5,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'spine',
    name: 'Spine',
    fullName: 'Vertebral Column & Spinal Axis',
    category: 'Axial Skeletal Health',
    system: 'skeletal',
    x: 48.8,
    y: 27.5,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'bones',
    name: 'Bones',
    fullName: 'Femur & Skeletal Framework',
    category: 'Skeletal System',
    system: 'skeletal',
    x: 42.5,
    y: 65.5,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'leftKidney',
    name: 'Kidneys',
    fullName: 'Renal Excretory System',
    category: 'Urinary System',
    system: 'urinary',
    x: 54.8,
    y: 35.8,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'lymphatic',
    name: 'Immune System',
    fullName: 'Lymphatic Vessels & Nodes',
    category: 'Lymphatic System',
    system: 'lymphatic',
    x: 66.8,
    y: 34.5,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'thymus',
    name: 'Thymus',
    fullName: 'Thymus (T-Cell Maturation)',
    category: 'Immune System',
    system: 'lymphatic',
    x: 50.0,
    y: 18.2,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  },
  {
    id: 'spleen',
    name: 'Spleen',
    fullName: 'Spleen (Erythrocyte & Immune Filter)',
    category: 'Immune System',
    system: 'lymphatic',
    x: 56.5,
    y: 28.5,
    color: '#28B8E8',
    glowColor: 'rgba(40, 184, 232, 0.85)'
  }
];

export default function HolographicScanViewer({
  selectedOrgan = 'heart',
  onSelectOrgan,
  organStatuses = {},
  systems = {},
  showLaserScan = true,
  onToggleLaserScan,
  showHotspots = true,
  onToggleHotspots,
  resetTrigger = 0,
  compact = false
}) {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [internalLaser, setInternalLaser] = useState(true);
  const [internalHotspots, setInternalHotspots] = useState(true);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [viewMode, setViewMode] = useState('auto'); // 'auto', 'full', 'skeletal'
  const containerRef = useRef(null);

  const isSkeletalActive = viewMode === 'skeletal' || (viewMode === 'auto' && systems && systems.skeletal && !systems.cardiovascular && !systems.digestive && !systems.respiratory);
  const scanImageUrl = isSkeletalActive ? `${import.meta.env.BASE_URL}skeleton-scan.jpg` : `${import.meta.env.BASE_URL}anatomy-scan.jpg`;

  const laserActive = onToggleLaserScan !== undefined ? showLaserScan : internalLaser;
  const hotspotsActive = onToggleHotspots !== undefined ? showHotspots : internalHotspots;

  useEffect(() => {
    setZoomLevel(1.0);
  }, [resetTrigger]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1.0);

  // Filter hotspots based on active anatomical system toggles
  const activeHotspots = SCAN_HOTSPOTS.filter(hotspot => {
    if (!systems || Object.keys(systems).length === 0) return true;
    if (hotspot.system && systems[hotspot.system] === false) return false;
    return true;
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(circle at 50% 50%, #0d253f 0%, #081a2e 50%, #071522 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Top HUD Controls - Minimal and Clean */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '16px',
        right: '16px',
        zIndex: 25,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        {/* Subtle Status Pill */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(7, 21, 34, 0.75)',
          border: '1px solid rgba(40, 184, 232, 0.25)',
          borderRadius: '10px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--cosmic-cyan)',
            boxShadow: '0 0 8px var(--cosmic-cyan)'
          }} />
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 600,
            color: 'var(--polar-white)',
            letterSpacing: '0.04em'
          }}>
            {isSkeletalActive ? '3D SKELETAL SCAN' : 'HOLOGRAPHIC BIOMETRIC SCAN'}
          </span>
        </div>

        {/* Scan Layer Selector: Full Anatomy vs 3D Skeleton */}
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          background: 'rgba(7, 21, 34, 0.85)',
          border: '1px solid rgba(40, 184, 232, 0.25)',
          borderRadius: '8px',
          padding: '2px',
          gap: '2px'
        }}>
          <button
            onClick={() => setViewMode('full')}
            style={{
              background: !isSkeletalActive ? 'rgba(40, 184, 232, 0.25)' : 'transparent',
              color: !isSkeletalActive ? 'var(--cosmic-cyan)' : 'var(--text-secondary)',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.70rem',
              fontFamily: 'var(--font-tech)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
          >
            FULL ANATOMY
          </button>
          <button
            onClick={() => setViewMode('skeletal')}
            style={{
              background: isSkeletalActive ? 'rgba(40, 184, 232, 0.25)' : 'transparent',
              color: isSkeletalActive ? 'var(--cosmic-cyan)' : 'var(--text-secondary)',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.70rem',
              fontFamily: 'var(--font-tech)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
          >
            SKELETON 3D
          </button>
        </div>

        {/* Minimal Tool Buttons */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onToggleLaserScan ? onToggleLaserScan() : setInternalLaser(!internalLaser)}
            className="btn-secondary"
            title="Toggle Laser Scan Beam"
            style={{
              fontSize: '0.72rem',
              padding: '5px 10px',
              borderRadius: '8px',
              borderColor: laserActive ? 'rgba(40, 184, 232, 0.4)' : 'rgba(245, 249, 255, 0.1)',
              color: laserActive ? 'var(--cosmic-cyan)' : 'var(--text-secondary)'
            }}
          >
            <Scan size={12} />
            <span>{laserActive ? 'BEAM ON' : 'BEAM OFF'}</span>
          </button>

          <button
            onClick={() => onToggleHotspots ? onToggleHotspots() : setInternalHotspots(!internalHotspots)}
            className="btn-secondary"
            title="Toggle Hotspots"
            style={{
              fontSize: '0.72rem',
              padding: '5px 10px',
              borderRadius: '8px',
              borderColor: hotspotsActive ? 'rgba(40, 184, 232, 0.4)' : 'rgba(245, 249, 255, 0.1)',
              color: hotspotsActive ? 'var(--cosmic-cyan)' : 'var(--text-secondary)'
            }}
          >
            <Crosshair size={12} />
            <span>{hotspotsActive ? 'POINTS ON' : 'POINTS OFF'}</span>
          </button>

          <div style={{
            display: 'flex',
            background: 'rgba(7, 21, 34, 0.75)',
            border: '1px solid rgba(245, 249, 255, 0.1)',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={handleZoomIn}
              className="btn-secondary"
              title="Zoom In"
              style={{ border: 'none', padding: '4px 6px', borderRadius: '6px' }}
            >
              <ZoomIn size={12} />
            </button>
            <button
              onClick={handleResetZoom}
              className="btn-secondary"
              title="Reset Zoom"
              style={{ border: 'none', padding: '4px 6px', fontSize: '0.70rem', borderRadius: '6px' }}
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomOut}
              className="btn-secondary"
              title="Zoom Out"
              style={{ border: 'none', padding: '4px 6px', borderRadius: '6px' }}
            >
              <ZoomOut size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport & Interactive Image Layer */}
      <div style={{
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Subtle Depth Glow Behind Body */}
        <div style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(40, 184, 232, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Scalable Container for Body Scan & Overlaid Hotspots */}
        <div style={{
          position: 'relative',
          height: compact ? '88%' : '92%',
          maxWidth: '92%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 5
        }}>
          {/* High-Resolution Medical Holographic Scan Image */}
          <img
            src={scanImageUrl}
            alt={isSkeletalActive ? "3D Holographic Human Skeleton" : "3D Holographic Human Anatomy Scan"}
            style={{
              height: '100%',
              maxHeight: compact ? '480px' : '620px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 0 35px rgba(40, 184, 232, 0.40)) contrast(1.05)',
              borderRadius: '12px'
            }}
          />

          {/* Gentle Laser Scan Beam (Section 15) */}
          {laserActive && (
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #28B8E8 50%, transparent 100%)',
              boxShadow: '0 0 12px #28B8E8, 0 0 24px rgba(40, 184, 232, 0.6)',
              pointerEvents: 'none',
              zIndex: 15,
              animation: 'laserScan 5s ease-in-out infinite alternate'
            }} />
          )}

          {/* Interactive Hotspots Overlaid on Body */}
          {hotspotsActive && activeHotspots.map((hotspot) => {
            const isSelected = selectedOrgan === hotspot.id;
            const isHovered = hoveredHotspot === hotspot.id;
            
            // Status color based on Section 17 rules:
            // Healthy #39D98A, Warning #FFB020, Critical #FF4D4F, Monitoring #28B8E8
            const statusColor = organStatuses[hotspot.id] === 'CRITICAL' ? '#FF4D4F' :
                                organStatuses[hotspot.id] === 'WARNING' ? '#FFB020' :
                                organStatuses[hotspot.id] === 'HEALTHY' ? '#39D98A' : '#28B8E8';

            return (
              <div
                key={hotspot.id}
                onClick={() => onSelectOrgan && onSelectOrgan(hotspot.id)}
                onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                style={{
                  position: 'absolute',
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 30 : 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Subtle Expanding Pulse Beacon */}
                <div style={{
                  position: 'absolute',
                  width: isSelected ? '30px' : '20px',
                  height: isSelected ? '30px' : '20px',
                  borderRadius: '50%',
                  border: `2px solid ${statusColor}`,
                  boxShadow: `0 0 12px ${statusColor}`,
                  animation: 'pulseBeacon 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
                  pointerEvents: 'none'
                }} />

                {/* Target Dot */}
                <div style={{
                  width: isSelected ? '12px' : '9px',
                  height: isSelected ? '12px' : '9px',
                  borderRadius: '50%',
                  background: isSelected ? '#FFFFFF' : statusColor,
                  border: `2px solid ${statusColor}`,
                  boxShadow: `0 0 10px ${statusColor}`,
                  transition: 'transform 0.15s ease',
                  transform: isHovered || isSelected ? 'scale(1.3)' : 'scale(1)'
                }} />

                {/* Floating Premium Glass Tooltip (Section 16 Specification) */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    left: hotspot.x > 50 ? 'auto' : '100%',
                    right: hotspot.x > 50 ? '100%' : 'auto',
                    marginLeft: hotspot.x > 50 ? '0' : '14px',
                    marginRight: hotspot.x > 50 ? '14px' : '0',
                    background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.94), rgba(7, 21, 34, 0.96))',
                    border: '1px solid rgba(40, 184, 232, 0.40)',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(40, 184, 232, 0.2)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    pointerEvents: 'none',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px'
                  }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'var(--polar-white)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
                      {hotspot.name.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--cosmic-cyan)', fontWeight: 500 }}>
                      Status: {organStatuses[hotspot.id] || 'Monitoring'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(245, 249, 255, 0.6)', marginTop: '2px' }}>
                      [ View Details ]
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes laserScan {
          0% { top: 4%; opacity: 0.8; }
          50% { opacity: 1.0; }
          100% { top: 96%; opacity: 0.8; }
        }

        @keyframes pulseBeacon {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
