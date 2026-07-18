# ReliefMesh — Disaster Relief Coordination System for Local Government

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

ReliefMesh solves this with an offline-first platform for Union Parishad officials, NGO workers, and Upazila officers to jointly register households, log item-level distributions, prevent duplicates, and expose a public transparency dashboard.

---

## Key Features

- **Household Registration** — GPS + photo + vulnerability flags, works offline
- **Distribution Logging** — item-level tracking with duplicate detection
- **Duplicate Alert Engine** — flags same household + same item within 7 days
- **Offline-First Sync** — localforage queue + auto-sync on reconnect
- **Role-Based Access** — UP Official, NGO Worker, Upazila Officer
- **Public Dashboard** — aggregated distribution stats + map (no login)
- **Feedback System** — public submissions, Upazila Officer management
- **Inventory Tracking** — stock levels per item category
- **User Profiles** — view/edit name and organization
- **Pagination & Search** — paginated lists with live search across modules

---

## Project Structure

```
ReliefMesh/
│
├── frontend/        # React PWA (Vite + Tailwind + localforage)
│  ├── public/       # Static assets, manifest, icons
│  └── src/
│    ├── modules/    # Per-feature page components
│    ├── components/ # Reusable UI components
│    ├── services/   # API client, auth, offline sync
│    ├── hooks/      # Custom React hooks
│    ├── constants/  # Nav items, enums
│    ├── utils/      # Formatters, validators
│    └── styles/     # Global styles
│
├── backend/        # Node.js + Express REST API
│  ├── modules/     # Feature modules (auth, households, distributions, etc.)
│  ├── middleware/   # Auth, validation, error handling
│  ├── config/      # Environment config
│  ├── db/          # Migrations and seeds
│  └── tests/       # Helpers
│
├── documentation/  # 14 SAD module deliverables (Sections 3.1–3.14)
├── diagrams/       # draw.io / UML / ERD files
├── designs/        # Figma exports (wireframes, mockups)
├── reports/        # PM artifacts (meeting minutes, weekly progress)
├── submission/     # Final deliverables (demo video, slides)
└── assets/         # Shared media
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/v1/health` | No | Health check |
| POST | `/v1/auth/login` | No | Login, returns JWT |
| POST | `/v1/auth/register` | Upazila Officer | Create user account |
| GET | `/v1/auth/profile` | Yes | Get profile |
| PUT | `/v1/auth/profile` | Yes | Update profile |
| GET | `/v1/auth/users` | Yes | List users |
| GET | `/v1/households` | Yes | List households (paginated, searchable) |
| POST | `/v1/households` | UP Official | Register household |
| GET | `/v1/households/:id` | Yes | Get household details |
| PUT | `/v1/households/:id` | UP Official | Update household |
| GET | `/v1/distributions` | Yes | List distributions (paginated, filterable) |
| POST | `/v1/distributions` | UP/NGO | Log distribution |
| GET | `/v1/alerts` | Yes | List duplicate alerts |
| PUT | `/v1/alerts/:id/resolve` | Yes | Resolve an alert |
| GET | `/v1/reports/export` | Upazila Officer | Export CSV/PDF |
| GET | `/v1/public/dashboard` | No | Public aggregated stats |
| GET | `/v1/public/admin-dashboard` | Yes | Enhanced dashboard |
| GET | `/v1/public/map` | No | Public map data |
| POST | `/v1/sync/push` | Yes | Push offline records |
| GET | `/v1/sync/pull` | Yes | Pull new records |
| POST | `/v1/feedback` | No | Submit feedback |
| GET | `/v1/feedback` | Yes | List feedback entries |
| PUT | `/v1/feedback/:id/respond` | Yes | Respond to feedback |
| GET | `/v1/inventory` | Yes | List inventory items |
| POST | `/v1/inventory` | Upazila Officer | Create inventory item |
| PUT | `/v1/inventory/:id` | Upazila Officer | Update inventory item |
| POST | `/v1/uploads/image` | Yes | Upload photo (multipart, 5MB, image only) |

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
| **Prototype** | Frontend + Backend code | [x] Complete (v2.0) |
