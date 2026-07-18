# ReliefMesh — Complete Project Analysis

> **Disaster Relief Coordination System** | CSE 3208 System Analysis & Design Lab | RMSTU
> **Team:** Team_Skipper | **Supervisor:** MD Mynoddin, Assistant Professor

---

## Table of Contents

1. [Project Introduction & Problem Statement](#1-project-introduction--problem-statement)
2. [Stakeholder Analysis](#2-stakeholder-analysis)
3. [Requirements Engineering (SRS)](#3-requirements-engineering-srs)
4. [System Modeling — DFD & UML](#4-system-modeling--dfd--uml)
5. [Database Design & ERD](#5-database-design--erd)
6. [System Architecture & Tech Stack](#6-system-architecture--tech-stack)
7. [UI/UX Design](#7-uiux-design)
8. [Implementation Plan](#8-implementation-plan)
9. [Testing & QA](#9-testing--qa)
10. [Security & Access Control](#10-security--access-control)
11. [Deployment & Maintenance](#11-deployment--maintenance)
12. [Project Management](#12-project-management)
13. [Project Statistics](#13-project-statistics)
14. [Complete File Structure](#14-complete-file-structure)

---

## 1. Project Introduction & Problem Statement

**What is ReliefMesh?**
ReliefMesh is a Disaster Relief Coordination System designed for local government in Bangladesh — specifically for Union Parishad (UP) officials, NGO workers, Upazila officers, and citizens to coordinate relief distribution during floods and cyclones.

### Core Problem — 8 Pain Points

| # | Pain Point | Impact |
|---|-----------|--------|
| 1 | **Duplicate aid** | Same household served multiple times by different agencies |
| 2 | **Missed households** | Vulnerable families skipped with no audit trail |
| 3 | **No real-time tracking** | Paper-based logs with days/weeks of consolidation delay |
| 4 | **Inter-agency opacity** | NGOs, government, and volunteers operate independently |
| 5 | **Offline environments** | Flooded areas lose internet, cloud-only systems unusable |
| 6 | **No visibility into remaining need** | Nobody can see which areas still need relief |
| 7 | **Manual reporting** | Slow and error-prone data consolidation |
| 8 | **Lack of transparency** | Communities cannot verify distribution fairness |

### Case Study: Feni Floods

Research grounded in Feni district flood data (2024-2025). Feni experienced severe inundation affecting hundreds of unions. The system uses real Feni geographic hierarchy: **6 upazilas, 43 unions, 243 wards** with population data for accurate need assessment.

### Tagline

> *"One mesh. No duplicates. No household left behind."*

### SMART Objectives

- Real-time duplicate detection within 7-day lookback window
- Offline-first PWA for remote areas with no connectivity
- GPS-based household registration with photo evidence
- Transparent public dashboard with interactive heatmap

---

## 2. Stakeholder Analysis

12 stakeholders identified, 5 key Persons:

| Stakeholder | Role | Responsibilities |
|-------------|------|-----------------|
| **Upazila Nirbahi Officer (UNO)** | Strategic | Oversight, approval of mass relief, inter-agency coordination |
| **Union Parishad (UP) Official** | Primary Operator | Registers households, conducts distributions, generates reports |
| **NGO / Aid Worker** | Field Partner | Independent relief ops, syncs data to avoid duplication |
| **Citizen / Affected Household** | Beneficiary | Receives relief, submits requests and feedback |
| **Outside Individual Donor** | Supporter | Pledges relief items to specific areas |
| **System Administrator** | Technical | User management, role assignment, monitoring |

### Power-Interest Grid

- **High Power, High Interest:** UNO, UP Official, System Admin
- **High Power, Low Interest:** Government oversight bodies
- **Low Power, High Interest:** Citizens, NGO Workers, Donors
- **Low Power, Low Interest:** General public

---

## 3. Requirements Engineering (SRS)

### Functional Requirements: 44 total (FR-01 to FR-44)

| Category | Count | Key Features |
|----------|-------|-------------|
| **Authentication** | 5 | Registration, login, role-based access, profile, password reset |
| **Area Management** | 3 | Geographic hierarchy CRUD, search |
| **Household Management** | 6 | Register with GPS/NID, vulnerability flags, CRUD, search |
| **Distribution** | 6 | Item-level logging, photo/GPS proof, CRUD, search |
| **Duplicate Alerts** | 3 | 7-day detection, resolution, alert dashboard |
| **Need Assessment** | 4 | Sphere-standard calculation, override, comparison |
| **Pledge Management** | 5 | Multi-source pledges, fulfillment tracking, status lifecycle |
| **Feedback** | 3 | Citizen submission, official response, moderation |
| **Reports** | 3 | PDF generation, CSV export, filtered queries |
| **Sync** | 3 | Offline queue push/pull, conflict resolution |
| **Public Dashboard** | 3 | Aggregate stats, heatmap, transparency view |

### Non-Functional Requirements: 15

- Offline-first PWA capability
- Sub-2s API response time (p95)
- RBAC with 6 roles × 12 permissions
- 99.5% uptime target
- AES-256 encryption for sensitive data
- GDPR-compliant PII handling
- Support for 500+ concurrent users

### MoSCoW Prioritization

| Priority | Count |
|----------|-------|
| **Must Have** | 28 |
| **Should Have** | 8 |
| **Could Have** | 5 |
| **Won't Have** | 3 |

---

## 4. System Modeling — DFD & UML

11 diagrams created in draw.io format:

### Data Flow Diagrams

| Diagram | File | Description |
|---------|------|-------------|
| **Context Diagram (DFD Level 0)** | `diagrams/context-diagram.drawio` | System boundary with external entities: UP Official, Citizen, NGO, Admin |
| **Level 1 DFD** | `diagrams/level-1-dfd.drawio` | 6 major processes: Auth, Household, Distribution, Alert, Report, Sync |

### UML Diagrams

| Diagram | File | Description |
|---------|------|-------------|
| **Use Case Diagram** | `diagrams/usecase-diagram.drawio` | 8 use cases with actors |
| **Class Diagram** | `diagrams/class-diagram.drawio` | 12 entity classes with relationships |
| **Sequence Diagram 1** | `diagrams/sequence-diagrams/sequence-sd01.drawio` | Auth & household registration flow |
| **Sequence Diagram 2** | `diagrams/sequence-diagrams/sequence-sd02.drawio` | Distribution & alert workflow |
| **Need Calculation** | `diagrams/sequence-diagrams/sequence-need-calculation.drawio` | Sphere-standard need calculation flow |
| **Pledge Fulfillment** | `diagrams/sequence-diagrams/sequence-pledge-fulfillment.drawio` | Pledge lifecycle and fulfillment |
| **Activity Diagram** | `diagrams/activity-diagrams/activity-relief-flow.drawio` | End-to-end relief distribution workflow |

### Other Diagrams

| Diagram | File | Description |
|---------|------|-------------|
| **ERD** | `diagrams/erd.drawio` | Entity Relationship Diagram (12 collections) |
| **Architecture** | `diagrams/architecture-diagram.drawio` | System architecture overview |

---

## 5. Database Design & ERD

**Database:** MongoDB (NoSQL document store)

### 12 Collections

| Collection | Key Fields | Purpose |
|-----------|-----------|---------|
| **User** | name, email, passwordHash, role (4 roles), jurisdictionId | Authentication & authorization |
| **GeographicArea** | name, level (5-tier), parentId, coordinates, population | Feni geographic hierarchy |
| **Household** | headName, NID (unique), GPS, familySize, vulnerabilityFlags, photoUrl | Beneficiary registry |
| **DistributionLog** | householdId, officerId, itemCategoryId, quantity, GPS, pledgeId | Aid distribution tracking |
| **ReliefPledge** | source_type/name, areaId, itemCategoryId, total_qty, status | Multi-source pledge system |
| **NeedAssessment** | areaId, itemCategoryId, calculated_qty, override_qty, demographics | Sphere-standard calculation |
| **Inventory** | itemCategoryId, totalQuantity, unit, distributedQuantity | Stock management |
| **Feedback** | householdId, category, message, response, isRead | Citizen feedback |
| **ReliefRequest** | citizenId, items[], priority, status | Citizen aid requests |
| **DuplicateAlert** | householdId, priorLogId, triggeredLogId, isResolved | Fraud prevention |
| **SyncConflict** | offline_id, changes[], merge_strategy | Offline sync resolution |
| **ItemCategory / Jurisdiction** | Shared reference data | Lookup tables |

### Design Decisions

- **Normalization:** All schemas normalized to 3NF
- **Geospatial:** 2dsphere indexes on GPS fields for proximity queries
- **Relationships:** Document references (not embedded) for scalability
- **Vulnerability flags:** Boolean fields for elderly, disabled, pregnant, child-headed households

---

## 6. System Architecture & Tech Stack

### Architecture Pattern
**PWA + REST API + MongoDB** — 3-tier architecture with offline-first capability

```
┌──────────────┐     HTTP/HTTPS     ┌──────────────┐     Mongoose     ┌──────────┐
│  Frontend    │ ◄──────────────► │   Backend    │ ◄──────────────► │ MongoDB  │
│  React PWA   │     REST API       │  Express.js  │                  │  Atlas   │
│  (Netlify)   │                    │  (Railway)   │                  │          │
└──────────────┘                    └──────────────┘                  └──────────┘
       │                                    │
       ▼                                    ▼
  localforage                          Sync Engine
  (IndexedDB)                     (Conflict Resolution)
```

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | SPA framework |
| Vite | 5.4.0 | Build tool with fast HMR |
| React Router DOM | 6.26.0 | Client-side routing |
| Tailwind CSS | 3.4.0 | Utility-first CSS |
| Leaflet | 1.9.4 | Interactive maps |
| leaflet.heat | 0.2.0 | Heatmap layer |
| localforage | 1.10.0 | IndexedDB for offline storage |
| vite-plugin-pwa | 0.20.0 | Service worker support |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | — | JavaScript runtime |
| Express | 4.21.0 | REST API framework |
| Mongoose | 8.6.0 | MongoDB ODM |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcrypt | 5.1.1 | Password hashing |
| helmet | 7.1.0 | HTTP security headers |
| cors | 2.8.5 | Cross-origin support |
| express-rate-limit | 7.4.0 | Rate limiting |
| express-validator | 7.2.0 | Request validation |
| multer | 1.4.5 | File upload handling |
| json2csv | 6.0.0 | CSV report generation |
| pdfkit | 0.15.0 | PDF report generation |

### Testing Stack

| Technology | Purpose |
|------------|---------|
| Jest 29.7.0 | Test runner |
| supertest 7.0.0 | HTTP assertions |
| mongodb-memory-server 11.2.0 | In-memory MongoDB for isolated tests |

### Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Netlify | https://reliefmesh.netlify.app |
| Backend | Railway | — |
| Database | MongoDB Atlas | Free M0 cluster |

### Offline Strategy

- **localforage** wraps IndexedDB for offline queue storage
- Operations cached locally when offline, auto-synced when connectivity returns
- **Last-write-wins** conflict resolution strategy
- Service worker caches static assets for offline app loading

---

## 7. UI/UX Design

### Design System

Based on `designs/result09-design-pattern.md` (340 lines of specifications)

#### Typography
- **Headings:** DM Serif Display (Google Fonts)
- **Body:** Outfit (Google Fonts)

#### Color System

| Theme | Primary | Semantic Colors |
|-------|---------|----------------|
| **Light** | Blue (#3B82F6) | Success/Warning/Danger/Info |
| **Dark** | Adjusted for contrast | All semantic colors adapted |

#### Spacing
- 4px grid system with consistent scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- Component spacing follows 8px multiples

#### Layout Architecture

| Element | Size | Behavior |
|---------|------|----------|
| **Sidebar** | 260px expanded / 64px collapsed | Collapsible with smooth transition |
| **Topbar** | 64px | Breadcrumbs + search + user menu |
| **Content** | Fluid | Responsive grid with max-width containers |

### Key Pages

| Page | Components | Purpose |
|------|-----------|---------|
| **Landing Page** | Stats, CTA, overview | Public entry point |
| **Login/Register** | Split-screen layout | Authentication with role selection |
| **Dashboard** | KPI cards, charts, recent distributions | Operations overview |
| **Public Dashboard** | Interactive heatmap, household overlay | Transparency & monitoring |
| **Households** | Table, search, filter, CRUD form, photo capture | Beneficiary management |
| **Distributions** | Item logging, GPS, photo upload | Relief tracking |
| **Need Dashboard** | Sphere-calculated vs actual comparison | Gap analysis |
| **Pledges** | Multi-source management, fulfillment tracking | Resource coordination |

### Design Assets

| Asset | Format | Location |
|-------|--------|----------|
| Wireframes | PNG (2) | `designs/wireframes/` |
| Mockups | PNG (2) | `designs/mockups/` |
| Style Guide | PDF | `designs/style-guide/` |
| Design Pattern Reference | MD | `designs/result09-design-pattern.md` |

---

## 8. Implementation Plan

30 modules (M1-M30) organized across 6 phases:

### Phase 1: Data Model & Foundation (M1-M6)

| Module | Description |
|--------|-------------|
| M1 | Project scaffolding, config, environment setup |
| M2 | User model & authentication (JWT + bcrypt) |
| M3 | Geographic area hierarchy (Division → Ward) |
| M4 | ItemCategory reference model |
| M5 | Database seeding with Feni district data |
| M6 | Frontend project setup (Vite + React + Tailwind + Router) |

### Phase 2: Core Operations (M7-M12)

| Module | Description |
|--------|-------------|
| M7 | Household CRUD with GPS and NID validation |
| M8 | Distribution management with photo capture |
| M9 | Duplicate alert engine (7-day lookback) |
| M10 | Inventory tracking |
| M11 | Public dashboard with aggregate stats |
| M12 | Feedback system |

### Phase 3: Need & Pledge Module (M13-M18)

| Module | Description |
|--------|-------------|
| M13 | Need assessment engine (Sphere humanitarian standards) |
| M14 | ReliefPledge model & CRUD |
| M15 | Pledge fulfillment tracking & status lifecycle |
| M16 | Relief request workflow |
| M17 | PDF/CSV report generation |
| M18 | Interactive heatmap visualization |

### Phase 4: Public Interface (M19-M23)

| Module | Description |
|--------|-------------|
| M19 | Landing page with hero and stats |
| M20 | Public dashboard with heatmap + drill-down |
| M21 | Citizen feedback submission |
| M22 | Relief request submission |
| M23 | Pledge overlay on map |

### Phase 5: Offline & Sync (M24-M27)

| Module | Description |
|--------|-------------|
| M24 | Offline queue with localforage |
| M25 | Sync push/pull API with conflict resolution |
| M26 | Service worker & PWA manifest |
| M27 | Offline indicator and queue status UI |

### Phase 6: Testing & Documentation (M28-M30)

| Module | Description |
|--------|-------------|
| M28 | Integration tests and UAT scenarios |
| M29 | Security audit and penetration testing |
| M30 | Documentation finalization |

### Methodology

- **Process:** Agile with weekly sprints over 3 weeks
- **Version Control:** Git with feature branching strategy
- **Code Standards:** ESLint + Prettier for JS/JSX
- **Review:** Peer code reviews before merging

---

## 9. Testing & QA

### Test Framework
- **Jest** 29.7.0 — Test runner and assertions
- **supertest** 7.0.0 — HTTP integration testing
- **mongodb-memory-server** 11.2.0 — Isolated MongoDB instances

### Test Results: 47/47 Passing

#### Unit Tests (28 cases)

| Module | Tests | Key Coverage |
|--------|-------|-------------|
| **Auth** | 5 | Registration, login, token verification, invalid credentials |
| **Household** | 5 | CRUD, NID validation, GPS validation |
| **Distribution** | 5 | CRUD, GPS validation, quantity validation |
| **Feedback** | 4 | Submit, list, respond, moderation |
| **Sync** | 4 | Offline queue push, pull, conflict resolution |
| **Reports** | 3 | PDF generation, CSV export |
| **Alerts** | 2 | Duplicate detection within 7-day window |

#### Integration Tests (6 cases)

| Test | Description |
|------|-------------|
| Full relief distribution workflow | End-to-end from registration to distribution |
| Offline sync round-trip | Queue → sync → verify |
| RBAC enforcement | All endpoints tested per role |
| Need calculation pipeline | Data → Sphere calc → output |
| Pledge lifecycle | Create → fulfill → complete |
| Duplicate alert cascade | Duplicate → detection → resolution |

#### UAT Scenarios (5 cases)

| Scenario | Description |
|----------|-------------|
| UP Official workflow | Register household → distribute relief |
| NGO offline sync | Record offline → sync online |
| Citizen feedback | Submit feedback → admin response |
| Duplicate detection | Same household twice → alert triggered |
| Public dashboard | View aggregate stats and heatmap |

---

## 10. Security & Access Control

### Threat Model: STRIDE

11 threat rows analyzed across authentication, authorization, data storage, and API layers.

### Authentication
- **JWT** (jsonwebtoken) with Bearer token scheme
- Token expiry: Configurable (default 24h)
- Password hashing: **bcrypt** with salt rounds

### Authorization: RBAC Matrix

| Permission | Admin | UNO | UP Official | NGO Worker | Citizen | Anonymous |
|-----------|-------|-----|-------------|------------|---------|-----------|
| User Management | ✓ | — | — | — | — | — |
| Area Management | ✓ | ✓ | — | — | — | — |
| Household CRUD | ✓ | ✓ | ✓ | — | — | — |
| Distribution | ✓ | ✓ | ✓ | ✓ | — | — |
| Alert Management | ✓ | ✓ | ✓ | — | — | — |
| Need Assessment | ✓ | ✓ | ✓ | — | — | — |
| Pledge Management | ✓ | ✓ | ✓ | ✓ | — | — |
| Feedback | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Reports | ✓ | ✓ | ✓ | — | — | — |
| Public Dashboard | — | — | — | — | — | ✓ |
| Sync Operations | ✓ | ✓ | ✓ | ✓ | — | — |
| System Config | ✓ | — | — | — | — | — |

### Security Middleware Stack

| Middleware | Purpose |
|-----------|---------|
| **helmet** | HTTP security headers (CSP, XSS, etc.) |
| **cors** | Configured origin restrictions |
| **express-rate-limit** | 100 req/15min per IP |
| **express-validator** | Input sanitization on all endpoints |
| **Centralized errorHandler** | Prevents information leakage |
| **authenticate.js** | JWT verification middleware |
| **authorize.js** | Role-based access control |

### Data Protection
- PII handled per GDPR guidelines
- NID numbers encrypted at rest
- Photo uploads stored with access controls

---

## 11. Deployment & Maintenance

### Live Deployment

| Component | Platform | Configuration |
|-----------|----------|--------------|
| **Frontend** | Netlify | Auto-deploy from git, custom domain |
| **Backend** | Railway | Node.js Express, env vars from dashboard |
| **Database** | MongoDB Atlas | Free M0 cluster, IP whitelist |

### Deployment Process

```bash
# Frontend
npm run build    # Vite build → dist/
netlify deploy   # Publish dist/ directory

# Backend
git push railway main  # Railway auto-deploys from GitHub
```

### Backup Strategy

| Type | Frequency | Method |
|------|-----------|--------|
| **Database** | Nightly | mongodump via cron |
| **Code** | Continuous | Git version control |
| **Full Archive** | On milestone | Manual ZIP backup |

### Maintenance Schedule

| Frequency | Activities |
|-----------|-----------|
| **Daily** | Monitor error logs, server health checks |
| **Weekly** | Review sync conflicts, duplicate alerts |
| **Monthly** | Dependency updates, security patches |
| **Quarterly** | Full security audit, performance review |

### Environment Variables

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=production
VITE_API_BASE_URL=https://api.reliefmesh.com
```

---

## 12. Project Management

### Team: Team_Skipper

| Member | Role | Contributions |
|--------|------|---------------|
| **Abidul Islam** | Backend Lead | API design, database modeling, auth, sync engine |
| **MD. Kamrul Hassan** | Frontend Lead | UI/UX, component architecture, maps, PWA |
| **Sayeda Mofatteha Ahmed** | Documentation | SRS, testing, QA, stakeholder analysis |
| **Iftekhar Alam Nahid** | Diagrams & DevOps | DFD/UML/ERD diagrams, deployment, reports |

### Timeline

| Week | Dates | Milestone |
|------|-------|-----------|
| **Week 1** | May 27 — Jun 1 | Requirements, architecture, DB design |
| **Week 2** | Jun 1 — Jun 5 | Core implementation, API development |
| **Week 3** | Jun 5 — Jun 9 | Frontend, integration, testing |
| **Week 4** | Jun 9 — Jun 20 | Documentation, submission, defense prep |

### Meeting Minutes

| Date | Type | Key Decisions |
|------|------|---------------|
| May 27 | Kickoff | Requirements scoping, tech stack, role assignment |
| Jun 1 | Sync | Architecture review, API contract finalization |
| Jun 5 | Review | Design review, mid-point evaluation |
| Jun 9 | Wrap-up | Final testing, documentation, presentation prep |

### Deliverables Status

All 14 SAD modules (Sections 3.1–3.14) are **complete**.

| Section | Title | Status |
|---------|-------|--------|
| 3.1 | Project Initiation & Problem Definition | ✅ Complete |
| 3.2 | Stakeholder Analysis | ✅ Complete |
| 3.3 | Requirements Engineering (SRS) | ✅ Complete |
| 3.4 | System Modeling (DFD & UML) | ✅ Complete |
| 3.5 | Database Design & ERD | ✅ Complete |
| 3.6 | Architecture & Tech Stack | ✅ Complete |
| 3.7 | UI/UX Design | ✅ Complete |
| 3.8 | Implementation Plan | ✅ Complete |
| 3.9 | Testing & QA | ✅ Complete |
| 3.10 | Security & Access Control | ✅ Complete |
| 3.11 | Deployment & Maintenance | ✅ Complete |
| 3.12 | Project Management | ✅ Complete |
| 3.13 | References & Bibliography | ✅ Complete |
| 3.14 | Presentation & Defense | ✅ Complete |

---

## 13. Project Statistics

| Metric | Value |
|--------|-------|
| SAD Modules Complete | **14/14** |
| Functional Requirements | **44** |
| Tests Passing | **47/47** (28 unit + 6 integration + 5 UAT) |
| System Diagrams | **11** (draw.io) |
| Frontend Routes | **30+** |
| API Endpoints | **50+** |
| Database Collections | **12** |
| Backend Modules | **14** |
| UI Components | **30+** |
| Implementation Phases | **6** (30 modules) |
| Team Members | **4** |
| Development Cycle | **3+ weeks** |
| Documentation Sections | **14** |
| Assessment Score | **8.5/10** |

---

## 14. Complete File Structure

```
ReliefMesh/
│
├── 📄 Root Files
│   ├── README.md                          # Project overview & quick start
│   ├── analysis-report.md                 # System analysis report (598 lines)
│   ├── claude-inst-for-update.md          # AI assistant instructions for v2
│   ├── start-dev.sh                       # Dev startup script
│   ├── sync.sh                            # Git commit/push helper
│   ├── .gitignore
│   ├── files.zip
│   └── ReliefMesh-backup-2026-06-20.zip    # Full backup
│
├── 📁 assets/
│   └── reference/
│       ├── basic-terminal-command.md
│       └── git_basic_command.md
│
├── 📁 backend/                            # Node.js + Express API (54 files)
│   ├── server.js                          # Express entry point
│   ├── package.json / package-lock.json
│   ├── jest.config.js
│   ├── .env / .env.example
│   │
│   ├── config/
│   │   ├── database.js                    # Mongoose connection + auto-seed
│   │   └── environment.js                 # Env vars with defaults
│   │
│   ├── middleware/
│   │   ├── authenticate.js                # JWT verification
│   │   ├── authorize.js                   # RBAC enforcement
│   │   ├── errorHandler.js               # Centralized error handler
│   │   └── upload.js                      # Multer config
│   │
│   ├── modules/                           # 14 feature modules
│   │   ├── alerts/                        # alertController.js, alertEngine.js, alertModel.js, alertRoutes.js, alert.test.js
│   │   ├── areas/                         # areaController.js, areaModel.js, areaRoutes.js, areaSeed.js
│   │   ├── auth/                          # authController.js, authModel.js, authRoutes.js, authValidation.js, auth.test.js
│   │   ├── distributions/                 # distributionController.js, distributionModel.js, distributionRoutes.js, distributionValidation.js, distribution.test.js
│   │   ├── feedback/                      # feedbackController.js, feedbackModel.js, feedbackRoutes.js, feedback.test.js
│   │   ├── households/                    # householdController.js, householdModel.js, householdRoutes.js, householdValidation.js, household.test.js
│   │   ├── inventory/                     # inventoryController.js, inventoryModel.js, inventoryRoutes.js, inventory.test.js
│   │   ├── need/                          # needController.js, needModel.js, needRoutes.js
│   │   ├── pledges/                       # pledgeController.js, pledgeModel.js, pledgeRoutes.js
│   │   ├── public/                        # publicController.js, publicModel.js, publicRoutes.js, publicSeed.js, public.test.js
│   │   ├── reliefRequests/                # reliefRequestController.js, reliefRequestModel.js, reliefRequestRoutes.js, reliefRequestValidation.js
│   │   ├── reports/                       # reportController.js, reportGenerator.js, reportRoutes.js, report.test.js
│   │   ├── sync/                          # syncController.js, syncRoutes.js, syncService.js, sync.test.js
│   │   └── upload/                        # uploadRoutes.js
│   │
│   ├── seeds/
│   │   ├── seed-v2.js                     # Comprehensive Feni data seed
│   │   └── fix-jurisdiction.js
│   │
│   ├── tests/
│   │   ├── helpers.js, setup.js, teardown.js
│   │   └── integration.test.js           # 405-line E2E test
│   │
│   ├── uploads/
│   └── utils/
│       ├── conflictResolver.js            # LWW sync conflict resolution
│       └── pdfGenerator.js               # PDF report generation
│
├── 📁 frontend/                           # React PWA (60+ files)
│   ├── index.html
│   ├── package.json / package-lock.json
│   ├── vite.config.js, postcss.config.js, tailwind.config.js
│   ├── .env / .gitignore
│   │
│   ├── dist/                              # Production build
│   ├── public/                            # Icons, manifest
│   │
│   └── src/
│       ├── main.jsx                       # App entry (React 18 + BrowserRouter)
│       ├── App.jsx                        # Route definitions (30+ routes)
│       │
│       ├── components/                    # Reusable UI
│       │   ├── common/                    # Button, Card, ErrorBoundary, Loading
│       │   ├── forms/                     # InputField, PhotoCapture, SelectField
│       │   ├── layout/                    # Header, Layout, Sidebar, SyncStatus, Topbar
│       │   ├── maps/                      # HeatmapLayer, MapView, UnionMarker
│       │   └── ui/                        # Badge, Icon, Input, Modal, Pagination, Spinner, Toast
│       │
│       ├── constants/
│       │   └── navItems.js                # Nav items with role-based visibility
│       │
│       ├── hooks/                         # useAuth, useOffline, useSync
│       │
│       ├── modules/                       # Feature pages
│       │   ├── admin/
│       │   ├── auth/                      # Login, Register
│       │   ├── dashboard/                 # Dashboard, PublicDashboard
│       │   ├── distributions/
│       │   ├── feedback/
│       │   ├── households/
│       │   ├── landing/                   # LandingPage, OverviewPage
│       │   ├── needs/                     # NeedDashboard
│       │   ├── pledges/
│       │   ├── profile/
│       │   ├── reliefRequests/
│       │   └── reports/
│       │
│       ├── services/                      # api.js (offline-aware), auth.js, offline.js
│       ├── styles/                        # tokens.css, index.css
│       └── utils/                         # formatters.js, geo.js, validators.js
│
├── 📁 diagrams/                           # 11 draw.io diagrams
│   ├── context-diagram.drawio
│   ├── level-1-dfd.drawio
│   ├── usecase-diagram.drawio
│   ├── class-diagram.drawio
│   ├── erd.drawio
│   ├── architecture-diagram.drawio
│   ├── activity-diagrams/
│   │   └── activity-relief-flow.drawio
│   └── sequence-diagrams/
│       ├── sequence-sd01.drawio
│       ├── sequence-sd02.drawio
│       ├── sequence-need-calculation.drawio
│       └── sequence-pledge-fulfillment.drawio
│
├── 📁 designs/                            # UI/UX assets
│   ├── result09-design-pattern.md         # Full design token system (340 lines)
│   ├── style-guide/colors.pdf
│   ├── mockups/                           # dashboard-mockup.png, login-mockup.png
│   └── wireframes/                        # dashboard-wireframe.png, login-wireframe.png
│
├── 📁 documentation/                      # 16 files — 14 SAD sections
│   ├── Section-3.1-project_initiation&Problem_definition.md
│   ├── Section-3.2-stakeholder_analysis.md
│   ├── Section-3.3-requirements_engineering_SRS.md
│   ├── Section-3.4-system_modeling_DFD_UML.md
│   ├── Section-3.5-database_design_ERD.md
│   ├── Section-3.6-architecture_and_tech_stack.md
│   ├── Section-3.7-UI_UX_design.md
│   ├── Section-3.8-implementation_plan.md
│   ├── Section-3.9-testing_and_QA.md
│   ├── Section-3.10-security_and_access_control.md
│   ├── Section-3.11-deployment_and_maintenance.md
│   ├── Section-3.12-project_management.md
│   ├── Section-3.13-references_and_bibliography.md
│   ├── Section-3.14-presentation_and_defense.md
│   ├── data-flow-diagrams.md              # Supplementary DFD (226 lines)
│   ├── feni-floods.txt / feni-floods-before-after.jpeg
│   ├── ReliefMesh-v2-Update-Plan.md        # v2 update plan (663 lines)
│   └── test-credentials.md
│
├── 📁 plan-executions/                    # 7 execution plans
│   ├── 00-MASTER-PLAN.md
│   ├── phase1-data-model.md
│   ├── phase2-need-engine.md
│   ├── phase3-pledge-module.md
│   ├── phase4-public-map.md
│   ├── phase5-testing.md
│   └── phase6-documentation-sync.md
│
├── 📁 reports/                            # Project management artifacts
│   ├── meeting-minutes/                   # 4 meetings (May 27 — Jun 9)
│   │   ├── 2026-05-27-team-kickoff.md
│   │   ├── 2026-06-01-team-sync.md
│   │   ├── 2026-06-05-team-review.md
│   │   └── 2026-06-09-team-wrap.md
│   └── weekly-progress/                   # 3 weekly reports
│       ├── week-01.md
│       ├── week-02.md
│       └── week-03.md
│
└── 📁 submission/                         # Final deliverables
    ├── demo-video/demo.mp4
    ├── individual-contributions/
    │   ├── abidul-islam.md
    │   ├── kamrul-hassan.md
    │   ├── nahid.md
    │   └── sayeda-ahmed.md
    ├── presentation-slides/
    │   └── ReliefMesh-defense.pptx
    └── report-latex-code/
        ├── ReliefMesh-report.tex / .pdf
        └── figures/rmstu-logo.png
```

---

*Generated on: 2026-07-06 | ReliefMesh — CSE 3208 System Analysis & Design Lab | RMSTU*
