import React, { useState, useEffect } from 'react';
import { Scan, CheckCircle2, ShieldCheck, Fingerprint, Eye, Zap } from 'lucide-react';

export default function BiometricScanner({ isScanning = false, onScanComplete, compact = false }) {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('STANDBY');

  useEffect(() => {
    let interval;
    if (isScanning) {
      setScanProgress(0);
      setScanStage('ACQUIRING NEURAL MESH...');
      
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStage('BIOMETRIC MATCH CONFIRMED');
            if (onScanComplete) onScanComplete();
            return 100;
          }
          if (prev > 30 && prev < 65) {
            setScanStage('RETINAL & FACIAL CIPHER 99.4%...');
          } else if (prev >= 65 && prev < 90) {
            setScanStage('QUANTUM BIO-KEY VERIFICATION...');
          }
          return prev + 5;
        });
      }, 70);
    } else {
      setScanProgress(0);
      setScanStage('STANDBY - READY FOR AUTH');
    }

    return () => clearInterval(interval);
  }, [isScanning, onScanComplete]);

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: compact ? '16px' : '24px',
      background: 'rgba(17, 17, 19, 0.75)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: compact ? '160px' : '220px',
        height: compact ? '160px' : '220px',
        borderRadius: '50%',
        background: isScanning ? 'radial-gradient(circle, rgba(255,90,54,0.25) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(53,208,127,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        transition: 'all 0.5s ease'
      }} />

      {/* Futuristic Scanner Viewport */}
      <div style={{
        position: 'relative',
        width: compact ? '140px' : '180px',
        height: compact ? '140px' : '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Outer Rotating Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1px dashed rgba(255, 90, 54, 0.4)',
          animation: 'orbitRotate 14s linear infinite'
        }} />

        {/* Middle Counter-Rotating Ring */}
        <div style={{
          position: 'absolute',
          inset: '8px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: 'var(--orange-accent)',
          borderBottomColor: 'var(--red-glow)',
          animation: 'reverseOrbit 8s linear infinite'
        }} />

        {/* Inner Radar Ring */}
        <div style={{
          position: 'absolute',
          inset: '18px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 90, 54, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(24, 24, 27, 0.6)'
        }}>
          {/* Futuristic Face Silhouette Hologram */}
          <svg
            viewBox="0 0 100 100"
            style={{
              width: '70%',
              height: '70%',
              opacity: isScanning ? 0.9 : 0.6,
              transition: 'opacity 0.3s ease'
            }}
          >
            {/* Outer Head Contour */}
            <path
              d="M 50 15 C 33 15 24 30 24 48 C 24 66 36 82 50 88 C 64 82 76 66 76 48 C 76 30 67 15 50 15 Z"
              fill="none"
              stroke={scanProgress === 100 ? 'var(--green-safe)' : 'var(--orange-accent)'}
              strokeWidth="1.8"
              strokeDasharray="4 2"
            />
            {/* Eye line & crosshairs */}
            <line x1="28" y1="44" x2="72" y2="44" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="50" y1="20" x2="50" y2="82" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2 2" />
            {/* Left Eye Node */}
            <circle cx="39" cy="44" r="3.5" fill="none" stroke="var(--orange-accent)" strokeWidth="1.5" />
            <circle cx="39" cy="44" r="1.5" fill={isScanning ? 'var(--orange-accent)' : '#FFF'} />
            {/* Right Eye Node */}
            <circle cx="61" cy="44" r="3.5" fill="none" stroke="var(--orange-accent)" strokeWidth="1.5" />
            <circle cx="61" cy="44" r="1.5" fill={isScanning ? 'var(--orange-accent)' : '#FFF'} />
            {/* Nose & Mouth Nodes */}
            <path d="M 50 48 L 47 57 L 53 57 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <path d="M 42 66 Q 50 71 58 66" fill="none" stroke="var(--orange-accent)" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Laser Scanning Bar */}
        {isScanning && (
          <div style={{
            position: 'absolute',
            left: '20px',
            right: '20px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF5A36, #FFFFFF, #FF5A36, transparent)',
            boxShadow: '0 0 10px #FF5A36, 0 0 20px #FF5A36',
            top: `${scanProgress}%`,
            transition: 'top 0.08s linear'
          }} />
        )}

        {/* 4 Corner Targeting HUD brackets */}
        <div style={{ position: 'absolute', top: 4, left: 4, width: 12, height: 12, borderTop: '2px solid var(--orange-accent)', borderLeft: '2px solid var(--orange-accent)' }} />
        <div style={{ position: 'absolute', top: 4, right: 4, width: 12, height: 12, borderTop: '2px solid var(--orange-accent)', borderRight: '2px solid var(--orange-accent)' }} />
        <div style={{ position: 'absolute', bottom: 4, left: 4, width: 12, height: 12, borderBottom: '2px solid var(--orange-accent)', borderLeft: '2px solid var(--orange-accent)' }} />
        <div style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderBottom: '2px solid var(--orange-accent)', borderRight: '2px solid var(--orange-accent)' }} />
      </div>

      {/* Progress & Telemetry Info */}
      <div style={{ marginTop: '16px', textAlign: 'center', width: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontFamily: 'var(--font-tech)',
          fontSize: '0.82rem',
          letterSpacing: '0.08em',
          color: scanProgress === 100 ? 'var(--green-safe)' : 'var(--orange-accent)',
          fontWeight: 600,
          marginBottom: '6px'
        }}>
          {scanProgress === 100 ? (
            <>
              <CheckCircle2 size={15} />
              <span>BIOMETRICS VERIFIED</span>
            </>
          ) : isScanning ? (
            <>
              <Zap size={14} className="animate-spin" />
              <span>SCANNING MESH [{scanProgress}%]</span>
            </>
          ) : (
            <>
              <Scan size={14} />
              <span>SENSOR READY: OPTICAL / RETINAL</span>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${scanProgress}%`,
            background: scanProgress === 100 
              ? 'linear-gradient(90deg, #35D07F, #22c55e)'
              : 'linear-gradient(90deg, #FF5A36, #E84A2A)',
            boxShadow: '0 0 8px rgba(255, 90, 54, 0.6)',
            transition: 'width 0.1s ease'
          }} />
        </div>

        <div style={{
          marginTop: '6px',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-tech)',
          letterSpacing: '0.05em'
        }}>
          {scanStage}
        </div>
      </div>
    </div>
  );
}
