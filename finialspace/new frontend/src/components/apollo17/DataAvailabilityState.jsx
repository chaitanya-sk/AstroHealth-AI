import React from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, Info, HelpCircle } from 'lucide-react';

/**
 * DataAvailabilityBadge
 * Clearly indicates data provenance: verified historical NASA archive vs missing historical data.
 */
export function DataAvailabilityBadge({ status = 'available', label }) {
  if (status === 'available') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 9px',
        borderRadius: '6px',
        background: 'rgba(57, 217, 138, 0.12)',
        border: '1px solid rgba(57, 217, 138, 0.35)',
        color: '#39D98A',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-tech)',
        fontWeight: 600,
        letterSpacing: '0.04em'
      }}>
        <CheckCircle2 size={11} />
        {label || 'VERIFIED HISTORICAL DATA'}
      </span>
    );
  }

  if (status === 'workload-context') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 9px',
        borderRadius: '6px',
        background: 'rgba(40, 184, 232, 0.12)',
        border: '1px solid rgba(40, 184, 232, 0.35)',
        color: '#28B8E8',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-tech)',
        fontWeight: 600,
        letterSpacing: '0.04em'
      }}>
        <Info size={11} />
        {label || 'MISSION WORKLOAD CONTEXT'}
      </span>
    );
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '3px 9px',
      borderRadius: '6px',
      background: 'rgba(255, 176, 32, 0.12)',
      border: '1px solid rgba(255, 176, 32, 0.35)',
      color: '#FFB020',
      fontSize: '0.72rem',
      fontFamily: 'var(--font-tech)',
      fontWeight: 600,
      letterSpacing: '0.04em'
    }}>
      <AlertCircle size={11} />
      {label || 'HISTORICAL DATA NOT AVAILABLE'}
    </span>
  );
}

/**
 * HistoricalDataNotice
 * Prominent banner separating historical Apollo 17 telemetry from live ASTRA monitoring.
 */
export function HistoricalDataNotice({ compact = false }) {
  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        background: 'rgba(18, 59, 103, 0.35)',
        border: '1px solid rgba(40, 184, 232, 0.25)',
        borderRadius: '8px',
        fontSize: '0.74rem',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-tech)'
      }}>
        <Info size={13} style={{ color: 'var(--cosmic-cyan)', flexShrink: 0 }} />
        <span>
          <strong style={{ color: 'var(--polar-white)' }}>Historical Mission Archive:</strong> 1972 Apollo telemetry. No simulated or artificial medical metrics.
        </span>
      </div>
    );
  }

  return (
    <div style={{
      padding: '14px 18px',
      background: 'linear-gradient(135deg, rgba(18, 59, 103, 0.45) 0%, rgba(7, 21, 34, 0.7) 100%)',
      border: '1px solid rgba(40, 184, 232, 0.3)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(40, 184, 232, 0.15)',
        border: '1px solid rgba(40, 184, 232, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--cosmic-cyan)',
        flexShrink: 0
      }}>
        <Info size={16} />
      </div>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--font-display)',
          fontSize: '0.88rem',
          color: 'var(--polar-white)',
          fontWeight: 700
        }}>
          HISTORICAL TELEMETRY VERIFICATION NOTICE
          <span style={{
            fontSize: '0.68rem',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(57, 217, 138, 0.15)',
            border: '1px solid rgba(57, 217, 138, 0.4)',
            color: 'var(--status-healthy)',
            fontFamily: 'var(--font-tech)'
          }}>
            INTEGRITY PRESERVED
          </span>
        </div>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5
        }}>
          This module documents verified NASA Apollo 17 biomedical telemetry and mission transcripts from December 1972. 
          Parameters not recorded by the 1972 Apollo Bio-Instrumentation Harness (such as continuous blood pressure, SpO2, and continuous EEG) are explicitly designated as <strong>HISTORICAL DATA NOT AVAILABLE</strong> and are never filled with synthetic values.
        </p>
      </div>
    </div>
  );
}

/**
 * UnavailableMetricCard
 * Clear placeholder card when a specific clinical biomarker is unavailable in historical data.
 */
export function UnavailableMetricCard({ title, category, reason }) {
  return (
    <div className="glass-card" style={{
      padding: '16px 20px',
      background: 'rgba(7, 21, 34, 0.65)',
      border: '1px dashed rgba(255, 176, 32, 0.35)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '0.78rem',
          fontFamily: 'var(--font-tech)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {category}
        </span>
        <DataAvailabilityBadge status="unavailable" label="NOT IN 1972 ARCHIVE" />
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--polar-white)'
      }}>
        {title}
      </div>

      <div style={{
        padding: '8px 12px',
        background: 'rgba(255, 176, 32, 0.08)',
        borderRadius: '6px',
        borderLeft: '2px solid #FFB020',
        fontSize: '0.76rem',
        color: '#FFB020',
        fontFamily: 'var(--font-tech)',
        fontWeight: 600,
        letterSpacing: '0.04em'
      }}>
        HISTORICAL DATA NOT AVAILABLE
      </div>

      <p style={{
        margin: 0,
        fontSize: '0.76rem',
        color: 'var(--text-muted)',
        lineHeight: 1.45
      }}>
        {reason || 'This parameter was not recorded by the 1972 Apollo flight harness. Post-flight clinical evaluations only.'}
      </p>
    </div>
  );
}

export default {
  DataAvailabilityBadge,
  HistoricalDataNotice,
  UnavailableMetricCard
};
