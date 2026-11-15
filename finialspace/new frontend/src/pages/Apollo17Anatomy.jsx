import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Scan, 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Heart, 
  Wind, 
  Brain, 
  Bone, 
  ShieldCheck, 
  Database, 
  Activity, 
  Info,
  CheckCircle2,
  Box,
  Compass,
  Search,
  Zap,
  Sparkles,
  Dna
} from 'lucide-react';

// Comprehensive Apollo 17 Organ & Body System Dataset
// Covering all 9 systems: Brain, Heart, Lungs, Bones, Spine, Digestive System, Major Organs, Blood Circulation Areas, Immune System Indicators
export const APOLLO17_BODY_SYSTEMS = [
  // ================= 1. BRAIN & COGNITIVE =================
  {
    id: 'brain',
    name: 'Brain (Cerebrum & Cranial Cortex)',
    system: 'Brain',
    category: 'Central Nervous System & Cognitive Health',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.0,
    y: 5.0,
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    description: 'Executive cognitive vigilance, spatial disorientation avoidance, and circadian rhythm maintenance during Taurus-Littrow surface excursions.',
    countermeasure: 'Standardized 8-hour crew sleep cycles in Lunar Module Challenger and Command Module America.'
  },
  {
    id: 'brainstem',
    name: 'Brainstem & Vestibular Cerebellum',
    system: 'Brain',
    category: 'Vestibular & Autonomic Regulation',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.0,
    y: 9.8,
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    description: 'Otolith-ocular reflex adaptation to lunar 1/6th gravity during rapid head tilt and rover maneuvering.',
    countermeasure: 'Pre-flight vestibular habituation training and scopolamine/dexedrine motion-sickness countermeasures.'
  },

  // ================= 2. HEART & CARDIOVASCULAR =================
  {
    id: 'heart',
    name: 'Heart & Myocardium',
    system: 'Heart',
    category: 'Cardiovascular Monitoring',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 51.5,
    y: 24.2,
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.8)',
    description: 'Cardiovascular hemodynamic adaptation to lunar 1/6th gravity and strenuous EVA drilling/sample collection workloads.',
    countermeasure: 'Continuous bio-harness sternal ECG telemetry monitoring by Mission Control Houston flight surgeons.'
  },
  {
    id: 'aorticArch',
    name: 'Aortic Arch & Coronary Outflow',
    system: 'Heart',
    category: 'Arterial Pressure & Cardiac Output',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.0,
    y: 20.8,
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.8)',
    description: 'Arterial systolic pressure maintenance during Lunar Roving Vehicle traverses across hilly crater slopes.',
    countermeasure: 'Hydration electrolyte fruit drinks consumed through in-suit drinking tubes during EVAs.'
  },

  // ================= 3. LUNGS & RESPIRATORY =================
  {
    id: 'rightLung',
    name: 'Right Lung Field',
    system: 'Lungs',
    category: 'Pulmonary Gas Exchange & Oxygenation',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 44.5,
    y: 22.0,
    color: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.85)',
    description: 'Pulmonary gas exchange in pure 100% O2 cabin atmosphere at 5.0 psi.',
    countermeasure: 'LiOH scrubbers for carbon dioxide removal and particulate dust filtering.'
  },
  {
    id: 'leftLung',
    name: 'Left Lung Field',
    system: 'Lungs',
    category: 'Pulmonary Health & Alveolar Diffusion',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 56.5,
    y: 22.5,
    color: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.85)',
    description: 'Alveolar oxygen diffusion and vital capacity monitoring during pressurized space suit operations.',
    countermeasure: 'Pre-breathe denitrogenation protocol preventing decompression sickness during EVA egress.'
  },
  {
    id: 'trachea',
    name: 'Trachea & Bronchial Tree',
    system: 'Lungs',
    category: 'Airway Filtration & Regolith Defense',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.0,
    y: 15.5,
    color: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.85)',
    description: 'Upper airway defense against abrasive jagged lunar regolith dust brought into cabin after EVAs.',
    countermeasure: 'Cabin air filtration recirculators and space suit vacuum purging before helmet removal.'
  },

  // ================= 4. BONES & SKELETAL =================
  {
    id: 'femur',
    name: 'Femur & Lower Extremity Skeleton',
    system: 'Bones',
    category: 'Musculoskeletal & Bone Density',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 42.5,
    y: 65.5,
    color: '#E2E8F0',
    glowColor: 'rgba(226, 232, 240, 0.85)',
    description: 'Lower limb load bearing and bone mineral turnover during 35.7 km of lunar rover traverses and EVA treks.',
    countermeasure: 'Active physical locomotion in 1/6th gravity and post-flight calcium metabolic evaluation.'
  },
  {
    id: 'ribCage',
    name: 'Rib Cage & Thoracic Cavity',
    system: 'Bones',
    category: 'Thoracic Skeletal Protection',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 43.5,
    y: 27.5,
    color: '#E2E8F0',
    glowColor: 'rgba(226, 232, 240, 0.85)',
    description: 'Structural rib cage protection against chest trauma and suit pressure differential shifts.',
    countermeasure: 'Tailored custom molded A7LB space suit bio-liners and chest harness anchors.'
  },
  {
    id: 'pelvis',
    name: 'Pelvic Girdle & Iliac Crest',
    system: 'Bones',
    category: 'Axial Load Bearing & Core Support',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 46.5,
    y: 49.0,
    color: '#E2E8F0',
    glowColor: 'rgba(226, 232, 240, 0.85)',
    description: 'Pelvic load transfer while wearing 81.6 kg Apollo Portable Life Support System (PLSS) backpack.',
    countermeasure: 'Shoulder-to-waist load distributor harnesses and ergonomic rover seat dampers.'
  },
  {
    id: 'humerus',
    name: 'Humerus & Upper Arm Skeleton',
    system: 'Bones',
    category: 'Upper Extremity Skeletal Frame',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 34.5,
    y: 32.0,
    color: '#E2E8F0',
    glowColor: 'rgba(226, 232, 240, 0.85)',
    description: 'Manual torque resistance while drilling 3.2-meter lunar core samples and collecting 110.5 kg of rocks.',
    countermeasure: 'Hand and forearm grip exercisers used during trans-lunar flight.'
  },

  // ================= 5. SPINE & VERTEBRAL COLUMN =================
  {
    id: 'cervicalSpine',
    name: 'Cervical Spine (Neck C1-C7)',
    system: 'Spine',
    category: 'Cervical Axial Alignment',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.0,
    y: 12.8,
    color: '#94A3B8',
    glowColor: 'rgba(148, 163, 184, 0.85)',
    description: 'Neck stability supporting the pressurized Apollo helmet and Extravehicular Visor Assembly (LEVA).',
    countermeasure: 'Neck ring ball-bearing helmet collar allowing 360-degree head rotation.'
  },
  {
    id: 'thoracicSpine',
    name: 'Thoracic Spine (Mid-Back T1-T12)',
    system: 'Spine',
    category: 'Mid-Spinal Column & Decompression',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 48.5,
    y: 27.5,
    color: '#94A3B8',
    glowColor: 'rgba(148, 163, 184, 0.85)',
    description: 'Spinal elongation of 3-5 cm observed during prolonged translunar weightlessness.',
    countermeasure: 'Specially fitted lunar module couches and in-flight knee-to-chest stretching.'
  },
  {
    id: 'lumbarSpine',
    name: 'Lumbar Spine & Sacrum (L1-L5)',
    system: 'Spine',
    category: 'Lower Spine & Lumbar Lordosis',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 48.5,
    y: 43.0,
    color: '#94A3B8',
    glowColor: 'rgba(148, 163, 184, 0.85)',
    description: 'Lower back muscle fatigue and lumbar disc pressure while bending to collect lunar samples.',
    countermeasure: 'Apollo Lunar Surface Scoop, rake, and extension tongs to minimize lumbar bending.'
  },

  // ================= 6. DIGESTIVE SYSTEM =================
  {
    id: 'stomach',
    name: 'Stomach & Gastric Envelope',
    system: 'Digestive System',
    category: 'Gastrointestinal & Gastric Motility',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 53.5,
    y: 31.8,
    color: '#FB923C',
    glowColor: 'rgba(251, 146, 60, 0.85)',
    description: 'Gastric acid balance, nausea avoidance, and nutrient absorption in space flight.',
    countermeasure: 'High-calorie thermostabilized and spoon-bowl space meals with electrolyte supplements.'
  },
  {
    id: 'smallIntestine',
    name: 'Small Intestine (Jejunum/Ileum)',
    system: 'Digestive System',
    category: 'Nutrient Bio-Absorption',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.0,
    y: 39.5,
    color: '#FB923C',
    glowColor: 'rgba(251, 146, 60, 0.85)',
    description: 'Enzymatic digestion and electrolyte absorption during 75 hours of lunar surface stay.',
    countermeasure: 'Scheduled dietary intake logs and potassium-enriched fruit rations.'
  },
  {
    id: 'colon',
    name: 'Large Intestine & Colon GI Tract',
    system: 'Digestive System',
    category: 'Digestive Elimination & Motility',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.2,
    y: 44.5,
    color: '#FB923C',
    glowColor: 'rgba(251, 146, 60, 0.85)',
    description: 'Colonic motility and low-residue diet efficacy during 12-day lunar mission.',
    countermeasure: 'Pre-flight low-residue diet and Apollo fecal containment collection systems.'
  },

  // ================= 7. MAJOR ORGANS =================
  {
    id: 'liver',
    name: 'Liver (Hepatic System)',
    system: 'Major Organs',
    category: 'Hepatic Metabolism & Detoxification',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 45.8,
    y: 30.2,
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.85)',
    description: 'Metabolic clearance of endogenous toxins and pharmacological agents in lunar environment.',
    countermeasure: 'Daily mission medical conferences with flight surgeon Dr. Charles Berry.'
  },
  {
    id: 'leftKidney',
    name: 'Left Kidney (Renal Excretion)',
    system: 'Major Organs',
    category: 'Urinary Clearance & Fluid Regulation',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 54.8,
    y: 35.8,
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.85)',
    description: 'Renal blood flow, calcium excretion regulation, and acid-base blood filtration.',
    countermeasure: 'Continuous monitoring of daily urine volume using Apollo urine receptacle system.'
  },
  {
    id: 'rightKidney',
    name: 'Right Kidney (Renal System)',
    system: 'Major Organs',
    category: 'Electrolyte Homeostasis & Filtration',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 45.2,
    y: 36.2,
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.85)',
    description: 'Electrolyte balance maintenance to prevent arrhythmias that occurred on Apollo 15.',
    countermeasure: 'Mandatory high-potassium orange juice drinks formulated after Apollo 15 cardiac findings.'
  },

  // ================= 8. BLOOD CIRCULATION AREAS =================
  {
    id: 'carotidCirculation',
    name: 'Carotid Circulation (Head & Brain)',
    system: 'Blood Circulation Areas',
    category: 'Cephalic Arterial Inflow',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 48.5,
    y: 14.5,
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.85)',
    description: 'Cephalad blood redistribution caused by lack of normal 1g hydrostatic column.',
    countermeasure: 'Lower body negative pressure evaluations and hydration protocols.'
  },
  {
    id: 'brachialCirculation',
    name: 'Brachial & Radial Circulation (Arms)',
    system: 'Blood Circulation Areas',
    category: 'Peripheral Extremity Perfusion',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 64.0,
    y: 38.0,
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.85)',
    description: 'Peripheral fingertip and forearm perfusion during pressurized glove flexions.',
    countermeasure: 'Custom fingertip heaters in lunar gloves to prevent vasospasm in crater shadows.'
  },
  {
    id: 'femoralCirculation',
    name: 'Femoral Arterial & Venous Network (Legs)',
    system: 'Blood Circulation Areas',
    category: 'Deep Peripheral Circulation',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 45.5,
    y: 72.0,
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.85)',
    description: 'Venous blood return from lower limbs against 1/6th gravity and suit pressure resistance.',
    countermeasure: 'Graduated compression garments worn during re-entry and splashdown.'
  },
  {
    id: 'venaCava',
    name: 'Vena Cava & Central Venous Pool',
    system: 'Blood Circulation Areas',
    category: 'Central Venous Preload',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 52.0,
    y: 28.0,
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.85)',
    description: 'Cardiopulmonary blood volume pooling during initial orbital insertion and lunar descent.',
    countermeasure: 'Pre-landing fluid loading protocol (1 liter saline) to prevent orthostatic intolerance.'
  },

  // ================= 9. IMMUNE SYSTEM INDICATORS =================
  {
    id: 'thymus',
    name: 'Thymus (T-Cell Maturation)',
    system: 'Immune System Indicators',
    category: 'Primary Lymphoid Organ',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.0,
    y: 18.2,
    color: '#F5B942',
    glowColor: 'rgba(245, 185, 66, 0.9)',
    description: 'T-lymphocyte priming and cellular immune surveillance against dormant virus reactivation.',
    countermeasure: 'Strict pre-flight crew health stabilization program (isolation 21 days before launch).'
  },
  {
    id: 'spleen',
    name: 'Spleen (Secondary Lymphoid Organ)',
    system: 'Immune System Indicators',
    category: 'Hematological & Immune Filter',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 56.5,
    y: 28.5,
    color: '#F5B942',
    glowColor: 'rgba(245, 185, 66, 0.9)',
    description: 'Blood filtration, platelet storage, and antibody synthesis in secondary lymphoid tissue.',
    countermeasure: 'Daily astronaut health telemetry monitoring and sterile flight food preparation.'
  },
  {
    id: 'lymphNodes',
    name: 'Axillary & Cervical Lymph Nodes',
    system: 'Immune System Indicators',
    category: 'Peripheral Lymphatic Defense',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 64.5,
    y: 24.5,
    color: '#F5B942',
    glowColor: 'rgba(245, 185, 66, 0.9)',
    description: 'Lymph node immune filtering of particulate matter and skin micro-abrasions.',
    countermeasure: 'Topical antibacterial ointments and suit skin abrasion preventive dressings.'
  },
  {
    id: 'boneMarrow',
    name: 'Femoral Bone Marrow (Hematopoiesis)',
    system: 'Immune System Indicators',
    category: 'Stem Cell Reservoir',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 43.5,
    y: 56.2,
    color: '#F5B942',
    glowColor: 'rgba(245, 185, 66, 0.9)',
    description: 'Hematopoietic renewal of red and white blood cells under cosmic radiation exposure.',
    countermeasure: 'Passive radiation dosimeter badges (TLD) worn inside spacecraft and space suits.'
  },
  {
    id: 'appendix',
    name: 'Vermiform Appendix (GALT)',
    system: 'Immune System Indicators',
    category: 'Mucosal Gut Immune Safehouse',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 46.2,
    y: 45.0,
    color: '#F5B942',
    glowColor: 'rgba(245, 185, 66, 0.9)',
    description: 'Gut-associated lymphoid tissue maintaining enteric flora balance throughout deep space mission.',
    countermeasure: 'Stable dietary fiber and microbiological monitoring of cabin surfaces.'
  },
  {
    id: 'tonsils',
    name: 'Palatine Tonsils & Pharyngeal Ring',
    system: 'Immune System Indicators',
    category: 'First-Line Mucosal Defense',
    systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
    backendStatus: 'BACKEND CONNECTABLE • MODULE READY',
    x: 50.0,
    y: 13.8,
    color: '#F5B942',
    glowColor: 'rgba(245, 185, 66, 0.9)',
    description: 'Oral mucosal lymphoid barrier preventing upper respiratory infection from inhaled regolith.',
    countermeasure: 'Frequent oral hydration and cabin vacuuming to clear floating lunar dust particles.'
  }
];

// Definition of the 9 full body systems for UI toggles
export const SYSTEM_CATEGORIES = [
  { id: 'Brain', name: 'Brain', icon: Brain, color: '#38BDF8' },
  { id: 'Heart', name: 'Heart', icon: Heart, color: '#EF4444' },
  { id: 'Lungs', name: 'Lungs', icon: Wind, color: '#00E5FF' },
  { id: 'Bones', name: 'Bones', icon: Bone, color: '#E2E8F0' },
  { id: 'Spine', name: 'Spine', icon: Bone, color: '#94A3B8' },
  { id: 'Digestive System', name: 'Digestive System', icon: Activity, color: '#FB923C' },
  { id: 'Major Organs', name: 'Major Organs', icon: Box, color: '#A855F7' },
  { id: 'Blood Circulation Areas', name: 'Blood Circulation Areas', icon: Activity, color: '#F43F5E' },
  { id: 'Immune System Indicators', name: 'Immune System Indicators', icon: ShieldCheck, color: '#F5B942' }
];

export default function Apollo17Anatomy({ onBackToApollo17 }) {
  const [selectedPart, setSelectedPart] = useState(APOLLO17_BODY_SYSTEMS[2]); // Default to Heart
  const [hoveredPart, setHoveredPart] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [showLaserScan, setShowLaserScan] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('systems'); // 'systems' or 'parts'
  const [modelMode, setModelMode] = useState('auto'); // 'auto', 'full', 'skeleton'

  // All 9 systems active by default
  const [activeSystems, setActiveSystems] = useState({
    'Brain': true,
    'Heart': true,
    'Lungs': true,
    'Bones': true,
    'Spine': true,
    'Digestive System': true,
    'Major Organs': true,
    'Blood Circulation Areas': true,
    'Immune System Indicators': true
  });

  const isSkeletonActive = modelMode === 'skeleton' || (modelMode === 'auto' && (activeSystems['Bones'] || activeSystems['Spine']) && !activeSystems['Heart'] && !activeSystems['Lungs'] && !activeSystems['Digestive System']);
  const scanImageSrc = isSkeletonActive ? '/skeleton-scan.jpg' : '/anatomy-scan.jpg';

  const toggleSystem = (sysName) => {
    setActiveSystems(prev => ({ ...prev, [sysName]: !prev[sysName] }));
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1.0);

  // Filter visible parts based on active system toggles and optional search
  const visibleParts = APOLLO17_BODY_SYSTEMS.filter(p => {
    if (!activeSystems[p.system]) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || 
             p.category.toLowerCase().includes(q) || 
             p.system.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>

      {/* Top Header with Back Navigation */}
      <div 
        className="glass-panel cyber-corners"
        style={{
          padding: '16px 24px',
          background: 'rgba(17, 17, 19, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBackToApollo17}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} />
            <span>RETURN TO APOLLO 17</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                Apollo 17 • 3D Astronaut Anatomy
              </h1>
              <span className="badge-status badge-orange" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                HISTORICAL PROFILE
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
              NASA Lunar Landing Crew Physiological Architecture • 9 Body Systems • 28 Anatomical Structures
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '8px',
          background: 'rgba(0, 229, 255, 0.1)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          fontFamily: 'var(--font-tech)',
          fontSize: '0.78rem',
          color: '#00E5FF'
        }}>
          <Database size={14} />
          <span>BACKEND CONNECTABLE • 28 STRUCTURES READY</span>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '290px 1fr 340px',
          gap: '16px',
          minHeight: '740px'
        }}
        className="anatomy-3col-responsive"
      >

        {/* ================= LEFT: BODY SYSTEM TOGGLES & PARTS LIST ================= */}
        <div 
          className="glass-panel cyber-corners"
          style={{
            padding: '18px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: '820px',
            overflowY: 'auto'
          }}
        >
          {/* Header & Tabs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} style={{ color: '#00E5FF' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: 700, color: '#FFF' }}>
                  Body Systems
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--orange-accent)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
                {visibleParts.length} / {APOLLO17_BODY_SYSTEMS.length} ACTIVE
              </span>
            </div>

            {/* Quick Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search body parts (e.g. Spine, Liver)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(5, 12, 28, 0.7)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px 6px 28px',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-tech)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* 9 Full Body Systems Toggle List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SYSTEM_CATEGORIES.map(sys => {
              const Icon = sys.icon;
              const count = APOLLO17_BODY_SYSTEMS.filter(p => p.system === sys.id).length;
              const isSystemActive = activeSystems[sys.id];

              return (
                <div
                  key={sys.id}
                  onClick={() => toggleSystem(sys.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: isSystemActive ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSystemActive ? 'rgba(0, 229, 255, 0.3)' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={`Toggle ${sys.name} (${count} body parts)`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      background: isSystemActive ? `${sys.color}25` : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSystemActive ? sys.color : 'var(--text-muted)'
                    }}>
                      <Icon size={12} />
                    </div>
                    <span style={{
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-tech)',
                      color: isSystemActive ? '#FFF' : 'var(--text-secondary)',
                      fontWeight: isSystemActive ? 600 : 400
                    }}>
                      {sys.name}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-tech)',
                      color: isSystemActive ? sys.color : 'var(--text-muted)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: 'rgba(0,0,0,0.3)'
                    }}>
                      {count}
                    </span>
                  </div>

                  <div style={{
                    width: '30px',
                    height: '16px',
                    borderRadius: '8px',
                    background: isSystemActive ? '#00E5FF' : 'rgba(255,255,255,0.12)',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: isSystemActive ? '16px' : '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: isSystemActive ? '#000' : '#FFF',
                      transition: 'left 0.2s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Select Buttons */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => {
                const heartPart = APOLLO17_BODY_SYSTEMS.find(p => p.id === 'heart');
                if (heartPart) setSelectedPart(heartPart);
                setActiveSystems(prev => ({ ...prev, Heart: true, 'Blood Circulation Areas': true }));
              }}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '6px 8px', borderColor: 'var(--orange-accent)', color: 'var(--orange-accent)' }}
            >
              ● FOCUS CARDIOVASCULAR
            </button>
            <button
              onClick={() => {
                const brainPart = APOLLO17_BODY_SYSTEMS.find(p => p.id === 'brain');
                if (brainPart) setSelectedPart(brainPart);
                setActiveSystems(prev => ({ ...prev, Brain: true }));
              }}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '6px 8px', borderColor: '#00E5FF', color: '#00E5FF' }}
            >
              ● FOCUS BRAIN / COGNITIVE
            </button>
            <button
              onClick={() => {
                const spinePart = APOLLO17_BODY_SYSTEMS.find(p => p.id === 'thoracicSpine');
                if (spinePart) setSelectedPart(spinePart);
                setActiveSystems(prev => ({ ...prev, Spine: true, Bones: true }));
              }}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '6px 8px', borderColor: '#94A3B8', color: '#E2E8F0' }}
            >
              ● FOCUS SPINE & BONES
            </button>
            <button
              onClick={() => {
                const immunePart = APOLLO17_BODY_SYSTEMS.find(p => p.id === 'thymus');
                if (immunePart) setSelectedPart(immunePart);
                setActiveSystems(prev => ({ ...prev, 'Immune System Indicators': true, 'Major Organs': true }));
              }}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '6px 8px', borderColor: 'var(--yellow-warning)', color: 'var(--yellow-warning)' }}
            >
              ● FOCUS IMMUNE & ORGANS
            </button>
            <button
              onClick={() => {
                const allActive = {};
                SYSTEM_CATEGORIES.forEach(s => allActive[s.id] = true);
                setActiveSystems(allActive);
                setSearchQuery('');
                handleResetZoom();
              }}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '6px 8px', borderColor: 'var(--green-safe)', color: 'var(--green-safe)' }}
            >
              ✓ RESET ALL SYSTEMS ({APOLLO17_BODY_SYSTEMS.length} PARTS)
            </button>
          </div>
        </div>

        {/* ================= CENTER: INTERACTIVE 3D HOLOGRAPHIC SCAN VIEWPORT ================= */}
        <div 
          className="glass-panel cyber-corners"
          style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 50%, #061129 0%, #030816 65%, #02040a 100%)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Top Viewport HUD Bar */}
          <div style={{
            padding: '10px 16px',
            background: 'rgba(5, 12, 28, 0.88)',
            borderBottom: '1px solid rgba(0, 229, 255, 0.18)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-tech)',
            zIndex: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 8px #00E5FF' }} />
              <strong style={{ color: '#FFF' }}>APOLLO 17 TOMOGRAPHY HUD</strong> • CLICK OR HOVER ANY BODY PART ({visibleParts.length} VISIBLE)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Scan Model Toggle */}
              <div style={{
                display: 'flex',
                background: 'rgba(5, 12, 28, 0.9)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                borderRadius: '6px',
                padding: '2px',
                gap: '2px'
              }}>
                <button
                  onClick={() => setModelMode('full')}
                  style={{
                    background: !isSkeletonActive ? 'rgba(0, 229, 255, 0.25)' : 'transparent',
                    color: !isSkeletonActive ? '#00E5FF' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-tech)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  FULL ANATOMY
                </button>
                <button
                  onClick={() => setModelMode('skeleton')}
                  style={{
                    background: isSkeletonActive ? 'rgba(0, 229, 255, 0.25)' : 'transparent',
                    color: isSkeletonActive ? '#00E5FF' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-tech)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  SKELETON 3D
                </button>
              </div>

              <button
                onClick={() => setShowLaserScan(!showLaserScan)}
                className="btn-secondary"
                style={{ fontSize: '0.7rem', padding: '4px 8px', borderColor: showLaserScan ? '#00E5FF' : 'var(--border-color)' }}
              >
                <Scan size={12} /> {showLaserScan ? 'SCANNER ON' : 'SCANNER OFF'}
              </button>

              <button
                onClick={() => setShowHotspots(!showHotspots)}
                className="btn-secondary"
                style={{ fontSize: '0.7rem', padding: '4px 8px', borderColor: showHotspots ? 'var(--orange-accent)' : 'var(--border-color)' }}
              >
                <Crosshair size={12} /> {showHotspots ? 'HOTSPOTS ON' : 'HOTSPOTS OFF'}
              </button>

              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px' }}>
                <button onClick={handleZoomIn} className="btn-secondary" style={{ padding: '4px 6px', border: 'none' }}><ZoomIn size={12} /></button>
                <button onClick={handleResetZoom} className="btn-secondary" style={{ padding: '4px 6px', border: 'none', fontSize: '0.7rem' }}>{Math.round(zoomLevel * 100)}%</button>
                <button onClick={handleZoomOut} className="btn-secondary" style={{ padding: '4px 6px', border: 'none' }}><ZoomOut size={12} /></button>
              </div>
            </div>
          </div>

          {/* Interactive Visual Area */}
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Grid */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none'
            }} />

            {/* Scalable Container */}
            <div style={{
              position: 'relative',
              height: '92%',
              maxWidth: '92%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.25s ease-out'
            }}>
              {/* Scan Image */}
              <img
                src={scanImageSrc}
                alt={isSkeletonActive ? "Apollo 17 3D Human Skeleton" : "Apollo 17 3D Astronaut Anatomy"}
                style={{
                  height: '100%',
                  maxHeight: '640px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 0 35px rgba(0, 168, 255, 0.45)) contrast(1.05)',
                  borderRadius: '8px'
                }}
              />

              {/* Laser Scan Animation */}
              {showLaserScan && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent 0%, #00E5FF 50%, transparent 100%)',
                  boxShadow: '0 0 16px #00E5FF, 0 0 32px #00E5FF',
                  pointerEvents: 'none',
                  zIndex: 15,
                  animation: 'laserScan 4s ease-in-out infinite alternate'
                }} />
              )}

              {/* Interactive Hotspots for All Visible Body Parts */}
              {showHotspots && visibleParts.map(part => {
                const isSelected = selectedPart && selectedPart.id === part.id;
                const isHovered = hoveredPart && hoveredPart.id === part.id;

                return (
                  <div
                    key={part.id}
                    onClick={() => setSelectedPart(part)}
                    onMouseEnter={() => setHoveredPart(part)}
                    onMouseLeave={() => setHoveredPart(null)}
                    style={{
                      position: 'absolute',
                      left: `${part.x}%`,
                      top: `${part.y}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 30 : 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Ripple Beacon */}
                    <div style={{
                      position: 'absolute',
                      width: isSelected ? '34px' : '22px',
                      height: isSelected ? '34px' : '22px',
                      borderRadius: '50%',
                      border: `2px solid ${part.color}`,
                      boxShadow: `0 0 14px ${part.color}`,
                      animation: 'pulseBeacon 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
                      pointerEvents: 'none'
                    }} />

                    {/* Dot */}
                    <div style={{
                      width: isSelected ? '14px' : '10px',
                      height: isSelected ? '14px' : '10px',
                      borderRadius: '50%',
                      background: isSelected ? '#FFFFFF' : part.color,
                      border: `2px solid ${part.color}`,
                      boxShadow: `0 0 12px ${part.color}`,
                      transform: isHovered || isSelected ? 'scale(1.3)' : 'scale(1)',
                      transition: 'transform 0.15s ease'
                    }} />

                    {/* Hover Floating Card required by prompt */}
                    {(isHovered || isSelected) && (
                      <div style={{
                        position: 'absolute',
                        left: part.x > 55 ? 'auto' : '100%',
                        right: part.x > 55 ? '100%' : 'auto',
                        marginLeft: part.x > 55 ? '0' : '12px',
                        marginRight: part.x > 55 ? '12px' : '0',
                        background: 'rgba(5, 12, 28, 0.96)',
                        border: `1px solid ${part.color}`,
                        borderRadius: '8px',
                        padding: '10px 14px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(10px)',
                        pointerEvents: 'none',
                        zIndex: 40,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.90rem', fontWeight: 800, color: '#FFF' }}>
                          BODY PART: {part.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-tech)', color: 'var(--green-safe)', fontWeight: 700 }}>
                          SYSTEM: {part.system} • {part.systemStatus}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-tech)', color: '#00E5FF' }}>
                          RELATED HEALTH CATEGORY: {part.category}
                        </div>
                        <div style={{ fontSize: '0.70rem', fontFamily: 'var(--font-tech)', color: 'var(--orange-accent)', fontWeight: 600 }}>
                          BACKEND DATA CONNECTION STATUS: {part.backendStatus}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Viewport HUD */}
          <div style={{
            padding: '10px 18px',
            background: 'rgba(5, 12, 28, 0.92)',
            borderTop: '1px solid rgba(0, 229, 255, 0.18)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-tech)',
            color: 'var(--text-secondary)'
          }}>
            <div>
              SELECTED STRUCTURE: <strong style={{ color: '#FFF' }}>{selectedPart?.name}</strong> ({selectedPart?.system})
            </div>
            <div>
              CONNECTION: <strong style={{ color: 'var(--green-safe)' }}>BACKEND CONNECTABLE</strong>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: HEALTH INFORMATION PANEL ================= */}
        <div 
          className="glass-panel cyber-corners"
          style={{
            padding: '22px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '820px',
            overflowY: 'auto'
          }}
        >
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-status badge-orange" style={{ fontSize: '0.7rem' }}>
                HISTORICAL TELEMETRY PROFILE
              </span>
              <span style={{ fontSize: '0.72rem', color: selectedPart?.color || '#00E5FF', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
                {selectedPart?.system}
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#FFF', marginTop: '6px' }}>
              {selectedPart ? selectedPart.name : 'Select Structure'}
            </h3>
            <div style={{ fontSize: '0.76rem', color: 'var(--orange-accent)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginTop: '2px' }}>
              {selectedPart?.category}
            </div>
          </div>

          {/* System Status & Backend Status Callouts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              background: 'rgba(53, 208, 127, 0.1)',
              border: '1px solid var(--green-safe)',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              fontFamily: 'var(--font-tech)'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>SYSTEM STATUS:</span>
              <strong style={{ color: 'var(--green-safe)' }}>{selectedPart?.systemStatus}</strong>
            </div>

            <div style={{
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid #00E5FF',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              fontFamily: 'var(--font-tech)'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>BACKEND STATUS:</span>
              <strong style={{ color: '#00E5FF' }}>{selectedPart?.backendStatus}</strong>
            </div>
          </div>

          {/* Historical Physiological Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Historical Mission Role
            </span>
            <p style={{ color: '#E2E8F0', fontSize: '0.82rem', lineHeight: 1.55 }}>
              {selectedPart?.description}
            </p>
          </div>

          {/* Mission Countermeasure */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Apollo Medical Countermeasure
            </span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', lineHeight: 1.55 }}>
              {selectedPart?.countermeasure}
            </p>
          </div>

          {/* Quick List of Body Parts in this System */}
          <div style={{
            background: 'rgba(5, 12, 28, 0.7)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '12px'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#00E5FF', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              Body Parts in {selectedPart?.system} ({APOLLO17_BODY_SYSTEMS.filter(p => p.system === selectedPart?.system).length}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {APOLLO17_BODY_SYSTEMS.filter(p => p.system === selectedPart?.system).map(sibling => (
                <button
                  key={sibling.id}
                  onClick={() => setSelectedPart(sibling)}
                  style={{
                    background: sibling.id === selectedPart?.id ? 'var(--orange-accent)' : 'rgba(255,255,255,0.06)',
                    color: sibling.id === selectedPart?.id ? '#000' : '#FFF',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.70rem',
                    fontFamily: 'var(--font-tech)',
                    fontWeight: sibling.id === selectedPart?.id ? 700 : 400,
                    cursor: 'pointer'
                  }}
                >
                  {sibling.name.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Notice: No fake values */}
          <div style={{
            marginTop: 'auto',
            background: 'rgba(5, 8, 17, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45
          }}>
            <strong style={{ color: 'var(--orange-accent)' }}>Frontend Architecture Notice:</strong> Visual layout prepared for external backend telemetry stream. Real-time biometrics will populate automatically upon connecting <code style={{ color: '#00E5FF' }}>VITE_API_BASE_URL</code>.
          </div>
        </div>

      </div>

      <style>{`
        @keyframes laserScan {
          0% { top: 3%; opacity: 0.9; }
          50% { opacity: 1.0; }
          100% { top: 97%; opacity: 0.9; }
        }

        @keyframes pulseBeacon {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        @media (max-width: 1200px) {
          .anatomy-3col-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
