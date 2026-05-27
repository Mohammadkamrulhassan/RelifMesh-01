# Section 3.8 — Implementation Plan
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27

---

## 3.8.1 Module Breakdown with Owners & Deadlines

| # | Module | Owner | Deadline (Week) | Status |
|---|--------|-------|-----------------|--------|
| M1 | Project setup (repo, folder structure, tooling) | Kamrul | Week 1 | [ ] |
| M2 | MongoDB schemas + Mongoose models | Kamrul | Week 2 | [ ] |
| M3 | Authentication API (register, login, JWT) | Kamrul | Week 3 | [ ] |
| M4 | Household registration API + frontend form | Kamrul (API), Sayeda (UI) | Week 4 | [ ] |
| M5 | Offline support — IndexedDB (localforage) | Kamrul | Week 5 | [ ] |
| M6 | Distribution log API + frontend form | Kamrul (API), Sayeda (UI) | Week 6 | [ ] |
| M7 | Duplicate detection engine | Kamrul | Week 7 | [ ] |
| M8 | Duplicate alert UI + override flow | Sayeda, Nahid | Week 8 | [ ] |
| M9 | Sync engine (push/pull API) + conflict log | Kamrul | Week 9 | [ ] |
| M10 | Upazila Officer dashboard + jurisdiction filter | Sayeda | Week 10 | [ ] |
| M11 | Public dashboard + map view | Nahid | Week 11 | [ ] |
| M12 | Report export (PDF/CSV) | Kamrul | Week 12 | [ ] |
| M13 | Testing (unit + integration + UAT) | Abidul | Week 13–14 | [ ] |
| M14 | Bug fixes + final polish | All | Week 15 | [ ] |
| M15 | Demo video + presentation prep | Nahid, Abid | Week 16 | [ ] |

---

## 3.8.2 Gantt Chart

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
git clone https://github.com/Team-Skipper/relifmesh.git
cd relifmesh

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
MONGODB_URI=mongodb://localhost:27017/relifmesh

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
│   └── sync/         ← controller, routes, service, tests
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
