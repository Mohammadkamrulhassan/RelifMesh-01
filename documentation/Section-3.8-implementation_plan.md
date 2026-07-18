# Section 3.8 — Implementation Plan
**Project:** ReliefMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09

---

## 3.8.1 Module Breakdown with Owners & Deadlines

### Phase 1 Modules (Core — Semester 1) — Implemented

| # | Module | Owner | Deadline (Week) | Status |
|:--|--------|-------|:---------------:|:------:|
| M1 | Project setup (repo, folder structure, tooling) | Kamrul | Week 1 | [x] |
| M2 | MongoDB schemas + Mongoose models | Kamrul | Week 2 | [x] |
| M3 | Authentication API (register, login, JWT) | Kamrul | Week 3 | [x] |
| M4 | Household registration API + frontend form | Kamrul (API), Sayeda (UI) | Week 4 | [x] |
| M5 | Offline support — IndexedDB (localforage) | Kamrul | Week 5 | [x] |
| M6 | Distribution log API + frontend form | Kamrul (API), Sayeda (UI) | Week 6 | [x] |
| M7 | Duplicate detection engine | Kamrul | Week 7 | [x] |
| M8 | Duplicate alert UI + override flow | Sayeda, Nahid | Week 8 | [x] |
| M9 | Sync engine (push/pull API) + conflict log | Kamrul | Week 9 | [x] |
| M10 | Upazila Officer dashboard + jurisdiction filter | Sayeda | Week 10 | [x] |
| M11 | Public dashboard + map view | Nahid | Week 11 | [x] |
| M12 | Report export (PDF/CSV) | Kamrul | Week 12 | [x] |
| M13 | Testing (unit + integration + UAT) | Abidul | Week 13–14 | [x] |
| M14 | Bug fixes + final polish | All | Week 15 | [~] |
| M15 | Demo video + presentation prep | Nahid, Abid | Week 16 | [ ] |
| M16 | Feedback module (model, API, form, list, tests) | Kamrul (API), Sayeda (UI) | Week 14 | [x] |
| M17 | Inventory/stock tracking module (model, API, tests) | Kamrul | Week 15 | [x] |
| M18 | User profile management (API + frontend page) | Kamrul (API), Nahid (UI) | Week 15 | [x] |
| M19 | Pagination + search across list views | Kamrul | Week 15 | [x] |
| M20 | Enhanced dashboard (feedback stats, alerts, recent logs) | Kamrul | Week 15 | [x] |

### 3.8.1.1 Phase 2 Modules (v2 Features) — Planned

| # | Module | Owner | Est. Duration | Priority |
|:--|--------|-------|:-------------:|:--------:|
| M21 | GeographicArea model + boundary API (ward-level hierarchy) | Kamrul | 1 week | High |
| M22 | ItemCategory update — add per_person_per_day_qty field | Kamrul | 0.5 week | High |
| M23 | Household update — add children_0_5, over_60 age-bracket fields | Kamrul | 0.5 week | High |
| M24 | Need calculation engine (demographics × Sphere rates) + API | Kamrul | 1.5 weeks | High |
| M25 | Need dashboard UI (ward-level calculations, override modal) | Sayeda, Nahid | 1.5 weeks | High |
| M26 | Pledge model + CRUD API (source_type, status lifecycle) | Kamrul | 1 week | High |
| M27 | Pledge UI — declaration form, status tracking, pledge list | Sayeda | 1 week | High |
| M28 | Heatmap rendering (leaflet.heat layer on public + admin maps) | Nahid | 1.5 weeks | High |
| M29 | Pledge–Distribution linking (pledge_id FK in distro logs) | Kamrul | 0.5 week | Medium |
| M30 | DistributionLog update — auto-update pledge remaining_qty on distro save | Kamrul | 0.5 week | Medium |
| M31 | End-to-end testing for need calculation and pledge flow | Abidul | 1 week | High |
| M32 | Volunteer registration + pledge-matching notifications | All | 2 weeks | Medium |

| # | Module | Owner | Deadline (Week) | Status |
|---|--------|-------|-----------------|--------|
| M1 | Project setup (repo, folder structure, tooling) | Kamrul | Week 1 | [x] |
| M2 | MongoDB schemas + Mongoose models | Kamrul | Week 2 | [x] |
| M3 | Authentication API (register, login, JWT) | Kamrul | Week 3 | [x] |
| M4 | Household registration API + frontend form | Kamrul (API), Sayeda (UI) | Week 4 | [x] |
| M5 | Offline support — IndexedDB (localforage) | Kamrul | Week 5 | [x] |
| M6 | Distribution log API + frontend form | Kamrul (API), Sayeda (UI) | Week 6 | [x] |
| M7 | Duplicate detection engine | Kamrul | Week 7 | [x] |
| M8 | Duplicate alert UI + override flow | Sayeda, Nahid | Week 8 | [x] |
| M9 | Sync engine (push/pull API) + conflict log | Kamrul | Week 9 | [x] |
| M10 | Upazila Officer dashboard + jurisdiction filter | Sayeda | Week 10 | [x] |
| M11 | Public dashboard + map view | Nahid | Week 11 | [x] |
| M12 | Report export (PDF/CSV) | Kamrul | Week 12 | [x] |
| M13 | Testing (unit + integration + UAT) | Abidul | Week 13–14 | [x] (36 test cases implemented across 10 suites) |
| M14 | Bug fixes + final polish | All | Week 15 | [~] (in progress) |
| M15 | Demo video + presentation prep | Nahid, Abid | Week 16 | [ ] |
| M16 | Feedback module (model, API, form, list, tests) | Kamrul (API), Sayeda (UI) | Week 14 | [x] |
| M17 | Inventory/stock tracking module (model, API, tests) | Kamrul | Week 15 | [x] |
| M18 | User profile management (API + frontend page) | Kamrul (API), Nahid (UI) | Week 15 | [x] |
| M19 | Pagination + search across list views | Kamrul | Week 15 | [x] |
| M20 | Enhanced dashboard (feedback stats, alerts, recent logs) | Kamrul | Week 15 | [x] |

---

## 3.8.2 Gantt Chart

### Phase 1 (Weeks 1–16)

```
Week │ 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
──────┼────────────────────────────────────────────────
M1  │ ██
M2  │  ██
M3  │    ██
M4  │     ██
M5  │       ██
M6  │        ██
M7  │          ██
M8  │           ██
M9  │             ██
M10  │              ██
M11  │                ██
M12  │                 ██
M13  │                   ████
M14  │                     ██
M15  │                      ██
Docs │ ████████████████████████████████████████████████ (ongoing)
```

### Phase 2 (v2 Features — Planned, Post-Semester 1)

```
Week │ 1 2 3 4 5 6 7 8 9 10
──────┼──────────────────────────────────
M21  │ ██
M22  │  █
M23  │  █
M24  │   ███
M25  │     ███
M26  │        ██
M27  │         ██
M28  │          ███
M29  │              █
M30  │              █
M31  │               ██
M32  │                ████
Docs  │ ████████████████████ (ongoing)
```

---

## 3.8.3 Development Environment Setup

### Prerequisites
```
Node.js >= 20.x LTS   (https://nodejs.org)
npm   >= 10.x
MongoDB >= 8.x        (or use MongoDB Atlas free tier)
Git   >= 2.40
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/Team-Skipper/reliefmesh.git
cd reliefmesh

# Backend setup
cd backend
cp ../.env.example .env     # fill in DB credentials, JWT secret
npm install

# Ensure MongoDB is running, then seed test data
npm run seed

# Start development server
npm run dev

# Frontend setup (separate terminal)
cd ../frontend
npm install
npm run dev          # starts Vite dev server at localhost:5173
```

### Environment Variables (`.env`)
```
# Database
MONGODB_URI=mongodb://localhost:27017/reliefmesh

# Auth
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
PORT=3000
NODE_ENV=development
```

---

## 3.8.4 Coding Standards & Conventions

### General
- Language: JavaScript (ES2022+) — no TypeScript for prototype (team familiarity)
- Linter: ESLint with Airbnb config
- Formatter: Prettier (2-space indent, single quotes, no semicolons)
- All async operations use `async/await` — no raw `.then()` chains

### Naming Conventions
| Element | Convention | Example |
|---------|-----------|---------|
| Files | kebab-case | `household-controller.js` |
| Functions | camelCase | `getHouseholdById()` |
| React components | PascalCase | `DistributionForm.jsx` |
| DB columns | snake_case | `family_size` |
| Constants | UPPER_SNAKE | `SYNC_STATUS` |
| API routes | kebab-case | `/distribution-logs` |

### File Structure (Backend — Module-Based)
```
backend/
├── config/           ← DB, env config
├── db/
│   ├── status.js     ← database health check
│   ├── update.js     ← create missing collections
│   └── seeds/        ← test data seeder
├── middleware/        ← shared auth, error handler
├── utils/            ← shared helpers
├── modules/
│   ├── auth/         ← controller, routes, model, validation, tests
│   ├── households/   ← controller, routes, model, validation, tests
│   ├── distributions/← controller, routes, model, validation, tests
│   ├── alerts/       ← controller, routes, model, engine, tests
│   ├── reports/      ← controller, routes, generator, tests
│   ├── public/       ← controller, routes, model, tests
│   ├── sync/         ← controller, routes, service, tests
│   ├── feedback/     ← controller, routes, model, tests
│   ├── inventory/    ← controller, routes, model, tests
│   ├── areas/        ← controller, routes, model (GeographicArea), tests (v2)
│   ├── need/         ← controller, routes, engine (NeedCalculation), tests (v2)
│   └── pledges/      ← controller, routes, model, tests (v2)
├── server.js         ← app entry point
└── package.json
```

### Error Handling
- All controllers wrapped in `try/catch`
- Centralized error middleware returns: `{ error: true, message: "...", code: 4xx/5xx }`
- Never expose stack traces in production responses

---

## 3.8.5 Git Branching Strategy

### Branch Structure
```
main      ← production-ready code only; protected branch
 └── develop ← integration branch; all features merge here
    ├── feature/household-registration
    ├── feature/distribution-log
    ├── feature/duplicate-detection
    ├── feature/offline-sync
    ├── feature/public-dashboard
    └── fix/sync-conflict-resolution
```

### Rules
- Never commit directly to `main`
- Feature branches named: `feature/<short-description>` or `fix/<short-description>`
- Pull Requests require at least 1 reviewer approval before merging to `develop`
- Commit messages: `[type]: short description` — e.g., `feat: add household GPS capture`, `fix: duplicate check threshold`, `docs: update SRS`
- Commit daily — even partial work-in-progress

### Commit Types
| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation update |
| `style` | Formatting, no logic change |
| `test` | Adding or fixing tests |
| `chore` | Build, tooling, config |

---

*End of Section 3.8 — Next: Section 3.9 Testing & QA*
