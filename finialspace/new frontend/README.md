# 🚀 ASTRA HEALTH — AI-Powered Space Health Monitoring System

**ASTRA HEALTH** is a space-grade health telemetry, biomedical intelligence, and mission diagnostics platform engineered for long-duration human spaceflight (Artemis, Apollo 17, and Mars Expedition ARES-V). It combines real-time biosensor streams, longitudinal health trends, interactive 3D anatomical holograms, clinical triage intelligence, and deep-space mission archives into a single unified application.

---

## 🌟 Architecture & Application Flow

The application follows a seamless, role-governed user journey:

```
                                  [ User Visits Platform ]
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │     LANDING PAGE (Route /)    │
                             │  • Cinematic Space Backdrop   │
                             │  • Astra Health Identity      │
                             │  • Mission & About Highlights │
                             └───────────────┬───────────────┘
                                             │
                       Clicks "Login" / "Login to Dashboard"
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │       LOGIN (Route /login)    │
                             │  • Real Google OAuth Sign In  │
                             │  • Biometric Scanner Telemetry│
                             │  • Operator Credentials Fallback│
                             └───────────────┬───────────────┘
                                             │
                                Authentication Success
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │ HEALTH DASHBOARD (/dashboard) │
                             │  • Real-time Bio-Mesh Streams │
                             │  • Flight Crew Roster         │
                             │  • 3D Organ Hotspot Telemetry │
                             └───────┬───────────────┬───────┘
                                     │               │
            Selects "Mission Status" │               │ Selects Crew Member Profile
                                     ▼               ▼
     ┌───────────────────────────────────┐       ┌───────────────────────────────────┐
     │   MISSION OVERVIEW (/mission)     │       │ ASTRONAUT RECORDS (/profile/:id)  │
     │  • Apollo 17 Science Archive      │       │  • Cernan, Schmitt, Evans Dossier │
     │  • Chronological EVA Timeline     │       │  • ECG, SANS, Bone Density Trends │
     └───────────────────────────────────┘       └───────────────────────────────────┘
```

---

## 🛰️ Core Features

### 1. Cinematic Landing Page (`/`)
- **Immersive Space Visuals**: Full-screen high-resolution orbital backdrop with subtle atmospheric vignettes.
- **Glassmorphism Navigation Bar**: Translucent pill navigation with the official Astra Health emblem, active electric-blue state indicator, and responsive navigation links.
- **Interactive Modals**: Interactive popup modals for **Mission Archive** and **About Astra Health** providing deep space operational context.
- **Direct Authentication Gateway**: Primary CTA (*"Login to Dashboard"*) and header login trigger that gracefully handles both unauthenticated visitors and authenticated operators.

### 2. Real Google OAuth & Supabase Authentication (`/login`, `/auth/callback`)
- **Google OAuth Handshake**: One-click Google login powered by Supabase PKCE token exchange.
- **Biometric Scanner HUD**: Circular dual-ring retinal and neural cipher scanner with live status indicators.
- **Session Persistence**: Encrypted session restoration from `localStorage` on page refresh via `supabase.auth.getSession()`.
- **Real-Time Auth Subscription**: Listens to `onAuthStateChange` events for automated token refresh, sign-in, and sign-out.
- **Protected Routing**: Unauthenticated access to dashboard views automatically redirects to `/login` with location return state.
- **One-Click Sign Out**: Dedicated logout controls in the navigation bar, mobile drawer, and astronaut profile modal.

### 3. Flight Surgeon Command Dashboard (`/dashboard`)
- **Mission Health Score (92% OPTIMAL)**: SVG radial progress indicator calibrated against NASA-STD-3001.
- **Bio-Mesh Telemetry Cards**:
  - **Cardiovascular**: 72 BPM sinus rhythm, arterial pulse pressure, cardiac output.
  - **Oxygen Level**: 98% SpO2 arterial saturation.
  - **Bone Density**: 98% stable, ARED exercise compliance.
  - **Mental Wellness**: 85% balanced, salivary cortisol monitoring.
  - **Radiation**: 0.42 mSv/day (Low), cumulative mission dosimetry.
  - **Sleep & Recovery**: 87% circadian rhythm score, deep sleep percentage.
- **Three Astronaut Crew Profiles**: Eugene Cernan (CDR), Harrison Schmitt (LMP), Ronald Evans (CMP).

### 4. Interactive 3D Anatomy & Organ Telemetry (`/anatomy`)
- **WebGL 3D Engine**: Built with **Three.js**, **React Three Fiber**, and **@react-three/drei**.
- **Multi-Organ Procedural Simulation**: Brain (EEG/ICP), Heart (pulsing double systole/diastole), Lungs (breathing cycle), Spine, Ribcage, Pelvis, Kidneys, and Vascular tree.
- **Camera Interpolation**: Clicking any organ hotspot smoothly transitions and focuses the 3D viewport.
- **Telemetry Panel**: Physiological summary, microgravity space risks, clinical metrics, and diagnostic status.

### 5. Apollo 17 Historical & Scientific Archive (`/apollo-17`, `/mission`)
- **Historical Flight Crew Telemetry**: Complete operational records for Taurus-Littrow lunar exploration.
- **Chronological Mission Timeline**: EVA 1, EVA 2, and EVA 3 surface traverses, lunar rover sorties, and sample return analytics (110.4 kg).
- **Physiological Monitoring**: Real-time heart rate under lunar EVA workloads, suit pressure, and oxygen consumption.

### 6. ASTRA AI Interactive Robotic Assistant
- **Floating Intelligent Assistant**: Autonomous robot companion with smooth hovering physics and safe-zone detection.
- **Voice Synthesizer**: Speech bubble integration with voice feedback for critical biosensor alerts.
- **Clinical Triage & Diagnostics**: Immediate recommendations synthesized from multimodal telemetry.

---

## 📁 Directory Structure

```
finialspace/new frontend/
├── public/
│   ├── images/
│   │   ├── astra-health-logo.png      # Official Astra Health emblem
│   │   └── space-bg.jpg               # Cinematic orbital backdrop
│   ├── anatomy-scan.jpg               # Anatomical reference scan
│   ├── cernan-portrait.jpg            # Eugene Cernan flight portrait
│   ├── evans-portrait.jpg             # Ronald Evans flight portrait
│   ├── schmitt-portrait.jpg           # Harrison Schmitt flight portrait
│   └── skeleton-scan.jpg              # Musculoskeletal radiographic scan
├── src/
│   ├── components/
│   │   ├── apollo17/                  # Apollo 17 mission & timeline components
│   │   │   ├── AstronautProfile.jsx
│   │   │   ├── CrewSelection.jsx
│   │   │   ├── MissionOverview.jsx
│   │   │   ├── MissionTimeline.jsx
│   │   │   └── PhysiologicalDataPanel.jsx
│   │   ├── AstraAI/                   # ASTRA AI Robot & Voice Assistant
│   │   │   ├── AIChatPanel.jsx
│   │   │   ├── AstraAIController.jsx
│   │   │   ├── AstraRobot.jsx
│   │   │   └── VoiceAssistant.jsx
│   │   ├── auth/                      # Authentication UI components
│   │   │   └── GoogleLoginButton.jsx  # Styled Google OAuth button
│   │   ├── AstronautProfile.jsx       # Astronaut dossier modal with sign-out
│   │   ├── BiometricScanner.jsx       # Retinal & neural scanning component
│   │   ├── HealthCard.jsx             # Metric card with animated sparklines
│   │   ├── HealthChart.jsx            # Longitudinal telemetry charts
│   │   ├── HumanBody3D.jsx            # 3D Three.js anatomical model
│   │   ├── OrganHotspot.jsx           # 3D interactive organ markers
│   │   ├── TopNav.jsx                 # Glassmorphic top navigation bar
│   │   └── Topbar.jsx                 # Telemetry header bar
│   ├── context/
│   │   ├── AstraAIContext.jsx         # AI assistant global state
│   │   └── AuthContext.jsx            # Supabase session, user, and OAuth provider
│   ├── data/
│   │   └── mockData.js                # NASA-STD aerospace medical baseline dataset
│   ├── pages/
│   │   ├── Alerts.jsx                 # Investigation queue & clinical triage
│   │   ├── AnatomyMonitor.jsx         # 3D Anatomy Monitor viewport
│   │   ├── Apollo17.jsx               # Apollo 17 overview & archives
│   │   ├── Apollo17Anatomy.jsx        # Apollo 17 crew anatomical comparison
│   │   ├── AuthCallback.jsx           # Google OAuth redirect handler
│   │   ├── Dashboard.jsx              # Main flight surgeon health overview
│   │   ├── HealthMonitoring.jsx       # 6 physiological domains monitor
│   │   ├── IndividualProfile.jsx      # Individual astronaut telemetry records
│   │   ├── LandingPage.css            # Scoped styles for cinematic landing page
│   │   ├── LandingPage.jsx            # Primary landing page (default route /)
│   │   ├── Login.jsx                  # Futuristic Google & biometric sign-in
│   │   └── Mission.jsx                # Fleet status & ECLSS environment
│   ├── routes/
│   │   └── ProtectedRoute.jsx         # Route guard for authenticated pages
│   ├── services/
│   │   ├── api.js                     # Backend API client with Bearer token injection
│   │   ├── authService.js             # Supabase OAuth and credential methods
│   │   └── supabaseClient.js          # Centralized Supabase client initialization
│   ├── App.jsx                        # Master application controller & router
│   ├── index.css                      # Global design system & cyber styling
│   └── main.jsx                       # React 18 DOM mount point
├── .env                               # Environment variables configuration
├── package.json                       # Project dependencies and npm scripts
└── vite.config.js                     # Vite build and server configuration
```

---

## ⚙️ Environment Configuration (`.env`)

Configure the following variables in your `.env` file:

```env
# Backend API Base URL (FastAPI)
VITE_API_BASE_URL=http://127.0.0.1:8000

# Supabase Authentication (Google OAuth & Session Management)
VITE_SUPABASE_URL=https://anmztjdawhcaoaehekns.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_yyokp0enU69BYSnMRDqsYg_AZ2FUx12

# BioDigital Human 3D Model Configuration (Optional)
VITE_BIODIGITAL_KEY=
VITE_BIODIGITAL_MODEL_ID=production/maleAdult/male_complete_anatomy_01
```

> **Security Note**: Never expose `service_role` keys in the frontend. All client operations utilize the public `anon` key coupled with Supabase Row Level Security (RLS) and PKCE tokens.

---

## 🛠️ Installation & Running

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or pnpm / yarn)
- **FastAPI Backend** (Optional, for live telemetry synchronization on port 8000)

### 1. Install Dependencies
```bash
# Navigate to the frontend directory
cd "finialspace/finialspace/new frontend"

# Install all dependencies
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The application will launch on **`http://localhost:3000`** (or `http://localhost:5173`).

### 3. Build for Production
```bash
npm run build
```

This compiles and optimizes all modules into the `dist/` directory with gzip chunking.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Routes Overview

| Route | Access | Component | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | Public | `LandingPage.jsx` | Cinematic landing page & platform entrance |
| `/login` | Public | `Login.jsx` | Google OAuth sign-in & biometric verification |
| `/auth/callback` | Public | `AuthCallback.jsx` | Processes Google OAuth PKCE authorization |
| `/dashboard` | Protected | `Dashboard.jsx` | Mission control health overview & crew cards |
| `/mission` | Protected | `Mission.jsx` | Mission status, ECLSS, and expedition telemetry |
| `/apollo-17` | Protected | `Apollo17.jsx` | Apollo 17 historical archives & lunar sorties |
| `/profile/:id` | Protected | `IndividualProfile.jsx` | Individual astronaut health dossier |
| `/anatomy` | Protected | `AnatomyMonitor.jsx` | Interactive 3D anatomical organ inspector |
| `/health-monitoring` | Protected | `HealthMonitoring.jsx` | Deep-dive telemetry (Vitals, Rad, Bone, Sleep) |
| `/alerts` | Protected | `Alerts.jsx` | Clinical alerts investigation & diagnostic triage |

---

## 🛡️ Telemetry Governance & Clinical Safety

- **Real Telemetry**: Operational astronaut biometrics synthesized according to NASA-STD-3001 spaceflight standards.
- **Research Partitioning**: Terrestrial analog cohorts (e.g., PhysioNet MMASH) and NASA GeneLab/OSDR spaceflight datasets are maintained strictly for baseline models and never conflated with live flight telemetry.
- **Network Resilience**: In offline conditions or when the FastAPI backend is disconnected, the client automatically defaults to verified offline snapshots to ensure mission continuity without breaking UI controls.

---

## 📄 License

This project is licensed under the MIT License. Developed for advanced biomedical aerospace telemetry and space exploration missions.
