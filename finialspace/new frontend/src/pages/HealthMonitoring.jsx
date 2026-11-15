import React, { useState } from 'react';
import { 
  Heart, 
  Wind, 
  Activity, 
  Thermometer, 
  Radio, 
  Bone, 
  Brain, 
  Moon, 
  ShieldCheck, 
  AlertTriangle, 
  Dumbbell, 
  Zap, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Smile, 
  Coffee, 
  Headphones,
  Info
} from 'lucide-react';
import HealthChart from '../components/HealthChart';
import { 
  currentVitals, 
  chartDatasets, 
  astronautProfile 
} from '../data/mockData';

export default function HealthMonitoring({ activeSubView = "vitals" }) {
  const [currentTab, setCurrentTab] = useState(activeSubView || "vitals");
  const [timeRange, setTimeRange] = useState("24H");
  const [selectedBonePart, setSelectedBonePart] = useState("spine");

  // Keep synced if parent changes activeSubView
  React.useEffect(() => {
    if (activeSubView) {
      setCurrentTab(activeSubView);
    }
  }, [activeSubView]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>

      {/* Header and Subview Navigation Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge-status badge-cyan">DIAGNOSTIC SUITE</span>
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              SOL 147 CONTINUOUS MESH
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
            color: '#FFFFFF'
          }}>
            HEALTH & BIOMETRIC MONITORING
          </h1>
        </div>

        {/* Global Time Range Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(24, 24, 27, 0.8)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '4px'
        }}>
          {['24H', '7D', '30D'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                background: timeRange === range ? 'var(--orange-accent)' : 'transparent',
                color: timeRange === range ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px'
      }}>
        {[
          { id: 'vitals', label: 'Vital Signs', icon: Heart },
          { id: 'radiation', label: 'Radiation Exposure', icon: Radio },
          { id: 'bone-health', label: 'Bone Health & BMD', icon: Bone },
          { id: 'mental-wellness', label: 'Mental Wellness', icon: Brain },
          { id: 'sleep-recovery', label: 'Sleep & Recovery', icon: Moon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isActive ? 'rgba(255, 90, 54, 0.15)' : 'rgba(24, 24, 27, 0.6)',
                border: '1px solid',
                borderColor: isActive ? 'var(--orange-accent)' : 'var(--border-color)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontFamily: 'var(--font-tech)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--orange-accent)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: VITAL SIGNS (DETAILED CHARTS) ================= */}
      {currentTab === 'vitals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px'
          }}>
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
                HEART RATE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF', marginTop: '2px' }}>
                72 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>BPM</span>
              </div>
              <span className="badge-status badge-green" style={{ marginTop: '6px' }}>NORMAL</span>
            </div>

            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
                BLOOD OXYGEN
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF', marginTop: '2px' }}>
                98% <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SpO2</span>
              </div>
              <span className="badge-status badge-green" style={{ marginTop: '6px' }}>OPTIMAL</span>
            </div>

            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
                BLOOD PRESSURE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF', marginTop: '2px' }}>
                118/76 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>mmHg</span>
              </div>
              <span className="badge-status badge-green" style={{ marginTop: '6px' }}>NORMAL</span>
            </div>

            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
                BODY TEMPERATURE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF', marginTop: '2px' }}>
                36.8°C <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CORE</span>
              </div>
              <span className="badge-status badge-green" style={{ marginTop: '6px' }}>NORMAL</span>
            </div>

            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
                RESPIRATORY RATE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF', marginTop: '2px' }}>
                14 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>br/min</span>
              </div>
              <span className="badge-status badge-green" style={{ marginTop: '6px' }}>NORMAL</span>
            </div>
          </div>

          {/* Chart 1: Heart Rate */}
          <HealthChart
            title="Heart Rate Telemetry"
            subtitle="Continuous ECG Optical Sensor • Baseline Rest: 64 BPM • Max Workout: 142 BPM"
            data={chartDatasets.heartRate[timeRange]}
            unit="BPM"
            color="var(--orange-accent)"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          {/* Chart 2: Blood Oxygen */}
          <HealthChart
            title="Blood Oxygen Saturation (SpO2)"
            subtitle="Photoplethysmography Sensor • Target Baseline: > 95%"
            data={chartDatasets.bloodOxygen[timeRange]}
            unit="%"
            color="var(--green-safe)"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          {/* Chart 3: Blood Pressure (Systolic & Diastolic) */}
          <HealthChart
            title="Arterial Blood Pressure"
            subtitle="Non-invasive bio-impedance tonometry • Systolic (Orange) & Diastolic (Cyan)"
            data={chartDatasets.bloodPressure[timeRange]}
            unit="mmHg"
            color="var(--orange-accent)"
            isDual={true}
            dualKeys={{ val1: 'systolic', val2: 'diastolic', label1: 'Systolic', label2: 'Diastolic' }}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          {/* Chart 4: Body Temperature */}
          <HealthChart
            title="Core Body Temperature"
            subtitle="Continuous subcutaneous thermo-telemetry • Circadian oscillation normal"
            data={chartDatasets.bodyTemperature[timeRange]}
            unit="°C"
            color="#F5B942"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          {/* Chart 5: Respiratory Rate */}
          <HealthChart
            title="Respiratory Rate"
            subtitle="Chest impedance expansion sensor • Normal range: 12 - 18 br/min"
            data={chartDatasets.respiratoryRate[timeRange]}
            unit="br/min"
            color="#38BDF8"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
      )}

      {/* ================= TAB 2: RADIATION MONITORING ================= */}
      {currentTab === 'radiation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Radiation Hero Banner */}
          <div className="glass-panel cyber-corners" style={{
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(17, 17, 19, 0.95) 0%, rgba(24, 24, 27, 0.85) 100%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge-status badge-green" style={{ marginBottom: '10px' }}>
                CURRENT RADIATION LEVEL: SAFE
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#FFF' }}>
                RADIOLOGICAL DOSIMETRY MONITOR
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px', lineHeight: 1.5 }}>
                Continuous monitoring of Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE).
                Hab-01 regolith shielding reduces ambient surface radiation by 94.2%.
              </p>

              {/* Color Code Threshold Guide */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '16px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-tech)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green-safe)' }} />
                  <span style={{ color: 'var(--green-safe)' }}>SAFE (&lt;0.6 mSv)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--yellow-warning)' }} />
                  <span style={{ color: 'var(--yellow-warning)' }}>WARNING (0.6 - 1.2 mSv)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--red-emergency)' }} />
                  <span style={{ color: 'var(--red-emergency)' }}>CRITICAL (&gt;1.2 mSv)</span>
                </div>
              </div>
            </div>

            {/* Radiation Semi-Circle Gauge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ position: 'relative', width: '220px', height: '120px' }}>
                <svg viewBox="0 0 200 110" style={{ width: '100%', height: '100%' }}>
                  {/* Gauge Arc Background */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Safe Zone (Green) */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 100 20"
                    fill="none"
                    stroke="var(--green-safe)"
                    strokeWidth="16"
                    strokeOpacity="0.4"
                  />
                  {/* Warning Zone (Yellow) */}
                  <path
                    d="M 100 20 A 80 80 0 0 1 155 45"
                    fill="none"
                    stroke="var(--yellow-warning)"
                    strokeWidth="16"
                    strokeOpacity="0.4"
                  />
                  {/* Critical Zone (Red) */}
                  <path
                    d="M 155 45 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="var(--red-emergency)"
                    strokeWidth="16"
                    strokeOpacity="0.4"
                  />
                  {/* Active reading arc (0.42 mSv = ~35% of gauge) */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 76 29"
                    fill="none"
                    stroke="var(--green-safe)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 8px var(--green-safe))' }}
                  />
                  {/* Pointer Needle */}
                  <line
                    x1="100"
                    y1="100"
                    x2="65"
                    y2="40"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px #FFF)' }}
                  />
                  <circle cx="100" cy="100" r="7" fill="var(--orange-accent)" />
                </svg>
              </div>

              <div style={{ textAlign: 'center', marginTop: '-10px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: '#FFF' }}>
                  0.42 <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>mSv/day</span>
                </div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.8rem', color: 'var(--green-safe)', fontWeight: 700 }}>
                  HABITAT SHIELDING: OPTIMAL
                </div>
              </div>
            </div>
          </div>

          {/* Dosimetry Metrics Grid: Daily, Weekly, Cumulative */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-tech)' }}>
                DAILY EXPOSURE RATE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--green-safe)', marginTop: '4px' }}>
                0.42 <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>mSv</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', marginTop: '4px' }}>
                Safe Limit: 1.00 mSv/day (42% of allowance)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-tech)' }}>
                WEEKLY ACCUMULATION
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#FFFFFF', marginTop: '4px' }}>
                2.94 <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>mSv</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--green-safe)', fontFamily: 'var(--font-tech)', marginTop: '4px' }}>
                Safe Threshold: 7.00 mSv/week
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-tech)' }}>
                MISSION CUMULATIVE DOSE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#FFFFFF', marginTop: '4px' }}>
                61.7 <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>mSv</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)', marginTop: '4px' }}>
                NASA Career Limit: 600.0 mSv (10.3% consumed)
              </div>
            </div>
          </div>

          {/* Radiation Exposure Chart with Safe Threshold Line */}
          <HealthChart
            title="Radiation Dosage vs Safe Threshold"
            subtitle="Active Dosimeter Sensor Pack • Safe Threshold Line: 1.0 mSv/day"
            data={chartDatasets.radiation[timeRange]}
            unit="mSv"
            color="var(--green-safe)"
            threshold={1.0}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
      )}

      {/* ================= TAB 3: BONE HEALTH & DEMINERALIZATION ================= */}
      {currentTab === 'bone-health' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div className="glass-panel cyber-corners" style={{
            padding: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(17, 17, 19, 0.95) 0%, rgba(24, 24, 27, 0.85) 100%)'
          }}>
            <div>
              <span className="badge-status badge-green" style={{ marginBottom: '10px' }}>
                MUSCULOSKELETAL INTEGRITY
              </span>
              <div style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em'
              }}>
                BONE DENSITY SCORE
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: '#FFF' }}>
                  98%
                </span>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-safe)' }}>
                  MINIMAL DEMINERALIZATION
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '10px', lineHeight: 1.5 }}>
                Microgravity causes osteoclast upregulation. Continuous ARED resistance training and
                ultrasound bone density tracking maintain bone mineral density within 2% of pre-flight baseline.
              </p>
            </div>

            {/* 3D Holographic Skeletal System Visualization */}
            <div 
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.55), rgba(7, 21, 34, 0.75))',
                border: '1px solid rgba(40, 184, 232, 0.25)',
                borderRadius: '20px',
                padding: '24px 20px',
                overflow: 'hidden',
                minHeight: '340px'
              }}
            >
              {/* Subtle Depth Glow */}
              <div style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(40, 184, 232, 0.18) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              {/* Holographic 3D Skeleton Container with tight fit */}
              <div style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '280px'
              }}>
                {/* 3D Holographic Human Skeleton */}
                <img
                  src={`${import.meta.env.BASE_URL}skeleton-scan.jpg`}
                  alt="3D Holographic Human Skeleton - Musculoskeletal System"
                  style={{
                    height: '100%',
                    maxHeight: '270px',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 0 25px rgba(40, 184, 232, 0.45)) contrast(1.08)',
                    borderRadius: '8px'
                  }}
                />

                {/* Laser Scan Line */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, #28B8E8 50%, transparent 100%)',
                  boxShadow: '0 0 10px #28B8E8',
                  pointerEvents: 'none',
                  animation: 'laserScan 4s ease-in-out infinite alternate'
                }} />

                {/* Interactive Bone Hotspots Overlaid on 3D Skeleton */}
                {[
                  { id: 'spine', name: 'Spine', density: '0.98 g/cm²', x: 50.0, y: 38.0 },
                  { id: 'hip', name: 'Pelvis / Hip', density: '0.95 g/cm²', x: 50.0, y: 50.5 },
                  { id: 'femur', name: 'Femur', density: '0.97 g/cm²', x: 42.0, y: 66.0 },
                  { id: 'calcaneus', name: 'Calcaneus / Heel', density: '0.94 g/cm²', x: 42.0, y: 94.0 }
                ].map(spot => {
                  const isSelected = selectedBonePart === spot.id;
                  const spotColor = isSelected ? 'var(--cosmic-cyan)' : 'var(--status-healthy)';

                  return (
                    <div
                      key={spot.id}
                      onClick={() => setSelectedBonePart(spot.id)}
                      style={{
                        position: 'absolute',
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={`${spot.name} (${spot.density})`}
                    >
                      {/* Pulsing Beacon Ring */}
                      <div style={{
                        position: 'absolute',
                        width: isSelected ? '24px' : '18px',
                        height: isSelected ? '24px' : '18px',
                        borderRadius: '50%',
                        border: `1.5px solid ${spotColor}`,
                        boxShadow: `0 0 10px ${spotColor}`,
                        animation: 'pulseBeacon 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
                        pointerEvents: 'none'
                      }} />

                      {/* Node Dot */}
                      <div style={{
                        width: isSelected ? '10px' : '8px',
                        height: isSelected ? '10px' : '8px',
                        borderRadius: '50%',
                        background: isSelected ? '#FFFFFF' : spotColor,
                        border: `1.5px solid ${spotColor}`,
                        boxShadow: `0 0 8px ${spotColor}`,
                        transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }} />
                    </div>
                  );
                })}
              </div>

              {/* Target Region Display Banner */}
              <div style={{
                marginTop: '12px',
                padding: '6px 14px',
                background: 'rgba(7, 21, 34, 0.85)',
                border: '1px solid rgba(40, 184, 232, 0.3)',
                borderRadius: '8px',
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-tech)',
                textAlign: 'center',
                letterSpacing: '0.04em'
              }}>
                TARGET REGION: <strong style={{ color: 'var(--cosmic-cyan)' }}>
                  {selectedBonePart.toUpperCase()} ({
                    selectedBonePart === 'spine' ? '0.98 g/cm² • OPTIMAL' :
                    selectedBonePart === 'hip' ? '0.95 g/cm² • STABLE' :
                    selectedBonePart === 'femur' ? '0.97 g/cm² • NOMINAL' : '0.94 g/cm² • NOMINAL'
                  })
                </strong>
              </div>
            </div>
          </div>

          {/* Exercise Activity & Risk Assessment */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--orange-accent)', fontFamily: 'var(--font-tech)', fontSize: '0.85rem', fontWeight: 700 }}>
                <Dumbbell size={16} />
                <span>ARED EXERCISE COMPLIANCE</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#FFF', marginTop: '6px' }}>
                14,200 <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>kg Load / Sol</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--green-safe)', marginTop: '4px', fontFamily: 'var(--font-tech)' }}>
                100% REGIMEN COMPLETED (Squats, Deadlifts, Heel Raises)
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green-safe)', fontFamily: 'var(--font-tech)', fontSize: '0.85rem', fontWeight: 700 }}>
                <ShieldCheck size={16} />
                <span>MICROGRAVITY OSTEOPENIA RISK</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--green-safe)', marginTop: '6px' }}>
                LOW RISK
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-tech)' }}>
                Calcium Balance: +120 mg/day • Bisphosphonate Regimen: Nominal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: MENTAL & BEHAVIORAL WELLNESS ================= */}
      {currentTab === 'mental-wellness' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div className="glass-panel cyber-corners" style={{
            padding: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            background: 'linear-gradient(135deg, rgba(17, 17, 19, 0.95) 0%, rgba(24, 24, 27, 0.85) 100%)'
          }}>
            <div>
              <span className="badge-status badge-green" style={{ marginBottom: '10px' }}>
                NEURO-PSYCH MONITOR
              </span>
              <div style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em'
              }}>
                MENTAL WELLNESS SCORE
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: '#FFF' }}>
                  85%
                </span>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-safe)' }}>
                  PSYCHOLOGICALLY STABLE
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '10px', lineHeight: 1.5 }}>
                Confinement and Earth communications delay (4m 12s) monitored via voice prosody analysis,
                salivary cortisol biomarkers, and automated cognitive psychomotor vigilance tests.
              </p>
            </div>

            {/* Key Wellness Indicators */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  STRESS LEVEL
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#FFF', marginTop: '2px' }}>
                  24 <span style={{ fontSize: '0.75rem', color: 'var(--green-safe)' }}>/ 100 (LOW)</span>
                </div>
              </div>

              <div style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  MOOD STATUS
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--green-safe)', marginTop: '4px' }}>
                  FOCUSED
                </div>
              </div>

              <div style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  ISOLATION FACTOR
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#FFF', marginTop: '2px' }}>
                  NORMAL <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>4m 12s</span>
                </div>
              </div>

              <div style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  COGNITIVE REACTION
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--orange-accent)', marginTop: '2px' }}>
                  218 <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation Card (FEATURE 6 REQUIREMENT) */}
          <div className="glass-panel cyber-corners" style={{
            padding: '24px',
            borderLeft: '4px solid var(--orange-accent)',
            background: 'rgba(17, 17, 19, 0.9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Sparkles size={18} color="var(--orange-accent)" />
              <h4 style={{ fontFamily: 'var(--font-tech)', fontSize: '1rem', fontWeight: 700, color: 'var(--orange-accent)' }}>
                AI NEURO-BEHAVIORAL RECOMMENDATION
              </h4>
            </div>

            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: '#FFFFFF',
              lineHeight: 1.4,
              marginBottom: '12px'
            }}>
              "AI Recommendation: Take a 15-minute relaxation session and communicate with mission support."
            </p>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
              Following prolonged EVA EVA-3 operations, subtle sympathetic nervous elevation has been flagged.
              Engaging in 10 minutes of guided holographic earth VR therapy with Cupola window observation is prescribed.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                <Headphones size={14} /> START 15-MIN RELAXATION SESSION
              </button>
              <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                COMMUNICATE WITH SUPPORT (CAPCOM)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: SLEEP & RECOVERY ================= */}
      {currentTab === 'sleep-recovery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div className="glass-panel cyber-corners" style={{
            padding: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            background: 'linear-gradient(135deg, rgba(17, 17, 19, 0.95) 0%, rgba(24, 24, 27, 0.85) 100%)'
          }}>
            <div>
              <span className="badge-status badge-green" style={{ marginBottom: '10px' }}>
                CIRCADIAN RECOVERY MESH
              </span>
              <div style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em'
              }}>
                SLEEP SCORE
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: '#FFF' }}>
                  87%
                </span>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-safe)' }}>
                  DEEP RESTORATION
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '10px', lineHeight: 1.5 }}>
                Sleep duration in Crew Quarters #1: 7 hours 42 minutes. Sleep architecture shows optimal 48%
                combined Deep + REM sleep, supporting muscle regeneration and cognitive memory consolidation.
              </p>
            </div>

            {/* 4 Sleep Stage Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  SLEEP DURATION
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#FFF', marginTop: '2px' }}>
                  7h 42m
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--green-safe)', fontFamily: 'var(--font-tech)' }}>TARGET: 8h 00m</span>
              </div>

              <div style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  DEEP SLEEP
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--orange-accent)', marginTop: '2px' }}>
                  1h 48m
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>23% OF TOTAL</span>
              </div>

              <div style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  REM SLEEP
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#38BDF8', marginTop: '2px' }}>
                  1h 55m
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>25% OF TOTAL</span>
              </div>

              <div style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  RECOVERY SCORE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--green-safe)', marginTop: '2px' }}>
                  89%
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--green-safe)', fontFamily: 'var(--font-tech)' }}>HRV: 68 ms</span>
              </div>
            </div>
          </div>

          {/* Sleep Timeline Visualization (Hypnogram) */}
          <div className="glass-panel cyber-corners" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#FFF' }}>
                  CIRCADIAN SLEEP TIMELINE (HYPNOGRAM)
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: 'var(--font-tech)' }}>
                  Sol 146 - Sol 147 • 22:30 UTC to 06:12 UTC
                </p>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#FF5A36' }} />
                  <span style={{ color: '#FFF' }}>Deep</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#38BDF8' }} />
                  <span style={{ color: '#FFF' }}>REM</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#35D07F' }} />
                  <span style={{ color: '#FFF' }}>Light</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#F5B942' }} />
                  <span style={{ color: '#FFF' }}>Awake</span>
                </div>
              </div>
            </div>

            {/* Continuous timeline bar */}
            <div style={{
              display: 'flex',
              height: '32px',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              {chartDatasets.sleepTimeline.map((block, i) => (
                <div
                  key={i}
                  style={{
                    flex: block.phase.includes('1h 25m') ? 4 : block.phase.includes('1h') ? 3 : 2,
                    background: block.color,
                    opacity: 0.85,
                    borderRight: '1px solid #111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.68rem',
                    color: '#000',
                    fontWeight: 700,
                    fontFamily: 'var(--font-tech)'
                  }}
                  title={`${block.phase} (${block.start} - ${block.end}, ${block.duration})`}
                >
                  {block.duration}
                </div>
              ))}
            </div>

            {/* Timeline hour axis */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-tech)'
            }}>
              <span>22:30 (SLEEP INITIATION)</span>
              <span>00:30</span>
              <span>02:30</span>
              <span>04:30</span>
              <span>06:12 (ALARM WAKE)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
