# ASTROHEALTH AI — FRONTEND API INTEGRATION DOCUMENT
## Backend Contracts, Schemas, Route Analysis & Integration Architecture

**Date**: November 2026  
**Backend Host**: `http://127.0.0.1:8000` (FastAPI + SQLite + OSDR Research Layer)  
**Target Frontend**: React + TypeScript + Vite + Tailwind CSS (`D:\AstroHealth-Frontend`)

---

## 1. Executive Summary & Architectural Findings

### 1.1 Backend Readiness & Capabilities
The AstroHealth AI FastAPI backend provides 4 primary API routers:
1. **Astronaut Management** (`/api/astronauts`)
2. **Health Data & Ingestion** (`/api/data`)
3. **Health Intelligence & Analysis** (`/api/analysis`)
4. **Alerts & Recommendations** (`/api`)

### 1.2 Key Integration Gaps & Observations (Documented per Specification)
1. **Supabase Authentication Gap**:
   - The FastAPI backend currently operates without JWT token verification middleware (no `HTTPBearer` or Supabase session verification dependencies on route handlers).
   - *Frontend Implementation*: The frontend implements full client-side Supabase session management, login, logout, and attaches `Authorization: Bearer <token>` to all HTTP requests. The UI transparently documents that backend endpoints are currently in open development mode and do not yet reject unverified tokens.
2. **Analysis Route Ordering Precedence**:
   - In `app/api/analysis_routes.py`, parameterized route `/{astronaut_id}/{domain}` is declared before `/ml/models` and `/datasets/discover`. Direct calls to `/api/analysis/ml/models` match `{astronaut_id}="ml"` and fail validation because `"models"` is not in `HealthDomain`.
   - *Frontend Handling*: The frontend attempts live calls to `/api/analysis/ml/models`, and when a 422 is returned, falls back to the backend's verified `ModelRegistry` catalog metadata while maintaining live predictions via `POST /api/analysis/ml/predict/{model_key}`.
3. **Data Tier Governance**:
   - The backend strictly enforces `DataType`: `"real"`, `"simulated"`, `"research"`.
   - Terrestrial research benchmarks (PhysioNet MMASH) are partitioned strictly for model development and must never be merged into operational astronaut telemetry.

---

## 2. Comprehensive API Endpoints Registry

| Endpoint | HTTP | Purpose | Request Parameters / Body | Response Schema | Frontend Component |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | System heartbeat & metadata | None | `{project, status, version, docs_url}` | `LandingPage`, `Footer` |
| `/health` | `GET` | Service & DB health check | None | `{status, service, database, environment}` | `DashboardLayout` Status Pill |
| `/api/astronauts` | `GET` | List registered astronauts | `skip?: int, limit?: int, mission_id?: str` | `List[AstronautResponse]` | `AstronautsPage`, `AstronautSelector` |
| `/api/astronauts` | `POST` | Register new astronaut | `AstronautCreate` body (`astronaut_id, name, mission_id, role, etc.`) | `AstronautResponse` (201) | `RegisterAstronautModal` |
| `/api/astronauts/{id}` | `GET` | Get astronaut by ID | `astronaut_id: str` | `AstronautResponse` | `AstronautProfileCard`, `AstronautDetailPage` |
| `/api/astronauts/{id}` | `PUT` | Update astronaut profile | `AstronautUpdate` body | `AstronautResponse` | `EditAstronautModal` |
| `/api/data/{id}` | `GET` | Retrieve health records | `astronaut_id, domain?, indicator?, data_type?, start_time?, end_time?, skip?, limit?` | `List[HealthRecordResponse]` | `DomainDetailPage`, `HealthTrendsChart` |
| `/api/data/{id}/domain/{domain}` | `GET` | Get domain telemetry records | `astronaut_id, domain, data_type?, skip?, limit?` | `List[HealthRecordResponse]` | `DomainDetailPage` |
| `/api/data/ingest` | `POST` | Ingest single record | `HealthData` (`astronaut_id, domain, indicator, value, unit, source, data_type`) | `HealthRecordResponse` (201) | `TelemetryIngestModal` |
| `/api/analysis/{id}` | `GET` | Integrated 6-domain intelligence overview | `astronaut_id: str, data_type?: DataType` | `IntegratedHealthSummary` | `IntelligencePage`, `ExecutiveDashboard` |
| `/api/analysis/{id}/{domain}` | `GET` | Deep-dive domain analysis | `astronaut_id: str, domain: HealthDomain, data_type?: DataType` | `DomainAnalysisResult` | `DomainDetailPage` |
| `/api/alerts/{id}` | `GET` | Active alerts for astronaut | `astronaut_id: str, status?: str, domain?: str` | `List[AlertResponse]` | `AlertsPage`, `AlertsPanel` |
| `/api/recommendations/{id}` | `GET` | Countermeasures & medical suggestions | `astronaut_id: str` | `List[RecommendationResponse]` | `AlertsPage`, `IntelligencePage` |
| `/api/analysis/ml/models` | `GET` | Registered ML candidate models | None | `List[ModelInfoResponse]` | `MLInsightsPage` |
| `/api/analysis/ml/models/{key}` | `GET` | Single ML model metadata | `model_key: str` | `ModelInfoResponse` | `MLModelDetailCard` |
| `/api/analysis/ml/predict/{key}` | `POST` | Execute model inference | `ModelPredictRequest` (`features: Dict[str, float], units?: Dict[str, str]`) | `ModelPredictResponse` | `MLPredictorConsole` |
| `/api/analysis/research/datasets` | `GET` | Connected NASA/OSDR research datasets | None | `List[Dict]` | `ResearchPage` |
| `/api/analysis/research/datasets/{id}` | `GET` | Complete dataset details | `dataset_id: str` | `Dict` (metadata & metrics) | `ResearchDatasetDetail` |
| `/api/analysis/research/domains/{domain}` | `GET` | Research evidence for domain | `domain: str` | `Dict` (evidence analysis) | `ResearchDomainView` |
| `/api/analysis/research/timeline/{pid}` | `GET` | Participant research timeline | `participant_id: str` (e.g. C001, Participant 1) | `Dict` (longitudinal timeline) | `ResearchTimelineView` |
| `/api/analysis/research/compare/{id}/{ind}` | `GET` | Compare astronaut vs research cohort | `astronaut_id: str, indicator: str` | `Dict` (distribution comparison) | `ResearchComparisonChart` |
| `/api/analysis/research/osd/{study_id}/cohort-summary` | `GET` | OSDR study cohort summary | `study_id: str` (OSD-575, OSD-569, OSD-656, OSD-571, OSD-570) | `Dict` (cohort metrics & shifts) | `ResearchCohortSummary` |

---

## 3. Data Tier Policy (REAL vs RESEARCH vs SIMULATED)

1. **`REAL`**: In-flight astronaut operational telemetry (e.g. active bioharness ECG, cabin atmospheric sensors).
2. **`RESEARCH`**: NASA GeneLab / OSDR spaceflight studies (OSD-575, OSD-569, OSD-656) or terrestrial analog cohorts (MMASH).
   - *Rule*: Research datasets are used exclusively for population baseline bounds, validation, and comparative statistics. Never displayed as astronaut live telemetry.
3. **`SIMULATED`**: High-fidelity aerospace synthetic telemetry conforming to NASA-STD-3001 bounds, clearly badged to prevent clinical confusion.
