import React, { useState } from 'react';
import { Activity, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function HealthChart({
  title,
  subtitle,
  data = [],
  unit = "BPM",
  color = "var(--orange-accent)",
  gradientId = "chart-glow",
  isDual = false, // for blood pressure (systolic & diastolic)
  dualKeys = { val1: "systolic", val2: "diastolic", label1: "Systolic", label2: "Diastolic" },
  threshold,
  timeRange = "24H",
  onTimeRangeChange,
  showRanges = true
}) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No telemetry records available for this interval.
      </div>
    );
  }

  // Calculate numeric bounds
  let values = [];
  if (isDual) {
    values = data.flatMap(d => [d[dualKeys.val1], d[dualKeys.val2]]);
  } else {
    values = data.map(d => d.value);
    if (threshold) values.push(threshold);
  }

  const minRaw = Math.min(...values);
  const maxRaw = Math.max(...values);
  const padding = (maxRaw - minRaw) * 0.15 || 5;
  const minY = Math.max(0, Math.floor(minRaw - padding));
  const maxY = Math.ceil(maxRaw + padding);
  const rangeY = maxY - minY === 0 ? 1 : maxY - minY;

  // Chart Dimensions
  const svgWidth = 650;
  const svgHeight = 220;
  const margin = { top: 20, right: 30, bottom: 35, left: 45 };
  const chartW = svgWidth - margin.left - margin.right;
  const chartH = svgHeight - margin.top - margin.bottom;

  // Coordinate mapping
  const getX = (idx) => margin.left + (idx / (data.length - 1)) * chartW;
  const getY = (val) => margin.top + chartH - ((val - minY) / rangeY) * chartH;

  // Build SVG Paths
  let pathD1 = '';
  let areaD1 = '';
  let pathD2 = '';

  if (isDual) {
    pathD1 = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[dualKeys.val1])}`).join(' ');
    pathD2 = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[dualKeys.val2])}`).join(' ');
  } else {
    pathD1 = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');
    areaD1 = `${pathD1} L ${getX(data.length - 1)} ${margin.top + chartH} L ${getX(0)} ${margin.top + chartH} Z`;
  }

  // Calculate Average
  const averageVal = isDual
    ? Math.round(data.reduce((acc, curr) => acc + curr[dualKeys.val1], 0) / data.length)
    : (data.reduce((acc, curr) => acc + curr.value, 0) / data.length).toFixed(1);

  return (
    <div className="glass-panel cyber-corners" style={{ padding: '24px', position: 'relative' }}>
      {/* Top Header & Range Switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '18px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`
            }} />
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em'
            }}>
              {title}
            </h3>
          </div>
          {subtitle && (
            <p style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-tech)',
              marginTop: '4px'
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Range Buttons: 24H, 7D, 30D */}
        {showRanges && (
          <div style={{
            display: 'flex',
            background: 'rgba(24, 24, 27, 0.8)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '3px'
          }}>
            {['24H', '7D', '30D'].map(range => (
              <button
                key={range}
                onClick={() => onTimeRangeChange && onTimeRangeChange(range)}
                style={{
                  background: timeRange === range ? 'var(--orange-accent)' : 'transparent',
                  color: timeRange === range ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats summary banner */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-tech)',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: '10px'
      }}>
        <div>
          CURRENT: <span style={{ color: '#FFF', fontWeight: 700 }}>
            {isDual 
              ? `${data[data.length - 1][dualKeys.val1]}/${data[data.length - 1][dualKeys.val2]} ${unit}`
              : `${data[data.length - 1].value} ${unit}`}
          </span>
        </div>
        <div>
          AVERAGE: <span style={{ color: '#FFF', fontWeight: 700 }}>{averageVal} {unit}</span>
        </div>
        <div>
          MIN/MAX: <span style={{ color: '#FFF', fontWeight: 700 }}>{minRaw} - {maxRaw} {unit}</span>
        </div>
        {threshold && (
          <div style={{ color: 'var(--yellow-warning)' }}>
            LIMIT: <span style={{ fontWeight: 700 }}>{threshold} {unit}</span>
          </div>
        )}
      </div>

      {/* SVG Chart Container */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', minWidth: '460px', height: 'auto', overflow: 'visible' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="dual-cyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = margin.top + chartH * pct;
            const labelVal = Math.round(maxY - pct * rangeY);
            return (
              <g key={idx}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={svgWidth - margin.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={margin.left - 8}
                  y={y + 4}
                  fill="var(--text-muted)"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="var(--font-tech)"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Threshold Guide line if applicable */}
          {threshold && (
            <g>
              <line
                x1={margin.left}
                y1={getY(threshold)}
                x2={svgWidth - margin.right}
                y2={getY(threshold)}
                stroke="var(--yellow-warning)"
                strokeDasharray="5 3"
                strokeWidth="1.5"
              />
              <text
                x={svgWidth - margin.right}
                y={getY(threshold) - 5}
                fill="var(--yellow-warning)"
                fontSize="9"
                textAnchor="end"
                fontFamily="var(--font-tech)"
              >
                SAFE THRESHOLD ({threshold} {unit})
              </text>
            </g>
          )}

          {/* Gradient Area Fill (Single series) */}
          {!isDual && areaD1 && (
            <path d={areaD1} fill={`url(#${gradientId})`} />
          )}

          {/* Main Series Line */}
          <path
            d={pathD1}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />

          {/* Dual Series (e.g. Diastolic) */}
          {isDual && pathD2 && (
            <path
              d={pathD2}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }}
            />
          )}

          {/* Data Points and Hover Detection Slices */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy1 = isDual ? getY(d[dualKeys.val1]) : getY(d.value);
            const cy2 = isDual ? getY(d[dualKeys.val2]) : null;
            const isHovered = hoverIndex === i;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                style={{ cursor: 'pointer' }}
              >
                {/* Invisible hover capture bar */}
                <rect
                  x={cx - chartW / (data.length * 2)}
                  y={margin.top}
                  width={chartW / data.length}
                  height={chartH}
                  fill="transparent"
                />

                {/* Vertical Crosshair Line */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={margin.top}
                    x2={cx}
                    y2={margin.top + chartH}
                    stroke="rgba(255, 255, 255, 0.35)"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                )}

                {/* Point 1 */}
                <circle
                  cx={cx}
                  cy={cy1}
                  r={isHovered ? 5.5 : 3}
                  fill={color}
                  stroke="#111113"
                  strokeWidth="2"
                  style={{ transition: 'r 0.15s ease' }}
                />

                {/* Point 2 for dual */}
                {isDual && cy2 && (
                  <circle
                    cx={cx}
                    cy={cy2}
                    r={isHovered ? 5.5 : 3}
                    fill="#38BDF8"
                    stroke="#111113"
                    strokeWidth="2"
                    style={{ transition: 'r 0.15s ease' }}
                  />
                )}

                {/* X Axis label */}
                <text
                  x={cx}
                  y={margin.top + chartH + 18}
                  fill={isHovered ? '#FFF' : 'var(--text-secondary)'}
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="var(--font-tech)"
                >
                  {d.time || d.sol}
                </text>
              </g>
            );
          })}

          {/* Interactive Hover Tooltip Box */}
          {hoverIndex !== null && (
            <g transform={`translate(${Math.min(getX(hoverIndex), svgWidth - margin.right - 90)}, ${Math.max(getY(isDual ? data[hoverIndex][dualKeys.val1] : data[hoverIndex].value) - 45, margin.top)})`}>
              <rect
                x="-10"
                y="-10"
                width="100"
                height={isDual ? "42" : "32"}
                rx="6"
                fill="#18181B"
                stroke="var(--orange-accent)"
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}
              />
              <text x="40" y="5" fill="#FFF" fontSize="10" textAnchor="middle" fontFamily="var(--font-tech)" fontWeight="bold">
                {isDual 
                  ? `${data[hoverIndex][dualKeys.val1]} / ${data[hoverIndex][dualKeys.val2]} ${unit}`
                  : `${data[hoverIndex].value} ${unit}`}
              </text>
              <text x="40" y="18" fill="var(--text-secondary)" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-tech)">
                {data[hoverIndex].time || data[hoverIndex].sol}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Dual Series Legend if applicable */}
      {isDual && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '12px',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-tech)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: color, borderRadius: '2px' }} />
            <span style={{ color: '#FFF' }}>{dualKeys.label1}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#38BDF8', borderRadius: '2px' }} />
            <span style={{ color: '#FFF' }}>{dualKeys.label2}</span>
          </div>
        </div>
      )}
    </div>
  );
}
