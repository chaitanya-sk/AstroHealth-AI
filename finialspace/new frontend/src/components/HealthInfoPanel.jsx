import React from 'react';
import { 
  Heart, 
  Wind, 
  Brain, 
  Bone, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  RefreshCw, 
  Focus, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Dna,
  Zap,
  Layers,
  Thermometer,
  Shield,
  Droplet
} from 'lucide-react';
import { isBackendConfigured, getApiBaseUrl } from '../services/api';

const organIcons = {
  brain: Brain,
  heart: Heart,
  lungs: Wind,
  bones: Bone,
  spine: Activity,
  boneMarrow: Bone,
  thymus: Shield,
  spleen: ShieldCheck,
  liver: Activity,
  stomach: Sparkles,
  colon: Layers,
  appendix: Dna,
  lymphNodes: ShieldCheck,
  tonsils: Shield,
  tCells: Dna,
  bCells: Dna,
  macrophages: Zap,
  dendriticCells: Sparkles,
  circulation: Activity,
  immune: ShieldCheck
};

export default function HealthInfoPanel({
  organData,
  organStatus = 'HEALTHY',
  onFocusOrgan,
  onRunDiagnostic,
  isAnalyzing = false,
  backendSource = 'offline-telemetry',
  onRefreshData
}) {
  const IconComponent = (organData && organIcons[organData.id]) || Activity;

  const getStatusBadge = () => {
    switch (organStatus) {
      case 'CRITICAL':
        return {
          label: 'CRITICAL ALERT',
          badgeClass: 'badge-status badge-red',
          color: 'var(--red-emergency)',
          icon: ShieldAlert
        };
      case 'WARNING':
        return {
          label: 'ATTENTION REQUIRED',
          badgeClass: 'badge-status badge-yellow',
          color: 'var(--status-warning)',
          icon: AlertTriangle
        };
      case 'HEALTHY':
      default:
        return {
          label: 'HEALTHY / NOMINAL',
          badgeClass: 'badge-status badge-green',
          color: 'var(--green-safe)',
          icon: CheckCircle2
        };
    }
  };

  const statusConfig = getStatusBadge();
  const StatusIcon = statusConfig.icon;
  const isBackendLive = isBackendConfigured() && backendSource === 'live-backend';

  if (!organData) {
    return (
      <div
        className="glass-panel cyber-corners"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '440px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}
      >
        <Dna size={40} color="var(--orange-accent)" style={{ marginBottom: '14px', opacity: 0.8 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#FFF' }}>
          Anatomical & Cellular Telemetry
        </h3>
        <p style={{ fontSize: '0.84rem', marginTop: '6px', maxWidth: '300px', lineHeight: 1.5 }}>
          Click or hover on any organ, skeletal structure, or floating immune cell (T-Cell, B-Cell, Macrophage) to inspect full clinical telemetry.
        </p>
      </div>
    );
  }

  return (
    <div
      className="glass-panel cyber-corners"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        position: 'relative',
        background: 'rgba(17, 17, 19, 0.95)',
        boxShadow: organStatus === 'CRITICAL' ? '0 0 25px rgba(255, 75, 75, 0.3)' : '0 8px 32px rgba(0,0,0,0.5)',
        borderLeft: `4px solid ${statusConfig.color}`,
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto'
      }}
    >
      {/* ================= 1. HEADER & BODY PART IDENTITY ================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(0, 229, 255, 0.1)',
            border: `1px solid ${statusConfig.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: statusConfig.color
          }}>
            <IconComponent size={24} />
          </div>

          <div>
            <div style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-tech)',
              letterSpacing: '0.1em',
              color: 'var(--orange-accent)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}>
              {organData.category || 'ANATOMICAL SUBSYSTEM'}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em'
            }}>
              {organData.name}
            </h2>
          </div>
        </div>

        <span className={statusConfig.badgeClass}>
          <StatusIcon size={12} /> {statusConfig.label}
        </span>
      </div>

      {/* ================= 2. VISUAL ALERT INDICATOR BANNER ================= */}
      {organStatus !== 'HEALTHY' && (
        <div
          style={{
            background: organStatus === 'CRITICAL' ? 'rgba(255, 75, 75, 0.18)' : 'rgba(255, 90, 54, 0.18)',
            border: `1px solid ${statusConfig.color}`,
            borderRadius: '10px',
            padding: '12px 16px',
            animation: organStatus === 'CRITICAL' ? 'pulseGlow 2s infinite' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: statusConfig.color, fontWeight: 700, fontSize: '0.84rem', fontFamily: 'var(--font-tech)' }}>
            <AlertTriangle size={15} />
            <span>PHYSIOLOGICAL ALERT DETECTED</span>
          </div>
          <p style={{ color: '#FFFFFF', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.4 }}>
            {organData.summary || 'Biomarker anomaly detected from biosensor telemetry stream.'}
          </p>
        </div>
      )}

      {/* ================= 3. PHYSIOLOGICAL FUNCTION & CLINICAL SUMMARY ================= */}
      <div style={{
        background: 'rgba(24, 24, 27, 0.7)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '14px',
        fontSize: '0.82rem'
      }}>
        <div style={{ color: 'var(--orange-accent)', fontWeight: 700, fontFamily: 'var(--font-tech)', fontSize: '0.78rem', marginBottom: '6px', letterSpacing: '0.08em' }}>
          PRIMARY PHYSIOLOGICAL FUNCTION
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.5, margin: 0 }}>
          {organData.physiologicalFunction || organData.summary}
        </p>
      </div>

      {/* ================= 4. SPACEFLIGHT HAZARD & RISK EVALUATION ================= */}
      <div style={{
        background: 'rgba(24, 24, 27, 0.7)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tech)', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
            DEEP SPACE MISSION RISK EVALUATION
          </span>
          <span style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: statusConfig.color
          }}>
            {organData.riskLevel || 'LOW RISK'}
          </span>
        </div>

        {/* Risk meter progress track */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{
            width: organStatus === 'CRITICAL' ? '88%' : organStatus === 'WARNING' ? '55%' : '18%',
            height: '100%',
            background: statusConfig.color,
            boxShadow: `0 0 8px ${statusConfig.color}`,
            transition: 'width 0.4s ease'
          }} />
        </div>

        {organData.spaceRisk && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            <strong style={{ color: 'var(--orange-accent)' }}>Identified Hazard:</strong> {organData.spaceRisk}
          </p>
        )}
      </div>

      {/* ================= 5. LIVE BIOMARKERS & METRICS ================= */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            REAL-TIME TELEMETRY BIOMARKERS
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--green-safe)', fontFamily: 'var(--font-tech)' }}>
            CALIBRATED: {organData.lastUpdated || 'LIVE'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {organData.metrics && Object.entries(organData.metrics).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'rgba(24, 24, 27, 0.6)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-tech)'
              }}
            >
              <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <strong style={{ color: '#FFFFFF', letterSpacing: '0.04em' }}>
                {value}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 6. BACKEND DATA STATUS ================= */}
      <div style={{
        background: 'rgba(24, 24, 27, 0.8)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '12px 14px',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-tech)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isBackendLive ? 'var(--green-safe)' : 'var(--orange-accent)',
              boxShadow: isBackendLive ? '0 0 6px var(--green-safe)' : '0 0 6px var(--orange-accent)'
            }} />
            <strong style={{ color: '#FFFFFF' }}>
              BACKEND: {isBackendLive ? 'CONNECTED (LIVE)' : 'OFFLINE TELEMETRY'}
            </strong>
          </div>

          <button
            onClick={onRefreshData}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--orange-accent)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              fontSize: '0.72rem'
            }}
          >
            <RefreshCw size={11} className={isAnalyzing ? 'animate-spin' : ''} /> REFRESH
          </button>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
          {isBackendLive ? (
            <span>Feed URL: {getApiBaseUrl()}</span>
          ) : (
            <span>External backend configured via <code>VITE_API_BASE_URL</code> in <code>.env</code></span>
          )}
        </div>
      </div>

      {/* ================= 7. ACTIONS & 3D FOCUS ================= */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={onFocusOrgan}
          className="btn-primary"
          style={{ flex: 1, fontSize: '0.82rem', padding: '9px 14px' }}
        >
          <Focus size={15} /> FOCUS 3D CAMERA
        </button>

        <button
          onClick={onRunDiagnostic}
          disabled={isAnalyzing}
          className="btn-secondary"
          style={{ fontSize: '0.82rem', padding: '9px 14px' }}
        >
          <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
          <span>{isAnalyzing ? 'DIAGNOSING...' : 'RUN SCAN'}</span>
        </button>
      </div>

      {/* ================= 8. COLOR STATUS LEGEND ================= */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '14px',
        marginTop: '2px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-tech)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green-safe)', boxShadow: '0 0 6px var(--green-safe)' }} />
            <span style={{ color: 'var(--green-safe)', fontWeight: 700 }}>GREEN = HEALTHY</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange-accent)', boxShadow: '0 0 6px var(--orange-accent)' }} />
            <span style={{ color: 'var(--orange-accent)', fontWeight: 700 }}>ORANGE = WARNING</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red-emergency)', boxShadow: '0 0 6px var(--red-emergency)' }} />
            <span style={{ color: 'var(--red-emergency)', fontWeight: 700 }}>RED = CRITICAL</span>
          </div>
        </div>
      </div>

    </div>
  );
}
