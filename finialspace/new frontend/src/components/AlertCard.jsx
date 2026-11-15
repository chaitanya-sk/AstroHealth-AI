import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';

export default function AlertCard({
  alert,
  onAcknowledge,
  onViewDetails
}) {
  const [expanded, setExpanded] = useState(false);

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'RED':
        return {
          label: 'CRITICAL HEALTH ALERT',
          badgeClass: 'badge-status badge-red',
          borderColor: 'rgba(255, 75, 75, 0.45)',
          glowClass: 'box-glow-red',
          icon: ShieldAlert,
          iconColor: 'var(--red-emergency)'
        };
      case 'YELLOW':
        return {
          label: 'ATTENTION REQUIRED',
          badgeClass: 'badge-status badge-yellow',
          borderColor: 'rgba(245, 185, 66, 0.4)',
          glowClass: '',
          icon: AlertTriangle,
          iconColor: 'var(--yellow-warning)'
        };
      case 'GREEN':
      default:
        return {
          label: 'NORMAL / ROUTINE',
          badgeClass: 'badge-status badge-green',
          borderColor: 'rgba(53, 208, 127, 0.3)',
          glowClass: '',
          icon: CheckCircle,
          iconColor: 'var(--green-safe)'
        };
    }
  };

  const config = getPriorityConfig(alert.priority);
  const IconComponent = config.icon;

  return (
    <div
      className={`glass-panel cyber-corners ${alert.priority === 'RED' && !alert.acknowledged ? 'glass-panel-glow' : ''}`}
      style={{
        padding: '20px',
        borderLeft: `4px solid ${config.iconColor}`,
        borderColor: config.borderColor,
        position: 'relative',
        opacity: alert.acknowledged ? 0.75 : 1,
        transition: 'all 0.25s ease'
      }}
    >
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'rgba(24, 24, 27, 0.9)',
            border: `1px solid ${config.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconComponent size={18} color={config.iconColor} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className={config.badgeClass}>
                {config.label}
              </span>
              <span style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-tech)'
              }}>
                {alert.id} • {alert.category}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-tech)'
        }}>
          <span>{alert.timestamp}</span>
          {alert.acknowledged && (
            <span style={{
              background: 'rgba(53, 208, 127, 0.1)',
              color: 'var(--green-safe)',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(53, 208, 127, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Check size={11} /> ACKNOWLEDGED
            </span>
          )}
        </div>
      </div>

      {/* Alert Title */}
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        color: '#FFFFFF',
        marginBottom: '8px',
        letterSpacing: '0.02em'
      }}>
        {alert.title}
      </h4>

      {/* Alert Message */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.86rem',
        lineHeight: '1.5',
        marginBottom: '16px'
      }}>
        {alert.message}
      </p>

      {/* Expanded Telemetry Details (if open) */}
      {expanded && alert.details && (
        <div style={{
          background: 'rgba(24, 24, 27, 0.85)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '16px',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-tech)'
        }}>
          <div style={{ color: 'var(--orange-accent)', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.06em' }}>
            TELEMETRY DIAGNOSTIC PAYLOAD
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '8px' }}>
            {Object.entries(alert.details).map(([key, val]) => (
              <div key={key}>
                <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {key.replace(/([A-Z])/g, ' $1')}:
                </span>{' '}
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons: VIEW DETAILS & ACKNOWLEDGE */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '12px'
      }}>
        <button
          onClick={() => {
            setExpanded(!expanded);
            if (onViewDetails) onViewDetails(alert);
          }}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '7px 14px' }}
        >
          {expanded ? (
            <>
              HIDE DETAILS <ChevronUp size={14} />
            </>
          ) : (
            <>
              VIEW DETAILS <ChevronDown size={14} />
            </>
          )}
        </button>

        <button
          onClick={() => onAcknowledge && onAcknowledge(alert.id)}
          disabled={alert.acknowledged}
          className="btn-primary"
          style={{
            fontSize: '0.8rem',
            padding: '7px 16px',
            opacity: alert.acknowledged ? 0.5 : 1,
            cursor: alert.acknowledged ? 'default' : 'pointer'
          }}
        >
          {alert.acknowledged ? (
            <>
              <Check size={14} /> ACKNOWLEDGED
            </>
          ) : (
            'ACKNOWLEDGE'
          )}
        </button>
      </div>
    </div>
  );
}
