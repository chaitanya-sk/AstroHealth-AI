import React from 'react';
import { 
  Heart, 
  Wind, 
  Activity, 
  Thermometer, 
  Moon, 
  Radio, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

const iconMap = {
  heart: Heart,
  oxygen: Wind,
  pressure: Activity,
  temperature: Thermometer,
  sleep: Moon,
  radiation: Radio
};

export default function HealthCard({
  title,
  value,
  unit,
  status = "NORMAL",
  statusType = "green", // green, yellow, red, orange
  iconType = "heart",
  trend,
  trendDirection = "up",
  sparklineData = [65, 68, 72, 70, 75, 71, 72],
  description,
  onClick
}) {
  const IconComponent = iconMap[iconType] || Activity;

  // Mini Sparkline SVG coordinates
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;
  const width = 120;
  const height = 36;
  
  const points = sparklineData.map((val, index) => {
    const x = (index / (sparklineData.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  const getStatusBadgeClass = () => {
    switch (statusType) {
      case 'red': return 'badge-status badge-red';
      case 'yellow': return 'badge-status badge-yellow';
      case 'orange': return 'badge-status badge-orange';
      default: return 'badge-status badge-green';
    }
  };

  const getAccentColor = () => {
    switch (statusType) {
      case 'red': return 'var(--red-emergency)';
      case 'yellow': return 'var(--yellow-warning)';
      case 'orange': return 'var(--orange-accent)';
      default: return 'var(--green-safe)';
    }
  };

  return (
    <div
      onClick={onClick}
      className="glass-panel cyber-corners interactive-hover"
      style={{
        padding: '20px',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden'
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(255, 90, 54, 0.1)',
            border: '1px solid rgba(255, 90, 54, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--orange-accent)'
          }}>
            <IconComponent 
              size={19} 
              className={iconType === 'heart' ? 'animate-heartbeat' : ''} 
            />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase'
            }}>
              {title}
            </span>
          </div>
        </div>

        <span className={getStatusBadgeClass()}>
          {status}
        </span>
      </div>

      {/* Main Metric Value Row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            lineHeight: 1
          }}>
            {value}
          </span>
          {unit && (
            <span style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              fontWeight: 600
            }}>
              {unit}
            </span>
          )}
        </div>

        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-tech)',
            color: trendDirection === 'up' ? 'var(--green-safe)' : trendDirection === 'down' ? 'var(--orange-accent)' : 'var(--text-secondary)'
          }}>
            {trendDirection === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Mini Sparkline Chart */}
      <div style={{ marginTop: '8px', marginBottom: '8px', height: '36px', width: '100%' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={getAccentColor()} stopOpacity="0.35" />
              <stop offset="100%" stopColor={getAccentColor()} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <polygon
            points={`0,${height} ${points} ${width},${height}`}
            fill={`url(#grad-${title.replace(/\s+/g, '')})`}
          />

          {/* Line stroke */}
          <polyline
            fill="none"
            stroke={getAccentColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Last pulsating dot */}
          {sparklineData.length > 0 && (
            <circle
              cx={width}
              cy={height - ((sparklineData[sparklineData.length - 1] - minVal) / range) * (height - 8) - 4}
              r="3.5"
              fill={getAccentColor()}
              style={{ filter: `drop-shadow(0 0 4px ${getAccentColor()})` }}
            />
          )}
        </svg>
      </div>

      {/* Description / Telemetry note */}
      {description && (
        <div style={{
          fontSize: '0.74rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          lineHeight: '1.3',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '8px',
          marginTop: '6px'
        }}>
          {description}
        </div>
      )}
    </div>
  );
}
