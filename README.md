# RelifMesh — Disaster Relief Coordination System for Local Government

> *"One mesh. No duplicates. No household left behind."*

**Course:** CSE-3208 System Analysis & Design Lab 
**Team:** Team_Skipper | **Project:** #6 ReliefMesh 
**Supervisor:** MD Mynoddin, Assistant Professor, RMSTU

---

## Team

| ID | Name | Role |
|----|------|------|
| 2101011001 | Abidul Islam | System Analyst / QA Tester |
| 2101011005 | MD. Kamrul Hassan | Project Manager / Developer |
| 2101011013 | Sayeda Mofatteha Ahmed | UI/UX Designer |
| 2101011038 | Iftekhar Alam Nahid | UI/UX Designer |

---

## Problem

During floods and cyclones in Bangladesh, relief distribution suffers from:
- **Duplicate aid** — same household served multiple times
- **Missed households** — vulnerable families skipped
- **No real-time tracking** — paper-based logs, late consolidation
- **Inter-agency opacity** — NGOs and government teams operate independently

RelifMesh solves this with an offline-first platform for Union Parishad officials, NGO workers, and Upazila officers to jointly register households, log item-level distributions, prevent duplicates, and expose a public transparency dashboard.

---

## Project Structure

```
RelifMesh/
│
├── frontend/        # React PWA (Vite + Tailwind + localforage)
│  ├── public/       # Static assets, manifest, icons
│  └── src/
│    ├── pages/     # Route-level page components
│    ├── components/   # Reusable UI components
│    ├── services/    # API client, auth, offline sync
│    ├── hooks/     # Custom React hooks
│    ├── store/     # State management
│    ├── utils/     # Helper functions
│    └── styles/     # Global styles
│
├── backend/        # Node.js + Express REST API
│  ├── src/
│  │  ├── routes/     # API route definitions
│  │  ├── controllers/  # Business logic
│  │  ├── models/     # Database queries
│  │  ├── middleware/   # Auth, validation, error handling
│  │  ├── utils/     # Helpers (duplicate check, PDF gen)
│  │  ├── db/       # Migrations and seeds
│  │  └── config/     # Environment config
│  └── tests/       # Jest test files
│
├── documentation/     # 14 SAD module deliverables
│  ├── Section-3.1-...
│  ├── Section-3.2-...
│  └── ... (13 more)
│
├── diagrams/        # draw.io / UML / ERD files
│  ├── sequence-diagrams/
│  └── activity-diagrams/
│
├── designs/        # Figma exports
│  ├── wireframes/
│  ├── mockups/
│  └── style-guide/
│
├── reports/        # PM artifacts
│  ├── meeting-minutes/
│  └── weekly-progress/
│
├── submission/       # Final deliverables
│  ├── demo-video/
│  ├── presentation-slides/
│  └── individual-contributions/
│
├── assets/         # Shared media
├── .env.example      # Environment variable template
└── .gitignore
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/v1/health` | No | Health check |
| POST | `/v1/auth/login` | No | Login, returns JWT |
| POST | `/v1/auth/register` | Upazila Officer | Create user account |
| GET | `/v1/households` | Yes | List households (filtered by jurisdiction) |
| GET | `/v1/households/search?q=` | Yes | Search by name or NID |
| POST | `/v1/households` | UP Official | Register household |
| GET | `/v1/households/:id` | Yes | Get household details |
| PUT | `/v1/households/:id` | UP Official | Update household |
| GET | `/v1/distributions` | Yes | List distribution logs |
| POST | `/v1/distributions` | UP/NGO | Log distribution |
| GET | `/v1/distributions/duplicate-check` | Yes | Check duplicates before logging |
| GET | `/v1/alerts` | Yes | List duplicate alerts |
| PUT | `/v1/alerts/:id/resolve` | Yes | Resolve an alert |
| GET | `/v1/reports/export` | Upazila Officer | Export CSV/PDF report |
| GET | `/v1/public/dashboard` | No | Public aggregated stats |
| GET | `/v1/public/map` | No | Public map data |
| POST | `/v1/sync/push` | Yes | Push offline records |
| GET | `/v1/sync/pull` | Yes | Pull new records |

All protected endpoints use `Authorization: Bearer <token>` header.

---

## Quick Start

```bash
# Backend
cd backend
cp ../.env.example .env  # fill in your values
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

---

## Deliverables Status

| Module | Document | Status |
|--------|----------|--------|
| 3.1 | Project Initiation & Problem Definition | [x] Complete |
| 3.2 | Stakeholder Analysis | [x] Complete |
| 3.3 | Requirements Engineering (SRS) | [x] Complete |
| 3.4 | System Modeling (DFD & UML) | [x] Complete |
| 3.5 | Database Design (ERD) | [x] Complete |
| 3.6 | Architecture & Tech Stack | [x] Complete |
| 3.7 | UI/UX Design | [x] Complete |
| 3.8 | Implementation Plan | [x] Complete |
| 3.9 | Testing & QA | [x] Complete |
| 3.10 | Security & Access Control | [x] Complete |
| 3.11 | Deployment & Maintenance | [x] Complete |
| 3.12 | Project Management | [x] Complete |
| 3.13 | References & Bibliography | [x] Complete |
| 3.14 | Presentation & Defense | [x] Complete |
| **Prototype** | Frontend + Backend code | >> In Progress |
