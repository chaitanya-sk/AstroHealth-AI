import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  ShieldCheck, 
  Dumbbell, 
  Brain, 
  Wind, 
  ArrowUpRight,
  Activity,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  Cpu
} from 'lucide-react';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { HealthRecordResponse, SystemStatus } from '../../types/api';

interface HumanAnatomyViewerProps {
  records: HealthRecordResponse[];
  domainStatuses: Record<string, SystemStatus>;
  activeAstronautId: string;
}

export type PhysiologicalSystem = 
  | 'cardiovascular' 
  | 'immune' 
  | 'bone_muscle' 
  | 'behavioral' 
  | 'environment';

interface SystemMeta {
  id: PhysiologicalSystem;
  label: string;
  organ: string;
  domainPath: string;
  icon: React.ReactNode;
  primaryMetric: string;
  color: string;
  glowColor: string;
}

const SYSTEMS: SystemMeta[] = [
  {
    id: 'cardiovascular',
    label: 'Cardiovascular',
    organ: 'Heart & Systemic Vasculature',
    domainPath: '/app/domains/cardiovascular',
    icon: <HeartPulse className="h-3.5 w-3.5" />,
    primaryMetric: 'Heart Rate & Autonomic Tone',
    color: '#32A889',
    glowColor: '#40D7F0',
  },
  {
    id: 'immune',
    label: 'Immune & Lymphatic',
    organ: 'Thymus, Spleen & Lymph Nodes',
    domainPath: '/app/domains/immune',
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    primaryMetric: 'Cytokines & Immune Dysregulation',
    color: '#45BFD2',
    glowColor: '#40D7F0',
  },
  {
    id: 'bone_muscle',
    label: 'Bone & Muscle',
    organ: 'Axial Skeleton & Postural Musculature',
    domainPath: '/app/domains/bone_muscle',
    icon: <Dumbbell className="h-3.5 w-3.5" />,
    primaryMetric: 'Bone Mineral Density & Muscle Attenuation',
    color: '#E9C95A',
    glowColor: '#E9C95A',
  },
  {
    id: 'behavioral',
    label: 'Behavioral & Neural',
    organ: 'Cerebrum & Circadian Clock',
    domainPath: '/app/domains/behavioral',
    icon: <Brain className="h-3.5 w-3.5" />,
    primaryMetric: 'Sleep Architecture & Cognitive Workload',
    color: '#E7A83C',
    glowColor: '#E7A83C',
  },
  {
    id: 'environment',
    label: 'Respiratory & Cabin',
    organ: 'Pulmonary Tree & Atmospheric Interface',
    domainPath: '/app/domains/cabin_environment',
    icon: <Wind className="h-3.5 w-3.5" />,
    primaryMetric: 'ppO2, ppCO2 & Alveolar Exchange',
    color: '#45BFD2',
    glowColor: '#40D7F0',
  },
];

export const HumanAnatomyViewer: React.FC<HumanAnatomyViewerProps> = ({
  records,
  domainStatuses,
  activeAstronautId
}) => {
  const [selectedSystem, setSelectedSystem] = useState<PhysiologicalSystem>('cardiovascular');
  const [viewOrientation, setViewOrientation] = useState<'anterior' | 'posterior'>('anterior');

  const activeMeta = SYSTEMS.find(s => s.id === selectedSystem) || SYSTEMS[0];
  
  // Real records from backend matching selected system
  const systemRecords = records.filter(r => r.domain === selectedSystem);
  const latestRecord = systemRecords[0];
  const hasData = Boolean(latestRecord);
  const currentStatus = domainStatuses[selectedSystem] || (hasData ? 'NORMAL' : 'INSUFFICIENT_DATA');

  return (
    <div className="bg-white rounded-3xl border border-[#E7E9E5] shadow-card overflow-hidden">
      {/* Container Header */}
      <div className="px-6 py-4 border-b border-[#E7E9E5] bg-[#FAFAF7] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-[#20272D] flex items-center justify-center text-[#E9C95A]">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#20272D] leading-tight">
              Biomedical Anatomy & Systems Intelligence
            </h3>
            <p className="text-xs text-[#78818A] font-mono leading-tight mt-0.5">
              Multi-organ physiological telemetry mapping and clinical telemetry cross-verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#78818A]">Anatomical Mode:</span>
          <div className="bg-[#E7E9E5]/60 p-0.5 rounded-full flex gap-1">
            <button
              onClick={() => setViewOrientation('anterior')}
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium transition-all",
                viewOrientation === 'anterior' ? "bg-white text-[#20272D] shadow-sm font-bold" : "text-[#78818A]"
              )}
            >
              Anterior (Front)
            </button>
            <button
              onClick={() => setViewOrientation('posterior')}
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium transition-all",
                viewOrientation === 'posterior' ? "bg-white text-[#20272D] shadow-sm font-bold" : "text-[#78818A]"
              )}
            >
              Posterior (Dorsal)
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual-Panel Layout (Left: Cinematic Anatomy Visual, Right: Real System Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* LEFT PANEL: Cinematic Human Anatomy (Image 2 Inspired) */}
        <div className="lg:col-span-6 anatomy-viewport p-6 relative flex flex-col justify-between items-center select-none overflow-hidden border-b lg:border-b-0 lg:border-r border-[#153C68]">
          
          {/* Subtle Ambient Vignette & Telemetry Coordinate Rings */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[380px] h-[380px] rounded-full border border-[#087DC0]/20 animate-pulse-subtle" />
            <div className="w-[260px] h-[260px] rounded-full border border-[#40D7F0]/10 absolute" />
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#061B35_90%)] absolute inset-0" />
          </div>

          {/* Top Layer: System Selector Pills */}
          <div className="relative z-10 w-full flex items-center justify-center gap-1.5 flex-wrap">
            {SYSTEMS.map((sys) => {
              const isSelected = selectedSystem === sys.id;
              return (
                <button
                  key={sys.id}
                  onClick={() => setSelectedSystem(sys.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 backdrop-blur-md",
                    isSelected
                      ? "bg-[#40D7F0]/25 text-[#40D7F0] border border-[#40D7F0] shadow-cyan-glow font-semibold"
                      : "bg-[#0A2548]/80 text-[#91A7B8] hover:text-white border border-[#153C68]"
                  )}
                >
                  <span style={{ color: isSelected ? sys.glowColor : sys.color }}>{sys.icon}</span>
                  <span>{sys.label}</span>
                </button>
              );
            })}
          </div>

          {/* Realistic Translucent Human Anatomy Graphic (SVG Biomedical Rendering) */}
          <div className="relative z-10 my-4 flex items-center justify-center w-full max-w-[280px]">
            <svg
              viewBox="0 0 240 440"
              className="w-full h-[370px] drop-shadow-[0_0_20px_rgba(8,125,192,0.4)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Glowing Translucent Body Shaders */}
                <linearGradient id="bioSilhouetteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#40D7F0" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#087DC0" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#061B35" stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="arteryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E75B65" />
                  <stop offset="100%" stopColor="#40D7F0" />
                </linearGradient>

                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Translucent Full-Body Human Silhouette */}
              <path
                d="M 120 25
                   C 106 25, 96 36, 96 52
                   C 96 68, 105 76, 110 82
                   C 98 86, 78 98, 72 122
                   C 66 148, 62 188, 56 230
                   C 53 252, 56 262, 62 262
                   C 68 262, 73 246, 76 220
                   C 79 194, 84 168, 88 162
                   L 88 248
                   L 78 390
                   C 76 412, 90 418, 96 418
                   C 103 418, 106 406, 108 358
                   L 112 275
                   L 120 275
                   L 128 275
                   L 132 358
                   C 134 406, 137 418, 144 418
                   C 150 418, 164 412, 162 390
                   L 152 248
                   L 152 162
                   C 156 168, 161 194, 164 220
                   C 167 246, 172 262, 178 262
                   C 184 262, 187 252, 184 230
                   C 178 188, 174 148, 168 122
                   C 162 98, 142 86, 130 82
                   C 135 76, 144 68, 144 52
                   C 144 36, 134 25, 120 25 Z"
                fill="url(#bioSilhouetteGrad)"
                stroke="#087DC0"
                strokeWidth="1.8"
                strokeOpacity="0.85"
                filter="url(#glowEffect)"
              />

              {/* Inner Silhouette Rim Glow Line */}
              <path
                d="M 120 28
                   C 108 28, 99 38, 99 52
                   C 99 66, 107 74, 112 79
                   C 101 83, 82 94, 76 118"
                fill="none"
                stroke="#40D7F0"
                strokeWidth="1.2"
                strokeOpacity="0.7"
              />

              {/* 2. Musculoskeletal Axial Skeleton Reference */}
              <g opacity={selectedSystem === 'bone_muscle' ? 0.95 : 0.35} className="transition-opacity duration-300">
                {/* Spinal Column Vertebrae */}
                <line x1="120" y1="84" x2="120" y2="255" stroke="#FFFFFF" strokeWidth="2.2" strokeDasharray="3,3" />
                {/* Clavicles */}
                <line x1="90" y1="92" x2="150" y2="92" stroke="#FFFFFF" strokeWidth="1.2" />
                {/* Ribcage Arcs */}
                <path d="M 100 115 Q 120 108 140 115" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
                <path d="M 96 128 Q 120 120 144 128" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
                <path d="M 98 142 Q 120 134 142 142" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
                {/* Pelvic Basin */}
                <path d="M 102 245 Q 120 258 138 245 L 132 268 L 108 268 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" />
              </g>

              {/* 3. Lungs & Trachea (Respiratory System) */}
              <g opacity={selectedSystem === 'environment' ? 1.0 : 0.4} className="transition-opacity duration-300">
                {/* Trachea */}
                <line x1="120" y1="82" x2="120" y2="114" stroke="#40D7F0" strokeWidth="2.2" />
                {/* Left & Right Bronchial Trees and Lung Lobe Outlines */}
                <ellipse cx="106" cy="132" rx="12" ry="24" fill="#087DC0" fillOpacity={selectedSystem === 'environment' ? 0.5 : 0.25} stroke="#40D7F0" strokeWidth="1.2" />
                <ellipse cx="134" cy="132" rx="12" ry="24" fill="#087DC0" fillOpacity={selectedSystem === 'environment' ? 0.5 : 0.25} stroke="#40D7F0" strokeWidth="1.2" />
              </g>

              {/* 4. Cardiovascular System (Heart & Aortic Vascular Network) */}
              <g opacity={selectedSystem === 'cardiovascular' ? 1.0 : 0.5} className="transition-opacity duration-300">
                {/* Aorta Arch Curving Out */}
                <path
                  d="M 118 126 C 118 110, 126 108, 128 116 L 126 230"
                  fill="none"
                  stroke="#E75B65"
                  strokeWidth="2.4"
                  filter={selectedSystem === 'cardiovascular' ? "url(#glowEffect)" : undefined}
                />
                {/* Vena Cava Returning */}
                <line x1="114" y1="112" x2="114" y2="230" stroke="#087DC0" strokeWidth="2" />

                {/* Carotid Arteries climbing into Head */}
                <line x1="116" y1="108" x2="112" y2="58" stroke="#E75B65" strokeWidth="1.4" />
                <line x1="124" y1="108" x2="128" y2="58" stroke="#E75B65" strokeWidth="1.4" />

                {/* Femoral Arteries branching into Legs */}
                <line x1="126" y1="230" x2="105" y2="340" stroke="#E75B65" strokeWidth="1.6" />
                <line x1="126" y1="230" x2="135" y2="340" stroke="#E75B65" strokeWidth="1.6" />

                {/* Anatomical Heart Cone and Atria */}
                <path
                  d="M 115 125 C 110 118, 122 114, 125 122 C 128 114, 138 118, 132 128 C 126 138, 120 146, 118 147 C 115 146, 110 135, 115 125 Z"
                  fill={selectedSystem === 'cardiovascular' ? "#E75B65" : "#A83244"}
                  stroke="#FFFFFF"
                  strokeWidth="1.4"
                  filter={selectedSystem === 'cardiovascular' ? "url(#glowEffect)" : undefined}
                />
                {/* Pulsing Cardiac Beacon */}
                {selectedSystem === 'cardiovascular' && (
                  <circle cx="122" cy="132" r="6" fill="#40D7F0" className="animate-ping" style={{ animationDuration: '1.2s' }} />
                )}
                <circle cx="122" cy="132" r="3.5" fill="#FFFFFF" />
              </g>

              {/* 5. Central Nervous System (Brain & Cranial Cortex) */}
              <g opacity={selectedSystem === 'behavioral' ? 1.0 : 0.4} className="transition-opacity duration-300">
                {/* Cerebral Hemispheres */}
                <ellipse cx="114" cy="50" rx="9" ry="12" fill={selectedSystem === 'behavioral' ? "#E7A83C" : "#0A2548"} fillOpacity="0.7" stroke="#E7A83C" strokeWidth="1.4" />
                <ellipse cx="126" cy="50" rx="9" ry="12" fill={selectedSystem === 'behavioral' ? "#E7A83C" : "#0A2548"} fillOpacity="0.7" stroke="#E7A83C" strokeWidth="1.4" />
                {/* Brainstem */}
                <line x1="120" y1="62" x2="120" y2="82" stroke="#E7A83C" strokeWidth="1.8" />
                {selectedSystem === 'behavioral' && (
                  <circle cx="120" cy="50" r="7" fill="#E7A83C" className="animate-ping" style={{ animationDuration: '1.8s' }} />
                )}
              </g>

              {/* 6. Immune & Lymphatic System (Nodes along Arm & Groin) */}
              <g opacity={selectedSystem === 'immune' ? 1.0 : 0.4} className="transition-opacity duration-300">
                {/* Spleen */}
                <ellipse cx="138" cy="165" rx="6" ry="9" fill="#45BFD2" fillOpacity="0.8" stroke="#FFFFFF" strokeWidth="1" />
                {/* Lymphatic Nodes (as highlighted in reference image) */}
                <circle cx="158" cy="130" r="3" fill="#E9C95A" />
                <circle cx="162" cy="160" r="3" fill="#E9C95A" />
                <circle cx="166" cy="190" r="3.5" fill="#E9C95A" />
                <circle cx="114" cy="250" r="3" fill="#E9C95A" />
                <circle cx="134" cy="300" r="4.5" fill="#E9C95A" filter="url(#glowEffect)" />
                <circle cx="136" cy="340" r="3" fill="#E9C95A" />
              </g>

              {/* Interactive System Click Nodes */}
              <circle cx="120" cy="50" r="14" fill="transparent" className="cursor-pointer" onClick={() => setSelectedSystem('behavioral')} />
              <circle cx="122" cy="132" r="16" fill="transparent" className="cursor-pointer" onClick={() => setSelectedSystem('cardiovascular')} />
              <circle cx="106" cy="132" r="14" fill="transparent" className="cursor-pointer" onClick={() => setSelectedSystem('environment')} />
              <circle cx="138" cy="165" r="14" fill="transparent" className="cursor-pointer" onClick={() => setSelectedSystem('immune')} />
              <circle cx="120" cy="255" r="16" fill="transparent" className="cursor-pointer" onClick={() => setSelectedSystem('bone_muscle')} />
            </svg>
          </div>

          {/* Bottom Layer Status Pill */}
          <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-mono text-[#91A7B8] px-2">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#40D7F0]" />
              <span>Target: <strong className="text-white">{activeMeta.label}</strong></span>
            </span>
            <span className="text-[#40D7F0] font-bold">Interactive Telemetry Layer</span>
          </div>
        </div>

        {/* RIGHT PANEL: Selected Health System Information (Clean Light Card) */}
        <div className="lg:col-span-6 p-6 sm:p-7 flex flex-col justify-between bg-white">
          <div className="space-y-5">
            
            {/* Header: System Name & Status Badge */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E7E9E5]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#78818A] uppercase tracking-wider block">
                  SELECTED PHYSIOLOGICAL DOMAIN
                </span>
                <h4 className="text-lg font-bold text-[#20272D] flex items-center gap-2 mt-0.5">
                  <span>{activeMeta.label} System</span>
                </h4>
                <p className="text-xs text-[#78818A] mt-0.5">
                  {activeMeta.organ}
                </p>
              </div>
              <StatusBadge status={currentStatus} />
            </div>

            {/* Observation Card or Empty State */}
            {hasData && latestRecord ? (
              <div className="space-y-4">
                {/* Main Metric Banner */}
                <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E7E9E5] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#78818A] uppercase">
                      LATEST OBSERVATION ({latestRecord.indicator.replace('_', ' ')})
                    </span>
                    <TierBadge tier={latestRecord.data_type || 'SIMULATED'} />
                  </div>
                  
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-3xl font-bold font-mono text-[#20272D]">
                      {latestRecord.value}
                    </span>
                    <span className="text-sm font-mono text-[#78818A]">
                      {latestRecord.unit}
                    </span>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#78818A] border-t border-[#E7E9E5]/70 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#32A889]" />
                      <span>{new Date(latestRecord.timestamp).toISOString().slice(0, 19)} UTC</span>
                    </span>
                    <span>•</span>
                    <span>Source: {latestRecord.source}</span>
                  </div>
                </div>

                {/* Transparency Notice */}
                {latestRecord.data_type === 'simulated' && (
                  <div className="p-3 bg-[#FDF6EB] rounded-xl border border-[#F9E6C4] flex items-start gap-2.5 text-xs text-[#E7A83C] leading-relaxed">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#E7A83C]" />
                    <div>
                      <strong className="font-semibold block text-[#20272D]">Demonstration Telemetry Notice</strong>
                      This measurement was synthesized according to NASA-STD-3001 baseline bounds. It represents validated demonstration data and not real in-flight astronaut telemetry.
                    </div>
                  </div>
                )}

                {/* Model & Evidence Information */}
                <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#20272D] flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-[#32A889]" />
                      <span>ML Anomaly Detector Status</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#32A889] bg-[#EBF6F3] px-2 py-0.5 rounded border border-[#D1EDE5]">
                      READY (IsolationForest)
                    </span>
                  </div>
                  <p className="text-[#78818A] text-[11px] leading-relaxed">
                    Trained on MMASH terrestrial benchmark cohort. Evaluates multi-parameter autonomic HRV drift without clinical extrapolation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Clear Empty State for Uninstrumented Domain */}
                <div className="p-5 bg-[#FAFAF7] rounded-2xl border border-[#E7E9E5] text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-[#E7E9E5]/60 text-[#78818A] flex items-center justify-center mx-auto">
                    <Info className="h-5 w-5" />
                  </div>
                  <h5 className="text-sm font-bold text-[#20272D]">
                    No verified measurement available
                  </h5>
                  <p className="text-xs text-[#78818A] max-w-sm mx-auto leading-relaxed">
                    Continuous operational sensor telemetry for the {activeMeta.label} domain is currently awaiting flight instrument ingestion.
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#78818A] bg-[#F2F3F1] px-3 py-1 rounded-full border border-[#E7E9E5]">
                      <Database className="h-3 w-3 text-[#45BFD2]" />
                      NASA OSDR Research Datasets Available
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#F5F2E9] rounded-xl border border-[#E7E9E5] text-xs text-[#78818A] leading-relaxed">
                  <strong className="text-[#20272D] block mb-0.5">Scientific Data Integrity Rule:</strong>
                  Missing biosensor feeds are never defaulted or simulated as normal health. In-flight collection protocols will stream directly to the verified SQLite database bus.
                </div>
              </div>
            )}

          </div>

          {/* Bottom Action Button */}
          <div className="pt-5 border-t border-[#E7E9E5] flex items-center justify-between mt-4">
            <span className="text-xs font-mono text-[#78818A]">
              Domain Telemetry Route: <span className="text-[#20272D]">{activeMeta.domainPath}</span>
            </span>
            <Link
              to={activeMeta.domainPath}
              className="px-4 py-2 bg-[#20272D] hover:bg-[#323D45] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-pill"
            >
              <span>View System Details</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#E9C95A]" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
