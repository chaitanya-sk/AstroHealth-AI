// ASTRA HEALTH - API Service
// Connects to your existing external backend when VITE_API_BASE_URL is configured.
// Provides realistic NASA Mars mission medical & immune telemetry fallback.

import { currentVitals, initialAlerts, astronautProfile } from '../data/mockData';
import { supabase } from './supabaseClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '') : '';

export const getAuthHeaders = async (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    // Session token retrieval skipped or unauthenticated
  }
  return headers;
};

export const API_ENDPOINTS = {
  health: `${BASE_URL}/health`,
  bodyStatus: `${BASE_URL}/body-status`,
  alerts: `${BASE_URL}/alerts`
};

export const isBackendConfigured = () => {
  return Boolean(BASE_URL && BASE_URL.trim().length > 0);
};

export const getApiBaseUrl = () => {
  return BASE_URL;
};

// Comprehensive Anatomical, Musculoskeletal, and Organ Telemetry Dataset
export const detailedBodyData = {
  leftKidney: {
    id: 'leftKidney',
    name: 'Left Kidney (Renal System)',
    category: 'Urinary & Excretory System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      glomerularFiltrationRate: '118 mL/min/1.73m² (Optimal)',
      renalBloodFlow: '1.15 L/min (22% of Cardiac Output)',
      calciumExcretionRate: '210 mg/24h (Threshold: 300 mg)',
      urineSpecificGravity: '1.018 (Hydration Optimal)',
      electrolytesPotassium: '4.2 mEq/L'
    },
    summary: 'Left kidney renal clearance and acid-base filtration operating nominally. Calcium supersaturation managed to prevent microgravity nephrolithiasis (kidney stones).',
    physiologicalFunction: 'Filters metabolic waste, urea, and excess ions from the bloodstream; regulates arterial blood pressure via renin-angiotensin-aldosterone axis; controls erythropoiesis.',
    spaceRisk: 'Bone demineralization causes severe hypercalciuria; high risk of calcium oxalate/phosphate renal calculi formation in deep space.',
    lastUpdated: 'Live'
  },
  rightKidney: {
    id: 'rightKidney',
    name: 'Right Kidney (Renal System)',
    category: 'Urinary & Excretory System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      glomerularFiltrationRate: '115 mL/min/1.73m²',
      renalPerfusionPressure: '90 mmHg',
      hydrationBalance: '98.4%',
      stoneRiskIndex: 'Low (Tiselius Index: 0.8)'
    },
    summary: 'Right renal parenchyma verified via ultrasound. Cortex-medullary differentiation normal with clear pyelocaliceal system.',
    physiologicalFunction: 'Maintains fluid-electrolyte equilibrium, regulates extracellular volume, and eliminates metabolic byproducts.',
    spaceRisk: 'Decreased thirst sensation in space combined with fluid shifts increases dehydration and acute stone precipitation risk.',
    lastUpdated: 'Live'
  },
  cerebrum: {
    id: 'cerebrum',
    name: 'Cerebrum & Cerebral Cortex',
    category: 'Central Nervous System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      frontalLobeExecutive: '96% Optimal Focus',
      eegAlphaThetaRatio: '2.4 (High Vigilance)',
      intracranialPressure: '14.2 mmHg (SANS Baseline)',
      opticalNerveSheath: '5.2 mm (No Edema)',
      neuroplasticAdaptation: 'Complete (Sol 147)'
    },
    summary: 'Frontal and temporal cerebral hemispheres exhibit steady cognitive vigilance. No cephalad intracranial pressure spikes detected.',
    physiologicalFunction: 'Highest functional center for conscious thought, voluntary motor commands, memory processing, sensory integration, and emotional regulation.',
    spaceRisk: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS), structural cerebral upward shift in skull, cosmic ion track neural lesions.',
    lastUpdated: 'Live'
  },
  heart: {
    id: 'heart',
    name: 'Heart & Coronary Vessels',
    category: 'Cardiovascular System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      heartRate: '72 BPM',
      sinusRhythm: 'Normal Sinus Rhythm',
      strokeVolume: '78 mL',
      cardiacOutput: '5.1 L/min',
      myocardialStress: 'Low (18%)',
      hrvSDNN: '68 ms'
    },
    summary: 'Sinus rhythm stable. No ventricular remodeling or microgravity spherical rounding detected via weekly echocardiogram.',
    physiologicalFunction: 'Muscular pump delivering oxygenated blood through aortic arch to coronary, systemic, and pulmonary vascular networks.',
    spaceRisk: 'Left ventricular mass reduction, orthostatic collapse during 0.38g Mars descent, cardiac arrhythmias during EVAs.',
    lastUpdated: 'Live'
  },
  lungs: {
    id: 'lungs',
    name: 'Respiratory System / Lungs',
    category: 'Pulmonary System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      oxygenSaturation: '98% SpO2',
      respiratoryRate: '14 br/min',
      vitalCapacity: '96% Earth Baseline',
      pulmonaryPressure: '15 mmHg',
      o2Consumption: '0.84 L/min'
    },
    summary: 'Ventilation-perfusion ratio uniform throughout alveolar fields due to absence of gravity-dependent hydrostatic pooling.',
    physiologicalFunction: 'Inhalation of oxygen and exhalation of carbon dioxide; systemic bicarbonate buffer pH homeostasis.',
    spaceRisk: 'Alveolar de-recruitment, aerosolized cabin dust collection in lower airways, altered mucociliary clearance in 0g.',
    lastUpdated: 'Live'
  },
  liver: {
    id: 'liver',
    name: 'Hepatic System / Liver',
    category: 'Digestive & Metabolic',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      altAstRatio: '1.05 (Normal Enzymes)',
      albuminLevel: '4.4 g/dL',
      bilirubinTotal: '0.7 mg/dL',
      glycogenReserves: '94% Replenished'
    },
    summary: 'Hepatic metabolic clearance and bile acid synthesis functioning at 100% capacity. Xenobiotic detox pathways nominal.',
    physiologicalFunction: 'Central metabolic processing of carbohydrates, proteins, and lipids; filtration of mesenteric blood; synthesis of clotting factors.',
    spaceRisk: 'Altered pharmacokinetics of mission therapeutics; subclinical steatosis induced by space diet and altered lipid mobilization.',
    lastUpdated: 'Sol 147'
  },
  bicepsBrachii: {
    id: 'bicepsBrachii',
    name: 'Biceps Brachii & Arm Musculature',
    category: 'Muscular System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      muscleVolume: '97.8% Baseline Volume',
      electromyogramPeak: '120 uV (Strong Recruitment)',
      fiberTypeComposition: 'Type I / Type II Balanced',
      dailyWorkOutput: '840 kJ (EVA Ready)'
    },
    summary: 'Biceps brachii and forearm flexor compartments preserved through daily tethering and manual hatch torque exercises.',
    physiologicalFunction: 'Primary flexor of the elbow joint and supinator of the forearm; stabilizes the glenohumeral shoulder socket.',
    spaceRisk: 'Disuse atrophy of postural and locomotion muscle fibers; shift from slow-twitch oxidative to fast-twitch glycolytic fibers.',
    lastUpdated: 'Live'
  },
  femur: {
    id: 'femur',
    name: 'Femur & Lower Skeletal Frame',
    category: 'Skeletal System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      femoralNeckBMD: '0.97 g/cm² (98% Baseline)',
      trabecularThickness: '142 um',
      corticalDensity: '1.18 g/cm³',
      axialLoadTolerance: '720 kg Tested'
    },
    summary: 'Femur structural integrity maintained by 14,200 kg daily ARED resistive squat loads. Micro-crack repair remodeling on schedule.',
    physiologicalFunction: 'Longest, strongest bone in the human body; bears torso weight during locomotion and houses high-capacity hematopoietic marrow.',
    spaceRisk: 'Femoral neck fragility fracture upon planetary touchdown; rapid cortical thinning from loss of gravitational heel-strike impacts.',
    lastUpdated: 'Sol 147'
  },
  colon: {
    id: 'colon',
    name: 'Large Intestine / Colon & GI Tract',
    category: 'Digestive System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      colonicTransitTime: '28 hrs (Normal)',
      microbiomeDiversity: 'Shannon Index: 4.2 (High)',
      scfaProduction: 'Optimal Butyrate Level',
      haustralMotility: 'Rhythmic Segmentation'
    },
    summary: 'Colonic mucosal barrier intact with dense commensal Bifidobacterium and Faecalibacterium populations preventing dysbiosis.',
    physiologicalFunction: 'Reabsorption of water and sodium, microbial fermentation of complex carbohydrates, creation and evacuation of solid stool.',
    spaceRisk: 'Gastrointestinal hypomotility, habitat microbial transmission, bacterial translocation through weakened mucosal tight junctions.',
    lastUpdated: 'Sol 147'
  },
  stomach: {
    id: 'stomach',
    name: 'Gastric System / Stomach',
    category: 'Digestive System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      gastricPh: '1.8 (Optimal Acidic Envelope)',
      emptyingRate: 'Normal Transit (3.2 hrs)',
      mucosalBarrier: 'Intact',
      appetiteRegulation: 'Nominal Ghrelin/Leptin'
    },
    summary: 'Gastric acid secretion and intrinsic factor production normal. Space motion sickness adaptation fully achieved by Day 147.',
    physiologicalFunction: 'Breaks down ingested food through hydrochloric acid and pepsin enzymes; initiates protein digestion and intrinsic factor binding.',
    spaceRisk: 'Delayed gastric emptying during initial space adaptation syndrome (SAS), mucosal irritation from stress-induced acid hypersecretion.',
    lastUpdated: '12m ago'
  },
  lymphatic: {
    id: 'lymphatic',
    name: 'Lymphatic Drainage & Vessels',
    category: 'Lymphatic System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      lymphaticClearance: 'Nominal Flow Rate',
      thoracicDuctVolume: 'Optimal Circulation',
      cellularTrafficking: 'High Immunosurveillance',
      cervicalDrainage: 'Active De-congestion'
    },
    summary: 'Lymphatic channels throughout thorax, limbs, and neck clearing metabolic lymph fluid. Facial space edema resolved.',
    physiologicalFunction: 'Returns interstitial fluid to venous blood; transports dietary lipids; circulates immunocompetent lymphocytes.',
    spaceRisk: 'Microgravity alters lymphatic pump contractility and valve function due to missing hydrostatic pressure gradients.',
    lastUpdated: 'Live'
  },
  nervous: {
    id: 'nervous',
    name: 'Peripheral & Autonomic Nerves',
    category: 'Nervous System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      nerveConductionVelocity: '58 m/s (Normal)',
      autonomicSympatheticTone: 'Balanced',
      proprioceptiveSensory: 'Calibrated',
      somatosensoryEvoked: 'Nominal Latency'
    },
    summary: 'Peripheral nerve conduction and spinal reflex arcs calibrated to 0.38g tactile feedback in pressurized space suit.',
    physiologicalFunction: 'Transmits sensory afferents to spinal cord and brain; directs motor efferents to skeletal and smooth muscles.',
    spaceRisk: 'Proprioceptive illusion ("floating limbs"), altered baroreflex sensitivity causing post-flight orthostatic hypotension.',
    lastUpdated: 'Sol 147'
  },
  muscular: {
    id: 'muscular',
    name: 'Full Body Musculature',
    category: 'Muscular System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      totalMuscleMass: '97.4% Baseline',
      myoglobinLevel: 'Normal (No Rhabdomyolysis)',
      creatineKinase: '110 U/L',
      antiGravityCompliance: '100% Daily Target'
    },
    summary: 'Postural muscles (soleus, gastrocnemius, erector spinae) actively stimulated with high-force resistive protocols.',
    physiologicalFunction: 'Generates mechanical force for locomotion, produces body heat, maintains posture, and pump venous return blood.',
    spaceRisk: 'Severe anti-gravity muscle atrophy (up to 20% loss within months without rigorous resistive exercise).',
    lastUpdated: 'Live'
  },
  skeletal: {
    id: 'skeletal',
    name: 'Complete Skeletal Framework',
    category: 'Skeletal System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      overallBoneDensityScore: '98% Baseline',
      calciumBalance: '+120 mg/day (Positive)',
      osteocalcinSerum: '24 ng/mL (Active Formation)',
      spineElongation: '+3.2 cm Controlled'
    },
    summary: 'Bisphosphonate dosing and daily resistive mechanical loading have stabilized bone osteoclast resorption.',
    physiologicalFunction: 'Internal structural scaffold protecting delicate organs, anchoring tendon insertions, and storing mineral salts.',
    spaceRisk: 'Irreversible trabecular connectivity micro-architecture loss; bone marrow adiposity replacement.',
    lastUpdated: 'Sol 147'
  },
  vascular: {
    id: 'vascular',
    name: 'Cardiovascular & Arterial Tree',
    category: 'Circulatory System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      bloodPressure: '118/76 mmHg (Nominal)',
      arterialCompliance: 'High Distensibility',
      centralVenousPressure: '4.8 mmHg',
      carotidIntimaMedia: '0.62 mm',
      microvascularPerfusion: '99% SpO2 Tissue'
    },
    summary: 'Branching arterial network through carotid, brachial, and femoral vessels maintaining laminar blood flow with balanced fluid redistribution.',
    physiologicalFunction: 'Transports oxygenated arterial blood, hormones, and nutrients throughout head, extremities, and core viscera.',
    spaceRisk: 'Cephalad fluid shift causing upper-body jugular vein congestion, arterial wall stiffening, endothelial oxidative stress.',
    lastUpdated: 'Live'
  },
  femoralNodule: {
    id: 'femoralNodule',
    name: 'Left Lower Extremity Hotspot / Popliteal Node',
    category: 'Vascular & Immune Node',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      noduleDiameter: '4.2 mm (Nominal Baseline)',
      vascularFlowIndex: 'Laminar Perfusion',
      localTemperature: '36.7°C (Normal)',
      lymphocyteCluster: 'Resting Phenotype'
    },
    summary: 'Focal lymphatic/vascular node cluster along left femoral-popliteal axis monitored for radiation-induced micro-inflammation.',
    physiologicalFunction: 'Filters deep lymph drainage from the lower extremity, maintains peripheral immune surveillance and lymphatic return.',
    spaceRisk: 'Microgravity altered venous pump efficiency can cause localized fluid pooling and lymphatic stagnation.',
    lastUpdated: 'Live'
  },
  thymus: {
    id: 'thymus',
    name: 'Thymus (Primary Lymphoid Organ)',
    category: 'Immune & T-Cell Production',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      tCellOutput: '94% Nominal Generation',
      thymicInvolutionRate: 'Stable for Age Baseline',
      cortexEpithelialIntegrity: 'Optimal',
      thymosinAlpha1: '1.42 ng/mL (Protective)'
    },
    summary: 'Thymic microenvironment supporting positive/negative T-cell selection. No premature involution from cosmic galactic rays.',
    physiologicalFunction: 'Specialized primary lymphoid organ where bone-marrow derived progenitor thymocytes differentiate and mature into functional immunocompetent T-lymphocytes.',
    spaceRisk: 'Cosmic ray ionization can induce thymocyte apoptosis, reducing circulating naive T-cell diversity and impairing delayed-type hypersensitivity.',
    lastUpdated: 'Live'
  },
  spleen: {
    id: 'spleen',
    name: 'Spleen (Secondary Lymphoid Organ)',
    category: 'Lymphatic & Hematological',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      splenicBloodFiltration: '250 mL/min (Optimal)',
      redPulpMacrophageIndex: 'Active Phagocytosis',
      whitePulpGerminalCenters: 'Vigilant B-Cell Synthesis',
      plateletStorageReserve: '30% Total Reserve (Nominal)'
    },
    summary: 'Splenic filtration removing senescent erythrocytes. White pulp marginal zone actively generating antibody responses.',
    physiologicalFunction: 'Filters blood, removes aged red blood cells, recycles hemoglobin iron, and synthesizes antibodies in the splenic white pulp to combat systemic pathogens.',
    spaceRisk: 'Altered hemodynamics and fluid redistribution may alter splenic macrophage clearing rates and impair humoral immune responses.',
    lastUpdated: 'Sol 147'
  },
  appendix: {
    id: 'appendix',
    name: 'Vermiform Appendix (Microbiome Safehouse)',
    category: 'GALT Immune System',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      biofilmDensity: 'High Commensal Diversity',
      secretoryIgA: '145 mg/dL (Mucosal Shield)',
      lumenPatency: 'Clear (No Fecalith)',
      inflammatoryCytokines: 'Basal (IL-6 < 2 pg/mL)'
    },
    summary: 'Appendix functioning as safehouse for symbiotic gut flora. Secretory IgA protecting colonic entrance without signs of appendicitis.',
    physiologicalFunction: 'Houses rich biofilm of beneficial commensal bacteria for recolonizing the colon after dysbiosis; rich in Gut-Associated Lymphoid Tissue (GALT).',
    spaceRisk: 'Dietary shift and altered gut motility in microgravity can risk bacterial stasis or microbial dysbiosis.',
    lastUpdated: 'Live'
  },
  tonsils: {
    id: 'tonsils',
    name: 'Palatine Tonsils & Pharyngeal Ring',
    category: 'Mucosal-Associated Lymphoid (MALT)',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      tonsillarCryptFlora: 'Stable Non-Pathogenic',
      mucosalIgAOutput: 'Active Upper Aerodigestive Barrier',
      erythemaScore: '0 / None (Calm)',
      cervicalNodeDrainage: 'Unobstructed'
    },
    summary: 'Waldeyer ring mucosal lymphoid tissue active as first line defense against airborne spacecraft cabin particulates.',
    physiologicalFunction: 'First line of immunological defense in the oral cavity and pharynx against ingested or inhaled pathogens, priming B and T lymphocytes.',
    spaceRisk: 'Cabin atmospheric dryness and floating skin flake particles irritate pharyngeal mucosa, requiring constant particulate filtration monitoring.',
    lastUpdated: 'Live'
  },
  boneMarrow: {
    id: 'boneMarrow',
    name: 'Femoral & Pelvic Bone Marrow',
    category: 'Hematopoietic Stem Cell Reservoir',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      hematopoiesisRate: '2.5 Million RBC/sec (Nominal)',
      leukocyteDifferential: 'Balanced Granulocyte/Lymphocyte',
      megakaryocyteCount: 'Optimal Platelet Genesis',
      marrowAdiposeRatio: '78% Cellular / 22% Adipose'
    },
    summary: 'Active hematopoietic bone marrow continuously renewing erythrocytes and immune cell precursors under radiation protection shielding.',
    physiologicalFunction: 'Primary site of new blood cell generation (erythrocytes, leukocytes, thrombocytes) from multipotent hematopoietic stem cells (HSCs).',
    spaceRisk: 'Microgravity-induced bone resorption and space radiation trigger fatty replacement of hematopoietic marrow, predisposing to space anemia and leukopenia.',
    lastUpdated: 'Live'
  },
  spine: {
    id: 'spine',
    name: 'Spine & Vertebral Column',
    category: 'Axial Skeletal Health',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      intervertebralDiscHeight: '+3.5 mm Decompression',
      lumbarCurvature: 'Lordosis Maintained',
      paraspinalTone: 'Relaxed / Symmetrical',
      spinalElongation: '+4.2 cm Height Increase'
    },
    summary: 'Intervertebral disc decompression without acute radiculopathy or herniation during microgravity adaptation.',
    physiologicalFunction: 'Central axial skeletal column protecting the spinal cord, supporting head and torso load, and articulating trunk movement.',
    spaceRisk: 'High incidence of spaceflight back pain and increased post-mission lumbar disc herniation during 1g Earth re-entry.',
    lastUpdated: 'Live'
  },
  trachea: {
    id: 'trachea',
    name: 'Trachea & Upper Airway',
    category: 'Respiratory Airway Tree',
    status: 'HEALTHY',
    riskLevel: 'LOW RISK',
    metrics: {
      airwayPatency: '100% Unobstructed',
      mucociliaryClearance: 'Active Defense',
      particulateDeposition: 'Minimal (< 0.2 um)',
      vocalCordMobility: 'Symmetric & Clear'
    },
    summary: 'Ciliated mucosal epithelium clearing inspired atmospheric micro-particulates without airway hyperactivity.',
    physiologicalFunction: 'Fibrocartilaginous tube conducting air from larynx into primary bronchi; warms and filters inspired oxygen.',
    spaceRisk: 'Lack of sedimentation causes aerosolized particulates to remain suspended in spacecraft cabin, irritating upper airways.',
    lastUpdated: 'Live'
  }
};

export async function getHealthData() {
  if (!isBackendConfigured()) {
    return {
      source: 'offline-telemetry',
      astronaut: astronautProfile,
      vitals: currentVitals
    };
  }
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(API_ENDPOINTS.health, { headers });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { source: 'live-backend', ...data };
  } catch (error) {
    return { source: 'offline-telemetry', astronaut: astronautProfile, vitals: currentVitals, networkError: error.message };
  }
}

export async function getBodyStatus() {
  if (!isBackendConfigured()) {
    return {
      source: 'offline-telemetry',
      organs: detailedBodyData
    };
  }
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(API_ENDPOINTS.bodyStatus, { headers });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { source: 'live-backend', organs: { ...detailedBodyData, ...(data.organs || {}) }, ...data };
  } catch (error) {
    return { source: 'offline-telemetry', organs: detailedBodyData, networkError: error.message };
  }
}

export async function getAlerts() {
  if (!isBackendConfigured()) {
    return {
      source: 'offline-telemetry',
      alerts: initialAlerts
    };
  }
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(API_ENDPOINTS.alerts, { headers });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { source: 'live-backend', ...data };
  } catch (error) {
    return { source: 'offline-telemetry', alerts: initialAlerts, networkError: error.message };
  }
}

// ================= APOLLO 17 MISSION HEALTH ARCHIVE DATASET =================
export const apollo17MissionData = {
  missionId: 'apollo-17',
  name: 'Apollo 17',
  type: 'Lunar Landing',
  significance: "Final lunar landing mission of NASA's Apollo Program",
  landingSite: 'Taurus-Littrow Valley, Moon',
  launchDate: 'December 7, 1972',
  splashdownDate: 'December 19, 1972',
  duration: '12 days, 13 hours, 52 minutes',
  lunarSurfaceDuration: '74 hours, 59 minutes, 40 seconds',
  lunarEvaTotal: '22 hours, 4 minutes, 3 seconds (3 Surface EVAs)',
  lunarSampleWeight: '110.5 kg (243.6 lb)',
  status: 'COMPLETED',
  nasaSourceUrl: 'https://www.nasa.gov/mission/apollo-17/',
  crew: {
    cernan: {
      id: 'cernan',
      name: 'Eugene A. Cernan',
      role: 'Commander',
      callsign: 'Challenger Commander',
      rank: 'Captain, USN',
      designation: 'MISSION COMMANDER • Apollo 17',
      biography: 'Commander of Apollo 17, final human to walk on the Moon during the Apollo program. Logged 73 hours on the lunar surface.',
      evaHours: '22h 04m Surface EVA',
      heartRateRange: 'Historical telemetry archived (64 - 130 BPM during EVA traverses)',
      metabolicRate: 'Archived metabolic heat production: 850 - 1,250 BTU/hr',
      radiationExposure: 'Estimated cumulative mission dose: 5.5 mGy (Archived Dosimetry)',
      systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
      backendStatus: 'BACKEND CONNECTABLE',
      monitoringStatus: 'MONITORING MODULE READY'
    },
    schmitt: {
      id: 'schmitt',
      name: 'Harrison H. Schmitt',
      role: 'Lunar Module Pilot',
      callsign: 'Challenger LMP',
      rank: 'Civilian Scientist-Astronaut',
      designation: 'SCIENTIST-ASTRONAUT • Geologist',
      biography: 'First professional scientist (Ph.D. geologist from Harvard) to fly beyond low Earth orbit and walk on the lunar surface. Discovered orange volcanic pyroclastic glass beads at Shorty Crater.',
      evaHours: '22h 04m Surface EVA',
      heartRateRange: 'Historical telemetry archived (60 - 126 BPM during lunar sample collection)',
      metabolicRate: 'Archived metabolic heat production: 800 - 1,200 BTU/hr',
      radiationExposure: 'Estimated cumulative mission dose: 5.5 mGy (Archived Dosimetry)',
      systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
      backendStatus: 'BACKEND CONNECTABLE',
      monitoringStatus: 'MONITORING MODULE READY'
    },
    evans: {
      id: 'evans',
      name: 'Ronald E. Evans',
      role: 'Command Module Pilot',
      callsign: 'America CMP',
      rank: 'Commander, USN',
      designation: 'COMMAND MODULE PILOT • Apollo 17',
      biography: 'Piloted the Command Module "America" in lunar orbit during 75 lunar orbits (147 hours 43 minutes solo). Conducted a 1 hour 6 minute deep space EVA during trans-Earth return to retrieve film cassettes.',
      evaHours: '1h 06m Trans-Earth Deep Space EVA',
      heartRateRange: 'Historical telemetry archived (58 - 110 BPM during solo orbital mapping)',
      metabolicRate: 'Archived orbital resting baseline',
      radiationExposure: 'Estimated cumulative mission dose: 5.5 mGy (Archived Dosimetry)',
      systemStatus: 'HISTORICAL ARCHIVE NOMINAL',
      backendStatus: 'BACKEND CONNECTABLE',
      monitoringStatus: 'MONITORING MODULE READY'
    }
  },
  science: {
    siteSelection: 'Taurus-Littrow Valley was selected as the Apollo 17 landing site because it offered opportunities to study lunar rocks of different ages compared with materials returned by previous missions.',
    scientistAstronaut: 'Harrison H. Schmitt was the first scientist to participate as an Apollo lunar surface explorer.',
    keyDiscoveries: [
      'Discovery of orange volcanic soil at Shorty Crater (pyroclastic glass beads from 3.64 billion years ago)',
      'Collection of 110.5 kilograms (243.6 lb) of lunar rock and soil samples',
      'Traversed 35.7 km (22.2 miles) using the Lunar Roving Vehicle (LRV-3)',
      'Subsurface electrical and seismic profiling of lunar mare basalt flows'
    ]
  },
  healthCategories: [
    {
      id: 'cardiovascular',
      title: 'Cardiovascular Monitoring',
      icon: 'Heart',
      status: 'DATA ARCHIVED',
      backendStatus: 'BACKEND CONNECTABLE',
      moduleStatus: 'MONITORING MODULE READY',
      description: 'Historical continuous ECG rhythm strips and arterial pulse logging via Apollo biomedical telemetry harness.',
      countermeasure: 'In-flight bio-harness with sternal and axillary electrodes.'
    },
    {
      id: 'respiratory',
      title: 'Respiratory Health',
      icon: 'Wind',
      status: 'DATA ARCHIVED',
      backendStatus: 'BACKEND CONNECTABLE',
      moduleStatus: 'MONITORING MODULE READY',
      description: 'Cabin 100% O2 at 5.0 psi partial pressure; suit loop respiration monitored during lunar surface excursions.',
      countermeasure: 'Lithium hydroxide (LiOH) canisters for CO2 scrub and molecular sieve filtration.'
    },
    {
      id: 'bone-health',
      title: 'Bone Health & Calcium Balance',
      icon: 'Bone',
      status: 'DATA ARCHIVED',
      backendStatus: 'BACKEND CONNECTABLE',
      moduleStatus: 'MONITORING MODULE READY',
      description: 'Post-flight pre/post bone mineral density assessments and calcium excretion balance evaluation.',
      countermeasure: 'Heavy physical lunar rover tethering and high-impact 1/6th g surface locomotion.'
    },
    {
      id: 'radiation',
      title: 'Radiation Exposure',
      icon: 'Radio',
      status: 'DATA ARCHIVED',
      backendStatus: 'BACKEND CONNECTABLE',
      moduleStatus: 'MONITORING MODULE READY',
      description: 'Personal thermoluminescent dosimeters (TLD) and Van Allen radiation belt transit dosimetry.',
      countermeasure: 'Command Module polyethylene shielding and spacecraft hull attenuation.'
    },
    {
      id: 'mental-wellness',
      title: 'Mental Wellness & Cognitive Vigilance',
      icon: 'Brain',
      status: 'DATA ARCHIVED',
      backendStatus: 'BACKEND CONNECTABLE',
      moduleStatus: 'MONITORING MODULE READY',
      description: 'CapCom voice stress acoustic analysis, crew sleep logbooks, and mission timeline workload index.',
      countermeasure: 'Structured circadian sleep intervals and Houston flight surgeon debriefs.'
    },
    {
      id: 'sleep-recovery',
      title: 'Sleep and Recovery',
      icon: 'Moon',
      status: 'DATA ARCHIVED',
      backendStatus: 'BACKEND CONNECTABLE',
      moduleStatus: 'MONITORING MODULE READY',
      description: 'Lunar module hammock sleep periods in Taurus-Littrow Valley and orbital slumber berths.',
      countermeasure: 'Eyemasks, cabin acoustic baffling, and scheduled 8-hour sleep cycles.'
    },
    {
      id: 'immune',
      title: 'Immune System & Lunar Dust Reaction',
      icon: 'ShieldCheck',
      status: 'DATA ARCHIVED',
      backendStatus: 'BACKEND CONNECTABLE',
      moduleStatus: 'MONITORING MODULE READY',
      description: 'Evaluation of upper respiratory mucous membrane irritation ("lunar hay fever" noted by Harrison Schmitt from regolith dust inhalation).',
      countermeasure: 'Cabin vacuum brush decontamination and suit purge procedures.'
    }
  ]
};

// Configurable Apollo 17 frontend service functions
export async function getMissionHealthData(missionId = 'apollo-17') {
  if (!isBackendConfigured()) {
    return {
      source: 'offline-historical-archive',
      mission: apollo17MissionData
    };
  }
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/mission/${missionId}/health`, { headers });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { source: 'live-backend', ...data };
  } catch (error) {
    return {
      source: 'offline-historical-archive',
      mission: apollo17MissionData,
      networkError: error.message
    };
  }
}

export async function getAstronautHealthProfile(astronautId) {
  if (!isBackendConfigured()) {
    const profile = apollo17MissionData.crew[astronautId] || apollo17MissionData.crew.cernan;
    return {
      source: 'offline-historical-archive',
      astronaut: profile
    };
  }
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/astronaut/${astronautId}/profile`, { headers });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { source: 'live-backend', ...data };
  } catch (error) {
    const profile = apollo17MissionData.crew[astronautId] || apollo17MissionData.crew.cernan;
    return {
      source: 'offline-historical-archive',
      astronaut: profile,
      networkError: error.message
    };
  }
}

export async function getMissionAlerts(missionId = 'apollo-17') {
  if (!isBackendConfigured()) {
    return {
      source: 'offline-historical-archive',
      alerts: [
        {
          id: 'a17-01',
          type: 'ARCHIVE_NOMINAL',
          title: 'Apollo 17 Mission Archive Verified',
          timestamp: 'Dec 19, 1972',
          severity: 'NOMINAL',
          message: 'All lunar EVAs and orbital trans-Earth operations completed nominally. Data archived for research.'
        }
      ]
    };
  }
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/mission/${missionId}/alerts`, { headers });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { source: 'live-backend', ...data };
  } catch (error) {
    return {
      source: 'offline-historical-archive',
      alerts: [],
      networkError: error.message
    };
  }
}
